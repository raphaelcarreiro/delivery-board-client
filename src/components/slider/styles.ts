import styled from 'styled-components';

type SliderContentProps = {
  transition: number;
  translateValue: number;
};

type SlideProps = {
  imageSrc: string;
  mobileImageSrc: string;
};

type SliderProps = {
  hasBanners: boolean;
};

type ArrowProps = {
  direction: 'right' | 'left';
};

export const Slider = styled.div<SliderProps>`
  position: relative;
  overflow: hidden;
  @media (max-width: 1000px) {
    margin: 0 25px;
  }
`;

export const SliderContent = styled.div<SliderContentProps>`
  transform: translateX(-${props => props.translateValue}px);
  transition: transform ease-out ${props => props.transition}s;
  display: flex;
`;

export const Slide = styled.a<SlideProps>`
  display: block;
  height: 100%;
  width: 100%;
  background-image: url('${props => props.imageSrc}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
  @media (max-width: 600px) {
    background-image: url('${props => props.mobileImageSrc}');
  }
`;

export const Arrow = styled.button<ArrowProps>`
  display: flex;
  position: absolute;
  top: 50%;
  ${props => (props.direction === 'right' ? `right: -20px` : `left: -20px`)};
  height: 40px;
  width: 40px;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  align-items: center;
  transition: background ease-in 0.1s;
  border: 1px solid #ccc;
  z-index: 10;
  &:hover {
    background: #eee;
  }
  @media (max-width: 1000px) {
    ${props => (props.direction === 'right' ? `right: 0px` : `left: 0px`)};
  }
`;
