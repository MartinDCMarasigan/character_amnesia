(function() {
  const kanji = ['書','字','筆','提','忘','漢','記','読','語','文','紙','墨','習','練','学','道','心','力','美','音','風','花','雨','山','水','空','火','木','金','土','日','月','星','雲','光','影','色','声','形','線'];
  const canvas = document.getElementById('kanji-canvas');
  const SIZE = 200;

  let cells = [];
  let w, h;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildGrid() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    const cols = Math.ceil(w / SIZE);
    const offsetX = (w - cols * SIZE) / 2;
    const rows = Math.ceil(h / SIZE) + 1;
    const newCells = [];
    let i = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols + 1; col++) {
        newCells.push({
          x: offsetX + col * SIZE,
          y: row * SIZE,
          char: kanji[i % kanji.length],
          opacity: 1,
          order: 0
        });
        i++;
      }
    }
    const indices = shuffle([...Array(newCells.length).keys()]);
    indices.forEach((cellIdx, rank) => { newCells[cellIdx].order = rank; });
    cells = newCells;
  }

  function render() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.font = '700 ' + SIZE + 'px serif';
    ctx.textBaseline = 'top';
    cells.forEach(cell => {
      if (cell.opacity <= 0.01) return;
      ctx.globalAlpha = cell.opacity * 0.06;
      ctx.fillStyle = '#1a1208';
      ctx.fillText(cell.char, cell.x, cell.y);
    });
    ctx.globalAlpha = 1;
  }

  function updateScroll() {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    const scrollAfterHero = Math.max(0, window.scrollY - heroHeight);
    const maxScroll = document.body.scrollHeight - window.innerHeight - heroHeight;
    const progress = maxScroll > 0 ? scrollAfterHero / maxScroll : 0;
    const total = cells.length;
    const hiddenCount = Math.round(progress * total);

    cells.forEach(cell => {
      const target = cell.order < hiddenCount ? 0 : 1;
      cell.opacity += (target - cell.opacity) * 0.03;
    });

    render();
    requestAnimationFrame(updateScroll);
  }

  buildGrid();
  render();
  requestAnimationFrame(updateScroll);
  window.addEventListener('resize', () => { buildGrid(); render(); });
})();

function updateFadeIns() {
  const threshold = window.innerHeight * 0.75;
  document.querySelectorAll('.fade-in').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < threshold) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', updateFadeIns, { passive: true });
window.addEventListener('resize', updateFadeIns, { passive: true });
updateFadeIns();

const statTimers = new Map();
const MAX_PCT = 100;

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (statTimers.has(el)) {
    clearInterval(statTimers.get(el));
  }
  let current = 0;
  el.textContent = '0%';
  const row = el.closest('.stat-row');
  if (row) row.style.width = '0%';
  const interval = setInterval(() => {
    const remaining = target - current;
    const step = Math.max(0.1, remaining * 0.03);
    current = Math.min(parseFloat((current + step).toFixed(1)), target);
    const display = current % 1 === 0 ? `${Math.round(current)}%` : `${current.toFixed(1)}%`;
    el.textContent = display;
    if (row) row.style.width = `${(current / MAX_PCT) * 100}%`;
    if (current >= target) clearInterval(interval);
  }, 16);
  statTimers.set(el, interval);
}

function resetCounter(el) {
  if (statTimers.has(el)) {
    clearInterval(statTimers.get(el));
    statTimers.delete(el);
  }
  const transitionDuration = 700;
  const row = el.closest('.stat-row');
  setTimeout(() => {
    el.textContent = '0%';
    if (row) row.style.width = '0%';
  }, transitionDuration);
}

function updateStatReveals() {
  const threshold = window.innerHeight * 0.75;
  document.querySelectorAll('.stat-reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    const wasVisible = el.classList.contains('visible');
    if (rect.top < threshold) {
      if (!wasVisible) {
        el.classList.add('visible');
        el.querySelectorAll('.big-num[data-target]').forEach(num => {
          if (!statTimers.has(num)) animateCounter(num);
        });
      }
    } else {
      if (wasVisible) {
        el.classList.remove('visible');
      }
    }
  });
}

window.addEventListener('scroll', updateStatReveals, { passive: true });
window.addEventListener('resize', updateStatReveals, { passive: true });
updateStatReveals();

