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
  });
  const dicomElementRef = useRef(null);
  const viewerContainerRef = useRef(null);
  const [overlayImages, setOverlayImages] = useState([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialScale = 1; // 초기 스케일

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
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(element, image);
      cornerstone.reset(element);

      const pngFileName = file.name.replace('.dcm', '.png');
      const overlayPaths = {
        tooth: `Labelling/tooth/${pngFileName}`,
        alve: `Labelling/alve/${pngFileName}`,
        cej: `Labelling/cej/${pngFileName}`,
        tla: `Labelling/tla/${pngFileName}`,
      };

      const newOverlayImages = Object.entries(overlayPaths).map(([key, path]) => {
        const pngFile = uploadedFiles.find(uploadedFile => 
          uploadedFile.path.endsWith(pngFileName) &&
          uploadedFile.path.includes(key)
        );
        return overlays[key] && pngFile ? URL.createObjectURL(pngFile.file) : null;
      }).filter(Boolean);

      setOverlayImages(newOverlayImages);
    } catch (error) {
      console.error("Error loading DICOM image:", error);
      setErrorMessage("DICOM 파일을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    if (selectedFile) {
      loadDicomImage(selectedFile);
    }
  }, [selectedFile, overlays]);

  const handleWheel = (event) => {
    setScale((prevScale) => {
      const newScale = prevScale + event.deltaY * -0.001;
      if (newScale <= initialScale) {
        setPosition({ x: 0, y: 0 }); // 스케일이 최소값일 때 위치 초기화
        return initialScale;
      }
      return newScale;
    });
  };

  const handleMouseDown = (event) => {
    setIsDragging(true); // 드래그 시작
    startPos.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return; // 드래그 상태가 아닐 때는 동작하지 않음
  
    const viewerBounds = viewerContainerRef.current.getBoundingClientRect();
    const dicomBounds = dicomElementRef.current.getBoundingClientRect();
  
    // 이동 거리 계산
    const newX = event.clientX - startPos.current.x;
    const newY = event.clientY - startPos.current.y;
  
    // 이동 범위 제한 (컨테이너의 절반까지만 이동 가능)
    const maxOffsetX = (dicomBounds.width * scale - viewerBounds.width) / 7;
    const maxOffsetY = (dicomBounds.height * scale - viewerBounds.height) / 7;
  
    const boundedX = Math.max(Math.min(newX, maxOffsetX), -maxOffsetX);
    const boundedY = Math.max(Math.min(newY, maxOffsetY), -maxOffsetY);
  
    setPosition({ x: boundedX, y: boundedY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false); // 드래그 종료
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Container>
      <OverlayContainer>
        <OverlaySelection>
          <h3>검출결과 보기</h3>
          <OverlayOption>
            <label>
              <input type="checkbox" checked={overlays.tooth} onChange={() => setOverlays(prev => ({ ...prev, tooth: !prev.tooth }))} />
              치아
            </label>
          </OverlayOption>
          <OverlayOption>
            <label>
              <input type="checkbox" checked={overlays.alve} onChange={() => setOverlays(prev => ({ ...prev, alve: !prev.alve }))} />
              치조골
            </label>
          </OverlayOption>
          <OverlayOption>
            <label>
              <input type="checkbox" checked={overlays.cej} onChange={() => setOverlays(prev => ({ ...prev, cej: !prev.cej }))} />
              CEJ level
            </label>
          </OverlayOption>
          <OverlayOption>
            <label>
              <input type="checkbox" checked={overlays.tla} onChange={() => setOverlays(prev => ({ ...prev, tla: !prev.tla }))} />
              TLA
            </label>
          </OverlayOption>
        </OverlaySelection>
      </OverlayContainer>

      <DicomViewerContainer>
        <ButtonContainer>
          <ActionButton onClick={() => console.log("Save functionality to be implemented")}>Save</ActionButton>
          <ActionButton onClick={() => console.log("Close functionality to be implemented")}>Close</ActionButton>
          <ActionButton onClick={() => console.log("Help functionality to be implemented")}>영상제어 도움말</ActionButton>
        </ButtonContainer>
        <ViewerContainer ref={viewerContainerRef}>
          <DicomElement 
            ref={dicomElementRef} 
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }} 
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          />
          {overlayImages.map((src, index) => (
            <OverlayImage 
              key={index} 
              src={src} 
              alt={`Overlay ${index}`} 
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                pointerEvents: "none",
              }} 
            />
          ))}
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
  margin-left: 15%; 
`;

const OverlayContainer = styled.div`
  width: 200px;
  margin-top: 87px;
`;

const DicomViewerContainer = styled.div`
  flex: 2;
  text-align: center;
  margin-top: 70px;
`;

const ViewerContainer = styled.div`
  position: relative;
  width: 89%;
  height: 93%;
  background: black;
  margin-left: 35px;
  overflow: hidden;
`;

const DicomElement = styled.div`
  width: 100%;
  height: 100%;
  background: black;
`;

const OverlayImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

const ErrorMessage = styled.p`
  color: red;
`;

const OverlaySelection = styled.div`
  background: #222;
  border-radius: 5px;
  padding: 10px;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
`;

const OverlayOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  input[type='checkbox'] {
    margin-right: 10px;
    accent-color: #3b82f6;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
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
