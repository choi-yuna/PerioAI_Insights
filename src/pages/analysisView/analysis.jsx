/**
 * 시스템명 : AI Dental and Periodontal Analyzer
 * 세부업무구분명 : 메인화면 > Analysis 
 * 화면명 : 데이터 분석 결과 화면 (치아 차트, 치주 차트, RBL 차트)
 * 설명 : 선택된 파일의 분석 차트 화면
 *
 * 파일명 : analysis.jsx
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
import ToothChart from '../../components/toothChart';
import PeriodontalChart from '../../components/PeriodontalChart';
import RBLChart from '../../components/RBLChart'

const Analysis = () => {
  const [visibleCharts, setVisibleCharts] = useState({
    ToothChart: true,
    PeriodontalChart: true,
    RBLChart: true,
  });

  const handleRadioChange = (chartName) => {
    setVisibleCharts((prev) => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  };

  return (
    <Container>
      <Sidebar>
        <label>
          <input
             type="checkbox"
            checked={visibleCharts.ToothChart}
            onChange={() => handleRadioChange('ToothChart')}
          />
          Tooth Chart
        </label>
        <label>
          <input
             type="checkbox"
            checked={visibleCharts.PeriodontalChart}
            onChange={() => handleRadioChange('PeriodontalChart')}
          />
          Periodontal Chart
        </label>
       <label>
          <input
            type="checkbox"
            checked={visibleCharts.RBLChart}
            onChange={() => handleRadioChange('RBLChart')}
          />
          RBL Chart
        </label>
      </Sidebar>
      <Content>
        {visibleCharts.ToothChart && <ToothChart />}
        {visibleCharts.PeriodontalChart && <PeriodontalChart />}
        {visibleCharts.RBLChart && <RBLChart />}
      </Content>
    </Container>
  );
};

export default Analysis;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100vh;
  margin-left: 5%;
  gap: -20%;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  margin-left: 11%;
  margin-top: 10%;
  padding: 10px;
  border-right: 2px solid #ffffff;
  width: 200px; 
  background-color: #252525; 
  color: #ffffff;
  border-radius: 5%;
  
  label {
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;
    align-items: center; 
  }

  input {
    margin-right: 5px;
  }
`;


const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
