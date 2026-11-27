'use strict';
// 영어 기초 노트 ② — be동사·일반동사, 시제, 동사 변화(불규칙 동사표), 조동사
(function () {
  const N = (cat, title, body, ex) => window.GRAMMAR_BASE.push({ cat, title, body, ex: ex || '' });

  // ===== be동사·일반동사 =====
  N('be동사·일반동사', 'be동사: am / are / is / was / were', `"~이다, ~에 있다, ~한 상태이다"
현재: I → am / you·we·they·복수 → are / he·she·it·단수 → is
과거: I·he·she·it·단수 → was / you·we·they·복수 → were`, `I am hungry.
They were at home yesterday.`);
  N('be동사·일반동사', 'be동사 부정문·의문문', `부정: be동사 뒤에 not (isn't, aren't, wasn't, weren't / am not은 줄여도 I'm not)
의문: be동사를 주어 앞으로`, `She isn't busy.
Are you okay? – Yes, I am. / No, I'm not.`);
  N('be동사·일반동사', '일반동사 현재: 3인칭 단수면 -s', `주어가 he / she / it / 단수명사이고 현재면 동사에 -s(es).
have → has / do → does / go → goes / watch → watches / study → studies (자음+y → ies) / play → plays (모음+y → s)`, `He plays the guitar.
My sister has a cat.`);
  N('be동사·일반동사', '일반동사 부정문: don\'t / doesn\'t / didn\'t + 동사원형', `현재: I·you·we·they → don't / he·she·it → doesn't
과거: 모두 didn't
뒤의 동사는 항상 원형. 시제와 -s는 do가 가져간다.
× She doesn't likes → ○ She doesn't like
× I didn't went → ○ I didn't go`, `I don't eat meat.
He didn't call me.`);
  N('be동사·일반동사', '일반동사 의문문: Do / Does / Did + 주어 + 동사원형', `대답도 do로 한다: Yes, I do. / No, she doesn't.`, `Do you like K-pop?
Does she live here?
Did you sleep well? – Yes, I did.`);
  N('be동사·일반동사', 'be동사와 일반동사를 같이 쓰지 않는다', `한국 사람이 자주 하는 실수: × I am go / × I am agree / × She is live in Seoul
진행형(be + ing)이나 수동태(be + p.p.)가 아니면 be동사와 일반동사를 나란히 쓰지 않는다.`, `I agree. (× I am agree)
I'm going. (진행형은 OK)`);
  N('be동사·일반동사', '상태동사는 진행형으로 잘 안 쓴다', `생각·감정·소유·감각 동사: know, like, love, hate, want, need, believe, understand, belong, own, seem, remember
× I'm knowing → ○ I know
단, 뜻이 "동작"이 되면 가능: I'm having lunch. (have = 먹다)`, `I want some water. (× I'm wanting)
She's having a good time.`);

  // ===== 시제 =====
  N('시제', '시제 12개 한눈에', `        단순 / 진행(be+ing) / 완료(have+p.p.) / 완료진행(have been+ing)
현재: I work / I am working / I have worked / I have been working
과거: I worked / I was working / I had worked / I had been working
미래: I will work / I will be working / I will have worked / I will have been working
일상 회화는 현재·과거·미래, 현재진행, 현재완료가 대부분이다.`, ``);
  N('시제', '현재 시제: 습관·사실·일정', `지금 이 순간이 아니라 "평소에, 늘" 하는 일과 변하지 않는 사실.
always, usually, often, every day와 자주 쓴다.
시간표처럼 정해진 미래 일정에도 쓴다.`, `I drink coffee every morning.
Water boils at 100°C.
The train leaves at 9.`);
  N('시제', '현재진행형 = be + 동사ing', `① 지금 하는 중: I'm eating now.
② 요즘 하는 중: I'm studying English these days.
③ 가까운 미래의 확정된 약속: We're meeting at 7 tonight.`, `What are you doing?
I'm watching Netflix.`);
  N('시제', '-ing 붙이는 철자 규칙', `대부분 + ing: play → playing
e로 끝나면 e 빼고: make → making, come → coming (예외: be → being, see → seeing)
ie → ying: lie → lying, die → dying
단모음 + 단자음으로 끝나는 1음절: 자음 하나 더: run → running, sit → sitting, swim → swimming, stop → stopping`, `She's running. I'm lying on the bed.`);
  N('시제', '과거 시제: 끝난 일', `과거의 특정 시점에 일어나고 끝난 일. yesterday, last ~, ago, in 2020, when ~ 과 함께.`, `I went to Jeju last year.
She called me two hours ago.`);
  N('시제', '과거진행형 = was/were + 동사ing', `"(그때) ~하는 중이었다". 다른 일이 끼어들 때 주로 쓴다.
긴 동작(진행) + 짧은 사건(과거): when / while`, `I was sleeping when you called.
While I was cooking, the phone rang.`);
  N('시제', '미래: will vs be going to', `will: 말하는 순간 결정, 약속, 제안, 예측
be going to (gonna): 이미 계획한 일, 눈앞의 근거가 있는 예측
현재진행: 시간·장소까지 정해진 약속`, `I'll get it! (전화 오자마자 결정)
I'm going to visit my parents this weekend. (계획)
Look at the clouds. It's going to rain.`);
  N('시제', '시간·조건 부사절은 미래라도 현재형', `when, after, before, until, as soon as, if 로 시작하는 "시간·조건" 부분은 미래 일이라도 현재 시제를 쓴다.`, `I'll call you when I get home. (× will get)
If it rains tomorrow, we'll stay home.`);
  N('시제', '현재완료 = have/has + p.p.', `과거에 일어난 일이 "지금"과 연결될 때.
① 경험: ~해 본 적 있다 (ever, never, before, once)
② 완료: 막/벌써 ~했다 (just, already, yet)
③ 계속: ~해 오고 있다 (for, since, How long)
④ 결과: ~해 버려서 지금 …하다`, `I have been to Japan twice.
She has just finished.
I've lived here for 3 years.
I've lost my key. (그래서 지금 없다)`);
  N('시제', '현재완료 vs 과거: 시점이 분명하면 과거', `yesterday, last week, ago, when, in 2020 처럼 끝난 시점을 콕 집으면 현재완료를 못 쓴다.
When ~? 질문도 과거로.`, `I saw him yesterday. (× have seen)
I have seen him before. (시점 없음 → 현재완료)
When did you arrive? (× have you arrived)`);
  N('시제', 'for vs since', `for + 기간: for 2 hours, for 3 years
since + 시작 시점: since Monday, since 2020, since I was a kid`, `I've known her for 10 years.
I've known her since 2016.`);
  N('시제', 'have been to vs have gone to', `have been to: 가 본 적 있다 (지금은 돌아옴)
have gone to: 가 버렸다 (지금 거기 있음)`, `I've been to Paris.
She's gone to Paris. (그래서 지금 여기 없다)`);
  N('시제', '현재완료진행 = have been + 동사ing', `과거부터 지금까지 계속 하고 있는 동작 (강조).`, `I've been waiting for an hour!
It's been raining all day.`);
  N('시제', '과거완료 = had + p.p.', `과거의 어떤 시점보다 "더 이전"에 일어난 일 (대과거).`, `When I arrived, the movie had already started.
I realized I had left my phone at home.`);
  N('시제', 'used to + 동사원형 (예전엔 ~했었다)', `지금은 안 하는 과거의 습관·상태.
be used to + 명사/동사ing 는 "~에 익숙하다"로 완전히 다른 뜻.`, `I used to smoke. (지금은 안 피움)
I'm used to waking up early. (일찍 일어나는 게 익숙하다)`);

  // ===== 동사 변화 =====
  N('동사 변화', '규칙동사 -ed 붙이는 법', `대부분 + ed: work → worked
e로 끝나면 + d: live → lived
자음 + y → ied: study → studied (모음 + y는 + ed: play → played)
단모음 + 단자음 1음절은 자음 하나 더: stop → stopped, plan → planned`, `I studied hard.
We stopped talking.`);
  N('동사 변화', '동사의 3가지 모양: 원형 – 과거 – 과거분사(p.p.)', `원형: 조동사·to 뒤, do/does/did 뒤
과거형: 과거 시제
과거분사(p.p.): 완료(have + p.p.), 수동태(be + p.p.), 형용사처럼`, `go – went – gone
I go / I went / I have gone`);
  N('동사 변화', '불규칙 동사 ① A-A-A형 (모양이 다 같음)', `cut – cut – cut / put – put – put / set – set – set / hit – hit – hit
let – let – let / shut – shut – shut / cost – cost – cost / hurt – hurt – hurt
quit – quit – quit / read – read[레드] – read[레드] / spread / bet`, `I read the book yesterday. (발음만 [레드])`);
  N('동사 변화', '불규칙 동사 ② A-B-B형 (과거=과거분사)', `buy – bought / bring – brought / think – thought / teach – taught / catch – caught / fight – fought
make – made / say – said / pay – paid / lay – laid
have – had / hear – heard / find – found / feel – felt / keep – kept / leave – left / lose – lost / mean – meant / meet – met / send – sent / spend – spent / sleep – slept / tell – told / sell – sold / stand – stood / understand – understood / sit – sat / build – built / lend – lent / win – won / hold – held / get – got (미국 p.p. gotten)`, `I bought a new phone.
Have you heard the news?`);
  N('동사 변화', '불규칙 동사 ③ A-B-C형 (셋 다 다름)', `be – was/were – been / do – did – done / go – went – gone / see – saw – seen
eat – ate – eaten / give – gave – given / take – took – taken / write – wrote – written
speak – spoke – spoken / break – broke – broken / choose – chose – chosen / forget – forgot – forgotten
drive – drove – driven / ride – rode – ridden / rise – rose – risen / know – knew – known
grow – grew – grown / throw – threw – thrown / fly – flew – flown / draw – drew – drawn
wear – wore – worn / steal – stole – stolen / wake – woke – woken / hide – hid – hidden
begin – began – begun / drink – drank – drunk / sing – sang – sung / swim – swam – swum / ring – rang – rung
fall – fell – fallen / show – showed – shown / lie(눕다) – lay – lain`, `I've never eaten Thai food.
She has written three books.`);
  N('동사 변화', '불규칙 동사 ④ A-B-A형', `come – came – come / become – became – become / run – ran – run`, `He has become a manager.`);
  N('동사 변화', '헷갈리는 동사 쌍: lie / lay, rise / raise', `lie – lay – lain (눕다, 목적어 X) / lie – lied – lied (거짓말하다)
lay – laid – laid (~을 놓다, 목적어 O)
rise – rose – risen (오르다, 목적어 X) / raise – raised – raised (~을 올리다)`, `I lay on the bed. (누웠다)
She laid the baby on the bed. (눕혔다)
Raise your hand.`);

  // ===== 조동사 =====
  N('조동사', '조동사 + 동사원형 (규칙 3가지)', `① 뒤에는 항상 동사원형
② 3인칭이어도 -s 안 붙음
③ 부정은 조동사 + not, 의문은 조동사를 앞으로
× She cans swim / × She can swims → ○ She can swim`, `Can you help me?
You shouldn't do that.`);
  N('조동사', 'can / could', `can: 능력(할 수 있다), 허락(해도 된다), 부탁
could: can의 과거, 더 공손한 부탁, 가능성(~일 수도 있다)
be able to: 능력 (다른 조동사·완료와 같이 쓸 때: will be able to)`, `I can speak Korean.
Could you open the window?
I'll be able to finish it tomorrow.`);
  N('조동사', 'may / might', `may: 허락(공손), 추측(~일지도 모른다)
might: 더 약한 추측`, `May I come in?
It might rain this afternoon.`);
  N('조동사', 'will / would', `will: 미래, 의지, 부탁
would: will의 과거, 공손한 부탁·제안, 가정(~할 텐데)
Would you like ~? = ~하시겠어요? / I'd like ~ = ~하고 싶어요(want의 공손형)`, `Will you marry me?
Would you like some coffee?
I'd like to order.`);
  N('조동사', 'should / ought to / had better', `should: ~하는 게 좋겠다 (충고, 가장 흔함)
ought to: should와 비슷, 조금 딱딱함
had better: ~하는 게 좋을 거야 (안 하면 문제 생김, 경고 느낌) → You'd better ~`, `You should see a doctor.
You'd better hurry, or you'll miss the bus.`);
  N('조동사', 'must vs have to', `둘 다 "~해야 한다". must: 말하는 사람의 판단·강한 의무 / have to: 규칙·상황 때문에
과거는 둘 다 had to
부정은 뜻이 다르다: must not = ~하면 안 된다 (금지) / don't have to = ~할 필요 없다
must는 "~임에 틀림없다"(강한 추측)도 된다`, `You must not smoke here.
You don't have to come.
She must be tired.`);
  N('조동사', '추측의 강도', `must (틀림없이) > will > should > may > might/could (어쩌면) > can't (그럴 리 없다)`, `He must be at home. The lights are on.
That can't be true!`);
  N('조동사', '조동사 + have + p.p. (과거에 대한 추측·후회)', `should have p.p.: ~했어야 했는데 (안 했다, 후회)
must have p.p.: ~했음에 틀림없다
might/may have p.p.: ~했을지도 모른다
can't have p.p.: ~했을 리 없다
could have p.p.: ~할 수도 있었는데`, `I should have studied harder.
She must have forgotten.
You could have told me!`);
  N('조동사', 'Shall I ~? / Shall we ~?', `Shall I ~? = 제가 ~할까요? (제안)
Shall we ~? = 우리 ~할까요? (= Let's ~)`, `Shall I open the window?
Shall we dance?`);
  N('조동사', 'would rather (차라리 ~하겠다)', `would rather A (than B) = (B보다) 차라리 A 하겠다. 뒤에 동사원형.`, `I'd rather stay home tonight.
I'd rather walk than take a taxi.`);
})();
