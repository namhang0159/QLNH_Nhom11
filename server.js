const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const e = require("express");

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

  const sql =
    "SELECT id,ten_tai_khoan,quyen,ho_ten,ngay_sinh,so_dien_thoai,email,luong,vi_tri FROM NhanVien WHERE ten_tai_khoan = ? AND mat_khau = ?";
  db.query(sql, [ten_tai_khoan, mat_khau], (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server!" });
    if (result.length > 0) {
      const user = result[0];
      res.json({
        message: "Đăng nhập thành công!",
        user_id: user.id,
        ten_tai_khoan: user.ten_tai_khoan,
        quyen: user.quyen,
        ho_ten: user.ho_ten,
        ngay_sinh: user.ngay_sinh,
        so_dien_thoai: user.so_dien_thoai,
        email: user.email,
        luong: user.luong,
        vi_tri: user.vi_tri,
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
  const sql = `INSERT INTO NhanVien (ho_ten, ngay_sinh, so_dien_thoai, email, vi_tri, luong, ten_tai_khoan, mat_khau, quyen, hieu_suat) 
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
               SET ho_ten = ?, ngay_sinh = ?, so_dien_thoai = ?, email = ?, vi_tri = ?, luong = ?, ten_tai_khoan = ?, mat_khau = ?, quyen = ?, hieu_suat = ?
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
  const sql = `INSERT INTO HoaDon (ma_hoadon, khachhang_id, nhanvien_id, tong_tien, trang_thai)
               VALUES (?, ?, ?, ?, ?)`;
  const values = [
    hd.ma_hoadon,
    hd.khachhang_id,
    hd.nhanvien_id,
    hd.tong_tien,
    hd.trang_thai,
  ];
  const rows = "SELECT * FROM HoaDon WHERE ma_hoadon = ?";
  db.query(rows, [hd.ma_hoadon], (err, rows) => {
    if (rows.length > 0) {
      return res.status(400).json({ message: "Mã hóa đơn đã tồn tại!" });
    } else {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Lỗi khi thêm Hóa Đơn:", err);
          return res.status(500).json({ message: "Lỗi khi thêm hóa đơn!" });
        }
        res
          .status(201)
          .json({ message: "Thêm hóa đơn thành công!", invoice: hd });
      });
    }
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
  const rows = "SELECT * FROM HoaDon WHERE ma_hoadon = ?";
  db.query(rows, [hd.ma_hoadon], (err, rows) => {
    if (rows.length < 0) {
      return res.status(400).json({ message: "Mã hóa đơn đã ko tồn tại!" });
    } else {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Lỗi cập nhật Hóa Đơn:", err);
          return res.status(500).json({ message: "Lỗi khi cập nhật hóa đơn!" });
        }
        res.json({ message: "Cập nhật hóa đơn thành công!" });
      });
    }
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

app.post("/api/datban", (req, res) => {
  const { MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai } = req.body;
  const today = new Date().toISOString().split("T")[0];

  // Kiểm tra ngày đặt
  if (NgayDat < today) {
    return res
      .status(400)
      .json({ message: "Ngày đặt phải là hôm nay hoặc tương lai" });
  }

  // Kiểm tra sự tồn tại của MaKH và MaBan
  db.query("SELECT * FROM KhachHang WHERE MaKH = ?", [MaKH], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra khách hàng:", err);
      return res.status(500).json({ message: "Lỗi kiểm tra khách hàng!" });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "Mã khách hàng không tồn tại!" });
    }

    db.query(
      "SELECT SoChoNgoi FROM BanAn WHERE MaBan = ?",
      [MaBan],
      (err, results) => {
        if (err) {
          console.error("Lỗi khi kiểm tra bàn ăn:", err);
          return res.status(500).json({ message: "Lỗi kiểm tra bàn ăn!" });
        }
        if (results.length === 0) {
          return res.status(400).json({ message: "Mã bàn không tồn tại!" });
        }

        // Kiểm tra số lượng người với số lượng người tối đa của bàn ăn
        const soLuongBan = results[0].SoChoNgoi;
        if (SoLuongNguoi > soLuongBan) {
          return res.status(400).json({
            message: `Số lượng người không thể vượt quá ${soLuongBan} người cho bàn này!`,
          });
        }

        // Kiểm tra trùng ngày giờ
        const sqlCheckDate = `
          SELECT * FROM DatBan
          WHERE MaBan = ? AND NgayDat = ? AND GioDat = ?
        `;
        db.query(sqlCheckDate, [MaBan, NgayDat, GioDat], (err, results) => {
          if (err) {
            console.error("Lỗi khi kiểm tra trùng ngày giờ:", err);
            return res
              .status(500)
              .json({ message: "Lỗi kiểm tra trùng ngày giờ!" });
          }
          if (results.length > 0) {
            return res
              .status(400)
              .json({ message: "Bàn này đã được đặt vào ngày và giờ này!" });
          }

          // Thực hiện thêm đặt bàn nếu mọi thứ đều hợp lệ
          const sql = `
            INSERT INTO DatBan (MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          const values = [
            MaKH,
            MaBan,
            NgayDat,
            GioDat,
            SoLuongNguoi,
            TrangThai,
          ];
          db.query(sql, values, (err, result) => {
            if (err) {
              console.error("Lỗi khi thêm đặt bàn:", err);
              return res.status(500).json({ message: "Lỗi thêm đặt bàn!" });
            }
            res.status(201).json({
              message: "Đặt bàn thành công!",
              MaDatBan: result.insertId,
            });
          });
        });
      }
    );
  });
});

