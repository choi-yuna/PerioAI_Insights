import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UploadContext } from '../context/UploadContext';

// 이미지 import
import normalImage from '../assets/images/normal.png';
import missingImage from '../assets/images/missing.png';
import implantImage from '../assets/images/implant.png';
import bridgeImage from '../assets/images/bridge.png';

const toothImages = {
  "1": normalImage,    // 정상
  "2": missingImage,   // 상실
  "3": implantImage,   // 임플란트
  "4": bridgeImage,    // 브릿지
  "5": normalImage     // 기타
};

const ToothChart = () => {
  const { uploadedFiles, selectedFile } = useContext(UploadContext); // 선택된 이미지 파일을 가져옴
  const [annotationData, setAnnotationData] = useState(null);

  // 선택된 이미지 파일 이름을 기반으로 JSON 파일 찾기
  useEffect(() => {
    if (selectedFile && uploadedFiles.length > 0) {
      const selectedFileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // 확장자 제거

      // 선택한 이미지와 이름이 같은 JSON 파일 찾기
      const jsonFile = uploadedFiles.find(file => 
        file.name.endsWith('.json') && file.name.includes(selectedFileName)
      );

      if (jsonFile && jsonFile.file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const parsedData = JSON.parse(event.target.result);
            setAnnotationData(parsedData.Annotation_Data[0]);
          } catch (err) {
            console.error("Error parsing JSON file:", err);
          }
        };
        reader.readAsText(jsonFile.file);
      }
    }
  }, [selectedFile, uploadedFiles]);

  if (!annotationData) {
    return <p>Loading data...</p>;
  }

  // 상악(위턱) 치아 번호 리스트
  const upperTeeth = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28
  ];

  // 하악(아래턱) 치아 번호 리스트
  const lowerTeeth = [
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38
  ];

  return (
    <Container>
      <Title>Tooth Chart</Title>

      {/* 상악 차트 */}
      <ToothRow>
        {upperTeeth.map(toothNumber => (
          <ToothIcon key={toothNumber}>
            <ToothImageWrapper>
              <ToothImage
                src={toothImages[annotationData[toothNumber.toString()]] || toothImages['1']}
                alt={`Tooth ${toothNumber}`}
                borderColor={getBorderColor(annotationData[toothNumber.toString()])}
              />
              <ToothNumber>{toothNumber}</ToothNumber>
            </ToothImageWrapper>
          </ToothIcon>
        ))}
      </ToothRow>

      {/* 하악 차트 */}
      <ToothRow>
        {lowerTeeth.map(toothNumber => (
          <ToothIcon key={toothNumber}>
            <ToothImageWrapper>
              <ToothImage
                src={toothImages[annotationData[toothNumber.toString()]] || toothImages['1']}
                alt={`Tooth ${toothNumber}`}
                borderColor={getBorderColor(annotationData[toothNumber.toString()])}
              />
              <ToothNumber>{toothNumber}</ToothNumber>
            </ToothImageWrapper>
          </ToothIcon>
        ))}
      </ToothRow>
    </Container>
  );
};

// 질환 번호에 따른 테두리 색상
const getBorderColor = (status) => {
  switch (status) {
    case "1": return "#000000"; // 정상 
    case "2": return "#FF0000"; // 상실 
    case "3": return "#0000FF"; // 임플란트
    case "4": return "#FFA500"; // 브릿지 
    case "5": return "#FFFF00"; // 기타 
    default: return "#ccc";     // 기본 테두리
  }
};

export default ToothChart;

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f5fbff;
  border-radius: 20px; 
  border: 3px solid #d4d4d4;
`;

const Title = styled.h1`
  display: flex;
  font-size: 28px;
  margin-bottom: 20px;
  margin-left: 10px;
  color: #0d1e29;
  align-self: flex-start;
`;

const ToothRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ToothIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
`;

const ToothImageWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 70px;
`;

const ToothImage = styled.img`
  width: 70%;
  height: 70%;
  border: 2px solid ${props => props.borderColor}; 
  padding: 10px;
  border-radius: 5px;

  &:hover {
    border-color: #1a73e8;
    background-color: #dff2ff;
  }
`;

const ToothNumber = styled.div`
  position: absolute;
  bottom: -30px; 
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2em;
  font-weight: bold;
  color: #000000; 
  padding: 2px 5px;
  border-radius: 3px;
`;
