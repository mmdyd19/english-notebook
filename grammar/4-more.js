'use strict';
// 영어 기초 노트 ④ — 형용사, 부사, 비교, 전치사, 접속사, 수·날짜·시간, 발음, 문장부호, 헷갈리는 단어, 같은 뜻 다른 표현, 회화 패턴
(function () {
  const N = (cat, title, body, ex) => window.GRAMMAR_BASE.push({ cat, title, body, ex: ex || '' });

  // ===== 형용사 =====
  N('형용사', '형용사 자리 2곳', `① 명사 앞: a happy girl
② be동사·감각동사 뒤 (보어): She is happy. / You look happy.
-thing, -one, -body 는 형용사가 뒤에서 꾸민다: something new`, `It's a big house.
The soup smells good.`);
  N('형용사', '형용사 여러 개 순서', `의견 → 크기 → 나이 → 모양 → 색 → 출신 → 재료 → 명사
(실제로는 2~3개 정도만 쓴다)`, `a nice big old house
a small black leather bag`);
  N('형용사', 'many / much / a lot of', `many + 셀 수 있는 복수 / much + 셀 수 없는
긍정문에서는 a lot of / lots of 가 더 자연스럽다. much는 주로 부정·의문문.`, `I don't have much time.
How many people came?
She has a lot of friends.`);
  N('형용사', 'a few / few / a little / little', `a few (셀 수 O) / a little (셀 수 X): 조금 있다 (긍정)
few / little: 거의 없다 (부정 느낌)`, `I have a few friends here. (몇 명 있다)
I have few friends here. (거의 없다)
There's a little milk left.`);
  N('형용사', 'the + 형용사 = ~한 사람들', `the rich (부자들), the poor, the young, the elderly, the homeless → 복수 취급`, `The rich are not always happy.`);

  // ===== 부사 =====
  N('부사', '부사가 꾸미는 것', `동사: run fast / 형용사: very good / 다른 부사: really quickly / 문장 전체: Luckily, …
만드는 법: 형용사 + ly (quick → quickly, happy → happily, gentle → gently)`, `She speaks English fluently.
Unfortunately, it rained.`);
  N('부사', '-ly가 아닌데 부사이거나, -ly인데 형용사인 것', `형용사 = 부사 같은 모양: fast, hard, late, early, high, long, well(건강한)
-ly인데 형용사: friendly, lovely, lonely, ugly, likely, daily(매일의)
good(형) ↔ well(부)`, `He works hard. (× hardly)
She's a friendly person.
You did well! (× good)`);
  N('부사', '모양은 비슷한데 뜻이 다른 부사', `hard (열심히) / hardly (거의 ~않다)
late (늦게) / lately (최근에)
near (가까이) / nearly (거의)
high (높이) / highly (매우)`, `I can hardly hear you.
Have you seen him lately?`);
  N('부사', '빈도부사 위치', `always 100% > usually > often > sometimes > rarely/seldom > never 0%
위치: be동사·조동사 뒤, 일반동사 앞`, `I'm always late.
I usually get up at 7.
I have never been there.`);
  N('부사', 'too / also / either / as well', `긍정문 "~도": too, also, as well
부정문 "~도": either
also는 일반동사 앞·be동사 뒤, too/as well/either는 문장 끝`, `I like it too.
I don't like it either. (× too)`);
  N('부사', 'already / yet / still', `already: 벌써 (긍정)
yet: 아직 (부정) / 벌써 (의문) — 문장 끝
still: 여전히, 아직도`, `I've already eaten.
I haven't finished yet. / Have you finished yet?
She's still sleeping.`);
  N('부사', 'very / too / so / really / quite', `very: 매우 (중립)
too: 너무 (부정적, 지나침)
so: 아주 (감정 강조, 회화)
quite: 꽤 / pretty: 꽤 (회화)`, `It's very hot. / It's too hot to go out.
I'm so happy! / It's pretty good.`);
  N('부사', 'ago / before / later / after', `ago: (지금부터) ~전에 → two days ago (과거 시제)
before: (그 시점보다) ~전에, 또는 그냥 "전에" → I've seen it before.
later: (지금부터) ~후에 → See you later. / two days later
after: ~ 후에 (전치사·접속사) → after lunch`, `I met him 3 years ago.
Call me after work.`);

  // ===== 비교 =====
  N('비교', '비교급·최상급 만드는 법', `짧은 단어(1음절): + er / + est → tall – taller – tallest
e로 끝: + r / + st → nice – nicer – nicest
단모음+단자음: 자음 하나 더 → big – bigger – biggest, hot – hotter
자음+y: y → ier / iest → happy – happier – happiest, easy – easier
긴 단어(2음절 이상 대부분): more / most → beautiful – more beautiful – most beautiful`, `She's taller than me.
This is the most expensive one.`);
  N('비교', '불규칙 비교급', `good/well – better – best
bad – worse – worst
many/much – more – most
little – less – least
far – farther(거리)/further(정도) – farthest/furthest`, `I feel better today.
That was the worst day ever.`);
  N('비교', '비교급 + than / the + 최상급', `A is 비교급 than B
the + 최상급 + in(장소·집단) / of(복수) / that I've ever ~`, `Seoul is bigger than Busan.
He's the tallest in my class.
It's the best movie I've ever seen.`);
  N('비교', 'as ~ as (~만큼 …한)', `as + 원급 + as: 같다
not as(so) ~ as: ~만큼 …하지 않다
배수: twice as ~ as, three times as ~ as`, `I'm as tall as my brother.
It's not as easy as it looks.
This is twice as big as that.`);
  N('비교', '비교급 강조: much / even / a lot / far', `"훨씬"은 very가 아니라 much, even, a lot, far, still`, `This is much better. (× very better)`);
  N('비교', 'the 비교급, the 비교급 / 비교급 and 비교급', `the 비교급 ~, the 비교급 …: ~할수록 더 …하다
비교급 and 비교급: 점점 더 ~한`, `The sooner, the better.
It's getting colder and colder.`);

  // ===== 전치사 =====
  N('전치사', '시간 전치사 in / on / at', `at: 시각, 짧은 때 (at 3, at noon, at night, at the moment)
on: 날짜, 요일, 특정한 날 (on Monday, on May 5th, on my birthday)
in: 월, 연도, 계절, 오전·오후, 긴 기간 (in May, in 2026, in summer, in the morning)
this/next/last/every 앞에는 전치사 없음 (next Monday)`, `See you on Friday at 7.
I was born in 1995.`);
  N('전치사', '장소 전치사 in / on / at', `at: 지점, 장소를 하나의 점으로 (at the bus stop, at home, at work, at the party)
on: 면 위, 접촉 (on the table, on the wall, on the 3rd floor, on the bus)
in: 공간 안 (in the box, in the room, in Seoul, in the car)`, `I'm at the cafe.
Your phone is on the desk.
She lives in Busan.`);
  N('전치사', '위치 전치사', `under 아래 / over 위에(떨어져) / above 위쪽 / below 아래쪽
next to, beside 옆 / between A and B 사이 / among 여럿 사이
in front of 앞 / behind 뒤 / across from, opposite 맞은편 / near 근처`, `The bank is next to the hospital.
The cat is under the bed.`);
  N('전치사', '방향 전치사', `to ~로 / from ~에서 / into 안으로 / out of 밖으로
up 위로 / down 아래로 / along 따라 / across 가로질러 / through 통과해서 / around 주위에
toward(s) ~쪽으로 / past 지나서`, `Walk along the river.
He came out of the room.`);
  N('전치사', 'for / during / while', `for + 기간 숫자: for 3 hours
during + 명사(무슨 기간): during the vacation, during the meeting
while + 주어 + 동사 (접속사): while I was sleeping`, `I slept for 10 hours.
I fell asleep during the movie.`);
  N('전치사', 'by vs until (till)', `by: ~까지 (마감, 한 번 끝내면 됨)
until: ~까지 계속 (그때까지 쭉)`, `Finish it by Friday.
I'll wait until 6.`);
  N('전치사', 'by / with (수단·도구)', `by + 교통·방법 (관사 없이): by bus, by car, by email, by credit card / 단, on foot
with + 도구: with a pen, with a knife`, `I go to work by subway.
Cut it with scissors.`);
  N('전치사', '자주 쓰는 형용사 + 전치사', `good at / bad at / interested in / afraid of / proud of / tired of / full of
famous for / late for / ready for / different from / similar to / married to / angry with(사람) / angry about(일)
worried about / excited about / responsible for / kind to`, `I'm bad at math.
I'm afraid of dogs.
Sorry I'm late for the meeting.`);
  N('전치사', '자주 쓰는 동사 + 전치사', `listen to / look at / look for(찾다) / wait for / depend on / belong to / agree with(사람)/on(일)
think about/of / talk to/about / ask for / pay for / apply for / care about / laugh at / arrive at(작은 곳)/in(도시·나라)`, `I'm looking for my keys.
Wait for me!
We arrived in Tokyo.`);
  N('전치사', '전치사를 쓰지 않는 동사 (실수 많음)', `discuss (× about) / marry (× with) / enter (× into) / reach (× to) / call (× to) / answer (× to) / attend (× to) / approach (× to)`, `Let's discuss the plan.
She married a doctor.`);

  // ===== 접속사 =====
  N('접속사', 'and / but / or / so', `and: 그리고 / but: 하지만 / or: 또는, 아니면 / so: 그래서
같은 모양끼리 연결한다.`, `I was tired, so I went to bed.
Do you want tea or coffee?`);
  N('접속사', 'because vs because of', `because + 주어 + 동사 (문장)
because of + 명사 (덩어리)
비슷한 것: since, as (문장) / due to (명사)`, `I stayed home because it rained.
I stayed home because of the rain.`);
  N('접속사', 'although / though / even though vs despite / in spite of', `although, though, even though + 문장: 비록 ~이지만
despite, in spite of + 명사/동명사
회화 끝에 붙는 though: 그래도, 근데`, `Although it was cold, we went out.
Despite the cold, we went out.
It was fun, though.`);
  N('접속사', 'when / while / before / after / as soon as / until', `when: ~할 때 / while: ~하는 동안 / before: ~하기 전에 / after: ~한 후에
as soon as: ~하자마자 / until: ~할 때까지 / since: ~한 이후로
(미래 일이라도 이 부분은 현재형)`, `Call me as soon as you arrive.
I'll wait until you come.`);
  N('접속사', 'if / unless / in case', `if: 만약 ~라면 / unless: ~하지 않으면 / in case: ~할 경우에 대비해서`, `Take an umbrella in case it rains.`);
  N('접속사', 'that (~라는 것) 은 회화에서 생략 가능', `think, know, say, hope, believe, be sure, be glad 뒤의 that은 자주 생략.`, `I think (that) you're right.
I'm sure (that) she'll come.`);
  N('접속사', '짝으로 쓰는 접속사', `both A and B: A와 B 둘 다
either A or B: A나 B 중 하나
neither A nor B: A도 B도 아닌
not only A but (also) B: A뿐만 아니라 B도
not A but B: A가 아니라 B
so ~ that …: 너무 ~해서 …하다`, `Both my mom and dad work.
It was so cold that I couldn't sleep.`);
  N('접속사', 'so that (~하도록)', `so that + 주어 + can/will: 목적`, `Speak louder so that everyone can hear you.`);

  // ===== 수·날짜·시간 =====
  N('수·날짜·시간', '큰 숫자 읽기', `영어는 세 자리마다 끊는다: thousand(천) / million(백만) / billion(십억)
10,000 = ten thousand (만) / 100,000 = one hundred thousand (십만) / 1,000,000 = one million (백만)
hundred, thousand 뒤에 -s를 붙이지 않는다 (× two hundreds)`, `1,250 = one thousand two hundred (and) fifty
35,000 = thirty-five thousand`);
  N('수·날짜·시간', '서수 (첫째, 둘째 …)', `first, second, third, fourth, fifth, sixth, … twelfth, twentieth, twenty-first
쓰는 법: 1st, 2nd, 3rd, 4th, 21st, 22nd, 23rd
날짜, 층, 순서, 생일 몇 번째에 쓴다.`, `on the 3rd floor
It's my 30th birthday.`);
  N('수·날짜·시간', '날짜 읽고 쓰기', `미국식: May 5, 2026 → May fifth, twenty twenty-six
영국식: 5 May 2026 → the fifth of May
연도: 1995 = nineteen ninety-five / 2008 = two thousand (and) eight / 2026 = twenty twenty-six`, `When is your birthday? – It's on March 27th.`);
  N('수·날짜·시간', '시각 말하기', `3:00 three o'clock / 3:15 three fifteen = (a) quarter past three
3:30 three thirty = half past three / 3:45 three forty-five = (a) quarter to four
3:05 three oh five / a.m. 오전, p.m. 오후 / noon 정오, midnight 자정`, `What time is it? – It's ten to seven. (6시 50분)`);
  N('수·날짜·시간', '분수·소수·퍼센트·전화번호', `1/2 a half / 1/3 a third / 2/3 two thirds / 1/4 a quarter
3.5 three point five / 50% fifty percent
전화번호는 한 자리씩: 010-1234 → oh one oh, one two three four`, `Half of the students passed.`);
  N('수·날짜·시간', '돈·나이 말하기', `$25.50 twenty-five dollars (and) fifty cents / twenty-five fifty
₩10,000 ten thousand won (won은 복수형 없음)
나이: I'm 30 (years old). / a 30-year-old man (하이픈으로 연결할 땐 year에 s 없음)`, `How much is it? – It's 12 dollars.`);

  // ===== 발음 기초 =====
  N('발음 기초', '-s / -es 발음 3가지', `[s]: 무성음(p, t, k, f) 뒤 → books, cats, stops
[z]: 유성음·모음 뒤 → dogs, plays, cars
[iz]: s, z, sh, ch, x, ge 소리 뒤 → buses, watches, boxes, pages`, ``);
  N('발음 기초', '-ed 발음 3가지', `[t]: 무성음(p, k, s, sh, ch, f) 뒤 → stopped, looked, washed
[d]: 유성음·모음 뒤 → played, lived, called
[id]: t, d 뒤 → wanted, needed, started`, ``);
  N('발음 기초', '강세가 뜻을 바꾸는 단어', `명사는 앞, 동사는 뒤에 강세가 오는 경우가 많다.
REcord (기록) / reCORD (녹음하다)
PREsent (선물) / preSENT (발표하다)
OBject (물건) / obJECT (반대하다)`, ``);
  N('발음 기초', '묵음 (쓰지만 소리 안 나는 글자)', `k: know, knife, knee / w: write, wrong, answer / b: climb, comb, doubt
h: hour, honest / l: walk, talk, half, could / t: listen, often(둘 다 가능), castle
gh: night, high, daughter`, ``);
  N('발음 기초', '한국 사람이 헷갈리는 발음 쌍', `r / l: right – light, rice – lice
f / p: fan – pan, coffee
b / v: berry – very, best – vest
th [θ] / s: think – sink, thank – sank
th [ð] / d: they – day`, ``);

  // ===== 문장부호·대문자 =====
  N('문장부호·대문자', '대문자로 쓰는 것', `문장 첫 글자, I (항상 대문자)
사람·도시·나라·언어·국적: Jiyoung, Seoul, Korea, Korean, English
요일·월·공휴일: Monday, May, Christmas (계절은 소문자: summer)
제목의 주요 단어`, `I live in Seoul and speak Korean.`);
  N('문장부호·대문자', '아포스트로피 (\') 쓰임 2가지', `① 축약: I'm, don't, it's (= it is)
② 소유: Tom's, my parents'
its(그것의)는 아포스트로피 없음`, `It's raining. / The dog wagged its tail.`);
  N('문장부호·대문자', '쉼표 (,) 기본 규칙', `여러 개 나열: apples, bananas, and grapes
접속사로 긴 문장 두 개 연결할 때 접속사 앞: I was tired, but I finished it.
문장 앞 연결어 뒤: However, … / Luckily, …
부르는 말: Thanks, Tom.`, ``);
  N('문장부호·대문자', '물음표·느낌표·따옴표', `물음표(?)는 의문문 끝, 간접의문문에는 안 씀 (Do you know where it is?)
따옴표 안 대사: She said, "Hi."
영어 문서에서는 마침표·쉼표를 따옴표 안에 넣는 게 미국식.`, ``);

  // ===== 헷갈리는 단어 =====
  N('헷갈리는 단어', 'say / tell / speak / talk', `say: 말 "내용"을 말하다 (say hello, say sorry)
tell: 사람에게 알려주다 (tell me, tell a story, tell the truth, tell a lie)
speak: 언어, 공식적으로 말하다 (speak English, speak to the manager)
talk: 대화하다 (talk to/with someone, talk about)`, `What did she say?
Tell me about it.
Can I speak to Tom? / We talked for hours.`);
  N('헷갈리는 단어', 'see / look / watch', `see: 저절로 보이다
look (at): 의도해서 쳐다보다 (정지한 것)
watch: 움직이는 것을 지켜보다 (TV, 영화, 경기)`, `Did you see that?
Look at this picture.
Let's watch a movie.`);
  N('헷갈리는 단어', 'hear / listen', `hear: 저절로 들리다
listen (to): 귀 기울여 듣다`, `I heard a noise.
I'm listening to music.`);
  N('헷갈리는 단어', 'make / do', `make: 만들다, 결과물 (make a mistake, make money, make a decision, make a plan, make friends, make noise, make coffee)
do: 일·활동 자체 (do homework, do the dishes, do exercise, do your best, do a favor, do business)`, `I made a mistake.
Can you do me a favor?`);
  N('헷갈리는 단어', 'borrow / lend / rent', `borrow: (내가) 빌리다
lend: (남에게) 빌려주다
rent: 돈 내고 빌리다/빌려주다 (집, 차)`, `Can I borrow your pen?
Can you lend me your pen?`);
  N('헷갈리는 단어', 'bring / take, come / go', `bring: (여기로) 가져오다 / take: (저기로) 가져가다
come: 말하는 사람·듣는 사람 쪽으로 오다 / go: 다른 곳으로 가다
"(너한테) 갈게"는 I'm coming!`, `Bring your friend to the party.
Take an umbrella with you.
I'm coming! (× I'm going)`);
  N('헷갈리는 단어', 'win / beat / earn', `win: 경기·상을 이기다/타다 (win the game, win a prize)
beat: 상대를 이기다 (beat the team)
earn: (일해서) 돈을 벌다`, `We beat them 3–1 and won the match.`);
  N('헷갈리는 단어', 'fun / funny', `fun: 재미있는, 즐거운 (활동)
funny: 웃긴`, `The party was fun.
He's so funny.`);
  N('헷갈리는 단어', 'then / than, its / it\'s, your / you\'re, their / there / they\'re', `then: 그때, 그러면 / than: ~보다
its: 그것의 / it's: it is
your: 너의 / you're: you are
their: 그들의 / there: 거기 / they're: they are`, `It's bigger than I thought.
They're at their house over there.`);
  N('헷갈리는 단어', 'expect / wait / look forward to', `expect: (당연히 일어날 거라) 예상하다
wait (for): 기다리다
look forward to: (기대하며) 고대하다`, `I'm expecting a call.
I'm looking forward to the trip.`);
  N('헷갈리는 단어', 'hope / wish', `hope: 가능성 있는 일을 바라다 (hope + 현재/미래)
wish: 사실과 반대를 바라다 (wish + 과거) / 축하·인사 (I wish you luck)`, `I hope you get better soon.
I wish I could fly.`);
  N('헷갈리는 단어', 'almost / most / most of', `almost: 거의 (부사) → almost all, almost every
most + 명사: 대부분의 → most people
most of + the/소유격 + 명사 → most of my friends`, `Almost everyone came. (× Most everyone)
Most of the students passed.`);

  // ===== 같은 뜻 다른 표현 =====
  N('같은 뜻 다른 표현', 'have = have got (가지고 있다)', `"가지고 있다"의 뜻일 때 같은 표현. have got은 영국식·구어에서 자주 쓴다.
의문·부정 만드는 법이 다르다: Do you have~? / Have you got~?
과거는 둘 다 had.`, `I have a car. = I've got a car.
Do you have time? = Have you got time?`);
  N('같은 뜻 다른 표현', 'have to = have got to = gotta', `"~해야 한다". 회화에서는 have got to → gotta.`, `I have to go. = I've got to go. = I gotta go.`);
  N('같은 뜻 다른 표현', '구어체 줄임말: gonna, wanna, gotta, kinda …', `going to → gonna / want to → wanna / got to → gotta
kind of → kinda / sort of → sorta / out of → outta / let me → lemme / give me → gimme / don't know → dunno
말이나 채팅에서만. 격식 있는 글에서는 쓰지 않는다.`, `I'm gonna be late.
I kinda like it.`);
  N('같은 뜻 다른 표현', '축약형', `I am → I'm / you are → you're / he is → he's / it is → it's / that is → that's
I have → I've / I will → I'll / I would/had → I'd / let us → let's
do not → don't / does not → doesn't / did not → didn't / is not → isn't / are not → aren't
cannot → can't / will not → won't / would not → wouldn't / should not → shouldn't`, `It's cold. (it is)
Its color is red. (its = 그것의, 축약 아님)`);
  N('같은 뜻 다른 표현', 'can = be able to, must = have to, will = be going to', `조동사를 두 개 겹칠 수 없을 때 바꿔 쓴다.
× will can → ○ will be able to
× will must → ○ will have to`, `You'll be able to see it soon.
I'll have to work tomorrow.`);
  N('같은 뜻 다른 표현', 'a lot of = lots of = plenty of', `모두 "많은". 셀 수 있는·없는 명사 둘 다. plenty of 는 "넉넉히, 충분히".`, `We have plenty of time.`);

  // ===== 회화 필수 패턴 =====
  N('회화 필수 패턴', 'I\'d like (to) ~ (~하고 싶어요 / ~ 주세요)', `want의 공손한 말. 주문·요청에 가장 많이 쓴다.
I'd like + 명사 / I'd like to + 동사원형`, `I'd like a coffee, please.
I'd like to make a reservation.`);
  N('회화 필수 패턴', 'Can I ~? / Could I ~? / May I ~? (해도 될까요?)', `허락 구하기. Can < Could < May 순으로 공손.`, `Can I sit here?
Could I ask you something?`);
  N('회화 필수 패턴', 'Can you ~? / Could you ~? / Would you ~? (해 줄래요?)', `부탁하기. Could you / Would you 가 더 공손.
Would you mind ~ing? = ~해 주시겠어요? (대답: No, not at all = 괜찮아요)`, `Could you help me?
Would you mind closing the door?`);
  N('회화 필수 패턴', 'How about ~? / What about ~? / Why don\'t we ~?', `제안하기. How about + 명사/~ing / Why don't we + 동사원형`, `How about pizza tonight?
Why don't we take a break?`);
  N('회화 필수 패턴', 'I\'m about to ~ / I\'m going to ~ / I\'m on my way', `I'm about to + 동사: 막 ~하려던 참이야
I'm on my way: 가는 중이야`, `I was about to call you!
I'm on my way home.`);
  N('회화 필수 패턴', 'Do you want me to ~? / Let me ~', `Do you want me to + 동사: 내가 ~해 줄까?
Let me + 동사: 내가 ~할게`, `Do you want me to drive?
Let me check.`);
  N('회화 필수 패턴', 'I feel like ~ / I\'m in the mood for ~', `I feel like + ~ing/명사: ~하고 싶은 기분이야
I feel like + 문장: ~인 것 같아`, `I feel like eating something sweet.
I feel like he's lying.`);
  N('회화 필수 패턴', 'It depends (on ~) / It\'s up to you', `It depends: 상황에 따라 달라
It's up to you: 너한테 달렸어, 네가 정해`, `– Are you coming? – It depends on the weather.
– Where should we eat? – It's up to you.`);
  N('회화 필수 패턴', 'I\'m not sure if ~ / I was wondering if ~', `I'm not sure if ~: ~인지 잘 모르겠어
I was wondering if you could ~: 혹시 ~해 주실 수 있을까 해서요 (아주 공손한 부탁)`, `I'm not sure if it's open.
I was wondering if you could help me.`);
  N('회화 필수 패턴', 'You don\'t have to ~ / You\'d better ~ / You should ~', `You don't have to: 안 해도 돼
You should: ~하는 게 좋겠어 (충고)
You'd better: ~하는 게 좋을걸 (경고)`, `You don't have to pay.
You should try this.`);
  N('회화 필수 패턴', 'What do you mean? / What do you think? / What\'s wrong?', `What do you mean (by ~)?: 무슨 뜻이야?
What do you think (of/about ~)?: 어떻게 생각해?
What's wrong? / What's the matter?: 무슨 일 있어?`, `What do you think of my new hair?`);
  N('회화 필수 패턴', 'It takes (사람) 시간 to ~ / It costs ~', `It takes + 시간 + to 동사: ~하는 데 시간이 걸리다
It costs + 돈: 비용이 들다`, `It takes 30 minutes to get there.
How long does it take?
How much does it cost?`);
  N('회화 필수 패턴', 'I used to ~ / I\'m used to ~ / I got used to ~', `I used to + 동사원형: 예전엔 ~했어
I'm used to + ~ing/명사: ~에 익숙해
I got used to + ~ing/명사: ~에 익숙해졌어`, `I used to live in Busan.
I got used to the cold.`);
  N('회화 필수 패턴', '맞장구·반응 표현', `So do I. / Me too. (나도 그래 – 긍정)
Neither do I. / Me neither. (나도 아니야 – 부정)
That makes sense. (말 되네) / Fair enough. (그럴 만하네) / No way! (말도 안 돼) / Tell me about it. (내 말이)`, `– I'm hungry. – Me too.
– I don't like it. – Me neither.`);
})();
