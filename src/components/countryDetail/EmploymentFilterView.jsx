import HorizontalBarChart from "./HorizontalBarChart";

export default function EmploymentFilterView({
  filters,
  setFilters,
  activeWaves,
  data,
  allowWaveComparison,
  activeWave,
}) {
  if (!data || !activeWaves) return null;

  function getEmploymentDistribution(inputData) {
    const waveA = Math.min(...activeWaves);
    const waveB = Math.max(...activeWaves);
    var WaveAtotal1 = 0;
    var WaveAtotal2 = 0;
    var WaveAtotal3 = 0;
    var WaveAtotal4 = 0;
    var WaveAtotal5 = 0;
    var WaveAtotal6 = 0;
    var WaveAtotal7 = 0;
    var WaveAtotal8 = 0;

    var WaveAtotalAll = 0;
    var WaveBtotal1 = 0;
    var WaveBtotal2 = 0;
    var WaveBtotal3 = 0;
    var WaveBtotal4 = 0;
    var WaveBtotal5 = 0;
    var WaveBtotal6 = 0;
    var WaveBtotal7 = 0;
    var WaveBtotal8 = 0;
    var WaveBtotalAll = 0;
    if (allowWaveComparison) {
      inputData.forEach((el) => {
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 1) {
          WaveAtotal1 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 2) {
          WaveAtotal2 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 3) {
          WaveAtotal3 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 4) {
          WaveAtotal4 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 5) {
          WaveAtotal5 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 6) {
          WaveAtotal6 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 7) {
          WaveAtotal7 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == waveA && Number(el.employmentStatus) == 8) {
          WaveAtotal8 += 1;
          WaveAtotalAll += 1;
        }

        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 1) {
          WaveBtotal1 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 2) {
          WaveBtotal2 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 3) {
          WaveBtotal3 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 4) {
          WaveBtotal4 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 5) {
          WaveBtotal5 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 6) {
          WaveBtotal6 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 7) {
          WaveBtotal7 += 1;
          WaveBtotalAll += 1;
        }
        if (Number(el.wave) == waveB && Number(el.employmentStatus) == 8) {
          WaveBtotal8 += 1;
          WaveBtotalAll += 1;
        }
      });

      var employmentDistribution = [
        {
          Group: "Full time",
          WaveA: Math.round((WaveAtotal1 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal1 / WaveBtotalAll) * 100),
        },
        {
          Group: "Part time",
          WaveA: Math.round((WaveAtotal2 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal2 / WaveBtotalAll) * 100),
        },
        {
          Group: "Self employed",
          WaveA: Math.round((WaveAtotal3 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal3 / WaveBtotalAll) * 100),
        },
        {
          Group: "Retired",
          WaveA: Math.round((WaveAtotal4 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal4 / WaveBtotalAll) * 100),
        },
        {
          Group: "Housewife",
          WaveA: Math.round((WaveAtotal5 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal5 / WaveBtotalAll) * 100),
        },
        {
          Group: "Students",
          WaveA: Math.round((WaveAtotal6 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal6 / WaveBtotalAll) * 100),
        },
        {
          Group: "Unemployed",
          WaveA: Math.round((WaveAtotal7 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal7 / WaveBtotalAll) * 100),
        },
        {
          Group: "Other",
          WaveA: Math.round((WaveAtotal8 / WaveAtotalAll) * 100),
          WaveB: Math.round((WaveBtotal8 / WaveBtotalAll) * 100),
        },
      ];
    }

    if (!allowWaveComparison) {
      inputData.forEach((el) => {
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 1) {
          WaveAtotal1 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 2) {
          WaveAtotal2 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 3) {
          WaveAtotal3 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 4) {
          WaveAtotal4 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 5) {
          WaveAtotal5 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 6) {
          WaveAtotal6 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 7) {
          WaveAtotal7 += 1;
          WaveAtotalAll += 1;
        }
        if (Number(el.wave) == activeWave && Number(el.employmentStatus) == 8) {
          WaveAtotal8 += 1;
          WaveAtotalAll += 1;
        }
      });

      var employmentDistribution = [
        {
          Group: "Full time",
          WaveA: Math.round((WaveAtotal1 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Part time",
          WaveA: Math.round((WaveAtotal2 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Self employed",
          WaveA: Math.round((WaveAtotal3 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Retired",
          WaveA: Math.round((WaveAtotal4 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Housewife",
          WaveA: Math.round((WaveAtotal5 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Students",
          WaveA: Math.round((WaveAtotal6 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Unemployed",
          WaveA: Math.round((WaveAtotal7 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
        {
          Group: "Other",
          WaveA: Math.round((WaveAtotal8 / WaveAtotalAll) * 100),
          WaveB: 0,
        },
      ];
    }

    return employmentDistribution;
  }

  const finalEmplDistribution = getEmploymentDistribution(data);

  return (
    <div className="chartParent">
      <HorizontalBarChart
        barData={finalEmplDistribution}
        plotSize={{ width: 478, height: 550 }}
        allowWaveComparison={allowWaveComparison}
      />
    </div>
  );
}