// --- Cập nhật đặt bàn ---
// app.put("/api/datban/:id", (req, res) => {
//   const MaDatBan = req.params.id;
//   const { MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai } = req.body;
//   const today = new Date().toISOString().split("T")[0];
//   if (NgayDat < today) {
//     return res
//       .status(400)
//       .json({ message: "Ngày đặt phải là hôm nay hoặc tương lai" });
//   }
//   const sql = `
//     UPDATE DatBan
//     SET MaKH = ?, MaBan = ?, NgayDat = ?, GioDat = ?, SoLuongNguoi = ?, TrangThai = ?
//     WHERE MaDatBan = ?
//   `;
//   const values = [
//     MaKH,
//     MaBan,
//     NgayDat,
//     GioDat,
//     SoLuongNguoi,
//     TrangThai,
//     MaDatBan,
//   ];
//   db.query(sql, values, (err) => {
//     if (err) {
//       console.error("Lỗi khi cập nhật đặt bàn:", err);
//       return res.status(500).json({ message: "Lỗi cập nhật đặt bàn!" });
//     }
//     res.json({ message: "Cập nhật đặt bàn thành công!" });
//   });
// });
app.put("/api/datban/:id", (req, res) => {
  const MaDatBan = req.params.id;
  const { MaKH, MaBan, NgayDat, GioDat, SoLuongNguoi, TrangThai } = req.body;
  const today = new Date().toISOString().split("T")[0];

  // Kiểm tra ngày đặt
  if (NgayDat < today) {
    return res
      .status(400)
      .json({ message: "Ngày đặt phải là hôm nay hoặc tương lai" });
  }

  // Kiểm tra tồn tại MaDatBan
  db.query(
    "SELECT * FROM DatBan WHERE MaDatBan = ?",
    [MaDatBan],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra đặt bàn:", err);
        return res.status(500).json({ message: "Lỗi kiểm tra đặt bàn!" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Mã đặt bàn không tồn tại!" });
      }

      // Kiểm tra sự tồn tại của MaKH và MaBan
      db.query(
        "SELECT * FROM KhachHang WHERE MaKH = ?",
        [MaKH],
        (err, results) => {
          if (err) {
            console.error("Lỗi khi kiểm tra khách hàng:", err);
            return res
              .status(500)
              .json({ message: "Lỗi kiểm tra khách hàng!" });
          }
          if (results.length === 0) {
            return res
              .status(400)
              .json({ message: "Mã khách hàng không tồn tại!" });
          }

          db.query(
            "SELECT * FROM BanAn WHERE MaBan = ?",
            [MaBan],
            (err, results) => {
              if (err) {
                console.error("Lỗi khi kiểm tra bàn ăn:", err);
                return res
                  .status(500)
                  .json({ message: "Lỗi kiểm tra bàn ăn!" });
              }
              if (results.length === 0) {
                return res
                  .status(400)
                  .json({ message: "Mã bàn không tồn tại!" });
              }

              // Kiểm tra số lượng người với số lượng người tối đa của bàn ăn
              const soLuongBan = results[0].SoLuongNguoi;
              if (SoLuongNguoi > soLuongBan) {
                return res.status(400).json({
                  message: `Số lượng người không thể vượt quá ${soLuongBan} người cho bàn này!`,
                });
              }

              // Kiểm tra trùng ngày giờ
              const sqlCheckDate = `
            SELECT * FROM DatBan
            WHERE MaBan = ? AND NgayDat = ? AND GioDat = ? AND MaDatBan != ?
          `;
              db.query(
                sqlCheckDate,
                [MaBan, NgayDat, GioDat, MaDatBan],
                (err, results) => {
                  if (err) {
                    console.error("Lỗi khi kiểm tra trùng ngày giờ:", err);
                    return res
                      .status(500)
                      .json({ message: "Lỗi kiểm tra trùng ngày giờ!" });
                  }
                  if (results.length > 0) {
                    return res.status(400).json({
                      message: "Bàn này đã được đặt vào ngày và giờ này!",
                    });
                  }

                  // Tiến hành cập nhật đặt bàn
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
                      return res
                        .status(500)
                        .json({ message: "Lỗi cập nhật đặt bàn!" });
                    }
                    res.json({ message: "Cập nhật đặt bàn thành công!" });
                  });
                }
              );
            }
          );
        }
      );
    }
  );
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