const C = {
  vermillion: '#c0392b',
  vermillionL: '#e74c3c',
  gold: '#b8860b',
  goldL: '#d4a017',
  ink: '#1a1208',
  paper: '#f5f0e8',
  muted: '#7a6e60',
  faded: '#c4b99a',
  teal: '#2e7d77',
  tealL: '#3aada5',
  slate: '#4a5568',
};

(function() {
  
  const writingData = [
    {year:1995, value:55},
    {year:2005, value:67},
    {year:2010, value:74},
    {year:2015, value:82},
    {year:2021, value:89.4},
  ];

  
  const smartphoneData = [
    {year:1995, value:1.6},
    {year:1996, value:4.4},
    {year:1997, value:9.2},
    {year:1998, value:13.4},
    {year:1999, value:21.4},
    {year:2000, value:30.0},
    {year:2001, value:38.5},
    {year:2002, value:46.6},
    {year:2003, value:48.4},
    {year:2004, value:62.4},
    {year:2005, value:66.9},
    {year:2006, value:68.7},
    {year:2007, value:74.3},
    {year:2008, value:75.4},
    {year:2009, value:78.0},
    {year:2010, value:78.2},
    {year:2011, value:79.1},
    {year:2012, value:79.5},
    {year:2013, value:88.2},
    {year:2014, value:89.1},
    {year:2015, value:91.1},
    {year:2016, value:93.2},
    {year:2017, value:91.7},
    {year:2018, value:91.3},
    {year:2019, value:92.7},
    {year:2020, value:90.2},
    {year:2021, value:82.9},
  ];

  const svg = d3.select('#chart1');
  const W = svg.node().parentNode.clientWidth - 80;
  const H = 300;
  svg.attr('height', H + 60).attr('viewBox', `0 0 ${W+80} ${H+60}`);

  const g = svg.append('g').attr('transform','translate(50,10)');
  const w = W, h = H;

  const x = d3.scaleLinear().domain([1995,2021]).range([0,w]);
  const y = d3.scaleLinear().domain([0,100]).range([h,0]);

  g.selectAll('.grid-h').data(y.ticks(5)).enter().append('line')
    .attr('x1',0).attr('x2',w)
    .attr('y1',d=>y(d)).attr('y2',d=>y(d))
    .attr('stroke',C.faded).attr('stroke-width',0.5).attr('stroke-dasharray','4,4');

  const area2 = d3.area().x(d=>x(d.year)).y0(h).y1(d=>y(d.value)).curve(d3.curveCatmullRom);
  const areaPath = g.append('path').datum(smartphoneData).attr('d',area2)
    .attr('fill', C.goldL).attr('opacity',0);

  const line2fn = d3.line().x(d=>x(d.year)).y(d=>y(d.value)).curve(d3.curveCatmullRom);
  const path2 = g.append('path').datum(smartphoneData).attr('d',line2fn)
    .attr('fill','none').attr('stroke',C.gold).attr('stroke-width',1.5).attr('opacity',0.7);

  const line1fn = d3.line().x(d=>x(d.year)).y(d=>y(d.value)).curve(d3.curveCatmullRom);
  const path1 = g.append('path').datum(writingData).attr('d',line1fn)
    .attr('fill','none').attr('stroke',C.vermillion).attr('stroke-width',1.5).attr('opacity',0.7);
  const xAxis = d3.axisBottom(x).tickValues([1995,2000,2005,2010,2015,2020,2021]).tickFormat(d3.format('d'));
  g.append('g').attr('class','axis').attr('transform',`translate(0,${h})`).call(xAxis);
  g.append('g').attr('class','axis').call(d3.axisLeft(y).ticks(5).tickFormat(d=>`${d}%`));

  const lastW = writingData[writingData.length-1];
  const lastS = smartphoneData[smartphoneData.length-1];
  const endLabel1 = g.append('text').attr('x',x(lastW.year)+8).attr('y',y(lastW.value)+4)
    .attr('fill',C.vermillion).attr('font-size',11).attr('font-weight','bold').attr('opacity',0).text(`${lastW.value}%`);
  const endLabel2 = g.append('text').attr('x',x(lastS.year)+8).attr('y',y(lastS.value)+4)
    .attr('fill',C.goldL).attr('font-size',11).attr('opacity',0).text(`${lastS.value}%`);

  let chart1Animated = false;

  function animateChart1() {
    const len2 = path2.node().getTotalLength();
    const len1 = path1.node().getTotalLength();
    const duration = 2000;

    path2.attr('stroke-dasharray', len2).attr('stroke-dashoffset', len2)
      .transition().duration(duration).ease(d3.easeCubicInOut)
      .attr('stroke-dashoffset', 0)
      .on('end', () => {
        path2.transition().duration(300).attr('opacity', 0)
          .on('end', () => {
            path2.attr('stroke-dasharray', '6,3');
            path2.transition().duration(300).attr('opacity', 0.7)
              .on('end', () => {
                areaPath.transition().duration(800).attr('opacity', 0.12);
              });
          });
        endLabel2.transition().duration(300).attr('opacity', 1);
      });

    path1.attr('stroke-dasharray', len1).attr('stroke-dashoffset', len1)
      .transition().duration(duration).ease(d3.easeCubicInOut)
      .attr('stroke-dashoffset', 0)
      .on('end', () => {
        path1.transition().duration(300).attr('opacity', 0)
          .on('end', () => {
            path1.attr('stroke-dasharray', '6,3');
            path1.transition().duration(300).attr('opacity', 0.7);
          });
        endLabel1.transition().duration(300).attr('opacity', 1);
      });
  }

  const chart1Observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !chart1Animated) {
        chart1Animated = true;
        animateChart1();
        chart1Observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  chart1Observer.observe(svg.node());
})();

