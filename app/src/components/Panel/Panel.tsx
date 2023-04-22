import React, { useEffect, useMemo } from 'react';
import './panel.css';
import useCurrentScene from '../../hooks/useCurrentScene';
import Button, { ButtonVariant } from '../Button/Button';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import Schedule from '../Schedule/Schedule';
import LiveButton from '../LiveButton/LiveButton';
import { useOBS } from '../../contexts/obs';
import Fallback from '../Fallback/Fallback';

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
      <Button
        onClick={() => handleChange('fallback')}
        active={currentScene === 'fallback'}
        pending={pendingScene === 'fallback'}
        variant={ButtonVariant.GOLD}
      >
        Fallback
      </Button>
      <Button
        onClick={() => handleChange('schedule')}
        active={currentScene === 'schedule'}
        pending={pendingScene === 'schedule'}
        variant={ButtonVariant.GOLD}
      >
        Schedule
      </Button>
      <Button
        onClick={() => handleChange('slot1')}
        active={currentScene === 'slot1'}
        pending={pendingScene === 'slot1'}
        variant={ButtonVariant.GOLD}
      >
        Slot 1
      </Button>
      <Button
        onClick={() => handleChange('slot2')}
        active={currentScene === 'slot2'}
        pending={pendingScene === 'slot2'}
        variant={ButtonVariant.GOLD}
      >
        Slot 2
      </Button>
      <div
        style={{
          gridColumn: '7 / 19',
          gridRow: '2 / 10',
        }}
      >
        <Routes>
          <Route path="/scheduler" element={<Schedule />} />
          <Route path="/fallback" element={<Fallback />} />
        </Routes>
      </div>
      <Button
        onClick={() => navigate('fallback')}
        active={pathname.endsWith('fallback')}
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
        containerStyle={{
          gridColumn: 19,
          gridRow: 3,
        }}
      >
        Scheduler
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
