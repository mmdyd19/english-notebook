'use strict';
// 영어 기초 노트 ① — 분류 목록 + 품사·문장 구조·명사·관사·대명사·수 일치
// 형식: N(분류, 제목, 설명, 예문(줄바꿈 구분))
window.GRAMMAR_BASE = [];
window.GRAMMAR_CATS = [
  { name: '품사', emoji: '🧱', desc: '단어의 8가지 종류' },
  { name: '문장 구조', emoji: '🏗️', desc: '주어·동사·목적어·보어, 5형식' },
  { name: '명사', emoji: '📦', desc: '셀 수 있는/없는, 복수형' },
  { name: '관사', emoji: '🔤', desc: 'a / an / the' },
  { name: '대명사', emoji: '👤', desc: '인칭, 소유, 재귀, 지시' },
  { name: '수 일치', emoji: '⚖️', desc: '주어와 동사 맞추기' },
  { name: 'be동사·일반동사', emoji: '🔧', desc: 'am/are/is, do/does' },
  { name: '시제', emoji: '⏰', desc: '현재·과거·미래, 진행, 완료' },
  { name: '동사 변화', emoji: '🔁', desc: '-ed 규칙, 불규칙 동사표' },
  { name: '조동사', emoji: '🛠️', desc: 'can, will, should, must …' },
  { name: '부정·의문', emoji: '❓', desc: 'not, 의문사, 부가의문문' },
  { name: '명령·감탄·제안', emoji: '📣', desc: '명령문, Let\'s, What a ~!' },
  { name: '수동태', emoji: '🔄', desc: 'be + p.p.' },
  { name: 'to부정사', emoji: '➡️', desc: 'to + 동사원형' },
  { name: '동명사', emoji: '🏃', desc: '동사 + ing = 명사' },
  { name: '분사', emoji: '🎨', desc: 'boring vs bored, 분사구문' },
  { name: '형용사', emoji: '🌈', desc: '꾸미는 말, 수량 표현' },
  { name: '부사', emoji: '💨', desc: '-ly, 빈도부사, 혼동 부사' },
  { name: '비교', emoji: '📏', desc: '비교급·최상급, as ~ as' },
  { name: '전치사', emoji: '📍', desc: 'in/on/at, 장소·시간·방향' },
  { name: '접속사', emoji: '🔗', desc: 'and, because, although …' },
  { name: '관계사', emoji: '🪢', desc: 'who, which, that, what' },
  { name: '가정법·조건문', emoji: '💭', desc: 'if, I wish' },
  { name: '화법·시제 일치', emoji: '🗣️', desc: 'He said that ~' },
  { name: '수·날짜·시간', emoji: '🔢', desc: '숫자, 날짜, 시각 읽기' },
  { name: '발음 기초', emoji: '👄', desc: '-s/-ed 발음, 강세' },
  { name: '문장부호·대문자', emoji: '✍️', desc: '쉼표, 아포스트로피' },
  { name: '헷갈리는 단어', emoji: '🤔', desc: 'say/tell, make/do …' },
  { name: '같은 뜻 다른 표현', emoji: '🔀', desc: 'have got, gonna, 축약형' },
  { name: '회화 필수 패턴', emoji: '💬', desc: 'I\'d like to, How about …' },
];
(function () {
  const N = (cat, title, body, ex) => window.GRAMMAR_BASE.push({ cat, title, body, ex: ex || '' });

  // ===== 품사 =====
  N('품사', '품사 8가지 한눈에', `명사: 이름 (book, Seoul, love)
대명사: 명사 대신 (I, you, it, this)
동사: 동작·상태 (run, be, have)
형용사: 명사를 꾸밈 (happy, big)
부사: 동사·형용사·문장을 꾸밈 (quickly, very)
전치사: 명사 앞에서 위치·시간·관계 (in, on, with)
접속사: 단어·문장 연결 (and, but, because)
감탄사: 느낌 (oh, wow, oops)`, `Wow, the little dog runs very fast in the park.
(감탄사, 관사, 형용사, 명사, 동사, 부사, 부사, 전치사, 관사, 명사)`);
  N('품사', '한 단어가 여러 품사가 될 수 있다', `영어는 모양이 같아도 문장 속 자리에 따라 품사가 바뀐다. 사전에서 뜻을 찾을 때 품사를 같이 봐야 한다.`, `I need a drink. (명사: 음료)
I drink coffee. (동사: 마시다)
It's a fast car. (형용사) / He runs fast. (부사)`);
  N('품사', '단어 끝(어미)으로 품사 짐작하기', `명사: -tion, -ment, -ness, -ity, -er (information, movement, kindness, ability, teacher)
형용사: -ful, -less, -ous, -ive, -able, -al, -y (useful, careless, famous, active, comfortable, natural, sunny)
부사: 형용사 + -ly (quickly, carefully)
동사: -ize, -fy, -en (realize, simplify, shorten)`, `happy(형) → happiness(명) → happily(부)
decide(동) → decision(명)`);

  // ===== 문장 구조 =====
  N('문장 구조', '영어 문장의 기본 순서', `한국어: 나는 / 사과를 / 먹는다 (동사가 끝)
영어: I / eat / an apple (주어 바로 뒤에 동사)
영어는 "누가 → 한다 → 무엇을 → 어디서 → 언제" 순서가 기본.`, `I met my friend at the cafe yesterday.
(누가 → 했다 → 누구를 → 어디서 → 언제)`);
  N('문장 구조', '문장 성분 5가지', `주어(S): ~은/는/이/가
동사(V): ~하다/이다
목적어(O): ~을/를 (동작을 받는 대상)
보어(C): 주어나 목적어가 "무엇인지/어떤지" 보충
수식어(M): 시간·장소·방법 등 덧붙이는 말 (없어도 문장이 됨)`, `She(S) is(V) a nurse(C).
He(S) bought(V) a car(O) last week(M).`);
  N('문장 구조', '1형식: 주어 + 동사', `동사만으로 뜻이 끝나는 문장. 뒤에 장소·시간이 와도 수식어일 뿐.
대표 동사: go, come, arrive, sleep, run, happen, live`, `The baby is sleeping.
I live in Busan.`);
  N('문장 구조', '2형식: 주어 + 동사 + 보어', `주어 = 보어 관계. 보어 자리에는 명사나 형용사 (부사 X).
대표 동사: be, become, look, feel, sound, smell, taste, seem, get, turn`, `She became a doctor.
You look tired. (× tiredly)
This soup tastes good. (× well)`);
  N('문장 구조', '3형식: 주어 + 동사 + 목적어', `가장 흔한 문장. 목적어는 "~을/를".
대표 동사: like, want, have, make, see, know, need, love`, `I love you.
She wants a new phone.`);
  N('문장 구조', '4형식: 주어 + 동사 + 사람 + 물건', `"누구에게 무엇을 주다" 모양. 3형식으로 바꿀 때는 to나 for를 쓴다.
to: give, send, show, tell, teach, lend
for: buy, make, cook, get, find`, `He gave me a gift. = He gave a gift to me.
Mom made me a cake. = Mom made a cake for me.`);
  N('문장 구조', '5형식: 주어 + 동사 + 목적어 + 보어', `목적어의 상태나 행동을 보충한다.
make/keep/find + 목적어 + 형용사
call/name + 목적어 + 명사
want/ask/tell + 목적어 + to 동사원형
make/let/have + 목적어 + 동사원형 (사역동사)`, `This song makes me happy.
We call him Tom.
My boss told me to come early.
Let me go.`);
  N('문장 구조', 'There is / There are (~이 있다)', `처음 소개하는 것이 "있다"고 말할 때. 뒤에 오는 명사에 맞춰 is/are를 고른다.
there는 "거기"라는 뜻이 아니다.`, `There is a cat on the sofa.
There are two banks near here.
Is there a restroom?`);
  N('문장 구조', 'It을 가짜 주어로 쓰는 경우', `날씨·시간·거리·요일·상황을 말할 때 주어 자리를 It이 채운다 (뜻 없음).
긴 주어(to부정사, that절)를 뒤로 보낼 때도 It을 앞에 둔다.`, `It's raining.
It's 3 o'clock.
It's hard to learn English. (= To learn English is hard.)`);

  // ===== 명사 =====
  N('명사', '셀 수 있는 명사 vs 셀 수 없는 명사', `셀 수 있는 명사: 하나면 a/an, 여러 개면 -s (a book, two books)
셀 수 없는 명사: a/an 안 붙고 복수형 없음 (water, money)
수량: many / a few / few (셀 수 있는) ↔ much / a little / little (셀 수 없는)
a lot of, some, any는 둘 다 가능`, `How many apples? / How much water?
I have a lot of homework. (× homeworks)`);
  N('명사', '한국 사람이 자주 틀리는 셀 수 없는 명사', `information, advice, homework, work(일), furniture, luggage, baggage, money, news, equipment, traffic, weather, knowledge, research, evidence, bread, music, fun
→ 하나·둘 셀 때는 a piece of 등 단위를 쓴다.`, `a piece of advice (× an advice)
some information (× informations)
The news is good. (news는 단수 취급)`);
  N('명사', '셀 수 없는 명사를 세는 단위', `a cup of coffee / a glass of water / a bottle of wine
a piece of cake, paper, advice / a slice of pizza / a loaf of bread
a bowl of rice / a can of soda / a bar of chocolate / a pair of shoes`, `Can I have two cups of coffee?
I bought a pair of jeans.`);
  N('명사', '복수형 만드는 규칙', `대부분 + s: book → books
s, x, sh, ch, o로 끝 + es: bus → buses, box → boxes, dish → dishes, watch → watches, potato → potatoes (예외: photos, pianos)
자음 + y → ies: city → cities (모음 + y는 그대로 + s: days, boys)
f, fe → ves: leaf → leaves, knife → knives, life → lives (예외: roofs)`, `two babies, three wolves, many tomatoes`);
  N('명사', '불규칙 복수형', `man → men / woman → women / child → children / person → people
tooth → teeth / foot → feet / mouse → mice / goose → geese
단수·복수가 같은 것: sheep, fish, deer, series, species
항상 복수로 쓰는 것: pants, jeans, glasses, scissors, shorts (a pair of로 셈)`, `My feet hurt.
There are many people.`);
  N('명사', '소유격 \'s 와 of', `사람·동물: 's → Tom's car, my mom's bag
-s로 끝나는 복수: ' 만 → my parents' house
사물: of를 주로 → the end of the movie, the color of the wall
시간·거리: today's news, a ten minutes' walk`, `This is my sister's room.
The roof of the house is red.`);
  N('명사', '집합명사 (family, team …)', `family, team, class, staff, police 같은 단어.
미국 영어는 보통 하나로 보고 단수 동사, 영국 영어는 구성원을 보고 복수 동사도 쓴다.
police, people, cattle은 항상 복수.`, `My family is big. (미국식)
The police are coming.`);

  // ===== 관사 =====
  N('관사', 'a / an 고르기는 "소리" 기준', `뒤 단어 첫 소리가 모음 소리면 an, 자음 소리면 a. 철자가 아니라 발음 기준이다.`, `an apple, an hour (h 묵음), an MP3 (엠피쓰리)
a university (유니버시티), a uniform, a one-way ticket (원)`);
  N('관사', 'a/an 은 언제 쓰나', `셀 수 있는 명사 하나를 처음 말할 때, "어떤 하나"
직업 말할 때 (I'm a teacher.)
"~마다" (twice a week, 100km an hour)`, `I saw a movie last night.
She is an engineer.`);
  N('관사', 'the 는 언제 쓰나', `① 앞에서 말한 것: I bought a bag. The bag is blue.
② 서로 아는 것: Close the door.
③ 세상에 하나뿐: the sun, the moon, the internet
④ 최상급·서수: the best, the first
⑤ 악기: play the piano
⑥ 강·바다·산맥·나라 이름 일부: the Han River, the USA, the UK`, `Can you pass me the salt?
She's the tallest in her class.`);
  N('관사', '관사를 쓰지 않는 경우', `식사: have breakfast / lunch / dinner
운동·게임: play soccer, play games
교통수단 by: by bus, by train
일반적인 것을 말할 때 복수·셀 수 없는 명사: I like cats. Money isn't everything.
장소 본래 목적: go to school(공부하러), go to bed(자러), go to church
사람 이름·도시·나라 대부분: Seoul, Korea`, `I go to work by subway.
Dogs are loyal.`);

  // ===== 대명사 =====
  N('대명사', '1인칭 · 2인칭 · 3인칭', `1인칭: 말하는 나/우리 → I, we
2인칭: 듣는 너/너희 → you
3인칭: 나와 너를 뺀 나머지 모두 → he, she, it, they, Tom, my mom, the dog …`, `I like coffee. (1인칭)
You look tired. (2인칭)
She works at a bank. (3인칭)`);
  N('대명사', '주격 · 목적격 · 소유격 · 소유대명사 · 재귀대명사 표', `주격 / 목적격 / 소유격 / 소유대명사 / 재귀
I – me – my – mine – myself
you – you – your – yours – yourself(yourselves)
he – him – his – his – himself
she – her – her – hers – herself
it – it – its – (없음) – itself
we – us – our – ours – ourselves
they – them – their – theirs – themselves`, `She likes him. (주어 she, 목적어 him)
This is my bag. It's mine.`);
  N('대명사', '전치사·동사 뒤에는 목적격', `주어 자리가 아니면 목적격(me, him, her, us, them).
"between you and me" (× between you and I)`, `Come with me.
Tell them the truth.`);
  N('대명사', '재귀대명사 myself, yourself …', `① 주어와 목적어가 같을 때: I hurt myself.
② 강조 "직접": I made it myself.
③ by oneself = 혼자서 / enjoy oneself = 즐겁게 보내다 / help yourself = 마음껏 드세요`, `Did you enjoy yourself?
She lives by herself.`);
  N('대명사', 'this / that / these / those', `this(이것) – these(이것들): 가까운 것
that(저것) – those(저것들): 먼 것, 지난 일
전화에서 "저는 ~예요": This is Jiyoung.`, `Is this your phone?
Those were the days.`);
  N('대명사', 'one / ones (같은 종류 하나)', `앞에 나온 명사를 반복하지 않으려고 쓴다. it은 "바로 그것", one은 "같은 종류의 하나".`, `I lost my umbrella. I need to buy a new one.
I lost my umbrella. I found it! (바로 그 우산)`);
  N('대명사', 'some / any', `some: 긍정문, 권유·부탁 의문문 ("좀")
any: 부정문, 일반 의문문 ("하나도, 좀이라도")
긍정문의 any는 "아무거나"`, `I have some money.
I don't have any money.
Would you like some tea?
You can choose any color.`);
  N('대명사', 'something / anything / nothing / everything', `-body / -one (사람), -thing (물건), -where (장소)도 같은 규칙
something: 긍정 / anything: 부정·의문 / nothing: "아무것도 없다"(not 없이)
형용사는 뒤에서 꾸민다: something cold`, `I want something cold to drink.
I didn't see anything. = I saw nothing.
Is anyone there?`);
  N('대명사', 'each / every / all / both', `every + 단수명사 + 단수동사 (Every student has a book.)
each: 하나하나 따로 (each of them)
all: 전부 (all of us, all the time)
both: 둘 다 (both of my parents)`, `Each room has a TV.
Both of them are my friends.`);
  N('대명사', 'other / another / the other', `another: (아무거나) 또 하나 → another cup
other + 복수: 다른 것들 → other people
the other: (둘 중) 나머지 하나 → one ..., the other ...
others: 다른 사람들 / the others: 나머지 전부`, `I have two cats. One is black, and the other is white.
Can I have another one?`);

  // ===== 수 일치 =====
  N('수 일치', '주어가 단수면 동사도 단수', `동사는 바로 앞 단어가 아니라 "진짜 주어"에 맞춘다.`, `The color of the flowers is beautiful. (주어: color)
The people in this office are kind.`);
  N('수 일치', '항상 단수 취급하는 것', `every-, each, -one/-body/-thing (everyone, nobody …)
학과·병명·나라: math, physics, news, the United States
시간·돈·거리 한 덩어리: Ten dollars is enough.
동명사·to부정사 주어: Swimming is fun.`, `Everyone is here.
Mathematics is my favorite subject.`);
  N('수 일치', 'A and B 는 복수, A or B 는 가까운 쪽', `A and B → 복수 (Tom and I are friends.)
either A or B / neither A nor B / not only A but also B → B에 맞춘다
A as well as B → A에 맞춘다`, `Either you or he is wrong.
Neither my brother nor my parents know it.`);
  N('수 일치', 'a number of vs the number of', `a number of + 복수명사 → 복수동사 ("많은")
the number of + 복수명사 → 단수동사 ("~의 수")`, `A number of students are absent.
The number of students is 30.`);
})();
