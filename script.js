const START_DATE = new Date(2026, 2, 23); 
const END_DATE = new Date(2026, 3, 12);  
const PATTERN = "NOMEONOMEONOMEONOMEON";

const STATIONS = { 7: "HEMA" }; 

const SHIFTS = {
    'M': { name: "MORNING", time: "6:00 AM - 2:00 PM", color: "#3498db" },
    'E': { name: "EVENING", time: "2:00 PM - 10:00 PM", color: "#f1c40f" },
    'N': { name: "NIGHT", time: "10:00 PM - 6:00 AM", color: "#8e44ad" },
    'O': { name: "OFF DUTY", time: "Rest Day", color: "#555555" }
};

function getShiftData(date) {
    const d1 = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    const d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = d2 - d1;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays >= PATTERN.length) {
        return { key: 'O', station: "OFF" };
    }
    
    const shiftKey = PATTERN[diffDays]; 
    return { key: shiftKey, station: STATIONS[7] || "HEMA" };
}

const quotes = [
    "One successful puncture at a time, baby! You're providing the answers patients need.",
    "Remember: Behind every slide you examine is a life you are helping. Keep going!",
    "Through the long shifts and tired eyes, just remember: You’re a Future RMT in the making.",
    "We may work behind the scenes, but we are the 'Eyes of Medicine.' Stand proud!",
    "Focus on the microscope, focus on the dream. You're closer than you think.",
    "Every blood draw is a step toward your license. Don't let a difficult vein discourage you.",
    "MedTech interns don't quit; they just recalibrate and try again. Stay strong!",
    "Mastering Hematology today, becoming a licensed professional tomorrow. You got this!",
    "Your hard work in the lab today saves lives tomorrow. Keep your head up!",
    "The journey is tough, but so are you. Finish your internship strong, baby!"
];

function showMotivation() {
    const modal = document.getElementById('quoteModal');
    const quoteText = document.getElementById('quoteText');
    const random = Math.floor(Math.random() * quotes.length);
    
    quoteText.innerText = `"${quotes[random]}"`;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('quoteModal').classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('quoteModal');
    if (event.target == modal) closeModal();
}

function updateMainDisplay(date) {
    const data = getShiftData(date);
    const info = SHIFTS[data.key];
    const isToday = date.toDateString() === new Date().toDateString();

    document.getElementById('selectedDateLabel').innerText = isToday ? "DUTY FOR TODAY" : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const letter = document.getElementById('displayShiftLetter');
    letter.innerText = data.key;
    letter.style.color = info.color;
    document.getElementById('displayShiftName').innerText = info.name;
    document.getElementById('displayShiftTime').innerText = info.time;
    document.getElementById('stationDisplay').innerText = `Station: ${data.station}`;
}

function renderFullRoster() {
    const grid = document.getElementById('fullRosterGrid');
    if (!grid) return;
    grid.innerHTML = ''; 
    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const todayStr = new Date().toDateString();

    dayLabels.forEach(label => {
        const h = document.createElement('div');
        h.className = 'grid-day-header';
        h.innerText = label;
        grid.appendChild(h);
    });

    const firstDay = new Date(START_DATE);
    for (let i = 0; i < firstDay.getDay(); i++) {
        const empty = document.createElement('div');
        grid.appendChild(empty);
    }

    let tempDate = new Date(START_DATE);
    while (tempDate <= END_DATE) {
        const current = new Date(tempDate);
        const shiftData = getShiftData(current);
        const info = SHIFTS[shiftData.key]; 
        
        const item = document.createElement('div');
        item.className = 'grid-item';
        
        item.style.backgroundColor = `${info.color}22`; 
        item.style.borderColor = info.color;
        item.style.borderWidth = "1px";
        item.style.borderStyle = "solid";

        if (current.toDateString() === todayStr) {
            item.classList.add('today');
            item.style.boxShadow = `0 0 10px ${info.color}`;
        }

        item.innerHTML = `
            <span style="font-weight:700; color: ${info.color}">${current.getDate()}</span>
            <span style="font-size: 0.6rem; font-weight: 800; color: ${info.color}">${shiftData.key}</span>
        `;
        
        item.onclick = () => {
            updateMainDisplay(current);
            switchView('home', document.querySelector('.nav-item')); 
        };

        grid.appendChild(item);
        tempDate.setDate(tempDate.getDate() + 1);
    }
}

function switchView(view, el) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(view + 'View').classList.add('active');
    
    if (view === 'calendar') renderFullRoster();
}

function init() {
    const calendar = document.getElementById('calendarScroll');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    let tempDate = new Date(START_DATE);
    while (tempDate <= END_DATE) {
        const current = new Date(tempDate);
        const item = document.createElement('div');
        item.className = 'calendar-item';
        if (current.toDateString() === today.toDateString()) item.classList.add('selected');

        const shiftKey = getShiftData(current).key;
        item.innerHTML = `
            <span style="font-size:0.75rem; opacity:0.7">${days[current.getDay()]}</span>
            <span style="font-size:1.2rem; font-weight:700">${current.getDate()}</span>
            <div style="width:6px; height:6px; border-radius:50%; background:${SHIFTS[shiftKey].color}; margin-top:8px;"></div>
        `;

        item.onclick = () => {
            document.querySelectorAll('.calendar-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            updateMainDisplay(current);
        };
        calendar.appendChild(item);
        tempDate.setDate(tempDate.getDate() + 1);
    }
    updateMainDisplay(today >= START_DATE && today <= END_DATE ? today : START_DATE);
}

document.addEventListener('DOMContentLoaded', init);
