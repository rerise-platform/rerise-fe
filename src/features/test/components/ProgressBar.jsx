import React from 'react';
import styled from 'styled-components';

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <Container>
      <Progress $width={progress} />
      <Text>{current} / {total}</Text>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  position: relative;
  margin: 1rem 0;
`;

const Progress = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.$width}%;
  background-color: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const Text = styled.div`
  position: absolute;
  top: -1.5rem;
  right: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

export default ProgressBar;
