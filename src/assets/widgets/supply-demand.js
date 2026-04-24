(function() {
  const container = document.getElementById('widget-container');

  const margin = { top: 20, right: 40, bottom: 50, left: 60 };
  const width = 580 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  container.insertAdjacentHTML('beforeend', `
    <div class="widget-title">Supply &amp; Demand — Interactive</div>
  `);

  const svg = d3.select('#widget-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 120]).range([height, 0]);

  // Axes
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(6))
    .call(g => g.select('.domain').attr('stroke', '#ccc'))
    .call(g => g.selectAll('line').attr('stroke', '#ccc'));

  svg.append('g')
    .call(d3.axisLeft(yScale).ticks(6))
    .call(g => g.select('.domain').attr('stroke', '#ccc'))
    .call(g => g.selectAll('line').attr('stroke', '#ccc'));

  // Axis labels
  svg.append('text')
    .attr('x', width / 2).attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px').attr('fill', '#555')
    .text('Quantity (Q)');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2).attr('y', -44)
    .attr('text-anchor', 'middle')
    .attr('font-size', '13px').attr('fill', '#555')
    .text('Price (P)');

  // Grid lines
  svg.append('g').attr('class', 'grid')
    .call(d3.axisLeft(yScale).ticks(6).tickSize(-width).tickFormat(''))
    .call(g => { g.select('.domain').remove(); g.selectAll('line').attr('stroke', '#eee'); });

  // Curve generators
  const line = d3.line().x(d => xScale(d.q)).y(d => yScale(d.p));

  // Supply: P = 20 + Q
  function supplyData() {
    return d3.range(0, 101, 5).map(q => ({ q, p: 20 + q }));
  }

  // Demand: P = demandIntercept - Q
  function demandData(intercept) {
    return d3.range(0, intercept, 5).map(q => ({ q, p: intercept - q }));
  }

  function equilibrium(intercept) {
    // Supply: P = 20 + Q  →  Q = P - 20
    // Demand: P = intercept - Q  →  Q = intercept - P
    // At eq: P - 20 = intercept - P  →  2P = intercept + 20
    const P = (intercept + 20) / 2;
    const Q = P - 20;
    return { P: Math.round(P), Q: Math.round(Q) };
  }

  // Draw paths
  const supplyPath = svg.append('path')
    .datum(supplyData())
    .attr('fill', 'none')
    .attr('stroke', '#e05c5c')
    .attr('stroke-width', 2.5)
    .attr('d', line);

  const demandPath = svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#3b82f6')
    .attr('stroke-width', 2.5);

  // Equilibrium lines & dot
  const eqLineX = svg.append('line').attr('stroke', '#999').attr('stroke-width', 1).attr('stroke-dasharray', '4,3');
  const eqLineY = svg.append('line').attr('stroke', '#999').attr('stroke-width', 1).attr('stroke-dasharray', '4,3');
  const eqDot = svg.append('circle').attr('r', 6).attr('fill', '#A51C30').attr('stroke', '#fff').attr('stroke-width', 2);

  // Labels
  const supplyLabel = svg.append('text').attr('font-size', '12px').attr('font-weight', '600').attr('fill', '#e05c5c');
  const demandLabel = svg.append('text').attr('font-size', '12px').attr('font-weight', '600').attr('fill', '#3b82f6');
  const eqLabel = svg.append('text').attr('font-size', '12px').attr('font-weight', '700').attr('fill', '#A51C30');

  function update(intercept) {
    const dd = demandData(intercept);
    const eq = equilibrium(intercept);

    demandPath.datum(dd).attr('d', line);

    eqLineX
      .attr('x1', xScale(eq.Q)).attr('y1', yScale(eq.P))
      .attr('x2', xScale(eq.Q)).attr('y2', height);

    eqLineY
      .attr('x1', 0).attr('y1', yScale(eq.P))
      .attr('x2', xScale(eq.Q)).attr('y2', yScale(eq.P));

    eqDot.attr('cx', xScale(eq.Q)).attr('cy', yScale(eq.P));

    const lastS = supplyData().filter(d => d.p <= 120).slice(-1)[0];
    supplyLabel.attr('x', xScale(lastS.q) + 4).attr('y', yScale(lastS.p) + 4).text('Supply');

    const lastD = dd.slice(-1)[0];
    demandLabel.attr('x', xScale(lastD.q) + 4).attr('y', yScale(lastD.p) - 4).text('Demand');

    eqLabel
      .attr('x', xScale(eq.Q) + 8)
      .attr('y', yScale(eq.P) - 10)
      .text(`E* (Q=${eq.Q}, P=${eq.P})`);
  }

  // Controls
  const controls = document.createElement('div');
  controls.className = 'widget-controls';
  controls.innerHTML = `
    <label for="demand-slider">Demand shift:</label>
    <input type="range" id="demand-slider" min="60" max="160" value="100" step="5">
    <output id="demand-output"></output>
    <span style="font-size:12px;color:#888;margin-left:8px;">← lower demand &nbsp;|&nbsp; higher demand →</span>
  `;
  container.appendChild(controls);

  const slider = document.getElementById('demand-slider');
  const output = document.getElementById('demand-output');

  function refresh() {
    const val = +slider.value;
    output.textContent = `D-intercept: ${val}`;
    update(val);
  }

  slider.addEventListener('input', refresh);
  refresh();
})();
