import { useState, useMemo, useEffect } from 'react';
import './App.css';
import { useData } from './utils/dataLoader';
import { applyFilters } from './utils/filters';
import { Routes, Route, Navigate } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import TrendsPage from './pages/TrendsPage';
import AboutPage from './pages/AboutPage';
import CompareCountriesPage from './pages/CompareCountriesPage';
import DetailedCountryPage from './pages/DetailedCountryPage';
import './scss/global.scss';

import familyIcon from './assets/icon-family-xl.svg';
import friendsIcon from './assets/icon-friends-xl.svg';
import leisureIcon from './assets/icon-leisure-xl.svg';
import politicsIcon from './assets/icon-politics-xl.svg';
import workIcon from './assets/icon-work-xl.svg';
import religionIcon from './assets/icon-religion-xl.svg';

const WAVE_YEARS = {
  2: '1989 - 1993',
  3: '1994 - 1998',
  4: '1999 - 2004',
  5: '2005 - 2009',
  6: '2010 - 2014',
  7: '2017 - 2022',
};

const DIMENSIONS = [
  { id: 'impFamily', label: 'Family', icon: familyIcon },
  { id: 'impFriends', label: 'Friends', icon: friendsIcon },
  { id: 'impLeisure', label: 'Leisure', icon: leisureIcon },
  { id: 'impPolitics', label: 'Politics', icon: politicsIcon },
  { id: 'impWork', label: 'Work', icon: workIcon },
  { id: 'impReligion', label: 'Religion', icon: religionIcon },
];

function App() {
  const { data, countryWaves, loading } = useData();

  // Maintain filter states
  const [filters, setFilters] = useState({
    ageRange: [0, 100], // Example: [18, 30]
    sex: 0, // Example: 1 male or 2 female or 0 all
    country: 'ALL', // Example: 'ARG'
    maritalStatus: [1, 2, 3, 4, 5, 6],
    eduLevelW8: [1, 2, 3, 4, 5, 6, 7, 8],
    employmentStatus: [1, 2, 3, 4, 5, 6, 7, 8],
  });

  //select one to show the score
  const [activeWave, setActiveWave] = useState(7);
  //select dimension to compare
  const [activeDimension, setActiveDimension] = useState('impFamily');
  //select two waves to compare
  const [activeWaves, setActiveWaves] = useState([5, 6]);

  const [isOneCountry, setIsOneCountry] = useState(false);
  // filter data for different views
  const filteredData = useMemo(() => {
    return applyFilters(data, filters);
  }, [data, filters]);

  // filter data for views that need ALL countries (like global Trends Map)
  const filteredDataWithoutCountry = useMemo(() => {
    return applyFilters(data, { ...filters, country: 'ALL' });
  }, [data, filters]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route
          path="/overview"
          element={
            <OverviewPage
              data={data}
              filteredDataWithoutCountry={filteredDataWithoutCountry}
              filteredData={filteredData}
              activeWave={activeWave}
              setActiveWave={setActiveWave}
              activeWaves={activeWaves}
              setActiveWaves={setActiveWaves}
              activeDimension={activeDimension}
              setActiveDimension={setActiveDimension}
              filters={filters}
              setFilters={setFilters}
              DIMENSIONS={DIMENSIONS}
              WAVE_YEARS={WAVE_YEARS}
              isOneCountry={isOneCountry}
              setIsOneCountry={setIsOneCountry}
            />
          }
        />

        <Route
          path="/trends"
          element={
            <TrendsPage
              data={data}
              countryWaves={countryWaves}
              filteredData={filteredData}
              activeWaves={activeWaves}
              setActiveWaves={setActiveWaves}
              activeDimension={activeDimension}
              setActiveDimension={setActiveDimension}
              filters={filters}
              setFilters={setFilters}
              filteredDataWithoutCountry={filteredDataWithoutCountry}
              DIMENSIONS={DIMENSIONS}
              WAVE_YEARS={WAVE_YEARS}
              pageType={'allCountry'}
            />
          }
        />

        <Route
          path="/trends/:countryCode"
          element={
            <DetailedCountryPage
              data={data}
              countryWaves={countryWaves}
              filteredDataWithoutCountry={filteredDataWithoutCountry}
              filteredData={filteredData}
              activeWaves={activeWaves}
              setActiveWaves={setActiveWaves}
              activeDimension={activeDimension}
              setActiveDimension={setActiveDimension}
              filters={filters}
              setFilters={setFilters}
              WAVE_YEARS={WAVE_YEARS}
              pageType={'oneCountry'}
            />
          }
        />

        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/compare"
          element={
            <CompareCountriesPage
              filteredData={filteredData}
              activeWave={activeWave}
              setActiveWave={setActiveWave}
              activeDimension={activeDimension}
              setActiveDimension={setActiveDimension}
              filters={filters}
              setFilters={setFilters}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
