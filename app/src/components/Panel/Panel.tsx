import React, { useEffect, useMemo } from 'react';
import './panel.styles.css';
import useCurrentScene from '../../hooks/useCurrentScene';
import Button, { ButtonVariant } from '../Button/Button';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import Schedule from '../Schedule/Schedule';
import { getObsClient } from '../../utils/obs';

type Props = {
  style?: React.CSSProperties;
};

type RadioProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentValue: string;
};

const Radio = ({ value, onChange, currentValue }: RadioProps) => {
  const checked = useMemo(() => value === currentValue, [value, currentValue]);

  return (
    <input
      type="radio"
      onChange={onChange}
      name="slot"
      value={value}
      defaultChecked={checked}
    />
  );
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
      <Button
        variant={ButtonVariant.RED}
        pending
        containerStyle={{
          gridColumn: 19,
          gridRow: 5,
        }}
      >
        LIVE
      </Button>
    </div>
  );
};

export default Panel;
