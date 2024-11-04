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

const TlaChart = () => {
  const { parsedData } = useIniDataContext();
  const [tlaData, setTlaData] = useState(null);

  useEffect(() => {
    if (!parsedData) return;

    const normalizeTlaData = (data) => {
      return data.map((val) => {
        if (val === null) return null;
        if (val <= 0) return null;
        else if (val >= 500) return 2;
        else return val / 250;
      });
    };

    const createTlaChartData = () => {
      const labels = [];
      const tlaPoints = [];

      const teethOrder = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
                          48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

      teethOrder.forEach((toothNum) => {
        const toothData = parsedData[toothNum];

        if (!toothData || !toothData.tlaPoints) {
          labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);
          tlaPoints.push(null, null, null);
          return;
        }

        labels.push(`${toothNum}-L`, `${toothNum}-C`, `${toothNum}-R`);

        const tlaYPoints = toothData.tlaPoints.map((point) => point?.y ?? null);
        const avgTlaY = tlaYPoints.some((y) => y !== null)
          ? tlaYPoints.reduce((sum, y) => (y !== null ? sum + y : sum), 0) / tlaYPoints.filter((y) => y !== null).length
          : null;

        tlaPoints.push(avgTlaY, avgTlaY, avgTlaY);
      });

      return {
        labels,
        datasets: [
          {
            label: 'TLA 선',
            data: normalizeTlaData(tlaPoints),
            borderColor: 'green',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            spanGaps: false,
          },
        ],
      };
    };

    setTlaData(createTlaChartData());
  }, [parsedData]);

  if (!tlaData) {
    return <p>Loading chart...</p>;
  }

  return (
    <ChartsContainer>
      <ChartWrapper>
        <ChartTitle>TLA Chart</ChartTitle>
        <Line
          data={tlaData}
          options={{
            responsive: true,
            aspectRatio: 3,
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
                  text: 'Y축 (TLA)',
                },
              },
              x: {
                title: {
                  display: true,
                  text: '치아 번호',
                },
                ticks: {
                  callback: (value, index) => {
                    return tlaData.labels[index];
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

export default TlaChart;

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
  font-size: 1.2em;
  margin: 20px 0;
`;
