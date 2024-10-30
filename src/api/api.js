// src/api/postIniFile.js
import axios from 'axios';

export const postIniFile = async (iniFile) => {
  const formData = new FormData();
  formData.append('file', iniFile.file); // 서버의 @RequestParam("file")과 이름을 맞춤

  try {
    const response = await axios.post('http://localhost:8080/api/upload-ini', formData, {
    });
    console.log("Server response:", response.data);
    return response.data; // 서버로부터 반환된 데이터 (JSON)
  } catch (error) {
    console.error("Error posting ini file:", error);
    throw error;
  }
};
