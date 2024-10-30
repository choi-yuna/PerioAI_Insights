import axios from 'axios';

export const postIniFile = async (iniFile) => {
    try {
        const formData = new FormData();
        formData.append("file", iniFile); // 서버가 요구하는 이름에 맞춰서 "file"로 지정합니다.

        const response = await axios.post('http://localhost:8080/api/upload-ini', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // multipart 형식 설정
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error posting ini file:", error);
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
