// Time and date settings
function startTime() {
  var currentDate = new Date();
  var hr = parseInt(currentDate.getHours());
  var min = parseInt(currentDate.getMinutes());
  //Add a zero in front of numbers<10
  if (min < 10) {
    min = "0" + min;
  }
  document.getElementById("header-time").innerHTML = hr + ":" + min;

  var dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }

  var date = currentDate.toLocaleDateString("en-GB", dateOptions);
  document.getElementById("header-date").innerHTML = date;

  var time = setTimeout(function(){ startTime() }, 60000);
}

// Time Greeting & Local storage

const greeting = document.getElementById("greeting");
const userNameDisplay = document.getElementById("userNameDisplay");
const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const saveBtn = document.getElementById("saveName");

// Utility
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 16) return "Good Afternoon";
  if (hour >= 16 && hour < 22) return "Good Evening";
  return "Good Night";
}

function updateGreeting(name) {
  greeting.textContent = getGreeting();
  userNameDisplay.textContent = name;
}

// Open modal with 'n' key (only if not typing in input)
document.addEventListener("keydown", (e) => {
  if (e.key === "n" && e.altKey && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    nameModal.style.display = "block";
    nameInput.value = localStorage.getItem("userName") || "";
    nameInput.focus();
  } else if (e.key === "Escape") {
    nameModal.style.display = "none";
  }
});

// Save name
function saveName() {
  const name = nameInput.value.trim();
  if (name) {
    localStorage.setItem("userName", name);
    updateGreeting(name);
    nameModal.style.display = "none";
  }
}

saveBtn.addEventListener("click", saveName);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveName();
});

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  const name = localStorage.getItem("userName") || "Lalit";
  updateGreeting(name);
});

//////////////////////////////////////////////////////////////////////
document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('#link')) return;
	// Otherwise, run your code...
	document.body.style.opacity = 0;

}, false);

// SEARCH

const $s = {
  qS: e => document.querySelector(e),
  qA: e => document.querySelectorAll(e)
};

// You can add your own search query here for anything you're interested in.
// [command character]: ['search url', 'title']
function engines () {
  return {
	g: ['https://google.com/search?q=', 'Google'],
	i: ['https://google.com/search?tbm=isch&q=', 'Google Images'],
	yt: ['https://youtube.com/results?search_query=', 'Youtube'],
	s: ['https://stackoverflow.com/search?q=', 'Stackoverflow'],
	a: ['https://web.archive.org/web/*/', 'Archive'],
	w: ['https://en.wikipedia.org/w/index.php?search=', 'Wikipedia'],
  };
}

var search  = $s.qS('#search'),
    input   = $s.qS('#search input[type="text"]'),
    engines = engines();

for (var key in engines)
  $s.qS('.search-engines').innerHTML += `<li><p title="${engines[key][1]}">!${key}</p></li>`;

document.onkeypress = (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey || e.key === "Shift") return;
      search.classList.add('active');

    input.focus();
    input.scrollIntoView();

    search.onkeyup = (e) => {
      let args   = e.target.value.split(' '),
          prefix = args[0],
          engine = engines['g'][0], // the default engine (google in this case)
          str    = 0;

      $s.qA('.search-engines li p').forEach((eng) => {
        let current = eng.parentNode;

        (prefix == eng.innerHTML)
          ? current.classList.add('active')
          : current.classList.remove('active');
      });

      if (e.key == 'Enter') {
        if (prefix.indexOf('!') == 0)
          (engine = engines[prefix.substr(1)][0], str = prefix.length + 1);

        window.location = engine + args.join(' ').substr(str).toString().replace(/\s+/m, '%20');
      } else if (e.keyCode == 27)
        search.classList.remove('active');
    };
};

document.getElementById("container").addEventListener("DOMContentLoaded", startTime());
const colorPool = [
  '#00ff00', // Green
  '#ff9900', // Orange
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
  '#ffff00',  // Yellow
  

];

function setRandomSecondaryColorFromPool() {
  const randomIndex = Math.floor(Math.random() * colorPool.length);
  const selectedColor = colorPool[randomIndex];
  document.documentElement.style.setProperty('--color-secondary', selectedColor);
}
setRandomSecondaryColorFromPool();


//weather
const apiKey = "d606f06be9084a54aae83132250805";
const lat = 21.252825;
const lon = 82.52234;

