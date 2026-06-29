const GITHUB_USER = 'Vesflux';
const MIN_CARDS_PER_ROW = 20;
const TRANSLATIONS = {
  en: {
    pageTitle: 'Baan',
    metaDescription: 'Baan builds Web3 experiments, chain-native tools, and tiny intelligent systems.',
    ogDescription: 'Dark neon personal homepage for Baan / Vesflux.',
    navAbout: 'About',
    navProjects: 'Projects',
    navContact: 'Contact',
    heroEyebrow: 'Web3 experiments / weird utilities / minimal interfaces',
    heroLead: 'I build crypto-native tools, chain storage experiments, and small heuristic systems with a taste for sharp interfaces and strange mechanics.',
    heroCta: 'Explore projects',
    profileAria: 'Profile',
    portraitAlt: 'Baan avatar',
    profileAlias: 'Alias',
    profileHandle: 'Handle',
    profileStatus: 'Building in public',
    aboutLabel: 'About',
    aboutTitle: 'Dark tools, bright signals.',
    aboutBodyOne: 'Baan is the builder nickname behind Vesflux: focused on Web3 utilities, protocol-adjacent experiments, and compact systems that do one thing with conviction.',
    aboutBodyTwo: 'The work leans experimental but practical: on-chain storage, no-train attention heuristics, minimal frontends, and anything that feels like it should exist for curious networks.',
    projectsLabel: 'Projects',
    projectsTitle: 'Repos in motion.',
    projectsLoading: 'Loading GitHub repos...',
    projectsLoaded: count => `${count} repositories fetched from GitHub. Hover a row to pause.`,
    projectsFallback: 'Using local project fallback. GitHub API may be rate-limited.',
    contactLabel: 'Contact',
    contactTitle: 'Ping the signal.',
    emailLabel: 'Email',
    footerLine: 'Built for strange networks.',
    fallbackSummary: 'A compact public experiment from Baan. Open it to inspect the repo, source, and latest direction.',
    stars: count => `${count || 0} stars`,
    openRepo: name => `Open ${name}`
  },
  zh: {
    pageTitle: 'Baan',
    metaDescription: 'Baan 构建 Web3 实验、链上原生工具和小型智能系统。',
    ogDescription: 'Baan / Vesflux 的暗色霓虹个人主页。',
    navAbout: '关于',
    navProjects: '项目',
    navContact: '联系',
    heroEyebrow: 'Web3 实验 / 奇妙工具 / 极简界面',
    heroLead: '我在构建加密原生工具、链上存储实验和小型启发式系统，偏爱锋利的界面与有趣的机制。',
    heroCta: '查看项目',
    profileAria: '个人资料',
    portraitAlt: 'Baan 头像',
    profileAlias: '昵称',
    profileHandle: '账号',
    profileStatus: '公开构建中',
    aboutLabel: '关于',
    aboutTitle: '暗色工具，明亮信号。',
    aboutBodyOne: 'Baan 是 Vesflux 背后的 builder 昵称：专注于 Web3 工具、协议周边实验，以及目标明确的小型系统。',
    aboutBodyTwo: '作品偏实验但实用：链上存储、免训练注意力启发式、极简前端，以及那些感觉就该存在于好奇网络里的东西。',
    projectsLabel: '项目',
    projectsTitle: '流动中的仓库。',
    projectsLoading: '正在加载 GitHub 仓库...',
    projectsLoaded: count => `已从 GitHub 获取 ${count} 个仓库。悬停项目行可暂停滚动。`,
    projectsFallback: '正在使用本地项目备用数据，GitHub API 可能被限流。',
    contactLabel: '联系',
    contactTitle: '捕捉信号。',
    emailLabel: '邮箱',
    footerLine: '为奇妙网络而构建。',
    fallbackSummary: '一个来自 Baan 的公开小实验。打开它可以查看仓库、源码和最新方向。',
    stars: count => `${count || 0} 星`,
    openRepo: name => `打开 ${name}`
  }
};

