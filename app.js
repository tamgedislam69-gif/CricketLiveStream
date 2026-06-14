import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// স্টেট ম্যানেজমেন্ট এবং লোকাল ব্যাকআপ
let matchState = JSON.parse(localStorage.getItem('cricketState')) || {
    format: 'T20', runs: 0, wickets: 0, balls: 0, history: []
};

// ডেটা সিঙ্ক করা (লোকাল + ফায়ারবেস)
function syncData() {
    localStorage.setItem('cricketState', JSON.stringify(matchState));
    set(ref(db, 'liveScore'), matchState);
    updateAdminDisplay(); // অ্যাডমিন প্যানেলে স্কোর আপডেট করা
}

// আনডু করার জন্য হিস্ট্রি সেভ করা
function saveHistory() {
    let currentState = JSON.parse(JSON.stringify(matchState));
    delete currentState.history; 
    matchState.history.push(currentState);
}

// অ্যাডমিন প্যানেলে প্রিভিউ দেখানো
function updateAdminDisplay() {
    const adminScoreText = document.getElementById("adminScoreText");
    const adminOverText = document.getElementById("adminOverText");
    
    if (adminScoreText && adminOverText) {
        adminScoreText.innerText = `${matchState.runs} - ${matchState.wickets}`;
        let overs = Math.floor(matchState.balls / 6);
        let ballsInOver = matchState.balls % 6;
        adminOverText.innerText = `ওভার: ${overs}.${ballsInOver} | ফরম্যাট: ${matchState.format}`;
    }
}

// --- বাটন ফাংশনগুলো ---

// ফরম্যাট চেঞ্জ করা
window.changeFormat = function() {
    saveHistory();
    matchState.format = document.getElementById("matchFormat").value;
    syncData();
};

// লিগ্যাল রান যোগ করা (বল কাউন্ট হবে)
window.addRun = function(run) {
    saveHistory();
    matchState.runs += run;
    matchState.balls += 1;
    syncData();
};

// উইকেট পড়া (বল কাউন্ট হবে)
window.addWicket = function() {
    saveHistory();
    matchState.wickets += 1;
    matchState.balls += 1;
    syncData();
};

// অতিরিক্ত রান (বল কাউন্ট হবে না)
window.addExtra = function(type) {
    saveHistory();
    matchState.runs += 1; // ওয়াইড বা নো বলে ১ রান যোগ হয়
    // *এখানে balls += 1 হবে না, কারণ এগুলো লিগ্যাল বল নয়*
    syncData();
};

// ভুল সংশোধন (Undo)
window.undoLast = function() {
    if(matchState.history.length > 0) {
        let previousState = matchState.history.pop();
        matchState.format = previousState.format;
        matchState.runs = previousState.runs;
        matchState.wickets = previousState.wickets;
        matchState.balls = previousState.balls;
        
        // ড্রপডাউনের ভ্যালুও আগেরটায় ফিরিয়ে নেওয়া
        const formatSelect = document.getElementById("matchFormat");
        if(formatSelect) formatSelect.value = matchState.format;
        
        syncData();
    } else {
        alert("আর কোনো আগের রেকর্ড নেই!");
    }
};

// নতুন ম্যাচ
window.resetMatch = function() {
    if(confirm("আপনি কি নিশ্চিত? সব ডেটা মুছে শূন্য হয়ে যাবে!")) {
        matchState = { format: 'T20', runs: 0, wickets: 0, balls: 0, history: [] };
        document.getElementById("matchFormat").value = 'T20';
        syncData();
    }
};

// পেজ লোড হওয়ার সাথে সাথে অ্যাডমিন ডিসপ্লে আপডেট করা
window.onload = updateAdminDisplay;
