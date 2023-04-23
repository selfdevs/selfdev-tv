import React, { useEffect, useRef, useState } from 'react';
import Button, { ButtonVariant } from '../Button/Button';
import { useOBS } from '../../contexts/obs';

type LiveButtonProps = {
  style?: React.CSSProperties;
};

const LiveButton = ({ style }: LiveButtonProps) => {
  const [pending, setPending] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const interval = useRef<number>();
  const { getOBSClient } = useOBS();

  const getLiveStatus = async () => {
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    const { outputActive } = await client.call('GetStreamStatus');
    setIsLive(outputActive);
  };

  const toggleLive = async () => {
    setPending(true);
    try {
      const client = await getOBSClient();
      if (!client) return console.error('No client');
      if (isLive) {
        await client.call('StopStream');
        client.on('StreamStateChanged', ({ outputState }) => {
          void getLiveStatus();
          if (outputState === 'OBS_WEBSOCKET_OUTPUT_STOPPED') setPending(false);
        });
      } else {
        await client.call('StartStream');
        client.on('StreamStateChanged', ({ outputState }) => {
          void getLiveStatus();
          if (outputState === 'OBS_WEBSOCKET_OUTPUT_STARTED') setPending(false);
        });
      }
    } catch (e) {
      setPending(false);
    }
  };

  useEffect(() => {
    void getLiveStatus();
    interval.current = setInterval(() => {
      void getLiveStatus();
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <Button
      variant={ButtonVariant.RED}
      active={isLive}
      pending={pending}
      onClick={toggleLive}
      containerStyle={style}
    >
      LIVE
    </Button>
  );
};

export default LiveButton;
