// 초대 코드 회원가입 (Supabase Edge Function)
// - 일반 가입(auth signup)은 꺼 두고, 초대 코드가 맞을 때만 이 함수가 계정을 만든다.
// - 초대 코드는 코드에 쓰지 않고 Supabase Secrets 의 INVITE_CODE 에 둔다.
// - 관리자 키(SUPABASE_SERVICE_ROLE_KEY)는 Supabase 서버 안에서만 쓰이고 앱으로 나가지 않는다.

const ALLOWED_ORIGINS = ['https://mmdyd19.github.io', 'http://localhost:8765'];

function cors(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), 'Content-Type': 'application/json' },
  });
}

// 길이가 같을 때 글자 비교 시간이 일정하도록 비교
function safeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  const n = Math.max(ea.length, eb.length);
  for (let i = 0; i < n; i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors(origin) });
  if (req.method !== 'POST') return json({ error: 'method' }, 405, origin);

  let body: { email?: unknown; password?: unknown; code?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400, origin);
  }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const code = typeof body.code === 'string' ? body.code.trim() : '';

  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/.test(email)) return json({ error: 'email' }, 400, origin);
  if (password.length < 6 || password.length > 72) return json({ error: 'password' }, 400, origin);

  const invite = Deno.env.get('INVITE_CODE') ?? '';
  // 대소문자는 구분하지 않는다 (폰 자동 대문자 등으로 틀리지 않게)
  if (!invite || !safeEqual(code.toLowerCase(), invite.toLowerCase())) {
    await sleep(800); // 코드 맞히기 시도를 느리게
    return json({ error: 'code' }, 403, origin);
  }

  const url = Deno.env.get('SUPABASE_URL')!;
  const admin = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { apikey: admin, Authorization: `Bearer ${admin}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (res.ok) return json({ ok: true }, 200, origin);

  const err = await res.json().catch(() => ({}));
  const msg = String(err.msg || err.message || err.error_code || '');
  if (res.status === 422 || /already|exists|registered/i.test(msg)) return json({ error: 'exists' }, 409, origin);
  if (/password/i.test(msg)) return json({ error: 'password' }, 400, origin);
  return json({ error: 'server' }, 500, origin);
});
