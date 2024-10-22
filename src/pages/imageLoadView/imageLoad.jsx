import React, { useContext, useRef, useState, useEffect } from "react";
import styled from 'styled-components';
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { UploadContext } from '../../context/UploadContext'; // UploadContext 가져오기

// cornerstone 및 wado-image-loader 설정
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser; // dicomParser 연결
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Accept', 'multipart/related; type="application/dicom"');
  }
});

function DicomViewer() {
  const { uploadedFiles } = useContext(UploadContext); // 업로드된 파일 리스트 가져오기
  const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태
  const dicomElementRef = useRef(null);

  // 요소 활성화 (useEffect에서 초기화)
  useEffect(() => {
    if (dicomElementRef.current) {
      cornerstone.enable(dicomElementRef.current); // cornerstone 요소 활성화
    }
    return () => {
      if (dicomElementRef.current) {
        cornerstone.disable(dicomElementRef.current); // 컴포넌트 언마운트 시 cornerstone 비활성화
      }
    };
  }, []);

  // DICOM 파일을 선택하여 시각화하는 함수
  const loadDicomImage = async (file) => {
    setErrorMessage(null); // 에러 메시지 초기화
    const fileUrl = URL.createObjectURL(file); // Blob URL 생성
    const imageId = `wadouri:${fileUrl}`; // cornerstoneWADOImageLoader에서 사용할 이미지 ID 생성

    try {
      const element = dicomElementRef.current;
      const image = await cornerstone.loadImage(imageId); // DICOM 이미지 로드
      cornerstone.displayImage(element, image); // 이미지 표시
      cornerstone.reset(element); // 초기 상태로 리셋
    } catch (error) {
      console.error("Error loading DICOM image:", error);
      setErrorMessage("DICOM 파일을 불러오지 못했습니다."); // 에러 메시지 설정
    }
  };

  // .dcm 파일만 필터링
  const dicomFiles = uploadedFiles.filter(file => file.name.endsWith('.dcm'));

  return (
    <Container>
      <FileListContainer>
        <h2>File List</h2>

        {/* DICOM 파일 리스트 */}
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

      {/* 선택된 DICOM 파일 뷰 */}
      <DicomViewerContainer>
        <h2>영상 View</h2>
        <DicomElement ref={dicomElementRef} />
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
   margin-left: 270px; 
`;

const FileListContainer = styled.div`
  flex: 1;
`;

const FileList = styled.ul`
  padding: 10px;
  background: #333;
  width: 200px;
  color: #fff;
  height: 80vh;
  overflow-y: scroll;
`;

const FileItem = styled.li`
  cursor: pointer;
  padding: 5px;
  background-color: #444;
  margin-bottom: 5px;

  &:hover {
    background-color: #555;
  }
`;

const DicomViewerContainer = styled.div`
  flex: 2;
  margin-left: 20px;
  text-align: center;
`;

const DicomElement = styled.div`
  width: 100%;
  height: 90%;
  background: black;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ErrorMessage = styled.p`
  color: red;
`;

