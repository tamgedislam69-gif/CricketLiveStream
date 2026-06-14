import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// স্টেট ম্যানেজমেন্ট
let matchState = JSON.parse(localStorage.getItem('matchState')) || {
    runs: 0, wickets: 0, balls: 0, batsmanName: "Batsman", bowlerName: "Bowler", isVisible: true, history: []
};

function syncData() {
    localStorage.setItem('matchState', JSON.stringify(matchState));
    set(ref(db, 'liveScore'), matchState);
}

// স্কোরিং লজিক (আগেরগুলো এখানে আছে)
window.addRun = function(run) {
    matchState.runs += run;
    matchState.balls += 1;
    syncData();
};

window.addWicket = function() {
    matchState.wickets += 1;
    matchState.balls += 1;
    syncData();
};

// প্লেয়ার ও শো/হাইড লজিক
window.updatePlayer = function(type) {
    if(type === 'batsman') matchState.batsmanName = document.getElementById('batsmanName').value;
    else matchState.bowlerName = document.getElementById('bowlerName').value;
    syncData();
};

window.toggleScoreboard = function() {
    matchState.isVisible = !matchState.isVisible;
    syncData();
};

// অডিও ও টিকার লজিক
window.playMusic = function(url) {
    set(ref(db, 'audio'), { src: url, status: 'play' });
};
window.stopMusic = function() {
    set(ref(db, 'audio'), { status: 'stop' });
};
window.updateTicker = function(text) {
    set(ref(db, 'news'), { text: text });
};
