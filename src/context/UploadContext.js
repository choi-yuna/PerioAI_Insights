import React, { createContext, useState } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일들 상태 관리
    const [uploadFolder, setUploadFolder] = useState(''); // 업로드된 폴더 경로 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태 추가

    // 폴더 업로드 핸들러
    const handleFolderUpload = (files) => {
        console.log("Selected files:", files);

        if (files.length > 0) {
            const firstFile = files[0];

            if (firstFile && firstFile.webkitRelativePath) {
                const relativePath = firstFile.webkitRelativePath;
                const pathParts = relativePath.split('/');
                const folderPath = pathParts.slice(0, -1).join('/');
                setUploadFolder(folderPath);
                console.log(`Uploading from folder: ${folderPath}`);
            } else {
            }
        }

        setUploadedFiles(files);
        console.log("Uploaded files state:", files);
    };

    // 선택한 파일을 설정하는 함수
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        console.log("Selected file:", file);
    };

    return (
        <UploadContext.Provider value={{ 
            uploadedFiles, 
            handleFolderUpload, 
            uploadFolder, 
            selectedFile, 
            handleFileSelect 
        }}>
            {children}
        </UploadContext.Provider>
    );
};
