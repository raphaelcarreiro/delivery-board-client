import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  from {
    bottom: -100px;
  }
  to {
    bottom: 0;
  }
`;

export const InstallAppNotificationContainer = styled.div`
  position: fixed;
  bottom: -100px;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fafafa;
  animation: ${animation} 0.3s ease 6s;
  animation-fill-mode: forwards;

  height: 70px;

  span {
    max-width: 160px;
  }
`;
