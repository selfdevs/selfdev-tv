import React, { useEffect } from 'react';
import Button, { ButtonVariant } from '../Button/Button';
import { useOBS } from '../../contexts/obs';

type LiveButtonProps = {
  style?: React.CSSProperties;
};

const LiveButton = ({ style }: LiveButtonProps) => {
  const [isLive, setIsLive] = React.useState<boolean>(false);
  const { getOBSClient } = useOBS();

  const getLiveStatus = async () => {
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    const { outputActive } = await client.call('GetStreamStatus');
    setIsLive(outputActive);
  };

  useEffect(() => {
    void getLiveStatus();
  }, []);

  return (
    <Button variant={ButtonVariant.RED} active={isLive} containerStyle={style}>
      LIVE
    </Button>
  );
};

export default LiveButton;
