import React from 'react';
import './display.css';

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const Display = ({ children, style }: Props) => {
  return (
    <div className="display" style={style}>
      {children}
    </div>
  );
};

export default Display;
