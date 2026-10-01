# Nhóm 8 — Hệ thống giao thông thông minh

- [Toàn bộ tài liệu](docs/README.md)
- [Hướng dẫn và kịch bản demo L01 / UC-DEMO-01](docs/demo/HUONG_DAN_L01.md)
- Mã nguồn: `demo/`

## Chạy demo

Cần Node.js 22.13 trở lên. Đã kiểm tra với Node.js 25.8.2.

```powershell
cd demo
npm ci
npm start
```

Mở **http://localhost:3000**. Tài khoản: **demo** / **Demo@123**.

Trên Windows, có thể chạy `Chay_demo.ps1` bằng PowerShell. Script sẽ cài thư viện nếu máy chưa có, rồi khởi động máy chủ.

## Kiểm tra

```powershell
cd demo
npm test
```

Luồng đã triển khai: đăng nhập → tra cứu bản đồ → lọc thời điểm/trạng thái/tên đường → xem chi tiết → chuyển bản đồ/bảng → đăng xuất. Dữ liệu hoàn toàn mô phỏng; không phải quan trắc thực địa.
