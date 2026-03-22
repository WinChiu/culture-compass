import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../css/MapView.css';
import colors from '../../scss/colors.module.scss';
import HelpIcon from '../layout/HelpIcon.jsx';
import typography from '../../scss/countryOverviewTypography.module.scss';
import overlayStyle from '../../scss/mapOverlay.module.scss';
import zoomInIcon from '../../assets/icon-zoomIn-s.svg';
import zoomOutIcon from '../../assets/icon-zoomOut-s.svg';
import friendsColoredIcon from '../../assets/icon-friends-colored-xl.svg';
import familyColoredIcon from '../../assets/icon-family-colored-xl.svg';
import religionColoredIcon from '../../assets/icon-religion-colored-xl.svg';
import workColoredIcon from '../../assets/icon-work-colored-xl.svg';
import leisureColoredIcon from '../../assets/icon-leisure-colored-xl.svg';
import politicsColoredIcon from '../../assets/icon-politics-colored-xl.svg';
import geoJson from '../../Data/countriesGeo.json?url';

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

const NO_DATA_PATTERN_ID = 'overviewmap-no-data-pattern';
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

const MapView = ({ data, activeDimension, activeWave, onCountryClick }) => {
  const mapRef = useRef(null);
  const geoLayerRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);

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

    const waveData = data.filter((d) => Number(d.wave) === activeWave);

    const countryMeans = d3.rollup(
      waveData,
      (v) => {
        const nums = v.map((d) => +d[activeDimension]).filter((n) => !isNaN(n));
        return nums.length ? d3.mean(nums) : 0;
      },
      (d) => d.countryCode,
    );

    const activeTheme = THEMES[activeDimension] || THEMES.impFamily;

    const colorScale = d3
      .scaleLinear()
      .domain([1, 4])
      .range([activeTheme.min, activeTheme.max])
      .clamp(true);

    d3.json(geoJson).then((geojsonData) => {
      if (!isMounted) return;

      geojsonData.features.forEach((feature) => {
        const code = feature.properties['ISO3166-1-Alpha-3'];
        feature.properties.value = 5 - countryMeans.get(code) || 0;
      });

      function getColor(d) {
        if (!d || d === 0) return '#e0e0e0';
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
          const valStr =
            feature.properties.value === 0
              ? 'No Data'
              : feature.properties.value.toFixed(2);
          layer.bindTooltip(
            `<b>${feature.properties.name}</b><br/>Mean Value: ${valStr}`,
            { sticky: true },
          );
          if (feature.properties.value !== 0) {
            layer.on({
              click: () => {
                if (onCountryClick) {
                  onCountryClick(feature.properties['ISO3166-1-Alpha-3']);
                }
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
        if (!layer.feature?.properties?.value && layer._path) {
          layer._path.setAttribute('fill', `url(#${NO_DATA_PATTERN_ID})`);
        }
      });

    });

    return () => {
      isMounted = false;
    };
  }, [data, activeDimension, activeWave, onCountryClick]);

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
    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
      }}
    >
      <div
        ref={mapRef}
        style={{
          height: '100%',
          width: '100%',
          zIndex: 1,
          backgroundColor: '#F5F8FA',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '36px',
          left: '21.6px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '14px',
          maxWidth: '520px',
          pointerEvents: 'none',
        }}
      >
        <img
          src={activeDimensionMeta.icon}
          alt=""
          style={{
            flexShrink: 0,
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
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
            Importance of{' '}
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
            Mean importance value for the selected survey wave
          </p>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'auto',
          }}
        >
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

        <div
          className={overlayStyle.shadowCard}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '10px 14px',
            borderRadius: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className={typography.legendTitle}
            >
              Mean importance value
            </span>
            <HelpIcon
              active={false}
              placement="top"
              message="The average importance rating given by respondents in each country for a specific cultural dimension. Values range from 1 (Not at all important) to 4 (Very important)."
            />
          </div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              minWidth: '220px',
              gap: '12px',
              marginTop: '4px',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div
                style={{
                  height: '10px',
                  width: '100%',
                  background: `linear-gradient(to right, ${activeTheme.min}, ${activeTheme.max})`,
                  borderRadius: '3px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span className={typography.legendTick}>1</span>
                <span className={typography.legendTick}>2</span>
                <span className={typography.legendTick}>3</span>
                <span className={typography.legendTick}>4</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minWidth: '45px',
              }}
            >
              <div
                style={{
                  height: '10px',
                  width: '100%',
                  backgroundColor: '#f0f0f0',
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, #cccccc 0, #cccccc 2px, transparent 2px, transparent 8px)',
                  borderRadius: '3px',
                }}
              />
              <span
                className={typography.legendTick}
                style={{ whiteSpace: 'nowrap' }}
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
