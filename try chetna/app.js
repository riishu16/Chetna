// app.js — full working code
// Language default
let LANG = "en";

// App state
let currentUser = null;
let currentCategoryKey = null;
let currentAnswers = []; // array of selected indices for current quiz

/* ========== MODULES (all categories + 3 languages) ========== */
const MODULES = {
  phq9: {
    title: { en: "Mood / Depression (PHQ-9)", hi: "मूड / अवसाद (PHQ-9)", hinglish: "Mood / Depression (PHQ-9)" },
    scale: {
      en: ["0 = Not at all","1 = Several days","2 = More than half the days","3 = Nearly every day"],
      hi: ["0 = बिल्कुल नहीं","1 = कुछ दिन","2 = आधे से ज़्यादा दिन","3 = लगभग रोज़"],
      hinglish: ["0 = Bilkul nahi","1 = Kuch din","2 = Adhe se jyada din","3 = Rozana"]
    },
    questions: {
      en: [
        "Little interest or pleasure in doing things?",
        "Feeling down, depressed, or hopeless?",
        "Trouble falling/staying asleep, or sleeping too much?",
        "Feeling tired or having little energy?",
        "Poor appetite or overeating?",
        "Feeling bad about yourself / failure?",
        "Trouble concentrating (studies, work, reading)?",
        "Moving or speaking slowly / restless?",
        "Thoughts of being better off dead or self-harm?"
      ],
      hi: [
        "काम करने में रुचि या आनंद की कमी?",
        "उदास, निराश या हताश महसूस करना?",
        "नींद आने/बनी रहने में दिक्कत या बहुत ज्यादा सोना?",
        "थकान या ऊर्जा की कमी महसूस करना?",
        "भूख कम या ज़्यादा खाना?",
        "अपने बारे में बुरा सोचना / असफलता महसूस करना?",
        "ध्यान केंद्रित करने में कठिनाई?",
        "धीरे चलना/बोलना या बेचैनी?",
        "मरने या आत्म-हानि के विचार?"
      ],
      hinglish: [
        "Kuch karne ka interest/pleasure kam hai?",
        "Udasi, depressed ya hopeless feel karte ho?",
        "Sone me dikkat ya bahut zyada sona?",
        "Thakan ya low energy feel karte ho?",
        "Bhook kam ya zyada khana?",
        "Apne baare me bura mehsoos karna?",
        "Concentrate karne me problem?",
        "Dheere bolna/chalna ya restless feel karna?",
        "Marne ya self-harm thoughts?"
      ]
    },
    interpret: s => s >= 10 ? "🛑 Possible depression" : "✅ Low risk"
  },

  gad7: {
    title: { en: "Anxiety (GAD-7)", hi: "चिंता (GAD-7)", hinglish: "Anxiety (GAD-7)" },
    scale: {
      en: ["0 = Not at all","1 = Several days","2 = More than half the days","3 = Nearly every day"],
      hi: ["0 = बिल्कुल नहीं","1 = कुछ दिन","2 = आधे से ज़्यादा दिन","3 = लगभग रोज़"],
      hinglish: ["0 = Bilkul nahi","1 = Kuch din","2 = Adhe se jyada din","3 = Rozana"]
    },
    questions: {
      en: [
        "Feeling nervous, anxious, or on edge?",
        "Not being able to stop/control worrying?",
        "Worrying too much about different things?",
        "Trouble relaxing?",
        "Being so restless it's hard to sit still?",
        "Becoming easily annoyed/irritable?",
        "Feeling afraid something awful might happen?"
      ],
      hi: [
        "घबराहट, चिंता या बेचैनी महसूस करना?",
        "चिंता को रोक/नियंत्रित न कर पाना?",
        "बहुत सारी चीज़ों की ज़्यादा चिंता करना?",
        "आराम करने में कठिनाई?",
        "इतना बेचैन होना कि बैठना मुश्किल?",
        "आसानी से चिढ़ जाना?",
        "कुछ बुरा होने का डर?"
      ],
      hinglish: [
        "Nervous/anxious feel karte ho?",
        "Worry ko control nahi kar paate?",
        "Bahut cheezon ki zyada fikr karte ho?",
        "Relax karne me problem?",
        "Restless hone se baithna mushkil?",
        "Aasan se irritate ho jaate ho?",
        "Kuch bura hone ka darr lagta hai?"
      ]
    },
    interpret: s => s >= 10 ? "🛑 Possible anxiety disorder" : "✅ Low anxiety"
  },

  stress: {
    title: { en: "Stress & Burnout", hi: "तनाव और बर्नआउट", hinglish: "Stress & Burnout" },
    scale: {
      en: ["0 = Never","1 = Sometimes","2 = Often","3 = Always"],
      hi: ["0 = कभी नहीं","1 = कभी-कभी","2 = अक्सर","3 = हमेशा"],
      hinglish: ["0 = Kabhi nahi","1 = Kabhi-kabhi","2 = Aksar","3 = Hamesha"]
    },
    questions: {
      en: [
        "Overwhelmed by workload/studies?",
        "Emotionally drained at end of day?",
        "Difficult to balance work/study & personal life?",
        "Procrastinate because of stress?",
        "Lost motivation/interest in work/studies?"
      ],
      hi: [
        "कार्य/पढ़ाई के बोझ से अभिभूत महसूस करना?",
        "दिन के अंत में भावनात्मक रूप से थका हुआ महसूस करना?",
        "काम/पढ़ाई और निजी जीवन का संतुलन कठिन लगना?",
        "तनाव के कारण काम टालना?",
        "काम/पढ़ाई में प्रेरणा या रुचि खोना?"
      ],
      hinglish: [
        "Kaam/padhai ka load zyada lagta hai?",
        "Din ke end par emotionally drained feel karte ho?",
        "Work/study aur personal life balance karna mushkil lagta hai?",
        "Stress ki wajah se procrastinate karte ho?",
        "Motivation/interest lose ho gaya?"
      ]
    },
    interpret: s => s >= 10 ? "🛑 High stress risk" : "✅ Manageable stress"
  },

  who5: {
    title: { en: "Wellbeing (WHO-5)", hi: "कल्याण (WHO-5)", hinglish: "Wellbeing (WHO-5)" },
    scale: {
      en: ["0 = At no time","1 = Some of the time","2 = Less than half","3 = More than half","4 = Most of the time","5 = All of the time"],
      hi: ["0 = कभी नहीं","1 = कुछ समय","2 = आधे से कम","3 = आधे से ज़्यादा","4 = अधिकतर समय","5 = हमेशा"],
      hinglish: ["0 = Kabhi nahi","1 = Kuch time","2 = Adhe se kam","3 = Adhe se zyada","4 = Zyada tar time","5 = Hamesha"]
    },
    questions: {
      en: ["Felt cheerful & good spirits?","Felt calm & relaxed?","Felt active & vigorous?","Woke up fresh & rested?","Daily life full of interest?"],
      hi: ["प्रसन्न और अच्छे मनोभाव महसूस किए?","शांत और आरामदायक महसूस किया?","सक्रिय और ऊर्जावान महसूस किया?","सुबह तरोताजा और आराम से उठे?","दैनिक जीवन में रुचि महसूस की?"],
      hinglish: ["Cheerful aur good spirits me feel kiya?","Calm aur relaxed feel kiya?","Active aur energetic feel kiya?","Fresh uthna aur rested feel karna?","Daily life interesting lagta hai?"]
    },
    interpret: s => s < 13 ? "🛑 Poor wellbeing" : "✅ Good wellbeing"
  },

  bpd: {
    title: { en: "Borderline Personality Disorder Screening", hi: "बॉर्डरलाइन पर्सनालिटी डिसऑर्डर जांच", hinglish: "Borderline Personality Disorder Screening" },
    scale: { en: ["0 = No","1 = Yes"], hi: ["0 = नहीं","1 = हाँ"], hinglish: ["0 = Nahi","1 = Haan"] },
    questions: {
      en: ["Intense mood swings?","Fear abandonment?","Unstable relationships?","Often feel empty?","Self-harm thoughts/acts?","Impulsive behaviours?","Uncontrollable anger?","Identity disturbance?"],
      hi: ["तीव्र मूड बदलना?","परित्याग का भय?","अस्थिर संबंध?","अक्सर खालीपन महसूस करना?","आत्म-हानि के विचार/कर्म?","आवेगपूर्ण व्यवहार?","अनियंत्रित क्रोध?","पहचान में भ्रम?"],
      hinglish: ["Intense mood swings hote hain?","Abandonment ka darr lagta hai?","Relationships unstable rehte hain?","Aksar empty feel karte ho?","Self-harm thoughts/acts hote hain?","Impulsive behaviours karte ho?","Gussa control nahi hota?","Identity disturb rehti hai?"]
    },
    interpret: s => s >= 5 ? "🛑 Possible BPD" : "✅ Low traits"
  },

  dpd: {
    title: { en: "Dependent Personality Disorder", hi: "निर्भरता व्यक्तित्व विकार", hinglish: "Dependent Personality Disorder" },
    scale: { en: ["0 = No","1 = Yes"], hi: ["0 = नहीं","1 = हाँ"], hinglish: ["0 = Nahi","1 = Haan"] },
    questions: {
      en: ["Unable to decide without help?","Avoid responsibility?","Fear being left alone?","Helpless when alone?","Go to great lengths for support?","Put others’ needs above own?"],
      hi: ["बिना मदद के निर्णय लेने में असमर्थ?","जिम्मेदारी लेने से बचना?","अकेला छोड़ दिए जाने का डर?","अकेले होने पर असहाय महसूस करना?","सहायता के लिए बहुत प्रयास करना?","दूसरों की जरूरतें अपनी पर प्राथमिकता देना?"],
      hinglish: ["Bina help ke decision nahi le paate?","Responsibility avoid karte ho?","Akela chhod dene ka darr lagta hai?","Akela hone par helpless feel karte ho?","Support ke liye bahut efforts karte ho?","Dusro ki needs apni se upar rakhte ho?"]
    },
    interpret: s => s >= 4 ? "🛑 Possible DPD" : "✅ Low traits"
  },

  bipolar: {
    title: { en: "Bipolar Disorder (MDQ-inspired)", hi: "बाइपोलर डिसऑर्डर (MDQ-प्रेरित)", hinglish: "Bipolar Disorder (MDQ-inspired)" },
    scale: { en: ["0 = No","1 = Yes"], hi: ["0 = नहीं","1 = हाँ"], hinglish: ["0 = Nahi","1 = Haan"] },
    questions: {
      en: ["4+ days unusually energetic/less sleep?","Talked more / thoughts racing?","Risky behaviors?","Functional impairment?"],
      hi: ["4+ दिन असामान्य रूप से ऊर्जावान / कम नींद?","अधिक बोलना / विचार तेजी से चलना?","जोखिम भरे व्यवहार?","कार्यात्मक हानि?"],
      hinglish: ["4+ din unusually energetic/kam sleep?","Zyada bola / thoughts racing?","Risky behaviours kiye?","Functioning par impact?"]
    },
    interpret: s => s >= 3 ? "🛑 Possible Bipolar" : "✅ Low traits"
  },

  ptsd: {
    title: { en: "PTSD Screening", hi: "PTSD स्क्रीनिंग", hinglish: "PTSD Screening" },
    scale: { en: ["0 = No","1 = Yes"], hi: ["0 = नहीं","1 = हाँ"], hinglish: ["0 = Nahi","1 = Haan"] },
    questions: {
      en: ["Experienced traumatic event?","Flashbacks/unwanted memories?","Avoid reminders?","Easily startled/on edge?","Emotionally numb/detached?"],
      hi: ["आघातजन्य घटना का अनुभव?","फ़्लैशबैक/अनचाही यादें?","याद दिलाने वाली चीज़ों से बचना?","आसानी से चौंकना/बेचैन रहना?","भावनात्मक रूप से सुन्न/अलग महसूस करना?"],
      hinglish: ["Traumatic event experience kiya?","Flashbacks/unwanted memories aati hain?","Reminders se bachne ki koshish?","Easily startle ya on edge feel karte ho?","Emotionally numb/detached feel karte ho?"]
    },
    interpret: s => s >= 3 ? "🛑 Possible PTSD" : "✅ Low traits"
  },

  ocd: {
    title: { en: "OCD Screening", hi: "OCD स्क्रीनिंग", hinglish: "OCD Screening" },
    scale: { en: ["0 = No","1 = Yes"], hi: ["0 = नहीं","1 = हाँ"], hinglish: ["0 = Nahi","1 = Haan"] },
    questions: {
      en: ["Unwanted thoughts (contamination, harm, etc.)?","Compelled to do rituals?","Rituals >1hr/day or interfere?"],
      hi: ["अनचाहे विचार (संक्रमण, हानि आदि)?","अनुष्ठान करने के लिए बाध्य होना?","रिवाज़/अनुष्ठान रोज़ 1+ घंटे लेते हैं या बाधा डालते हैं?"],
      hinglish: ["Unwanted thoughts (contamination, harm etc.)?","Rituals karne ko majboor feel karte ho?","Rituals >1 hr/day ya kaam me interfere karte hain?"]
    },
    interpret: s => s >= 1 ? "🛑 Possible OCD" : "✅ Low traits"
  },

  dropout: {
    title: { en: "Academic Dropout Risk", hi: "शैक्षिक ड्रॉपआउट जोखिम", hinglish: "Academic Dropout Risk" },
    scale: {
      en: ["0 = Never","1 = Rarely","2 = Sometimes","3 = Often"],
      hi: ["0 = कभी नहीं","1 = शायद ही कभी","2 = कभी-कभी","3 = अक्सर"],
      hinglish: ["0 = Kabhi nahi","1 = Kabhi-kabhi","2 = Kabhi-kabhi","3 = Aksar"]
    },
    questions: {
      en: [
        "Attend classes regularly?","Difficult to concentrate?","Failed multiple subjects?","Confident to complete degree?","Motivated in chosen field?",
        "Clear career goals?","Financial difficulties?","Consider leaving due to finances?","Connected to peers/teachers?","Often isolated?",
        "Participate in extracurriculars?","Overwhelmed by stress?","Poor time management?","Thought of dropping out?","Have support system?"
      ],
      hi: [
        "कक्षाओं में नियमित उपस्थिति?","ध्यान केंद्रित करने में कठिनाई?","कई विषयों में असफलता?","डिग्री पूरी करने का विश्वास?","चुने हुए क्षेत्र में प्रेरित?",
        "स्पष्ट करियर लक्ष्य?","वित्तीय कठिनाइयाँ?","वित्तीय कारणों से छोड़ने पर विचार?","सहपाठी/शिक्षकों से जुड़ाव?","अक्सर अलग-थलग?",
        "पाठ्येतर गतिविधियों में भाग लेना?","तनाव से अभिभूत?","समय प्रबंधन कमजोर?","पढ़ाई छोड़ने का विचार?","सहायता प्रणाली है?"
      ],
      hinglish: [
        "Regularly classes attend karte ho?","Concentrate karne me dikkat?","Multiple subjects fail hue?","Degree complete karne ka confidence?","Field me motivated ho?",
        "Career goals clear hain?","Financial difficulties hain?","Finance ke wajah se chhodne ka socha?","Peers/teachers se connected ho?","Aksar isolated feel karte ho?",
        "Extracurriculars me participate karte ho?","Stress se overwhelmed ho?","Time management poor hai?","Dropout ka socha hai?","Support system hai?"
      ]
    },
    interpret: s => {
      if (s >= 21) return "🛑 High dropout risk";
      if (s >= 11) return "⚠ Moderate risk";
      return "✅ Low risk";
    }
  }
};

