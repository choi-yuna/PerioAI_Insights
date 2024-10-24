import React, { useEffect, useState } from 'react';
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
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // 차트 데이터 설정 (수동 더미 데이터로 테스트)
    const dummyData = {
      labels: ['Tooth 11', 'Tooth 12', 'Tooth 13', 'Tooth 14'], // X축 라벨 (치아 번호)
      datasets: [
        {
          label: 'BD (치조골)', // 치조골 데이터를 나타냄
          data: [1.2, 1.0, 1.4, 1.6], // Y축 데이터 (치조골 값)
          borderColor: 'blue', // 파란색 선
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
        {
          label: 'CD (CEJ)', // CEJ 데이터를 나타냄
          data: [0.8, 0.9, 1.1, 1.3], // Y축 데이터 (CEJ 값)
          borderColor: 'red', // 빨간색 선
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        }
      ],
    };

    setChartData(dummyData); // 더미 데이터를 설정
  }, []);

  if (!chartData) {
    return <p>Loading chart...</p>; // 데이터가 로드될 때까지 로딩 표시
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
              min: 0,   // 이빨의 시작 (0)
              max: 2,   // 이빨의 끝 (2)
              ticks: {
                stepSize: 0.5,
                callback: function(value) {
                  if (value === 0) return "0"; 
                  if (value === 1) return "1"; 
                  if (value === 2) return "2";  
                  return value;
                }
              },
              title: {
                display: true,
                text: 'Y축' // Y축 라벨
              }
            },
            x: {
              title: {
                display: true,
                text: '치아 번호' // X축 라벨 (치아 번호)
              }
            }
          }
        }}
      />
    </ChartContainer>
  );
};

export default PeriodontalChart;

// 스타일 컴포넌트 정의
const ChartContainer = styled.div`
  width: 50%;
  height: 10%;
  margin: 0 auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;

