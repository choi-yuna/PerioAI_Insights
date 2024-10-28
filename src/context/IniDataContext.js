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
  const tlaSize = [];
  const tlaPoints = [];
  const tlaColor = [];
  const tlaPointsByNum = {}; // TLA 데이터를 치아 번호별로 저장하기 위한 객체

  // 치주골 데이터 추가 (번호별 매핑을 위한 객체와 전체 데이터를 위한 배열)
  const bonePoints = [];
  const boneColor = [];
  const boneSize = [];
  const cejPointsByNum = {};
  const bonePointsByNum = {};

  // 모든 치아 번호 리스트 (11~18, 21~28, 31~38, 41~48)
  const allTeethNumbers = [
    11, 12, 13, 14, 15, 16, 17, 18,
    21, 22, 23, 24, 25, 26, 27, 28,
    31, 32, 33, 34, 35, 36, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48
  ];

  // 모든 치아 번호에 대해 기본적으로 빈 배열로 초기화
  allTeethNumbers.forEach(num => {
    cejPointsByNum[num] = [];
    bonePointsByNum[num] = [];
  });

  let loadedPoints = [];
  let loadedColor = [];
  let _Size = 0;
  let Rect = false;
  let work = "";
  let type_ = "";
  let num = 0;

  const teethExtremes = {}; // 최대, 최소 데이터를 저장하기 위한 객체

  // INI 파일 내용을 라인별로 처리
  const lines = iniContent.split('\n');
  lines.forEach((line, index) => {
    line = line.trim();

    if (line.startsWith("START")) {
      work = "S";
    } else if (line.startsWith("N=")) {
      // 치아 번호 파싱
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

          // 치아 번호에 따라 CEJ 포인트를 매핑
          if (cejPointsByNum[num]) {
            cejPointsByNum[num] = [...loadedPoints]; // 배열 자체를 저장
          }
        } else if (type_ === "A") {
          tlaPoints.push([...loadedPoints]);
          tlaColor.push([...loadedColor]);
          tlaSize.push(_Size);

          // 치아 번호에 따라 TLA 데이터를 저장
          if (!tlaPointsByNum[num]) {
            tlaPointsByNum[num] = [];
          }
          tlaPointsByNum[num].push([...loadedPoints]);
        } else if (type_ === "D") {
          // 치아 번호에 따라 치주골 포인트 매핑 및 전체 데이터 추가
          bonePoints.push([...loadedPoints]);
          boneColor.push([...loadedColor]);
          boneSize.push(_Size);

          if (bonePointsByNum[num]) {
            bonePointsByNum[num] = [...loadedPoints]; // 배열 자체를 저장
          }
        }

        // 최대 및 최소 Y 좌표 계산 및 저장
        if (type_ === "T" && loadedPoints.length > 0) {
          const yValues = loadedPoints.map((point) => point[1]);
          const minY = Math.min(...yValues);
          const maxY = Math.max(...yValues);

          if (!teethExtremes[num]) {
            teethExtremes[num] = {
              minY,
              maxY,
            };
          } else {
            teethExtremes[num].minY = Math.min(teethExtremes[num].minY, minY);
            teethExtremes[num].maxY = Math.max(teethExtremes[num].maxY, maxY);
          }
        }
      }
      // 상태 초기화
      _Size = 0;
      loadedPoints = [];
      loadedColor = [];
      Rect = false;
    } else if (work === "S" && line.startsWith("TD")) {
      type_ = "T";
    } else if (work === "S" && line.startsWith("BD")) {
      type_ = "D"; // 치주골 데이터를 위한 타입
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
    tlaSize,
    tlaPoints,
    tlaColor,
    tlaPointsByNum, // 치아 번호별로 정리된 TLA 데이터 포함
    cejPointsByNum, // 치아 번호별로 정리된 CEJ 포인트 데이터 포함
    bonePointsByNum, // 치아 번호별로 정리된 치주골 포인트 데이터 포함
    teethExtremes, // 최대 및 최소 Y 좌표 데이터를 포함
    bonePoints, // 전체 치주골 포인트 데이터
    boneColor, // 전체 치주골 색상 데이터
    boneSize,  // 전체 치주골 크기 데이터
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

      const iniFile = uploadedFiles.find(file =>
        file.name.endsWith('.ini') && file.name.includes(selectedFileName)
      );

      if (iniFile && iniFile.file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const iniContent = event.target.result;
          if (iniContent) {
            const data = parseIniData(iniContent);
            setParsedData(data);
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
