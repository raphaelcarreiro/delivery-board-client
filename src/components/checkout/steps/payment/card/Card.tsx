import React from 'react';
import {
  CardFront,
  CardBack,
  CardContainer,
  Scene,
  CardNumber,
  CardName,
  CardLogo,
  CardSecurityCode,
  CardValidity,
  CardBlackLine,
  CardLineSecurityCode,
  CardLineName,
} from './styles';

type FaceType = 'front' | 'back';

interface CardProps {
  number: string;
  name: string;
  expirationDate: string;
  cvv: string;
  face: FaceType;
  background: string;
  color: string;
}

const Card: React.FC<CardProps> = ({ number, name, expirationDate, cvv, face, background, color }) => {
  return (
    <>
      <Scene>
        <CardContainer face={face} color={color}>
          <CardFront background={background}>
            <CardLogo />
            <CardNumber>{!number ? '**** **** **** ****' : number}</CardNumber>
            <CardLineName>
              <CardName>{!name ? 'NOME E SOBRENOME' : name}</CardName>
              <CardValidity>{!expirationDate ? 'MM/AA' : expirationDate}</CardValidity>
            </CardLineName>
          </CardFront>
          <CardBack background={background}>
            <CardBlackLine />
            <CardLineSecurityCode>
              <CardSecurityCode>{!cvv ? '***' : cvv}</CardSecurityCode>
            </CardLineSecurityCode>
          </CardBack>
        </CardContainer>
      </Scene>
    </>
  );
};

export default Card;
