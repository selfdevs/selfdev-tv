import React from 'react';
import useMedia from '../../hooks/useMedia';
import Button from '../Button/Button';
import { getEnvOrThrow } from '../../utils/env';
import Select from '../Select/Select';
import TextInput from '../TextInput/TextInput';

export type Media = {
  id: string;
  name: string;
  filename: string;
};

const Schedule = () => {
  const media = useMedia();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const startTime = formData.get('startTime');
    const mediaId = formData.get('mediaId');
    const title = formData.get('title');
    const description = formData.get('description');
    fetch(`${getEnvOrThrow('VITE_API_URL')}/queue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startTime, mediaId, title, description }),
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>
          Selecting a media is optional. If you don't select a media, the
          schedule will do nothing, but you can manually switch to the desired
          scene.
        </p>
        <TextInput type="datetime-local" name="startTime" />
        <Select name="mediaId">
          <option value="">None</option>
          {media.map((media: Media) => (
            <option key={media.id} value={media.id}>
              {media.name}
            </option>
          ))}
        </Select>
        <TextInput type="text" name="title" placeholder="Title" />
        <TextInput type="text" name="description" placeholder="Description" />
        <Button type="submit">Schedule</Button>
      </form>
    </div>
  );
};

export default Schedule;
