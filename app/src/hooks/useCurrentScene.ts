import React, { useEffect } from 'react';
import { useOBS } from '../contexts/obs';

const useCurrentScene = () => {
  const [currentScene, setCurrentScene] = React.useState<string>('fallback');
  const { getOBSClient } = useOBS();

  const tick = async () => {
    try {
      const client = await getOBSClient();
      if (!client) return console.error('No client');
      const { currentProgramSceneName } = await client.call(
        'GetCurrentProgramScene',
      );
      setCurrentScene(currentProgramSceneName);
    } catch (e) {
      console.error('Tick failed');
    }
  };

  useEffect(() => {
    void tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return currentScene;
};

export default useCurrentScene;
