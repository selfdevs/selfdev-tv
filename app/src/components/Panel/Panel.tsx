import React, { useEffect, useMemo } from 'react';
import './panel.css';
import useCurrentScene from '../../hooks/useCurrentScene';
import Button, { ButtonVariant } from '../Button/Button';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import Schedule from '../Schedule/Schedule';
import LiveButton from '../LiveButton/LiveButton';
import { useOBS } from '../../contexts/obs';
import Fallback from '../Fallback/Fallback';
import Upload from '../Upload/Upload';
import Settings from '../Settings/Settings';
import { SCENE_NAMES } from '../../constants/obs';

type Props = {
  style?: React.CSSProperties;
};

const Panel = ({ style }: Props) => {
  const { pathname } = useLocation();
  const { getOBSClient } = useOBS();
  const navigate = useNavigate();
  const [pendingScene, setPendingScene] = React.useState<string>('');
  const currentScene = useCurrentScene();

  const handleChange = async (newSceneName: string) => {
    setPendingScene(newSceneName);
    const client = await getOBSClient();
    if (!client) {
      return console.error('No client');
    }
    await client.call('SetCurrentProgramScene', { sceneName: newSceneName });
  };

  useEffect(() => {
    setPendingScene('');
  }, [currentScene]);

  return (
    <div style={style} className="panel">
      {SCENE_NAMES.map((sceneName) => (
        <Button
          key={sceneName}
          onClick={() => handleChange(sceneName)}
          active={currentScene === sceneName}
          pending={pendingScene === sceneName}
          variant={ButtonVariant.GOLD}
        >
          {sceneName.toUpperCase()}
        </Button>
      ))}
      <div
        style={{
          gridColumn: '7 / 19',
          gridRow: '1 / 10',
        }}
      >
        <Routes>
          <Route path="/scheduler" element={<Schedule />} />
          <Route path="/fallback" element={<Fallback />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Button
        onClick={() => navigate('upload')}
        active={pathname.endsWith('upload')}
        compact
        containerStyle={{
          gridColumn: 19,
          gridRow: 1,
        }}
      >
        Media manager
      </Button>
      <Button
        onClick={() => navigate('fallback')}
        active={pathname.endsWith('fallback')}
        compact
        containerStyle={{
          gridColumn: 19,
          gridRow: 2,
        }}
      >
        Fallback settings
      </Button>
      <Button
        onClick={() => navigate('scheduler')}
        active={pathname.endsWith('scheduler')}
        compact
        containerStyle={{
          gridColumn: 19,
          gridRow: 3,
        }}
      >
        Scheduler
      </Button>
      <Button
        onClick={() => navigate('settings')}
        active={pathname.endsWith('settings')}
        compact
        containerStyle={{
          gridColumn: 19,
          gridRow: 4,
        }}
      >
        Stream settings
      </Button>
      <LiveButton
        style={{
          gridColumn: 19,
          gridRow: 5,
        }}
      />
    </div>
  );
};

export default Panel;
