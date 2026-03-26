import Header from '../components/layout/Header';
import MapView from '../components/countryOverview/TrendMapView';
import FilterSidebar from '../components/FilterSidebar';
import ResponsiveFilterSidebar from '../components/ResponsiveFilterSidebar';

import sharedStyle from '../scss/detailedCountryPage.module.scss';

const Trends = ({
  data,
  filteredData,
  filters,
  setFilters,
  activeWave,
  setActiveWave,
  activeWaves,
  setActiveWaves,
  countryWaves,
  activeDimension,
  setActiveDimension,
  filteredDataWithoutCountry,
  DIMENSIONS,
  WAVE_YEARS,
}) => {
  return (
    <div
      className={sharedStyle['detail-page-container']}
      data-theme={activeDimension}
      style={{ overflow: 'hidden' }}
    >
      <Header />
      <main
        style={{ display: 'flex', flex: 1, overflow: 'hidden', width: '100%' }}
      >
        <div style={{ flex: 8, position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              backgroundColor: 'var(--color-culture-background)',
            }}
          >
            <MapView
              data={filteredDataWithoutCountry}
              activeDimension={activeDimension}
              activeWaves={activeWaves}
            />
          </div>
        </div>

        <ResponsiveFilterSidebar>
          <FilterSidebar
            selectedCountry={null}
            DIMENSIONS={DIMENSIONS}
            activeDimension={activeDimension}
            setActiveDimension={setActiveDimension}
            activeWave={activeWave}
            setActiveWave={setActiveWave}
            activeWaves={activeWaves}
            setActiveWaves={setActiveWaves}
            WAVE_YEARS={WAVE_YEARS}
            data={data}
            filters={filters}
            setFilters={setFilters}
            filteredData={filteredData}
            filteredDataWithoutCountry={filteredDataWithoutCountry}
            allowWaveComparison={true}
          />
        </ResponsiveFilterSidebar>
      </main>
    </div>
  );
};

export default Trends;
