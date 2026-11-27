'use strict';
// 영어 기초 노트 ③ — 부정·의문, 명령·감탄·제안, 수동태, to부정사, 동명사, 분사, 관계사, 가정법, 화법
(function () {
  const N = (cat, title, body, ex) => window.GRAMMAR_BASE.push({ cat, title, body, ex: ex || '' });

  // ===== 부정·의문 =====
  N('부정·의문', '부정문 만드는 법 정리', `be동사: be + not (I'm not, isn't, wasn't)
일반동사: don't / doesn't / didn't + 동사원형
조동사: 조동사 + not (can't, won't, shouldn't)
완료: haven't / hasn't / hadn't + p.p.`, `She isn't here. / I don't know. / I can't swim. / I haven't eaten yet.`);
  N('부정·의문', '의문문 만드는 법 정리', `be동사: Be + 주어 ~? (Are you ready?)
일반동사: Do/Does/Did + 주어 + 동사원형 ~?
조동사: 조동사 + 주어 + 동사원형 ~? (Can you swim?)
완료: Have/Has + 주어 + p.p. ~? (Have you eaten?)`, `Is it far? / Did you see that? / Will you come? / Have you been there?`);
  N('부정·의문', '의문사 의문문', `who 누가 / whom 누구를 / whose 누구의 / what 무엇 / which 어느 것
when 언제 / where 어디서 / why 왜 / how 어떻게
how many / how much / how long / how often / how old / how far
순서: 의문사 + 의문문 (의문사 + do/be/조동사 + 주어 …)`, `Where do you live?
How often do you exercise?
What time is it?`);
  N('부정·의문', '의문사가 주어일 때는 do를 쓰지 않는다', `Who / What 이 "누가 / 무엇이"(주어)이면 평서문 순서 그대로.`, `Who called you? (× Who did call you)
What happened? (× What did happen)
Who did you call? (누구를 → do 필요)`);
  N('부정·의문', 'Yes / No 대답은 내용 기준', `영어는 질문 모양과 상관없이 "내 대답 내용"이 긍정이면 Yes, 부정이면 No.
부정 의문문에서 한국어와 반대가 되니 주의.`, `Don't you like coffee? – No, I don't. (응, 안 좋아해)
– Yes, I do. (아니, 좋아해)`);
  N('부정·의문', '부가의문문 (~지?, 그렇지?)', `앞이 긍정 → 뒤는 부정, 앞이 부정 → 뒤는 긍정. 동사 종류(be/do/조동사)와 주어(대명사)를 맞춘다.
I am ~, aren't I? / Let's ~, shall we? / 명령문, will you?`, `You're tired, aren't you?
She didn't call, did she?
Let's go, shall we?`);
  N('부정·의문', '간접의문문: 문장 속 질문은 평서문 순서', `Do you know / Can you tell me / I wonder + 의문사 + 주어 + 동사
의문사가 없으면 if / whether`, `Do you know where the station is? (× where is the station)
I wonder if she's okay.`);
  N('부정·의문', '선택의문문 (A or B?)', `Yes/No가 아니라 둘 중 하나로 대답한다.`, `Do you want coffee or tea? – Tea, please.`);
  N('부정·의문', '부분부정 / 전체부정', `not all / not always / not every = 모두 ~인 것은 아니다 (부분)
none / no / never / neither = 전혀 ~아니다 (전체)`, `Not all students like math.
None of them came.`);

  // ===== 명령·감탄·제안 =====
  N('명령·감탄·제안', '명령문: 동사원형으로 시작', `주어 없이 동사원형으로 시작. please를 붙이면 부드러워진다.
부정 명령: Don't + 동사원형 / Never + 동사원형
be동사 명령: Be ~ / Don't be ~`, `Sit down, please.
Don't touch it.
Be careful! / Don't be late.`);
  N('명령·감탄·제안', 'Let\'s ~ (같이 ~하자)', `Let's + 동사원형 / 부정은 Let's not + 동사원형
Let me ~ = 내가 ~할게 (허락 구하기)`, `Let's eat out tonight.
Let's not argue.
Let me help you.`);
  N('명령·감탄·제안', '감탄문: What a ~! / How ~!', `What + (a/an) + 형용사 + 명사 (+ 주어 + 동사)!
How + 형용사/부사 (+ 주어 + 동사)!
회화에서는 So ~! / Such a ~! 도 많이 쓴다.`, `What a beautiful day!
How cute!
It's so cold! / She's such a nice person.`);
  N('명령·감탄·제안', '명령문 + and / or', `명령문, and ~ : ~해라, 그러면 …
명령문, or ~ : ~해라, 그렇지 않으면 …`, `Hurry up, and you'll catch the bus.
Hurry up, or you'll miss the bus.`);

  // ===== 수동태 =====
  N('수동태', '수동태 = be + p.p. (~되다, ~당하다)', `행동한 사람보다 "당한 대상"이 중요할 때. 행동한 사람은 by ~ (모르거나 중요하지 않으면 생략).`, `This house was built in 1990.
My bike was stolen.
The book was written by Han Kang.`);
  N('수동태', '시제별 수동태', `현재: is/are + p.p. / 과거: was/were + p.p.
미래: will be + p.p. / 조동사: can be + p.p.
진행: is being + p.p. / 완료: has been + p.p.`, `English is spoken here.
It will be done tomorrow.
The road is being repaired.
The package has been delivered.`);
  N('수동태', 'by 대신 다른 전치사를 쓰는 수동태', `be interested in / be surprised at / be satisfied with / be filled with
be covered with / be known to(~에게 알려지다) / be made of(재료 그대로) / be made from(재료 변함)
be worried about / be married to / be tired of(싫증나다)`, `I'm interested in photography.
This table is made of wood.`);
  N('수동태', 'get + p.p. (구어체 수동태)', `회화에서 "~되다, ~하게 되다" 변화·사건을 말할 때 자주 쓴다.`, `I got fired. / They got married last year. / Don't get lost.`);
  N('수동태', '수동태로 못 쓰는 동사', `목적어가 없는 동사(happen, arrive, die, seem, disappear)는 수동태가 안 된다.`, `The accident happened at night. (× was happened)`);

  // ===== to부정사 =====
  N('to부정사', 'to부정사 = to + 동사원형, 쓰임 3가지', `① 명사처럼 "~하는 것" (주어·목적어·보어)
② 형용사처럼 "~할" (명사 뒤에서 꾸밈)
③ 부사처럼 "~하기 위해, ~해서" (목적·감정의 원인·결과)`, `To learn English is fun. / I want to learn English.
I have something to tell you.
I came here to study. / I'm glad to see you.`);
  N('to부정사', 'to부정사만 목적어로 쓰는 동사', `want, hope, wish, plan, decide, expect, promise, agree, refuse, need, learn, choose, afford, manage, offer, pretend, seem
→ 앞으로 할 일(미래) 느낌의 동사들`, `I decided to quit.
She promised to come.`);
  N('to부정사', '동사 + 목적어 + to부정사', `want / ask / tell / advise / allow / expect / encourage / remind / would like + 사람 + to 동사원형`, `I want you to be happy.
The doctor told me to rest.`);
  N('to부정사', '의문사 + to부정사', `what to do / how to do / where to go / when to start / which to choose`, `I don't know what to say.
Can you show me how to use this?`);
  N('to부정사', 'too ~ to / enough to', `too + 형용사 + to 동사 = 너무 ~해서 …할 수 없다
형용사 + enough + to 동사 = …할 만큼 충분히 ~하다 (enough는 형용사 뒤)`, `It's too hot to eat.
She's old enough to drive.`);
  N('to부정사', 'It ~ for 사람 to … (의미상 주어)', `to부정사의 행동을 하는 사람을 for + 사람으로 앞에 쓴다.
사람 성격을 말하는 형용사(kind, nice, smart, rude)는 of + 사람`, `It's hard for me to wake up early.
It's very kind of you to help me.`);
  N('to부정사', 'in order to / so as to (~하기 위해서)', `목적을 분명히 할 때. 부정은 in order not to / so as not to`, `I left early in order to catch the train.`);

  // ===== 동명사 =====
  N('동명사', '동명사 = 동사ing (~하는 것)', `동사에 -ing를 붙여 명사처럼 쓴다. 주어·목적어·보어·전치사 뒤.
전치사 뒤에는 to부정사가 아니라 동명사.`, `Swimming is good exercise.
I'm good at cooking. (× at cook)
Thank you for coming.`);
  N('동명사', '동명사만 목적어로 쓰는 동사', `enjoy, finish, mind, avoid, keep, quit, give up, practice, suggest, consider, imagine, miss, deny, put off, can't help
→ 이미 하고 있거나 한 일 느낌의 동사들`, `I enjoy watching movies.
Do you mind opening the window?
I can't help laughing.`);
  N('동명사', '둘 다 되는데 뜻이 바뀌는 동사', `remember / forget + to 동사: (앞으로) ~할 것을 / + ing: (과거에) ~한 것을
stop + ing: ~하는 걸 멈추다 / stop + to 동사: ~하려고 멈추다
try + to 동사: ~하려고 애쓰다 / try + ing: 시험 삼아 ~해 보다
regret + to: ~하게 되어 유감이다 / + ing: ~한 걸 후회하다`, `Remember to lock the door.
I remember meeting her.
I stopped smoking. / I stopped to smoke.`);
  N('동명사', '둘 다 되고 뜻도 거의 같은 동사', `like, love, hate, start, begin, continue, prefer`, `I like to swim. = I like swimming.
It started to rain. = It started raining.`);
  N('동명사', 'to 뒤에 ing가 오는 표현 (to가 전치사)', `look forward to ~ing (~을 기대하다) / be used to ~ing (~에 익숙하다)
object to ~ing / when it comes to ~ing (~에 관해서라면) / what do you say to ~ing`, `I'm looking forward to seeing you.
I'm used to living alone.`);
  N('동명사', '자주 쓰는 동명사 표현', `go ~ing: go shopping, go swimming, go hiking
be busy ~ing: ~하느라 바쁘다
spend 시간/돈 (on) ~ing: ~하는 데 쓰다
feel like ~ing: ~하고 싶다
How about ~ing? / It's no use ~ing: ~해도 소용없다
have trouble/difficulty ~ing: ~하는 데 어려움을 겪다`, `I'm busy working.
I spent all day cleaning.
I don't feel like going out.`);

  // ===== 분사 =====
  N('분사', '현재분사(-ing) vs 과거분사(p.p.)', `현재분사(-ing): "~하는, ~하고 있는" (능동·진행)
과거분사(p.p.): "~된, ~당한" (수동·완료)
명사 앞이나 뒤에서 형용사처럼 꾸민다 (뒤에 다른 말이 붙으면 명사 뒤).`, `a sleeping baby / a broken window
the man standing over there / a car made in Korea`);
  N('분사', '감정 형용사: boring vs bored', `-ing: 감정을 "일으키는" 것 (사물·상황, 그 사람이 남을 그렇게 만들 때)
-ed: 감정을 "느끼는" 사람
boring/bored, interesting/interested, exciting/excited, tiring/tired, surprising/surprised, confusing/confused, disappointing/disappointed, embarrassing/embarrassed, satisfying/satisfied, shocking/shocked`, `The movie was boring. → I was bored.
I'm so excited! (× exciting)
He's boring. (그는 지루한 사람이다)`);
  N('분사', '지각동사 + 목적어 + 동사원형 / -ing', `see, watch, hear, feel, notice + 목적어 + 동사원형(처음부터 끝까지) / -ing(하고 있는 중)`, `I saw him cross the street.
I heard someone singing.`);
  N('분사', '사역동사 make / let / have / get', `make + 목적어 + 동사원형: (억지로) ~하게 만들다
let + 목적어 + 동사원형: ~하게 허락하다
have + 목적어 + 동사원형: ~하게 시키다 / have + 물건 + p.p.: ~되게 하다(남에게 맡김)
get + 목적어 + to 동사원형 / get + 물건 + p.p.
help + 목적어 + (to) 동사원형`, `My boss made me work late.
Let me know.
I had my hair cut. (미용실에서 잘랐다)
She helped me (to) move.`);
  N('분사', '분사구문 기초', `접속사 + 주어를 지우고 동사를 -ing로 바꿔 짧게 쓴 것 (주로 글에서).
Being은 보통 생략.`, `Walking down the street, I met Tom. (= While I was walking …)
Tired, I went to bed early. (= Because I was tired …)`);

  // ===== 관계사 =====
  N('관계사', '관계대명사: 명사를 문장으로 꾸미기', `사람 → who (that) / 사물·동물 → which (that) / 소유 → whose
꾸밈을 받는 명사 바로 뒤에 온다.`, `I have a friend who lives in London.
This is the book which I bought yesterday.
I met a girl whose father is a pilot.`);
  N('관계사', '목적격 관계대명사는 생략 가능', `관계대명사 뒤에 주어 + 동사가 바로 오면(목적격) 빼도 된다. 회화에서는 거의 뺀다.`, `The movie (that) we watched was great.
Is this the bag (which) you wanted?`);
  N('관계사', 'that을 쓰는 경우 / 못 쓰는 경우', `that은 who/which 대신 쓸 수 있다.
꼭 that: 최상급·서수·all·every·the only·the same + 명사 뒤
that 불가: 쉼표 뒤(계속적 용법), 전치사 바로 뒤`, `He is the best player that I know.
This is my house, which I bought last year. (× , that)`);
  N('관계사', 'what = the thing(s) which (~하는 것)', `what은 앞에 명사 없이 "~하는 것" 전체를 뜻한다.`, `What I want is a long vacation.
I can't believe what you said.`);
  N('관계사', '관계부사 where / when / why / how', `장소 + where / 시간 + when / reason + why / how (the way와 같이 쓰지 않음)`, `This is the cafe where we first met.
I remember the day when you were born.
That's why I'm late. / This is how I did it.`);
  N('관계사', '쉼표 + which (계속적 용법)', `앞 문장 전체나 명사에 대해 덧붙여 설명. "그런데 그것은 ~".`, `He passed the exam, which surprised everyone.`);

  // ===== 가정법·조건문 =====
  N('가정법·조건문', '0형 조건문: 항상 그런 사실', `If + 현재, 현재 (If = When 느낌)`, `If you heat ice, it melts.`);
  N('가정법·조건문', '1형 조건문: 실제로 일어날 수 있는 미래', `If + 현재, will + 동사원형 (if절에 will 쓰지 않음)`, `If it rains tomorrow, I'll stay home.
If you need help, let me know.`);
  N('가정법·조건문', '2형 (가정법 과거): 현재 사실과 반대', `If + 과거, would/could + 동사원형 → "(지금) ~라면 …할 텐데"
be동사는 주어와 상관없이 were가 원칙 (회화에선 was도 씀)`, `If I were you, I would take the job.
If I had money, I could buy it. (지금 돈이 없다)`);
  N('가정법·조건문', '3형 (가정법 과거완료): 과거 사실과 반대', `If + had p.p., would/could have p.p. → "(그때) ~였다면 …했을 텐데"`, `If I had studied harder, I would have passed.
If you had told me, I could have helped.`);
  N('가정법·조건문', 'I wish / If only / as if', `I wish + 과거: (지금) ~라면 좋을 텐데
I wish + had p.p.: (그때) ~였다면 좋았을 텐데
as if + 과거: 마치 ~인 것처럼`, `I wish I were taller.
I wish I had known.
He talks as if he knew everything.`);
  N('가정법·조건문', 'unless = if not', `unless 뒤에는 not을 또 쓰지 않는다.`, `Unless you hurry, you'll be late. (= If you don't hurry …)`);

  // ===== 화법·시제 일치 =====
  N('화법·시제 일치', '직접화법 → 간접화법', `남의 말을 옮길 때: said (that) + 주어 + 동사. 시점에 맞게 인칭·시제·시간 표현을 바꾼다.
now → then, today → that day, tomorrow → the next day, here → there`, `She said, "I'm tired." → She said (that) she was tired.
He said, "I'll call you." → He said he would call me.`);
  N('화법·시제 일치', 'say vs tell (옮겨 말하기)', `say (that) ~ / say to 사람
tell + 사람 + (that) ~ (tell 뒤에는 바로 사람)
tell + 사람 + to 동사: ~하라고 말하다 / ask + 사람 + to 동사: ~해 달라고 부탁하다`, `He told me (that) he was busy. (× told that)
She asked me to wait.`);
  N('화법·시제 일치', '시제 일치의 예외', `지금도 사실인 것, 진리, 습관은 과거로 안 바꿔도 된다.`, `He said the earth is round.
She told me she lives in Busan. (지금도 산다)`);
})();