(function() {
  const total = 1062;
  const data = [
    { label: 'Take some notes',          students: 770, score: 57, color: C.teal },
    { label: 'Record everything',        students: 185, score: 72, color: C.vermillion },
    { label: 'Do not take notes at all', students: 107, score: 32, color: C.faded },
  ];

  const container = document.getElementById('chart2b').parentNode;
  const totalW = container.clientWidth - 80;
  const H = 260;
  const SVG_W = totalW + 80;
  const svg = d3.select('#chart2b').attr('height', H).attr('viewBox', `0 0 ${SVG_W} ${H}`);

  const root = d3.hierarchy({ children: data }).sum(d => d.students);
  d3.treemap().size([SVG_W, H]).padding(3)(root);

  const tooltip = document.getElementById('treemap-tooltip');

  function fitText(el, maxW) {
    try {
      const tw = el.node().getComputedTextLength();
      if (tw > maxW) el.attr('textLength', maxW).attr('lengthAdjust', 'spacingAndGlyphs');
    } catch(e) {}
  }

  root.leaves().forEach((d, i) => {
    const w = d.x1 - d.x0, h = d.y1 - d.y0, pad = 10;
    const maxW = Math.max(0, w - pad * 2);
    const pct = ((d.data.students / total) * 100).toFixed(1);

    const clipId = `clip2b-${i}`;
    svg.append('clipPath').attr('id', clipId)
      .append('rect').attr('x', d.x0).attr('y', d.y0).attr('width', w).attr('height', h);

    const rect = svg.append('rect')
      .attr('x', d.x0).attr('y', d.y0).attr('width', w).attr('height', h)
      .attr('fill', d.data.color).attr('opacity', 0.82).attr('rx', 2)
      .style('cursor', 'pointer');

    if (w > 30 && h > 30) {
      const g = svg.append('g').attr('clip-path', `url(#${clipId})`).style('pointer-events', 'none');

      fitText(g.append('text')
        .attr('x', d.x0 + w / 2).attr('y', d.y0 + h / 2 - 10)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', 'white').attr('font-size', 16).attr('font-weight', 'bold')
        .attr('letter-spacing', 0.5).text(`${pct}%`), maxW);

      fitText(g.append('text')
        .attr('x', d.x0 + w / 2).attr('y', d.y0 + h / 2 + 12)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', 'white').attr('font-size', 13).attr('font-weight', 'bold').attr('opacity', 0.9)
        .text(d.data.label), maxW);
    }

    rect.on('mousemove', (event) => {
      tooltip.innerHTML = `<strong style="color:${d.data.color}">${d.data.label}</strong>${d.data.students} students<br>Avg. score: ${d.data.score}%`;
      tooltip.classList.add('visible');
      tooltip.style.left = `${event.clientX + 14}px`;
      tooltip.style.top  = `${event.clientY - 10}px`;
    }).on('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
})();

(function() {
  const data = [
    { label: 'Keyboard typing',       value: 43.8, color: C.teal },
    { label: 'Handwriting',           value: 30.8, color: C.vermillion },
    { label: 'Other / no preference', value: 25.4, color: C.faded },
  ];

  const container = document.getElementById('chart2').parentNode;
  const totalW = container.clientWidth - 80;
  const H = 260;
  const SVG_W = totalW + 80;
  const svg = d3.select('#chart2').attr('height', H).attr('viewBox', `0 0 ${SVG_W} ${H}`);

  const root = d3.hierarchy({ children: data }).sum(d => d.value);
  d3.treemap().size([SVG_W, H]).padding(3)(root);

  function fitText(el, maxW) {
    try {
      const tw = el.node().getComputedTextLength();
      if (tw > maxW) el.attr('textLength', maxW).attr('lengthAdjust', 'spacingAndGlyphs');
    } catch(e) {}
  }

  root.leaves().forEach((d, i) => {
    const w = d.x1 - d.x0;
    const h = d.y1 - d.y0;
    const pad = 10;
    const maxW = Math.max(0, w - pad * 2);

    const clipId = `clip2-${i}`;
    svg.append('clipPath').attr('id', clipId)
      .append('rect').attr('x', d.x0).attr('y', d.y0).attr('width', w).attr('height', h);

    svg.append('rect')
      .attr('x', d.x0).attr('y', d.y0)
      .attr('width', w).attr('height', h)
      .attr('fill', d.data.color).attr('opacity', 0.82).attr('rx', 2);

    if (w > 30 && h > 30) {
      const g = svg.append('g').attr('clip-path', `url(#${clipId})`);

      fitText(g.append('text')
        .attr('x', d.x0 + w / 2).attr('y', d.y0 + h / 2 - 8)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', 'white').attr('font-size', 16).attr('font-weight', 'bold')
        .attr('letter-spacing', 0.5)
        .text(`${d.data.value}%`), maxW);

      fitText(g.append('text')
        .attr('x', d.x0 + w / 2).attr('y', d.y0 + h / 2 + 12)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', 'white').attr('font-size', 13).attr('font-weight', 'bold').attr('opacity', 0.9)
        .text(d.data.label), maxW);
    }
  });
})();

(function() {
  const groups = [
    { name: 'High school age', range: '~15–18', v2006: 41.43, v2016: 35.32, color: C.vermillion },
    { name: 'University age',  range: '~18–22', v2006: 39.57, v2016: 37.93, color: C.teal },
    { name: 'Early adults',    range: '~23–39', v2006: 41.43, v2016: 39.57, color: C.gold },
    { name: 'Middle adults',   range: '~40+',   v2006: 43.52, v2016: 41.12, color: '#7b5ea7' },
  ];

  const container = document.getElementById('chart3').parentNode;
  const totalW = container.clientWidth - 80;
  const H = 300;
  const SVG_W = totalW + 80;
  const svg = d3.select('#chart3').attr('height', H + 40).attr('viewBox', `0 0 ${SVG_W} ${H + 40}`);

  const marginL = 60, marginR = 20;
  const g = svg.append('g').attr('transform', `translate(${marginL}, 20)`);
  const w = SVG_W - marginL - marginR;
  const h = H;

  const xLeft = w * 0.25;
  const xRight = w * 0.75;

  const y = d3.scaleLinear().domain([33, 46]).range([h, 0]);

  g.selectAll('.gh').data(y.ticks(5)).enter().append('line')
    .attr('x1', 0).attr('x2', w)
    .attr('y1', d => y(d)).attr('y2', d => y(d))
    .attr('stroke', C.faded).attr('stroke-width', 0.5).attr('stroke-dasharray', '4,4').attr('opacity', 0.5);

  [xLeft, xRight].forEach(xPos => {
    g.append('line').attr('x1', xPos).attr('x2', xPos).attr('y1', 0).attr('y2', h)
      .attr('stroke', C.faded).attr('stroke-width', 1);
  });

  g.append('text').attr('x', xLeft).attr('y', -6).attr('text-anchor', 'middle')
    .attr('fill', C.muted).attr('font-size', 11).attr('letter-spacing', 2).text('2006');
  g.append('text').attr('x', xRight).attr('y', -6).attr('text-anchor', 'middle')
    .attr('fill', C.ink).attr('font-size', 11).attr('letter-spacing', 2).attr('font-weight', 'bold').text('2016');

  const tooltip = document.getElementById('treemap-tooltip');
  const lines3 = [];

  groups.forEach(grp => {
    const y06 = y(grp.v2006);
    const y16 = y(grp.v2016);

    const line = g.append('line')
      .attr('x1', xLeft).attr('y1', y06)
      .attr('x2', xLeft).attr('y2', y06)
      .attr('stroke', grp.color).attr('stroke-width', 2).attr('opacity', 0.7);

    const hitLine = g.append('line')
      .attr('x1', xLeft).attr('y1', y06)
      .attr('x2', xLeft).attr('y2', y06)
      .attr('stroke', 'transparent').attr('stroke-width', 12)
      .style('cursor', 'pointer');

    const startDot = g.append('circle').attr('cx', xLeft).attr('cy', y06).attr('r', 6)
      .attr('fill', grp.color).attr('stroke', 'white').attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    const endDot = g.append('circle').attr('cx', xRight).attr('cy', y16).attr('r', 6)
      .attr('fill', grp.color).attr('stroke', 'white').attr('stroke-width', 1.5).attr('opacity', 0)
      .style('cursor', 'pointer');

    const showTooltip = (event, score, year) => {
      tooltip.innerHTML = `<strong style="color:${grp.color}">${grp.name} (${grp.range})</strong>${year} score: ${score.toFixed(2)}`;
      tooltip.classList.add('visible');
      tooltip.style.left = `${event.clientX + 14}px`;
      tooltip.style.top  = `${event.clientY - 10}px`;
    };

    hitLine.on('mousemove', (event) => {
      const svgRect = svg.node().getBoundingClientRect();
      const mx = event.clientX - svgRect.left - marginL;
      const nearStart = Math.abs(mx - xLeft) < Math.abs(mx - xRight);
      showTooltip(event, nearStart ? grp.v2006 : grp.v2016, nearStart ? '2006' : '2016');
    }).on('mouseleave', () => tooltip.classList.remove('visible'));

    startDot.on('mousemove', (event) => showTooltip(event, grp.v2006, '2006'))
      .on('mouseleave', () => tooltip.classList.remove('visible'));
    endDot.on('mousemove', (event) => showTooltip(event, grp.v2016, '2016'))
      .on('mouseleave', () => tooltip.classList.remove('visible'));

    lines3.push({ line, hitLine, endDot, x2: xRight, y2: y16 });
  });

  let chart3Animated = false;
  const chart3Observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !chart3Animated) {
        chart3Animated = true;
        chart3Observer.disconnect();
        lines3.forEach(({ line, hitLine, endDot, x2, y2 }, i) => {
          line.transition().delay(i * 80).duration(800).ease(d3.easeCubicInOut)
            .attr('x2', x2).attr('y2', y2)
            .on('end', () => endDot.transition().duration(200).attr('opacity', 1));
          hitLine.transition().delay(i * 80).duration(800).ease(d3.easeCubicInOut)
            .attr('x2', x2).attr('y2', y2);
        });
      }
    });
  }, { threshold: 0.3 });
  chart3Observer.observe(svg.node());

  g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(5).tickFormat(d => d.toFixed(0)));

})();

