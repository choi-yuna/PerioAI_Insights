import React from 'react';
import styled from 'styled-components';
import logo from '../assets/images/fas-logo.svg';
import fileUploadIcon from '../assets/images/file-upload.svg';
import userIcon from '../assets/images/user.svg';
import logoutIcon from '../assets/images/logout.svg';

const TopBar = () => {
    return (
        <TopBarContainer>
            <TopBarLeft>
                <Logo src={logo} alt="Logo" />
            </TopBarLeft>
            <TopBarRight>
                <Icon src={fileUploadIcon} alt="Upload" />
                <Icon src={userIcon} alt="User" />
                <Username>000님</Username>
                <Icon src={logoutIcon} alt="Logout" />
            </TopBarRight>
        </TopBarContainer>
    );
};
export default TopBar;

const TopBarContainer = styled.div`
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 7%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #0C476A;
    padding: 12px 20px;
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
    height: 60px;
    margin-right: 10px;
    left: 26px;
`;
const TopBarRight = styled.div`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    padding-top: 15.59px;
    padding-bottom: 1.44px;
    padding-right: 7.14px;
`;
const Icon = styled.img`
    height: 40px;
    margin-right: 10px;
    cursor: pointer;
    flex-shrink: 0;
`;
const Username = styled.span`
    margin-right: 15px;
    margin-top: 13px;
    white-space: nowrap;
    font-size: 20px;
    font-family: 'Inter';
`;