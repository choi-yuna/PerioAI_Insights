import React, { useContext, useRef, useState, useEffect } from "react";
import styled from 'styled-components';
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { UploadContext } from '../../context/UploadContext';

// cornerstone 및 wado-image-loader 설정
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Accept', 'multipart/related; type="application/dicom"');
  }
});

function DicomViewer() {
  const { uploadedFiles, handleFileSelect } = useContext(UploadContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const dicomElementRef = useRef(null);
  const [scale, setScale] = useState(1); // 이미지 확대/축소 비율 상태 추가

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

      handleFileSelect(file);
    } catch (error) {
      console.error("Error loading DICOM image:", error);
      setErrorMessage("DICOM 파일을 불러오지 못했습니다.");
    }
  };

  const dicomFiles = uploadedFiles.filter(file => file.name.endsWith('.dcm'));

  // 확대/축소 핸들러
  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1; // 휠의 방향에 따라 스케일 조정
    setScale((prevScale) => {
      const newScale = Math.max(0.1, prevScale + delta); // 최소 스케일 제한
      cornerstone.setViewport(dicomElementRef.current, {
        scale: newScale
      });
      return newScale;
    });
  };

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

      <DicomViewerContainer onWheel={handleWheel}>
        <h2>영상 View</h2>
        <DicomElement ref={dicomElementRef} />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </DicomViewerContainer>
    </Container>
  );
}

export default DicomViewer;

// styled-components 스타일 정의
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
  width: 200px; /* 고정 너비 */
`;

const FileListTitle = styled.h2`
  color: #ffffff; // 흰색 텍스트
  background: #222; // 어두운 배경
  padding: 10px;
  text-align: center;
  margin: 0;
  border-bottom: 2px solid #444;
  font-size: 14px; // 폰트 크기 증가
  font-weight: bold; // 폰트 두께 조정
`;

const FileList = styled.ul`
  padding: 10px;
  background: #333;
  color: #fff;
  height: 72vh;
  overflow-y: auto; /* 스크롤 가능하게 */
  border-radius: 5px; /* 모서리 둥글게 */
`;

const FileItem = styled.li`
  cursor: pointer;
  padding: 10px;
  background-color: #444; // 아이템 배경색
  margin-bottom: 5px;
  color: #ffffff; // 흰색 텍스트
  transition: background-color 0.3s; /* 부드러운 호버 효과 */

  &:hover {
    background-color: #555; // 호버 시 배경색 변화
  }
`;

const DicomViewerContainer = styled.div`
  flex: 2; /* 이미지 뷰의 크기 비율 */
  text-align: center;
  position: relative; /* DICOM 뷰어의 위치 조정 */
`;

const DicomElement = styled.div`
  width: 90%; /* 전체 너비 */
  height: 90%; /* 전체 높이 */
  background: black; 
  margin: 20px auto; /* 중앙 정렬 */
`;

const ErrorMessage = styled.p`
  color: red;
`;