(function() {
  const tooltip = document.getElementById('treemap-tooltip');
  const groups = [
    { name: '10–19', v2004: 500, v2024: 60,  color: C.vermillion },
    { name: '20–29', v2004: 420, v2024: 32,  color: C.teal },
    { name: '30–39', v2004: 310, v2024: 90,  color: C.gold },
    { name: '40–49', v2004: 280, v2024: 130, color: '#7b5ea7' },
    { name: '50–59', v2004: 250, v2024: 200, color: '#2e6b3e' },
    { name: '60+',   v2004: 220, v2024: 380, color: '#c07a2b' },
  ];

  const container = document.getElementById('chart4').parentNode;
  const totalW = container.clientWidth - 80;
  const H = 300;
  const SVG_W = totalW + 80;
  const svg = d3.select('#chart4').attr('height', H + 40).attr('viewBox', `0 0 ${SVG_W} ${H + 40}`);

  const marginL = 60, marginR = 20;
  const g = svg.append('g').attr('transform', `translate(${marginL}, 20)`);
  const w = SVG_W - marginL - marginR;
  const h = H;

  const xLeft = w * 0.25;
  const xRight = w * 0.75;

  const y = d3.scaleLinear().domain([0, 550]).range([h, 0]);

  g.selectAll('.gh4').data(y.ticks(6)).enter().append('line')
    .attr('x1', 0).attr('x2', w)
    .attr('y1', d => y(d)).attr('y2', d => y(d))
    .attr('stroke', C.faded).attr('stroke-width', 0.5).attr('stroke-dasharray', '4,4').attr('opacity', 0.5);

  [xLeft, xRight].forEach(xPos => {
    g.append('line').attr('x1', xPos).attr('x2', xPos).attr('y1', 0).attr('y2', h)
      .attr('stroke', C.faded).attr('stroke-width', 1);
  });

  g.append('text').attr('x', xLeft).attr('y', -6).attr('text-anchor', 'middle')
    .attr('fill', C.muted).attr('font-size', 11).attr('letter-spacing', 2).text('2004');
  g.append('text').attr('x', xRight).attr('y', -6).attr('text-anchor', 'middle')
    .attr('fill', C.ink).attr('font-size', 11).attr('letter-spacing', 2).attr('font-weight', 'bold').text('2024');

  const lines4 = [];

  groups.forEach(grp => {
    const y04 = y(grp.v2004);
    const y24 = y(grp.v2024);

    const line = g.append('line')
      .attr('x1', xLeft).attr('y1', y04)
      .attr('x2', xLeft).attr('y2', y04)
      .attr('stroke', grp.color).attr('stroke-width', 2).attr('opacity', 0.7);

    const hitLine = g.append('line')
      .attr('x1', xLeft).attr('y1', y04)
      .attr('x2', xLeft).attr('y2', y04)
      .attr('stroke', 'transparent').attr('stroke-width', 12)
      .style('cursor', 'pointer');

    const startDot = g.append('circle').attr('cx', xLeft).attr('cy', y04).attr('r', 6)
      .attr('fill', grp.color).attr('stroke', 'white').attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    const endDot = g.append('circle').attr('cx', xRight).attr('cy', y24).attr('r', 6)
      .attr('fill', grp.color).attr('stroke', 'white').attr('stroke-width', 1.5).attr('opacity', 0)
      .style('cursor', 'pointer');

    const showTooltip = (event, score, year) => {
      tooltip.innerHTML = `<strong style="color:${grp.color}">${grp.name}</strong>${year}: ${score} characters/day`;
      tooltip.classList.add('visible');
      tooltip.style.left = `${event.clientX + 14}px`;
      tooltip.style.top  = `${event.clientY - 10}px`;
    };

    hitLine.on('mousemove', (event) => {
      const svgRect = svg.node().getBoundingClientRect();
      const mx = event.clientX - svgRect.left - marginL;
      const nearStart = Math.abs(mx - xLeft) < Math.abs(mx - xRight);
      showTooltip(event, nearStart ? grp.v2004 : grp.v2024, nearStart ? '2004' : '2024');
    }).on('mouseleave', () => tooltip.classList.remove('visible'));

    startDot.on('mousemove', (event) => showTooltip(event, grp.v2004, '2004'))
      .on('mouseleave', () => tooltip.classList.remove('visible'));
    endDot.on('mousemove', (event) => showTooltip(event, grp.v2024, '2024'))
      .on('mouseleave', () => tooltip.classList.remove('visible'));

    lines4.push({ line, hitLine, endDot, x2: xRight, y2: y24 });
  });

  let chart4Animated = false;
  const chart4Observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !chart4Animated) {
        chart4Animated = true;
        chart4Observer.disconnect();
        lines4.forEach(({ line, hitLine, endDot, x2, y2 }, i) => {
          line.transition().delay(i * 80).duration(800).ease(d3.easeCubicInOut)
            .attr('x2', x2).attr('y2', y2)
            .on('end', () => endDot.transition().duration(200).attr('opacity', 1));
          hitLine.transition().delay(i * 80).duration(800).ease(d3.easeCubicInOut)
            .attr('x2', x2).attr('y2', y2);
        });
      }
    });
  }, { threshold: 0.3 });
  chart4Observer.observe(svg.node());

  g.append('g').attr('class', 'axis').call(d3.axisLeft(y).ticks(6).tickFormat(d => d));
})();