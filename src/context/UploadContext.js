import React, { createContext, useState } from 'react';
import axios from 'axios';

// Context 생성
export const UploadContext = createContext();

// Provider를 생성하여 전역 상태를 관리
export const UploadProvider = ({ children }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]); 
    const [uploadFolder, setUploadFolder] = useState(''); 
    const [selectedFile, setSelectedFile] = useState(null); 

    // 폴더 업로드 핸들러
    const handleFolderUpload = async (files) => {
        console.log("Selected files:", files);

        if (files.length > 0) {
            const formData = new FormData();
            
            // 파일명만 추출하여 FormData에 추가
            files.forEach((file) => {
                formData.append('filename', file.name); // 파일명만 전송
            });

            // 전송할 FormData 내용을 출력
            for (let [key, value] of formData.entries()) {
                console.log(`Key: ${key}, Value: ${value}`); // 파일명만 출력
            }

            try {
                // 서버에 파일명 전송
                const response = await axios.post('http://localhost:8080/api/upload-filename', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Filenames uploaded successfully:', response.data);
            } catch (error) {
                console.error('Error uploading filenames:', error);
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
