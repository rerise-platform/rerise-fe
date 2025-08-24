import styled from 'styled-components';

const ProgramCard = ({ program, onVisit }) => {
  const handleVisit = () => {
    if (onVisit) {
      onVisit(program);
    }
  };

  return (
    <CardContainer>
      <VisitButton onClick={handleVisit}>사이트 방문하기</VisitButton>
      <ProgramTitle>{program.title}</ProgramTitle>
      <ProgramTarget>대상: {program.target}</ProgramTarget>
      <ProgramContent>
        <ContentLabel>내용:</ContentLabel>
        <ContentList>
          {program.content.map((item, index) => (
            <ContentItem key={index}>{item}</ContentItem>
          ))}
        </ContentList>
      </ProgramContent>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: #FFFFFF5C;
  border: 1px solid #40EA87;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;

  @media (max-width: 360px) {
    padding: 16px;
  }
`;

const VisitButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background-color: #34C759;
  border: none;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 9px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: -0.1px;
  box-shadow: 0 1px 4px rgba(52, 199, 89, 0.3);

  &:hover {
    background-color: #2ea043;
  }

  @media (max-width: 360px) {
    padding: 4px 10px;
    font-size: 8px;
  }
`;

const ProgramTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
  padding-right: 80px;

  @media (min-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

const ProgramTarget = styled.div`
  font-size: 10px;
  color: #666;
  margin-bottom: 8px;
  letter-spacing: -0.1px;
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 360px) {
    font-size: 9px;
  }
`;

const ProgramContent = styled.div`
  font-size: 10px;
  color: #666;
  line-height: 1.5;
  letter-spacing: -0.1px;

  @media (min-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 360px) {
    font-size: 9px;
  }
`;

const ContentLabel = styled.div`
  margin-bottom: 4px;
`;

const ContentList = styled.ul`
  margin: 0;
  padding-left: 12px;
`;

const ContentItem = styled.li`
  margin-bottom: 2px;
  line-height: 1.5;
`;

export default ProgramCard;