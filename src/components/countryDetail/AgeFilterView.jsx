import AgeDensityPlot from './AgeDensityPlot';

const AgeFilterView = ({
  filters,
  setFilters,
  activeWaves,
  data,
  allowWaveComparison,
  activeWave,
}) => {
  if (!data || !activeWaves) return null;
  const getDistribution = (activeWaves, data) => {
    const waveA = Math.min(...activeWaves);
    const waveB = Math.max(...activeWaves);
    let countWaveAAgeDis = {};
    let countWaveBAgeDis = {};
    let wave1Result = [];
    let wave2Result = [];
    let totalA = 0;
    let totalB = 0;

    if (allowWaveComparison) {
      data.forEach((el) => {
        if (Number(el.wave) === waveA) {
          countWaveAAgeDis[el.age] = (countWaveAAgeDis[el.age] || 0) + 1;
          totalA++;
        } else if (Number(el.wave) === waveB) {
          countWaveBAgeDis[el.age] = (countWaveBAgeDis[el.age] || 0) + 1;
          totalB++;
        }
      });
      Object.keys(countWaveAAgeDis).forEach((age) => {
        countWaveAAgeDis[age] = countWaveAAgeDis[age] / totalA;
      });
      Object.keys(countWaveBAgeDis).forEach((age) => {
        countWaveBAgeDis[age] = countWaveBAgeDis[age] / totalB;
      });
      wave1Result = Object.entries(countWaveAAgeDis).map(([age, count]) => [
        Number(age),
        count,
      ]);
      wave2Result = Object.entries(countWaveBAgeDis).map(([age, count]) => [
        Number(age),
        count,
      ]);
    } else if (!allowWaveComparison) {
      data.forEach((el) => {
        if (Number(el.wave) === activeWave) {
          countWaveAAgeDis[el.age] = (countWaveAAgeDis[el.age] || 0) + 1;
          totalA++;
        }
      });
      Object.keys(countWaveAAgeDis).forEach((age) => {
        countWaveAAgeDis[age] = countWaveAAgeDis[age] / totalA;
      });
      wave1Result = Object.entries(countWaveAAgeDis).map(([age, count]) => [
        Number(age),
        count,
      ]);
    }

    return { wave1Result, wave2Result };
  };
  const { wave1Result, wave2Result } = getDistribution(activeWaves, data);

  return (
    <AgeDensityPlot
      filters={filters}
      setFilters={setFilters}
      wave1Data={wave1Result}
      wave2Data={wave2Result}
    />
  );
};

export default AgeFilterView;
