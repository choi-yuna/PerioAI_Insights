/**
 * 시스템명 : AI Dental and Periodontal Analyzer
 * 세부업무구분명 : 전역 데이터 관리
 * 설명 : 선택된 파일 이름을 기준으로 서버에 데이터 분석 요청
 *
 * 파일명 : IniDataProvider.js
 * 작성자 : 박진우, 최윤아
 * 작성일 : 2024. 11. 12.
 * --------------------------------------------------------------------
 * Modification Information
 * --------------------------------------------------------------------
 * 수정일               수정자            수정내용
 * --------------------------------------------------------------------
 * 2024. 11. 12.        최윤아           최초생성
 */

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

      // dcmFile 파일 찾기
      const dcmFile = uploadedFiles.find(file =>
        file.name.endsWith('.dcm') && file.name.includes(selectedFileName)
      );

      if (iniFile && jsonFile) {
        console.log("INI File found:", iniFile); // 확인용 로그
        console.log("JSON File found:", jsonFile); // 확인용 로그
        console.log("dcm File found:", dcmFile);

        // 서버에 INI와 JSON 파일 전송 및 데이터 수신
        postIniAndJsonFiles(iniFile, jsonFile, dcmFile)
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
