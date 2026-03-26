import React, { useState } from "react";
import Header from "../components/layout/Header";
import MapView from "../components/countryOverview/OverviewMapView";
import ParallelCoordinatesView from "../components/countryOverview/ParallelCoordinatesView";
import FilterSidebar from "../components/FilterSidebar";
import ResponsiveFilterSidebar from "../components/ResponsiveFilterSidebar";
import sharedStyle from "../scss/detailedCountryPage.module.scss";
import overlayStyle from "../scss/mapOverlay.module.scss";

const OverView = ({
  filteredDataWithoutCountry,
  data,
  filteredData,
  filters,
  setFilters,
  activeWave,
  setActiveWave,
  activeWaves,
  setActiveWaves,
  activeDimension,
  setActiveDimension,
  DIMENSIONS,
  WAVE_YEARS,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [viewMode, setViewMode] = useState("map");

  return (
    <div className={sharedStyle["detail-page-container"]} data-theme={activeDimension} style={{ overflow: "hidden" }}>
      <Header />
      <main style={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>
        <div style={{ flex: 8, position: "relative", zIndex: 1 }}>
          <div
            className={`${overlayStyle.shadowCard} ${overlayStyle.viewToggle}`}
          >
            <button
              onClick={() => setViewMode("map")}
              className={`${overlayStyle.viewToggleButton} ${
                viewMode === "map" ? overlayStyle.viewToggleButtonActive : ""
              }`}
            >
              Map View
            </button>
            
            <button
              onClick={() => setViewMode("parallel")}
              className={`${overlayStyle.viewToggleButton} ${
                viewMode === "parallel"
                  ? overlayStyle.viewToggleButtonActive
                  : ""
              }`}
            >
              Parallel View
            </button>
          </div>

          <div style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "var(--color-culture-background)" }}>
            {viewMode === "map" ? (
              <MapView
                data={filteredDataWithoutCountry}
                activeDimension={activeDimension}
                activeWave={activeWave}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "var(--color-culture-background)",
                  paddingTop: "40px",
                }}
              >
                <ParallelCoordinatesView
                  filteredData={filteredDataWithoutCountry}
                  activeWave={activeWave}
                  selectedCountry={selectedCountry}
                />
              </div>
            )}
          </div>
        </div> 

        <ResponsiveFilterSidebar>
          <FilterSidebar
            selectedCountry={selectedCountry}
            viewMode={viewMode}
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
            allowWaveComparison={false}
          />
        </ResponsiveFilterSidebar>

      </main>
    </div>
  );
};

export default OverView;
