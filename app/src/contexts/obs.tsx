import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import OBSWebSocket from 'obs-websocket-js';
import { getEnvOrThrow } from '../utils/env';
import { useLocation, useNavigate } from 'react-router';

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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const client = useRef<OBSWebSocket>(new OBSWebSocket());
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const connect = async (password: string) => {
    console.log('Connecting to OBS');
    try {
      await client.current.connect(
        getEnvOrThrow('VITE_OBS_WEBSOCKET_URL'),
        password,
      );
      await client.current.call('GetStreamStatus');
      console.log('Connection opened');
      localStorage.setItem('obsPassword', password);
      setIsConnected(true);
      if (pathname === '/') navigate('/mosaic');
    } catch (e) {
      navigate('/');
      setIsConnected(false);
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
      void connect(localPassword);
    } else {
      navigate('/');
    }
    client.current.on('ConnectionClosed', (e) => {
      console.log('Connection closed');
      setIsConnected(false);
      navigate('/');
    });
    client.current.on('ConnectionError', () => {
      console.log('Connection error');
      setIsConnected(false);
      navigate('/');
    });
  }, []);

  if (!isConnected && pathname !== '/') return null;

  return (
    <obsContext.Provider value={contextValue}>{children}</obsContext.Provider>
  );
};

export const useOBS = () => useContext(obsContext);
