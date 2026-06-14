import { db } from "./firebase-config.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

let matchState = JSON.parse(localStorage.getItem('matchState')) || {
    runs: 0, wickets: 0, batsmanName: "Batsman", bowlerName: "Bowler", isVisible: true
};

function syncData() {
    localStorage.setItem('matchState', JSON.stringify(matchState));
    set(ref(db, 'liveScore'), matchState);
}

// নতুন ফিচার: প্লেয়ার আপডেট
window.updatePlayer = function(type) {
    if(type === 'batsman') {
        matchState.batsmanName = document.getElementById('batsmanName').value;
    } else {
        matchState.bowlerName = document.getElementById('bowlerName').value;
    }
    syncData();
};

// নতুন ফিচার: শো/হাইড
window.toggleScoreboard = function() {
    matchState.isVisible = !matchState.isVisible;
    syncData();
};

// রান আপডেট লজিক (আগেরগুলোও এখানে থাকবে)
window.addRun = function(run) {
    matchState.runs += run;
    syncData();
};
