const habitCards = document.getElementById("habitCards");
const calendarCard = document.getElementById("habitCalendarCard");
const calendarDiv = document.getElementById("habitCalendar");

// استبدل هذا بـ userId الفعلي بعد تسجيل الدخول
const userId = 1;

// جلب العادات من API
fetch(`http://localhost:8080/api/habits/user/${userId}`)
    .then(res => res.json())
    .then(habits => {
        habits.forEach(habit => {
            const card = document.createElement("div");
            card.classList.add("habit-card", "col-md-3", "p-2");
            card.innerHTML = `<div class="card p-2"><h6>${habit.name}</h6></div>`;
            card.addEventListener('click', () => showHabitCalendar(habit.id, habit.name));
            habitCards.appendChild(card);
        });
    });

// عند الضغط على عادة، عرض التقويم
function showHabitCalendar(habitId, habitName) {
    fetch(`http://localhost:8080/api/habits/${habitId}/completions`)
        .then(res => res.json())
        .then(dates => {
            generateHabitCalendar(dates, habitName);
            calendarCard.style.display = 'block';
        });
}

// إنشاء جدول تقويم شهري للشهر الحالي
function generateHabitCalendar(completionDates, habitName) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `<h6 class="text-center mb-3">${habitName} - ${today.toLocaleString('ar', { month: 'long', year: 'numeric' })}</h6>`;
    html += "<table class='table table-bordered text-center'>";
    html += "<tr>";
    for (let day = 1; day <= daysInMonth; day++) {
        html += `<th>${day}</th>`;
    }
    html += "</tr><tr>";
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const completed = completionDates.includes(dateStr);
        html += `<td class="${completed ? 'bg-success' : 'bg-danger'}">${completed ? '✔' : '✘'}</td>`;
    }
    html += "</tr></table>";
    calendarDiv.innerHTML = html;
}
