// API base URL
const API_BASE = 'http://localhost:8088/api/habits';

// جلب userId من localStorage بعد تسجيل الدخول
const userId = localStorage.getItem("userId");

// التحقق من تسجيل الدخول
if (!userId) {
    alert("الرجاء تسجيل الدخول أولًا");
    window.location.href = "login.html";
}

// عناصر DOM
const habitsList = document.getElementById('habitsList');
const loadingMessage = document.getElementById('loadingMessage');
const noHabits = document.getElementById('noHabits');
const totalHabits = document.getElementById('totalHabits');
const dailyHabits = document.getElementById('dailyHabits');
const weeklyHabits = document.getElementById('weeklyHabits');
const activeHabits = document.getElementById('activeHabits');
const addHabitModal = document.getElementById('addHabitModal');
const calendarModal = document.getElementById('calendarModal');
const habitCalendar = document.getElementById('habitCalendar');

// متغيرات التصفية
let currentFilters = {
    frequency: 'ALL',
    status: 'ALL'
};

// متغيرات التقويم
let calendar;
let currentHabitId;

// تطبيق التصفية
function applyFilters() {
    currentFilters.frequency = document.getElementById('filterFrequency').value;
    currentFilters.status = document.getElementById('filterStatus').value;
    loadHabits();
}

// تحميل العادات
async function loadHabits() {
    try {
        const response = await fetch(`${API_BASE}/user/${userId}`);

        if (!response.ok) throw new Error("Failed to load habits");

        let habits = await response.json();

        // تطبيق التصفية
        habits = habits.filter(habit => {
            // تصفية حسب التكرار
            if (currentFilters.frequency !== 'ALL' && habit.frequency !== currentFilters.frequency) {
                return false;
            }
            // تصفية حسب الحالة
            if (currentFilters.status === 'ACTIVE' && !habit.active) {
                return false;
            }
            if (currentFilters.status === 'INACTIVE' && habit.active) {
                return false;
            }
            return true;
        });

        displayHabits(habits);
        updateStats(habits);

    } catch (error) {
        console.error('Error loading habits:', error);
        loadingMessage.innerHTML = '<p class="text-danger">حدث خطأ في تحميل العادات</p>';
    }
}

