import { useEffect, useRef } from 'react';
import colors from '../../scss/colors.module.scss';
import style from '../../scss/detailedCountryPage.module.scss';
import * as d3 from 'd3';

function BarChartView({ Wave1, Wave2 }) {
  const ref = useRef();

  useEffect(() => {
    if (!Wave1 || !Wave2) return;
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

      const margin = { top: 8, right: 0, bottom: 36, left: 44 };
      const width = ref.current.clientWidth - margin.left - margin.right;
      const height = ref.current.clientHeight - margin.top - margin.bottom;
      const barBottomGap = 2;

      if (width <= 0 || height <= 0) return;

      const svg = d3
        .select(ref.current)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const defs = svg.append('defs');
      defs
        .append('pattern')
        .attr('id', 'striped-pattern')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .attr('patternTransform', 'rotate(45)')
        .call((pattern) => {
          pattern
            .append('rect')
            .attr('width', 8)
            .attr('height', 8)
            .attr('fill', '#f0f0f0');
          pattern
            .append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 8)
            .attr('stroke', '#cccccc')
            .attr('stroke-width', 2);
        });

      const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

      const x0 = d3
        .scaleBand()
        .domain(['1', '2', '3', '4'])
        .range([0, width])
        .paddingInner(0.5)
        .paddingOuter(0.1);

      const x1 = d3
        .scaleBand()
        .domain(['A', 'B'])
        .range([0, x0.bandwidth()])
        .padding(0);

      const gridTicks = [25, 50, 75, 100];

      svg
        .append('g')
        .selectAll('line.grid')
        .data(gridTicks)
        .enter()
        .append('line')
        .attr('class', 'grid')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => y(d))
        .attr('y2', (d) => y(d))
        .attr('stroke', colors.colorGray)
        .attr('stroke-dasharray', '4,4')
        .attr('stroke-width', 1.5);

      svg
        .append('g')
        .selectAll('text.y-axis-label')
        .data(gridTicks)
        .enter()
        .append('text')
        .attr('class', 'y-axis-label')
        .attr('x', -10)
        .attr('y', (d) => y(d))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('class', style['yAxis-label'])
        .attr('fill', colors.colorTextCaption)
        .text((d) => `${d}%`);

      const labels = [
        'Not at all important (1)',
        'Not very important (2)',
        'Rather important (3)',
        'Very Important (4)',
      ];

      const data = [1, 2, 3, 4].map((key) => ({
        key: key.toString(),
        label: labels[key - 1],
        valA: Wave1.dist[key] || 0,
        valB: Wave2.dist[key] || 0,
      }));

      const group = svg
        .selectAll('.category-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'category-group')
        .attr('transform', (d) => `translate(${x0(d.key)}, 0)`);

      group
        .append('text')
        .attr('x', x0.bandwidth() / 2)
        .attr('y', height + 32)
        .attr('text-anchor', 'middle')
        .attr('class', style['xAxis-label'])
        .text((d) => d.label);

      group.each(function (d) {
        const g = d3.select(this);
        const maxVal = Math.max(d.valA, d.valB);
        const minVal = Math.min(d.valA, d.valB);
        const diff = maxVal - minVal;

        g.append('rect')
          .attr('x', x1('A'))
          .attr('y', y(d.valA))
          .attr('width', x1.bandwidth())
          .attr('height', Math.max(0, height - y(d.valA) - barBottomGap))
          .attr('fill', colorCulturePrimary);

        g.append('rect')
          .attr('x', x1('B'))
          .attr('y', y(d.valB))
          .attr('width', x1.bandwidth())
          .attr('height', Math.max(0, height - y(d.valB) - barBottomGap))
          .attr('fill', colorCultureAnalogous);

        if (diff > 0.01) {
          const smallerIdx = d.valA < d.valB ? 'A' : 'B';
          const xPos = x1(smallerIdx);
          const stripedY = y(maxVal);
          const stripedHeight = y(minVal) - y(maxVal);

          g.append('rect')
            .attr('x', xPos)
            .attr('y', stripedY)
            .attr('width', x1.bandwidth())
            .attr('height', stripedHeight)
            .attr('fill', 'url(#striped-pattern)');

          if (stripedHeight > 25) {
            g.append('text')
              .attr('x', xPos + x1.bandwidth() / 2)
              .attr('y', stripedY + stripedHeight / 2)
              .attr('dy', '0.35em')
              .attr('text-anchor', 'middle')
              .attr('class', style['barLabel'])
              .attr('fill', colors.colorTextCaption)
              .text(`${diff.toFixed(2)}%`);
          }
        }

        if (maxVal > 0) {
          g.append('text')
            .attr('x', x1('A') + x1.bandwidth() / 2)
            .attr('y', y(maxVal) - 8)
            .attr('text-anchor', 'middle')
            .attr('class', style['barLabel'])
            .attr('fill', colorCulturePrimary)
            .text(`${d.valA.toFixed(2)}%`);

          g.append('text')
            .attr('x', x1('B') + x1.bandwidth() / 2)
            .attr('y', y(maxVal) - 8)
            .attr('text-anchor', 'middle')
            .attr('class', style['barLabel'])
            .attr('fill', colorCultureAnalogous)
            .text(`${d.valB.toFixed(2)}%`);
        }
      });

      svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height)
        .attr('y2', height)
        .attr('stroke', colors.colorBlackPrimary)
        .attr('stroke-width', 2);
    };

    drawChart();
    const observer = new ResizeObserver(drawChart);
    if (ref.current instanceof Element) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [Wave1, Wave2]);

  if (!Wave1 || !Wave2) return null;

  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
}

export default BarChartView;
