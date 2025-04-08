function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        let [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

let currentDiff = getCookie("difficulty");

if (!currentDiff || currentDiff == "easy") {
	document.cookie = "difficulty=easy; path=/; SameSite=None; Secure";
	document.getElementById("medium").src = "./assets/extra/medium_locked.png"
	document.getElementById("hard").src = "./assets/extra/hard_locked.png"

	document.getElementById("medium").parentElement.style.backgroundImage = 'url("./assets/extra/medium_bg.png")';
	document.getElementById("medium").parentElement.style.backgroundColor = 'rgba(0, 0, 0, .8)';

	document.getElementById("hard").parentElement.style.backgroundImage = 'url("./assets/extra/hard_bg.png")';
	document.getElementById("hard").parentElement.style.backgroundColor = 'rgba(0, 0, 0, .8)';
} else if (currentDiff == "medium") {
	document.getElementById("medium").src = "./assets/extra/medium.png"
	document.getElementById("hard").src = "./assets/extra/hard_locked.png"

	document.getElementById("medium").parentElement.style.backgroundImage = 'url("./assets/extra/medium_bg.png")';
	document.getElementById("medium").parentElement.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

	document.getElementById("hard").parentElement.style.backgroundImage = 'url("./assets/extra/hard_bg.png")';
	document.getElementById("hard").parentElement.style.backgroundColor = 'rgba(0, 0, 0, .8)';
} else {
	document.getElementById("medium").src = "./assets/extra/medium.png"
	document.getElementById("hard").src = "./assets/extra/hard.png"

	document.getElementById("medium").parentElement.style.backgroundImage = 'url("./assets/extra/medium_bg.png")';
	document.getElementById("medium").parentElement.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

	document.getElementById("hard").parentElement.style.backgroundImage = 'url("./assets/extra/hard_bg.png")';
	document.getElementById("hard").parentElement.style.backgroundColor = 'rgba(0, 0, 0, .4)';
}

function navigateDifficulty(id) {
	console.log(id);
	if (id == "easy" || 
		(id == "medium" && currentDiff != "easy") || 
		id == "hard" && currentDiff == "hard"
		) {
			document.cookie = `selectedDiff=${id}; path=/; SameSite=None; Secure`;
			location.href = "./quiz.html"
	}
}

function homePage() {
	location.href = "./index.html"
}
