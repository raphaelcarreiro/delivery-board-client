import styled, { keyframes } from 'styled-components';

const placeHolderShimmer = keyframes`
  from {
    background-position: -468px 0;
  }
  to {
    background-position: 468px 0;
  }
`;

export const AnimatedBackground = styled.div`
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${placeHolderShimmer};
  animation-timing-function: linear;
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
  position: relative;
`;
