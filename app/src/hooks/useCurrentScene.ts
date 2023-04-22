import React, { useEffect } from 'react';
import { getObsClient } from '../utils/obs';

const useCurrentScene = () => {
  const [currentScene, setCurrentScene] = React.useState<string>('fallback');

  const tick = async () => {
    const client = await getObsClient();
    const { currentProgramSceneName } = await client.call(
      'GetCurrentProgramScene',
    );
    setCurrentScene(currentProgramSceneName);
  };

  useEffect(() => {
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return currentScene;
};

export default useCurrentScene;
