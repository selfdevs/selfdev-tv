import React, { MouseEventHandler, useEffect } from 'react';
import './button.css';

type Props = {
  active?: boolean;
  variant?: ButtonVariant;
  pending?: boolean;
  containerStyle?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
  compact?: boolean;
  disabled?: boolean;
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
  disabled,
  compact = false,
  ...props
}: Props) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [blinker, setBlinker] = React.useState(false);

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    onMouseDown && onMouseDown(e);
    setIsPressed(true);
  };

  const handleMouseUp: MouseEventHandler<HTMLButtonElement> = (e) => {
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
    }, 100);
    return () => clearInterval(interval);
  }, [pending]);

  return (
    <div className="button-container" style={containerStyle}>
      <button
        data-variant={variant}
        data-active={pending ? blinker : active}
        data-pressed={isPressed}
        data-compact={compact}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={disabled}
        {...props}
      >
        <span>{children}</span>
      </button>
    </div>
  );
};

export default Button;
