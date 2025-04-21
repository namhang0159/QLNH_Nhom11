document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const btnDangNhap = document.getElementById("btnDangNhap");
  const btnDangXuat = document.getElementById("btnDangXuat");
  const textRole = document.getElementById("textrole");
  const errorMsg = document.getElementById("errorMe");
  const successModalEl = document.getElementById("successModal");
  const goDashboardBtn = document.getElementById("goDashboard");

  // Ẩn form nếu đã đăng nhập
  const user_id = localStorage.getItem("user_id");
  const quyen = localStorage.getItem("quyen");

  if (user_id && quyen) {
    form.style.display = "none";
    if (btnDangNhap) {
      btnDangNhap.style.display = "none";
    }
  } else {
    btnDangXuat.style.display = "none";
    btnDangNhap.style.display = "block";
    form.style.display = "block";
  }
  // Xử lý đăng xuất
  btnDangXuat?.addEventListener("click", () => {
    localStorage.clear();
    window.location.reload();
  });
});
