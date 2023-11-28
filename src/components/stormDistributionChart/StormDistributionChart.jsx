import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3'

const width = 800
const height = 400
const margin = {top: 20, right: 20, bottom: 70, left: 40}
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

const StormDistributionChart = ({data}) => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (data && data.length > 0) {
      drawChart()
    }
  }, [data])

  const drawChart = () => {
    const svg = d3.select(chartRef.current)

    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.BEGIN_DATE))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => +d.TOR_LENGTH)])
      .range([innerHeight, 0])

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '12px')

    g.append('g').call(d3.axisLeft(yScale))

    g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.BEGIN_DATE))
      .attr('y', d => yScale(+d.TOR_LENGTH))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(+d.TOR_LENGTH))
      .attr('fill', 'steelblue')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Nombre de tornade')

    g.append('text')
      .attr(
        'transform',
        `translate(${innerWidth / 2}, ${innerHeight + margin.top + 20})`,
      )
      .style('text-anchor', 'middle')
  }

  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <svg ref={chartRef} width={width} height={height}></svg>
    </div>
  )
}

export default StormDistributionChart
