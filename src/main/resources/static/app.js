// تسجيل الدخول
async function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email: email, password: pass })
        });

        const data = await res.json();

        if (data.status === "success") {

            // تخزين بيانات المستخدم
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("email", data.email);

            // الانتقال للصفحة الرئيسية
            window.location.href = "habits-view.html";

        } else {
            alert("Wrong login!");
        }

    } catch (err) {
        console.error("Login error:", err);
        alert("Error connecting to server");
    }
}


// تسجيل حساب جديد
async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await fetch("/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.status === "created") {
            alert("Account created successfully!");
            window.location.href = "login.html";
        } else {
            alert("Email already exists!");
        }

    } catch (err) {
        console.error("Register error:", err);
        alert("Error connecting to server");
    }
}
