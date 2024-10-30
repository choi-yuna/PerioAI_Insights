import React, { createContext, useState } from 'react';
import axios from 'axios'; 

// Context 생성
export const UploadContext = createContext();

// Provider를 생성하여 전역 상태를 관리
export const UploadProvider = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일들 상태 관리
    const [uploadFolder, setUploadFolder] = useState(''); // 업로드된 폴더 경로 상태 추가
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태 추가

    // 폴더 업로드 핸들러
    const handleFolderUpload = async (files) => {
        console.log("Selected files:", files);

        if (files.length > 0) {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('file', file, file.name); // 파일명만 전송
            });

            // 전송할 FormData 내용을 출력
            for (let [key, value] of formData.entries()) {
                console.log(`Key: ${key}, Filename: ${value.name}`);
            }

            try {
                // 서버에 파일 전송
                const response = await axios.post('http://localhost:8080/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Files uploaded successfully:', response.data);
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        } else {
            console.warn("No files selected for upload.");
        }

        setUploadedFiles(files);
        console.log("Uploaded files state:", files);
    };

    // 선택한 파일을 저장하는 함수
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        console.log("Selected file:", file);
    };

    return (
        <UploadContext.Provider value={{ uploadedFiles, handleFolderUpload, uploadFolder, selectedFile, handleFileSelect }}>
            {children}
        </UploadContext.Provider>
    );
};
