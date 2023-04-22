/**
 * OBS WebSocket client
 * TS ignore because the package does not fit with ESM/Typescript
 */
// @ts-ignore
import OBSWebSocket from 'obs-websocket-js';
import { getEnvOrThrow } from './env';

export const getConnectedClient = async () => {
  const client = new OBSWebSocket();
  await client.connect(getEnvOrThrow('OBS_WEBSOCKET_URL'));
  return client;
};
