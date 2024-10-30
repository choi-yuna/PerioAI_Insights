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
            tension: 0.4, // 곡선으로 보이게 설정
            pointRadius: 0, // 점을 숨김
          },
          {
            label: 'CD (CEJ)',
            data: normalizeData(cejDataPoints),
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            tension: 0.4, // 곡선으로 보이게 설정
            pointRadius: 0, // 점을 숨김
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
      <h2>Maxillary (상악) Periodontal Chart</h2>
      <Line
        data={maxillaryData}
        options={{
          responsive: true,
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
      <h2>Mandibular (하악) Periodontal Chart</h2>
      <Line
        data={mandibularData}
        options={{
          responsive: true,
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
    </ChartsContainer>
  );
};

export default PeriodontalChart;

const ChartsContainer = styled.div`
  width: 80%;
  height: 80%;
  margin: 0 auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;
