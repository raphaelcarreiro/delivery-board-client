import styled, { css, keyframes } from 'styled-components';

interface CardContainerProps {
  readonly face: string;
  readonly color: string;
}

interface CardProps {
  readonly background: string;
}

const slide = keyframes`
  from {
    transform: translateX(-300px);
  }

  to {
    transform: translateX(0);
  }
`;

export const Scene = styled.div`
  max-width: 350px;
  height: 200px;
  perspective: 600px;
  width: 100%;
  animation: ${slide} 0.7s linear;
`;

export const CardContainer = styled.div<CardContainerProps>`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 1s;
  transform-style: preserve-3d;
  ${props => css`
    transform: ${props.face === 'back' ? 'rotateY(180deg)' : 'none'};
  `}
  font-weight: 600;
  color: ${({ color }) => color};
`;

export const CardFront = styled.div<CardProps>`
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  background: red;
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  border-radius: 4px;
  ${({ background }) => css`
    background-image: linear-gradient(141deg, ${background} 0%, ${background} 51%, ${background} 75%);
  `}
`;

export const CardBack = styled.div<CardProps>`
  position: absolute;
  height: 100%;
  width: 100%;
  backface-visibility: hidden;
  background: blue;
  transform: rotateY(180deg);
  display: flex;
  padding: 20px;
  border-radius: 4px;
  ${({ background }) => css`
    background-image: linear-gradient(141deg, ${background} 0%, ${background} 51%, ${background} 75%);
  `}
`;

export const CardNumber = styled.p`
  letter-spacing: 8px;
  margin-top: 30px;
  max-width: 300px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
`;

export const CardLineName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

export const CardName = styled.p`
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 14px;
  max-width: 240px;
  overflow: hidden;
  white-space: nowrap;
`;

export const CardLogo = styled.div`
  width: 55px;
  height: 35px;
  background: #999;
  border-radius: 4px;
`;

export const CardValidity = styled.span`
  font-size: 14px;
  letter-spacing: 2px;
`;

export const CardSecurityCode = styled.span`
  font-size: 14px;
  display: inline-flex;
  border: 3px solid #f04449;
  height: 55px;
  width: 55px;
  border-radius: 50%;
  position: absolute;
  top: -7px;
  align-items: center;
  justify-content: center;
`;

export const CardBlackLine = styled.div`
  width: 100%;
  height: 50px;
  background: #232129;
  position: absolute;
  left: 0;
`;

export const CardLineSecurityCode = styled.div`
  margin-top: 70px;
  background: #fff;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  position: relative;
  color: #232129;
  border-radius: 4px;
`;
