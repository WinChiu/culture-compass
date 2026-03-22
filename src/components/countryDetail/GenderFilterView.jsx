import HorizontalBarChart from "./HorizontalBarChart";

export default function GenderFilterView({
  filters,
  setFilters,
  activeWaves,
  data,
  allowWaveComparison,
  activeWave,
}) {
  if (!data || !activeWaves) return null;

  function getGenderDistribution(inputData) {
    const waveA = Math.min(...activeWaves);
    const waveB = Math.max(...activeWaves);
    var WaveAtotal1 = 0;
    var WaveAtotal2 = 0;
    var WaveAtotalAll = 0;
    var WaveBtotal1 = 0;
    var WaveBtotal2 = 0;
    var WaveBtotalAll = 0;

    if (allowWaveComparison) {
      inputData.forEach((el) => {
        if (Number(el.wave) == waveA && Number(el.sex) == 1) {
          WaveAtotal1 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.sex) == 2) {
          WaveAtotal2 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.sex) == 1) {
          WaveBtotal1 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.sex) == 2) {
          WaveBtotal2 += 1;
          WaveBtotalAll += 1;
        }
      });

      var genderDistribution = [
        {
          Group: "Male",
          WaveA: Math.round((WaveAtotal1 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal1 / WaveBtotalAll) * 100),
        },
        {
          Group: "Female",
          WaveA: Math.round((WaveAtotal2 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal2 / WaveBtotalAll) * 100),
        },
      ];
    }
    if (!allowWaveComparison) {
      inputData.forEach((el) => {
        if (Number(el.wave) == activeWave && Number(el.sex) == 1) {
          WaveAtotal1 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.sex) == 2) {
          WaveAtotal2 += 1;
          WaveAtotalAll += 1;
        }
      });

      var genderDistribution = [
        {
          Group: "Male",
          WaveA: Math.round((WaveAtotal1 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Female",
          WaveA: Math.round((WaveAtotal2 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
      ];
    }
    return genderDistribution;
  }

  const finalGenderDistribution = getGenderDistribution(data);

  return (
    <div className="chartParent">
      <HorizontalBarChart
        barData={finalGenderDistribution}
        textSize="0px"
        allowWaveComparison={allowWaveComparison}
      />
    </div>
  );
}
