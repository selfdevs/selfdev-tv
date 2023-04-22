import React, { ReactNode } from 'react';
import './select.css';

type Props = {
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ children, name }: Props) => {
  return (
    <select className="select" name={name}>
      {children}
    </select>
  );
};

export default Select;
