import React, { useState, useEffect, useContext } from 'react';
import { UploadContext } from '../context/UploadContext';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js 모듈 등록
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const PeriodontalChart = () => {
  const { uploadedFiles } = useContext(UploadContext);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles.find(file => file.name.endsWith('.ini')); // ini 파일 선택
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const parsedData = parseData(event.target.result); // 데이터를 파싱
          setChartData(parsedData);
        };
        reader.readAsText(file.file); // 파일 내용을 텍스트로 읽음
      }
    }
  }, [uploadedFiles]);

  // 데이터 파싱 함수
  const parseData = (rawData) => {
    const lines = rawData.split('\n');
    let bdPoints = []; // 치조골 데이터 (BD)
    let cdPoints = []; // CEJ 데이터 (CD)
    let currentType = ''; // 현재 데이터 유형 (BD 또는 CD)

    lines.forEach(line => {
      if (line.startsWith('BD')) {
        currentType = 'BD'; // 치조골 데이터
      } else if (line.startsWith('CD')) {
        currentType = 'CD'; // CEJ 데이터
      } else if (line.startsWith('P=')) {
        const [x, y] = line.slice(2).split(',').map(Number);
        if (currentType === 'BD') {
          bdPoints.push({ x, y });
        } else if (currentType === 'CD') {
          cdPoints.push({ x, y });
        }
      }
    });

    // 차트 데이터 생성
    return {
      labels: bdPoints.map((point) => point.x), // X축은 좌표의 x값
      datasets: [
        {
          label: 'BD (치조골)',
          data: bdPoints.map(point => point.y),
          borderColor: 'blue',
          borderWidth: 2, // 선의 두께를 추가
          fill: false,
          tension: 0.1, // 선이 직선이 되도록 설정
        },
        {
          label: 'CD (CEJ)',
          data: cdPoints.map(point => point.y),
          borderColor: 'red',
          borderWidth: 2, // 선의 두께를 추가
          fill: false,
          tension: 0.1, // 선이 직선이 되도록 설정
        }
      ],
    };
  };

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return (
    <ChartContainer>
      <h2>Periodontal Chart</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              min: 0,   // 이빨의 시작
              max: 2,   // 이빨의 끝
              ticks: {
                stepSize: 0.5,
                callback: function(value) {
                  if (value === 0) return "시작";
                  if (value === 1) return "중간";
                  if (value === 2) return "끝";
                  return value;
                }
              },
              title: {
                display: true,
                text: '이빨의 세로 축'
              }
            },
            x: {
              title: {
                display: true,
                text: '좌표'
              }
            }
          }
        }}
      />
    </ChartContainer>
  );
};

export default PeriodontalChart;

const ChartContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;

