import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../css/MapView.css';
import colors from '../../scss/colors.module.scss';
import {
  calculateWaveDistribution,
  calculateDistributionDifference,
} from '../../utils/distributionUtils';
import zoomInIcon from '../../assets/icon-zoomIn-s.svg';
import zoomOutIcon from '../../assets/icon-zoomOut-s.svg';
import friendsColoredIcon from '../../assets/icon-friends-colored-xl.svg';
import familyColoredIcon from '../../assets/icon-family-colored-xl.svg';
import religionColoredIcon from '../../assets/icon-religion-colored-xl.svg';
import workColoredIcon from '../../assets/icon-work-colored-xl.svg';
import leisureColoredIcon from '../../assets/icon-leisure-colored-xl.svg';
import politicsColoredIcon from '../../assets/icon-politics-colored-xl.svg';
import geoJson from '../../Data/countriesGeo.json?url';
import HelpIcon from '../layout/HelpIcon.jsx';
import typography from '../../scss/countryOverviewTypography.module.scss';
import overlayStyle from '../../scss/mapOverlay.module.scss';

const THEMES = {
  impFamily: { min: colors.colorFamilyLight, max: colors.colorFamilyDark },
  impWork: { min: colors.colorWorkLight, max: colors.colorWorkDark },
  impPolitics: {
    min: colors.colorPoliticsLight,
    max: colors.colorPoliticsDark,
  },
  impFriends: { min: colors.colorFriendsLight, max: colors.colorFriendsDark },
  impLeisure: { min: colors.colorLeisureLight, max: colors.colorLeisureDark },
  impReligion: {
    min: colors.colorReligionLight,
    max: colors.colorReligionDark,
  },
};

const NO_DATA_PATTERN_ID = 'trendmap-no-data-pattern';
const DIMENSION_META = {
  impFamily: {
    label: 'Family',
    icon: familyColoredIcon,
    color: colors.colorFamilyPrimary,
  },
  impFriends: {
    label: 'Friends',
    icon: friendsColoredIcon,
    color: colors.colorFriendsPrimary,
  },
  impLeisure: {
    label: 'Leisure',
    icon: leisureColoredIcon,
    color: colors.colorLeisurePrimary,
  },
  impPolitics: {
    label: 'Politics',
    icon: politicsColoredIcon,
    color: colors.colorPoliticsPrimary,
  },
  impWork: {
    label: 'Work',
    icon: workColoredIcon,
    color: colors.colorWorkPrimary,
  },
  impReligion: {
    label: 'Religion',
    icon: religionColoredIcon,
    color: colors.colorReligionPrimary,
  },
};

