// src/api/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// INI 파일을 서버에 업로드하고 분석 결과를 가져오는 함수
export const postIniFile  = async (file) => {
    const formData = new FormData();
    formData.append('iniFile', file);

    try {
        const response = await axios.post(`${BASE_URL}/api/upload-ini`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        throw error;
    }
};

//서버 응답
export const getToothData = async () => {
    try {
        const response = await axios.get('/api/get-tooth-data');
        return response.data;  
    } catch (error) {
        console.error("Error getting tooth data:", error);
        throw error;
    }
};
