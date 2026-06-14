import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ১. অফলাইন ব্যাকআপ এবং প্রাথমিক ডেটা
let matchData = JSON.parse(localStorage.getItem('cricketMatchData')) || {
    runs: 0,
    wickets: 0,
    balls: 0,
    history: [], // আনডু করার জন্য
    batsmanImage: ""
};

// ফায়ারবেস ও লোকাল স্টোরেজ একসাথে সিঙ্ক করা
function syncData() {
    localStorage.setItem('cricketMatchData', JSON.stringify(matchData));
    set(ref(db, 'liveScore'), matchData);
}

// হিস্ট্রি সেভ করার ফাংশন (Undo এর জন্য)
function saveHistory() {
    let currentState = JSON.parse(JSON.stringify(matchData));
    delete currentState.history; 
    matchData.history.push(currentState);
}

// --- অ্যাডমিন প্যানেলের কাজ ---

// রান যোগ করা
window.addRun = function(run) {
    saveHistory();
    matchData.runs += run;
    matchData.balls += 1;
    syncData();
};

// উইকেট যোগ করা
window.addWicket = function() {
    saveHistory();
    matchData.wickets += 1;
    matchData.balls += 1;
    syncData();
};

// অতিরিক্ত রান (Wide/NoBall)
window.addExtra = function(type) {
    saveHistory();
    matchData.runs += 1; 
    // ওয়াইড বা নো বল ওভারের কাউন্টে যুক্ত হয় না
    syncData();
};

// আনডু লজিক (ভুল সংশোধন)
window.undoLast = function() {
    if(matchData.history.length > 0) {
        let previousState = matchData.history.pop();
        matchData.runs = previousState.runs;
        matchData.wickets = previousState.wickets;
        matchData.balls = previousState.balls;
        matchData.batsmanImage = previousState.batsmanImage;
        syncData();
    } else {
        alert("আর কোনো আগের রেকর্ড নেই!");
    }
};

// ম্যাচ রিসেট
window.resetMatch = function() {
    if(confirm("আপনি কি নিশ্চিত যে নতুন ম্যাচ শুরু করতে চান? সব ডেটা মুছে যাবে!")) {
        matchData = { runs: 0, wickets: 0, balls: 0, history: [], batsmanImage: "" };
        syncData();
    }
};

// ছবি আপলোড ও ম্যানেজমেন্ট
const imageInput = document.getElementById('batsmanImage');
if(imageInput) {
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Img = event.target.result;
                matchData.batsmanImage = base64Img;
                
                // অ্যাডমিন প্যানেলে প্রিভিউ দেখানো
                const preview = document.getElementById('batsmanPreview');
                preview.src = base64Img;
                preview.style.display = "block";
                
                syncData(); // ফায়ারবেসে ছবি পাঠানো
            };
            reader.readAsDataURL(file);
        }
    });
}

// --- OBS ডিসপ্লে സിঙ্ক (শুধু display.html-এ কাজ করবে) ---
const scoreText = document.getElementById("scoreText");
const overText = document.getElementById("overText");
const obsBatsmanImg = document.getElementById("obsBatsmanImg");

if (scoreText) { 
    onValue(ref(db, 'liveScore'), (snapshot) => {
        const data = snapshot.val();
        if(data) {
            // স্কোর দেখানো
            scoreText.innerText = `${data.runs} - ${data.wickets}`;
            
            // ওভার হিসাব করা (৬ বলে ১ ওভার)
            let overs = Math.floor(data.balls / 6);
            let ballsInOver = data.balls % 6;
            overText.innerText = `(${overs}.${ballsInOver})`;

            // ছবি দেখানো
            if(data.batsmanImage) {
                obsBatsmanImg.src = data.batsmanImage;
                obsBatsmanImg.style.display = "block";
            } else {
                obsBatsmanImg.style.display = "none";
            }
        }
    });
}
