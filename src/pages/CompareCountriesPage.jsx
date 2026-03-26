import React from "react";
import Header from "../components/layout/Header";
import ParallelCoordinatesView from "../components/countryOverview/ParallelCoordinatesView";

const CompareCountriesPage = ({
  data,
  filteredData,
  activeWave,
  setActiveWave,
  activeDimension,
  setActiveDimension,
}) => {
  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.mainContent}>
        <h2>Compare Countries Page</h2>
        <p>
          This is where you compare all values between all countries utilizing
          parallel coordinates.
        </p>
        <div style={{ flex: 1, minHeight: "60vh", marginTop: "2rem" }}>
          <ParallelCoordinatesView
            filteredData={data}
            activeWave={activeWave}
          />
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#F5F8FA",
    fontFamily: "var(--font-family, Inter, sans-serif)",
    overflowX: "hidden",
  },
  mainContent: {
    padding: "2rem",
    flex: 1,
  },
};

export default CompareCountriesPage;
