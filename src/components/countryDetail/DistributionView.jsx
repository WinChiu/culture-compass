import { useMemo } from 'react';
import {
  calculateDistributionDifference,
  calculateWaveDistribution,
} from '../../utils/distributionUtils';
import BarChartView from './BarChartView';
import styles from '../../scss/detailedCountryPage.module.scss';
import friendsColoredIcon from '../../assets/icon-friends-colored-xl.svg';
import familyColoredIcon from '../../assets/icon-family-colored-xl.svg';
import religionColoredIcon from '../../assets/icon-religion-colored-xl.svg';
import workColoredIcon from '../../assets/icon-work-colored-xl.svg';
import leisureColoredIcon from '../../assets/icon-leisure-colored-xl.svg';
import politicsColoredIcon from '../../assets/icon-politics-colored-xl.svg';

const DIMENSIONS = [
  { id: 'impFamily', label: 'Family' },
  { id: 'impFriends', label: 'Friends' },
  { id: 'impLeisure', label: 'Leisure' },
  { id: 'impPolitics', label: 'Politics' },
  { id: 'impWork', label: 'Work' },
  { id: 'impReligion', label: 'Religion' },
];

const WAVE_YEARS = {
  2: '1989 - 1993',
  3: '1994 - 1998',
  4: '1999 - 2004',
  5: '2005 - 2009',
  6: '2010 - 2014',
  7: '2017 - 2022',
};

const DistributionView = ({
  filteredData,
  activeWaves,
  activeDimension,
  onDimensionChange,
}) => {
  const data = filteredData;
  const dimensionData = useMemo(() => {
    if (!data || !activeWaves || activeWaves.length !== 2 || !activeDimension)
      return null;

    const waveA = Math.min(...activeWaves);
    const waveB = Math.max(...activeWaves);
    const getDistribution = (waveStr, dimension) => {
      const recordsForWave = data.filter(
        (d) => String(d.wave) === String(waveStr),
      );
      return calculateWaveDistribution(recordsForWave, dimension);
    };

    const result = {};
    DIMENSIONS.forEach((dimObj) => {
      result[dimObj.id] = {
        waveA: getDistribution(waveA, dimObj.id),
        waveB: getDistribution(waveB, dimObj.id),
      };
    });

    return result;
  }, [data, activeWaves, activeDimension]);

  if (!dimensionData) {
    return <div>Waiting for data...</div>;
  }

  return (
    <div className={styles['left-column']}>
      <div className={styles['barChart-header']}>
        <img
          src={
            activeDimension === 'impFriends'
              ? friendsColoredIcon
              : activeDimension === 'impFamily'
                ? familyColoredIcon
                : activeDimension === 'impReligion'
                  ? religionColoredIcon
                  : activeDimension === 'impWork'
                    ? workColoredIcon
                    : activeDimension === 'impLeisure'
                      ? leisureColoredIcon
                      : politicsColoredIcon
          }
          alt=""
          className={styles['barChart-icon']}
        />
        <div className={styles['barChart-title__container']}>
          <h1 className={styles['barChart-title']}>
            Importance of{' '}
            <span className={styles['barChart-title__highlight']}>
              {DIMENSIONS.find((d) => d.id === activeDimension)?.label}
            </span>
          </h1>
          <p className={styles['barChart-subtitle']}>
            % of respondents within each wave selecting each option
          </p>
        </div>
        <div className={styles['barChart-legend__container']}>
          <div className={styles['barChart-legend__item']}>
            <span
              className={`${styles['barChart-legend-block-1']} ${styles['barChart-legend-block']}`}
            ></span>
            <span className={styles['barChart-legend-label']}>
              Wave {Math.min(...activeWaves)} (
              {WAVE_YEARS[Math.min(...activeWaves)]})
            </span>
          </div>
          <div className={styles['barChart-legend__item']}>
            <span
              className={`${styles['barChart-legend-block-2']} ${styles['barChart-legend-block']}`}
            ></span>
            <span className={styles['barChart-legend-label']}>
              Wave {Math.max(...activeWaves)} (
              {WAVE_YEARS[Math.max(...activeWaves)]})
            </span>
          </div>
        </div>
      </div>
      <div className={styles['plot__container']}>
        <BarChartView
          Wave1={dimensionData[activeDimension].waveA}
          Wave2={dimensionData[activeDimension].waveB}
        />
      </div>
      <div className={styles['cultureCard__container']}>
        {DIMENSIONS.map((dim) => {
          const isActive = dim.id === activeDimension;
          const dataRef = dimensionData[dim.id];
          const pctChange = calculateDistributionDifference(
            dataRef.waveA.dist,
            dataRef.waveB.dist,
          );

          return (
            <div
              key={dim.id}
              onClick={() => onDimensionChange(dim.id)}
              className={`${styles['cultureCard']} ${isActive ? styles.active : ''}`}
            >
              <div className={styles['cultureCard-title__container']}>
                <span className={styles['cultureCard-title-label']}>
                  Opinion Change of
                </span>
                <span className={styles['cultureCard-title-valueName']}>
                  {dim.label}
                </span>
              </div>
              <div className={styles['cultureCard-number']}>{pctChange}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DistributionView;