app.get("/api/banan", (req, res) => {
  const sql = "SELECT * FROM banan";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu đặt bàn:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(results);
  });
});
// Thêm bàn ăn mới
app.post("/api/banan", (req, res) => {
  const { SoChoNgoi, ViTri } = req.body;
  const sql = "INSERT INTO banan (SoChoNgoi, ViTri) VALUES (?, ?)";
  const values = [SoChoNgoi, ViTri];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm bàn ăn:", err);
      return res.status(500).json({ message: "Lỗi khi thêm bàn ăn!" });
    }
    res.status(201).json({ message: "Thêm bàn ăn thành công!" });
  });
});
// Sửa thông tin bàn ăn
app.put("/api/banan/:id", (req, res) => {
  const id = req.params.id;
  const { SoChoNgoi, ViTri, TrangThai } = req.body;
  const sql = `
    UPDATE banan 
    SET SoChoNgoi = ?, ViTri = ?
    WHERE MaBan = ?`;
  const values = [SoChoNgoi, ViTri, TrangThai, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật bàn ăn:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật bàn ăn!" });
    }
    res.json({ message: "Cập nhật bàn ăn thành công!" });
  });
});
app.delete("/api/banan/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM banan WHERE MaBan = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa bàn ăn:", err);
      return res.status(500).json({ message: "Lỗi khi xóa bàn ăn!" });
    }
    res.json({ message: "Xóa bàn ăn thành công!" });
  });
});

// --- API: Lấy danh sách món ăn ---
app.get("/api/thucdon", (req, res) => {
  const sql = "SELECT * FROM Thucdon";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy món ăn:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(result);
  });
});

// --- API: Thêm món ăn ---
app.post("/api/thucdon", (req, res) => {
  const { TenMon, Gia, TrangThai } = req.body;
  const sql = `INSERT INTO Thucdon (TenMon, Gia, TrangThai) VALUES (?, ?, ?)`;
  const values = [TenMon, Gia, TrangThai];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi thêm món ăn:", err);
      return res.status(500).json({ message: "Lỗi khi thêm món ăn!" });
    }
    res.status(201).json({ message: "Thêm món ăn thành công!" });
  });
});

app.put("/api/thucdon/:id", (req, res) => {
  const id = req.params.id;
  const { TenMon, Gia, TrangThai } = req.body;
  const sql = `
    UPDATE thucdon 
    SET TenMon = ?, Gia = ?, TrangThai = ? 
    WHERE MaMon = ?`;
  const values = [TenMon, Gia, TrangThai, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật món ăn:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật món ăn!" });
    }
    res.json({ message: "Cập nhật món ăn thành công!" });
  });
});

