// @ts-ignore

import React, { CSSProperties, useEffect } from 'react';
// @ts-ignore
import shaka from 'shaka-player/dist/shaka-player.compiled';
// @ts-ignore
import mire from '../assets/mire.jpeg';
import './player.styles.css';

type Props = {
  endpoint: string;
  style?: CSSProperties;
};

const Player = ({ endpoint, style }: Props) => {
  const playerRef = React.useRef(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const loadLive = async () => {
    if (!playerRef.current) {
      try {
        playerRef.current = new shaka.Player(videoRef.current);
        playerRef.current.configure({
          streaming: {
            lowLatencyMode: true,
          },
        });
        await playerRef.current.load(
          `https://broadcast.talpa-world.com/${
            endpoint === 'program' ? 'out' : 'live'
          }/dash/${endpoint}.mpd`,
        );
      } catch (error) {
        console.warn(error);
      }
    }
  };

  useEffect(() => {
    void loadLive();
  }, []);

  return (
    <div className="player-container" style={style}>
      <span className="player-label">{endpoint}</span>
      <video ref={videoRef} autoPlay muted poster={mire}></video>
    </div>
  );
};

export default Player;
