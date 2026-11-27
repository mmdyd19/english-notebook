'use strict';
// 내 영어 표현장 — 외부 라이브러리 없음.
// 데이터: Supabase(공통 DB)에 저장하고, 이 기기에는 오프라인용 사본만 둔다.
// 보안 원칙: 사용자가 붙여넣은 내용은 절대 HTML 로 해석하지 않는다 (textContent 만 사용).

(function () {
  const CFG = window.EN_CONFIG || {};
  const API = (CFG.SUPABASE_URL || '').replace(/\/+$/, '');
  const KEY = CFG.SUPABASE_KEY || '';
  const CLOUD = Boolean(API && KEY && /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(API));

  const STORE_KEY = 'en-notebook-v1';
  const PENDING_KEY = 'en-notebook-pending';
  const SESSION_KEY = 'en-notebook-session';
  const TYPES = ['단어', '숙어', '구동사', '슬랭·줄임말', '직역투 교정'];
  const FIELDS = [
    ['type', '유형'], ['source', '출처'], ['sentence', '원문 문장'], ['literal', '직역'],
    ['natural', '의역'], ['meaning', '뜻·뉘앙스'], ['register', '격식도'],
    ['mine', '내 원래 문장'], ['example', '예문'],
  ];
  // 앱 필드 ↔ DB 컬럼
  const COLS = {
    expr: 'expr', type: 'ctype', source: 'source', sentence: 'sentence', literal: 'lit', natural: 'nat',
    meaning: 'meaning', register: 'formality', mine: 'mine', example: 'example',
    created: 'created', due: 'due', level: 'level', used: 'used', id: 'id',
  };
  const KEY_ALIASES = {
    '표현': 'expr', '유형': 'type', '출처': 'source', '원문 문장': 'sentence', '원문': 'sentence',
    '직역': 'literal', '의역': 'natural', '뜻·뉘앙스': 'meaning', '뜻': 'meaning', '뉘앙스': 'meaning',
    '뜻/뉘앙스': 'meaning', '격식도': 'register', '내 원래 문장': 'mine', '예문': 'example',
  };
  const MAX_TEXT = 2000;
  const MAX_CARDS = 5000;
  const INTERVALS = [0, 1, 3, 7, 14, 30, 60]; // 단계별 다음 복습까지 일수
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  const TYPE_EMOJI = { '단어': '📘', '숙어': '🧩', '구동사': '🚀', '슬랭·줄임말': '😎', '직역투 교정': '🔧' };
  const SOURCE_EMOJI = { '채팅': '💬', '말해보카': '📗', '음성': '🎙️', '읽기': '📰' };

  const $ = (id) => document.getElementById(id);
  const mascot = () => $('tplMascot').content.firstElementChild.cloneNode(true);
  const badge = (t) => {
    const b = el('span', 'badge', `${TYPE_EMOJI[t] || '🏷️'} ${t}`);
    b.dataset.t = t;
    return b;
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // ---------- 로컬 저장 ----------
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function writeJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  }
  function saveLocal() {
    if (!writeJSON(STORE_KEY, cards)) alert('이 기기에 저장하지 못했어요. 저장 공간이 부족하거나 개인정보 보호 모드일 수 있어요.');
  }

  function clean(v) {
    if (typeof v !== 'string') return '';
    return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, MAX_TEXT);
  }
  function sanitizeCard(c) {
    if (!c || typeof c !== 'object') return null;
    const out = { expr: clean(c.expr) };
    if (!out.expr) return null;
    for (const [k] of FIELDS) out[k] = clean(c[k]);
    out.id = typeof c.id === 'string' && UUID_RE.test(c.id) ? c.id : crypto.randomUUID();
    out.created = validDate(c.created) || today();
    out.due = validDate(c.due) || today();
    out.level = Number.isInteger(c.level) && c.level >= 0 && c.level < INTERVALS.length ? c.level : 0;
    out.used = c.used === true;
    return out;
  }
  function validDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : ''; }
  function today(offsetDays) {
    const d = new Date();
    if (offsetDays) d.setDate(d.getDate() + offsetDays);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

  let cards = (readJSON(STORE_KEY, []) || []).map(sanitizeCard).filter(Boolean);
  let pending = readJSON(PENDING_KEY, []);
  if (!Array.isArray(pending)) pending = [];
  let session = readJSON(SESSION_KEY, null);
  let filter = '전체';
  let query = '';

  // ---------- 클라우드 (Supabase REST, 라이브러리 없이) ----------
  function toRow(c) {
    const r = {};
    for (const [k, col] of Object.entries(COLS)) r[col] = c[k];
    r.updated_at = new Date().toISOString();
    return r;
  }
  function fromRow(r) {
    const c = {};
    for (const [k, col] of Object.entries(COLS)) c[k] = r[col] == null ? '' : r[col];
    c.level = Number(r.level) || 0;
    c.used = r.used === true;
    return sanitizeCard(c);
  }

  async function authCall(path, body) {
    const res = await fetch(`${API}/auth/v1/${path}`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.msg || data.error_description || data.message || `HTTP ${res.status}`), { status: res.status });
    return data;
  }
  function setSession(data) {
    session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + (Number(data.expires_in) || 3600) * 1000,
      email: (data.user && data.user.email) || (session && session.email) || '',
    };
    writeJSON(SESSION_KEY, session);
  }
  async function token() {
    if (!session) return null;
    if (Date.now() < session.expires_at - 60000) return session.access_token;
    try {
      setSession(await authCall('token?grant_type=refresh_token', { refresh_token: session.refresh_token }));
      return session.access_token;
    } catch (e) {
      if (e.status === 400 || e.status === 401) logout(true);
      throw e;
    }
  }
  async function rest(method, query, body, extraHeaders) {
    const t = await token();
    if (!t) throw new Error('not logged in');
    const res = await fetch(`${API}/rest/v1/cards${query}`, {
      method,
      headers: Object.assign({ apikey: KEY, Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }, extraHeaders || {}),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
    return res.status === 204 ? null : res.json().catch(() => null);
  }

  // 변경은 "할 일 목록(pending)"에 쌓았다가 서버로 보낸다 → 오프라인에서도 안전
  function queue(op) {
    if (!CLOUD) return;
    if (op.op === 'upsert') pending = pending.filter((p) => !(p.op === 'upsert' && p.card.id === op.card.id));
    pending.push(op);
    writeJSON(PENDING_KEY, pending);
    scheduleSync();
  }

  let syncTimer = null;
  let syncing = false;
  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(sync, 600);
  }
  async function sync() {
    if (!CLOUD) return setStatus('local');
    if (!session) return setStatus('login');
    if (syncing) return scheduleSync();
    if (!navigator.onLine) return setStatus('offline');
    syncing = true;
    setStatus('syncing');
    try {
      while (pending.length) {
        const op = pending[0];
        if (op.op === 'upsert') {
          await rest('POST', '?on_conflict=id', [toRow(op.card)], { Prefer: 'resolution=merge-duplicates,return=minimal' });
        } else if (op.op === 'delete' && UUID_RE.test(op.id)) {
          await rest('DELETE', `?id=eq.${op.id}`);
        }
        pending.shift();
        writeJSON(PENDING_KEY, pending);
      }
      const rows = await rest('GET', '?select=*&order=created.desc&limit=5000');
      if (Array.isArray(rows)) {
        cards = rows.map(fromRow).filter(Boolean);
        saveLocal();
        renderList();
      }
      setStatus('ok');
    } catch (e) {
      setStatus(session ? 'error' : 'login');
    } finally {
      syncing = false;
    }
  }

  function setStatus(s) {
    const map = {
      local: '📱 이 기기에만 저장',
      login: '🔒 로그인 · 회원가입',
      syncing: '⏳ 동기화 중',
      ok: '☁️ 동기화됨',
      offline: '📴 오프라인 (나중에 동기화)',
      error: '⚠️ 동기화 실패 · 눌러서 다시',
    };
    const b = $('syncStatus');
    b.textContent = map[s] || '';
    b.dataset.s = s;
  }
  $('syncStatus').addEventListener('click', () => {
    if (!CLOUD) return;
    if (!session) openLogin();
    else sync();
  });

  // ---------- 로그인 (이메일 + 비밀번호, 새 가입은 서버에서 막아 둠) ----------
  let authMode = 'login';
  function setAuthMode(mode) {
    authMode = mode;
    const signup = mode === 'signup';
    $('tabLogin').setAttribute('aria-selected', String(!signup));
    $('tabSignup').setAttribute('aria-selected', String(signup));
    $('authTitle').textContent = signup ? '회원가입' : '로그인';
    $('authNote').textContent = signup
      ? '초대 코드를 받은 사람만 가입할 수 있어요. 비밀번호는 6자 이상이에요.'
      : '로그인하면 폰·패드·PC 어디서든 같은 표현장을 봐요. 한 번 로그인하면 계속 유지돼요.';
    $('signupPw2').hidden = !signup;
    $('signupCode').hidden = !signup;
    $('loginPw').autocomplete = signup ? 'new-password' : 'current-password';
    $('btnLogin').textContent = signup ? '가입하고 시작하기' : '로그인';
    $('loginMsg').textContent = '';
  }
  $('tabLogin').addEventListener('click', () => setAuthMode('login'));
  $('tabSignup').addEventListener('click', () => setAuthMode('signup'));

  function openLogin() {
    $('loginMsg').textContent = '';
    $('loginPw').value = '';
    $('signupPw2').value = '';
    setAuthMode(cards.length || localStorage.getItem('en-notebook-seen') ? 'login' : 'signup');
    $('dlgLogin').showModal();
  }

  async function signupCall(email, password, code) {
    const res = await fetch(`${API}/functions/v1/signup`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || 'server'), { code: data.error || 'server', status: res.status });
  }
  const SIGNUP_ERR = {
    code: '초대 코드가 맞지 않아요.',
    exists: '이미 가입된 이메일이에요. 로그인 탭에서 로그인해 주세요.',
    email: '이메일 주소를 확인해 주세요.',
    password: '비밀번호는 6자 이상이어야 해요.',
  };

  $('btnLogin').addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    const pw = $('loginPw').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !pw) { $('loginMsg').textContent = '이메일과 비밀번호를 확인해 주세요.'; return; }
    if (authMode === 'signup') {
      if (pw.length < 6) { $('loginMsg').textContent = SIGNUP_ERR.password; return; }
      if (pw !== $('signupPw2').value) { $('loginMsg').textContent = '비밀번호 두 개가 서로 달라요.'; return; }
      if (!$('signupCode').value.trim()) { $('loginMsg').textContent = '초대 코드를 입력해 주세요.'; return; }
    }
    $('btnLogin').disabled = true;
    try {
      if (authMode === 'signup') {
        try {
          await signupCall(email, pw, $('signupCode').value.trim().toUpperCase());
        } catch (e) {
          $('loginMsg').textContent = SIGNUP_ERR[e.code] || '가입하지 못했어요. 잠시 후 다시 시도해 주세요.';
          return;
        }
      }
      setSession(await authCall('token?grant_type=password', { email, password: pw }));
      try { localStorage.setItem('en-notebook-seen', '1'); } catch (e) { /* ignore */ }
      $('signupCode').value = '';
      $('signupPw2').value = '';
      $('loginPw').value = '';
      // 로그인 전에 이 기기에 만들어 둔 카드는 서버로 올린다
      const server = await rest('GET', '?select=id,expr');
      const have = new Set((server || []).map((r) => norm(r.expr)));
      for (const c of cards) if (!have.has(norm(c.expr))) queue({ op: 'upsert', card: c });
      $('dlgLogin').close();
      sync();
    } catch (e) {
      $('loginMsg').textContent = e.status === 429 ? '시도가 너무 많아요. 잠시 후 다시 해 주세요.' : '이메일 또는 비밀번호가 맞지 않아요.';
    } finally {
      $('btnLogin').disabled = false;
    }
  });
  $('loginPw').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('btnLogin').click(); });
  function logout(silent) {
    if (!silent && !confirm('로그아웃할까요? 이 기기에 저장된 사본도 지워요 (서버 데이터는 그대로).')) return;
    if (session && !silent) {
      fetch(`${API}/auth/v1/logout`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${session.access_token}` } }).catch(() => {});
    }
    session = null;
    // 자동 로그아웃(토큰 만료)일 때는 아직 못 보낸 변경을 지키기 위해 사본을 남긴다
    const keys = silent ? [SESSION_KEY] : [SESSION_KEY, PENDING_KEY, STORE_KEY];
    if (!silent) { pending = []; cards = []; }
    for (const k of keys) try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    renderList();
    setStatus('login');
    if ($('dlgMore').open) $('dlgMore').close();
  }
  $('btnLogout').addEventListener('click', () => logout(false));

  // ---------- 붙여넣기 파싱 ----------
  function parse(text) {
    const blocks = String(text).replace(/\r/g, '').split(/^\s*-{3,}\s*$/m);
    const found = [];
    for (const block of blocks) {
      const card = {};
      let lastKey = null;
      for (let line of block.split('\n')) {
        line = line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').replace(/\*\*/g, '').replace(/^#+\s*/, '');
        if (/^\s*오늘의 한 줄/.test(line)) { lastKey = null; continue; }
        const m = line.match(/^\s*([^:：]{1,12})\s*[:：]\s*(.*)$/);
        const key = m ? KEY_ALIASES[m[1].trim()] : null;
        if (key) {
          card[key] = (card[key] ? card[key] + '\n' : '') + m[2].trim();
          lastKey = key;
        } else if (lastKey && line.trim()) {
          card[lastKey] += '\n' + line.trim();
        }
      }
      if (card.type && !TYPES.includes(card.type.trim())) {
        const t = TYPES.find((x) => card.type.includes(x.split('·')[0]));
        if (t) card.type = t;
      }
      const s = sanitizeCard(card);
      if (s) found.push(s);
    }
    return found;
  }

  // ---------- 목록 ----------
  function renderTabs() {
    const tabs = $('tabs');
    tabs.replaceChildren();
    for (const t of ['전체', ...TYPES, '써먹음']) {
      const b = el('button', 'tab', t);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(t === filter));
      b.addEventListener('click', () => { filter = t; renderTabs(); renderList(); });
      tabs.append(b);
    }
  }

  function renderList() {
    const list = $('list');
    list.replaceChildren();
    const q = norm(query);
    const shown = cards
      .filter((c) => filter === '전체' || (filter === '써먹음' ? c.used : c.type === filter))
      .filter((c) => !q || norm([c.expr, c.meaning, c.natural, c.sentence, c.example, c.mine].join(' ')).includes(q))
      .sort((a, b) => (a.created < b.created ? 1 : a.created > b.created ? -1 : 0));

    $('count').textContent = `${cards.length}개`;
    const due = dueCards().length;
    $('dueCount').textContent = due ? String(due) : '';
    const chip = $('todayChip');
    chip.className = 'today-chip' + (cards.length && !due ? ' clear' : '');
    chip.textContent = !cards.length ? '' : due ? `🔥 오늘 복습 ${due}장 남았어요` : '🎉 오늘 복습 끝!';

    if (!shown.length) {
      let msg = '아직 표현이 없어요.\n아래 ＋ 붙여넣기로 첫 카드를 만들어 봐요!';
      if (cards.length) msg = '찾는 표현이 없어요.';
      else if (CLOUD && !session) msg = '반가워요! 위의 🔒 로그인 · 회원가입을 눌러 주세요.\n처음이면 초대 코드로 가입할 수 있어요.';
      const box = el('div', 'empty');
      box.append(mascot(), el('p', '', msg));
      list.append(box);
      return;
    }
    for (const c of shown) {
      const item = el('button', 'item');
      item.type = 'button';
      if (c.type) item.dataset.t = c.type;
      const top = el('div', 'item-top');
      top.append(el('span', 'expr', c.expr));
      if (c.type) top.append(badge(c.type));
      item.append(top);
      const m = c.meaning || c.natural;
      if (m) item.append(el('div', 'meaning', m.split('\n')[0]));
      const meta = el('div', 'meta');
      if (c.source) meta.append(el('span', '', `${SOURCE_EMOJI[c.source] || '📌'} ${c.source}`));
      meta.append(el('span', '', c.created.slice(5).replace('-', '/')));
      if (c.used) meta.append(el('span', 'used', '✅ 써먹음'));
      item.append(meta);
      item.addEventListener('click', () => openCard(c.id));
      list.append(item);
    }
  }

  // ---------- 카드 상세 ----------
  let openId = null;
  function fieldsView(c, keys) {
    const box = el('div', 'fields');
    for (const [k, label] of FIELDS) {
      if (keys && !keys.includes(k)) continue;
      if (!c[k]) continue;
      const f = el('div', 'field');
      f.append(el('div', 'field-k', label), el('div', 'field-v', c[k]));
      box.append(f);
    }
    return box;
  }
  function openCard(id) {
    const c = cards.find((x) => x.id === id);
    if (!c) return;
    openId = id;
    $('cardTitle').textContent = c.expr;
    $('cardBody').replaceChildren(fieldsView(c));
    $('btnUsed').textContent = c.used ? '✅ 써먹었어요' : '써먹었어요 표시';
    $('dlgCard').showModal();
  }
  $('btnUsed').addEventListener('click', () => {
    const c = cards.find((x) => x.id === openId);
    if (!c) return;
    c.used = !c.used;
    saveLocal();
    queue({ op: 'upsert', card: c });
    $('btnUsed').textContent = c.used ? '✅ 써먹었어요' : '써먹었어요 표시';
    renderList();
  });
  $('btnDelete').addEventListener('click', () => {
    const c = cards.find((x) => x.id === openId);
    if (!c || !confirm(`"${c.expr}" 카드를 삭제할까요?`)) return;
    cards = cards.filter((x) => x.id !== openId);
    saveLocal();
    queue({ op: 'delete', id: openId });
    $('dlgCard').close();
    renderList();
  });

  // ---------- 붙여넣기 ----------
  let parsed = [];
  $('btnAdd').addEventListener('click', () => {
    $('pasteBox').value = '';
    $('preview').replaceChildren();
    parsed = [];
    $('dlgAdd').showModal();
  });
  $('btnPasteClip').addEventListener('click', async () => {
    try {
      $('pasteBox').value = await navigator.clipboard.readText();
    } catch (e) {
      alert('클립보드를 읽지 못했어요. 입력칸을 길게 눌러 직접 붙여넣어 주세요.');
    }
  });
  $('btnParse').addEventListener('click', () => {
    parsed = parse($('pasteBox').value);
    const pv = $('preview');
    pv.replaceChildren();
    if (!parsed.length) {
      pv.append(el('p', 'note', '카드를 찾지 못했어요. "표현:" 으로 시작하는 줄이 있는지 확인해 주세요.'));
      return;
    }
    const existing = new Set(cards.map((c) => norm(c.expr)));
    let fresh = 0;
    for (const c of parsed) {
      const dup = existing.has(norm(c.expr));
      c._dup = dup;
      if (!dup) { fresh++; existing.add(norm(c.expr)); }
      const row = el('div', 'pv-item');
      row.append(el('span', 'pv-e', c.expr));
      if (c.type) row.append(badge(c.type));
      if (dup) row.append(el('span', 'pv-dup', '이미 있음'));
      pv.append(row);
    }
    const saveBtn = el('button', 'btn primary mt', fresh ? `${fresh}개 저장` : '새로 저장할 카드가 없어요');
    saveBtn.type = 'button';
    saveBtn.disabled = !fresh;
    saveBtn.addEventListener('click', () => {
      const add = parsed.filter((c) => !c._dup).map((c) => { delete c._dup; return c; });
      if (cards.length + add.length > MAX_CARDS) { alert('카드가 너무 많아요. 백업 후 정리해 주세요.'); return; }
      cards = cards.concat(add);
      saveLocal();
      for (const c of add) queue({ op: 'upsert', card: c });
      $('dlgAdd').close();
      renderList();
    });
    pv.append(saveBtn);
  });

  // ---------- 복습 ----------
  function dueCards() { const t = today(); return cards.filter((c) => c.due <= t); }
  let rq = [];
  let qi = 0;
  $('btnReview').addEventListener('click', () => {
    rq = dueCards().sort(() => Math.random() - 0.5).slice(0, 10);
    qi = 0;
    $('dlgReview').showModal();
    showQuestion();
  });
  function showQuestion() {
    const box = $('revCard');
    const act = $('revActions');
    box.replaceChildren();
    act.replaceChildren();
    $('revBar').style.width = rq.length ? `${Math.round((qi / rq.length) * 100)}%` : '100%';
    if (qi >= rq.length) {
      $('revProgress').textContent = '';
      const done = el('div', 'rev-done pop');
      done.append(mascot(), el('p', '', rq.length ? `${rq.length}장 복습 끝! 잘했어요 👏` : '오늘은 복습할 카드가 없어요.\n내일 또 만나요!'));
      box.append(done);
      renderList();
      return;
    }
    const c = rq[qi];
    $('revProgress').textContent = `${qi + 1} / ${rq.length}`;
    const isFix = c.type === '직역투 교정';
    box.append(el('div', 'rev-hint', isFix ? '🔧 내가 쓴 어색한 문장, 자연스럽게 바꾸면?' : '💭 이 뜻을 영어로 말해 보세요'));
    box.append(el('div', 'rev-q', (isFix && c.mine) || c.natural || c.meaning || c.literal || c.expr));
    if (c.type) { const h = el('div'); h.append(badge(c.type)); box.append(h); }
    const show = el('button', 'btn primary', '정답 보기');
    show.type = 'button';
    show.addEventListener('click', () => showAnswer(c));
    act.append(show);
  }
  function showAnswer(c) {
    const box = $('revCard');
    const act = $('revActions');
    box.append(el('div', 'rev-a pop', c.expr));
    box.append(fieldsView(c, ['sentence', 'meaning', 'example', 'register']));
    act.replaceChildren();
    const no = el('button', 'btn bad', '몰랐어요');
    const yes = el('button', 'btn good', '알았어요!');
    no.type = yes.type = 'button';
    no.addEventListener('click', () => grade(c, false));
    yes.addEventListener('click', () => grade(c, true));
    act.append(no, yes);
  }
  function grade(c, ok) {
    const real = cards.find((x) => x.id === c.id);
    if (real) {
      real.level = ok ? Math.min(real.level + 1, INTERVALS.length - 1) : 0;
      real.due = today(ok ? INTERVALS[real.level] : 1);
      saveLocal();
      queue({ op: 'upsert', card: real });
    }
    qi++;
    showQuestion();
  }

  // ---------- 백업 ----------
  $('btnMore').addEventListener('click', () => {
    $('moreMsg').textContent = '';
    $('accountInfo').textContent = !CLOUD ? '클라우드 미설정 · 이 기기에만 저장 중' : session ? `로그인: ${session.email}` : '로그인 안 됨';
    $('btnLogout').hidden = !(CLOUD && session);
    $('dlgMore').showModal();
  });
  $('btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ app: 'en-notebook', version: 1, cards }, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `표현장-백업-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    $('moreMsg').textContent = '백업 파일을 저장했어요.';
  });
  $('fileImport').addEventListener('change', async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { $('moreMsg').textContent = '파일이 너무 커요 (5MB 초과).'; return; }
    try {
      const data = JSON.parse(await f.text());
      if (!data || data.app !== 'en-notebook' || !Array.isArray(data.cards)) throw new Error('format');
      const incoming = data.cards.map(sanitizeCard).filter(Boolean).slice(0, MAX_CARDS);
      const have = new Set(cards.map((c) => norm(c.expr)));
      const add = incoming.filter((c) => !have.has(norm(c.expr)));
      cards = cards.concat(add);
      saveLocal();
      for (const c of add) queue({ op: 'upsert', card: c });
      renderList();
      $('moreMsg').textContent = `${add.length}개를 불러왔어요 (중복 ${incoming.length - add.length}개 제외).`;
    } catch (err) {
      $('moreMsg').textContent = '표현장 백업 파일이 아니거나 손상됐어요.';
    }
  });

  // ---------- 공통 ----------
  document.querySelectorAll('[data-close]').forEach((b) =>
    b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach((d) =>
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));
  $('search').addEventListener('input', (e) => { query = e.target.value; renderList(); });
  window.addEventListener('online', scheduleSync);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') scheduleSync(); });

  $('headMascot').append(mascot());
  renderTabs();
  renderList();
  sync();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
