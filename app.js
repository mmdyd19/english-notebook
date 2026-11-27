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
    ['mine', '내 원래 문장'], ['example', '예문'], ['note', '비교·메모'],
  ];
  // 앱 필드 ↔ DB 컬럼
  const COLS = {
    expr: 'expr', type: 'ctype', source: 'source', sentence: 'sentence', literal: 'lit', natural: 'nat',
    meaning: 'meaning', register: 'formality', mine: 'mine', example: 'example', note: 'note',
    created: 'created', due: 'due', level: 'level', used: 'used', id: 'id',
  };
  const KEY_ALIASES = {
    '표현': 'expr', '유형': 'type', '출처': 'source', '원문 문장': 'sentence', '원문': 'sentence',
    '직역': 'literal', '의역': 'natural', '뜻·뉘앙스': 'meaning', '뜻': 'meaning', '뉘앙스': 'meaning',
    '뜻/뉘앙스': 'meaning', '격식도': 'register', '내 원래 문장': 'mine', '예문': 'example',
    '다른 예문': 'example', '추가 예문': 'example', '예문들': 'example',
    '비교·메모': 'note', '비교/메모': 'note', '비교': 'note', '차이': 'note', '차이점': 'note', '메모': 'note',
    '참고': 'note', '헷갈리는 표현': 'note', '비슷한 표현과 차이': 'note',
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
    // 휴지통: 지운 시각 (ISO). 비어 있으면 살아 있는 카드
    out.deleted = typeof c.deleted === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+(Z|[+-]\d{2}:?\d{2})?$/.test(c.deleted) ? c.deleted : '';
    return out;
  }
  const live = () => cards.filter((c) => !c.deleted);
  const trashed = () => cards.filter((c) => c.deleted);
  const TRASH_DAYS = 30;
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
    r.deleted_at = c.deleted || null;
    r.updated_at = new Date().toISOString();
    return r;
  }
  function fromRow(r) {
    const c = {};
    for (const [k, col] of Object.entries(COLS)) c[k] = r[col] == null ? '' : r[col];
    c.level = Number(r.level) || 0;
    c.used = r.used === true;
    c.deleted = r.deleted_at ? new Date(r.deleted_at).toISOString() : '';
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
  async function rest(method, query, body, extraHeaders, table) {
    const t = await token();
    if (!t) throw new Error('not logged in');
    const res = await fetch(`${API}/rest/v1/${table || 'cards'}${query}`, {
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
        // 보내는 사이에 같은 카드가 또 바뀌면 새 작업이 뒤에 붙어 있으므로, 보낸 그 작업만 정확히 뺀다
        pending = pending.filter((p) => p !== op);
        writeJSON(PENDING_KEY, pending);
      }
      const rows = await rest('GET', '?select=*&order=created.desc&limit=5000');
      if (Array.isArray(rows)) {
        // 서버에서 받는 사이에 새로 생긴 변경(아직 못 보낸 것)은 덮어쓰지 않고 살린다
        const fresh = rows.map(fromRow).filter(Boolean);
        const deleted = new Set(pending.filter((p) => p.op === 'delete').map((p) => p.id));
        const waiting = pending.filter((p) => p.op === 'upsert').map((p) => p.card);
        const waitIds = new Set(waiting.map((c) => c.id));
        cards = fresh.filter((c) => !deleted.has(c.id) && !waitIds.has(c.id)).concat(waiting);
        purgeOldTrash();
        if (pending.length) scheduleSync();
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
          await signupCall(email, pw, $('signupCode').value.trim());
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
    const keys = silent ? [SESSION_KEY] : [SESSION_KEY, PENDING_KEY, STORE_KEY, 'en-notebook-notes'];
    if (!silent) { pending = []; cards = []; myNotes = []; }
    for (const k of keys) try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    renderList();
    setStatus('login');
    if ($('dlgMore').open) $('dlgMore').close();
  }
  $('btnLogout').addEventListener('click', () => logout(false));

  // ---------- 붙여넣기 파싱 ----------
  // 느슨한 파서: 칸이 빠져도, 영어 라벨이어도, "단어 - 뜻" 목록이어도 카드로 만든다.
  const EXTRA_ALIASES = {
    '단어': 'expr', '표현/단어': 'expr', '영어': 'expr', '영어 표현': 'expr',
    '한국어 뜻': 'meaning', '한글 뜻': 'meaning', '의미': 'meaning', '번역': 'natural', '해석': 'natural',
    '문장': 'sentence', '원문 문장(원문)': 'sentence', '예시': 'example', '예문(영어)': 'example', '격식': 'register',
    'expression': 'expr', 'phrase': 'expr', 'word': 'expr', 'term': 'expr', 'type': 'type', 'category': 'type',
    'source': 'source', 'sentence': 'sentence', 'original': 'sentence', 'context': 'sentence',
    'literal': 'literal', 'literal translation': 'literal', 'natural': 'natural', 'translation': 'natural',
    'meaning': 'meaning', 'nuance': 'meaning', 'register': 'register', 'formality': 'register',
    'my sentence': 'mine', 'original sentence (mine)': 'mine', 'example': 'example', 'examples': 'example',
    'note': 'note', 'notes': 'note', 'comparison': 'note', 'difference': 'note', 'vs': 'note',
  };
  const keyOf = (label) => {
    const k = label.trim().replace(/\s+/g, ' ');
    return KEY_ALIASES[k] || EXTRA_ALIASES[k] || EXTRA_ALIASES[k.toLowerCase()] || null;
  };
  const TYPE_WORDS = [
    [/직역|교정|correction|my mistake/i, '직역투 교정'], [/구동사|phrasal/i, '구동사'],
    [/숙어|관용|idiom/i, '숙어'], [/슬랭|줄임|속어|slang|abbrev/i, '슬랭·줄임말'], [/단어|어휘|word|vocab/i, '단어'],
  ];
  function normType(t) {
    if (!t) return '';
    if (TYPES.includes(t.trim())) return t.trim();
    const hit = TYPE_WORDS.find(([re]) => re.test(t));
    return hit ? hit[1] : '';
  }
  const SKIP_LINE = /^\s*(```|오늘의 한 줄|today'?s (line|tip))/i;
  function cleanLine(line) {
    return line.replace(/^\s*(?:[-*•▪︎◦]|\d+[.)])\s+/, '').replace(/\*\*|__|`/g, '').replace(/^#+\s*/, '').trim();
  }
  // "fall through - 무산되다", "ngl: 솔직히", "mid = 별로" 같은 한 줄
  function looseLine(line) {
    const m = line.match(/^(.+?)\s*(?:\s[-–—=→]\s|\t|[:：]\s)\s*(.+)$/);
    if (m && m[1].length <= 80) return { expr: m[1].trim(), meaning: m[2].trim() };
    if (line.length <= 80) return { expr: line };
    return null;
  }

  function parse(text) {
    const src = String(text).replace(/\r/g, '');
    if (!clean(src)) return [];
    // "오늘의 한 줄" 아래는 버린다
    const body = src.split(/^\s*\**\s*오늘의 한 줄/m)[0];
    const blocks = body.split(/^\s*(?:-{3,}|={3,}|_{3,})\s*$/m);
    const found = [];
    for (const block of blocks) {
      const lines = block.split('\n').filter((l) => !SKIP_LINE.test(l)).map(cleanLine).filter(Boolean);
      if (!lines.length) continue;
      const card = {};
      let lastKey = null;
      let keyed = 0;
      const free = [];
      for (const line of lines) {
        const m = line.match(/^([^:：]{1,24})\s*[:：]\s*(.*)$/);
        const key = m ? keyOf(m[1]) : null;
        if (key) {
          keyed++;
          if (m[2].trim()) card[key] = (card[key] ? card[key] + '\n' : '') + m[2].trim();
          lastKey = key;
        } else if (lastKey) {
          card[lastKey] = (card[lastKey] ? card[lastKey] + '\n' : '') + line;
        } else {
          free.push(line);
        }
      }
      if (!keyed) {
        // 라벨이 하나도 없는 블록: 한 줄 = 카드 한 장
        for (const line of free) {
          const c = looseLine(line);
          const s = c && sanitizeCard(c);
          if (s) found.push(s);
        }
        continue;
      }
      // 라벨은 있는데 "표현:"이 없으면 첫 줄(또는 원문)에서 가져온다
      if (!card.expr) {
        const first = free[0] ? looseLine(free[0]) : null;
        if (first) { card.expr = first.expr; if (!card.meaning && first.meaning) card.meaning = first.meaning; }
        else if (card.mine && card.natural) card.expr = card.natural;
        else if (card.sentence) card.expr = card.sentence.split('\n')[0].slice(0, 80);
      }
      card.type = normType(card.type);
      const s = sanitizeCard(card);
      if (s) found.push(s);
    }
    return found;
  }

  // ---------- 목록 ----------
  function renderTabs() {
    const tabs = $('tabs');
    tabs.replaceChildren();
    for (const t of ['전체', ...TYPES]) {
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
    const alive = live();
    const shown = alive
      .filter((c) => filter === '전체' || c.type === filter)
      .filter((c) => !q || norm([c.expr, c.meaning, c.natural, c.sentence, c.example, c.mine].join(' ')).includes(q))
      .sort((a, b) => (a.created < b.created ? 1 : a.created > b.created ? -1 : 0));

    $('count').textContent = `${alive.length}개`;
    const due = dueCards().length;
    $('dueCount').textContent = due ? String(due) : '';
    const chip = $('todayChip');
    chip.className = 'today-chip' + (alive.length && !due ? ' clear' : '');
    chip.textContent = !alive.length ? '' : due ? `🔥 오늘 복습 ${due}장 남았어요` : '🎉 오늘 복습 끝!';

    if (!shown.length) {
      let msg = '아직 표현이 없어요.\n아래 ＋ 넣기로 첫 카드를 만들어 봐요!';
      if (alive.length) msg = '찾는 표현이 없어요.';
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
      if (c.note) meta.append(el('span', 'used', '📝 비교·메모'));
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
      const f = el('div', 'field' + (k === 'note' ? ' field-note' : ''));
      f.append(el('div', 'field-k', k === 'note' ? '📝 비교·메모' : label));
      const lines = c[k].split('\n').map((s) => s.trim()).filter(Boolean);
      if (k === 'example' && lines.length > 1) {
        const ul = el('ul', 'ex-list');
        for (const l of lines) ul.append(el('li', '', l.replace(/^[-•*]\s*|^\d+[.)]\s*/, '')));
        f.append(ul);
      } else {
        f.append(el('div', 'field-v', c[k]));
      }
      box.append(f);
    }
    return box;
  }
  function openCard(id) {
    const c = cards.find((x) => x.id === id);
    if (!c) return;
    openId = id;
    showCardView(c);
    $('dlgCard').showModal();
  }
  function showCardView(c) {
    $('cardTitle').textContent = c.expr;
    const body = el('div', 'fields');
    if (c.type) { const b = el('div'); b.append(badge(c.type)); body.append(b); }
    body.append(fieldsView(c, FIELDS.map(([k]) => k).filter((k) => k !== 'type')));
    $('cardBody').replaceChildren(body);
    $('cardActions').hidden = false;
    $('editActions').hidden = true;
  }
  function touch(c) {
    saveLocal();
    queue({ op: 'upsert', card: c });
    renderList();
  }
  // ----- 수정 -----
  const EDIT_FIELDS = [['expr', '표현', 'input'], ...FIELDS.map(([k, l]) => [k, l, k === 'type' ? 'select' : (['sentence', 'meaning', 'example', 'mine', 'note'].includes(k) ? 'textarea' : 'input')])];
  const EDIT_HINT = { example: '여러 개면 한 줄에 하나씩', note: '예) why는 이유·목적을 물을 때, what은 상대의 이상한 행동에 "뭐야?" 할 때' };
  $('btnEdit').addEventListener('click', () => {
    const c = cards.find((x) => x.id === openId);
    if (!c) return;
    $('cardTitle').textContent = '✏️ 카드 수정';
    const form = el('div', 'edit-form');
    for (const [k, label, kind] of EDIT_FIELDS) {
      const wrap = el('label', 'edit-field');
      wrap.append(el('span', 'field-k', label));
      let input;
      if (kind === 'select') {
        input = el('select', 'search');
        for (const t of ['', ...TYPES]) {
          const o = el('option', '', t || '(선택 안 함)');
          o.value = t;
          input.append(o);
        }
      } else {
        input = el(kind, 'search');
        if (kind === 'textarea') input.rows = k === 'note' || k === 'example' ? 3 : 2;
        if (EDIT_HINT[k]) input.placeholder = EDIT_HINT[k];
      }
      input.id = `edit_${k}`;
      input.value = c[k] || '';
      if (k === 'expr') input.required = true;
      wrap.append(input);
      form.append(wrap);
    }
    $('cardBody').replaceChildren(form);
    $('cardActions').hidden = true;
    $('editActions').hidden = false;
    $('edit_expr').focus();
  });
  $('btnEditCancel').addEventListener('click', () => {
    const c = cards.find((x) => x.id === openId);
    if (c) showCardView(c);
  });
  $('btnEditSave').addEventListener('click', () => {
    const c = cards.find((x) => x.id === openId);
    if (!c) return;
    const expr = clean($('edit_expr').value);
    if (!expr) { alert('표현은 비워 둘 수 없어요.'); return; }
    const clash = live().find((x) => x.id !== c.id && norm(x.expr) === norm(expr));
    if (clash && !confirm(`"${clash.expr}" 카드가 이미 있어요. 그래도 저장할까요?`)) return;
    c.expr = expr;
    for (const [k] of FIELDS) c[k] = clean($(`edit_${k}`).value);
    touch(c);
    showCardView(c);
  });

  // ----- 휴지통 -----
  $('btnDelete').addEventListener('click', () => {
    const c = cards.find((x) => x.id === openId);
    if (!c) return;
    c.deleted = new Date().toISOString();
    touch(c);
    $('dlgCard').close();
    toast(`🗑️ "${c.expr}"을(를) 휴지통에 넣었어요`, '되돌리기', () => { c.deleted = ''; touch(c); });
  });

  function purgeOldTrash() {
    const limit = Date.now() - TRASH_DAYS * 86400000;
    const old = trashed().filter((c) => Date.parse(c.deleted) < limit);
    if (!old.length) return;
    const ids = new Set(old.map((c) => c.id));
    cards = cards.filter((c) => !ids.has(c.id));
    saveLocal();
    for (const id of ids) queue({ op: 'delete', id });
  }
  function renderTrash() {
    const list = $('trashList');
    list.replaceChildren();
    const items = trashed().sort((a, b) => (a.deleted < b.deleted ? 1 : -1));
    $('btnEmptyTrash').hidden = !items.length;
    if (!items.length) {
      const box = el('div', 'empty');
      box.append(mascot(), el('p', '', '휴지통이 비어 있어요.'));
      list.append(box);
      return;
    }
    for (const c of items) {
      const row = el('div', 'trash-item');
      const info = el('div', 'trash-info');
      const left = Math.max(0, TRASH_DAYS - Math.floor((Date.now() - Date.parse(c.deleted)) / 86400000));
      info.append(el('b', '', c.expr), el('span', 'meta-line', `${(c.meaning || c.natural || '').split('\n')[0]} · ${left}일 뒤 자동 삭제`));
      const restore = el('button', 'mini good', '복구');
      restore.type = 'button';
      restore.addEventListener('click', () => { c.deleted = ''; touch(c); renderTrash(); renderTrashCount(); });
      const kill = el('button', 'mini bad', '영구 삭제');
      kill.type = 'button';
      kill.addEventListener('click', () => {
        if (!confirm(`"${c.expr}"을(를) 영구 삭제할까요? 되돌릴 수 없어요.`)) return;
        cards = cards.filter((x) => x.id !== c.id);
        saveLocal();
        queue({ op: 'delete', id: c.id });
        renderTrash(); renderTrashCount();
      });
      row.append(info, restore, kill);
      list.append(row);
    }
  }
  function renderTrashCount() {
    const n = trashed().length;
    $('btnTrash').textContent = n ? `🗑️ 휴지통 (${n})` : '🗑️ 휴지통';
  }
  $('btnTrash').addEventListener('click', () => {
    $('dlgMore').close();
    renderTrash();
    $('dlgTrash').showModal();
  });
  $('btnEmptyTrash').addEventListener('click', () => {
    const items = trashed();
    if (!items.length || !confirm(`휴지통의 ${items.length}개를 모두 영구 삭제할까요? 되돌릴 수 없어요.`)) return;
    const ids = new Set(items.map((c) => c.id));
    cards = cards.filter((c) => !ids.has(c.id));
    saveLocal();
    for (const id of ids) queue({ op: 'delete', id });
    renderTrash(); renderTrashCount();
  });

  // 아래에 잠깐 뜨는 알림 (되돌리기 버튼 포함)
  let toastTimer = null;
  function toast(msg, actionLabel, action) {
    const t = $('toast');
    t.replaceChildren(el('span', '', msg));
    if (actionLabel) {
      const b = el('button', 'toast-btn', actionLabel);
      b.type = 'button';
      b.addEventListener('click', () => { action(); t.hidden = true; });
      t.append(b);
    }
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 5000);
  }

  // ---------- 붙여넣기 ----------
  let parsed = [];
  $('btnAdd').addEventListener('click', () => {
    $('pasteBox').value = '';
    $('preview').replaceChildren();
    parsed = [];
    $('dlgAdd').showModal();
  });
  // 붙여넣은 글 → 바로 저장. 이미 있는 표현은 빈 칸만 새 내용으로 채운다.
  function saveFromText(text) {
    const pv = $('preview');
    pv.replaceChildren();
    parsed = parse(text);
    if (!parsed.length) {
      pv.append(el('p', 'note', '카드로 만들 표현을 찾지 못했어요. 긴 글이나 메모는 📥 메모로 보관해 두면 Claude 선생님이 정리해 줘요.'));
      return;
    }
    // 살아 있는 카드를 먼저, 휴지통 카드는 그다음으로 찾는다 (휴지통에 있으면 꺼내서 채움)
    const byExpr = new Map(trashed().concat(live()).map((c) => [norm(c.expr), c]));
    const added = [];
    const filled = [];
    let restored = 0;
    for (const c of parsed) {
      const old = byExpr.get(norm(c.expr));
      if (!old) {
        if (cards.length + added.length >= MAX_CARDS) break;
        added.push(c);
        byExpr.set(norm(c.expr), c);
        continue;
      }
      let changed = false;
      if (old.deleted) { old.deleted = ''; changed = true; restored++; }
      for (const [k] of FIELDS) {
        if (!c[k]) continue;
        if (!old[k]) { old[k] = c[k]; changed = true; continue; }
        // 예문·비교 메모는 새 줄만 덧붙인다
        if (k === 'example' || k === 'note') {
          const have = new Set(old[k].split('\n').map((s) => norm(s)));
          const extra = c[k].split('\n').filter((s) => s.trim() && !have.has(norm(s)));
          if (extra.length) { old[k] = clean(old[k] + '\n' + extra.join('\n')); changed = true; }
        }
      }
      if (changed) { filled.push(old); queue({ op: 'upsert', card: old }); }
    }
    cards = cards.concat(added);
    saveLocal();
    for (const c of added) queue({ op: 'upsert', card: c });
    renderList();

    const head = [`✅ ${added.length}개 저장`];
    if (filled.length) head.push(`${filled.length}개는 이미 있어서 내용만 보탰어요`);
    if (restored) head.push(`그중 ${restored}개는 휴지통에서 꺼냈어요`);
    const skipped = parsed.length - added.length - filled.length;
    if (skipped > 0) head.push(`${skipped}개는 이미 있어요`);
    pv.append(el('p', 'note ok', head.join(' · ')));
    for (const c of added.concat(filled)) {
      const row = el('div', 'pv-item');
      row.append(el('span', 'pv-e', c.expr));
      if (c.type) row.append(badge(c.type));
      const missing = ['meaning', 'natural'].every((k) => !c[k]) ? '뜻 없음' : '';
      if (missing) row.append(el('span', 'pv-dup', missing));
      pv.append(row);
    }
    $('pasteBox').value = '';
  }

  $('btnParse').addEventListener('click', () => saveFromText($('pasteBox').value));

  // ---------- 복습 ----------
  function dueCards() { const t = today(); return live().filter((c) => c.due <= t); }
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

  // ---------- 받은함 · 일기 · 작문 (entries 표) ----------
  // 검사 결과(feedback)는 PC의 Claude 선생님만 쓸 수 있다. 앱은 쓰기·읽기·삭제만.
  const KIND_INFO = {
    diary: { label: '영어 일기', ph: '오늘 있었던 일을 영어로 써 보세요.\n막히는 부분은 한국어로 써도 괜찮아요!', target: '오늘 써 볼 표현 (써 보면 좋아요)', n: 3 },
    writing: { label: '작문 연습', ph: '위 표현들을 넣어서 문장을 만들어 보세요.\n한 표현에 한 문장씩!', target: '이 표현들로 문장 만들기', n: 4 },
    inbox: { label: '받은함', ph: '', target: '', n: 0 },
  };
  const STAMPS = { '참 잘했어요': '💮', '잘했어요': '🌸', '조금만 더': '🌱' };
  let diaryKind = 'diary';
  let entries = [];
  let targets = [];

  function needLogin() {
    if (CLOUD && session) return false;
    alert('먼저 로그인해 주세요. 일기와 받은함은 서버에 저장돼요.');
    return true;
  }
  async function addEntry(kind, body, targetExprs) {
    const row = {
      id: crypto.randomUUID(), kind, body: clean(body).slice(0, 8000) || '',
      target_exprs: targetExprs ? clean(targetExprs).slice(0, 1000) : null,
    };
    if (!row.body) throw new Error('empty');
    await rest('POST', '', [row], { Prefer: 'return=minimal' }, 'entries');
  }

  $('btnInbox').addEventListener('click', async () => {
    const text = $('pasteBox').value;
    if (!clean(text)) { alert('넣을 내용을 적어 주세요.'); return; }
    if (needLogin()) return;
    $('btnInbox').disabled = true;
    try {
      await addEntry('inbox', text);
      $('preview').replaceChildren(el('p', 'note ok', '📥 받은함에 넣었어요! PC에서 Claude에게 "검사해줘"라고 하면 카드로 만들어 줘요.'));
      $('pasteBox').value = '';
    } catch (e) {
      $('preview').replaceChildren(el('p', 'note', '저장하지 못했어요. 인터넷 연결을 확인해 주세요.'));
    } finally {
      $('btnInbox').disabled = false;
    }
  });

  function pickTargets() {
    const n = KIND_INFO[diaryKind].n;
    const alive = live();
    const src = alive.slice().sort(() => Math.random() - 0.5);
    targets = src.slice(0, n).map((c) => c.expr);
    const box = $('targetChips');
    box.replaceChildren();
    if (!targets.length) { box.append(el('span', 'note', '카드가 생기면 여기에 써 볼 표현이 나와요.')); return; }
    for (const t of targets) {
      const c = cards.find((x) => x.expr === t);
      const chip = el('span', 'target-chip', t);
      if (c && c.type) chip.dataset.t = c.type;
      box.append(chip);
    }
  }
  $('btnShuffle').addEventListener('click', pickTargets);

  function setDiaryKind(kind) {
    diaryKind = kind;
    document.querySelectorAll('#dlgDiary .seg-btn').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.kind === kind)));
    const info = KIND_INFO[kind];
    $('composer').hidden = kind === 'inbox';
    $('targetLabel').textContent = info.target;
    $('entryBody').placeholder = info.ph;
    $('entryMsg').textContent = '';
    if (kind !== 'inbox') pickTargets();
    loadEntries();
  }
  document.querySelectorAll('#dlgDiary .seg-btn').forEach((b) => b.addEventListener('click', () => setDiaryKind(b.dataset.kind)));

  $('btnDiary').addEventListener('click', () => {
    if (needLogin()) return;
    $('dlgDiary').showModal();
    setDiaryKind(diaryKind);
  });

  async function loadEntries() {
    const list = $('entryList');
    list.replaceChildren(el('p', 'note', '불러오는 중…'));
    try {
      const rows = await rest('GET', `?select=*&kind=eq.${diaryKind}&order=created_at.desc&limit=100`, null, null, 'entries');
      entries = Array.isArray(rows) ? rows : [];
      renderEntries();
    } catch (e) {
      list.replaceChildren(el('p', 'note', '불러오지 못했어요. 인터넷 연결을 확인해 주세요.'));
    }
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return `${d.getMonth() + 1}월 ${d.getDate()}일`;
  }
  function renderEntries() {
    const list = $('entryList');
    list.replaceChildren();
    if (!entries.length) {
      const box = el('div', 'empty');
      box.append(mascot(), el('p', '', diaryKind === 'inbox' ? '받은함이 비어 있어요.\n＋ 넣기에서 아무거나 넣어 보세요.' : '아직 쓴 글이 없어요.\n위에서 첫 글을 써 볼까요?'));
      list.append(box);
      return;
    }
    for (const en of entries) {
      const item = el('button', 'entry-item');
      item.type = 'button';
      const top = el('div', 'entry-top');
      top.append(el('span', 'entry-date', fmtDate(en.created_at)));
      const checked = en.status === 'checked';
      const stamp = checked && en.feedback && typeof en.feedback.stamp === 'string' ? en.feedback.stamp : '';
      top.append(el('span', 'entry-status' + (checked ? ' done' : ''),
        checked ? `${STAMPS[stamp] || '💮'} ${diaryKind === 'inbox' ? '카드로 정리 완료' : '검사 완료'}` : (diaryKind === 'inbox' ? '⏳ 정리 기다리는 중' : '⏳ 검사 기다리는 중')));
      item.append(top, el('div', 'entry-body', String(en.body).split('\n').slice(0, 2).join(' ')));
      item.addEventListener('click', () => openEntry(en));
      list.append(item);
    }
  }

  $('btnSaveEntry').addEventListener('click', async () => {
    const body = $('entryBody').value;
    if (clean(body).length < 3) { $('entryMsg').textContent = '조금만 더 써 볼까요?'; return; }
    $('btnSaveEntry').disabled = true;
    try {
      await addEntry(diaryKind, body, targets.join(' | '));
      $('entryBody').value = '';
      $('entryMsg').textContent = '✏️ 검사 맡겼어요! PC에서 Claude에게 "일기 검사해줘"라고 하면 빨간펜으로 봐 줘요.';
      pickTargets();
      loadEntries();
    } catch (e) {
      $('entryMsg').textContent = '저장하지 못했어요. 인터넷 연결을 확인해 주세요.';
    } finally {
      $('btnSaveEntry').disabled = false;
    }
  });

  let openEntryId = null;
  function section(title, ...children) {
    const s = el('div', 'fb-section');
    s.append(el('div', 'fb-title', title), ...children);
    return s;
  }
  const str = (v) => (typeof v === 'string' ? v.slice(0, 8000) : '');
  const arr = (v) => (Array.isArray(v) ? v.slice(0, 50) : []);

  function openEntry(en) {
    openEntryId = en.id;
    $('entryTitle').textContent = `${fmtDate(en.created_at)} ${KIND_INFO[en.kind] ? KIND_INFO[en.kind].label : ''}`;
    const view = $('entryView');
    view.replaceChildren();
    const fb = en.status === 'checked' && en.feedback && typeof en.feedback === 'object' ? en.feedback : null;

    if (fb && str(fb.stamp)) {
      const st = el('div', 'stamp pop');
      st.append(el('span', 'stamp-ico', STAMPS[fb.stamp] || '💮'), el('span', 'stamp-text', str(fb.stamp)));
      view.append(st);
    }
    if (en.target_exprs) view.append(section('써 보기로 한 표현', el('p', 'fb-text', en.target_exprs.split(' | ').join(', '))));
    view.append(section('내가 쓴 글', el('p', 'fb-text mine', en.body)));

    if (!fb) {
      view.append(el('p', 'note wait', en.kind === 'inbox'
        ? '⏳ 아직 정리 전이에요. PC에서 Claude에게 "검사해줘"라고 해 주세요.'
        : '⏳ 아직 검사 전이에요. PC에서 Claude에게 "일기 검사해줘"라고 해 주세요.'));
    } else {
      if (str(fb.corrected)) view.append(section('✏️ 고친 글', el('p', 'fb-text corrected', str(fb.corrected))));
      const notes = arr(fb.notes).filter((n) => n && typeof n === 'object');
      if (notes.length) {
        const ul = el('div', 'redpen');
        for (const n of notes) {
          const row = el('div', 'redpen-item');
          const line = el('div', 'redpen-line');
          if (str(n.from)) line.append(el('s', 'from', str(n.from)));
          if (str(n.from) && str(n.to)) line.append(el('span', 'arrow', '→'));
          if (str(n.to)) line.append(el('b', 'to', str(n.to)));
          row.append(line);
          if (str(n.why)) row.append(el('div', 'why', str(n.why)));
          ul.append(row);
        }
        view.append(section('🖍️ 빨간펜', ul));
      }
      const tips = arr(fb.tips).map(str).filter(Boolean);
      if (tips.length) {
        const ul = el('ul', 'tips');
        for (const t of tips) ul.append(el('li', '', t));
        view.append(section('💡 이렇게도 말해요', ul));
      }
      const used = arr(fb.used).map(str).filter(Boolean);
      if (used.length) view.append(section('✅ 잘 쓴 표현', el('p', 'fb-text', used.join(', '))));
      const made = arr(fb.cards).map(str).filter(Boolean);
      if (made.length) view.append(section('🗂️ 새로 만든 카드', el('p', 'fb-text', made.join(', '))));
      if (str(fb.praise)) {
        const bubble = el('div', 'teacher');
        bubble.append(mascot(), el('p', 'teacher-say', str(fb.praise)));
        view.append(bubble);
      }
    }
    $('dlgEntry').showModal();
  }
  $('btnDeleteEntry').addEventListener('click', async () => {
    if (!openEntryId || !UUID_RE.test(openEntryId) || !confirm('이 글을 삭제할까요?')) return;
    try {
      await rest('DELETE', `?id=eq.${openEntryId}`, null, null, 'entries');
      $('dlgEntry').close();
      loadEntries();
    } catch (e) {
      alert('삭제하지 못했어요. 인터넷 연결을 확인해 주세요.');
    }
  });

  // ---------- 기초 노트 ----------
  // 기본 노트(grammar-base.js)는 로그인 없이 누구나 본다. 내 노트는 grammar_notes 표(본인만).
  const NOTES_KEY = 'en-notebook-notes';
  const BASE_NOTES = (Array.isArray(window.GRAMMAR_BASE) ? window.GRAMMAR_BASE : [])
    .map((n, i) => ({ id: `base-${i}`, base: true, category: String(n.cat || '기타'), title: String(n.title || ''), body: String(n.body || ''), examples: String(n.ex || '') }));
  let myNotes = (readJSON(NOTES_KEY, []) || []).filter((n) => n && UUID_RE.test(n.id));
  let gCat = '전체';
  let gQuery = '';
  let editingNoteId = null;

  function allNotes() {
    return myNotes.map((n) => Object.assign({ base: false }, n)).concat(BASE_NOTES);
  }
  function noteCats() {
    const cats = [];
    for (const n of BASE_NOTES.concat(myNotes)) if (!cats.includes(n.category)) cats.push(n.category);
    return cats;
  }
  function renderGrammarCats() {
    const nav = $('gCats');
    nav.replaceChildren();
    const opts = ['전체', ...(myNotes.length ? ['⭐ 내 노트'] : []), ...noteCats()];
    if (!opts.includes(gCat)) gCat = '전체';
    for (const c of opts) {
      const b = el('button', 'tab', c);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(c === gCat));
      b.addEventListener('click', () => { gCat = c; renderGrammarCats(); renderGrammar(); });
      nav.append(b);
    }
    const dl = $('nCatList');
    dl.replaceChildren();
    for (const c of noteCats()) { const o = el('option'); o.value = c; dl.append(o); }
  }
  function renderGrammar() {
    const list = $('gList');
    list.replaceChildren();
    const q = norm(gQuery);
    const items = allNotes()
      .filter((n) => gCat === '전체' || (gCat === '⭐ 내 노트' ? !n.base : n.category === gCat))
      .filter((n) => !q || norm([n.category, n.title, n.body, n.examples].join(' ')).includes(q));
    if (!items.length) {
      const box = el('div', 'empty');
      box.append(mascot(), el('p', '', q ? '찾는 노트가 없어요.' : '아직 노트가 없어요.'));
      list.append(box);
      return;
    }
    let lastCat = null;
    for (const n of items) {
      if (gCat === '전체' && n.category !== lastCat) {
        list.append(el('h3', 'g-cat', n.category));
        lastCat = n.category;
      }
      const card = el('article', 'g-note' + (n.base ? '' : ' mine'));
      const head = el('div', 'g-head');
      head.append(el('h4', 'g-title', n.title));
      head.append(el('span', 'g-tag', n.base ? '기본' : '⭐ 내 노트'));
      card.append(head);
      if (n.body) card.append(el('p', 'g-body', n.body));
      const exs = String(n.examples || '').split('\n').map((s) => s.trim()).filter(Boolean);
      if (exs.length) {
        const ul = el('ul', 'g-ex');
        for (const e of exs) ul.append(el('li', '', e));
        card.append(ul);
      }
      if (!n.base) {
        const edit = el('button', 'mini', '✏️ 수정');
        edit.type = 'button';
        edit.addEventListener('click', () => openNoteEditor(n));
        card.append(edit);
      }
      list.append(card);
    }
  }
  async function loadMyNotes() {
    if (!CLOUD || !session) return;
    try {
      const rows = await rest('GET', '?select=id,category,title,body,examples,updated_at&order=updated_at.desc&limit=500', null, null, 'grammar_notes');
      if (Array.isArray(rows)) {
        myNotes = rows.map((r) => ({ id: r.id, category: clean(r.category) || '기타', title: clean(r.title), body: clean(r.body || ''), examples: clean(r.examples || '') }));
        writeJSON(NOTES_KEY, myNotes);
        renderGrammarCats();
        renderGrammar();
      }
    } catch (e) { /* 오프라인이면 저장된 사본으로 보여 준다 */ }
  }
  $('btnGrammar').addEventListener('click', () => {
    gQuery = '';
    $('gSearch').value = '';
    renderGrammarCats();
    renderGrammar();
    $('dlgGrammar').showModal();
    loadMyNotes();
  });
  $('gSearch').addEventListener('input', (e) => { gQuery = e.target.value; renderGrammar(); });

  function openNoteEditor(n) {
    editingNoteId = n ? n.id : null;
    $('noteTitle').textContent = n ? '✏️ 내 노트 수정' : '＋ 내 노트 추가';
    $('nCat').value = n ? n.category : (gCat !== '전체' && gCat !== '⭐ 내 노트' ? gCat : '');
    $('nTitle').value = n ? n.title : '';
    $('nBody').value = n ? n.body : '';
    $('nEx').value = n ? n.examples : '';
    $('btnNoteDelete').hidden = !n;
    $('noteMsg').textContent = '';
    $('dlgNote').showModal();
  }
  $('btnAddNote').addEventListener('click', () => {
    if (!(CLOUD && session)) {
      alert('내 노트는 로그인하면 추가할 수 있어요. 기본 노트는 로그인 없이 볼 수 있어요.');
      return;
    }
    openNoteEditor(null);
  });
  $('btnNoteSave').addEventListener('click', async () => {
    const row = {
      id: editingNoteId || crypto.randomUUID(),
      category: clean($('nCat').value).slice(0, 40) || '내 메모',
      title: clean($('nTitle').value).slice(0, 200),
      body: clean($('nBody').value).slice(0, 4000) || null,
      examples: clean($('nEx').value) || null,
      updated_at: new Date().toISOString(),
    };
    if (!row.title) { $('noteMsg').textContent = '제목을 적어 주세요.'; return; }
    $('btnNoteSave').disabled = true;
    try {
      await rest('POST', '?on_conflict=id', [row], { Prefer: 'resolution=merge-duplicates,return=minimal' }, 'grammar_notes');
      myNotes = [{ id: row.id, category: row.category, title: row.title, body: row.body || '', examples: row.examples || '' }]
        .concat(myNotes.filter((n) => n.id !== row.id));
      writeJSON(NOTES_KEY, myNotes);
      $('dlgNote').close();
      renderGrammarCats();
      renderGrammar();
    } catch (e) {
      $('noteMsg').textContent = '저장하지 못했어요. 인터넷 연결을 확인해 주세요.';
    } finally {
      $('btnNoteSave').disabled = false;
    }
  });
  $('btnNoteDelete').addEventListener('click', async () => {
    if (!editingNoteId || !UUID_RE.test(editingNoteId) || !confirm('이 노트를 삭제할까요?')) return;
    try {
      await rest('DELETE', `?id=eq.${editingNoteId}`, null, null, 'grammar_notes');
      myNotes = myNotes.filter((n) => n.id !== editingNoteId);
      writeJSON(NOTES_KEY, myNotes);
      $('dlgNote').close();
      renderGrammarCats();
      renderGrammar();
    } catch (e) {
      $('noteMsg').textContent = '삭제하지 못했어요. 인터넷 연결을 확인해 주세요.';
    }
  });

  // ---------- 백업 ----------
  $('btnMore').addEventListener('click', () => {
    $('moreMsg').textContent = '';
    $('accountInfo').textContent = !CLOUD ? '클라우드 미설정 · 이 기기에만 저장 중' : session ? `로그인: ${session.email}` : '로그인 안 됨';
    $('btnLogout').hidden = !(CLOUD && session);
    renderTrashCount();
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
      const add = incoming.filter((c) => !have.has(norm(c.expr))).map((c) => Object.assign(c, { deleted: '' }));
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
  // 팝업 바깥(어두운 배경)을 눌렀을 때만 닫는다. 팝업 안의 빈 여백을 눌러도 닫히지 않게.
  document.querySelectorAll('dialog').forEach((d) =>
    d.addEventListener('click', (e) => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) d.close();
    }));
  $('search').addEventListener('input', (e) => { query = e.target.value; renderList(); });
  window.addEventListener('online', scheduleSync);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') scheduleSync(); });

  $('headMascot').append(mascot());
  purgeOldTrash();
  renderTabs();
  renderList();
  sync();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
