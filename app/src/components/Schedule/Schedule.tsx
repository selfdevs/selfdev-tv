import React from 'react';
import useMedia from '../../hooks/useMedia';
import Upload from '../Upload/Upload';
import Button from '../Button/Button';
import { getEnvOrThrow } from '../../utils/env';

const Schedule = () => {
  const media = useMedia();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const startTime = formData.get('startTime');
    const mediaId = formData.get('mediaId');
    console.log({ startTime, mediaId });
    fetch(`${getEnvOrThrow('VITE_API_URL')}/queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startTime, mediaId }),
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="datetime-local" name="startTime" />
        <select name="mediaId">
          {media.map((media) => (
            <option key={media.id} value={media.id}>
              {media.name}
            </option>
          ))}
        </select>
        <Button type="submit">Schedule</Button>
      </form>
      <Upload />
    </div>
  );
};

export default Schedule;
