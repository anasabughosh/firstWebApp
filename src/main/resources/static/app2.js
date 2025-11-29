// API base URL - تأكد أن المنفذ صحيح حسب Spring Boot
const API_BASE = 'http://localhost:8088/api/habits';

// جلب userId من localStorage بعد تسجيل الدخول
const userId = localStorage.getItem("userId");

// التحقق من تسجيل الدخول
if (!userId) {
    alert("الرجاء تسجيل الدخول أولًا");
    window.location.href = "login.html";
}

// عناصر DOM
const addHabitForm = document.getElementById('addHabitForm');
const habitsList = document.getElementById('habitsList');
const loadingMessage = document.getElementById('loadingMessage');
const noHabits = document.getElementById('noHabits');
const habitFrequency = document.getElementById('habitFrequency');
const customTimes = document.getElementById('customTimes');

// التحكم في إظهار/إخفاء حقل المرات المخصصة
habitFrequency.addEventListener('change', function() {
    customTimes.style.display = this.value === 'CUSTOM' ? 'block' : 'none';
});

// إضافة عادة جديدة
addHabitForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const habitData = {
        name: document.getElementById('habitName').value,
        description: document.getElementById('habitDescription').value,
        frequency: document.getElementById('habitFrequency').value,
        timesPerDay: document.getElementById('habitFrequency').value === 'CUSTOM'
            ? parseInt(document.getElementById('timesPerDay').value)
            : null,
        active: true,
        user: { id: parseInt(userId) } // ربط العادة بالمستخدم الحالي
    };

    try {
        const response = await fetch(`${API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitData)
        });

        if (response.ok) {
            alert('تم إضافة العادة بنجاح!');
            addHabitForm.reset();
            loadHabits();
        } else {
            const errData = await response.json();
            alert('حدث خطأ أثناء إضافة العادة: ' + (errData.error || ''));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في الاتصال بالخادم');
    }
});

// تحميل العادات
async function loadHabits() {
    try {
        const response = await fetch(`${API_BASE}/user/${userId}`);

        if (!response.ok) throw new Error("Failed to load habits");

        const habits = await response.json();
        displayHabits(habits);

    } catch (error) {
        console.error('Error loading habits:', error);
        loadingMessage.innerHTML = '<p class="text-danger">حدث خطأ في تحميل العادات</p>';
    }
}

// عرض العادات
function displayHabits(habits) {
    loadingMessage.style.display = 'none';

    if (habits.length === 0) {
        noHabits.style.display = 'block';
        habitsList.style.display = 'none';
        return;
    }

    noHabits.style.display = 'none';
    habitsList.style.display = 'block';

    habitsList.innerHTML = habits.map(habit => `
        <div class="col-md-6">
            <div class="card habit-card" id="habit-${habit.id}">
                <div class="card-body">
                    <h5 class="card-title">${habit.name}</h5>
                    <p class="card-text">${habit.description || 'لا يوجد وصف'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-primary">${getFrequencyText(habit.frequency)}</span>
                        ${habit.timesPerDay ? `<span class="badge bg-secondary">${habit.timesPerDay} مرات/يوم</span>` : ''}
                        <div>
                            <button class="btn btn-success btn-sm" onclick="markCompleted(${habit.id})">
                                <i class="bi bi-check-lg"></i> تم الإنجاز
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteHabit(${habit.id})">
                                <i class="bi bi-trash"></i> حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// تحويل التكرار لنص عربي
function getFrequencyText(frequency) {
    return {
        'DAILY': 'يومي',
        'WEEKLY': 'أسبوعي',
        'CUSTOM': 'مخصص'
    }[frequency] || frequency;
}

// تسجيل الإنجاز
async function markCompleted(habitId) {
    try {
        const response = await fetch(`${API_BASE}/${habitId}/complete`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('تم تسجيل الإنجاز بنجاح!');
            document.getElementById(`habit-${habitId}`).classList.add('completed');
        } else {
            alert('حدث خطأ أثناء تسجيل الإنجاز');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ في الاتصال بالخادم');
    }
}

// حذف العادة
async function deleteHabit(habitId) {
    if (confirm('هل أنت متأكد من حذف هذه العادة؟')) {
        try {
            const response = await fetch(`${API_BASE}/delete/${habitId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('تم حذف العادة بنجاح!');
                loadHabits();
            } else {
                alert('حدث خطأ أثناء حذف العادة');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال بالخادم');
        }
    }
}

// تحميل العادات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadHabits);


