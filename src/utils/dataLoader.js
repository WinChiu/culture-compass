import { useState, useEffect } from 'react';
import * as d3 from 'd3';
export const useData = () => {
  const [data, setData] = useState(null);
  const [countryWaves, setCountryWaves] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await d3.csv('/CC_no_missing_data.csv');
        setData(csvData);

        const wavesMap = {};
        for (let i = 0; i < csvData.length; i++) {
          const row = csvData[i];
          const cc = row.countryCode;
          const w = Number(row.wave);
          if (!wavesMap[cc]) {
            wavesMap[cc] = new Set();
          }
          wavesMap[cc].add(w);
        }

        setCountryWaves(wavesMap);
        setLoading(false);
      } catch (error) {
        console.error('Error loading CSV:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, countryWaves, loading };
};
