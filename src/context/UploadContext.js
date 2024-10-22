import React, { createContext, useState } from 'react';

// Context 생성
export const UploadContext = createContext();

// Provider를 생성하여 전역 상태를 관리
export const UploadProvider = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일들 상태 관리
    const [uploadFolder, setUploadFolder] = useState(''); // 업로드된 폴더 경로 상태 추가

    // 폴더 업로드 핸들러
    const handleFolderUpload = (files) => {
        console.log("Selected files:", files); // 선택된 파일들 로그
        
        if (files.length > 0) {
            const firstFile = files[0]; // 첫 번째 파일 가져오기
    
            // webkitRelativePath가 있는 경우 경로를 추출
            if (firstFile && firstFile.webkitRelativePath) {
                const relativePath = firstFile.webkitRelativePath; // 상대 경로
                const pathParts = relativePath.split('/'); // '/'로 분리
                const folderPath = pathParts.slice(0, -1).join('/'); // 폴더 경로 추출
    
                setUploadFolder(folderPath); // 폴더 경로 상태 업데이트
                console.log(`Uploading from folder: ${folderPath}`);
            } else {
                console.error("No valid folder path found in the first file.");
                alert("폴더가 아닌 파일이 선택되었습니다. 올바른 폴더를 선택해 주세요.");
            }
        } else {
            console.warn("No files selected for upload.");
        }
    
        // 모든 파일을 상태에 저장
        setUploadedFiles(files); // 업로드된 파일들 상태를 한 번에 업데이트
        console.log("Uploaded files state:", files); // 상태 업데이트 후 파일 로그
    };
    
    
    
    return (
        <UploadContext.Provider value={{ uploadedFiles, handleFolderUpload, uploadFolder }}>
            {children}
        </UploadContext.Provider>
    );
};
