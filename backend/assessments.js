// PHQ-9, GAD-7, PSS-10 and WHO-5 are standard published screening scales. Screening only, not a diagnosis.
const opt = (v, en, hi) => ({ v, en, hi });

const FREQ = [opt(0, 'Not at all', 'Bilkul nahi'), opt(1, 'Several days', 'Kuch din'),
  opt(2, 'More than half the days', 'Aadhe se zyada din'), opt(3, 'Nearly every day', 'Lagbhag roz')];
const PSS = [opt(0, 'Never', 'Kabhi nahi'), opt(1, 'Almost never', 'Lagbhag kabhi nahi'), opt(2, 'Sometimes', 'Kabhi-kabhi'),
  opt(3, 'Fairly often', 'Kaafi baar'), opt(4, 'Very often', 'Bahut baar')];
const WHO = [opt(5, 'All of the time', 'Hamesha'), opt(4, 'Most of the time', 'Zyadatar time'),
  opt(3, 'More than half of the time', 'Aadhe se zyada time'), opt(2, 'Less than half of the time', 'Aadhe se kam time'),
  opt(1, 'Some of the time', 'Kabhi-kabhi'), opt(0, 'At no time', 'Kabhi nahi')];

const HELPLINES = [
  { name: 'Tele-MANAS (24x7, free)', number: '14416' },
  { name: 'KIRAN Mental Health Helpline', number: '1800-599-0019' },
];

const ASSESSMENTS = {
  phq9: {
    title: 'PHQ-9 Mood check',
    about: { en: 'Low mood, energy and interest over the last 2 weeks.', hi: 'Pichle 2 hafte ka mood, energy aur interest.' },
    intro: { en: 'Over the last 2 weeks, how often have you been bothered by this?', hi: 'Pichle 2 hafte me, ye cheez kitni baar pareshan karti rahi?' },
    opts: FREQ, max: 3,
    q: {
      en: ['Little interest or pleasure in doing things', 'Feeling down, depressed or hopeless',
        'Trouble falling or staying asleep, or sleeping too much', 'Feeling tired or having little energy',
        'Poor appetite or overeating', 'Feeling bad about yourself, or that you are a failure or have let yourself or your family down',
        'Trouble concentrating on things like reading or watching TV',
        'Moving or speaking so slowly that others noticed, or being so restless that you moved around a lot more than usual',
        'Thoughts that you would be better off dead, or of hurting yourself in some way'],
      hi: ['Kisi kaam me interest ya maza kam aana', 'Udaas, nirash ya hopeless feel karna',
        'Neend aane ya neend bani rehne me dikkat, ya bahut zyada sona', 'Thakaan ya energy ki kami',
        'Bhookh kam lagna ya zyada khana', 'Apne baare me bura lagna, ya lagna ki tum fail ho gaye ho ya family ko niraash kiya hai',
        'Padhne ya TV dekhne jaise kaamon me concentration ki dikkat',
        'Itna dheere chalna/bolna ki dusre notice kare, ya itna bechain rehna ki idhar-udhar ghoomte rehna',
        'Ye sochna ki mar jaana behtar hoga, ya khud ko nuksaan pahunchane ke khayal'],
    },
    bands: [{ max: 4, label: 'Minimal', tier: 0 }, { max: 9, label: 'Mild', tier: 1 }, { max: 14, label: 'Moderate', tier: 2 },
      { max: 19, label: 'Moderately severe', tier: 3 }, { max: 27, label: 'Severe', tier: 4 }],
    safetyItem: 8, // question 9 (self-harm)
  },
  gad7: {
    title: 'GAD-7 Anxiety check',
    about: { en: 'Worry, nervousness and restlessness.', hi: 'Worry, nervousness aur bechaini.' },
    intro: { en: 'Over the last 2 weeks, how often have you been bothered by this?', hi: 'Pichle 2 hafte me, ye cheez kitni baar pareshan karti rahi?' },
    opts: FREQ, max: 3,
    q: {
      en: ['Feeling nervous, anxious or on edge', 'Not being able to stop or control worrying', 'Worrying too much about different things',
        'Trouble relaxing', 'Being so restless that it is hard to sit still', 'Becoming easily annoyed or irritable',
        'Feeling afraid, as if something awful might happen'],
      hi: ['Nervous, anxious ya on edge feel karna', 'Chinta ko rok ya control na paana', 'Alag-alag cheezon ke baare me zyada worry karna',
        'Relax karne me dikkat', 'Itna restless rehna ki ek jagah baithna mushkil ho', 'Jaldi chidh jaana ya irritable hona',
        'Dar lagna jaise kuch bura hone wala ho'],
    },
    bands: [{ max: 4, label: 'Minimal', tier: 0 }, { max: 9, label: 'Mild', tier: 1 }, { max: 14, label: 'Moderate', tier: 2 }, { max: 21, label: 'Severe', tier: 4 }],
  },
  pss10: {
    title: 'PSS-10 Stress check',
    about: { en: 'How stressful life has felt over the last month.', hi: 'Pichle 1 mahine me life kitni stressful lagi.' },
    intro: { en: 'In the last month, how often have you...', hi: 'Pichle 1 mahine me, kitni baar tumne...' },
    opts: PSS, max: 4, rev: [3, 4, 6, 7], // positively worded items are reverse scored
    q: {
      en: ['Been upset because of something that happened unexpectedly?', 'Felt unable to control the important things in your life?',
        'Felt nervous and stressed?', 'Felt confident about your ability to handle personal problems?', 'Felt that things were going your way?',
        'Found that you could not cope with all the things you had to do?', 'Been able to control irritations in your life?',
        'Felt that you were on top of things?', 'Been angered by things that were outside of your control?',
        'Felt difficulties were piling up so high that you could not overcome them?'],
      hi: ['Kisi achanak hui baat se upset hue?', 'Zindagi ki important cheezon par control nahi lag raha tha?', 'Nervous aur stressed feel kiya?',
        'Apni personal problems handle karne me confident feel kiya?', 'Laga ki cheezein tumhare hisaab se chal rahi hain?',
        'Laga ki jo kuch karna hai usse sambhal nahi paa rahe?', 'Zindagi ki chidh wali cheezon ko control kar paaye?',
        'Laga ki tum sab kuch sambhal rahe ho?', 'Un cheezon par gussa aaya jo tumhare control me nahi thi?',
        'Laga ki mushkilein itni badh gayi hain ki paar nahi ho rahi?'],
    },
    bands: [{ max: 13, label: 'Low stress', tier: 0 }, { max: 26, label: 'Moderate stress', tier: 2 }, { max: 40, label: 'High stress', tier: 3 }],
  },
  who5: {
    title: 'WHO-5 Wellbeing check',
    about: { en: 'A quick read on your overall wellbeing.', hi: 'Tumhare overall wellbeing ka ek quick check.' },
    intro: { en: 'Over the last 2 weeks...', hi: 'Pichle 2 hafte me, ye baatein tumhare liye kitni sach rahi?' },
    opts: WHO, max: 5, mult: 4, // raw 0-25 becomes 0-100; higher is better
    q: {
      en: ['I have felt cheerful and in good spirits', 'I have felt calm and relaxed', 'I have felt active and vigorous',
        'I woke up feeling fresh and rested', 'My daily life has been filled with things that interest me'],
      hi: ['Maine cheerful aur achhe mood me feel kiya', 'Maine calm aur relaxed feel kiya', 'Maine active aur energetic feel kiya',
        'Subah uthte hi fresh aur rested feel hua', 'Meri daily life interesting cheezon se bhari rahi'],
    },
    bands: [{ max: 28, label: 'Low wellbeing', tier: 3 }, { max: 50, label: 'Below average', tier: 2 }, { max: 72, label: 'Fair', tier: 1 }, { max: 100, label: 'Good', tier: 0 }],
  },
};

