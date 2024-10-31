import React, { useEffect, useState, useContext } from 'react';
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
import { UploadContext } from '../context/UploadContext';

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
  const { parsedData } = useIniDataContext();
  const { uploadedFiles, handleFolderUpload, setSelectedFile } = useContext(UploadContext);
  const [maxillaryData, setMaxillaryData] = useState(null);
  const [mandibularData, setMandibularData] = useState(null);

  useEffect(() => {
    if (!parsedData) return;

    const normalizeData = (data) => {
      return data.map((val) => {
        if (val <= 0) return 0;
        else if (val >= 500) return 2;
        else return val / 250;
      });
    };

    const createChartData = (isMaxillary) => {
      const labels = [];
      const bdData = [];
      const cejDataPoints = [];

      const teethOrder = isMaxillary
        ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
        : [31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 47];

      teethOrder.forEach((toothNum) => {
        const toothData = parsedData[toothNum];

        if (!toothData) {
          console.warn(`Data for tooth number ${toothNum} not found.`);
          return;
        }

        labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);

        const boneYPoints = toothData.adjustedBonePoints?.map((point) => point.y) || [0, 0, 0];
        const cejYPoints = toothData.adjustedCejPoints?.map((point) => point.y) || [0, 0, 0];

        const avgBoneY = boneYPoints.reduce((sum, y) => sum + y, 0) / boneYPoints.length;
        const avgCejY = cejYPoints.reduce((sum, y) => sum + y, 0) / cejYPoints.length;

        bdData.push(avgBoneY, avgBoneY, avgBoneY);
        cejDataPoints.push(avgCejY, avgCejY, avgCejY);
      });

      return {
        labels,
        datasets: [
          {
            label: 'BD (치조골)',
            data: normalizeData(bdData),
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: 'CD (CEJ)',
            data: normalizeData(cejDataPoints),
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      };
    };

    setMaxillaryData(createChartData(true));
    setMandibularData(createChartData(false));
  }, [parsedData]);

  if (!maxillaryData || !mandibularData) {
    return <p>Loading chart...</p>;
  }

  return (
    <ChartsContainer>
      <ChartWrapper>
        <ChartTitle>Maxillary (상악) Periodontal Chart</ChartTitle>
        <Line
          data={maxillaryData}
          options={{
            responsive: true,
            aspectRatio: 3, // x축 길이를 늘리기 위해 가로 비율을 설정
            scales: {
              y: {
                min: 0,
                max: 2,
                ticks: {
                  stepSize: 1,
                  callback: (value) => `${value}`,
                },
                title: {
                  display: true,
                  text: 'Y축 (CEJ/Bone)',
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
        <ChartTitle>Mandibular (하악) Periodontal Chart</ChartTitle>
        <Line
          data={mandibularData}
          options={{
            responsive: true,
            aspectRatio: 3, // x축 길이를 늘리기 위해 가로 비율을 설정
            scales: {
              y: {
                min: 0,
                max: 2,
                ticks: {
                  stepSize: 1,
                  callback: (value) => `${value}`,
                },
                title: {
                  display: true,
                  text: 'Y축 (CEJ/Bone)',
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

export default PeriodontalChart;

const ChartsContainer = styled.div`
  width: 60%;
  max-width: 1400px; 
  height: 30%;
  margin: 1% auto;
`;

const ChartWrapper = styled.div`
  background-color: #fcfcfc;
  width: 100%;
  max-width: 1400px; 
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px; 
  border: 3px solid #acacacc3;
`;

const ChartTitle = styled.h2`
  text-align: center;
  font-size: 1.3em;
  margin: 20px 0;
`;
