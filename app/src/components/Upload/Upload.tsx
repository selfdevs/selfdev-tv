import React from 'react';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';
import { getEnvOrThrow } from '../../utils/env';

const Upload = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [filePicking, setFilePicking] = React.useState<string>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    fetch(`${getEnvOrThrow('VITE_API_URL')}/upload`, {
      method: 'POST',
      body: formData,
    }).then(() => setLoading(false));
  };

  console.log(filePicking);
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="video">
        <Button
          type="button"
          onClick={() => {
            const input = document.getElementById('video');
            input.click();
            setFilePicking('pending');
          }}
          pending={filePicking === 'pending'}
          active={filePicking !== 'idle' && filePicking !== 'pending'}
        >
          {filePicking !== 'idle' && filePicking !== 'pending'
            ? filePicking
            : 'File...'}
        </Button>
        <input
          type="file"
          name="video"
          accept={'.mp4'}
          onChange={(e) => {
            setFilePicking(e.target.files[0].name);
          }}
          id="video"
          style={{ width: 0, height: 0 }}
        />
      </label>
      <TextInput type="text" name="name" placeholder="Name" />
      <Button type="submit" pending={loading}>
        Upload
      </Button>
    </form>
  );
};

export default Upload;
