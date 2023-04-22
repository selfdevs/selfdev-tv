import React, { useEffect, useMemo, useRef } from 'react';
import mire from '../../assets/mire.jpeg';
import './preview.css';
import useCurrentScene from '../../hooks/useCurrentScene';
import { useOBS } from '../../contexts/obs';

type Props = {
  style?: React.CSSProperties;
  endpoint: string;
};

const Preview = ({ style, endpoint }: Props) => {
  const currentScene = useCurrentScene();
  const [image, setImage] = React.useState<string>(mire);
  const ticket = useRef<number>();
  const { getOBSClient } = useOBS();

  useEffect(() => {
    ticket.current = setInterval(async () => {
      const client = await getOBSClient();
      if (!client) return;
      const { imageData } = await client.call('GetSourceScreenshot', {
        sourceName: endpoint === 'program' ? currentScene : endpoint,
        imageFormat: 'jpeg',
      });
      setImage(imageData);
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