app.delete("/api/thucdon/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM thucdon WHERE MaMon = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa món ăn:", err);
      return res.status(500).json({ message: "Lỗi khi xóa món ăn!" });
    }
    res.json({ message: "Xóa món ăn thành công!" });
  });
});

// --- API: Lấy danh sách kho ---
app.get("/api/kho", (req, res) => {
  const sql = "SELECT * FROM Kho";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy kho:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(result);
  });
});

// --- API: Thêm sản phẩm vào kho ---
app.post("/api/kho", (req, res) => {
  const { ten_nguyen_lieu, so_luong, don_vi, trang_thai, nhanvien_id } =
    req.body;
  const sql = `INSERT INTO kho (ten_nguyen_lieu, so_luong, don_vi, trang_thai,nhanvien_id) VALUES (?, ?, ?, ?, ?)`;
  const values = [ten_nguyen_lieu, so_luong, don_vi, trang_thai, nhanvien_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi thêm sản phẩm:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi thêm sản phẩm vào kho!" });
    }
    res.status(201).json({ message: "Thêm sản phẩm vào kho thành công!" });
  });
});

// --- API: Cập nhật sản phẩm trong kho ---
app.put("/api/kho/:id", (req, res) => {
  const id = req.params.id;
  const { ten_nguyen_lieu, so_luong, don_vi, trang_thai, nhanvien_id } =
    req.body;
  const sql = `
    UPDATE kho
    SET ten_nguyen_lieu = ?, so_luong = ?, don_vi = ?, trang_thai = ? , nhanvien_id=?
    WHERE id = ?
  `;
  const values = [
    ten_nguyen_lieu,
    so_luong,
    don_vi,
    trang_thai,
    nhanvien_id,
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Lỗi cập nhật sản phẩm kho:", err);
      return res.status(500).json({ message: "Lỗi cập nhật sản phẩm!" });
    }
    res.json({ message: "Cập nhật sản phẩm trong kho thành công!" });
  });
});

// --- API: Xóa sản phẩm khỏi kho ---
app.delete("/api/kho/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Kho WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa sản phẩm khỏi kho!" });
    }
    res.json({ message: "Xóa sản phẩm khỏi kho thành công!" });
  });
});

// --- API: Lấy danh sách giao hàng ---
app.get("/api/giaohang", (req, res) => {
  const sql = "SELECT * FROM giaohang";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy danh sách giao hàng:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(result);
  });
});

// --- API: Lấy 1 giao hàng theo mã ---
app.get("/api/giaohang/:madon", (req, res) => {
  const madon = req.params.madon;
  const sql = "SELECT * FROM giaohang WHERE madon = ?";
  db.query(sql, [madon], (err, result) => {
    if (err) {
      console.error("Lỗi lấy đơn giao hàng:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn giao hàng!" });
    }
    res.json(result[0]);
  });
});

