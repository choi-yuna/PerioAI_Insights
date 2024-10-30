import React, { createContext, useState, useEffect, useContext } from 'react';
import { UploadContext } from './UploadContext';
import { postIniFile } from '../api/api';

export const IniDataContext = createContext();

export const IniDataProvider = ({ children }) => {
  const [parsedData, setParsedData] = useState(null);
  const { selectedFile, uploadedFiles } = useContext(UploadContext);

  // 선택된 파일 이름을 기준으로 INI 파일 찾기 및 서버 요청
  useEffect(() => {
    console.log("Selected file:", selectedFile);
    console.log("Uploaded files:", uploadedFiles);

    if (selectedFile && uploadedFiles.length > 0) {
      const selectedFileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // 확장자 제거

      const iniFile = uploadedFiles.find(file =>
        file.name.endsWith('.ini') && file.name.includes(selectedFileName)
      );

      if (iniFile) {
        // 서버에 INI 파일 전송 및 데이터 수신
        postIniFile(iniFile)
          .then((serverData) => {
            setParsedData(serverData); // 받은 데이터를 parsedData로 저장하여 전역 상태로 사용 가능하게 설정
            console.log("Received data:", serverData);
          })
          .catch((error) => {
            console.error("Error processing INI file:", error);
          });
      } else {
        console.warn("선택된 파일에 대한 INI 파일을 찾을 수 없습니다.");
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
