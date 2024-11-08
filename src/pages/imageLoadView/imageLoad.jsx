import React, { useContext, useRef, useState, useEffect } from "react";
import styled from 'styled-components';
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { UploadContext } from '../../context/UploadContext';

// cornerstone 및 wado-image-loader 설정
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

function DicomViewer() {
  const { uploadedFiles, handleFileSelect, selectedFile } = useContext(UploadContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const dicomElementRef = useRef(null);
  const isDraggingRef = useRef(false); // 드래그 상태 확인
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const initialScaleRef = useRef(1); // 초기 스케일 저장
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태에 따라 마우스 커서 변경

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
  
      handleFileSelect(file); // 선택한 파일 업데이트
  
      // 초기 스케일 저장 (최소 축소 크기 제한을 위함)
      const initialViewport = cornerstone.getViewport(element);
      initialScaleRef.current = initialViewport.scale;
  
      // 기본 DICOM 파일의 windowCenter와 windowWidth 적용
      const currentViewport = cornerstone.getViewport(element);
      currentViewport.voi.windowCenter = image.windowCenter; // 기본 밝기값 적용
      currentViewport.voi.windowWidth = image.windowWidth; // 기본 콘트라스트값 적용
      cornerstone.setViewport(element, currentViewport);
  
    } catch (error) {
      console.error("Error loading DICOM image:", error);
      setErrorMessage("DICOM 파일을 불러오지 못했습니다.");
    }
  };
  
  // 마우스 휠을 이용한 확대/축소 기능
  const handleWheel = (event) => {
    const element = dicomElementRef.current;
    if (element) {
      event.preventDefault();
      const delta = event.deltaY < 0 ? 1.05 : 0.95; // 휠을 올리면 확대, 내리면 축소
      const viewport = cornerstone.getViewport(element);

      // 최소 축소 크기는 초기 스케일로 제한
      const newScale = viewport.scale * delta;

      if (newScale <= initialScaleRef.current) {
        // 스케일이 초기 값 이하로 되면 리셋
        cornerstone.reset(element);
      } else {
        // 스케일이 초기 값보다 크면 계속 확대/축소 적용
        viewport.scale = newScale;
        cornerstone.setViewport(element, viewport);
      }
    }
  };

  // 마우스 드래그 시작
  const handleMouseDown = (event) => {
    const element = dicomElementRef.current;
    if (element) {
      const viewport = cornerstone.getViewport(element);
      // 확대된 상태에서만 드래그 시작
      if (viewport.scale > initialScaleRef.current) {
        isDraggingRef.current = true;
        setIsDragging(true); // 커서를 grabbing으로 변경
        lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
      }
    }
  };

  // 마우스 드래그 중
  const handleMouseMove = (event) => {
    if (!isDraggingRef.current) return;

    const element = dicomElementRef.current;
    if (element) {
      const viewport = cornerstone.getViewport(element);

      const deltaX = event.clientX - lastMousePositionRef.current.x;
      const deltaY = event.clientY - lastMousePositionRef.current.y;

      viewport.translation.x += deltaX;
      viewport.translation.y += deltaY;

      cornerstone.setViewport(element, viewport);

      lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  // 마우스 드래그 종료
  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false); // 커서를 기본값으로 변경
  };

  // 선택한 파일이 있는 경우 자동으로 로드
  useEffect(() => {
    if (selectedFile) {
      const selectedFileObj = uploadedFiles.find(file => file.file === selectedFile);
      if (selectedFileObj) {
        loadDicomImage(selectedFileObj);
      }
    }
  }, [selectedFile, uploadedFiles]);

  // 마우스 이벤트 리스너 추가
  useEffect(() => {
    const element = dicomElementRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel);
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseUp);
      }
    };
  }, []);

  const dicomFiles = uploadedFiles.filter(file => file.name.endsWith('.dcm'));

  return (
    <Container>
      <FileListContainer>
        <FileListTitle>파일 리스트</FileListTitle>
        <FileList>
          {dicomFiles.length > 0 ? (
            dicomFiles.map((file, index) => (
              <FileItem
                key={index}
                onClick={() => loadDicomImage(file)}
                selected={selectedFile === file.file} // 선택된 파일 확인
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
          <ActionButton onClick={() => console.log("Save functionality to be implemented")}>Save</ActionButton>
          <ActionButton onClick={() => console.log("Close functionality to be implemented")}>Close</ActionButton>
          <ActionButton onClick={() => console.log("Help functionality to be implemented")}>영상제어 도움말</ActionButton>
        </ButtonContainer>
        <DicomElement 
          ref={dicomElementRef} 
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }} 
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </DicomViewerContainer>
    </Container>
  );
}

export default DicomViewer;

// 스타일 정의

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  height: 90vh;
  margin-left: 15%; 
`;

const FileListContainer = styled.div`
  margin-right: 20px;
  margin-top: 70px;
  width: 200px;
`;

const FileListTitle = styled.h2`
  color: #ffffff;
  background: #222;
  padding: 10px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 0px;
  border-bottom: 2px solid #444;
  font-size: 14px;
  font-weight: bold;
`;

const FileList = styled.ul`
  padding: 10px;
  background: #333;
  color: #fff;
  height: 83%;
  overflow-y: auto;
  border-radius: 5px;
  font-size: 12px;
  margin: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: #333;
  }
`;

const FileItem = styled.li`
  cursor: pointer;
  padding: 10px;
  background-color: ${({ selected }) => (selected ? '#929292' : '#444')};
  margin-bottom: 5px;
  color: #ffffff;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
`;

const NoFilesMessage = styled.p`
  color: #ffffff;
  text-align: center;
`;

const DicomViewerContainer = styled.div`
  flex: 2;
  text-align: center;
  position: relative;
  margin-top: 70px;
`;

const DicomElement = styled.div`
  width: 90%;
  height: 94%;
  background: black; 
  margin: 10px 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 9%;
`;

const ActionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const ErrorMessage = styled.p`
  color: red;
`;
