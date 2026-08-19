/* ============================================================
   AUTHENTICATION - SIPEDES (3 ROLE)
   ============================================================ */

const USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    nama: "Administrator Sistem",
    role: "admin",
  },
  {
    id: 2,
    username: "perangkat",
    password: "perangkat123",
    nama: "Perangkat Desa",
    role: "perangkat",
  },
  {
    id: 3,
    username: "kades",
    password: "kades123",
    nama: "Kepala Desa Sleman",
    role: "kades",
  },
];

function login(username, password) {
  const user = USERS.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    localStorage.setItem("sipedes_user", JSON.stringify(user));
    return { success: true, user: user };
  }
  return { success: false, message: "Username atau password salah!" };
}

function isLoggedIn() {
  const data = localStorage.getItem("sipedes_user");
  return data ? JSON.parse(data) : null;
}

function logout() {
  localStorage.removeItem("sipedes_user");
  window.location.href = "login.html";
}

function redirectByRole(role) {
  const pages = {
    admin: "dashboard-admin.html",
    perangkat: "dashboard-perangkat.html",
    kades: "dashboard-kades.html",
  };
  window.location.href = pages[role] || "index.html";
}

window.login = login;
window.isLoggedIn = isLoggedIn;
window.logout = logout;
window.redirectByRole = redirectByRole;
window.USERS = USERS;
