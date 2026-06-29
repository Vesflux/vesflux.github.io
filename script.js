const GITHUB_USER = 'Vesflux';
const MIN_CARDS_PER_ROW = 20;

const fallbackRepos = [
  {
    name: 'VinuStorage',
    html_url: 'https://github.com/Vesflux/VinuStorage',
    homepage: '',
    language: 'HTML',
    stargazers_count: 0,
    updated_at: '2026-01-19T00:01:00Z',
    summary: 'Browser-based file vault for VinuChain. It packages files, optionally encrypts them, and stores chunks directly in transaction calldata.'
  },
  {
    name: 'No-Train-Get-Attention',
    html_url: 'https://github.com/Vesflux/No-Train-Get-Attention',
    homepage: '',
    language: 'Python',
    stargazers_count: 0,
    updated_at: '2026-01-19T00:01:00Z',
    summary: 'Tiny Python experiment for generating attention-like token weights without training a model.'
  },
  {
    name: 'vesflux.github.io',
    html_url: 'https://github.com/Vesflux/vesflux.github.io',
    homepage: 'https://vesflux.github.io',
    language: 'CSS',
    stargazers_count: 0,
    updated_at: new Date().toISOString(),
    summary: 'Dark neon personal surface for Baan with an interactive background, live GitHub project reels, and direct contact paths.'
  }
];

