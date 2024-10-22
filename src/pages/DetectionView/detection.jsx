import React, { useContext, useRef, useState, useEffect } from "react";
import styled from 'styled-components';
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { UploadContext } from '../../context/UploadContext';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Accept', 'multipart/related; type="application/dicom"');
  }
});

function DicomViewer() {
  const { uploadedFiles } = useContext(UploadContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const dicomElementRef = useRef(null);
  const canvasRef = useRef(null); // 캔버스 참조 추가

  useEffect(() => {
    if (dicomElementRef.current) {
      cornerstone.enable(dicomElementRef.current);
    }
    return () => {
      if (dicomElementRef.current) {
        cornerstone.disable(dicomElementRef.current);
      }
    };
  }, []);

  const loadDicomImage = async (fileObj) => {
    const file = fileObj.file;

    if (!file) {
      console.error("File is undefined or invalid.");
      setErrorMessage("유효하지 않은 파일입니다.");
      return;
    }

    setErrorMessage(null);
    const fileUrl = URL.createObjectURL(file);
    const imageId = `wadouri:${fileUrl}`;

    try {
      const element = dicomElementRef.current;

      // DICOM 이미지 로드
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(element, image);
      cornerstone.reset(element);

      const { width, height } = image;
      element.width = width; // DICOM 캔버스 너비 설정
      element.height = height; // DICOM 캔버스 높이 설정

      // 캔버스 크기 설정
      const canvas = canvasRef.current;
      canvas.width = width; // 캔버스의 너비
      canvas.height = height; // 캔버스의 높이

      // PNG 파일 경로 가져오기
      const pngFileName = file.name.replace('.dcm', '.png');
      const pngFile = uploadedFiles.find(uploadedFile => uploadedFile.name === pngFileName);

      if (pngFile) {
        const pngFileUrl = URL.createObjectURL(pngFile.file);
        const pngImage = new Image();
        pngImage.src = pngFileUrl;

        pngImage.onload = () => {
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
          
          // DICOM 이미지와 PNG 이미지를 같은 캔버스에 그리기
          const scaleX = width / pngImage.width;
const scaleY = height / pngImage.height;
context.drawImage(pngImage, 0, 0, pngImage.width * scaleX, pngImage.height * scaleY); // 비율에 맞춰 그리기
console.log("DICOM Size:", width, height);
console.log("Overlay Size:", pngImage.width, pngImage.height);

        };

        pngImage.onerror = () => {
          console.error("Error loading PNG image at", pngFileUrl);
          setErrorMessage("PNG 파일을 불러오지 못했습니다.");
        };
      } else {
        console.error("PNG file not found for", pngFileName);
        setErrorMessage("PNG 파일을 찾을 수 없습니다.");
      }

    } catch (error) {
      console.error("Error loading DICOM image:", error);
      setErrorMessage("DICOM 파일을 불러오지 못했습니다.");
    }
  };

  const dicomFiles = uploadedFiles.filter(file => file.name.endsWith('.dcm'));

  return (
    <Container>
      <FileListContainer>
        <FileListTitle>파일 리스트</FileListTitle>
        {dicomFiles.length > 0 ? (
          <FileList>
            {dicomFiles.map((file, index) => (
              <FileItem key={index} onClick={() => loadDicomImage(file)}>
                {file.name}
              </FileItem>
            ))}
          </FileList>
        ) : (
          <p>No DICOM files found.</p>
        )}
      </FileListContainer>

      <DicomViewerContainer>
        <h2>영상 View</h2>
        <ViewerContainer>
          <DicomElement ref={dicomElementRef} />
          <Canvas ref={canvasRef} /> {/* 오버레이를 위한 캔버스 추가 */}
        </ViewerContainer>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </DicomViewerContainer>
    </Container>
  );
}

export default DicomViewer;

// styled-components를 사용하여 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  height: 90vh;
  margin-left: 300px; 
`;

const FileListContainer = styled.div`
  margin-right: 20px; /* 이미지 뷰와의 간격 */
  margin-top: 70px;
`;

const FileListTitle = styled.h2`
  color: #ffffff; // 흰색 텍스트
  background: #222; // 어두운 배경
  padding: 10px;
  text-align: center;
  margin: 0;
  border-bottom: 2px solid #444;
  font-size: 10px; // 폰트 크기 증가
  font-weight: bold; // 폰트 두께 조정
`;

const FileList = styled.ul`
  padding: 10px;
  background: #333;
  width: 200px;
  color: #fff;
  height: 72vh;
  overflow-y: scroll;
`;

const FileItem = styled.li`
  cursor: pointer;
  padding: 5px;
  background-color: #444; // 아이템 배경색
  margin-bottom: 5px;
  color: #ffffff; // 흰색 텍스트

  &:hover {
    background-color: #555; // 호버 시 배경색 변화
  }
`;

const DicomViewerContainer = styled.div`
  flex: 2; /* 이미지 뷰의 크기 비율 */
  text-align: center;
`;

const ViewerContainer = styled.div`
  position: relative; /* 자식 요소를 절대 위치로 설정하기 위한 기준 */
  width: 100%;
  height: 90%;
`;

const DicomElement = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  margin: 20px auto;
`;

const Canvas = styled.canvas` // 오버레이를 위한 캔버스
  position: absolute; // DICOM 이미지 위에 위치
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; // DICOM 이미지와 동일한 크기
  background: transparent; /* 배경을 투명하게 설정 */
  pointer-events: none; // 클릭 이벤트를 DICOM 이미지에 전달
`;

const ErrorMessage = styled.p`
  color: red;
`;
