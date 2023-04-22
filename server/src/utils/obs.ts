/**
 * OBS WebSocket client
 * TS ignore because the package does not fit with ESM/Typescript
 */
// @ts-ignore
import OBSWebSocket from 'obs-websocket-js';
import { getEnvOrThrow } from './env';

const client = new OBSWebSocket();

export const getConnectedClient = async () => {
  await client.connect(
    getEnvOrThrow('OBS_WEBSOCKET_URL'),
    getEnvOrThrow('OBS_WEBSOCKET_PASSWORD'),
  );
  return client;
};
