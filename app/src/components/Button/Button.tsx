import React, { useEffect } from 'react';
import './button.css';

type Props = {
  active?: boolean;
  variant?: ButtonVariant;
  pending?: boolean;
  containerStyle?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
} & React.HTMLAttributes<HTMLButtonElement>;

export enum ButtonVariant {
  DEFAULT = 'DEFAULT',
  GOLD = 'GOLD',
  RED = 'RED',
}

const Button = ({
  active,
  variant = ButtonVariant.DEFAULT,
  pending,
  onMouseUp,
  onMouseDown,
  containerStyle,
  children,
  ...props
}: Props) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [blinker, setBlinker] = React.useState(false);

  const handleMouseDown = (e) => {
    onMouseDown && onMouseDown(e);
    setIsPressed(true);
  };

  const handleMouseUp = (e) => {
    onMouseUp && onMouseUp(e);
    setIsPressed(false);
  };

  useEffect(() => {
    if (!pending) {
      setBlinker(false);
      return;
    }
    setBlinker(true);
    const interval = setInterval(() => {
      setBlinker((state) => !state);
    }, 500);
    return () => clearInterval(interval);
  }, [pending]);

  return (
    <div className="button-container" style={containerStyle}>
      <button
        data-variant={variant}
        data-active={active || blinker}
        data-pressed={isPressed}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      >
        <span>{children}</span>
      </button>
    </div>
  );
};

export default Button;
