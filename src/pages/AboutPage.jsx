import React from 'react';
import Header from '../components/layout/Header';

import FamilyIcon from '../assets/icon-family-l.svg';
import FriendsIcon from '../assets/icon-friends-l.svg';
import LeisureIcon from '../assets/icon-leisure-l.svg';
import PoliticsIcon from '../assets/icon-politics-l.svg';
import ReligionIcon from '../assets/icon-religion-l.svg';
import WorkIcon from '../assets/icon-work-l.svg';
import AgeIcon from '../assets/icon-age.svg';
import GenderIcon from '../assets/icon-gender.svg';
import MaritalIcon from '../assets/icon-marital.svg';
import EducationIcon from '../assets/icon-education.svg';
import EmploymentIcon from '../assets/icon-employment.svg';
import D3Icon from '../assets/icon-d3.svg';
import LeafletIcon from '../assets/icon-leaflet.svg';
import GeoIcon from '../assets/icon-geo.svg';
import textStyle from '../scss/aboutPage.module.scss';

const assetBase = import.meta.env.BASE_URL;

const team = [
  {
    name: 'Anton Fahlstedt',
    role: 'UI/UX Design & Front-end',
    photo: `${assetBase}team/anton.jpg`,
  },
  {
    name: 'Elias Bäckström',
    role: 'Data Processing & Front-end',
    photo: `${assetBase}team/elias.jpg`,
  },
  {
    name: 'Jintong Jiang',
    role: 'Data Collection & Front-end',
    photo: `${assetBase}team/jintong.jpg`,
  },
  {
    name: 'Paul Talakayala',
    role: 'UI/UX Design & Front-end',
    photo: `${assetBase}team/paul.jpg`,
  },
  {
    name: 'Wei-Chen Chiu',
    role: 'UI/UX Design & Front-end',
    photo: `${assetBase}team/weichen.jpg`,
  },
];

const valueDimensions = [
  { name: 'Family', icon: FamilyIcon },
  { name: 'Friends', icon: FriendsIcon },
  { name: 'Leisure', icon: LeisureIcon },
  { name: 'Politics', icon: PoliticsIcon },
  { name: 'Religion', icon: ReligionIcon },
  { name: 'Work', icon: WorkIcon },
];

const filterItems = [
  { name: 'Age', icon: AgeIcon },
  { name: 'Gender', icon: GenderIcon },
  { name: 'Marital Status', icon: MaritalIcon },
  { name: 'Education Level', icon: EducationIcon },
  { name: 'Employment Status', icon: EmploymentIcon },
];

