import OBSWebSocket from 'obs-websocket-js';
import { getEnvOrThrow } from './env';

const client = new OBSWebSocket();
await client.connect(getEnvOrThrow('VITE_OBS_WEBSOCKET_URL'));

export async function getObsClient() {
  return client;
}
