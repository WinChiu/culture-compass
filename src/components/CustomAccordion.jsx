import React, { useId, useState } from 'react';
import style from '../scss/filterSidebar.module.scss';
import IconChevron from '../assets/icon-chevon.svg';

export default function CustomAccordion({
  title,
  result,
  actions,
  children,
  defaultExpanded = false,
  className = '',
  titleClassName = '',
  resultClassName = '',
  contentClassName = '',
  headerStyle,
  triggerStyle,
  controlGroupStyle,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentId = useId();

  return (
    <section
      className={`${style['filterAccordion']} ${expanded ? style['filterAccordion--expanded'] : ''} ${className}`.trim()}
    >
      <div className={style['filterAccordion__header']} style={headerStyle}>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((prev) => !prev)}
          className={`${style['filterAccordion__trigger']} ${titleClassName}`.trim()}
          style={triggerStyle}
        >
          <span className={style['filterAccordion__titleContent']}>{title}</span>
          <span className={`${style['filterAccordion__result']} ${resultClassName}`.trim()}>
            {result}
          </span>
        </button>
        <div
          className={style['filterAccordion__controlGroup']}
          style={controlGroupStyle}
        >
          {actions ? <div className={style['filterAccordion__actions']}>{actions}</div> : null}
          <button
            type="button"
            aria-label={expanded ? 'Collapse section' : 'Expand section'}
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded((prev) => !prev)}
            className={style['filterAccordion__iconButton']}
          >
            <img
              src={IconChevron}
              alt=""
              aria-hidden="true"
              className={`${style['filterAccordion__icon']} ${expanded ? style['filterAccordion__icon--expanded'] : ''}`}
            />
          </button>
        </div>
      </div>
      <div
        id={contentId}
        className={`${style['filterAccordion__contentWrapper']} ${expanded ? style['filterAccordion__contentWrapper--expanded'] : ''}`}
      >
        <div
          className={`${style['filterAccordion__content']} ${contentClassName}`.trim()}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
