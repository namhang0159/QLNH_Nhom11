const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Kết nối MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quanlynhahang",
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối database:", err);
    return;
  }
  console.log("Kết nối MySQL thành công!");
});

// API Đăng nhập
app.post("/api/login", (req, res) => {
  const { ten_tai_khoan, mat_khau } = req.body;

  const sql = "SELECT * FROM NhanVien WHERE ten_tai_khoan = ? AND mat_khau = ?";
  db.query(sql, [ten_tai_khoan, mat_khau], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server!" });

    if (result.length > 0) {
      const user = result[0];
      res.json({
        message: "Đăng nhập thành công!",
        user_id: user.id,
        ten_tai_khoan: user.ten_tai_khoan,
        quyen: user.quyen,
      });
    } else {
      res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
    }
  });
});

// API Lấy danh sách Nhân Viên
app.get("/api/nhanvien", (req, res) => {
  const sql = "SELECT * FROM NhanVien"; // Truy vấn lấy tất cả nhân viên

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }

    res.json(result); // Trả về dữ liệu nhân viên dưới dạng JSON
  });
});

app.post("/api/nhanvien", (req, res) => {
  const nv = req.body;
  const sql = `INSERT INTO NhanVien (ho_Ten, ngay_sinh, so_dien_thoai, email, vi_tri, luong, ten_tai_khoan, mat_khau, quyen, hieu_suat) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    nv.ho_ten,
    nv.ngay_sinh,
    nv.so_dien_thoai,
    nv.email,
    nv.vi_tri,
    nv.luong,
    nv.ten_tai_khoan,
    nv.mat_khau,
    nv.quyen,
    nv.hieu_suat,
  ];

  db.query(sql, values, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Lỗi khi thêm nhân viên!" });
    res.json({ message: "Thêm nhân viên thành công!" });
  });
});

app.delete("/api/nhanvien/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM NhanVien WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Lỗi khi xóa nhân viên!" });
    res.json({ message: "Xóa nhân viên thành công!" });
  });
});

app.put("/api/nhanvien/:id", (req, res) => {
  const id = req.params.id;
  const nv = req.body;

  const sql = `UPDATE NhanVien 
               SET ho_Ten = ?, ngay_sinh = ?, so_dien_thoai = ?, email = ?, vi_tri = ?, luong = ?, ten_tai_khoan = ?, mat_khau = ?, quyen = ?, hieu_suat = ?
               WHERE id = ?`;

  const values = [
    nv.ho_ten,
    nv.ngay_sinh,
    nv.so_dien_thoai,
    nv.email,
    nv.vi_tri,
    nv.luong,
    nv.ten_tai_khoan,
    nv.mat_khau,
    nv.quyen,
    nv.hieu_suat,
    id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật nhân viên!" });
    }
    res.json({ message: "Cập nhật nhân viên thành công!" });
  });
});

app.get("/api/hoadon", (req, res) => {
  const sql = "SELECT * FROM HoaDon";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }

    res.json(result);
  });
});

app.post("/api/hoadon", (req, res) => {
  const hd = req.body;
  const sql = `INSERT INTO HoaDon (ma_hoadon, khachhang_id, nhanvien_id, ngay_tao, tong_tien, trang_thai)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    hd.ma_hoadon,
    hd.khachhang_id,
    hd.nhanvien_id,
    hd.ngay_tao,
    hd.tong_tien,
    hd.trang_thai,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm Hóa Đơn:", err);
      return res.status(500).json({ message: "Lỗi khi thêm hóa đơn!" });
    }
    res.status(201).json({ message: "Thêm hóa đơn thành công!", invoice: hd });
  });
});

// - Cập nhật hóa đơn
app.put("/api/hoadon/:ma_hoadon", (req, res) => {
  const ma_hoadon = req.params.ma_hoadon;
  const hd = req.body;
  const sql = `UPDATE HoaDon 
               SET khachhang_id = ?, nhanvien_id = ?, ngay_tao = ?, tong_tien = ?, trang_thai = ?
               WHERE ma_hoadon = ?`;
  const values = [
    hd.khachhang_id,
    hd.nhanvien_id,
    hd.ngay_tao,
    hd.tong_tien,
    hd.trang_thai,
    ma_hoadon,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật Hóa Đơn:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật hóa đơn!" });
    }
    res.json({ message: "Cập nhật hóa đơn thành công!" });
  });
});

