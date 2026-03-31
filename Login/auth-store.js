// Dual mode auth: primary MySQL API, fallback localStorage
const API_BASE = 'http://localhost:4000/api';
const USER_STORE_KEY = 'eduspark_users_fallback';

function getUsers() {
    try {
        const raw = localStorage.getItem(USER_STORE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
}

function localRegister({ username, email, password }) {
    const users = getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists.' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email already registered.' };
    }
    users.push({ username, email, password });
    saveUsers(users);
    return { success: true, message: 'Registration saved in local fallback.' };
}

function localLogin({ username, password }) {
    const user = getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { success: false, message: 'No user found in local fallback.' };
    if (user.password !== password) return { success: false, message: 'Incorrect password (fallback).' };
    return { success: true, message: 'Login successful (fallback).', user };
}

async function registerUser({ username, email, password }) {
    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
            return { success: true, message: json.message || 'Registered (MySQL)' };
        }
        if (json.message) return { success: false, message: json.message };
        throw new Error('MySQL register failed');
    } catch (err) {
        console.warn('MySQL register error:', err.message || err);
        return localRegister({ username, email, password });
    }
}

async function loginUser({ username, password }) {
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
            return { success: true, message: json.message || 'Logged in (MySQL)', user: json.user };
        }
        if (json.message) return { success: false, message: json.message };
        throw new Error('MySQL login failed');
    } catch (err) {
        console.warn('MySQL login error:', err.message || err);
        return localLogin({ username, password });
    }
}

async function forgotPassword({ email, newPassword }) {
    try {
        const res = await fetch(`${API_BASE}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword }),
        });

        const json = await res.json();
        if (res.ok && json.success) {
            return { success: true, message: json.message || 'Password reset success (MySQL)'};
        }
        if (json.message) return { success: false, message: json.message };
        throw new Error('MySQL forgot-password failed');
    } catch (err) {
        console.warn('MySQL forgot-password error:', err.message || err);

        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return { success: false, message: 'No user found with this email (fallback)' };
        }
        user.password = newPassword;
        saveUsers(users);
        return { success: true, message: 'Password reset in local fallback' };
    }
}


