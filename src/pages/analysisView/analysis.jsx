import React, { useContext } from 'react';
import styled from 'styled-components';
import ToothChart from '../../components/toothChart';
import PeriodontalChart from '../../components/PeriodontalChart';
import  {UploadContext}  from '../../context/UploadContext';

const FileUpload = () => {
  const { handleFolderUpload } = useContext(UploadContext);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleFolderUpload(files);
  };

  return (
    <div>
      <input type="file" webkitdirectory="true" onChange={handleFileChange} />
    </div>
  );
};

const Analysis = () => {
  
  return (
    <Container>
      <ToothChart/>
      <PeriodontalChart />
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