/* ========== Helpers: show/hide steps ========== */
function showStep(step) {
  // steps ids in HTML: step-details, step-quiz, step-result
  const steps = ["details", "quiz", "result"];
  steps.forEach(s => {
    const el = document.getElementById("step-" + s);
    if (!el) return;
    el.style.display = (s === step ? "block" : "none");
  });
  // scroll top for user convenience
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ========== Boot / init handlers ========== */
function initApp() {
  // Landing start buttons: btn-academic and btn-professional exist in HTML
  const btnAcademic = document.getElementById("btn-academic");
  const btnProfessional = document.getElementById("btn-professional");
  if (btnAcademic) btnAcademic.addEventListener("click", startAssessmentFromLanding);
  if (btnProfessional) btnProfessional.addEventListener("click", startAssessmentFromLanding);

  // Continue after details
  const toCategories = document.getElementById("to-categories");
  if (toCategories) toCategories.addEventListener("click", handleDetailsContinue);

  // Submit quiz
  const submitQuizBtn = document.getElementById("submit-quiz");
  if (submitQuizBtn) submitQuizBtn.addEventListener("click", handleSubmitQuiz);

  // Restart
  const restart = document.getElementById("restart");
  if (restart) restart.addEventListener("click", () => {
    // reset state and go back to landing
    currentUser = null;
    currentCategoryKey = null;
    currentAnswers = [];
    document.getElementById("assessment").style.display = "none";
    document.getElementById("landing").style.display = "block";
    showStep("details");
  });

  // Language switcher in HTML (#lang-switcher)
  const langSwitcher = document.getElementById("lang-switcher");
  if (langSwitcher) {
    langSwitcher.value = LANG;
    langSwitcher.addEventListener("change", (e) => {
      LANG = e.target.value || "en";
      // re-render current UI according to current step
      reRenderCurrentView();
    });
  }

  // On load, show landing section
  showInitialView();
}

function showInitialView() {
  const landing = document.getElementById("landing");
  const assessment = document.getElementById("assessment");
  if (landing) landing.style.display = "block";
  if (assessment) assessment.style.display = "none";
  // make details visible when assessment opens
  showStep("details");
}

/* ========== Start assessment from landing ========== */
function startAssessmentFromLanding() {
  const landing = document.getElementById("landing");
  const assessment = document.getElementById("assessment");
  if (landing) landing.style.display = "none";
  if (assessment) assessment.style.display = "block";
  // reset details
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("role").value = "Student";
  document.getElementById("org").value = "";
  showStep("details");
}

/* ========== After details → show categories list (within quiz panel) ========== */
function handleDetailsContinue() {
  const name = (document.getElementById("name") || {}).value || "";
  const age = (document.getElementById("age") || {}).value || "";
  const role = (document.getElementById("role") || {}).value || "";
  const org = (document.getElementById("org") || {}).value || "";

  if (!name.trim() || !age.trim() || !role.trim() || !org.trim()) {
    alert(LANG === "hi" ? "कृपया सभी विवरण भरें" : LANG === "hinglish" ? "Sab details bharo" : "Please fill all details");
    return;
  }

  currentUser = { name: name.trim(), age: age.trim(), role: role.trim(), org: org.trim() };
  // show category selection inside quiz area
  renderCategorySelection();
}

/* ========== Render categories (buttons) inside quiz area ========== */
function renderCategorySelection() {
  const quizTitle = document.getElementById("quiz-title");
  const quizQuestions = document.getElementById("quiz-questions");
  if (!quizTitle || !quizQuestions) return;

  quizTitle.textContent = LANG === "hi" ? "श्रेणी चुनें" : LANG === "hinglish" ? "Category chuno" : "Choose a category";
  let html = `<div class="category-list">`;
  Object.keys(MODULES).forEach(key => {
    const t = MODULES[key].title[LANG] || MODULES[key].title.en || key;
    html += `<div class="cat-item"><button class="btn choose-cat" data-key="${key}">${t}</button></div>`;
  });
  html += `</div>`;
  quizQuestions.innerHTML = html;

  // attach listeners to category buttons
  document.querySelectorAll(".choose-cat").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const key = e.currentTarget.dataset.key;
      startQuizForCategory(key);
    });
  });

  showStep("quiz");
}

