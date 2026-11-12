# Nhóm 8 — Hệ thống giao thông thông minh

- [Toàn bộ tài liệu](docs/README.md)
- [Hướng dẫn và kịch bản demo L01 / UC-DEMO-01](docs/demo/HUONG_DAN_L01.md)
- Mã nguồn: `demo/`

## Mang demo đi thuyết trình

Trên Windows 10/11 64-bit (x64), chỉ cần copy **`outputs/demo-thuyet-trinh/Mo_Demo_Nhom8.exe`** sang máy khác hoặc USB rồi nhấp đúp. Web demo tự mở trong trình duyệt mặc định. Đăng nhập **demo / Demo@123**. Không cần clone dự án, mở code, cài Node.js hoặc chạy npm.

Để mở lại trang, chạy file `.exe` lần nữa. Để tắt máy chủ demo, chuột phải biểu tượng demo ở khay hệ thống → **Tắt demo**. Nền sơ đồ và dữ liệu mẫu dùng được offline; nền OpenStreetMap chi tiết cần Internet. Hướng dẫn đi kèm: `outputs/demo-thuyet-trinh/HUONG_DAN.txt`.

Bản chạy tạo dữ liệu riêng trong `%LOCALAPPDATA%\Nhom8TrafficDemo`, không chứa tài khoản hay phiên đăng nhập từ cơ sở dữ liệu trên máy phát triển. File chưa ký số, nên hãy thử trước trên máy báo cáo.

Để nhóm tạo lại bộ chạy sau khi sửa demo (máy phát triển cần có thư viện Leaflet trong `demo/node_modules`):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File demo/portable/Build-Portable.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File demo/portable/Test-Portable.ps1
```

Script tải bản Node.js Windows x64 chính thức, xác minh SHA-256, nhúng bộ chạy và ứng dụng vào một `.exe`. Kiểm tra portable chạy file đã copy riêng với PATH không có Node/npm, xác thực, tải 10 tuyến OSM và tài nguyên cục bộ, rồi kiểm tra máy chủ đã tắt; lặp lại để kiểm tra lần mở sau.

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

Luồng đã triển khai: đăng nhập → tra cứu bản đồ → lọc thời điểm/trạng thái/tên đường → xem chi tiết → chuyển bản đồ/bảng → đăng xuất. Số liệu giao thông hoàn toàn mô phỏng; không phải quan trắc thực địa. Hình học tuyến đường dùng bản chụp [OpenStreetMap](https://www.openstreetmap.org/copyright) lưu cục bộ, theo giấy phép ODbL; các đoạn và hai chiều đường được giữ riêng để bám theo nền bản đồ.