const MapView = ({ data, activeDimension, activeWaves }) => {
  const mapRef = useRef(null);
  const geoLayerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

  const waveA = activeWaves[0];
  const waveB = activeWaves[1];
  const navigate = useNavigate();

  useEffect(() => {
    const bounds = [
      [-90, -180],
      [90, 180],
    ];

    const map = L.map(mapRef.current, {
      zoomControl: false,
      minZoom: 2,
      maxZoom: 5,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    }).setView([20, 0], 2);

    setMapInstance(map);
    mapRef.current.mapInstance = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!mapRef.current || !data) return;
    const map = mapRef.current.mapInstance;
    if (!map) return;

    if (geoLayerRef.current) {
      if (map.hasLayer(geoLayerRef.current)) {
        geoLayerRef.current.remove();
      }
    }

    const waveData = data.filter((d) => activeWaves.includes(Number(d.wave)));

    const countryChanges = d3.rollup(
      waveData,
      (records) => {
        const waveARecords = records.filter((d) => Number(d.wave) === waveA);
        const waveBRecords = records.filter((d) => Number(d.wave) === waveB);

        const { dist: distA } = calculateWaveDistribution(
          waveARecords,
          activeDimension,
        );
        const { dist: distB } = calculateWaveDistribution(
          waveBRecords,
          activeDimension,
        );

        if (waveARecords.length === 0 || waveBRecords.length === 0) {
          return null;
        }

        return Number(calculateDistributionDifference(distA, distB));
      },
      (d) => d.countryCode,
    );

    const activeTheme = THEMES[activeDimension] || THEMES.impFamily;

    const colorScale = d3
      .scaleLinear()
      .domain([1, 30])
      .range([activeTheme.min, activeTheme.max])
      .clamp(true);

    d3.json(geoJson).then((geojsonData) => {
      if (!isMounted) return;

      geojsonData.features.forEach((feature) => {
        const code = feature.properties['ISO3166-1-Alpha-3'];
        feature.properties.value = countryChanges.get(code) ?? null;
      });

      function getColor(d) {
        if (d === null || d === undefined) return '#e0e0e0';
        return colorScale(d);
      }

      function style(feature) {
        return {
          fillColor: getColor(feature.properties.value),
          weight: 0.5,
          opacity: 1,
          color: '#9e9e9e',
          fillOpacity: 0.85,
        };
      }

      geoLayerRef.current = L.geoJSON(geojsonData, {
        style,
        onEachFeature: (feature, layer) => {
          const value = feature.properties.value;
          const valStr = value === null ? 'No Data' : `${value}%`;
          const clickText =
            value !== null ? '<br /><b>Click for details</b>' : '';

          layer.bindTooltip(
            `<b>${feature.properties.name}</b><br/>Percentage of Change: ${valStr}${clickText}`,
            { sticky: true },
          );
          if (feature.properties.value !== null) {
            layer.on({
              click: () => {
                const countryCode = feature.properties['ISO3166-1-Alpha-3'];
                navigate(`/trends/${countryCode}`);
              },
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 1,
                  color: '#666',
                  fillOpacity: 0.9,
                });
                layer.bringToFront();
              },
              mouseout: (e) => {
                geoLayerRef.current.resetStyle(e.target);
              },
            });
          }
        },
      }).addTo(map);

      const svgRoot = map.getPanes()?.overlayPane?.querySelector('svg');
      if (svgRoot && !svgRoot.querySelector(`#${NO_DATA_PATTERN_ID}`)) {
        const defs = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'defs',
        );
        const pattern = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'pattern',
        );
        pattern.setAttribute('id', NO_DATA_PATTERN_ID);
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('width', '8');
        pattern.setAttribute('height', '8');
        pattern.setAttribute('patternTransform', 'rotate(45)');

        const background = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect',
        );
        background.setAttribute('width', '8');
        background.setAttribute('height', '8');
        background.setAttribute('fill', '#f0f0f0');

        const stripe = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line',
        );
        stripe.setAttribute('x1', '0');
        stripe.setAttribute('y1', '0');
        stripe.setAttribute('x2', '0');
        stripe.setAttribute('y2', '8');
        stripe.setAttribute('stroke', '#cccccc');
        stripe.setAttribute('stroke-width', '2');

        pattern.appendChild(background);
        pattern.appendChild(stripe);
        defs.appendChild(pattern);
        svgRoot.prepend(defs);
      }

      geoLayerRef.current.eachLayer((layer) => {
        if (layer.feature?.properties?.value == null && layer._path) {
          layer._path.setAttribute('fill', `url(#${NO_DATA_PATTERN_ID})`);
        }
      });

    });

    return () => {
      isMounted = false;
    };
  }, [data, activeDimension, activeWaves]);

  const handleZoomIn = () => {
    if (mapInstance) mapInstance.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstance) mapInstance.zoomOut();
  };

  const activeTheme = THEMES[activeDimension] || THEMES.impFamily;
  const activeDimensionMeta =
    DIMENSION_META[activeDimension] || DIMENSION_META.impFamily;

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div
        ref={mapRef}
        style={{
          height: '100%',
          width: '100%',
          zIndex: 1,
          backgroundColor: 'var(--color-culture-background)',
        }}
      />

      <div className={overlayStyle.topOverlay}>
        <img
          src={activeDimensionMeta.icon}
          alt=""
          className={overlayStyle.topOverlayIcon}
        />
        <div className={overlayStyle.topOverlayText}>
          <h1
            className={typography.overlayTitle}
            style={{
              textShadow: `
    -1px 0 0 #eeeeee,
    1px 0 0 #eeeeee,
    0 -1px 0 #eeeeee,
    0 1px 0 #eeeeee,
    -1px -1px 0 #eeeeee,
    1px -1px 0 #eeeeee,
    -1px 1px 0 #eeeeee,
    1px 1px 0 #eeeeee
  `,
            }}
          >
            Opinion Change of{' '}
            <span style={{ color: activeDimensionMeta.color }}>
              {activeDimensionMeta.label}
            </span>
          </h1>
          <p
            className={typography.overlaySubtitle}
            style={{
              textShadow: `
    -0.9px 0 0 #eeeeee,
    0.9px 0 0 #eeeeee,
    0 -0.9px 0 #eeeeee,
    0 0.9px 0 #eeeeee,
    -0.9px -0.9px 0 #eeeeee,
    0.9px -0.9px 0 #eeeeee,
    -0.9px 0.9px 0 #eeeeee,
    0.9px 0.9px 0 #eeeeee
  `,
            }}
          >
            % change in perceived importance between the two waves
          </p>
        </div>
      </div>

      <div className={overlayStyle.bottomOverlay}>
        <div className={overlayStyle.zoomGroup}>
          <button
            className={overlayStyle.iconButton}
            style={btnStyle}
            onClick={handleZoomIn}
          >
            <img src={zoomInIcon} alt="Zoom In" />
          </button>
          <button
            className={overlayStyle.iconButton}
            style={btnStyle}
            onClick={handleZoomOut}
          >
            <img src={zoomOutIcon} alt="Zoom Out" />
          </button>
        </div>

        <div className={`${overlayStyle.shadowCard} ${overlayStyle.legendCard}`}>
          <div className={overlayStyle.legendHeader}>
            <span className={typography.legendTitle}>
              Opinion Change
            </span>
            <HelpIcon
              active={false}
              placement="top"
              message="Opinion change shows the percentage of respondents who changed their answers between waves."
            />
          </div>

          <div className={overlayStyle.legendScaleRow}>
            <div className={overlayStyle.legendGradientGroup}>
              <div
                className={overlayStyle.legendGradientBar}
                style={{
                  background: `linear-gradient(to right, ${activeTheme.min}, ${activeTheme.max})`,
                }}
              />
              <div className={overlayStyle.legendTicks}>
                <span className={typography.legendTick}>0 %</span>
                <span className={typography.legendTick}>10 %</span>
                <span className={typography.legendTick}>20 %</span>
                <span className={typography.legendTick}>{'≥ 30 %'}</span>
              </div>
            </div>

            <div className={overlayStyle.legendNoData}>
              <div className={overlayStyle.legendNoDataBar} />
              <span
                className={`${typography.legendTick} ${overlayStyle.legendNoDataLabel}`}
              >
                No Data
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const btnStyle = {
  width: '36px',
  height: '36px',
  backgroundColor: '#fff',
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  padding: 0,
};

export default MapView;
