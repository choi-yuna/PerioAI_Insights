import React, { useContext } from 'react';
import styled from 'styled-components';
import ToothChart from '../../components/toothChart';

import { useIniDataContext } from '../../context/IniDataContext'; // IniDataContext에서 훅 임포트
import PeriodontalChart from '../../components/PeriodontalChart';

const Analysis = () => {
  const { parsedData } = useIniDataContext(); // INI 데이터 가져오기
  console.log(parsedData);

  return (
    <Container>
      <ToothChart/>
      <PeriodontalChart/>
    </Container>
  );
};

export default Analysis;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;
