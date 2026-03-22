import React, { useState } from 'react';
import infoIcon from '../../assets/icon-info.svg';
import styles from '../../scss/tooltip.module.scss';

const HelpIcon = ({ message, active, placement = 'bottom' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isTop = placement === 'top';

  const tooltipStyle = {
    position: 'absolute',
    left: '-10px',
    width: '220px',
    padding: '10px 14px',
    backgroundColor: '#21212B',
    color: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    zIndex: 99999,
    pointerEvents: 'none',
    textAlign: 'left',
    visibility: isHovered ? 'visible' : 'hidden',
    opacity: isHovered ? 1 : 0,
    transform: `translateY(${isHovered ? '0' : isTop ? '8px' : '-8px'})`,
    transition: 'all 0.2s ease-out',
    ...(isTop ? { bottom: '200%' } : { top: '200%' }),
  };

  const arrowStyle = {
    position: 'absolute',
    left: '14px',
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
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <img
        src={infoIcon}
        alt="info"
        style={{
          width: '16px',
          height: '16px',
          cursor: 'help',
          transition: 'filter 0.2s ease',
          filter: active
            ? 'brightness(0) invert(1)'
            : 'brightness(0) opacity(0.4)',
        }}
      />
      <div style={tooltipStyle} className={styles.tooltipContent}>
        {message}
        <div style={arrowStyle} />
      </div>
    </div>
  );
};

export default HelpIcon;
