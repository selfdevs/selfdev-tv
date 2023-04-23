import React, { FormEventHandler, useEffect, useState } from 'react';
import Button from '../Button/Button';
import { useOBS } from '../../contexts/obs';
import { SCENE_NAMES } from '../../constants/obs';
import TextInput from '../TextInput/TextInput';

function getWatermarkInSceneItems(
  sceneItems: Record<any, any>[],
): Record<any, any> | undefined {
  return sceneItems.find((item) => item.sourceName === 'watermark');
}

const Settings = () => {
  const [streamKey, setStreamKey] = useState('');
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

  const getStreamSettings = async () => {
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    const { streamServiceSettings } = await client.call(
      'GetStreamServiceSettings',
    );
    console.log(streamServiceSettings);
    setStreamKey(streamServiceSettings.key as string);
  };

  const setStreamSettings: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    const formData = new FormData(e.target as HTMLFormElement);
    const newStreamKey = formData.get('streamKey') as string;
    await client.call('SetStreamServiceSettings', {
      streamServiceType: 'rtmp_common',
      streamServiceSettings: {
        key: newStreamKey,
      },
    });
  };

  useEffect(() => {
    void getWatermarkStatus();
    void getStreamSettings();
  }, []);

  return (
    <>
      <Button onClick={toggleWatermark} compact active={isWatermarkEnabled}>
        Show/hide watermark
      </Button>
      <form onSubmit={setStreamSettings}>
        <TextInput
          name="streamKey"
          placeholder="Stream key"
          defaultValue={streamKey}
          type="text"
        />
        <Button type="submit">Save</Button>
      </form>
    </>
  );
};

export default Settings;
