import React, { useContext, useRef, useState, useEffect } from "react";
import styled from 'styled-components';
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { UploadContext } from '../../context/UploadContext'; // UploadContext 가져오기

// cornerstone 및 wado-image-loader 설정
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Accept', 'multipart/related; type="application/dicom"');
  }
});

function DicomViewer() {
  const { uploadedFiles } = useContext(UploadContext); // 업로드된 파일 리스트 가져오기
  const [errorMessage, setErrorMessage] = useState(null);
  const dicomElementRef = useRef(null);

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

  const loadDicomImage = async (fileObj) => {
    const file = fileObj.file; // 실제 File 객체 가져오기

    if (!file) {
      console.error("File is undefined or invalid.");
      setErrorMessage("유효하지 않은 파일입니다.");
      return;
    }

    setErrorMessage(null); // 에러 메시지 초기화
    const fileUrl = URL.createObjectURL(file); // Blob URL 생성
    const imageId = `wadouri:${fileUrl}`; // cornerstoneWADOImageLoader에서 사용할 이미지 ID 생성

    try {
      const element = dicomElementRef.current;

      // DICOM 이미지 로드
      const image = await cornerstone.loadImage(imageId);
      cornerstone.displayImage(element, image);
      cornerstone.reset(element);

      // PNG 파일 경로 가져오기
      const pngFileName = file.name.replace('.dcm', '.png'); // DICOM 파일 이름을 기반으로 PNG 파일 이름 생성
      const pngFile = uploadedFiles.find(uploadedFile => uploadedFile.name === pngFileName); // PNG 파일 찾기
      console.log(pngFile)

      if (pngFile) {
        const pngImagePath = pngFile.path; // PNG 파일 경로 가져오기

        // PNG 이미지 로드 및 그리기
        const pngImage = new Image();
        pngImage.src = pngImagePath; // PNG 파일 경로

        pngImage.onload = () => {
          const canvas = dicomElementRef.current; 
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height); // 이전 내용을 지움
          cornerstone.displayImage(element, image); // DICOM 이미지 그리기
          context.drawImage(pngImage, 0, 0); // PNG 이미지 그리기
        };

        pngImage.onerror = () => {
          console.error("Error loading PNG image at", pngImagePath);
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
