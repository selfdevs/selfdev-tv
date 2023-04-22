import React, { useEffect, useMemo } from 'react';
import './panel.styles.css';
import useCurrentScene from '../../hooks/useCurrentScene';
import Button, { ButtonVariant } from '../Button/Button';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import Schedule from '../Schedule/Schedule';
import { getObsClient } from '../../utils/obs';
import LiveButton from '../LiveButton/LiveButton';

type Props = {
  style?: React.CSSProperties;
};

const Panel = ({ style }: Props) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [pendingScene, setPendingScene] = React.useState<string>('');
  const currentScene = useCurrentScene();

  const handleChange = async (newSceneName: string) => {
    setPendingScene(newSceneName);
    const client = await getObsClient();
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
        </Routes>
      </div>
      <Button
        onClick={() => navigate('/doc')}
        active={pathname === '/doc'}
        containerStyle={{
          gridColumn: 19,
          gridRow: 2,
        }}
      >
        Doc
      </Button>
      <Button
        onClick={() => navigate('/scheduler')}
        active={pathname === '/scheduler'}
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
