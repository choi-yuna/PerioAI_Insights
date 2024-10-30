import React, { createContext, useState, useEffect, useContext } from 'react';
import { UploadContext } from './UploadContext'; // UploadContext 임포트
import { postIniFile, getToothData } from '../api/api'; // 서버 요청 함수 임포트

// Context 생성
export const IniDataContext = createContext();

// Provider를 생성하여 전역 상태를 관리
export const IniDataProvider = ({ children }) => {
  const [parsedData, setParsedData] = useState(null);
  const { selectedFile, uploadedFiles } = useContext(UploadContext); // UploadContext 데이터 사용

  // 선택된 파일 이름을 기준으로 INI 파일 찾기 및 서버 요청
  useEffect(() => {
    console.log("Selected file:", selectedFile);
    console.log("Uploaded files:", uploadedFiles);

    if (selectedFile && uploadedFiles.length > 0) {
      const selectedFileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // 확장자 제거

      const iniFile = uploadedFiles.find(file =>
        file.name.endsWith('.ini') && file.name.includes(selectedFileName)
      );

      if (iniFile && iniFile.file instanceof Blob) {
        // 서버에 INI 파일 전송
        postIniFile(iniFile.file)
          .then(async () => {
            // 서버에서 JSON 데이터 요청
            const serverData = await getToothData();
            setParsedData(serverData); // 서버 데이터를 parsedData로 설정
          })
          .catch((error) => {
            console.error("Error processing INI file:", error);
          });
      }
    }
  }, [selectedFile, uploadedFiles]);

  return (
    <IniDataContext.Provider value={{ parsedData }}>
      {children}
    </IniDataContext.Provider>
  );
};

// Context를 사용하는 커스텀 훅
export const useIniDataContext = () => {
  return useContext(IniDataContext);
};
