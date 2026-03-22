import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getCountryName } from '../../utils/countryMapping';
import HelpIcon from '../layout/HelpIcon.jsx';
import IconReset from '../../assets/icon-reset.svg';
import typography from '../../scss/countryOverviewTypography.module.scss';

import familyIcon from '../../assets/icon-family-xl.svg';
import friendsIcon from '../../assets/icon-friends-xl.svg';
import leisureIcon from '../../assets/icon-leisure-xl.svg';
import politicsIcon from '../../assets/icon-politics-xl.svg';
import religionIcon from '../../assets/icon-religion-xl.svg';
import workIcon from '../../assets/icon-work-xl.svg';

const categoryColors = [
  '#FF9A9E',
  '#FECBEF',
  '#FBB2AE',
  '#E2E5B1',
  '#C3E5D4',
  '#A3C0D4',
  '#b0a8b9',
];

const ParallelCoordinatesView = ({
  filteredData,
  activeWave,
}) => {
  const ref = useRef();
  const hoverSpanRef = useRef();
  const brushCountRef = useRef();
  const resetBrushFnRef = useRef(null);

  useEffect(() => {
    if (!filteredData || filteredData.length === 0) return;

    const waveData = filteredData.filter((d) => Number(d.wave) === activeWave);

    if (waveData.length === 0) {
      d3.select(ref.current).selectAll('*').remove();
      return;
    }

    const dimensions = [
      { key: 'impFamily', label: 'Family', icon: familyIcon },
      { key: 'impFriends', label: 'Friends', icon: friendsIcon },
      { key: 'impLeisure', label: 'Leisure', icon: leisureIcon },
      { key: 'impPolitics', label: 'Politics', icon: politicsIcon },
      { key: 'impWork', label: 'Work', icon: workIcon },
      { key: 'impReligion', label: 'Religion', icon: religionIcon },
    ];

    const countryData = d3.rollups(
      waveData,
      (v) => {
        const result = { countryCode: v[0].countryCode };
        dimensions.forEach((dim) => {
          const meanVal = d3.mean(v, (d) => {
            const num = Number(d[dim.key]);
            return isNaN(num) ? undefined : num;
          });
          result[dim.key] = 5 - meanVal;
        });
        return result;
      },
      (d) => d.countryCode,
    );

    const parsedData = countryData.map((d) => d[1]);

    d3.select(ref.current).selectAll('*').remove();

    const margin = { top: 100, right: 0, bottom: 100, left: 0 };
    const width = ref.current.clientWidth - margin.left - margin.right;
    const height = ref.current.clientHeight - margin.top - margin.bottom;

    const svg = d3
      .select(ref.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scalePoint()
      .range([0, width])
      .padding(0.4)
      .domain(dimensions.map((d) => d.key));

    const y = {};
    dimensions.forEach((dim) => {
      y[dim.key] = d3.scaleLinear().domain([1, 4]).range([height, 0]);
    });

    const colorScale = d3.scaleOrdinal().range(categoryColors);

    const path = (d) => {
      return d3.line()(
        dimensions.map((dim) => {
          const val = d[dim.key] !== undefined ? d[dim.key] : 0;
          return [x(dim.key), y[dim.key](val)];
        }),
      );
    };

    const linesLayer = svg.append('g').attr('class', 'lines-layer');

    const paths = linesLayer
      .selectAll('myPath')
      .data(parsedData)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', (d, i) => colorScale(i))
      .style('stroke-width', 2.5)
      .style('opacity', 0.7);

    const tooltipLayer = svg.append('g').attr('class', 'tooltip-layer');

    const drawTooltip = (targetCode) => {
      tooltipLayer.selectAll('*').remove();
      if (!targetCode) return;
      const d = parsedData.find((pd) => pd.countryCode === targetCode);
      if (!d) return;

      dimensions.forEach((dim) => {
        const val = d[dim.key] !== undefined ? d[dim.key] : 0;
        const cx = x(dim.key);
        const cy = y[dim.key](val);

        tooltipLayer
          .append('circle')
          .attr('class', 'hover-marker')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 5)
          .style('fill', '#fff')
          .style('stroke', '#2C3E50')
          .style('stroke-width', 1);

        const boxWidth = 32;
        const boxHeight = 20;
        const offset = 8;

        tooltipLayer
          .append('rect')
          .attr('class', 'hover-bg')
          .attr('x', cx + offset)
          .attr('y', cy - boxHeight - offset)
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('rx', 4)
          .style('fill', 'rgba(255, 255, 255, 0.95)')
          .style('stroke', '#eaeaea')
          .style('stroke-width', 1)
          .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');

        tooltipLayer
          .append('text')
          .attr('class', 'hover-text')
          .attr('x', cx + offset + boxWidth / 2)
          .attr('y', cy - offset - 5)
          .style('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('font-weight', '600')
          .style('fill', '#333')
          .text(val.toFixed(1));
      });
    };

    let hoveredDataCode = null;
    const extents = {};
    const brushes = {};

    const updatePaths = () => {
      const activeExtents = Object.entries(extents).filter(
        ([k, v]) => v !== null,
      );

      let activeData = parsedData;
      if (activeExtents.length > 0) {
        activeData = parsedData.filter((d) => {
          return activeExtents.every(([key, extent]) => {
            const val = d[key] !== undefined ? d[key] : 0;
            const py = y[key](val);
            return py >= extent[0] && py <= extent[1];
          });
        });
      }

      const activeCodes = new Set(activeData.map((d) => d.countryCode));

      paths.each(function (d, i) {
        const isHovered = d.countryCode === hoveredDataCode;
        const isBrushed = activeCodes.has(d.countryCode);
        const el = d3.select(this);

        if (isHovered) {
          el.style('stroke', '#2C3E50')
            .style('opacity', 1)
            .style('stroke-width', 3)
            .raise();
        } else if (isBrushed) {
          el.style('stroke', colorScale(i))
            .style('opacity', 0.7)
            .style('stroke-width', 2.5);
        } else {
          el.style('stroke', '#cbcbcb')
            .style('opacity', 0.1)
            .style('stroke-width', 1.5);
        }
      });

      if (brushCountRef.current) {
        if (activeExtents.length === 0) {
          brushCountRef.current.innerText = 'All';
        } else {
          brushCountRef.current.innerText = `${activeData.length} countries`;
        }
      }
    };

    updatePaths();
    drawTooltip(null);

    paths
      .on('mouseover', function (event, d) {
        const activeExtents = Object.entries(extents).filter(
          ([k, v]) => v !== null,
        );
        let isBrushed = true;

        if (activeExtents.length > 0) {
          isBrushed = activeExtents.every(([key, extent]) => {
            const val = d[key] !== undefined ? d[key] : 0;
            const py = y[key](val);
            return py >= extent[0] && py <= extent[1];
          });
        }

        if (isBrushed) {
          d3.select(this).style('cursor', 'pointer');
          hoveredDataCode = d.countryCode;
          if (hoverSpanRef.current)
            hoverSpanRef.current.innerText = getCountryName(d.countryCode);
          updatePaths();
          drawTooltip(d.countryCode);
        }
      })
      .on('mouseout', function (event, d) {
        d3.select(this).style('cursor', 'default');
        hoveredDataCode = null;
        if (hoverSpanRef.current) hoverSpanRef.current.innerText = 'None';
        updatePaths();
        drawTooltip(null);
      });

    const axes = svg
      .selectAll('myAxis')
      .data(dimensions)
      .enter()
      .append('g')
      .attr('transform', (dim) => `translate(${x(dim.key)})`)
      .each(function (dim) {
        d3.select(this).call(d3.axisLeft().scale(y[dim.key]).ticks(5));

        d3.select(this).selectAll('text').style('font-size', '12px');
      });

    axes.each(function (dim) {
      const g = d3.select(this);

      g.append('image')
        .attr('xlink:href', dim.icon)
        .attr('x', -16)
        .attr('y', -70)
        .attr('width', 32)
        .attr('height', 32);

      g.append('text')
        .style('text-anchor', 'middle')
        .attr('y', -20)
        .text(dim.label)
        .style('fill', '#333')
        .style('font-size', '14px')
        .style('font-weight', '600');
    });

    axes.each(function (dim) {
      const brush = d3
        .brushY()
        .extent([
          [-15, 0],
          [15, height],
        ])
        .on('brush end', function (event) {
          extents[dim.key] = event.selection;
          updatePaths();
        });

      brushes[dim.key] = brush;

      d3.select(this).append('g').attr('class', 'brush').call(brush);
    });

    resetBrushFnRef.current = () => {
      axes.each(function (dim) {
        if (brushes[dim.key]) {
          const brushG = d3.select(this).select('.brush');
          if (!brushG.empty()) {
            brushG.call(brushes[dim.key].move, null);
          }
        }
      });
    };

  }, [filteredData, activeWave]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        minHeight: '450px',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '2px',
          left: '28px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          maxWidth: '520px',
          pointerEvents: 'none',
        }}
      >
        <h1 className={typography.overlayTitle}>Importance of All</h1>
        <p
          className={typography.overlaySubtitle}
          style={{ textShadow: '0 0 2px white, 0 0 2px white' }}
        >
          Mean importance value across all cultural dimensions
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          padding: '80px 70px 0 28px',
          width: '100%',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          className={typography.panelLabel}
        >
          Selected Country:{' '}
          <span ref={hoverSpanRef} className={typography.panelValue}>
            None
          </span>
          Brushed:{' '}
          <span ref={brushCountRef} className={typography.panelValue}>
            All
          </span>
          <button
            type="button"
            aria-label="Reset brush"
            title="Reset brush"
            onClick={() => {
              if (resetBrushFnRef.current) {
                resetBrushFnRef.current();
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              lineHeight: 0,
              transition: 'transform 0.2s ease, opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.75';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <img
              src={IconReset}
              alt=""
              aria-hidden="true"
              style={{ width: '22px', height: '22px' }}
            />
          </button>
          <HelpIcon
            active={false}
            message="Interactive Filter: Click and drag vertically on any axis to 'brush' a range. This filters the data across all other dimensions."
          />
        </div>
      </div>

      <div
        ref={ref}
        style={{ flex: 1, width: '100%', position: 'relative' }}
      ></div>
    </div>
  );
};

export default ParallelCoordinatesView;
