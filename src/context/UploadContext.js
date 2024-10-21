import React, { createContext, useState } from 'react';

// Context 생성
export const UploadContext = createContext();

// Provider를 생성하여 전역 상태를 관리
export const UploadProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일들 상태 관리

  // 폴더 업로드 핸들러
  const handleFolderUpload = (files) => {
    setUploadedFiles(files); // 업로드된 파일들 상태 업데이트
  };

  return (
    <UploadContext.Provider value={{ uploadedFiles, handleFolderUpload }}>
      {children}
    </UploadContext.Provider>
  );
};
