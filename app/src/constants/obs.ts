import { OBSEventTypes } from 'obs-websocket-js';

export const SCENE_NAMES = ['fallback', 'schedule', 'slot1', 'slot2'];

export const EVENTS: Array<keyof OBSEventTypes> = [
  'CurrentProgramSceneChanged',
  'SceneTransitionStarted',
  'SceneTransitionEnded',
  'MediaInputPlaybackEnded',
  'MediaInputPlaybackStarted',
  'MediaInputActionTriggered',
  'StreamStateChanged',
  'InputShowStateChanged',
  'InputVolumeChanged',
  'InputMuteStateChanged',
  'InputNameChanged',
  'InputRemoved',
];
