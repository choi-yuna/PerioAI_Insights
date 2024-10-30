import axios from 'axios';

export const postIniFile = async (iniFile) => {
  const formData = new FormData();
  formData.append('file', iniFile); // 서버에서 기대하는 키 이름 확인

  try {
    const response = await axios.post('http://localhost:8080/api/upload-ini', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // 서버로부터 반환된 데이터
  } catch (error) {
    console.error("Error posting ini file:", error);
    throw error;
  }
};
