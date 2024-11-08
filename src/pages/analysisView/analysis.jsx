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
  margin-left: 15%;
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
