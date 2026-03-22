import * as d3 from "d3";
import { useEffect, useRef } from "react";
import "../../css/horizontalBarChart.css";

export default function HorizontalBarChart({
  barData,
  plotMargin = { top: 10, right: 40, bottom: 20, left: 24 },
  plotSize = { width: 478, height: 200 },
  allowWaveComparison,
}) {
  const ref = useRef();

  useEffect(() => {
    if (!barData || barData.length == 0) return;

    const drawChart = () => {
      if (!(ref.current instanceof Element)) return;

      d3.select(ref.current).selectAll("*").remove();

      const cs = getComputedStyle(ref.current);
      const colorCulturePrimary = cs
        .getPropertyValue("--color-culture-primary")
        .trim();
      const colorCultureDark = cs
        .getPropertyValue("--color-culture-dark")
        .trim();
      const colorCultureAnalogous = cs
        .getPropertyValue("--color-culture-analogous")
        .trim();

      const margin = plotMargin;
      const totalWidth = ref.current.clientWidth || plotSize.width;
      const width = totalWidth - margin.left - margin.right;
      const height = plotSize.height - margin.top - margin.bottom;

      const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const groups = barData.map((d) => d.Group);
      const subgroups = ["WaveA", "WaveB"];

      const y = d3.scaleBand().range([0, height]).domain(groups).padding(0.1);
      const ySubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, y.bandwidth()])
        .padding(0.05);
      const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
      const xAxis = d3.axisBottom(x).ticks(5).tickSize(0);
      const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);
      const color = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range(
          allowWaveComparison
            ? [colorCulturePrimary, colorCultureAnalogous]
            : [colorCultureDark, colorCultureAnalogous],
        );

      svg
        .selectAll("line.vertical-grid")
        .data(x.ticks(5))
        .enter()
        .append("line")
        .attr("class", "vertical-grid")
        .attr("x1", (d) => x(d))
        .attr("y1", 0)
        .attr("x2", (d) => x(d))
        .attr("y2", height)
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .style("stroke-dasharray", "3 3");

      svg
        .append("g")
        .selectAll("g")
        .data(barData)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(0,${y(d.Group)})`)
        .selectAll("rect")
        .data((d) =>
          subgroups.map((key) => ({
            key,
            value: d[key],
          })),
        )
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", (d) => ySubgroup(d.key))
        .attr("height", ySubgroup.bandwidth())
        .attr("width", (d) => x(d.value))
        .attr("fill", (d) => color(d.key));

      //Label
      svg
        .append("g")
        .selectAll("g")
        .data(barData)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(0,${y(d.Group)})`)
        .selectAll("text")
        .data((d) =>
          subgroups
            .map((key) => ({
              key,
              value: d[key],
            }))
            .filter((d) => d.value !== 0 && !Number.isNaN(d.value)),
        )
        .enter()
        .append("text")
        .attr("x", (d) => x(d.value) + 6)
        .attr("y", (d) => ySubgroup(d.key) + ySubgroup.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => `${d.value}%`)
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("fill", (d) => color(d.key));
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .call((g) => g.select(".domain").remove());

      svg
        .append("g")
        .call(yAxis)
        .style("font-size", "0px")
        .selectAll("path")
        .style("stroke-width", "1.5px");
    };

    drawChart();
    const observer = new ResizeObserver(drawChart);
    if (ref.current instanceof Element) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [barData, plotMargin, plotSize]);

  return <div ref={ref}></div>;
}