// - Xóa hóa đơn
app.delete("/api/hoadon/:ma_hoadon", (req, res) => {
  const ma_hoadon = req.params.ma_hoadon;
  const sql = "DELETE FROM HoaDon WHERE ma_hoadon = ?";
  db.query(sql, [ma_hoadon], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa Hóa Đơn:", err);
      return res.status(500).json({ message: "Lỗi khi xóa hóa đơn!" });
    }
    res.json({ message: "Xóa hóa đơn thành công!" });
  });
});

// --- API: Lấy danh sách khách hàng ---
app.get("/api/khachhang", (req, res) => {
  const sql = "SELECT * FROM KhachHang";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy khách hàng:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(result);
  });
});

// --- API: Thêm khách hàng ---
app.post("/api/khachhang", (req, res) => {
  const kh = req.body;
  const sql =
    "INSERT INTO KhachHang (HoTen, SoDienThoai, Email, cap_bac) VALUES (?, ?, ?, ?)";
  const values = [kh.ten, kh.sdt, kh.email, kh.cap_bac];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi thêm khách hàng:", err);
      return res.status(500).json({ message: "Lỗi khi thêm khách hàng!" });
    }
    res.status(201).json({ message: "Thêm khách hàng thành công!" });
  });
});

// --- API: Xóa khách hàng ---
app.delete("/api/khachhang/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM KhachHang WHERE MaKH = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi xóa khách hàng:", err);
      return res.status(500).json({ message: "Lỗi khi xóa khách hàng!" });
    }
    res.json({ message: "Xóa khách hàng thành công!" });
  });
});

app.get("/api/khachhang/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM khachhang WHERE MaKH = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
    if (result.length === 0)
      return res.status(404).json({ error: "Không tìm thấy khách hàng" });
    res.json(result[0]);
  });
});

// --- API: Cập nhật khách hàng ---
app.put("/api/khachhang/:id", (req, res) => {
  const id = req.params.id;
  const kh = req.body;
  const sql = `
    UPDATE KhachHang 
    SET HoTen = ?, SoDienThoai = ?, Email = ?, cap_bac = ?
    WHERE MaKH = ?
  `;
  const values = [kh.ten, kh.sdt, kh.email, kh.cap_bac, id];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật khách hàng:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật khách hàng!" });
    }
    res.json({ message: "Cập nhật khách hàng thành công!" });
  });
});

// --- Lấy danh sách đặt bàn ---
app.get("/api/datban", (req, res) => {
  const sql = "SELECT * FROM DatBan";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu đặt bàn:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(results);
  });
});

// --- Thêm đặt bàn mới ---
app.post("/api/datban", (req, res) => {
  const { MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai } = req.body;
  const sql = `
    INSERT INTO DatBan
      (MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm đặt bàn:", err);
      return res.status(500).json({ message: "Lỗi thêm đặt bàn!" });
    }
    res
      .status(201)
      .json({ message: "Đặt bàn thành công!", MaDatBan: result.insertId });
  });
});

// --- Cập nhật đặt bàn ---
app.put("/api/datban/:id", (req, res) => {
  const MaDatBan = req.params.id;
  const { MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai } = req.body;
  const sql = `
    UPDATE DatBan
    SET MaKH = ?, MaBan = ?, NgayDat = ?, GioDat = ?, SoLuongNguoi = ?, TrangThai = ?
    WHERE MaDatBan = ?
  `;
  const values = [
    MaKH,
    MaBan,
    NgayDat,
    GioDat,
    SoLuongNguoi,
    TrangThai,
    MaDatBan,
  ];
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Lỗi khi cập nhật đặt bàn:", err);
      return res.status(500).json({ message: "Lỗi cập nhật đặt bàn!" });
    }
    res.json({ message: "Cập nhật đặt bàn thành công!" });
  });
});

// --- Xóa đặt bàn ---
app.delete("/api/datban/:id", (req, res) => {
  const MaDatBan = req.params.id;
  const sql = "DELETE FROM DatBan WHERE MaDatBan = ?";
  db.query(sql, [MaDatBan], (err) => {
    if (err) {
      console.error("Lỗi khi xóa đặt bàn:", err);
      return res.status(500).json({ message: "Lỗi xóa đặt bàn!" });
    }
    res.json({ message: "Xóa đặt bàn thành công!" });
  });
});

app.listen(5000, () => {
  console.log("Server đang chạy trên cổng 5000...");
});
