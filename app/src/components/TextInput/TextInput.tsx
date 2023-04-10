import React from 'react';
import './textInput.css';

type Props = {
  type?: 'text' | 'password';
  name?: string;
} & React.HTMLAttributes<HTMLInputElement>;

const TextInput = (props: Props) => {
  return <input {...props} />;
};

export default TextInput;
