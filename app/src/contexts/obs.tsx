import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import OBSWebSocket from 'obs-websocket-js';
import { getEnvOrThrow } from '../utils/env';
import { useNavigate } from 'react-router';

type OBSContext = {
  getOBSClient: () => Promise<OBSWebSocket | undefined>;
  connect: (password: string) => Promise<void>;
};

const obsContext = createContext<OBSContext>({
  getOBSClient: () => {
    throw new Error('getOBSClient not implemented');
  },
  connect: () => {
    throw new Error('Connect not implemented');
  },
});

export const OBSProvider = ({ children }: PropsWithChildren) => {
  const client = useRef<OBSWebSocket>(new OBSWebSocket());
  const navigate = useNavigate();

  const connect = async (password: string) => {
    console.log('Connecting to OBS');
    try {
      await client.current.connect(
        getEnvOrThrow('VITE_OBS_WEBSOCKET_URL'),
        password,
      );
      localStorage.setItem('obsPassword', password);
    } catch (e) {
      navigate('/');
      console.error(e);
    }
  };

  const getOBSClient = async () => {
    try {
      const data = await client.current.call('GetVersion');
      return client.current;
    } catch (e) {
      console.error(e);
      navigate('/');
    }
  };

  const contextValue = useMemo(
    () => ({
      getOBSClient,
      connect,
    }),
    [getOBSClient, connect],
  );

  useEffect(() => {
    const localPassword = localStorage.getItem('obsPassword');
    if (localPassword) {
      connect(localPassword).then(() => {
        navigate('mosaic');
      });
    }
    client.current.on('ConnectionClosed', (e) => {
      console.log('Connection closed');
      navigate('/');
    });
    client.current.on('ConnectionError', () => {
      console.log('Connection error');
      navigate('/');
    });
  }, []);

  return (
    <obsContext.Provider value={contextValue}>{children}</obsContext.Provider>
  );
};

export const useOBS = () => useContext(obsContext);
