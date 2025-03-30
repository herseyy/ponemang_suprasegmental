function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

let timer; // Global timer variable
let currentDiff = getCookie("selectedDiff");
let diff = getCookie("difficulty");
let remTime;
let remTime_5;
let currentIndex = 0;
let answered = false
let isPaused = false;
let sec = 0;
let qs = 0; 
let score = 0;
let lives = 3;

let isCorrect = document.getElementById("isCorrect")

if (currentDiff == "easy") {
	// 5qs, 30 secs
	sec = 30;
	qs = 5;
} else if (currentDiff == "medium") {
	// 10qs, 20 secs 
	sec = 20;
	qs = 10;
} else if (currentDiff == "hard") {
	// 15 qs, 15 secs
	sec = 15;
	qs = 15;
}

function shuffle(array) {
  var copy = [], n = array.length, i;
  while (n) {
    i = Math.floor(Math.random() * array.length);
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}


shuffledItem = shuffle(Array.from({length: qs}, (x, i) => i+1))

function startQuestion(index) {
    displayQuestion(shuffledItem[index])

    if (index >= qs || lives == 0) {
    	document.getElementById("finalScore").innerHTML = `Puntos: ${score}`;
    	document.getElementById("resume").style.display = "none";
    	document.getElementById("popup").style.display = "flex";
		document.getElementById("content").style.display = "none";

		if (diff == "easy" && score >= 3) {
			document.getElementById("result").innerHTML = "Medium Category is now unlocked."
			document.cookie = "difficulty=medium; path=/; SameSite=None; Secure";
		} else if (diff == "medium" && score >= 7) {
			document.getElementById("result").innerHTML = "Hard Category is now unlocked."
			document.cookie = "difficulty=hard; path=/; SameSite=None; Secure";
		} else if (diff == "hard" && score >= 12) {
			document.getElementById("result").innerHTML = "Pasado ka!"
		} else if (currentDiff == "easy" && score >= 3 || 
			currentDiff == "medium" && score >= 7 ||
			currentDiff == "hard" && score >= 12) {
			document.getElementById("result").innerHTML = "Pasado ka!"
		} else {
			document.getElementById("result").innerHTML = "Hindi ka pumasa. Pakiulit muli."
		}

    	return;
    }

    currentIndex = index;
    
    if (!isPaused) {
    	remTime = sec;
    	remTime_5 = sec + 5;
    }

    document.getElementById("status").innerHTML = `${currentDiff} | ${index + 1} / ${qs}` 

    clearInterval(timer);
    timer = setInterval(function () {
    	if (!isPaused) {
    		if (remTime >= 0) {
	        	document.getElementById("countdown").innerHTML = remTime;
    		}
	        remTime--;
	        remTime_5--;

	        if (remTime == -1) {
	        	document.getElementById(`life${lives}`).src = "./assets/extra/life-gray.png"
	        	isCorrect.src = "./assets/extra/incorrect.png"
	        	document.getElementById("card").style.transform = "rotateY(180deg)";
	        	lives--;
	        }

	        if (remTime_5 == 0 || answered) {
	            clearInterval(timer);
	            answered = false
	            setTimeout(() => startQuestion(index + 1), 1000); // Start next question after 1s
	        }
    	}
    }, 1000);
}

function onPause() {
	isPaused = true;
	clearInterval(timer);
	document.getElementById("finalScore").innerHTML = `Puntos: ${score}`;
	document.getElementById("popup").style.display = "flex";
	document.getElementById("content").style.display = "none";
}

function buttonClicked(id) {
	if (id == "resume") {
		isPaused = false;
		document.getElementById("popup").style.display = "none";
		document.getElementById("content").style.display = "flex";

		startCountdown();
	} else if (id == "retry") {
		location.reload()
	} else if (id == "menu"){
		location.href = "./menu.html"
	} else {
		location.href = "./index.html"
	}
}

function startCountdown() {
    clearInterval(timer);
    timer = setInterval(function () {
        if (!isPaused) {
            document.getElementById("countdown").innerHTML = remTime;
            remTime--;
	        remTime_5--;

	        if (remTime == -1) {
	        	document.getElementById(`life${lives}`).src = "./assets/extra/life-gray.png"
	        	isCorrect.src = "./assets/extra/incorrect.png"
	        	document.getElementById("card").style.transform = "rotateY(180deg)";
	        	lives--;
	        }

	        if (remTime_5 == 0 || answered) {
	            clearInterval(timer);
	            answered = false
	            setTimeout(() => startQuestion(currentIndex + 1), 1000); // Start next question after 1s
	        }
        }
    }, 1000);
}

async function hashText(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


async function checkAns(event) {
	answered = true
	document.getElementById("card").style.transform = "rotateY(180deg)";

	var src = event.src.split("/")
	let ans = await hashText(src[src.length - 1])
	let ques = await hashText(`${currentDiff}${shuffledItem[currentIndex]}.png`)

	let data = await fetch("./data.json")
		.then((response) => response.json())
		.then((data) => {
			return data[currentDiff]
		})
  		.catch((error) => console.error("Error loading JSON file", error));

	if (data[ques]['correct'] == ans) {
		score++;
		document.getElementById("score").innerHTML = `Puntos: ${score}`;
		isCorrect.src = "./assets/extra/correct.png"
	} else {
		document.getElementById(`life${lives}`).src = "./assets/extra/life-gray.png"
		isCorrect.src = "./assets/extra/incorrect.png"
		lives--;
	}
}

function displayQuestion(index) {
	let path = `./assets/${currentDiff}/${currentDiff}${index}`
	let options = [`${path}_a.png`, `${path}_b.png`];

	if (Math.random() < 0.5) {
	    [options[0], options[1]] = [options[1], options[0]];
	}

	document.getElementById("card").style.transform = "rotateY(0deg)";
	document.getElementById('question').src = path + ".png";
	document.getElementById('optionAImg').src = options[0];
	document.getElementById('optionBImg').src = options[1];
}

startQuestion(0);