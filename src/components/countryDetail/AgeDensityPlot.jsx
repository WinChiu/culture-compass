import { useEffect, useRef } from 'react';
import colors from '../../scss/colors.module.scss';
import styles from '../../scss/detailedCountryPage.module.scss';
import * as d3 from 'd3';

function AgeDensityPlot({ wave1Data, wave2Data, setFilters, filters }) {
  const ref = useRef();

  useEffect(() => {
    if (!wave1Data) return;

    const drawChart = () => {
      if (!(ref.current instanceof Element)) return;

      d3.select(ref.current).selectAll('*').remove();
      const cs = getComputedStyle(ref.current);
      const colorCulturePrimary = cs
        .getPropertyValue('--color-culture-primary')
        .trim();
      const colorCultureAnalogous = cs
        .getPropertyValue('--color-culture-analogous')
        .trim();
      const colorCultureLightTransparent = cs
        .getPropertyValue('--color-culture-light-transparent')
        .trim();

      const totalWidth = ref.current.clientWidth;
      const margin = { top: 28, right: 24, bottom: 26, left: 44 };
      const width = totalWidth - margin.left - margin.right;
      const height = 240;

      const svg = d3
        .select(ref.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const allPercentage = [...wave1Data, ...wave2Data].map((d) => d[1]);
      const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(allPercentage)])
        .range([height, 0])
        .nice();

      svg
        .append('g')
        .call(d3.axisLeft(y).ticks(4).tickSize(-width).tickFormat(''))
        .call((g) => g.select('.domain').remove())
        .call((g) =>
          g
            .selectAll('.tick line')
            .attr('stroke', colors.colorGray)
            .attr('stroke-dasharray', '4,3'),
        );

      svg
        .append('g')
        .call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickFormat((d) => (d === 0 ? '' : d3.format('.1%')(d))),
        )
        .call((g) => g.select('.domain').remove())
        .call((g) => g.selectAll('.tick line').remove())
        .call((g) =>
          g.selectAll('.tick text').attr('class', styles['yAxis-label']),
        );

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickValues(d3.range(0, 101, 10)))
        .call((g) =>
          g.select('.domain').attr('stroke', colors.colorBlackPrimary),
        )
        .call((g) =>
          g.selectAll('.tick line').attr('stroke', colors.colorBlackPrimary),
        )
        .call((g) =>
          g
            .selectAll('.tick text')
            .attr('class', styles['xAxis-label'])
            .attr('dy', '1em'),
        );

      const lineGen = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x((d) => x(d[0]))
        .y((d) => y(d[1]));

      svg
        .append('path')
        .datum(wave1Data)
        .attr('fill', 'none')
        .attr('stroke', colorCulturePrimary)
        .attr('stroke-width', 1.5)
        .attr('d', lineGen);
      svg
        .append('path')
        .datum(wave2Data)
        .attr('fill', 'none')
        .attr('stroke', colorCultureAnalogous)
        .attr('stroke-width', 1.5)
        .attr('d', lineGen);

      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on('brush', (e) => {
          if (!e.selection) return;
          const [selectedAgeMin, selectedAgeMax] = e.selection;
          labelLeft
            .attr('x', selectedAgeMin)
            .text(Math.round(x.invert(selectedAgeMin)));
          labelRight
            .attr('x', selectedAgeMax)
            .text(Math.round(x.invert(selectedAgeMax)));
        })
        .on('end', (e) => {
          if (!e.selection) return;
          const [selectedAgeMin, selectedAgeMax] = e.selection;
          const ageMin = Math.round(x.invert(selectedAgeMin));
          const ageMax = Math.round(x.invert(selectedAgeMax));
          if (filters.ageRange[0] === ageMin && filters.ageRange[1] === ageMax)
            return;
          setFilters((prev) => ({ ...prev, ageRange: [ageMin, ageMax] }));
        });

      const labelLeft = svg
        .append('text')
        .attr('y', -12)
        .attr('text-anchor', 'middle')
        .attr('class', styles['selectedAge-label'])
        .attr('fill', colorCulturePrimary);

      const labelRight = svg
        .append('text')
        .attr('y', -12)
        .attr('text-anchor', 'middle')
        .attr('class', styles['selectedAge-label'])
        .attr('fill', colorCulturePrimary);

      svg.append('g').attr('class', 'brush').call(brush);
      svg
        .select('.brush .selection')
        .attr('fill', colorCultureLightTransparent)
        .attr('fill-opacity', 1)
        .attr('stroke', colorCulturePrimary)
        .attr('stroke-width', 1.5);

      svg.select('.brush').call(brush.move, filters.ageRange.map(x));

      const [leftlablePos, rightLabelPos] = filters.ageRange.map(x);
      labelLeft.attr('x', leftlablePos).text(filters.ageRange[0]);
      labelRight.attr('x', rightLabelPos).text(filters.ageRange[1]);
    };
    drawChart();
    const observer = new ResizeObserver(drawChart);
    if (ref.current instanceof Element) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [wave1Data, wave2Data, filters, setFilters]);

  if (!wave1Data) return null;

  return <div ref={ref}></div>;
}

export default AgeDensityPlot;