const currentLang = resolveLanguage();
const i18n = TRANSLATIONS[currentLang];
const KNOWN_REPO_SUMMARIES = {
  VinuStorage: {
    en: 'Browser-based file vault for VinuChain. It packages files, optionally encrypts them, and stores chunks directly in transaction calldata.',
    zh: '面向 VinuChain 的浏览器文件保险库：打包文件、可选加密，并把分片直接写入交易 calldata。'
  },
  'No-Train-Get-Attention': {
    en: 'Tiny Python experiment for generating attention-like token weights without training a model.',
    zh: '一个小型 Python 实验：不训练模型，也能生成类似注意力机制的 token 权重。'
  },
  'Magnet-MultiThreading-Miner': {
    en: 'Magnet multi-threading miner experiment with a compact repo surface and direct source inspection.',
    zh: 'Magnet 多线程挖矿实验：仓库结构紧凑，适合直接查看源码和实现思路。'
  },
  'vesflux.github.io': {
    en: 'Dark neon personal surface for Baan with an interactive background, live GitHub project reels, and direct contact paths.',
    zh: 'Baan 的暗色霓虹个人主页：互动背景、GitHub 项目滚动展示和直接联系入口。'
  }
};

const fallbackRepos = [
  {
    name: 'VinuStorage',
    html_url: 'https://github.com/Vesflux/VinuStorage',
    homepage: '',
    language: 'HTML',
    stargazers_count: 0,
    updated_at: '2026-01-19T00:01:00Z',
    summary: KNOWN_REPO_SUMMARIES.VinuStorage
  },
  {
    name: 'No-Train-Get-Attention',
    html_url: 'https://github.com/Vesflux/No-Train-Get-Attention',
    homepage: '',
    language: 'Python',
    stargazers_count: 0,
    updated_at: '2026-01-19T00:01:00Z',
    summary: KNOWN_REPO_SUMMARIES['No-Train-Get-Attention']
  },
  {
    name: 'vesflux.github.io',
    html_url: 'https://github.com/Vesflux/vesflux.github.io',
    homepage: 'https://vesflux.github.io',
    language: 'CSS',
    stargazers_count: 0,
    updated_at: new Date().toISOString(),
    summary: KNOWN_REPO_SUMMARIES['vesflux.github.io']
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

function resolveLanguage() {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return languages.some(language => language.toLowerCase().startsWith('zh')) ? 'zh' : 'en';
}

function translate(key, ...args) {
  const value = i18n[key] ?? TRANSLATIONS.en[key];
  return typeof value === 'function' ? value(...args) : value;
}

function localized(value) {
  if (value && typeof value === 'object') return value[currentLang] || value.en || value.zh || '';
  return value || '';
}

function repoSummarySource(repo) {
  return KNOWN_REPO_SUMMARIES[repo.name] || repo.description || repo.summary;
}

function applyTranslations() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.title = translate('pageTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', translate('metaDescription'));
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', translate('ogDescription'));
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    element.setAttribute('alt', translate(element.dataset.i18nAlt));
  });
}

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
  const clean = stripMarkdown(text || localized(fallback));
  if (!clean) return translate('fallbackSummary');
  return clean.length > 168 ? `${clean.slice(0, 168).trim()}...` : clean;
}

async function fetchReadmeSummary(repo) {
  const fallback = repoSummarySource(repo);
  if (currentLang === 'zh' && KNOWN_REPO_SUMMARIES[repo.name]?.zh) {
    return localized(KNOWN_REPO_SUMMARIES[repo.name]);
  }

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
    return summarize(await readmeResponse.text(), fallback);
  } catch (error) {
    return summarize('', fallback);
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
  card.setAttribute('aria-label', translate('openRepo', repo.name));

  top.className = 'project-top';
  indexEl.className = 'project-index';
  indexEl.textContent = String(index + 1).padStart(2, '0');
  chip.className = 'project-chip';
  chip.textContent = repo.language || 'Repo';
  top.append(indexEl, chip);

  title.className = 'project-name';
  title.textContent = repo.name;

  desc.className = 'project-desc';
  desc.textContent = localized(repo.summary);

  stats.className = 'project-stats';
  year.textContent = new Date(repo.updated_at).getFullYear();
  stars.textContent = translate('stars', repo.stargazers_count);
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
    statusEl.textContent = translate('projectsLoaded', enriched.length);
  } catch (error) {
    renderRows(fallbackRepos);
    statusEl.textContent = translate('projectsFallback');
  }
}

window.addEventListener('pointermove', event => {
  pointer.tx = event.clientX / window.innerWidth;
  pointer.ty = event.clientY / window.innerHeight;
});

window.addEventListener('resize', resizeCanvas);

applyTranslations();
resizeCanvas();
drawField();
loadRepos();