// Map weather condition to .lottie animation URLs
function getLottieUrl(condition, isDay) {
  condition = condition.toLowerCase();

  if (condition.includes("clear") || condition.includes("sunny")) {
    if (isDay) {
      return "https://lottie.host/3a3591d9-7a32-48a8-b6b2-4594e05198f4/nJt4G9Ap1H.lottie"; // sunny
    } else {
      return "https://lottie.host/14ebb297-0430-4fa9-8a66-0c5129d36534/U4CL8gQeqV.lottie"; // clear night (e.g., moon)
    }
  }

  if (condition.includes("cloud"))
    return "https://lottie.host/8b2b111c-efd7-4de1-97ee-5094f76a85b5/XHqw2XRhza.lottie"; // cloudy

  if (condition.includes("rain") || condition.includes("drizzle"))
    return "https://lottie.host/267447d2-e5de-407e-80fb-225b824c62a8/rYngnDeQ9y.lottie"; // rain

  if (condition.includes("thunder"))
    return "https://lottie.host/9f3ae213-d0d2-407a-be19-a8162c4ae838/cfr49dNBbi.lottie"; // thunderstorm

  if (condition.includes("windy"))
    return "https://lottie.host/c2bb8730-0505-447e-9d2e-2547a0146f09/PPFQUyYZaF.lottie"; // windy

  return null; // fallback
}

async function getWeather() {
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
  );
  const data = await res.json();

  const conditionText = data.current.condition.text;
  const temp = data.current.temp_c;

  const lottieUrl = getLottieUrl(conditionText, data.current.is_day);
  const animationEl = document.getElementById("weather-animation");
  animationEl.innerHTML = ""; // Clear previous animation

  if (lottieUrl) {
    const player = document.createElement("dotlottie-player");
    player.setAttribute("src", lottieUrl);
    player.setAttribute("autoplay", true);
    player.setAttribute("loop", true);
    player.style.width = "150px";
    player.style.height = "150px";
    animationEl.appendChild(player);
  }

  document.getElementById("weather-text").innerText = `Jhalap ${temp}°C`;
  document.getElementById("weather-second").innerText = conditionText;
}

getWeather();
setInterval(getWeather, 60000);

// Fun lottie 

  const randomLotties = [
    "https://lottie.host/d120c23e-1772-4a6e-a522-b506ff751382/9dWhoUR1Jx.lottie",
    "https://lottie.host/5dfc5dd5-e93c-42f8-99ea-475898acc791/HYTKUon9Ok.lottie",
    "https://lottie.host/9c5e87cc-7c00-4f76-8eaa-5ab1c3665961/Tl8qRGZxVl.lottie",
    "https://lottie.host/1c4011af-b557-40c2-a4b7-99f6e5befd39/HHhm20fvht.lottie",
    "https://lottie.host/e86da7b1-946e-4e80-aae2-3dd73ed6f20f/LnrU1OEqdF.lottie",
    "https://lottie.host/21a60dd3-edcd-4d33-9ea9-7c22d51bc8d0/vnumt2gsG4.lottie"


  ];

  function showRandomWidget() {
    const randomSrc = randomLotties[Math.floor(Math.random() * randomLotties.length)];
    const widgetContainer = document.getElementById("fun-widget");

    widgetContainer.innerHTML = `
      <dotlottie-player
        src="${randomSrc}"
        background="transparent"
        speed="1"
        style="width: 225px; height: 225px"
        loop
        autoplay
      ></dotlottie-player>
    `;
  }

  showRandomWidget(); 
  setInterval(showRandomWidget, 30000);

 // 📜 On This Day in History
 async function loadHistory() {
  try {
    const res = await fetch("https://history.muffinlabs.com/date");
    const data = await res.json();
    const event = data.data.Events[0];
    document.getElementById("tile-history").innerText =
      `📜 ${event.year} — ${event.text}`;
  } catch {
    document.getElementById("tile-history").innerText = "Could not load history.";
  }
}

let sessionStart = Date.now(); // Timestamp when this tab opened

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

setInterval(() => {
  const now = Date.now();
  const diff = now - sessionStart;
  document.getElementById("timer").innerText = formatTime(diff);
}, 1000);


// 😂 Random Joke
async function loadJoke() {
  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await res.json();
    document.getElementById("tile-joke").innerText = `😂 ${data.setup} — ${data.punchline}`;
  } catch {
    document.getElementById("tile-joke").innerText = "Could not load joke.";
  }
}

loadHistory();
loadJoke();