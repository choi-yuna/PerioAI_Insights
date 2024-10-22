import React from 'react';
import styled from 'styled-components';

const Analysis = () => {
  return (
    <Container>
      <Title>Tooth Chart</Title>
    </Container>
  );
};

export default Analysis;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: 100vh;
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 30px;
  color: #003250;
`;
