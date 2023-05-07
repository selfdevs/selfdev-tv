import { useEffect, useRef, useState } from 'react';
import { getEnvOrThrow } from '../utils/env';
import { io } from 'socket.io-client';

const useSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  const socket = io(`${window.location.hostname}:3000`);

  const fetchSchedule = async () => {
    const response = await fetch(`${getEnvOrThrow('VITE_API_URL')}/schedule`);
    const data = await response.json();
    setSchedule(data);
  };

  useEffect(() => {
    void fetchSchedule();
    socket.on('scheduleUpdate', () => {
      void fetchSchedule();
    });
  }, []);

  return schedule;
};

export default useSchedule;
