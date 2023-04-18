import { useEffect, useState } from 'react';
import { API_URL } from '../index';

const useMedia = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await fetch(`${API_URL}/media`);
      const data = await response.json();
      setMedia(data);
    };

    fetchMedia();
  }, []);

  return media;
};

export default useMedia;
