import { useEffect, useState } from 'react';

const useMedia = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await fetch(`http://localhost:3000/media`);
      const data = await response.json();
      setMedia(data);
    };

    fetchMedia();
  }, []);

  return media;
};

export default useMedia;
