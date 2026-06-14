import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// বাটন থেকে স্কোর আপডেট
window.updateScore = function(score) {
    set(ref(db, 'score'), { value: score });
};

// ডিসপ্লেতে স্কোর শো করা
const scoreDisplay = document.getElementById("score-display");
if (scoreDisplay) {
    onValue(ref(db, 'score'), (snapshot) => {
        const data = snapshot.val();
        scoreDisplay.innerText = "স্কোর: " + (data ? data.value : "0");
    });
}
