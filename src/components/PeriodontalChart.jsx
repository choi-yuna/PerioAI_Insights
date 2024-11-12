/**
 * 시스템명 : AI Dental and Periodontal Analyzer
 * 세부업무구분명 : 메인화면 >  > PeriodontalChart
 * 화면명 : 사이드 메뉴바 컴포넌트
 * 설명 : imageLoad, detection, analysis 메뉴바
 *
 * 파일명 : PeriodontalChart.jsx
 * 작성자 : 박진우, 최윤아
 * 작성일 : 2024. 11. 12.
 * --------------------------------------------------------------------
 * Modification Information
 * --------------------------------------------------------------------
 * 수정일               수정자            수정내용
 * --------------------------------------------------------------------
 * 2024. 11. 12.        최윤아           최초생성
 */

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
} 
from 'chart.js';
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

const PeriodontalChart = () => {
  const { parsedData } = useIniDataContext();
  const [maxillaryData, setMaxillaryData] = useState(null);
  const [mandibularData, setMandibularData] = useState(null);

  useEffect(() => {
    if (!parsedData) return;

    const normalizeData = (data) => {
      return data.map((val) => {
        if (val === null) return null;
        if (val <= 0) return null;
        else if (val >= 5) return 2;
        else return val / 2.5;
      });
    };

    const calculateMaxYValue = (data) => {
      const maxVal = Math.max(...data.filter((val) => val !== null));
      return Math.ceil(maxVal * 10) / 10 + 1;
    };

    const createChartData = (isMaxillary) => {
      const labels = [];
      const bdData = [];
      const cejDataPoints = [];
    
      const teethOrder = isMaxillary
        ? [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
        : [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
    
      teethOrder.forEach((toothNum) => {
        const toothData = parsedData[toothNum];
    
        if (!toothData || !toothData.adjustedBonePoints || !toothData.adjustedCejPoints) {
          labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);
          bdData.push(null, null, null);
          cejDataPoints.push(null, null, null);
          return;
        }
    
        labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);
    
        const boneDistances = toothData.adjustedBonePoints ?? [null, null, null];
        const cejDistances = toothData.adjustedCejPoints ?? [null, null, null];

        bdData.push(...normalizeData(boneDistances));
        cejDataPoints.push(...normalizeData(cejDistances));
      });

      const maxY = calculateMaxYValue([...bdData, ...cejDataPoints]);

      return {
        labels,
        datasets: [
          {
            label: 'BD (치조골)',
            data: bdData,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 1.5,
            spanGaps: false,
          },
          {
            label: 'CD (CEJ)',
            data: cejDataPoints,
            borderColor: 'red',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 1.5,
            spanGaps: false,
          },
        ],
        maxY, // normalize된 데이터로 max 값 계산
      };
    };

    const maxillaryChartData = createChartData(true);
    const mandibularChartData = createChartData(false);

    setMaxillaryData(maxillaryChartData);
    setMandibularData(mandibularChartData);
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
            aspectRatio: 4,
            scales: {
              y: {
                min: 0,
                max: maxillaryData.maxY,
                ticks: {
                  stepSize: 1,
                  callback: (value) => value,
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
                  callback: (value, index) => maxillaryData.labels[index],
                },
              },
            },
            plugins: {
              legend: { display: true },
              tooltip: { enabled: true },
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
            aspectRatio: 4,
            scales: {
              y: {
                min: 0,
                max: mandibularData.maxY,
                reverse: true,
                ticks: {
                  stepSize: 1,
                  callback: (value) => value,
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
                  callback: (value, index) => mandibularData.labels[index],
                },
              },
            },
            plugins: {
              legend: { display: true },
              tooltip: { enabled: true },
            },
          }}
        />
      </ChartWrapper>
    </ChartsContainer>
  );
};

export default PeriodontalChart;

const ChartsContainer = styled.div`
  width: 90%; 
  max-width: 1800px; 
  height: 30%;
  margin-top: 5%;
  margin-right: 5%;
`;

const ChartWrapper = styled.div`
  background-color: #fcfcfc;
  width: 100%;
  max-width: 1800px; 
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
