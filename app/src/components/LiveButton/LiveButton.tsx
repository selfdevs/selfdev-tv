import React, { useEffect } from 'react';
import Button, { ButtonVariant } from '../Button/Button';
import { getObsClient } from '../../utils/obs';

type LiveButtonProps = {
  style?: React.CSSProperties;
};

const LiveButton = ({ style }: LiveButtonProps) => {
  const [isLive, setIsLive] = React.useState<boolean>(false);

  const getLiveStatus = async () => {
    const client = await getObsClient();
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