// تحديث الإحصائيات
function updateStats(habits) {
    const total = habits.length;
    const daily = habits.filter(h => h.frequency === 'DAILY').length;
    const weekly = habits.filter(h => h.frequency === 'WEEKLY').length;
    const active = habits.filter(h => h.active).length;

    totalHabits.textContent = total;
    dailyHabits.textContent = daily;
    weeklyHabits.textContent = weekly;
    activeHabits.textContent = active;
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
        <div class="col-md-6 col-lg-4">
            <div class="card habit-card ${!habit.active ? 'bg-light' : ''}" id="habit-${habit.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${habit.name}</h5>
                        <span class="badge ${habit.active ? 'bg-success' : 'bg-secondary'}">
                            ${habit.active ? 'نشطة' : 'غير نشطة'}
                        </span>
                    </div>

                    <p class="card-text text-muted">${habit.description || 'لا يوجد وصف'}</p>

                    <div class="habit-info mt-3">
                        <div class="row text-center">
                            <div class="col-6">
                                <small class="text-muted">التكرار</small>
                                <div class="badge bg-primary frequency-badge">
                                    ${getFrequencyText(habit.frequency)}
                                </div>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">النوع</small>
                                <div>
                                    ${habit.timesPerDay ?
                                        `<span class="badge bg-info frequency-badge">${habit.timesPerDay} مرات/يوم</span>` :
                                        `<span class="badge bg-warning frequency-badge">عادية</span>`
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 pt-3 border-top">
                        <div class="row g-2">
                            <div class="col-4">
                                <button class="btn btn-success btn-sm w-100" onclick="markCompleted(${habit.id})">
                                    <i class="bi bi-check-lg"></i> إنجاز
                                </button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-info btn-sm w-100" onclick="showCalendar(${habit.id}, '${habit.name}')">
                                    <i class="bi bi-calendar"></i> التقويم
                                </button>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-danger btn-sm w-100" onclick="deleteHabit(${habit.id})">
                                    <i class="bi bi-trash"></i> حذف
                                </button>
                            </div>
                        </div>
                        <small class="text-muted d-block mt-2">
                            <i class="bi bi-calendar"></i>
                            تم الإنشاء: ${formatDate(habit.creationDate)}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// تحويل التكرار لنص عربي
function getFrequencyText(frequency) {
    const frequencyMap = {
        'DAILY': 'يومي',
        'WEEKLY': 'أسبوعي',
        'CUSTOM': 'مخصص'
    };
    return frequencyMap[frequency] || frequency;
}

// تنسيق التاريخ
function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// إظهار نموذج إضافة عادة
function showAddHabitForm() {
    addHabitModal.style.display = 'block';
}

// إغلاق نموذج إضافة عادة
function closeAddHabitModal() {
    addHabitModal.style.display = 'none';
    document.getElementById('addHabitForm').reset();
    document.getElementById('customTimesContainer').style.display = 'none';
}

// إظهار التقويم
async function showCalendar(habitId, habitName) {
    currentHabitId = habitId;
    document.getElementById('calendarTitle').innerHTML = `<i class="bi bi-calendar-check"></i> تقويم العادة: ${habitName}`;
    calendarModal.style.display = 'block';

    // إعادة تهيئة التقويم في كل مرة
    if (calendar) {
        calendar.destroy();
    }

    calendar = new FullCalendar.Calendar(habitCalendar, {
        initialView: 'dayGridMonth',
        locale: 'ar',
        direction: 'rtl',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        buttonText: {
            today: 'اليوم',
            month: 'شهر',
            week: 'أسبوع',
            day: 'يوم'
        },
        events: await loadCompletionDates(habitId),
        eventDisplay: 'background',
        eventBackgroundColor: '#28a745',
        eventBorderColor: '#28a745'
    });

    calendar.render();
}

// إغلاق نافذة التقويم
function closeCalendarModal() {
    calendarModal.style.display = 'none';
}

// تحميل أيام الإنجاز
async function loadCompletionDates(habitId) {
    try {
        const response = await fetch(`${API_BASE}/${habitId}/completions`);
        if (!response.ok) throw new Error("Failed to load completions");

        const completions = await response.json();

        // معالجة البيانات بغض النظر عن الشكل
        const events = completions.map(completion => {
            // إذا كانت completion كائن
            if (typeof completion === 'object' && completion.completionDate) {
                return {
                    title: '✓',
                    date: completion.completionDate,
                    classNames: ['completion-day'],
                    display: 'background'
                };
            }
            // إذا كانت completion مجرد تاريخ نصي
            else if (typeof completion === 'string') {
                return {
                    title: '✓',
                    date: completion,
                    classNames: ['completion-day'],
                    display: 'background'
                };
            }
            // إذا كانت تحتوي على تاريخ في حقل مختلف
            else {
                return {
                    title: '✓',
                    date: completion.date || completion,
                    classNames: ['completion-day'],
                    display: 'background'
                };
            }
        });

        console.log('أحداث التقويم:', events);
        return events;

    } catch (error) {
        console.error('Error loading completions:', error);
        return [];
    }
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

            // تحديث التقويم إذا كان مفتوحاً
            if (calendar && currentHabitId === habitId) {
                setTimeout(() => {
                    calendar.refetchEvents();
                }, 500);
            }
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

// إضافة عادة جديدة
document.getElementById('addHabitForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const habitData = {
        name: document.getElementById('habitName').value,
        description: document.getElementById('habitDescription').value,
        frequency: document.getElementById('habitFrequency').value,
        timesPerDay: document.getElementById('habitFrequency').value === 'CUSTOM'
            ? parseInt(document.getElementById('timesPerDay').value)
            : null,
        active: true,
        user: { id: parseInt(userId) }
    };

    try {
        const response = await fetch(`${API_BASE}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(habitData)
        });

        if (response.ok) {
            alert('تم إضافة العادة بنجاح!');
            closeAddHabitModal();
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

// التحكم في إظهار/إخفاء حقل المرات المخصصة
document.getElementById('habitFrequency').addEventListener('change', function() {
    document.getElementById('customTimesContainer').style.display =
        this.value === 'CUSTOM' ? 'block' : 'none';
});

// تحميل العادات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadHabits();

    // إضافة حدث للتصفية عند تغيير القيم
    document.getElementById('filterFrequency').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);

    // إغلاق النوافذ عند النقر خارجها
    window.addEventListener('click', function(e) {
        if (e.target === addHabitModal) {
            closeAddHabitModal();
        }
        if (e.target === calendarModal) {
            closeCalendarModal();
        }
    });
});