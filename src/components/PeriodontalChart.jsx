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

    const createChartData = (isMaxillary) => {
      const labels = [];
      const bdData = [];
      const cejDataPoints = [];

      const teethOrder = isMaxillary
        ? [11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26, 27]
        : [31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 47];

      teethOrder.forEach((toothNum) => {
        const bonePoints = parsedData.bonePointsByNum[toothNum] || [[0, 0]];
        const cejPoints = parsedData.cejPointsByNum[toothNum] || [[0, 0]];
        const { minY, maxY } = parsedData.teethExtremes[toothNum] || { minY: 0, maxY: 1 };

        labels.push(`${toothNum}-Left`, `${toothNum}`, `${toothNum}-Right`);

        const transformY = (yValue) => {
          return isMaxillary
            ? ((yValue - minY) / (maxY - minY)) * 2
            : ((maxY - yValue) / (maxY - minY)) * 2;
        };

        bdData.push(
          transformY(bonePoints[0]?.[1]),
          transformY(bonePoints[Math.floor(bonePoints.length / 2)]?.[1]),
          transformY(bonePoints[bonePoints.length - 1]?.[1])
        );
        cejDataPoints.push(
          transformY(cejPoints[0]?.[1]),
          transformY(cejPoints[Math.floor(cejPoints.length / 2)]?.[1]),
          transformY(cejPoints[cejPoints.length - 1]?.[1])
        );
      });

      return {
        labels,
        datasets: [
          {
            label: 'BD (치조골)',
            data: bdData,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
          },
          {
            label: 'CD (CEJ)',
            data: cejDataPoints,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            tension: 0.1,
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
                stepSize: 0.5,
                callback: (value) => `${value}`,
              },
              title: {
                display: true,
                text: 'Y축',
              },
            },
            x: {
              title: {
                display: true,
                text: '치아 번호',
              },
              ticks: {
                callback: (value, index) => {
                  return index % 3 === 1 ? maxillaryData.labels[index] : '';
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
                stepSize: 0.5,
                callback: (value) => `${value}`,
              },
              title: {
                display: true,
                text: 'Y축',
              },
            },
            x: {
              title: {
                display: true,
                text: '치아 번호',
              },
              ticks: {
                callback: (value, index) => {
                  return index % 3 === 1 ? mandibularData.labels[index] : '';
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
  width: 70%;
  height: 90%;
  margin: 0 auto;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
`;