const statusEl = document.querySelector('#repo-status');
const rows = [document.querySelector('#row-a'), document.querySelector('#row-b')];
const canvas = document.querySelector('#field');
const ctx = canvas.getContext('2d');
const pointer = { x: 0.72, y: 0.28, tx: 0.72, ty: 0.28 };
const particles = Array.from({ length: 86 }, (_, i) => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.8 + Math.random() * 2.2,
  speed: 0.0004 + Math.random() * 0.0014,
  phase: Math.random() * Math.PI * 2,
  hue: i % 3
}));

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawField(time = 0) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  pointer.x += (pointer.tx - pointer.x) * 0.055;
  pointer.y += (pointer.ty - pointer.y) * 0.055;

  ctx.clearRect(0, 0, w, h);
  const base = ctx.createLinearGradient(0, 0, w, h);
  base.addColorStop(0, '#090010');
  base.addColorStop(0.42, '#160020');
  base.addColorStop(1, '#230a33');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(pointer.x * w, pointer.y * h, 0, pointer.x * w, pointer.y * h, Math.max(w, h) * 0.62);
  glow.addColorStop(0, 'rgba(183,255,42,0.20)');
  glow.addColorStop(0.22, 'rgba(255,63,180,0.16)');
  glow.addColorStop(0.46, 'rgba(255,157,46,0.08)');
  glow.addColorStop(1, 'rgba(16,0,24,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const y = h * (0.18 + i * 0.105);
    const amp = 26 + i * 9;
    ctx.beginPath();
    for (let x = -80; x <= w + 80; x += 24) {
      const n = Math.sin(x * 0.006 + time * 0.00045 + i) * amp;
      const pull = (pointer.y - 0.5) * 40;
      const yy = y + n + pull + Math.cos(time * 0.0003 + i) * 18;
      if (x === -80) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    const color = i % 3 === 0 ? '183,255,42' : i % 3 === 1 ? '255,63,180' : '255,157,46';
    ctx.strokeStyle = `rgba(${color},${0.09 + i * 0.012})`;
    ctx.stroke();
  }

  for (const p of particles) {
    p.y -= p.speed;
    if (p.y < -0.04) {
      p.y = 1.04;
      p.x = Math.random();
    }
    const drift = Math.sin(time * 0.001 + p.phase) * 18;
    const x = p.x * w + drift + (pointer.x - 0.5) * 36;
    const y = p.y * h + (pointer.y - 0.5) * 24;
    const color = p.hue === 0 ? '183,255,42' : p.hue === 1 ? '255,63,180' : '255,157,46';
    ctx.beginPath();
    ctx.fillStyle = `rgba(${color},0.46)`;
    ctx.shadowColor = `rgba(${color},0.7)`;
    ctx.shadowBlur = 14;
    ctx.arc(x, y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  requestAnimationFrame(drawField);
}

function stripMarkdown(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]+]\([^)]*\)/g, match => match.replace(/^\[|\]\([^)]*\)$/g, ''))
    .replace(/[#>*_`|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(text = '', fallback = '') {
  const clean = stripMarkdown(text || fallback);
  if (!clean) return 'A compact public experiment from Baan. Open it to inspect the repo, source, and latest direction.';
  return clean.length > 168 ? `${clean.slice(0, 168).trim()}...` : clean;
}

async function fetchReadmeSummary(repo) {
  try {
    const rootResponse = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo.name}/contents`);
    if (!rootResponse.ok) throw new Error('Repository contents unavailable');
    const files = await rootResponse.json();
    const readme = Array.isArray(files)
      ? files.find(file => /^readme(\.|$)/i.test(file.name) && file.download_url)
      : null;
    if (!readme) throw new Error('README unavailable');
    const readmeResponse = await fetch(readme.download_url);
    if (!readmeResponse.ok) throw new Error('README download unavailable');
    return summarize(await readmeResponse.text(), repo.description || repo.summary);
  } catch (error) {
    return summarize(repo.description || repo.summary);
  }
}

function sortRepos(repos) {
  return repos
    .filter(repo => !repo.fork)
    .filter(repo => repo.name !== `${GITHUB_USER}`)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

function fillToTwenty(repos) {
  const source = repos.length ? repos : fallbackRepos;
  const output = [];
  let i = 0;
  while (output.length < MIN_CARDS_PER_ROW) {
    output.push({ ...source[i % source.length], cloneIndex: output.length });
    i += 1;
  }
  return output;
}

function projectUrl(repo) {
  return repo.homepage || repo.html_url;
}

function createCard(repo, index) {
  const card = document.createElement('a');
  const top = document.createElement('div');
  const indexEl = document.createElement('span');
  const chip = document.createElement('span');
  const title = document.createElement('h3');
  const desc = document.createElement('p');
  const stats = document.createElement('div');
  const year = document.createElement('span');
  const stars = document.createElement('span');

  card.className = 'project-card';
  card.href = projectUrl(repo);
  card.target = '_blank';
  card.rel = 'noreferrer';
  card.setAttribute('aria-label', `Open ${repo.name}`);

  top.className = 'project-top';
  indexEl.className = 'project-index';
  indexEl.textContent = String(index + 1).padStart(2, '0');
  chip.className = 'project-chip';
  chip.textContent = repo.language || 'Repo';
  top.append(indexEl, chip);

  title.className = 'project-name';
  title.textContent = repo.name;

  desc.className = 'project-desc';
  desc.textContent = repo.summary;

  stats.className = 'project-stats';
  year.textContent = new Date(repo.updated_at).getFullYear();
  stars.textContent = `${repo.stargazers_count || 0} stars`;
  stats.append(year, stars);

  card.append(top, title, desc, stats);
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    card.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });
  return card;
}

function renderRows(repos) {
  const rowA = fillToTwenty(repos);
  const rowB = fillToTwenty([...repos].reverse());
  [rowA, rowB].forEach((row, rowIndex) => {
    const doubled = [...row, ...row];
    rows[rowIndex].replaceChildren(...doubled.map((repo, index) => createCard(repo, index % MIN_CARDS_PER_ROW)));
  });
}

async function loadRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!response.ok) throw new Error('GitHub API unavailable');
    const repos = sortRepos(await response.json());
    const enriched = await Promise.all(repos.map(async repo => ({
      ...repo,
      summary: await fetchReadmeSummary(repo)
    })));
    renderRows(enriched);
    statusEl.textContent = `${enriched.length} repositories fetched from GitHub. Hover a row to pause.`;
  } catch (error) {
    renderRows(fallbackRepos);
    statusEl.textContent = 'Using local project fallback. GitHub API may be rate-limited.';
  }
}

window.addEventListener('pointermove', event => {
  pointer.tx = event.clientX / window.innerWidth;
  pointer.ty = event.clientY / window.innerHeight;
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
drawField();
loadRepos();
