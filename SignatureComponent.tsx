import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const StyledDrawingWrapper = styled.canvas`
  position: relative;
  width: 100%;
  height: 40vh;
  margin: 10px 0;
  border: 1px solid black;
  cursor: 'pointer';
  touch-action: none;
`;

export const DrawingComponent = (props): ReactElement => {
  const {} = props;
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const currentContextRef = useRef(null);
  const [isPrepared, setIsPrepared] = useState(false);

  const prepareCanvas = (): void => {
    const canvas = canvasRef.current;
    canvas.width = canvasRef.current.clientWidth;
    canvas.height = canvasRef.current.clientHeight;

    const context = canvas.getContext('2d');
    context.scale(1, 1);
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    currentContextRef.current = context;
  };

  const startDrawing = (): void => {
    if (!isPrepared) {
      prepareCanvas();
      setIsPrepared(true);
    }
    currentContextRef.current.beginPath();
    setIsDrawing(true);
  };

  const finishDrawing = (event): void => {
    currentContextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (event): void => {
    if (!isDrawing) {
      return;
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = event.nativeEvent;
    if (event.type === 'touchmove') {
      const x = event.touches[0].clientX - rect.left;
      const y = event.touches[0].pageY - rect.top;
      if (
        x > 0 &&
        x < event.target.offsetWidth &&
        y > 0 &&
        y < event.target.offsetHeight
      ) {
        currentContextRef.current.lineTo(x, y);
        currentContextRef.current.stroke();
      }
    }

    if (event.type === 'mousemove') {
      if (
        offsetX > 0 &&
        offsetX < event.target.offsetWidth &&
        offsetY > 0 &&
        offsetY < event.target.offsetHeight
      ) {
        currentContextRef.current.lineTo(offsetX, offsetY);
        currentContextRef.current.stroke();
      }
    }
  };

  const convertToImage = (event): void => {
    const target = document.querySelector('#canvas') as HTMLCanvasElement;
    const dataUrl = target.toDataURL();
    const imageFoo = document.createElement('img');
    imageFoo.src = dataUrl;
    imageFoo.style.width = '100px';
    imageFoo.style.height = '100px';

    //document.body.appendChild(imageFoo);
  };

  return (
    <>
      <StyledDrawingWrapper
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onMouseMove={draw}
        onTouchMove={draw}
        ref={canvasRef}
        id="canvas"
      ></StyledDrawingWrapper>
      {/* //Placeholder button */}
      <Button
        style={{ backgroundColor: 'paleturquoise' }}
        onClick={convertToImage}
      >
        Convert to image
      </Button>
    </>
  );
};
