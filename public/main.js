// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector("#loginForm");
//   const btnDangNhap = document.getElementById("btnDangNhap");
//   const btnDangXuat = document.getElementById("btnDangXuat");
//   const textRole = document.getElementById("textrole");
//   const errorMsg = document.getElementById("errorMe");
//   const successModalEl = document.getElementById("successModal");
//   const goDashboardBtn = document.getElementById("goDashboard");

//   // Ẩn form nếu đã đăng nhập
//   const user_id = localStorage.getItem("user_id");
//   const quyen = localStorage.getItem("quyen");

//   if (user_id || quyen) {
//     form.style.display = "none";
//     if (btnDangNhap) {
//       btnDangNhap.style.display = "none";
//     }
//   } else {
//     btnDangXuat.style.display = "none";
//     btnDangNhap.style.display = "block";
//     form.style.display = "block";
//   }
//   // Xử lý đăng xuất
//   btnDangXuat?.addEventListener("click", () => {
//     localStorage.clear();
//     window.location.reload();
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const btnDangNhap = document.getElementById("btnDangNhap");
  const btnDangXuat = document.getElementById("btnDangXuat");
  const navbar = document.querySelector("navbarNav");
  const user_id = localStorage.getItem("user_id");
  const quyen = localStorage.getItem("quyen");

  // Nếu đã đăng nhập
  if (user_id || quyen) {
    if (form) form.style.display = "none";
    if (btnDangNhap) btnDangNhap.style.display = "none";
    if (btnDangXuat) btnDangXuat.style.display = "inline-block";
    if (navbar) navbar.style.display = "block";
  } else {
    if (form) form.style.display = "block";
    if (btnDangNhap) btnDangNhap.style.display = "inline-block";
    if (btnDangXuat) btnDangXuat.style.display = "none";
    if (navbar) navbar.style.display = "none";
  }

  // Xử lý đăng xuất
  btnDangXuat?.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
});
