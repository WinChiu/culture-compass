import { useEffect, useState } from 'react';
import styles from '../scss/responsiveFilterSidebar.module.scss';

export default function ResponsiveFilterSidebar({
  children,
  buttonLabel = 'Filters',
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div className={styles.desktopContainer}>{!isOpen ? children : null}</div>

      <button
        type="button"
        className={styles.mobileFab}
        onClick={() => setIsOpen(true)}
        aria-label="Open filters"
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className={styles.mobileOverlay} role="dialog" aria-modal="true">
          <button
            type="button"
            className={styles.mobileBackdrop}
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          />
          <div className={styles.mobilePanel}>
            <div className={styles.mobileHeader}>
              <h2 className={styles.mobileTitle}>Filters</h2>
              <button
                type="button"
                className={styles.mobileClose}
                onClick={() => setIsOpen(false)}
                aria-label="Close filters"
              >
                Close
              </button>
            </div>
            <div className={styles.mobileContent}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
