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
import { useIniDataContext } from '../context/IniDataContext';

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

const RBLChart = () => {
  const { parsedData } = useIniDataContext();
  const [maxillaryData, setMaxillaryData] = useState(null);
  const [mandibularData, setMandibularData] = useState(null);

  useEffect(() => {
    if (!parsedData) return;

    const normalizeCejBoneData = (cejDistances, boneDistances) => {
      return cejDistances.map((cej, index) => {
        const bone = boneDistances[index];
        if (cej === null || bone === null) return null;
    
        // 차이 퍼센트 계산: ((CEJ 거리 - Bone 거리) / CEJ 거리) * 100
        const percentageDifference = Math.abs((cej-bone) / cej) * 100;
        return percentageDifference;
      });
    };
    

    const createCejBoneChartData = (isMaxillary) => {
      const labels = [];
      const cejBonePoints = [];

      // 상악과 하악 치아 번호를 구분
      const teethOrder = isMaxillary
        ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
        : [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

      teethOrder.forEach((toothNum) => {
        const toothData = parsedData[toothNum];

        if (!toothData || !toothData.adjustedCejPoints || !toothData.adjustedBonePoints) {
          labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);
          cejBonePoints.push(null, null, null);
          return;
        }

        labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);

        const cejDistances = toothData.adjustedCejPoints;
        const boneDistances = toothData.adjustedBonePoints;

        // 거리값을 백분율로 변환
        const percentages = normalizeCejBoneData(cejDistances, boneDistances);
        cejBonePoints.push(...percentages);
      });

      return {
        labels,
        datasets: [
          {
            label: ' RBL(%)',
            data: cejBonePoints,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            spanGaps: false,
          },
        ],
      };
    };

    setMaxillaryData(createCejBoneChartData(true));
    setMandibularData(createCejBoneChartData(false));
  }, [parsedData]);

  if (!maxillaryData || !mandibularData) {
    return <p>Loading chart...</p>;
  }

  return (
    <ChartsContainer>
      <ChartWrapper>
        <ChartTitle>Maxillary (상악) RBL (%) Chart</ChartTitle>
        <Line
          data={maxillaryData}
          options={{
            responsive: true,
            aspectRatio: 4,
            scales: {
              y: {
                min: 0,
                max: 100, // % 기준 Y축 범위 조정
                ticks: {
                  stepSize: 50,
                  callback: (value) => `${value}%`,
                },
                title: {
                  display: true,
                  text: 'Y축 (CEJ-Bone 거리 %)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: '치아 번호',
                },
                ticks: {
                  callback: (value, index) => {
                    return maxillaryData.labels[index];
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: true,
              },
            },
          }}
        />
      </ChartWrapper>
      <ChartWrapper>
        <ChartTitle>Mandibular (하악) RBL (%) Chart</ChartTitle>
        <Line
          data={mandibularData}
          options={{
            responsive: true,
            aspectRatio: 4,
            scales: {
              y: {
                min: 0,
                max: 100, // % 기준 Y축 범위 조정
                ticks: {
                  stepSize: 50,
                  callback: (value) => `${value}%`,
                },
                title: {
                  display: true,
                  text: 'Y축 (CEJ-Bone 거리 %)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: '치아 번호',
                },
                ticks: {
                  callback: (value, index) => {
                    return mandibularData.labels[index];
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: true,
              },
            },
          }}
        />
      </ChartWrapper>
    </ChartsContainer>
  );
};

export default RBLChart;

const ChartsContainer = styled.div`
  width: 95%;
  max-width: 1900px; 
  height: 30%;
  margin-top: 3%;

`;

const ChartWrapper = styled.div`
  background-color: #fcfcfc;
  width: 95%;
  max-width: 1500px; 
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px; 
  border: 3px solid #acacacc3;
`;

const ChartTitle = styled.h2`
  text-align: center;
  font-size: 1.2em;
  margin: 20px 0;
`;
