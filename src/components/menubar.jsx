/**
 * 시스템명 : AI Dental and Periodontal Analyzer
 * 세부업무구분명 : 메인화면
 * 화면명 : 사이드 메뉴바 컴포넌트
 * 설명 : imageLoad, detection, analysis 메뉴바
 *
 * 파일명 : menubar.jsx
 * 작성자 : 박진우, 최윤아
 * 작성일 : 2024. 11. 12.
 * --------------------------------------------------------------------
 * Modification Information
 * --------------------------------------------------------------------
 * 수정일               수정자            수정내용
 * --------------------------------------------------------------------
 * 2024. 11. 12.        최윤아           최초생성
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Open from '../assets/images/open.svg';
import Close from '../assets/images/close.svg';

const MenuBar = ({ collapsed, setCollapsed }) => {
  const [activeButton, setActiveButton] = useState(''); 
  const navigate = useNavigate();

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  // 버튼 클릭 시 페이지 이동 및 버튼 상태 변경
  const handleButtonClick = (buttonName, path) => {
    setActiveButton(buttonName); 
    navigate(path); 
  };

  return (
    <MenuBarContainer collapsed={collapsed}>
      <ToggleButton onClick={handleToggle} collapsed={collapsed}>
        <ToggleIcon src={collapsed ? Close : Open} alt="Toggle Icon" />
      </ToggleButton>
      <InnerContainer collapsed={collapsed}>
        <BtnCtn>
          <MenuBtn
            active={activeButton === 'Image Load'}
            onClick={() => handleButtonClick('Image Load', '/image-load')}
          >
            Image Load
          </MenuBtn>
          <MenuBtn
            active={activeButton === 'Detection'}
            onClick={() => handleButtonClick('Detection', '/detection')}
          >
            Detection
          </MenuBtn>
          <MenuBtn
            active={activeButton === 'Analysis'}
            onClick={() => handleButtonClick('Analysis', '/analysis')}
          >
            Analysis
          </MenuBtn>
        </BtnCtn>
      </InnerContainer>
    </MenuBarContainer>
  );
};

export default MenuBar;

const MenuBarContainer = styled.div`
  width: ${(props) => (props.collapsed ? '1%' : '13%')};
  height: 100vh;
  background-color: #071231;
  padding: 7px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s ease, height 0.3s ease;
  position: fixed;
`;

const InnerContainer = styled.div`
  width: 88%;
  height: 75%;
  background-color: #e7e7e7;
  border-radius: 5px;
  padding: ${(props) => (props.collapsed ? '5px 0' : '8px')};
  display: ${(props) => (props.collapsed ? 'none' : 'block')};
  transition: padding 0.3s ease;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 0px;
  right: 10px;
  width: 22px;
  height: 30px;
  background-color: #071231;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;

  transform: ${(props) =>
    props.collapsed ? 'translateX(0)' : 'translateX(calc(100% + 10px))'};
`;

const ToggleIcon = styled.img`
  width: 13px;
  height: 15px;
  margin-right: 2px;
`;

const MenuBtn = styled.button`
  padding: 11% 10%;
  font-size: 20px;
  border: 2px solid black; 
  background-color: ${(props) => (props.active ? '#777777' : '#071231')}; 
  color: white;
  
  cursor: pointer;
  border-radius: 5px; 
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${(props) => (props.active ? '#777777' : 'lightgray')}; 
  }
`;

const BtnCtn = styled.div`
  display: flex;
  flex-direction: column; 
  justify-content: space-between; 
  gap: 30px;
  padding: 30px;
`;
