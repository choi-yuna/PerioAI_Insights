import React from 'react';
import styled from 'styled-components';
import ToothChart from '../../components/toothChart';

const Analysis = () => {
  return (
    <Container>
      <ToothChart/>
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