export default function AboutPage() {
  return (
    <div style={styles.page}>
      <Header />
      <main style={styles.container}>
        <section style={styles.heroSection} className={textStyle.heroSection}>
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <div className={textStyle.cardHeader}>
                <h3 className={textStyle.cardTitle}>Culture Compass? What?</h3>
              </div>
              <p className={textStyle.bodyText}>
                An interactive visualisation platform built on the{' '}
                <a
                  href="https://www.worldvaluessurvey.org/"
                  target="_blank"
                  rel="noreferrer"
                  className={textStyle.inheritBoldLink}
                >
                  World Values Survey
                </a>
                . It enables exploration of cultural value differences across
                countries, time periods, and demographic groups.
              </p>
            </div>
            <div style={styles.card}>
              <div className={textStyle.cardHeader}>
                <h3 className={textStyle.cardTitle}>What it does?</h3>
              </div>
              <p className={textStyle.bodyText}>
                1. Compare countries across <b>value dimensions</b>
              </p>

              <div style={styles.valueGrid}>
                {valueDimensions.map((v) => (
                  <div
                    key={v.name}
                    style={styles.valuePill}
                    className={textStyle.pillText}
                  >
                    <img src={v.icon} style={styles.iconWhite} alt="" />{' '}
                    {v.name}
                  </div>
                ))}
              </div>

              <p className={textStyle.bodyText}>
                2. Collate with <b>filters</b>
              </p>

              <div style={styles.filterGrid}>
                {filterItems.map((item) => (
                  <div
                    key={item.name}
                    style={styles.filterPill}
                    className={textStyle.pillText}
                  >
                    <img src={item.icon} style={styles.iconDark} alt="" />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.imageColumn}>
            <div style={styles.imageWrapper}>
              <img
                src={`${assetBase}images/inspiration.png`}
                alt="Inspiration"
                style={styles.heroImage}
              />
            </div>

            <div style={styles.inspirationCard}>
              <div className={textStyle.cardHeaderLight}>
                <h3 className={textStyle.cardTitleWhite}>Our Inspiration</h3>
              </div>
              <p className={textStyle.bodyTextWhite}>
                Street chalk artwork near T-Centralen, reflecting cultural
                diversity.
              </p>
            </div>
          </div>
        </section>

        <section
          style={styles.abstractionGrid}
          className={textStyle.abstractionGrid}
        >
          <div style={styles.infoCard}>
            <div className={textStyle.cardHeader}>
              <h3 className={textStyle.cardTitle}>
                Data Abstraction & Provenance
              </h3>
            </div>
            <div style={styles.splitContent}>
              <div style={styles.column}>
                <h4 className={textStyle.subTitle}>Abstraction</h4>
                <p className={textStyle.bodyText}>
                  <b>Entity:</b> Participant
                </p>
                <p className={textStyle.bodyText}>
                  <b>Attributes:</b> Cultural Dimensions (Family, Friends,
                  Leisure, Politics, Work, Religion) & Demographics (Age,
                  Gender, Education, Employment, Marital Status)
                </p>
                <p className={textStyle.bodyText}>
                  <b>Dimensions:</b> Country, Wave
                </p>
              </div>

              <div style={styles.column}>
                <h4 className={textStyle.subTitle}>Provenance & Processing</h4>
                <p className={textStyle.bodyText}>
                  <b>Source:</b>{' '}
                  <a
                    href="https://www.worldvaluessurvey.org/"
                    target="_blank"
                    rel="noreferrer"
                    className={textStyle.inlineLink}
                  >
                    WVS
                  </a>{' '}
                  (Haerpfer et al.)
                </p>
                <p className={textStyle.bodyText}>
                  <b>Pipeline:</b> .stata → Column Extraction → OpenRefine
                  (Cleaning) → D3.js (Parsing)
                </p>
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div className={textStyle.cardHeader}>
              <h3 className={textStyle.cardTitle}>Task Abstraction</h3>
            </div>
            <p className={textStyle.bodyText}>
              Our tool allows the user to discover by exploring cultural values,
              identifying and comparing trends and distributions for values in
              different countries.
            </p>
          </div>
        </section>

        <section style={styles.videoSection}>
          <div style={styles.videoPlaceholder}>
            <iframe
              title="vimeo-player"
              src="https://www.youtube.com/embed/GClBglviEHA"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              frameBorder="0"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section style={styles.resourceSection}>
          <div style={styles.resourceCard}>
            <div className={textStyle.cardHeader}>
              <h3 className={textStyle.cardTitle}>References & Resources</h3>
            </div>
            <div style={styles.linkGrid}>
              <a
                href="https://observablehq.com/@d3/d3-group"
                target="_blank"
                rel="noreferrer"
                style={styles.resourceLink}
                className={textStyle.resourceLink}
              >
                <img src={D3Icon} style={styles.resourceIcon} alt="" />
                D3 Grouping
              </a>
              <a
                href="https://leafletjs.com/examples/choropleth/"
                target="_blank"
                rel="noreferrer"
                style={styles.resourceLink}
                className={textStyle.resourceLink}
              >
                <img src={LeafletIcon} style={styles.resourceIcon} alt="" />
                Leaflet Choropleth
              </a>
              <a
                href="https://github.com/datasets/geo-countries"
                target="_blank"
                rel="noreferrer"
                style={styles.resourceLink}
                className={textStyle.resourceLink}
              >
                <img src={GeoIcon} style={styles.resourceIcon} alt="" />
                Geo-JSON Data
              </a>
            </div>
          </div>
        </section>

        <section style={styles.teamSection}>
          <h3 className={textStyle.sectionTitle}>The Team</h3>
          <div style={styles.teamGrid}>
            {team.map((m) => (
              <div key={m.name} style={styles.teamCard}>
                <img src={m.photo} alt={m.name} style={styles.avatar} />
                <h5 className={textStyle.memberName}>{m.name}</h5>
                <p className={textStyle.roleText}>{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={styles.footer}>
          <hr style={styles.divider} />
          <h3 className={textStyle.footerTitle}>Academic Context</h3>
          <p className={textStyle.footerText}>
            Developed as part of the{' '}
            <b>DH2321 Interactive Data Visualization</b> course at KTH Royal
            Institute of Technology, Spring 2026.
          </p>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    background: '#F5F8FA',
    minHeight: '100vh',
    color: '#21212B',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '2.5rem 1.5rem 4rem',
    overflowX: 'hidden',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
    gap: '1.5rem',
    alignItems: 'stretch',
  },

  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minWidth: 0,
  },

  card: {
    background: '#E8F1F8',
    padding: '1.5rem',
    borderRadius: '1rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  valueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.875rem',
    margin: '0.5rem 0 0.75rem',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '0.875rem',
    margin: '0.5rem 0 0',
  },

  iconWhite: {
    width: '20px',
    height: '20px',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
  },
  iconDark: {
    width: '20px',
    height: '20px',
    objectFit: 'contain',
    filter: 'brightness(0)',
  },

  valuePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#066FD1',
    color: '#FFF',
    padding: '0.875rem 1.125rem',
    borderRadius: '0.5rem',
    minWidth: 0,
  },
  filterPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: '#FFF',
    border: '1.5px solid #21212B',
    color: '#21212B',
    padding: '0.875rem 1.125rem',
    borderRadius: '0.5rem',
    minWidth: 0,
  },
  teamSection: { marginTop: '4rem' },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  teamCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  avatar: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '8px',
    objectFit: 'cover',
    marginBottom: '16px',
  },
  imageColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    height: '100%',
    minWidth: 0,
  },
  imageWrapper: {
    flex: '1 1 auto',
    width: '100%',
    borderRadius: '1rem',
    overflow: 'hidden',
    display: 'flex',
  },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  inspirationCard: {
    background: '#1F6BC1',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '1rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  abstractionGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
    gap: '1.5rem',
    marginTop: '1.5rem',
    alignItems: 'stretch',
  },
  infoCard: {
    background: '#FFF',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  splitContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
    textAlign: 'left',
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  videoSection: {
    marginTop: '1.5rem',
    position: 'relative',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: '16 / 9',
    background: '#21212B',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  resourceSection: { marginTop: '1.5rem' },
  resourceCard: {
    background: '#E8F1F8',
    padding: '1.5rem',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  linkGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '0.25rem',
    width: '100%',
  },
  resourceLink: {
    flex: '1 1 220px',
    minWidth: 0,
    padding: '1rem 1.25rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: '#21212B',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    gap: '0.5rem',
  },
  resourceIcon: {
    width: '1rem',
    height: '1rem',
    objectFit: 'contain',
  },
  footer: { marginTop: '5rem' },
  divider: {
    border: 'none',
    borderTop: '1px solid #CBD5E1',
    marginBottom: '2rem',
  },
};
