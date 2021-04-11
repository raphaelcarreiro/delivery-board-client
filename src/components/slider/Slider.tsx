import React, { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Slider as StyledSlider, SliderContent, Arrow } from './styles';

interface SliderProps extends HTMLAttributes<HTMLDivElement> {
  itemWidth: number;
  amount: number;
}

const Slider: React.FC<SliderProps> = ({ children, amount, itemWidth, className, ...rest }) => {
  const [steps, setSteps] = useState(amount);
  const [visibleItems, setVisibleItems] = useState(1);
  const [state, setState] = useState({
    translate: 0,
    transition: 0.45,
    activeIndex: 0,
  });

  const handleResize = useCallback(() => {
    const el = document.getElementById('slider');
    if (!el) return;

    const elementWidth = el.offsetWidth;
    const _visibleItems = Math.ceil(elementWidth / itemWidth) - 2;

    setVisibleItems(_visibleItems);

    setSteps(amount - _visibleItems);
  }, [amount, itemWidth]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  function nextSlide() {
    if (state.activeIndex === steps - 1)
      return setState({
        ...state,
        translate: 0,
        activeIndex: 0,
      });

    setState({
      ...state,
      activeIndex: state.activeIndex + 1,
      translate: (state.activeIndex + 1) * itemWidth,
    });
  }

  function prevSlide() {
    if (state.activeIndex === 0)
      return setState({
        ...state,
        translate: (steps - 1) * itemWidth,
        activeIndex: steps - 1,
      });

    setState({
      ...state,
      activeIndex: state.activeIndex - 1,
      translate: (state.activeIndex - 1) * itemWidth,
    });
  }

  return (
    <>
      {visibleItems < amount && (
        <>
          <Arrow onClick={prevSlide} direction="left">
            <FaChevronLeft />
          </Arrow>
          <Arrow onClick={nextSlide} direction="right">
            <FaChevronRight />
          </Arrow>
        </>
      )}
      <StyledSlider id="slider" hasBanners={steps > 0} className={className} {...rest}>
        <SliderContent translateValue={state.translate} transition={state.transition}>
          {children}
        </SliderContent>
      </StyledSlider>
    </>
  );
};

export default Slider;
