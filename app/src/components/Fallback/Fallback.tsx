import React from 'react';
import useMedia from '../../hooks/useMedia';
import { Media } from '../Schedule/Schedule';
import Button from '../Button/Button';
import { useOBS } from '../../contexts/obs';
import Select from '../Select/Select';

const Fallback = () => {
  const media = useMedia();
  const { getOBSClient } = useOBS();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mediaFilename = event.currentTarget.mediaFilename.value;
    const client = await getOBSClient();
    if (!client) return console.error('No client');
    await client.call('SetInputSettings', {
      inputName: 'fallback_video',
      inputSettings: {
        // TODO: Make this configurable ASAP
        local_file: `/root/selfdev-tv/server/assets/${mediaFilename}`,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select name="mediaFilename">
        {media.map((media: Media) => (
          <option key={media.id} value={media.filename}>
            {media.name}
          </option>
        ))}
      </Select>
      <Button type="submit">Set fallback</Button>
    </form>
  );
};

export default Fallback;
