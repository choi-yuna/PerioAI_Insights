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
  const [selectedFileIndex, setSelectedFileIndex] = useState(null); // 선택한 파일 인덱스 상태 추가

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

  const loadDicomImage = async (fileObj, index) => {
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
      setSelectedFileIndex(index); // 선택한 파일 인덱스 업데이트
    } catch (error) {
      console.error("Error loading DICOM image:", error);
      setErrorMessage("DICOM 파일을 불러오지 못했습니다.");
    }
  };

  const dicomFiles = uploadedFiles.filter(file => file.name.endsWith('.dcm'));

  const handleSave = () => {
    // 저장 기능 구현
    console.log("Save functionality to be implemented");
  };

  const handleClose = () => {
    // 닫기 기능 구현
    console.log("Close functionality to be implemented");
  };

  const handleHelp = () => {
    // 도움말 기능 구현
    console.log("Help functionality to be implemented");
  };

  return (
    <Container>
      <FileListContainer>
        <FileListTitle>파일 리스트</FileListTitle>
        <FileList>
          {dicomFiles.length > 0 ? (
            dicomFiles.map((file, index) => (
              <FileItem
                key={index}
                onClick={() => loadDicomImage(file, index)}
                selected={selectedFileIndex === index} // 선택된 파일 확인
              >
                {file.name}
              </FileItem>
            ))
          ) : (
            <NoFilesMessage>파일이 존재하지 않습니다.</NoFilesMessage>
          )}
        </FileList>
      </FileListContainer>

      <DicomViewerContainer>
        <ButtonContainer>
          <ActionButton onClick={handleSave}>Save</ActionButton>
          <ActionButton onClick={handleClose}>Close</ActionButton>
          <ActionButton onClick={handleHelp}>영상제어 도움말</ActionButton>
        </ButtonContainer>
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
  margin-left: 15%; 
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
  margin-top: 40px; /* 아래쪽 마진 제거 */
  margin-bottom: 0px;
  border-bottom: 2px solid #444;
  font-size: 14px; // 폰트 크기 증가
  font-weight: bold; // 폰트 두께 조정
`;

const FileList = styled.ul`
  padding: 10px;
  background: #333;
  color: #fff;
  height: 83%;
  overflow-y: auto; /* 스크롤 가능하게 */
  border-radius: 5px; /* 모서리 둥글게 */
  font-size: 12px; // 폰트 크기 증가
  margin: 0; /* 모든 방향의 마진 제거 */
`;

const FileItem = styled.li`
  cursor: pointer;
  padding: 10px;
  background-color: ${({ selected }) => (selected ? '#555' : '#444')}; // 선택된 경우 색상 변경
  margin-bottom: 5px;
  color: #ffffff; // 흰색 텍스트
  transition: background-color 0.3s; /* 부드러운 호버 효과 */

  &:hover {
    background-color: #555; // 호버 시 배경색 변화
  }
`;

const NoFilesMessage = styled.p`
  color: #ffffff; // 흰색 텍스트
  text-align: center; // 중앙 정렬
`;

const DicomViewerContainer = styled.div`
  flex: 2; /* 이미지 뷰의 크기 비율 */
  text-align: center;
  position: relative; /* DICOM 뷰어의 위치 조정 */
  margin-top: 70px; /* 버튼과 뷰어 사이 여백 */
`;

const DicomElement = styled.div`
  width: 90%; /* 전체 너비 */
  height: 93%; /* 전체 높이 */
  background: black; 
  margin: 10px 15px; /* 중앙 정렬 */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽 정렬 */
  margin-bottom: 10px; /* 버튼과 영상 뷰 사이 여백 */
  margin-right : 9%;
`;

const ActionButton = styled.button`
  background: #3b82f6; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  padding: 5px 10px; /* 버튼 크기 조정 */
  margin: 0 5px; /* 버튼 간 간격 */
  cursor: pointer; /* 커서 포인터 변경 */

  &:hover {
    background: #2563eb; /* 호버 시 색상 변경 */
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;
