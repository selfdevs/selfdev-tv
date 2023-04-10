import React, { useEffect, useMemo, useRef } from 'react';
// @ts-ignore
import mire from '../assets/mire.jpeg';
import './preview.styles.css';
import ObsClient from '../services/ObsClient';
import useCurrentScene from '../hooks/useCurrentScene';

type Props = {
  style?: React.CSSProperties;
  endpoint: string;
};

const Preview = ({ style, endpoint }: Props) => {
  const currentScene = useCurrentScene();
  const [image, setImage] = React.useState<string>(mire);
  const ticket = useRef<number>();

  useEffect(() => {
    ticket.current = setInterval(() => {
      ObsClient.getSourceScreenshot(
        endpoint === 'program' ? currentScene : endpoint,
      ).then((res) => {
        setImage(res);
      });
    }, 1000);

    return () => {
      clearInterval(ticket.current);
    };
  }, [currentScene]);

  const imageSource = useMemo(() => {
    return image;
  }, [image]);

  return (
    <div style={style} className="preview">
      <span className="preview-label">{endpoint}</span>
      <div>
        <img src={imageSource} alt="mire" />
      </div>
    </div>
  );
};

export default Preview;
