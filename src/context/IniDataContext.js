import React, { createContext, useState, useEffect, useContext } from 'react';
import { UploadContext } from './UploadContext'; // UploadContext 임포트

// Context 생성
export const IniDataContext = createContext();

// INI 파일 파싱 함수
const parseIniData = (iniContent) => {
  const teethNum = [];
  const teethPoints = [];
  const teethSize = [];
  const cejSize = [];
  const cejPoints = [];
  const cejColor = [];

  let loadedColor = [];
  let loadedPoints = [];
  let _Size = 0;
  let Rect = false;
  let work = "";
  let type_ = "";
  let num = 0;

  // INI 파일 내용을 라인별로 처리
  const lines = iniContent.split('\n');
  lines.forEach((line, index) => {
    line = line.trim();

    if (line.startsWith("START")) {
      work = "S";
    } else if (line.startsWith("N=")) {
      num = parseInt(line.slice(2), 10);
    } else if (line.startsWith("END")) {
      if (!Rect) {
        if (type_ === "T") {
          teethPoints.push([...loadedPoints]);
          teethSize.push(_Size);
          teethNum.push(num);
        } else if (type_ === "C") {
          cejPoints.push([...loadedPoints]);
          cejColor.push([...loadedColor]);
          cejSize.push(_Size);

        }
      }
      // 상태 초기화
      _Size = 0;
      loadedPoints = [];
      loadedColor = [];
      Rect = false;
    }  else if (work === "S" && line.startsWith("TD")) {
        type_ = "T";
    }  else if (work === "S" && line.startsWith("BD")) {
        type_ = "D";
      } else if (work === "S" && line.startsWith("CD")) {
        type_ = "C";
      } else if (work === "S" && line.startsWith("AD")) {
        type_ = "A";
      } else if (work === "S" && line.startsWith("DD")) {
        type_ = "D";
      } else if (work === "S" && line.startsWith("RBLD")) {
        type_ = "RBL";
      } else if (work === "S" && line.startsWith("TRLD")) {
        type_ = "TRL";
    } else if (line.startsWith("C=")) {
      const parts = line.split(',');
      if (parts.length === 4) {
        loadedColor = [
          parseInt(parts[0].slice(2), 10),
          parseInt(parts[1], 10),
          parseInt(parts[2], 10),
          parseInt(parts[3], 10)
        ];
      }
    } else if (line.startsWith("P=")) {
      const parts = line.split(',');
      if (parts.length === 2) {
        const x = parseInt(parts[0].slice(2), 10);
        const y = parseInt(parts[1], 10);
        loadedPoints.push([x, y]);
      }
    } else if (line.startsWith("S=")) {
      _Size = parseInt(line.slice(2), 10);
    } else if (line.startsWith("R")) {
      Rect = true;
    }
  });

  // 파싱된 데이터 반환
  const parsedData = {
    teethNum,
    teethPoints,
    teethSize,
    cejSize,
    cejPoints,
    cejColor,
  };

  console.log("Parsed data result:", parsedData); // 최종 파싱 결과 로그
  return parsedData;
};

// Provider를 생성하여 전역 상태를 관리
export const IniDataProvider = ({ children }) => {
  const [parsedData, setParsedData] = useState(null);
  const { selectedFile, uploadedFiles } = useContext(UploadContext); // UploadContext 데이터 사용

  // 선택된 파일 이름을 기준으로 INI 파일 찾기
  useEffect(() => {
    console.log("Selected file:", selectedFile);
    console.log("Uploaded files:", uploadedFiles);
  
    if (selectedFile && uploadedFiles.length > 0) {
      const selectedFileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // 확장자 제거
  
      // 선택한 이미지와 이름이 같은 INI 파일 찾기
      const iniFile = uploadedFiles.find(file => 
        file.name.endsWith('.ini') && file.name.includes(selectedFileName)
      );
  
      if (iniFile) {
        console.log("INI file found:", iniFile);
      } else {
        console.warn("INI file not found.");
      }
  
      if (iniFile && iniFile.file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const iniContent = event.target.result;
          if (iniContent) {
            const data = parseIniData(iniContent);
            setParsedData(data);
          } else {
          }
        };
        reader.readAsText(iniFile.file);
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
