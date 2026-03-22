import React, { useState } from "react";
import Header from "../components/layout/Header";
import MapView from "../components/countryOverview/OverviewMapView";
import ParallelCoordinatesView from "../components/countryOverview/ParallelCoordinatesView";
import FilterSidebar from "../components/FilterSidebar";
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
          <div style={{
              position: "absolute",
              top: "45px",
              right: "30px",
              display: "flex",
              backgroundColor: "#fff",
              borderRadius: "10px",
              zIndex: 100,
              overflow: "visible", 
          }}
          className={overlayStyle.shadowCard}>
            <button
              onClick={() => setViewMode("map")}
              style={{
                padding: "8px 24px",
                border: "none",
                backgroundColor: viewMode === "map" ? "var(--color-culture-dark)" : "transparent",
                color: viewMode === "map" ? "#fff" : "#2c3e50",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              }}
            >
              Map View
            </button>
            
            <button
              onClick={() => setViewMode("parallel")}
              style={{
                padding: "8px 24px",
                border: "none",
                backgroundColor: viewMode === "parallel" ? "var(--color-culture-dark)" : "transparent",
                color: viewMode === "parallel" ? "#fff" : "#2c3e50",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
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
              <div style={{ width: "100%", height: "100%", backgroundColor: "#fff", paddingTop: "40px" }}>
                <ParallelCoordinatesView
                  filteredData={filteredDataWithoutCountry}
                  activeWave={activeWave}
                  selectedCountry={selectedCountry}
                />
              </div>
            )}
          </div>
        </div> 

        <div style={{ flex: 5, position: "relative", zIndex: 2 }}>
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
        </div>

      </main>
    </div>
  );
};

export default OverView;
