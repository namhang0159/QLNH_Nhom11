// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.querySelector("#loginForm");

//   const btnDangXuat = document.getElementById("btnDangXuat");
//   const navbar = document.querySelector("#navbarNav ul");
//   const user_id = localStorage.getItem("user_id");
//   const quyen = localStorage.getItem("quyen");
//   const ho_ten = localStorage.getItem("ho_ten");
//   const ngay_sinh = localStorage.getItem("ngay_sinh");
//   const so_dien_thoai = localStorage.getItem("so_dien_thoai");
//   const email = localStorage.getItem("email");
//   const vi_tri = localStorage.getItem("vi_tri");
//   const luong = localStorage.getItem("luong");
//   const ten_tai_khoan = localStorage.getItem("ten_tai_khoan");
//   const adminCC = document.querySelectorAll(".admint");
//   const oke = document.getElementById("oke");
//   const info = document.querySelector("#infoNV");
//   if (user_id || quyen) {
//     if (quyen === "Admin") {
//       adminCC.forEach((el) => (el.style.display = "block"));
//     }
//     if (quyen === "Nhân viên") {
//       adminCC.forEach((el) => (el.style.display = "none"));
//     }
//     if (form) form.style.display = "none";

//     if (btnDangXuat) btnDangXuat.style.display = "block";
//     if (navbar) navbar.style.display = "flex";

//     // Thông tin Nhân viên
//     document.getElementById("Manv").textContent = user_id;
//     document.getElementById("Hoten").textContent = ho_ten;
//     document.getElementById("Ngaysinh").textContent = ngay_sinh;

//     document.getElementById("Sdt").textContent = so_dien_thoai;

//     document.getElementById("Email").textContent = email;

//     document.getElementById("Vitri").textContent = vi_tri;

//     document.getElementById("Luong").textContent = luong;
//     document.getElementById("tentk").textContent = ten_tai_khoan;

//     document.querySelector("#infoNV").style.display = "block";
//     oke.style.display = "block";
//   } else {
//     if (form) form.style.display = "block";

//     if (btnDangXuat) btnDangXuat.style.display = "none";
//     if (navbar) navbar.style.display = "none";
//     if (info) info.style.display = "none";
//     oke.style.display = "none";
//   }

//   // đăng xuất
//   btnDangXuat?.addEventListener("click", () => {
//     localStorage.clear();
//     window.location.href = "index.html";
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const btnDangXuat = document.getElementById("btnDangXuat");
  const navbar = document.querySelector("#navbarNav ul");
  const user_id = localStorage.getItem("user_id");
  const quyen = localStorage.getItem("quyen");
  const ho_ten = localStorage.getItem("ho_ten");
  const ngay_sinh = localStorage.getItem("ngay_sinh");
  const so_dien_thoai = localStorage.getItem("so_dien_thoai");
  const email = localStorage.getItem("email");
  const vi_tri = localStorage.getItem("vi_tri");
  const luong = localStorage.getItem("luong");
  const ten_tai_khoan = localStorage.getItem("ten_tai_khoan");
  const adminCC = document.querySelectorAll(".admint");
  const oke = document.getElementById("oke");
  const info = document.querySelector("#infoNV");

  if (user_id || quyen) {
    if (quyen === "Admin") {
      adminCC.forEach((el) => (el.style.display = "block"));
    }
    if (quyen === "Nhân viên") {
      adminCC.forEach((el) => (el.style.display = "none"));
    }
    if (form) form.style.display = "none";
    if (btnDangXuat) btnDangXuat.style.display = "block";
    if (navbar) navbar.style.display = "flex";

    const manvElement = document.getElementById("Manv");
    if (manvElement) manvElement.textContent = user_id;

    const hotenElement = document.getElementById("Hoten");
    if (hotenElement) hotenElement.textContent = ho_ten;

    const ngaysinhElement = document.getElementById("Ngaysinh");
    if (ngaysinhElement) ngaysinhElement.textContent = ngay_sinh;

    const sdtElement = document.getElementById("Sdt");
    if (sdtElement) sdtElement.textContent = so_dien_thoai;

    const emailElement = document.getElementById("Email");
    if (emailElement) emailElement.textContent = email;

    const vitriElement = document.getElementById("Vitri");
    if (vitriElement) vitriElement.textContent = vi_tri;

    const luongElement = document.getElementById("Luong");
    if (luongElement) luongElement.textContent = luong;

    const tentkElement = document.getElementById("tentk");
    if (tentkElement) tentkElement.textContent = ten_tai_khoan;

    // Hiển thị thông tin nhân viên
    if (info) info.style.display = "block";
    if (oke) oke.style.display = "block";
  } else {
    if (form) form.style.display = "block";
    if (btnDangXuat) btnDangXuat.style.display = "none";
    if (navbar) navbar.style.display = "none";
    if (info) info.style.display = "none";
    if (oke) oke.style.display = "none";
  }

  // Đăng xuất
  btnDangXuat?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
});
