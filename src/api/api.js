// src/api/postIniFile.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL_INTERNAL || process.env.REACT_APP_API_URL_EXTERNAL || 'http://localhost:8080',
});

export const postIniAndJsonFiles = async (iniFile, jsonFile, dcmFile) => {
  const formData = new FormData();
  formData.append('iniFile', iniFile.file); // 서버의 @RequestParam("iniFile")과 이름을 맞춤
  formData.append('jsonFile', jsonFile.file); // 서버의 @RequestParam("jsonFile")과 이름을 맞춤
  formData.append('dcmFile', dcmFile.file); // 서버의 @RequestParam("dcmFile")과 이름을 맞춤

  try {
    const response = await apiClient.post('/api/upload-ini-json', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Server response:", response.data);
    return response.data; // 서버로부터 반환된 데이터 (JSON)
  } catch (error) {
    console.error("Error posting ini and json files:", error);
    throw error;
  }
};
