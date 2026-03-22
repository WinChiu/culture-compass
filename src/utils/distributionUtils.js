export const calculateDistributionDifference = (waveA_dist, waveB_dist) => {
  if (!waveA_dist || !waveB_dist) return "0.00";

  const diff =
    Math.abs((waveB_dist["1"] || 0) - (waveA_dist["1"] || 0)) +
    Math.abs((waveB_dist["2"] || 0) - (waveA_dist["2"] || 0)) +
    Math.abs((waveB_dist["3"] || 0) - (waveA_dist["3"] || 0)) +
    Math.abs((waveB_dist["4"] || 0) - (waveA_dist["4"] || 0));

  return (diff / 2).toFixed(2);
};

export const calculateWaveDistribution = (records, dimension) => {
  const total = records.length;
  if (total === 0) return { dist: { 1: 0, 2: 0, 3: 0, 4: 0 }, mean: 0 };

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let validCount = 0;
  let sum = 0;

  records.forEach((row) => {
    const rawVal = parseInt(row[dimension], 10);
    if (rawVal >= 1 && rawVal <= 4) {
      const val = 5 - rawVal;
      counts[val] += 1;
      validCount += 1;
      sum += val;
    }
  });

  return {
    dist: {
      1: validCount ? (counts[1] / validCount) * 100 : 0,
      2: validCount ? (counts[2] / validCount) * 100 : 0,
      3: validCount ? (counts[3] / validCount) * 100 : 0,
      4: validCount ? (counts[4] / validCount) * 100 : 0,
    },
    mean: validCount ? sum / validCount : 0,
  };
};