const MESSAGES = [
  { en: 'Things look fairly balanced. Keep up the routines that help you: sleep, movement and time with people you like.',
    hi: 'Sab kaafi balanced lag raha hai. Jo routines kaam kar rahi hain (neend, movement, apne logon ka saath) unhe banaye rakhna.' },
  { en: 'There may be a little load on your mind. Small steps like breaks, rest and talking to someone can really help.',
    hi: 'Thoda load chal raha lagta hai. Chhote steps jaise breaks, neend aur kisi se baat karna kaafi madad karte hain.' },
  { en: 'It seems a lot is going on right now. Talking to someone you trust or a counsellor could be a good next step.',
    hi: 'Lagta hai aajkal kaafi kuch chal raha hai. Kisi trusted insaan ya counsellor se baat karna achha next step ho sakta hai.' },
  { en: 'This looks heavy, and you are not alone in it. Speaking with a professional can make a real difference.',
    hi: 'Ye heavy lag raha hai, aur tum isme akele nahi ho. Kisi professional se baat karna sach me farq laa sakta hai.' },
  { en: 'This looks very heavy right now. Please reach out to a counsellor or doctor soon. Help is available.',
    hi: 'Ye abhi bahut heavy lag raha hai. Please jaldi kisi counsellor ya doctor se baat karo, madad available hai.' },
];

function scoreAssessment(type, answers) {
  const key = String(type).toLowerCase();
  const a = ASSESSMENTS[key];
  if (!a) return { error: 'Unknown assessment type' };
  const n = a.q.en.length;
  if (!Array.isArray(answers) || answers.length !== n) return { error: `Expected ${n} answers` };
  if (!answers.every((v) => Number.isInteger(v) && v >= 0 && v <= a.max)) return { error: `Each answer must be an integer 0-${a.max}` };

  const mult = a.mult || 1;
  const score = answers.reduce((s, v, i) => s + (a.rev && a.rev.includes(i) ? a.max - v : v), 0) * mult;
  const band = a.bands.find((b) => score <= b.max);
  const safety = a.safetyItem !== undefined && answers[a.safetyItem] > 0;

  return {
    type: key, score, maxScore: n * a.max * mult,
    severity: band.label.toLowerCase().replace(/ /g, '_'), label: band.label,
    load: band.tier / 4, // 0 = light, 1 = heavy (frontend uses it for colour and tips)
    message: MESSAGES[band.tier],
    safety, // frontend: show helplines BEFORE the result when true
    helplines: safety || band.tier >= 3 ? HELPLINES : [],
    answers,
  };
}

module.exports = { ASSESSMENTS, HELPLINES, scoreAssessment };
