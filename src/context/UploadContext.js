/**
 * 시스템명 : AI Dental and Periodontal Analyzer
 * 세부업무구분명 : 전역 데이터 관리
 * 설명 : 서버에 선택한 파일을 업로드 후 선택된 파일 이름을 파싱하는 함수
 *
 * 파일명 : UploadContext.js
 * 작성자 : 박진우, 최윤아
 * 작성일 : 2024. 11. 12.
 * --------------------------------------------------------------------
 * Modification Information
 * --------------------------------------------------------------------
 * 수정일               수정자            수정내용
 * --------------------------------------------------------------------
 * 2024. 11. 12.        최윤아           최초생성
 */

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
