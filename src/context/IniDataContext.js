import React, { createContext, useState, useEffect, useContext } from 'react';
import { UploadContext } from './UploadContext';
import { postIniAndJsonFiles } from '../api/api';

export const IniDataContext = createContext();

export const IniDataProvider = ({ children }) => {
  const [parsedData, setParsedData] = useState(null);
  const { selectedFile, uploadedFiles } = useContext(UploadContext);

  // 선택된 파일 이름을 기준으로 INI 및 JSON 파일 찾기 및 서버 요청
  useEffect(() => {
    console.log("Selected file:", selectedFile);
    console.log("Uploaded files:", uploadedFiles);

    if (selectedFile && uploadedFiles.length > 0) {
      const selectedFileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // 확장자 제거

      // INI 파일 찾기
      const iniFile = uploadedFiles.find(file =>
        file.name.endsWith('.ini') && file.name.includes(selectedFileName)
      );

      // JSON 파일 찾기
      const jsonFile = uploadedFiles.find(file =>
        file.name.endsWith('.json') && file.name.includes(selectedFileName)
      );

      if (iniFile && jsonFile) {
        console.log("INI File found:", iniFile); // 확인용 로그
        console.log("JSON File found:", jsonFile); // 확인용 로그

        // 서버에 INI와 JSON 파일 전송 및 데이터 수신
        postIniAndJsonFiles(iniFile, jsonFile)
          .then((serverData) => {
            setParsedData(serverData);
            console.log("Received data:", serverData);
          })
          .catch((error) => {
            console.error("Error processing INI and JSON files:", error);
          });
      } else {
        console.warn("선택된 파일에 대한 INI 또는 JSON 파일을 찾을 수 없습니다.");
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
