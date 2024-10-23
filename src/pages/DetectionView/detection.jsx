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
  const [overlayImages, setOverlayImages] = useState([]);

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

      const { width, height } = image;

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

  return (
    <Container>
      <OverlayContainer>
        <OverlaySelection>
          <h3>오버레이 선택</h3>
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
        <h2>영상 View</h2>
        <ViewerContainer>
          <DicomElement ref={dicomElementRef} />
          {overlayImages.map((src, index) => (
            <OverlayImage key={index} src={src} alt={`Overlay ${index}`} />
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
  margin-left: 300px; 
`;

const OverlayContainer = styled.div`
  width: 200px; /* 너비 조정 */
  margin-right: 20px; /* DICOM 뷰어와의 간격 */
  margin-top: 20px; /* 상단 여백 */
`;

const DicomViewerContainer = styled.div`
  flex: 2; /* 이미지 뷰의 크기 비율 */
  text-align: center;
`;

const ViewerContainer = styled.div`
  position: relative; /* 자식 요소를 절대 위치로 설정하기 위한 기준 */
  width: 90%; /* 상위 요소에 맞춤 */
  height: 90%; /* 상위 요소에 맞춤 */
  margin-left : 50px; /* 좌측 여백 조정 */
`;

const DicomElement = styled.div`
  width: 100%; /* 전체 너비 */
  height: 100%; /* 전체 높이 */
  background: black; 
`;

const OverlayImage = styled.img`
  position: absolute; /* DICOM 이미지 위에 위치 */
  top: 0;
  left: 0;
  width: 100%; /* DICOM 이미지와 동일한 크기 */
  height: 100%; /* DICOM 이미지와 동일한 크기 */
  object-fit: contain; /* 이미지 비율 유지 */
  pointer-events: none; /* 이미지 클릭 이벤트 비활성화 */
`;

const ErrorMessage = styled.p`
  color: red;
`;

const OverlaySelection = styled.div`
  background: #222; /* 배경색 설정 */
  border-radius: 5px; /* 둥근 모서리 */
  padding: 15px; /* 내부 여백 */
  color: #fff; /* 텍스트 색상 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* 그림자 효과 */
  margin-top : 70px;
`;

const OverlayOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px; /* 항목 간격 조정 */
  input[type='checkbox'] {
    margin-right: 10px; /* 체크박스와 텍스트 간의 간격 조정 */
    accent-color: #3b82f6; /* 체크박스 색상 */
  }
`;
