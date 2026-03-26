import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import DistributionView from '../components/countryDetail/DistributionView';
import style from '../scss/detailedCountryPage.module.scss';
import FilterSidebar from '../components/FilterSidebar';
import ResponsiveFilterSidebar from '../components/ResponsiveFilterSidebar';
import backIcon from '../assets/icon-back.svg';
import { getCountryName } from '../utils/countryMapping';

const DetailedCountryPage = ({
  data,
  countryWaves,
  filteredData,
  filteredDataWithoutCountry,
  activeWaves,
  setActiveWaves,
  activeDimension,
  setActiveDimension,
  filters,
  setFilters,
  WAVE_YEARS,
}) => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const availableWaves = countryWaves
    ? countryWaves[countryCode] || new Set()
    : new Set();

  const countrySpecificData = React.useMemo(() => {
    const sourceData = filteredDataWithoutCountry || filteredData;
    return sourceData.filter((d) => d.countryCode === countryCode);
  }, [filteredDataWithoutCountry, filteredData, countryCode]);

  return (
    <div className={style['detail-page-container']} data-theme={activeDimension}>
      <div className={style['country-banner']}>
        <div
          className={style['country-banner__back']}
          onClick={() => navigate('/trends')}
        >
          <img src={backIcon} alt="Back" />
        </div>
        <h1 className={style['country-banner__title']}>
          {getCountryName(countryCode)}
        </h1>
      </div>
      <main className={style['content-container']}>
        <DistributionView
          filteredData={countrySpecificData}
          activeWaves={activeWaves}
          onWaveChange={setActiveWaves}
          activeDimension={activeDimension}
          onDimensionChange={setActiveDimension}
        />
        <ResponsiveFilterSidebar>
          <FilterSidebar
            selectedCountry={countryCode}
            DIMENSIONS={null}
            activeDimension={activeDimension}
            setActiveDimension={setActiveDimension}
            activeWaves={activeWaves}
            setActiveWaves={setActiveWaves}
            WAVE_YEARS={WAVE_YEARS}
            data={data}
            filters={filters}
            setFilters={setFilters}
            filteredData={filteredData}
            filteredDataWithoutCountry={filteredDataWithoutCountry}
            availableWaves={availableWaves}
            allowWaveComparison
            viewMode="country"
          />
        </ResponsiveFilterSidebar>
      </main>
    </div>
  );
};

export default DetailedCountryPage;
