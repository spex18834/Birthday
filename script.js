function $(id){ return document.getElementById(id); }
function pad(n){ return String(n).padStart(2,"0"); }

function loadPersonData(){
  $("personPhoto").src = birthdayData.photoPath;
  $("headline").textContent = `Happyyy Birthdayyy, ${birthdayData.name}!`;
  $("subtext").textContent = `Oh, such a special day🤌`;

  $("messageTitle").textContent = birthdayData.messageTitle;
  $("messageBody").textContent = birthdayData.messageBody;

  const ul = $("notesList");
  ul.innerHTML = "";
  birthdayData.additionalNotes.forEach(note=>{
    const li = document.createElement("li");
    li.textContent = note;
    ul.appendChild(li);
  });
}

function getTargetDate(){
  const [y, m, d] = birthdayData.date.split("-").map(Number);

  // Create midnight in the TARGET timezone (Philippines)
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: birthdayData.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  // Get "now" in that timezone
  const parts = formatter.formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;

  const nowInTZ = new Date(
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`
  );

  // Target birthday midnight in same timezone
  return new Date(`${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}T00:00:00`);
}


let timerInterval = null;
let birthdayTriggered = false;

function updateCountdown(){
  const target = getTargetDate();
  const now = new Date();
  const diff = target - now;

  if(diff <= 0){
  $("countdownLabel").textContent = "It’s their birthday 🎉";
  $("days").textContent = "0";
  $("hours").textContent = "0";
  $("minutes").textContent = "0";
  $("seconds").textContent = "0";

  
  const btn = $("extraNoteBtn");
  btn.disabled = false;
  btn.textContent = "Additional note 💌";

 
  $("noteLockText").textContent = "Unlocked 🎉 You can open it now";

  if(!birthdayTriggered){
    birthdayTriggered = true;
    clearInterval(timerInterval);
    playBirthdayConfetti();
  }
  return;
}


  const totalSeconds = Math.floor(diff/1000);
  const days = Math.floor(totalSeconds / (24*3600));
  const hours = Math.floor((totalSeconds % (24*3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $("days").textContent = String(days);
  $("hours").textContent = pad(hours);
  $("minutes").textContent = pad(minutes);
  $("seconds").textContent = pad(seconds);

  $("countdownLabel").textContent = `Until ${birthdayData.date} 12:00 AM`;
}

function startCountdown(){
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
}


const confettiColors = [
  "#ff0008ff", "#ffbb00ff", "#9dff00ff",
  "#009dffff", "#6c0eefff", "#ff00b7ff",
  "#00ccffff"
];

function launchConfetti(count = 80){
  for(let i=0;i<count;i++){
    const piece = document.createElement("div");
    piece.className = "confetti";

    piece.style.left = (Math.random()*100) + "vw";
    piece.style.animationDuration = (Math.random()*1.5 + 1.5) + "s";

    const size = Math.random()*8 + 6;
    piece.style.width = size + "px";
    piece.style.height = (size*0.6) + "px";

    piece.style.background =
      confettiColors[Math.floor(Math.random()*confettiColors.length)];

    document.body.appendChild(piece);
    setTimeout(()=>piece.remove(), 3500);
  }
}

function playBirthdayConfetti(){
  let bursts = 0;

  const interval = setInterval(()=>{
    launchConfetti(120);
    bursts++;

    if(bursts >= 10){
      clearInterval(interval);
    }
  }, 2000);
}


(function addConfettiStyles(){
  const style = document.createElement("style");
  style.textContent = `
    .confetti{
      position: fixed;
      top: -10px;
      border-radius: 2px;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall linear;
    }
    @keyframes confettiFall{
      0%{ transform: translateY(0) rotate(0deg); opacity: 1; }
      100%{ transform: translateY(110vh) rotate(720deg); opacity: 0.9; }
    }
  `;
  document.head.appendChild(style);
})();

function revealExtraNote(){
  $("extraNoteText").textContent = birthdayData.extraNote;
  $("extraNote").classList.remove("hidden");
  $("extraNoteBtn").disabled = true;
  $("extraNoteBtn").textContent = "Note unlocked ✅";
}

loadPersonData();
startCountdown();

let confettiCoolingDown = false;

$("confettiBtn").addEventListener("click", () => {
  if (confettiCoolingDown) return;

  confettiCoolingDown = true;

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      launchConfetti(90);
    }, i * 400);
  }

  setTimeout(() => {
    confettiCoolingDown = false;
  }, 2000);
});

$("extraNoteBtn").addEventListener("click", revealExtraNote);