// --- API: Thêm đơn giao hàng ---
app.post("/api/giaohang", (req, res) => {
  const { tenkh, sodienthoai, diachi, trangthai, hoadonid } = req.body;
  const sql = `
    INSERT INTO giaohang (tenkh, sodienthoai, diachi, trangthai, hoadonid)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [tenkh, sodienthoai, diachi, trangthai, hoadonid];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi thêm đơn giao hàng:", err);
      return res.status(500).json({ message: "Lỗi khi thêm giao hàng!" });
    }
    res.status(201).json({ message: "Thêm giao hàng thành công!" });
  });
});

// --- API: Cập nhật đơn giao hàng ---
app.put("/api/giaohang/:madon", (req, res) => {
  const madon = req.params.madon;
  const { tenkh, sodienthoai, diachi, trangthai, hoadonid } = req.body;
  const sql = `
    UPDATE giaohang
    SET tenkh = ?, sodienthoai = ?, diachi = ?, trangthai = ?, hoadonid = ?
    WHERE madon = ?
  `;
  const values = [tenkh, sodienthoai, diachi, trangthai, hoadonid, madon];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Lỗi cập nhật đơn giao hàng:", err);
      return res.status(500).json({ message: "Lỗi khi cập nhật giao hàng!" });
    }
    res.json({ message: "Cập nhật giao hàng thành công!" });
  });
});

// --- API: Xóa đơn giao hàng ---
app.delete("/api/giaohang/:madon", (req, res) => {
  const madon = req.params.madon;
  const sql = "DELETE FROM giaohang WHERE madon = ?";

  db.query(sql, [madon], (err) => {
    if (err) {
      console.error("Lỗi xóa đơn giao hàng:", err);
      return res.status(500).json({ message: "Lỗi khi xóa giao hàng!" });
    }
    res.json({ message: "Xóa giao hàng thành công!" });
  });
});

app.get("/api/chitiethd", (req, res) => {
  const sql = "SELECT * FROM chitiethd";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi lấy danh sách ", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }
    res.json(result);
  });
});

app.post("/api/chitiethd", (req, res) => {
  const { MaHD, MaMon, SoLuong } = req.body;
  const checkStockSql = "SELECT Gia,TrangThai FROM thucdon WHERE MaMon = ?";
  db.query(checkStockSql, [MaMon], (err, results) => {
    if (err) {
      console.error("Lỗi kiểm tra món ăn:", err);
      return res.status(500).json({ message: "Lỗi server!" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Món ăn không tồn tại!" });
    }

    const { Gia, TrangThai } = results[0];

    if (TrangThai === "Hết hàng") {
      return res
        .status(400)
        .json({ message: "Món ăn đã hết hàng hoặc không đủ số lượng!" });
    }
    const sqlInsert =
      "INSERT INTO chitiethd (MaHD, MaMon, SoLuong) VALUES (?, ?, ?)";
    db.query(sqlInsert, [MaHD, MaMon, SoLuong], (err, result) => {
      if (err) {
        console.error("Lỗi thêm chi tiết hóa đơn:", err);
        return res
          .status(500)
          .json({ message: "Lỗi khi thêm chi tiết hóa đơn!" });
      }

      const sqlUpdate = `
      UPDATE hoadon h
      SET tong_tien = (
        SELECT COALESCE(SUM(cd.SoLuong * td.Gia), 0)
        FROM chitiethd cd
        JOIN thucdon td ON cd.MaMon = td.MaMon
        WHERE cd.MaHD = ?
      )
      WHERE h.ma_hoadon = ?;
    `;
      db.query(sqlUpdate, [MaHD, MaHD], (err2) => {
        if (err2) console.error("Lỗi cập nhật tong_tien:", err2);
        res
          .status(201)
          .json({ message: "Thêm chi tiết và cập nhật tổng tiền thành công!" });
      });
    });
  });
});

app.delete("/api/chitiethd/:MaCTHD", (req, res) => {
  const MaCTHD = req.params.MaCTHD;

  db.query(
    "SELECT MaHD FROM chitiethd WHERE MaCTHD = ?",
    [MaCTHD],
    (err, rows) => {
      if (err || rows.length === 0)
        return res
          .status(400)
          .json({ message: "Không tìm thấy chi tiết hóa đơn" });
      const MaHD = rows[0].MaHD;

      db.query("DELETE FROM chitiethd WHERE MaCTHD = ?", [MaCTHD], (err2) => {
        if (err2)
          return res
            .status(500)
            .json({ message: "Lỗi khi xóa chi tiết hóa đơn" });

        const sqlUpdate = `
        UPDATE hoadon h
        SET tong_tien = (
          SELECT COALESCE(SUM(cd.SoLuong * td.Gia), 0)
          FROM chitiethd cd
          JOIN thucdon td ON cd.MaMon = td.MaMon
          WHERE cd.MaHD = ?
        )
        WHERE h.ma_hoadon = ?;
      `;
        db.query(sqlUpdate, [MaHD, MaHD], (err3) => {
          if (err3) console.error("Lỗi cập nhật tong_tien:", err3);
          res.json({
            message: "Xóa chi tiết và cập nhật tổng tiền thành công!",
          });
        });
      });
    }
  );
});

app.listen(5000, () => {
  console.log("Server đang chạy trên cổng 5000...");
});
