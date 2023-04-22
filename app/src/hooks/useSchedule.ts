import { useEffect, useRef, useState } from 'react';
import { getEnvOrThrow } from '../utils/env';

const useSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(`${getEnvOrThrow('VITE_API_URL')}/schedule`);
      const data = await response.json();
      setSchedule(data);
    };

    fetchSchedule();

    intervalRef.current = setInterval(fetchSchedule, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return schedule;
};

export default useSchedule;
