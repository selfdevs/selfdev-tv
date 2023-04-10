import React, { useEffect } from 'react';
import obsClient from '../services/ObsClient';

const useCurrentScene = () => {
  const [currentScene, setCurrentScene] = React.useState<string>('fallback');

  const tick = () => {
    obsClient.getCurrentScene()?.then((scene) => {
      setCurrentScene(scene);
    });
  };

  useEffect(() => {
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return currentScene;
};

export default useCurrentScene;
