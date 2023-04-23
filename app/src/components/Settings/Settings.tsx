import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import { useOBS } from '../../contexts/obs';
import { SCENE_NAMES } from '../../constants/obs';

function getWatermarkInSceneItems(
  sceneItems: Record<any, any>[],
): Record<any, any> | undefined {
  return sceneItems.find((item) => item.sourceName === 'watermark');
}

const Settings = () => {
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState(false);
  const { getOBSClient } = useOBS();

  const toggleWatermark = async () => {
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    SCENE_NAMES.map(async (sceneName) => {
      const data = await client.call('GetSceneItemList', {
        sceneName: sceneName,
      });
      const { sceneItems } = data;
      const sceneItemToUpdate = getWatermarkInSceneItems(sceneItems);
      if (!sceneItemToUpdate) return;
      await client.call('SetSceneItemEnabled', {
        sceneName: sceneName,
        sceneItemId: sceneItemToUpdate.sceneItemId as number,
        sceneItemEnabled: !isWatermarkEnabled,
      });
    });
    setIsWatermarkEnabled((state) => !state);
  };

  const getWatermarkStatus = async () => {
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    const { sceneItems } = await client.call('GetSceneItemList', {
      sceneName: 'fallback',
    });
    const watermark = getWatermarkInSceneItems(sceneItems);
    if (!watermark) return;
    setIsWatermarkEnabled(watermark.sceneItemEnabled);
  };

  useEffect(() => {
    void getWatermarkStatus();
  }, []);

  return (
    <Button onClick={toggleWatermark} compact active={isWatermarkEnabled}>
      Show/hide watermark
    </Button>
  );
};

export default Settings;
