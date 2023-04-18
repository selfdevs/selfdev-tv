import { useEffect, useRef, useState } from 'react';
import { API_URL } from '../index';

const useSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await fetch(`${API_URL}/schedule`);
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
