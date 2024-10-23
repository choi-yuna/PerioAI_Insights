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
  const { uploadedFiles, selectedFile } = useContext(UploadContext);
  const [errorMessage, setErrorMessage] = useState(null);
  const [overlays, setOverlays] = useState({
    tooth: true, 
    alve: true,
    cej: true,
    tla: true,
  }); // 오버레이 상태 초기화
  const dicomElementRef = useRef(null);
  const canvasRef = useRef(null);

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

  const loadDicomImage = async (file) => {
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
      const pngFileName = file.name.replace('.dcm', '.png'); // DICOM 파일 이름에서 PNG 파일 이름으로 변경
  
      // PNG 파일 경로 생성
      const overlayPaths = {
        tooth: `Labelling/tooth/${pngFileName}`,
        alve: `Labelling/alve/${pngFileName}`,
        cej: `Labelling/cej/${pngFileName}`,
        tla: `Labelling/tla/${pngFileName}`,
      };
  
      // 모든 오버레이에 대해 PNG 파일을 확인하고 그리기
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
  
      for (const [key, path] of Object.entries(overlayPaths)) {
        const pngFile = uploadedFiles.find(uploadedFile => 
          uploadedFile.path.endsWith(pngFileName) && // 파일 이름 일치
          uploadedFile.path.includes(key) // 폴더 포함 여부 확인
        );
  
        if (overlays[key] && pngFile) {
          const pngFileUrl = URL.createObjectURL(pngFile.file);
          const pngImage = new Image();
          pngImage.src = pngFileUrl;
  
          pngImage.onload = () => {
            const scaleX = width / pngImage.width;
            const scaleY = height / pngImage.height;
            context.drawImage(pngImage, 0, 0, pngImage.width * scaleX, pngImage.height * scaleY);
          };
  
          pngImage.onerror = () => {
            console.error("Error loading PNG image at", pngFileUrl);
            setErrorMessage("PNG 파일을 불러오지 못했습니다.");
          };
        } else {
          console.warn(`No PNG file found for overlay: ${key}`);
        }
      }
  
    } catch (error) {
        console.error("Error loading DICOM image:", error);
        setErrorMessage("DICOM 파일을 불러오지 못했습니다.");
      }
    };

  useEffect(() => {
    if (selectedFile) {
      loadDicomImage(selectedFile);
    }
  }, [selectedFile, overlays]); // overlays가 변경될 때마다 DICOM 이미지 다시 로드

  return (
    <Container>
      {/* 왼쪽에 오버레이 선택 추가 */}
      <OverlaySelection>
        <h3>오버레이 선택</h3>
        <label>
          <input
            type="checkbox"
            checked={overlays.tooth} // 치아 오버레이 체크박스 상태
            onChange={() => {
              setOverlays(prev => ({
                ...prev,
                tooth: !prev.tooth // 체크 상태를 토글
              }));
            }} // 선택된 오버레이 설정
          />
          치아
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.alve} // 치조골 오버레이 체크박스 상태
            onChange={() => {
              setOverlays(prev => ({
                ...prev,
                alve: !prev.alve // 체크 상태를 토글
              }));
            }}
          />
          치조골
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.cej} // CEJ level 오버레이 체크박스 상태
            onChange={() => {
              setOverlays(prev => ({
                ...prev,
                cej: !prev.cej // 체크 상태를 토글
              }));
            }}
          />
          CEJ level
        </label>
        <label>
          <input
            type="checkbox"
            checked={overlays.tla} // TLA 오버레이 체크박스 상태
            onChange={() => {
              setOverlays(prev => ({
                ...prev,
                tla: !prev.tla // 체크 상태를 토글
              }));
            }}
          />
          TLA
        </label>
      </OverlaySelection>

      <DicomViewerContainer>
        <h2>영상 View</h2>
        <ViewerContainer>
          <DicomElement ref={dicomElementRef} />
          <Canvas ref={canvasRef} />
        </ViewerContainer>
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

const DicomViewerContainer = styled.div`
  flex: 2; /* 이미지 뷰의 크기 비율 */
  text-align: center;
`;

const ViewerContainer = styled.div`
  position: relative; /* 자식 요소를 절대 위치로 설정하기 위한 기준 */
  width: 80%;
  height: 80%;
  margin-left : 15%;
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
`;

const ErrorMessage = styled.p`
  color: red;
`;

// 라디오 버튼 스타일 정의
const OverlaySelection = styled.div`
  margin-right: 20px; // DICOM 뷰어와의 간격
  margin-top: 300px; /* 선택 영역을 조금 더 아래로 이동 */
  text-align: left;
  h3 {
    margin: 0 0 10px 0;
    font-size : 14px;
  }
  label {
    display: block;
    margin: 5px 0;
    text-align: left; /* 라벨 텍스트 왼쪽 정렬 */
  }
`;
