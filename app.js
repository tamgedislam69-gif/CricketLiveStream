// ডাটা সেভ করার বেসিক ফাংশন (Local Storage)
function saveLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ডাটা লোড করার বেসিক ফাংশন
function getLocalData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

console.log("App Initialization: Local Storage Ready");
// app.js
import { db } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

window.updateScore = function(score) {
    set(ref(db, 'score'), {
        value: score
    });
    alert("স্কোর আপডেট হয়েছে: " + score);
};
