import React, { useState, useMemo } from 'react';
import style from '../scss/filterSidebar.module.scss';
import AgeFilterView from './countryDetail/AgeFilterView';
import GenderFilterView from './countryDetail/GenderFilterView';
import EducationFilterView from './countryDetail/EducationFilterView';
import EmploymentFilterView from './countryDetail/EmploymentFilterView';
import MaritalStatusView from './countryDetail/MaritalStatusView';
import IconReset from '../assets/icon-reset.svg';
import '../css/filterMenu.css';
import HelpIcon from '../components/layout/HelpIcon';
import CustomAccordion from './CustomAccordion';
import HoverTooltip from './layout/HoverTooltip';

export default function FilterSidebar({
  selectedCountry,
  DIMENSIONS,
  activeDimension,
  setActiveDimension,
  activeWave,
  activeWaves,
  setActiveWave,
  setActiveWaves,
  WAVE_YEARS,
  data,
  filters,
  setFilters,
  filteredData,
  filteredDataWithoutCountry,
  availableWaves: availableWavesProp,
  allowWaveComparison = false,
  viewMode = 'map',
}) {
  const availableWaves =
    availableWavesProp || new Set(data?.map((d) => +d.wave));
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedEdu, setSelectedEdu] = useState([]);
  const [selectedEmpl, setSelectedEmpl] = useState([]);
  const [selectedMaritalSt, setMaritalSt] = useState([]);

  const totalDataCount = useMemo(() => {
    if (!data) return 0;
    if (selectedCountry) {
      return allowWaveComparison
        ? data
            .filter((item) => activeWaves.includes(Number(item.wave)))
            .filter((item) => item.countryCode == selectedCountry).length
        : data
            .filter((item) => Number(item.wave) === activeWave)
            .filter((item) => item.countryCode == selectedCountry).length;
    } else {
      return allowWaveComparison
        ? data.filter((item) => activeWaves.includes(Number(item.wave))).length
        : data.filter((item) => Number(item.wave) === activeWave).length;
    }
  }, [activeWave, activeWaves, allowWaveComparison, data, selectedCountry]);
  let filteredDataCount = 0;
  if (selectedCountry) {
    filteredDataCount = allowWaveComparison
      ? filteredData
          .filter((item) => activeWaves.includes(Number(item.wave)))
          .filter((item) => item.countryCode == selectedCountry).length
      : filteredData
          .filter((item) => Number(item.wave) === activeWave)
          .filter((item) => item.countryCode == selectedCountry).length;
  } else {
    filteredDataCount = allowWaveComparison
      ? filteredData.filter((item) => activeWaves.includes(Number(item.wave)))
          .length
      : filteredData.filter((item) => Number(item.wave) === activeWave).length;
  }

  const responseCountText = `${(filteredDataCount || 0).toLocaleString()} / ${(totalDataCount || 0).toLocaleString()} response`;
  if (!data || !activeWaves) return null;
  function handleClickGender(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');
    const SomeOneElseChecked = Array.from(CheckedElements).some(
      (x) => x.id != e.target.id && x.name == e.target.name && x.checked,
    );

    if (SomeOneElseChecked == false) {
      e.target.checked = !e.target.checked;
    }

    const AllChecked = Array.from(CheckedElements).filter(
      (x) => x.name == e.target.name && x.checked,
    );

    if (AllChecked.length !== 2) {
      AllChecked[0].id == 1
        ? setSelectedGender('Male')
        : setSelectedGender('Female');
    }

    setFilters((prev) => ({
      ...prev,
      sex: AllChecked.length == 2 ? 0 : AllChecked[0].id,
    }));
  }
  function handleClickEdu(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');

    const SomeOneElseChecked = Array.from(CheckedElements).some(
      (x) => x.id != e.target.id && x.name == e.target.name && x.checked,
    );

    if (SomeOneElseChecked == false) {
      e.target.checked = !e.target.checked;
    }

    const AllChecked = Array.from(CheckedElements).filter(
      (x) => x.name == e.target.name && x.checked,
    );

    let filteredEdu = [];
    AllChecked.forEach((element) => {
      filteredEdu.push(Number(element.id));
    });

    setSelectedEdu(filteredEdu);

    setFilters((prev) => ({
      ...prev,
      eduLevelW8: filteredEdu,
    }));
  }
  function handleClickEmpl(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');

    const SomeOneElseChecked = Array.from(CheckedElements).some(
      (x) => x.id != e.target.id && x.name == e.target.name && x.checked,
    );

    if (SomeOneElseChecked == false) {
      e.target.checked = !e.target.checked;
    }

    const AllChecked = Array.from(CheckedElements).filter(
      (x) => x.name == e.target.name && x.checked,
    );

    let employmentEdu = [];
    AllChecked.forEach((element) => {
      employmentEdu.push(Number(element.id));
    });

    setSelectedEmpl(employmentEdu);
    setFilters((prev) => ({
      ...prev,
      employmentStatus: employmentEdu,
    }));
  }
  function handleClickMarital(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');

    const SomeOneElseChecked = Array.from(CheckedElements).some(
      (x) => x.id != e.target.id && x.name == e.target.name && x.checked,
    );

    if (SomeOneElseChecked == false) {
      e.target.checked = !e.target.checked;
    }

    const AllChecked = Array.from(CheckedElements).filter(
      (x) => x.name == e.target.name && x.checked,
    );

    let maritalSt = [];
    AllChecked.forEach((element) => {
      maritalSt.push(Number(element.id));
    });

    setMaritalSt(maritalSt);
    setFilters((prev) => ({
      ...prev,
      maritalStatus: maritalSt,
    }));
  }
  function handleFilterReset(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');
    Array.from(CheckedElements).forEach((element) => {
      element.checked = true;
    });
    setFilters((prev) => ({
      ...prev,
      ageRange: [0, 100],
      sex: 0,
      maritalStatus: [1, 2, 3, 4, 5, 6],
      eduLevelW8: [1, 2, 3, 4, 5, 6, 7, 8],
      employmentStatus: [1, 2, 3, 4, 5, 6, 7, 8],
    }));
    setSelectedGender('All');
    setMaritalSt([1, 2, 3, 4, 5, 6]);
    setSelectedEdu([1, 2, 3, 4, 5, 6, 7, 8]);
    setSelectedEmpl([1, 2, 3, 4, 5, 6, 7, 8]);
  }

  function handleAgeReset(e) {
    setFilters((prev) => ({
      ...prev,
      ageRange: [0, 100],
    }));
  }

  function handleGenderReset(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');

    Array.from(CheckedElements).forEach((element) => {
      if (element.name == 'gender') {
        element.checked = true;
      }
    });
    setFilters((prev) => ({
      ...prev,
      sex: 0,
    }));
    setSelectedGender('All');
  }

  function handleEduReset(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');
    Array.from(CheckedElements).forEach((element) => {
      if (element.name == 'education') {
        element.checked = true;
      }
    });
    setFilters((prev) => ({
      ...prev,
      eduLevelW8: [1, 2, 3, 4, 5, 6, 7, 8],
    }));
    setSelectedEdu([1, 2, 3, 4, 5, 6, 7, 8]);
  }

  function handleEmplReset(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');
    Array.from(CheckedElements).forEach((element) => {
      if (element.name == 'employment') {
        element.checked = true;
      }
    });
    setFilters((prev) => ({
      ...prev,
      employmentStatus: [1, 2, 3, 4, 5, 6, 7, 8],
    }));
    setSelectedEmpl([1, 2, 3, 4, 5, 6, 7, 8]);
  }

  function handleMaritalReset(e) {
    const CheckedElements = document.querySelectorAll('input[type="checkbox"]');
    Array.from(CheckedElements).forEach((element) => {
      if (element.name == 'maritalstatus') {
        element.checked = true;
      }
    });
    setFilters((prev) => ({
      ...prev,
      maritalStatus: [1, 2, 3, 4, 5, 6],
    }));
    setMaritalSt([1, 2, 3, 4, 5, 6]);
  }

  return (
    <div className={style['sidebar']}>
      {viewMode === 'map' && Array.isArray(DIMENSIONS) && (
        <div className={style['sidebarSection']}>
          <div className={style['sidebarSection__titleGroup']}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <h2 className={style['sidebarSection__title']}>
                Cultural Dimension
              </h2>
              <HelpIcon
                align="right"
                message="Select a cultural dimension to visualize mean scores across countries."
              />
            </div>
            <span className={style['sidebarSection__subTitle']}>
              Participants are asked how important each topic is in their life.
            </span>
          </div>

          <div className={style['sidebarSection__buttonGroup']}>
            {DIMENSIONS.map((dim) => {
              const isActive = activeDimension === dim.id;
              return (
                <button
                  key={dim.id}
                  onClick={() => setActiveDimension(dim.id)}
                  className={`${style['sidebarSection__button']} ${
                    isActive ? style['sidebarSection__button--active'] : ''
                  }`}
                >
                  <img
                    src={dim.icon}
                    alt={dim.label}
                    className={`${style['sidebarSection__buttonIcon']} ${
                      isActive
                        ? style['sidebarSection__buttonIcon--active']
                        : ''
                    }`}
                  />
                  {dim.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={style['sidebarSection']}>
        <div className={style['sidebarSection__titleGroup']}>
          <h2 className={style['sidebarSection__title']}>Waves</h2>
          <span className={style['sidebarSection__subTitle']}>
            Each survey spans over several years, with 'Wave' denoting different
            fieldwork periods.
          </span>
        </div>
        <div className={style['sidebarSection__buttonGroup']}>
          {[2, 3, 4, 5, 6, 7].map((w) => {
            const waveA = Math.min(...activeWaves);
            const waveB = Math.max(...activeWaves);
            const isWaveA = waveA === w && allowWaveComparison;
            const isWaveB = waveB === w && allowWaveComparison;
            const isActive = activeWave === w && !allowWaveComparison;
            const waveHasData = availableWaves.has(w);
            const unavailableWaveTooltip =
              !waveHasData && viewMode === 'country'
                ? 'This country did not participate in this survey wave.'
                : undefined;
            const waveButtonStateClass = !allowWaveComparison
              ? isActive
                ? style['sidebarSection__button--active']
                : ''
              : viewMode === 'country'
                ? `${isWaveA ? style['sidebarSection__button--active'] : ''} ${
                    isWaveB ? style['sidebarSection__button--secondary'] : ''
                  }`
                : `${isWaveA || isWaveB ? style['sidebarSection__button--active'] : ''}`;
            return (
              <HoverTooltip
                key={w}
                message={unavailableWaveTooltip}
                placement="top"
                disabled={!unavailableWaveTooltip}
              >
                <button
                  disabled={!waveHasData}
                  onClick={() => {
                    if (allowWaveComparison) {
                      if (!activeWaves.includes(w)) {
                        setActiveWaves([activeWaves[1], w]);
                      }
                      return;
                    }
                    setActiveWave(w);
                  }}
                  aria-label={
                    unavailableWaveTooltip
                      ? `Wave ${w} unavailable. ${unavailableWaveTooltip}`
                      : undefined
                  }
                  className={`${style['sidebarSection__button']} ${waveButtonStateClass} ${
                    !waveHasData
                      ? style['sidebarSection__button--disabled']
                      : ''
                  }`}
                  style={{ padding: '1rem 1rem' }}
                >
                  Wave {w} ({WAVE_YEARS[w]})
                </button>
              </HoverTooltip>
            );
          })}
        </div>
      </div>
      <div className={style['sidebarSection']}>
        <div className={style['sidebarSection__titleGroup']}>
          <h1 className={style['sidebarSection__title']}>Filter</h1>
          <div
            className="container"
            style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}
          >
            <span className={style['sidebarSection__subTitle']}>
              {responseCountText}
            </span>
            {allowWaveComparison && (
              <div
                className={style['sidebarSection__waveLabelParent']}
                hidden={!allowWaveComparison}
              >
                <div className={style['sidebarSection__waveLabelChild']}>
                  <div
                    className={style['sidebarSection__waveLabelChildA']}
                  ></div>
                  <p className={style['sidebarSection__subTitle']}>
                    Wave{' '}
                    {
                      activeWaves.toSorted(function (a, b) {
                        return a - b;
                      })[0]
                    }
                  </p>
                </div>
                <div className={style['sidebarSection__waveLabelChild']}>
                  <div
                    className={style['sidebarSection__waveLabelChildB']}
                  ></div>
                  <p className={style['sidebarSection__subTitle']}>
                    Wave{' '}
                    {
                      activeWaves.toSorted(function (a, b) {
                        return a - b;
                      })[1]
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
          <img
            src={IconReset}
            onClick={(e) => handleFilterReset(e)}
            className={style['sidebarSection__resetFilter']}
          ></img>
        </div>
        <div className={style['sidebarSection__filterGroup']}>
          <CustomAccordion
            title={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Age</span>
                <HelpIcon
                  align="right"
                  message="This line chart shows the age distribution of respondents for the selected wave. Drag the brush edges to filter by age."
                />
              </div>
            }
            result={
              filters.ageRange[0] === 0 && filters.ageRange[1] === 100
                ? 'All'
                : `${filters.ageRange[0]} ~ ${filters.ageRange[1]} yrs old`
            }
            actions={
              <img
                src={IconReset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAgeReset(e);
                }}
                className={style['sidebarSection__resetSingleFilter']}
              ></img>
            }
            titleClassName={style['filterAccordion__title']}
            triggerStyle={{ paddingTop: '0rem', paddingBottom: '1rem' }}
            headerStyle={{ minHeight: '2.5rem' }}
            controlGroupStyle={{
              alignSelf: 'flex-start',
              paddingTop: '0.125rem',
            }}
          >
            <AgeFilterView
              filters={filters}
              setFilters={setFilters}
              activeWaves={activeWaves}
              activeWave={activeWave}
              data={data}
              allowWaveComparison={allowWaveComparison}
              style={{ margin: '0px 10px 0px 0px' }}
            />
          </CustomAccordion>
          <CustomAccordion
            title={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Sex</span>
                <HelpIcon
                  align="right"
                  message="This chart shows the gender distribution of respondents."
                />
              </div>
            }
            result={
              filters.sex == 1 || filters.sex == 2 ? selectedGender : 'All'
            }
            actions={
              <img
                src={IconReset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenderReset(e);
                }}
                className={style['sidebarSection__resetSingleFilter']}
              ></img>
            }
            titleClassName={style['filterAccordion__title']}
          >
            <div className="detailsParent">
              <div
                className={`checkboxGrandParent genderGap ${
                  !allowWaveComparison ? 'genderGap-oneBar' : ''
                }`}
              >
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="gender"
                    id="1"
                    onChange={(e) => handleClickGender(e)}
                    defaultChecked
                  />
                  <p>Male</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="gender"
                    id="2"
                    onChange={(e) => handleClickGender(e)}
                    defaultChecked
                  />
                  <p>Female</p>
                </div>
              </div>
              <GenderFilterView
                filters={filters}
                setFilters={setFilters}
                activeWaves={activeWaves}
                activeWave={activeWave}
                data={filteredData}
                allowWaveComparison={allowWaveComparison}
              />
            </div>
          </CustomAccordion>
          <CustomAccordion
            title={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Education</span>
                <HelpIcon
                  align="right"
                  message="This chart shows the distribution of respondents by education level."
                />
              </div>
            }
            result={
              selectedEdu.length == 8 || selectedEdu.length == 0
                ? 'All'
                : selectedEdu.length + ' Selected'
            }
            actions={
              <img
                src={IconReset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEduReset(e);
                }}
                className={style['sidebarSection__resetSingleFilter']}
              ></img>
            }
            titleClassName={style['filterAccordion__title']}
          >
            <div className="detailsParent ">
              <div
                className={`checkboxGrandParent educationGap ${
                  !allowWaveComparison ? 'educationGap-oneBar' : ''
                }`}
              >
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="1"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>Primary (Incomplete)</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="2"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>Primary (Complete)</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="3"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>Secondary (Incomplete)</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="4"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>Secondary (Complete)</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="5"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>High school (Incomplete)</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="6"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>High school (Complete)</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="7"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>Associate/Diploma</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="education"
                    id="8"
                    onChange={(e) => handleClickEdu(e)}
                    defaultChecked
                  />
                  <p>University Degree</p>
                </div>
              </div>

              <EducationFilterView
                filters={filters}
                setFilters={setFilters}
                activeWaves={activeWaves}
                data={filteredData}
                allowWaveComparison={allowWaveComparison}
                activeWave={activeWave}
              />
            </div>
          </CustomAccordion>
          <CustomAccordion
            title={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Employment</span>
                <HelpIcon
                  align="right"
                  message="This chart shows the employment status distribution of respondents."
                />
              </div>
            }
            result={
              selectedEmpl.length == 8 || selectedEmpl.length == 0
                ? 'All'
                : selectedEmpl.length + ' Selected'
            }
            actions={
              <img
                src={IconReset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEmplReset(e);
                }}
                className={style['sidebarSection__resetSingleFilter']}
              ></img>
            }
            titleClassName={style['filterAccordion__title']}
          >
            <div className="detailsParent">
              <div
                className={`checkboxGrandParent employmentGap ${
                  !allowWaveComparison ? 'employmentGap-oneBar' : ''
                }`}
              >
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="1"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Full time</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="2"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Part time</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="3"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Self employed</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="4"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Retired</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="5"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Housewife</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="6"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Student</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="7"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Unemployed</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="employment"
                    id="8"
                    onChange={(e) => handleClickEmpl(e)}
                    defaultChecked
                  />
                  <p>Other</p>
                </div>
              </div>
              <EmploymentFilterView
                filters={filters}
                setFilters={setFilters}
                activeWaves={activeWaves}
                data={filteredData}
                allowWaveComparison={allowWaveComparison}
                activeWave={activeWave}
              />
            </div>
          </CustomAccordion>
          <CustomAccordion
            title={
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Marital Status</span>
                <HelpIcon
                  align="right"
                  message="This chart shows the marital status distribution of respondents."
                />
              </div>
            }
            result={
              selectedMaritalSt.length == 6 || selectedMaritalSt.length == 0
                ? 'All'
                : selectedMaritalSt.length + ' Selected'
            }
            actions={
              <img
                src={IconReset}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaritalReset(e);
                }}
                className={style['sidebarSection__resetSingleFilter']}
              ></img>
            }
            titleClassName={style['filterAccordion__title']}
          >
            <div className="detailsParent">
              <div
                className={`checkboxGrandParent maritalGap ${
                  !allowWaveComparison ? 'maritalGap-oneBar' : ''
                }`}
              >
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="maritalstatus"
                    id="1"
                    onChange={(e) => handleClickMarital(e)}
                    defaultChecked
                  />
                  <p>Married</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="maritalstatus"
                    id="2"
                    onChange={(e) => handleClickMarital(e)}
                    defaultChecked
                  />
                  <p>Living as married</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="maritalstatus"
                    id="3"
                    onChange={(e) => handleClickMarital(e)}
                    defaultChecked
                  />
                  <p>Divorced</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="maritalstatus"
                    id="4"
                    onChange={(e) => handleClickMarital(e)}
                    defaultChecked
                  />
                  <p>Separated</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="maritalstatus"
                    id="5"
                    onChange={(e) => handleClickMarital(e)}
                    defaultChecked
                  />
                  <p>Widowed</p>
                </div>
                <div className="checkboxParent">
                  <input
                    type="checkbox"
                    name="maritalstatus"
                    id="6"
                    onChange={(e) => handleClickMarital(e)}
                    defaultChecked
                  />
                  <p>Single/Never married</p>
                </div>
              </div>
              <MaritalStatusView
                filters={filters}
                setFilters={setFilters}
                activeWaves={activeWaves}
                activeWave={activeWave}
                data={filteredData}
                allowWaveComparison={allowWaveComparison}
              />
            </div>
          </CustomAccordion>
        </div>
      </div>
    </div>
  );
}
