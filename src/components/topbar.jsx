/**
 * 시스템명 : AI Dental and Periodontal Analyzer
 * 세부업무구분명 : 메인화면 > topbar
 * 화면명 : topbar 컴포넌트
 * 설명 : topbar 회사 로고, 프로그램 이름
 *
 * 파일명 : topbar.jsx
 * 작성자 : 박진우, 최윤아
 * 작성일 : 2024. 11. 12.
 * --------------------------------------------------------------------
 * Modification Information
 * --------------------------------------------------------------------
 * 수정일               수정자            수정내용
 * --------------------------------------------------------------------
 * 2024. 11. 12.        최윤아           최초생성
 */

import React, { useContext } from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import fileUploadIcon from '../assets/images/file-upload.svg';
import userIcon from '../assets/images/user.svg';
import logoutIcon from '../assets/images/logout.svg';
import { UploadContext } from '../context/UploadContext'; 

const TopBar = () => {
    const { handleFolderUpload } = useContext(UploadContext); // Context에서 업로드 핸들러 가져오기

    const onFolderSelect = (event) => {
        const files = Array.from(event.target.files);
    
        if (!files || files.length === 0) {
            console.warn("No files selected");
            return;
        }
    
        const filesWithFolderNames = files.map(file => {
            const relativePath = file.webkitRelativePath; // 파일의 상대 경로
            const pathParts = relativePath.split('/'); // 경로를 '/'로 분리
    
            const folderName = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';
    
            return {
                file, // 실제 File 객체를 포함
                name: file.name,
                path: relativePath,
                folder: folderName // 하위 폴더 이름
            };
        });

        // Upload handler 호출
        if (typeof handleFolderUpload === 'function') {
            handleFolderUpload(filesWithFolderNames); // 파일 정보를 업로드 핸들러에 전달
        } else {
            console.error("handleFolderUpload is not a function or undefined.");
        }
    };

    return (
        <TopBarContainer>
            <TopBarLeft>
             <Logo src={logo} alt="Logo" /> 
                <Title>AI Dental and Periodontal Analyzer</Title> {/* 제목 추가 */}
            </TopBarLeft>
            <TopBarRight>
                {/* 파일 업로드 버튼 */}
                <label htmlFor="file-upload">
                    <Icon src={fileUploadIcon} alt="Upload" />
                </label>
                <FileInput
                    id="file-upload"
                    type="file"
                    webkitdirectory="true"
                    directory="true"
                    multiple
                    onChange={onFolderSelect} // 폴더 선택 시 파일 업로드
                />
                <Icon src={userIcon} alt="User" />
                <Username>000님</Username>
                <Icon src={logoutIcon} alt="Logout" />
            </TopBarRight>
        </TopBarContainer>
    );
};

export default TopBar;

// 스타일 정의

const TopBarContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #071231;
    padding: 10px 20px;
    color: white;
    z-index: 1000;
    box-sizing: border-box;
`;

const TopBarLeft = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

const Logo = styled.img`
    height: 63px;
    margin-right: 10px;
    left: 26px;
`;

const Title = styled.h1`
    font-size: 18px;
    font-weight: bold;
    color: white;
    margin: 0;
    margin-left: 20px;
    padding: 0;
    font-family: 'Inter';
`;

const TopBarRight = styled.div`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    padding-top: 20px;
    padding-bottom: 1.44px;
    padding-right: 7.14px;
    gap: 7px;
`;

const Icon = styled.img`
    height: 35px;
    margin-right: 10px;
    cursor: pointer;
    flex-shrink: 0;
`;

const Username = styled.span`
    margin-right: 15px;
    margin-top: 13px;
    white-space: nowrap;
    font-size: 17px;
    font-family: 'Inter';
`;

const FileInput = styled.input`
    display: none;
`;
