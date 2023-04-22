import React, { useEffect, useRef } from 'react';
import { getObsClient } from '../../utils/obs';
import { OBSEventTypes } from 'obs-websocket-js';

type LogsProps = {
  style?: React.CSSProperties;
};

const Logs = ({ style }: LogsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = React.useState<string[]>(Array(100).fill('Logs'));

  const addLogAndScroll = (log: string) => {
    setLogs((logs) => [...logs, log]);
    containerRef.current?.scrollTo(0, containerRef.current?.scrollHeight);
  };

  const init = async () => {
    const client = await getObsClient();
    const events: Array<keyof OBSEventTypes> = [
      'CurrentProgramSceneChanged',
      'SceneTransitionStarted',
      'SceneTransitionEnded',
    ];
    events.forEach((event) => {
      client.on(event, (data: any) => {
        addLogAndScroll(`${event}: ${JSON.stringify(data)}`);
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
