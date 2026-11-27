'use strict';
// 기본 영어 노트 (앱에 기본으로 들어 있는 내용). 개인 노트는 서버(grammar_notes 표)에 따로 저장된다.
// 형식: { cat, title, body, ex } — ex 는 줄바꿈으로 구분한 예문
window.GRAMMAR_BASE = [
  // ---------- 인칭·대명사 ----------
  { cat: '인칭·대명사', title: '1인칭 · 2인칭 · 3인칭',
    body: '1인칭: 말하는 나/우리 → I, we\n2인칭: 듣는 너/너희 → you\n3인칭: 나와 너를 뺀 나머지 모두 → he, she, it, they, Tom, my mom, the dog …',
    ex: 'I like coffee. (1인칭)\nYou look tired. (2인칭)\nShe works at a bank. (3인칭)' },
  { cat: '인칭·대명사', title: '주격 · 목적격 · 소유격 표',
    body: '주격(~은/는) / 목적격(~을/를) / 소유격(~의) / 소유대명사(~의 것)\nI – me – my – mine\nyou – you – your – yours\nhe – him – his – his\nshe – her – her – hers\nit – it – its – (없음)\nwe – us – our – ours\nthey – them – their – theirs',
    ex: 'She likes him. (주어는 she, 목적어는 him)\nThis is my bag. It\'s mine.' },
  { cat: '인칭·대명사', title: '3인칭 단수 현재 → 동사에 -s',
    body: '주어가 he / she / it / 사람 한 명·물건 하나이고 현재 시제면 동사 끝에 -s(-es)를 붙인다.\nhave → has, do → does, go → goes, study → studies',
    ex: 'He plays the guitar.\nMy sister has a cat.\nIt doesn\'t work. (부정문에선 does가 -s를 가져가고 동사는 원형)' },

  // ---------- be동사·일반동사 ----------
  { cat: 'be동사·일반동사', title: 'be동사: am / are / is',
    body: '"~이다, ~에 있다". I → am, you·we·they → are, he·she·it → is\n과거: I·he·she·it → was, you·we·they → were',
    ex: 'I am hungry.\nThey were at home yesterday.' },
  { cat: 'be동사·일반동사', title: 'be동사 문장과 일반동사 문장은 부정·의문 만드는 법이 다르다',
    body: 'be동사: be 뒤에 not, 의문문은 be를 앞으로\n일반동사: do/does/did + not + 동사원형, 의문문은 Do/Does/Did를 앞에',
    ex: 'She is not busy. / Is she busy?\nShe does not like fish. / Does she like fish?' },

  // ---------- 시제 ----------
  { cat: '시제', title: '현재진행형 = be + 동사ing',
    body: '"지금 ~하는 중이다". be동사(am/are/is) + 동사ing\n가까운 미래 약속에도 쓴다.',
    ex: 'I\'m eating lunch now.\nWe\'re meeting Jane tomorrow. (정해진 약속)' },
  { cat: '시제', title: '과거진행형 = was/were + 동사ing',
    body: '"(그때) ~하는 중이었다". 다른 일이 끼어들 때 자주 쓴다.',
    ex: 'I was sleeping when you called.' },
  { cat: '시제', title: '현재완료 = have/has + 과거분사(p.p.)',
    body: '과거의 일이 지금까지 이어지거나 지금과 관련 있을 때. 경험(~해 본 적 있다), 완료(막 ~했다), 계속(~해 왔다)\n구체적인 과거 시점(yesterday, last year)과는 같이 안 쓴다.',
    ex: 'I have been to Japan. (가 본 적 있다)\nShe has just finished. (막 끝냈다)\nI\'ve lived here for 3 years. (3년째 살고 있다)' },
  { cat: '시제', title: '미래: will vs be going to',
    body: 'will: 말하는 순간 정한 일, 예측, 약속\nbe going to (gonna): 이미 계획해 둔 일, 눈앞의 근거가 있는 예측',
    ex: 'I\'ll get it! (전화 왔을 때 즉석에서)\nI\'m going to visit my parents this weekend. (계획)' },
  { cat: '시제', title: '자주 쓰는 불규칙 과거형',
    body: 'go – went – gone / come – came – come / eat – ate – eaten / see – saw – seen\nget – got – got(ten) / take – took – taken / make – made – made / buy – bought – bought\nthink – thought – thought / say – said – said / tell – told – told / have – had – had',
    ex: 'I went to the gym.\nI\'ve already eaten.' },

  // ---------- 부정·의문 ----------
  { cat: '부정·의문', title: 'didn\'t / doesn\'t / don\'t 뒤에는 동사원형',
    body: '시제와 -s는 do/does/did가 가져가므로, 뒤의 동사는 항상 원형.\n× I didn\'t went → ○ I didn\'t go\n× She doesn\'t likes → ○ She doesn\'t like',
    ex: 'I didn\'t see him yesterday.\nHe doesn\'t eat meat.' },
  { cat: '부정·의문', title: 'Do / Does / Did 의문문 뒤에도 동사원형',
    body: 'Do/Does/Did + 주어 + 동사원형 ~?',
    ex: 'Did you sleep well?\nDoes she know about it?' },
  { cat: '부정·의문', title: '의문사 6개',
    body: 'who 누가 / what 무엇 / when 언제 / where 어디서 / why 왜 / how 어떻게\n의문사 + 의문문 순서: Where do you live?',
    ex: 'What did you eat?\nHow was your weekend?' },
  { cat: '부정·의문', title: '부가의문문 (~지?, 그렇지?)',
    body: '앞이 긍정이면 뒤는 부정, 앞이 부정이면 뒤는 긍정. 동사 종류를 맞춘다.',
    ex: 'You\'re tired, aren\'t you?\nShe didn\'t call, did she?' },

  // ---------- 조동사 ----------
  { cat: '조동사', title: '조동사 + 동사원형',
    body: 'can, could, will, would, should, must, may, might 뒤에는 항상 동사원형. 3인칭이어도 -s 안 붙는다.\n× She cans swim / × She can swims → ○ She can swim',
    ex: 'You should try it.\nIt might rain.' },
  { cat: '조동사', title: 'must vs have to',
    body: '둘 다 "~해야 한다". must는 말하는 사람이 느끼는 의무, have to는 규칙·상황 때문에.\n부정은 뜻이 완전히 다르다: must not = ~하면 안 된다 / don\'t have to = ~할 필요 없다',
    ex: 'You must not smoke here. (금지)\nYou don\'t have to come. (안 와도 돼)' },

  // ---------- 같은 뜻 다른 표현 ----------
  { cat: '같은 뜻 다른 표현', title: 'have = have got (가지고 있다)',
    body: '"가지고 있다"의 뜻일 때 같은 표현. have got은 영국식·구어에서 자주 쓴다.\n의문·부정 만드는 법이 다르다: Do you have~? / Have you got~?\n과거는 둘 다 had.',
    ex: 'I have a car. = I\'ve got a car.\nDo you have time? = Have you got time?' },
  { cat: '같은 뜻 다른 표현', title: '구어체 줄임말: gonna, wanna, gotta',
    body: 'going to → gonna / want to → wanna / have got to → gotta (~해야 해)\n말이나 채팅에서만. 격식 있는 글에서는 쓰지 않는다.',
    ex: 'I\'m gonna be late.\nI gotta go.' },
  { cat: '같은 뜻 다른 표현', title: '축약형',
    body: 'I am → I\'m / you are → you\'re / he is → he\'s / it is → it\'s\nI have → I\'ve / I will → I\'ll / I would → I\'d / do not → don\'t / cannot → can\'t / will not → won\'t',
    ex: 'It\'s cold. (it is)\nIts color is red. (its = 그것의, 축약 아님)' },

  // ---------- 문장 기본 ----------
  { cat: '문장 기본', title: '기본 순서: 주어 + 동사 + 목적어',
    body: '한국어는 동사가 끝에 오지만 영어는 주어 바로 뒤에 동사. 장소·시간은 보통 맨 뒤 (장소 → 시간 순서).',
    ex: 'I met my friend at the cafe yesterday.' },
  { cat: '문장 기본', title: 'a / an / the',
    body: 'a/an: 처음 말하는 것, 여러 개 중 하나 (모음 소리 앞에서는 an: an apple, an hour)\nthe: 서로 아는 그것, 하나뿐인 것',
    ex: 'I saw a dog. The dog was huge.' },
  { cat: '문장 기본', title: '셀 수 있는 명사 vs 셀 수 없는 명사',
    body: '셀 수 있는: many, a few, 복수형(-s) / 셀 수 없는: much, a little, 복수형 없음\n대표적인 셀 수 없는 명사: water, money, time, information, advice, homework, work, furniture',
    ex: 'How many friends? / How much money?\nI have a lot of work. (× works, × many work)' },
  { cat: '문장 기본', title: '형용사 vs 부사',
    body: '형용사: 명사를 꾸밈, be동사 뒤 (a quick answer, She is quick)\n부사: 동사·형용사·문장을 꾸밈, 보통 -ly (She answered quickly)\ngood(형용사) ↔ well(부사)',
    ex: 'You speak English well. (× good)' },
  { cat: '문장 기본', title: '시간 전치사 in / on / at',
    body: 'at: 시각, 짧은 때 (at 3, at night)\non: 날짜, 요일 (on Monday, on May 5th)\nin: 월, 연도, 계절, 오전·오후 (in May, in 2026, in the morning)',
    ex: 'See you on Friday at 7.' },
];
