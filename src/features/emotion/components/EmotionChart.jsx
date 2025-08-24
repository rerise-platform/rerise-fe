import React from 'react';
import styled from 'styled-components';

const EmotionChart = ({ emotions }) => {
  // 최근 7일간의 감정 데이터 처리
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const chartData = last7Days.map(date => {
    const emotion = emotions?.find(e => e.date === date);
    return {
      date,
      level: emotion?.emotion_level || 0,
      dayName: new Date(date).toLocaleDateString('ko-KR', { weekday: 'short' })
    };
  });

  const maxLevel = 5;
  const chartHeight = 200;

  return (
    <ChartContainer>
      <ChartTitle>최근 7일 감정 변화</ChartTitle>
      <ChartWrapper>
        <YAxis>
          {[5, 4, 3, 2, 1].map(level => (
            <YAxisLabel key={level}>{level}</YAxisLabel>
          ))}
        </YAxis>
        
        <ChartArea>
          <Grid>
            {[1, 2, 3, 4, 5].map(level => (
              <GridLine key={level} $level={level} />
            ))}
          </Grid>
          
          <DataArea>
            {chartData.map((data, index) => (
              <DataColumn key={data.date}>
                <DataBar 
                  $height={data.level ? (data.level / maxLevel) * 100 : 0}
                  $hasData={data.level > 0}
                />
                <DayLabel>{data.dayName}</DayLabel>
              </DataColumn>
            ))}
            
            {/* 연결선 그리기 */}
            <svg 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80%' }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                points={chartData.map((data, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = data.level ? 100 - (data.level / maxLevel) * 100 : 100;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#40ea87"
                strokeWidth="0.5"
                opacity="0.7"
              />
            </svg>
          </DataArea>
        </ChartArea>
      </ChartWrapper>
      
      <ChartLegend>
        <LegendItem>
          <LegendColor $color="#40ea87" />
          <LegendText>감정 레벨</LegendText>
        </LegendItem>
      </ChartLegend>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: center;
`;

const ChartWrapper = styled.div`
  display: flex;
  height: 200px;
  gap: 12px;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding: 20px 0;
  width: 20px;
`;

const YAxisLabel = styled.span`
  font-size: 12px;
  color: #666;
  text-align: center;
`;

const ChartArea = styled.div`
  flex: 1;
  position: relative;
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 0;
`;

const GridLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: #f0f0f0;
  top: ${props => 20 + ((5 - props.$level) / 4) * 160}px;
`;

const DataArea = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: flex-end;
  padding: 20px 0;
  gap: 4px;
`;

const DataColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const DataBar = styled.div`
  width: 100%;
  max-width: 24px;
  height: ${props => props.$height}%;
  background: ${props => props.$hasData ? '#40ea87' : '#f0f0f0'};
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  margin-bottom: auto;
  margin-top: ${props => 100 - props.$height}%;
`;

const DayLabel = styled.span`
  font-size: 11px;
  color: #666;
  margin-top: 8px;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${props => props.$color};
`;

const LegendText = styled.span`
  font-size: 12px;
  color: #666;
`;

export default EmotionChart;
