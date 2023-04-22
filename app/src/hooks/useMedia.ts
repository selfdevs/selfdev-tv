import { useEffect, useState } from 'react';
import { getEnvOrThrow } from '../utils/env';

const useMedia = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await fetch(`${getEnvOrThrow('VITE_API_URL')}/media`);
      const data = await response.json();
      setMedia(data);
    };

    fetchMedia();
  }, []);

  return media;
};

export default useMedia;
