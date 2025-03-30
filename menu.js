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
} else if (currentDiff == "medium") {
	document.getElementById("medium").src = "./assets/extra/medium.png"
	document.getElementById("hard").src = "./assets/extra/hard_locked.png"
} else {
	document.getElementById("medium").src = "./assets/extra/medium.png"
	document.getElementById("hard").src = "./assets/extra/hard.png"
}

function navigateDifficulty(id) {
	console.log(id);
	if (id == "easy" || 
		(id == "medium" && currentDiff != "easy") || 
		id == "hard" && ['easy', 'medium', 'hard'].includes(currentDiff)
		) {
			document.cookie = `selectedDiff=${id}; path=/; SameSite=None; Secure`;
			location.href = "./quiz.html"
	}
}