/* ========== Start quiz for chosen category ========== */
function startQuizForCategory(categoryKey) {
  if (!MODULES[categoryKey]) {
    console.error("Unknown category:", categoryKey);
    return;
  }
  currentCategoryKey = categoryKey;
  currentAnswers = new Array(MODULES[categoryKey].questions[LANG].length).fill(null);

  renderCurrentQuizQuestionList();
}

/* Render all questions for current category */
function renderCurrentQuizQuestionList() {
  const module = MODULES[currentCategoryKey];
  const quizTitle = document.getElementById("quiz-title");
  const quizQuestions = document.getElementById("quiz-questions");
  if (!quizTitle || !quizQuestions || !module) return;

  quizTitle.textContent = module.title[LANG] || module.title.en;

  // Build markup: each question followed by radio options
  let html = `<div class="module-card">`;
  const qList = module.questions[LANG] || module.questions.en;
  const scaleList = module.scale[LANG] || module.scale.en;
  qList.forEach((qText, qIdx) => {
    html += `<div class="q-block"><p class="q-text"><strong>Q${qIdx+1}.</strong> ${qText}</p>`;
    html += `<div class="opts">`;
    scaleList.forEach((sLabel, sIdx) => {
      // Show label text after '=' if present for readability
      let label = sLabel;
      if (sLabel.includes("=")) label = sLabel.split("=").slice(1).join("=").trim();
      html += `<label class="opt-label"><input type="radio" name="q_${qIdx}" value="${sIdx}"> <span class="opt-text">${label}</span> <span class="opt-score">(${sIdx})</span></label>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;

  // Add a short submit area
  html += `<div style="margin-top:16px"><button class="btn" id="submitQuizBtnInline">` +
          (LANG === "hi" ? "सबमिट करें" : LANG === "hinglish" ? "Submit karo" : "Submit") +
          `</button> <button class="btn" id="backToCategories">` +
          (LANG === "hi" ? "श्रेणियाँ" : LANG === "hinglish" ? "Categories pe jao" : "Back to categories") +
          `</button></div>`;

  quizQuestions.innerHTML = html;

  // Add event listeners for inline submit and back
  const inlineBtn = document.getElementById("submitQuizBtnInline");
  if (inlineBtn) inlineBtn.addEventListener("click", handleSubmitQuiz);

  const backBtn = document.getElementById("backToCategories");
  if (backBtn) backBtn.addEventListener("click", renderCategorySelection);

  // Also add change listeners to radio inputs to update currentAnswers immediately
  quizQuestions.querySelectorAll("input[type=radio]").forEach(inp => {
    inp.addEventListener("change", (e) => {
      const name = e.target.name; // "q_0" etc.
      const qIndex = parseInt(name.split("_")[1], 10);
      const val = parseInt(e.target.value, 10);
      currentAnswers[qIndex] = val;
    });
  });

  showStep("quiz");
}

/* ========== Submission & result ========== */
function handleSubmitQuiz() {
  if (!currentCategoryKey) {
    alert(LANG === "hi" ? "कृपया पहले एक श्रेणी चुनें।" : LANG === "hinglish" ? "Pehle category choose karo" : "Please select a category first.");
    return;
  }
  const module = MODULES[currentCategoryKey];
  const qCount = (module.questions[LANG] || module.questions.en).length;
  // Ensure currentAnswers have values (replace null with 0 to be safe)
  let anyUnanswered = false;
  for (let i = 0; i < qCount; i++) {
    const radios = document.getElementsByName("q_" + i);
    let checked = null;
    for (let r of radios) if (r.checked) { checked = r; break; }
    if (checked) currentAnswers[i] = parseInt(checked.value, 10);
    if (currentAnswers[i] === null || currentAnswers[i] === undefined) anyUnanswered = true;
  }

  // If you want to force-all-answered, uncomment alert below
  // if (anyUnanswered) { alert("Please answer all questions"); return; }

  // compute total
  const total = currentAnswers.reduce((acc, v) => acc + (v ?? 0), 0);
  const scaleLen = (module.scale[LANG] || module.scale.en).length;
  const maxIndex = Math.max(0, scaleLen - 1);
  const maxScore = maxIndex * qCount;
  const percent = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
  const interpretation = module.interpret(total);

  // Build result card (show per-question answers)
  const resultHost = document.getElementById("result-text");
  resultHost.innerHTML = "";

  const heading = document.createElement("div");
  heading.innerHTML = `<h3>${module.title[LANG] || module.title.en}</h3>
    <p><strong>${currentUser ? currentUser.name : ""}</strong> ${currentUser ? `(${currentUser.age}, ${currentUser.role})` : ""}</p>
    <p><strong>Score:</strong> ${total} / ${maxScore} (${percent}%)</p>
    <p><strong>Interpretation:</strong> ${interpretation}</p>`;
  resultHost.appendChild(heading);

  // list answers
  const qList = module.questions[LANG] || module.questions.en;
  const scaleList = module.scale[LANG] || module.scale.en;
  const answersDiv = document.createElement("div");
  answersDiv.style.marginTop = "12px";
  qList.forEach((qText, i) => {
    const ansIdx = currentAnswers[i];
    let labelRaw = scaleList[ansIdx] || "";
    if (labelRaw.includes("=")) labelRaw = labelRaw.split("=").slice(1).join("=").trim();
    const p = document.createElement("p");
    p.innerHTML = `<strong>Q${i+1}.</strong> ${qText}<br><em>Answer:</em> ${labelRaw || "-"}`;
    answersDiv.appendChild(p);
  });
  resultHost.appendChild(answersDiv);

  // doctor message based on interpretation (contains 🛑 or ⚠)
  const needDoctor = String(interpretation).includes("🛑") || String(interpretation).includes("⚠");
  const sug = document.createElement("div");
  sug.style.marginTop = "14px";
  sug.style.padding = "12px";
  sug.style.borderRadius = "8px";
  sug.style.fontWeight = "700";
  if (needDoctor) {
    sug.style.background = "#fff2f2";
    sug.style.color = "#b91c1c";
    sug.textContent = LANG === "hi" ? "🛑 तुरंत डॉक्टर/मानसिक स्वास्थ्य विशेषज्ञ की मदद आवश्यक है" : LANG === "hinglish" ? "🛑 Turant doctor / mental health professional ki madad recommended" : "🛑 Immediate doctor/mental health professional help recommended";
  } else {
    sug.style.background = "#f2fff2";
    sug.style.color = "#064e3b";
    sug.textContent = LANG === "hi" ? "✅ फौरन डॉक्टर की ज़रूरत नहीं" : LANG === "hinglish" ? "✅ Turant doctor ki zaroorat nahi" : "✅ No urgent doctor help needed";
  }
  resultHost.appendChild(sug);

  // Show result step
  showStep("result");
}

/* Re-render current view when language changes or user navigates back */
function reRenderCurrentView() {
  // If landing visible — nothing to do
  const landing = document.getElementById("landing");
  const assessment = document.getElementById("assessment");
  // If assessment not visible, nothing else to re-render
  if (!assessment || assessment.style.display === "none") return;

  // find which step is visible
  const steps = ["details", "quiz", "result"];
  let visibleStep = null;
  for (let s of steps) {
    const el = document.getElementById("step-" + s);
    if (el && el.style.display !== "none") { visibleStep = s; break; }
  }

  if (visibleStep === "details") {
    // Nothing language-specific here
    return;
  } else if (visibleStep === "quiz") {
    if (!currentCategoryKey) {
      // re-render category selection with new language labels
      renderCategorySelection();
    } else {
      // re-render current quiz content in new language (keep answers if possible)
      // try to preserve previous answers by mapping names
      const prevAnswers = currentAnswers.slice();
      // rebuild radio inputs and re-check according to prevAnswers
      renderCurrentQuizQuestionList();
      // after rendering, try to restore checked values if present
      for (let i = 0; i < prevAnswers.length; i++) {
        const val = prevAnswers[i];
        if (val === null || val === undefined) continue;
        const radio = document.querySelector(`input[name="q_${i}"][value="${val}"]`);
        if (radio) radio.checked = true;
      }
    }
  } else if (visibleStep === "result") {
    // Recompute result display in current language if possible (just re-call handleSubmitQuiz result builder)
    // As we no longer have the selected inputs when on result, we can simply re-display stored result by re-calc
    // We'll attempt to recalc if currentAnswers present
    if (currentCategoryKey && currentAnswers.length) {
      // Re-run result building quickly:
      const module = MODULES[currentCategoryKey];
      if (!module) return;
      const total = currentAnswers.reduce((acc, v) => acc + (v ?? 0), 0);
      const qCount = (module.questions[LANG] || module.questions.en).length;
      const scaleLen = (module.scale[LANG] || module.scale.en).length;
      const maxIndex = Math.max(0, scaleLen - 1);
      const maxScore = maxIndex * qCount;
      const percent = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
      const interpretation = module.interpret(total);

      // rebuild result-text similar to handleSubmitQuiz
      const resultHost = document.getElementById("result-text");
      resultHost.innerHTML = "";
      const heading = document.createElement("div");
      heading.innerHTML = `<h3>${module.title[LANG] || module.title.en}</h3>
        <p><strong>${currentUser ? currentUser.name : ""}</strong> ${currentUser ? `(${currentUser.age}, ${currentUser.role})` : ""}</p>
        <p><strong>Score:</strong> ${total} / ${maxScore} (${percent}%)</p>
        <p><strong>Interpretation:</strong> ${interpretation}</p>`;
      resultHost.appendChild(heading);

      const qList = module.questions[LANG] || module.questions.en;
      const scaleList = module.scale[LANG] || module.scale.en;
      const answersDiv = document.createElement("div");
      answersDiv.style.marginTop = "12px";
      qList.forEach((qText, i) => {
        const ansIdx = currentAnswers[i];
        let labelRaw = scaleList[ansIdx] || "";
        if (labelRaw && labelRaw.includes("=")) labelRaw = labelRaw.split("=").slice(1).join("=").trim();
        const p = document.createElement("p");
        p.innerHTML = `<strong>Q${i+1}.</strong> ${qText}<br><em>Answer:</em> ${labelRaw || "-"}`;
        answersDiv.appendChild(p);
      });
      resultHost.appendChild(answersDiv);

      const needDoctor = String(interpretation).includes("🛑") || String(interpretation).includes("⚠");
      const sug = document.createElement("div");
      sug.style.marginTop = "14px";
      sug.style.padding = "12px";
      sug.style.borderRadius = "8px";
      sug.style.fontWeight = "700";
      if (needDoctor) {
        sug.style.background = "#fff2f2"; sug.style.color = "#b91c1c";
        sug.textContent = LANG === "hi" ? "🛑 तुरंत डॉक्टर/मानसिक स्वास्थ्य विशेषज्ञ की मदद आवश्यक है" : LANG === "hinglish" ? "🛑 Turant doctor / mental health professional ki madad recommended" : "🛑 Immediate doctor/mental health professional help recommended";
      } else {
        sug.style.background = "#f2fff2"; sug.style.color = "#064e3b";
        sug.textContent = LANG === "hi" ? "✅ फौरन डॉक्टर की ज़रूरत नहीं" : LANG === "hinglish" ? "✅ Turant doctor ki zaroorat nahi" : "✅ No urgent doctor help needed";
      }
      resultHost.appendChild(sug);
    }
  }
}

/* initialize on DOM ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
