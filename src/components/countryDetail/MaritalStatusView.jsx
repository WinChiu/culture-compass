import HorizontalBarChart from "./HorizontalBarChart";

export default function MaritalStatusView({
  filters,
  setFilters,
  activeWaves,
  data,
  allowWaveComparison,
  activeWave,
}) {
  if (!data || !activeWaves) return null;

  function getMaritalDistribution(inputData) {
    const waveA = Math.min(...activeWaves);
    const waveB = Math.max(...activeWaves);
    var WaveAtotalAll = 0;
    var WaveAtotal1 = 0;
    var WaveAtotal2 = 0;
    var WaveAtotal3 = 0;
    var WaveAtotal4 = 0;
    var WaveAtotal5 = 0;
    var WaveAtotal6 = 0;

    var WaveBtotalAll = 0;
    var WaveBtotal1 = 0;
    var WaveBtotal2 = 0;
    var WaveBtotal3 = 0;
    var WaveBtotal4 = 0;
    var WaveBtotal5 = 0;
    var WaveBtotal6 = 0;
    if (allowWaveComparison) {
      inputData.forEach((el) => {
        if (Number(el.wave) == waveA && Number(el.maritalStatus) == 1) {
          WaveAtotal1 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.maritalStatus) == 2) {
          WaveAtotal2 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.maritalStatus) == 3) {
          WaveAtotal3 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.maritalStatus) == 4) {
          WaveAtotal4 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.maritalStatus) == 5) {
          WaveAtotal5 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.maritalStatus) == 6) {
          WaveAtotal6 += 1;
          WaveAtotalAll += 1;
        }

        if (Number(el.wave) == waveB && Number(el.maritalStatus) == 1) {
          WaveBtotal1 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.maritalStatus) == 2) {
          WaveBtotal2 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.maritalStatus) == 3) {
          WaveBtotal3 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.maritalStatus) == 4) {
          WaveBtotal4 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.maritalStatus) == 5) {
          WaveBtotal5 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.maritalStatus) == 6) {
          WaveBtotal6 += 1;
          WaveBtotalAll += 1;
        }
      });

      var eduDistribution = [
        {
          Group: "Married",
          WaveA: Math.round((WaveAtotal1 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal1 / WaveBtotalAll) * 100),
        },
        {
          Group: "Living together as married",
          WaveA: Math.round((WaveAtotal2 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal2 / WaveBtotalAll) * 100),
        },
        {
          Group: "Divorced",
          WaveA: Math.round((WaveAtotal3 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal3 / WaveBtotalAll) * 100),
        },
        {
          Group: "Separated",
          WaveA: Math.round((WaveAtotal4 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal4 / WaveBtotalAll) * 100),
        },
        {
          Group: "Widowed",
          WaveA: Math.round((WaveAtotal5 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal5 / WaveBtotalAll) * 100),
        },
        {
          Group: "Single/Never married",
          WaveA: Math.round((WaveAtotal6 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal6 / WaveBtotalAll) * 100),
        },
      ];
    }

    if (!allowWaveComparison) {
      inputData.forEach((el) => {
        if (Number(el.wave) == activeWave && Number(el.maritalStatus) == 1) {
          WaveAtotal1 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.maritalStatus) == 2) {
          WaveAtotal2 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.maritalStatus) == 3) {
          WaveAtotal3 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.maritalStatus) == 4) {
          WaveAtotal4 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.maritalStatus) == 5) {
          WaveAtotal5 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.maritalStatus) == 6) {
          WaveAtotal6 += 1;
          WaveAtotalAll += 1;
        }
      });

      var eduDistribution = [
        {
          Group: "Married",
          WaveA: Math.round((WaveAtotal1 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Living together as married",
          WaveA: Math.round((WaveAtotal2 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Divorced",
          WaveA: Math.round((WaveAtotal3 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Separated",
          WaveA: Math.round((WaveAtotal4 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Widowed",
          WaveA: Math.round((WaveAtotal5 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Single/Never married",
          WaveA: Math.round((WaveAtotal6 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
      ];
    }

    return eduDistribution;
  }

  const finalMaritalDistribution = getMaritalDistribution(data);

  return (
    <div className="chartParent">
      <HorizontalBarChart
        barData={finalMaritalDistribution}
        plotSize={{ width: 478, height: 550 }}
        allowWaveComparison={allowWaveComparison}
      />
    </div>
  );
}
