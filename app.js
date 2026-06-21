/* ========= UI text ========= */
const I18N = {
  en: { 
    next: "Next", 
    prev: "Previous", 
    submit: "Submit", 
    please: "Please answer all questions", 
    fill: "Please fill all details" 
  }
};
let LANG = "en";

/* ========= Modules (full set) ========= */
const MODULES = {
  phq9:{
    title:"Mood / Depression (PHQ-9)",
    scale:["0 = Not at all","1 = Several days","2 = More than half the days","3 = Nearly every day"],
    questions:[
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
    interpret:s=> s>=10?"⚠ Possible depression":"✅ Low risk"
  },
  gad7:{
    title:"Anxiety (GAD-7)",
    scale:["0 = Not at all","1 = Several days","2 = More than half the days","3 = Nearly every day"],
    questions:[
      "Feeling nervous, anxious, or on edge?",
      "Not being able to stop/control worrying?",
      "Worrying too much about different things?",
      "Trouble relaxing?",
      "Being so restless it's hard to sit still?",
      "Becoming easily annoyed/irritable?",
      "Feeling afraid something awful might happen?"
    ],
    interpret:s=> s>=10?"⚠ Possible anxiety disorder":"✅ Low anxiety"
  },
  stress:{
    title:"Stress & Burnout",
    scale:["0 = Never","1 = Sometimes","2 = Often","3 = Always"],
    questions:[
      "Overwhelmed by workload/studies?",
      "Emotionally drained at end of day?",
      "Difficult to balance work/study & personal life?",
      "Procrastinate because of stress?",
      "Lost motivation/interest in work/studies?"
    ],
    interpret:s=> s>=10?"⚠ High stress risk":"✅ Manageable stress"
  },
  who5:{
    title:"Wellbeing (WHO-5)",
    scale:["0 = At no time","1 = Some of the time","2 = Less than half","3 = More than half","4 = Most of the time","5 = All of the time"],
    questions:[
      "Felt cheerful & good spirits?",
      "Felt calm & relaxed?",
      "Felt active & vigorous?",
      "Woke up fresh & rested?",
      "Daily life full of interest?"
    ],
    interpret:s=> s<13?"⚠ Poor wellbeing":"✅ Good wellbeing"
  },
  bpd:{
    title:"Borderline Personality Disorder Screening",
    scale:["0 = No","1 = Yes"],
    questions:[
      "Intense mood swings?",
      "Fear abandonment?",
      "Unstable relationships?",
      "Often feel empty?",
      "Self-harm thoughts/acts?",
      "Impulsive behaviours?",
      "Uncontrollable anger?",
      "Identity disturbance?"
    ],
    interpret:s=> s>=5?"⚠ Possible BPD":"✅ Low traits"
  },
  dpd:{
    title:"Dependent Personality Disorder",
    scale:["0 = No","1 = Yes"],
    questions:[
      "Unable to decide without help?",
      "Avoid responsibility?",
      "Fear being left alone?",
      "Helpless when alone?",
      "Go to great lengths for support?",
      "Put others’ needs above own?"
    ],
    interpret:s=> s>=4?"⚠ Possible DPD":"✅ Low traits"
  },
  bipolar:{
    title:"Bipolar Disorder (MDQ-inspired)",
    scale:["0 = No","1 = Yes"],
    questions:[
      "4+ days unusually energetic/less sleep?",
      "Talked more / thoughts racing?",
      "Risky behaviors?",
      "Functional impairment?"
    ],
    interpret:s=> s>=3?"⚠ Possible Bipolar":"✅ Low traits"
  },
  ptsd:{
    title:"PTSD Screening",
    scale:["0 = No","1 = Yes"],
    questions:[
      "Experienced traumatic event?",
      "Flashbacks/unwanted memories?",
      "Avoid reminders?",
      "Easily startled/on edge?",
      "Emotionally numb/detached?"
    ],
    interpret:s=> s>=3?"⚠ Possible PTSD":"✅ Low traits"
  },
  ocd:{
    title:"OCD Screening",
    scale:["0 = No","1 = Yes"],
    questions:[
      "Unwanted thoughts (contamination, harm, etc.)?",
      "Compelled to do rituals?",
      "Rituals >1hr/day or interfere?"
    ],
    interpret:s=> s>=1?"⚠ Possible OCD":"✅ Low traits"
  },
  dropout:{
    title:"Academic Dropout Risk",
    scale:["0 = Never","1 = Rarely","2 = Sometimes","3 = Often"],
    questions:[
      "Attend classes regularly?",
      "Difficult to concentrate?",
      "Failed multiple subjects?",
      "Confident to complete degree?",
      "Motivated in chosen field?",
      "Clear career goals?",
      "Financial difficulties?",
      "Consider leaving due to finances?",
      "Connected to peers/teachers?",
      "Often isolated?",
      "Participate in extracurriculars?",
      "Overwhelmed by stress?",
      "Poor time management?",
      "Thought of dropping out?",
      "Have support system?"
    ],
    interpret:s=>{
      if(s>=21) return "⚠ High dropout risk";
      if(s>=11) return "⚠ Moderate risk";
      return "✅ Low risk";
    }
  }
};

/* ========= State ========= */
let currentKey=null,current=null,answers=[],qIndex=0;

/* ========= Navigation ========= */
document.getElementById("btn-academic").onclick =
document.getElementById("btn-professional").onclick = () => {
  document.getElementById("landing").style.display = "none";
  document.getElementById("assessment").style.display = "block";
  show("details");
};

document.getElementById("to-categories").onclick = () => {
  const name=document.getElementById("name").value.trim();
  const age=document.getElementById("age").value.trim();
  const role=document.getElementById("role").value.trim();
  const org=document.getElementById("org").value.trim();
  if(!name || !age || !role || !org){
    alert(I18N[LANG].fill);
    return;
  }
  buildCategories();
  show("categories");
};

document.getElementById("restart").onclick = () => {
  document.getElementById("assessment").style.display = "none";
  document.getElementById("landing").style.display = "block";
};

/* ========= Step handling ========= */
function show(step){
  ["details","categories","quiz","result"].forEach(s=>{
    document.getElementById("step-"+s).style.display = (s===step?"block":"none");
  });
}

/* ========= Categories ========= */
function buildCategories(){
  const host=document.getElementById("category-list");
  host.innerHTML="";
  Object.entries(MODULES).forEach(([key,mod])=>{
    const div=document.createElement("div");
    div.className="category-card";
    div.textContent=mod.title;
    div.onclick=()=>startQuiz(key);
    host.appendChild(div);
  });
}

/* ========= Quiz ========= */
function startQuiz(key){
  currentKey=key; 
  current=MODULES[key];
  answers=new Array(current.questions.length).fill(null);
  qIndex=0;

  document.getElementById("quiz-title").textContent=current.title;
  renderQuestion();
  show("quiz");
}

function renderQuestion(){
  const host=document.getElementById("quiz-questions");
  host.innerHTML="";

  const q=current.questions[qIndex];
  const card=document.createElement("div");
  card.className="card";
  card.innerHTML=`<h3>Q${qIndex+1}. ${q}</h3>`;

  current.scale.forEach((raw,idx)=>{
    const parts=raw.split("=");
    const score=parts[0].trim();
    const text=parts[1]?parts[1].trim():raw;

    const lbl=document.createElement("label");
    lbl.style.display="block";
    lbl.innerHTML=`<input type="radio" name="q${qIndex}" value="${idx}"> ${text} (${score})`;
    const input=lbl.querySelector("input");
    if(answers[qIndex]===idx) input.checked=true;
    input.onchange=()=>{ answers[qIndex]=idx; };
    card.appendChild(lbl);
  });

  host.appendChild(card);

  // Navigation buttons
  const nav=document.createElement("div");
  nav.style.marginTop="20px";

  if(qIndex>0){
    const prev=document.createElement("button");
    prev.textContent=I18N[LANG].prev;
    prev.className="btn";
    prev.onclick=()=>{ qIndex--; renderQuestion(); };
    nav.appendChild(prev);
  }

  if(qIndex < current.questions.length-1){
    const next=document.createElement("button");
    next.textContent=I18N[LANG].next;
    next.className="btn";
    next.style.marginLeft="10px";
    next.onclick=()=>{
      if(answers[qIndex]===null){ alert(I18N[LANG].please); return; }
      qIndex++; 
      renderQuestion(); 
    };
    nav.appendChild(next);
  } else {
    const submit=document.createElement("button");
    submit.textContent=I18N[LANG].submit;
    submit.className="btn";
    submit.style.marginLeft="10px";
    submit.onclick=()=>{
      if(answers.includes(null)){ alert(I18N[LANG].please); return; }
      computeResult();
    };
    nav.appendChild(submit);
  }

  host.appendChild(nav);
}

/* ========= Result ========= */
function computeResult(){
  const total=answers.reduce((a,b)=>a+(b??0),0);
  const risk=current.interpret(total);

  let html=`<p><strong>Score:</strong> ${total}</p>`;
  html+=`<p><strong>Risk:</strong> ${risk}</p>`;
  html+=`<h3>Your Answers:</h3>`;
  current.questions.forEach((q,i)=>{
    const val=answers[i];
    const raw=current.scale[val]||"-";
    const parts=raw.split("=");
    const label=parts[1]?parts[1].trim():raw;
    html+=`<p><strong>Q${i+1}.</strong> ${q}<br><em>${label}</em></p>`;
  });

  document.getElementById("result-text").innerHTML=html;
  show("result");
}
