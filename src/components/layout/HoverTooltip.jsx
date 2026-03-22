import React, { useState } from 'react';
import styles from '../../scss/tooltip.module.scss';

export default function HoverTooltip({
  message,
  children,
  placement = 'top',
  disabled = false,
  style,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isTop = placement === 'top';
  const showTooltip = Boolean(message) && !disabled;

  const tooltipStyle = {
    position: 'absolute',
    left: '50%',
    width: '220px',
    padding: '10px 14px',
    backgroundColor: '#21212B',
    color: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    zIndex: 99999,
    pointerEvents: 'none',
    textAlign: 'left',
    visibility: isHovered && showTooltip ? 'visible' : 'hidden',
    opacity: isHovered && showTooltip ? 1 : 0,
    transform: `translateX(-50%) translateY(${
      isHovered && showTooltip ? '0' : isTop ? '8px' : '-8px'
    })`,
    transition: 'all 0.2s ease-out',
    ...(isTop ? { bottom: 'calc(100% + 12px)' } : { top: 'calc(100% + 12px)' }),
  };

  const arrowStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '6px',
    borderStyle: 'solid',
    ...(isTop
      ? {
          top: '100%',
          borderColor: '#21212B transparent transparent transparent',
        }
      : {
          bottom: '100%',
          borderColor: 'transparent transparent #21212B transparent',
        }),
  };

  return (
    <span
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <div style={tooltipStyle} className={styles.tooltipContent}>
        {message}
        <div style={arrowStyle} />
      </div>
    </span>
  );
}
