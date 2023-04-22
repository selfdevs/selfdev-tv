import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { OBSEventTypes } from 'obs-websocket-js';
import { useOBS } from '../../contexts/obs';

type LogsProps = {
  style?: CSSProperties;
};

const Logs = ({ style }: LogsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>(['Logs:']);
  const { getOBSClient } = useOBS();

  const addLogAndScroll = (log: string) => {
    setLogs((logs) => [...logs, log]);
    containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight);
  };

  const init = async () => {
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    const events: Array<keyof OBSEventTypes> = [
      'CurrentProgramSceneChanged',
      'SceneTransitionStarted',
      'SceneTransitionEnded',
      'MediaInputPlaybackEnded',
      'MediaInputPlaybackStarted',
      'MediaInputActionTriggered',
    ];
    events.forEach((event) => {
      client.on(event, function (...args) {
        addLogAndScroll(`${event}: ${JSON.stringify(args[0])}`);
      });
    });
  };

  useEffect(() => {
    void init();
  }, []);

  return (
    <div ref={containerRef} style={{ ...style, overflowY: 'scroll' }}>
      {logs.map((entry, index) => (
        <span key={entry + index}>
          {entry}
          <br />
        </span>
      ))}
    </div>
  );
};

export default Logs;
