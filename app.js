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
