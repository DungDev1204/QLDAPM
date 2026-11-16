# Kết quả kiểm tra demo L01

Môi trường: Windows 10, Chrome. Kiểm thử tự động chạy lại ngày 12/11/2026 với Node.js 24.11.1. Lần kiểm tra trên trình duyệt trước đó: 30/09/2026, Node.js 25.8.2. Yêu cầu tối thiểu là Node.js 22.13 vì demo dùng `node:sqlite`.

## Kiểm thử tự động

Chạy `npm test` tại `demo/` cho kết quả **13/13 bài kiểm thử đạt**: 10 bài trong `test/traffic.test.mjs` và 3 bài trong `test/geometry.test.mjs`.

| Tệp | Nội dung bao phủ |
|---|---|
| `traffic.test.mjs` (10) | API bắt buộc xác thực; chặn đọc tệp mã máy chủ và cơ sở dữ liệu qua HTTP; sai mật khẩu và tài khoản khóa; băm mật khẩu; cookie HttpOnly/SameSite; 10 đoạn GeoJSON; tìm không dấu; lọc trạng thái và thời gian; mốc không có dữ liệu; ngưỡng 0,3/0,6, quá 120 giây, tối thiểu 8/10 bản tin; JSON sai kiểu và yêu cầu khác nguồn; vai trò không hỗ trợ nhận 403; hết phiên; CSRF khi đăng xuất, thu hồi phiên và ghi nhật ký |
| `geometry.test.mjs` (3) | Hình học OSM có nút giao thật và giữ riêng hai chiều đường; điểm giữa bám theo đường cong; nâng cấp hình học trong cơ sở dữ liệu cũ vẫn giữ dữ liệu người dùng |

## Kiểm tra trực tiếp trên trình duyệt

Thực hiện ngày 30/09/2026. Tám ca thủ công tương ứng nằm trong `Test_case_L01_Nhom_8.xlsx` (mã L01-TC01 đến L01-TC08). Thành viên phụ trách kiểm thử cần chạy lại các ca này và ghi tên người thực hiện trước khi nộp.

| Tình huống | Kết quả quan sát |
|---|---|
| Đăng nhập bằng tài khoản demo | Mở được trang bản đồ với 10 đoạn đường |
| Chi tiết Nguyễn Trãi tại 08:00 | 12 km/h; 10/10 bản tin; tỷ lệ 0,24; nguy cơ ùn tắc |
| Lọc Thông thoáng, chuyển sang bảng | Hiển thị đúng 4 đoạn: Trần Phú, Quang Trung, Lê Văn Lương, Nguyễn Xiển |
| Tìm `nguyen trai`, mốc 07:50 | Một kết quả; 34 km/h; thông thoáng |
| Vũ Trọng Phụng tại 08:00 | Mất cập nhật; quan trắc 07:52; số liệu hiện tại là “—” |
| Mốc 29/09 không có dữ liệu | Có thông báo và mốc dữ liệu gần nhất trong bộ mẫu |
| Tìm tên đường không tồn tại | 0/10 kết quả và thông báo phù hợp |
| Bật lớp điểm đo, chọn điểm trên bản đồ | Hiện các điểm đo và mở khung chi tiết |
| Đăng xuất rồi đăng nhập bằng mật khẩu sai | Trở về đăng nhập; thông báo lỗi khi nhập sai |
| Chiều rộng 360 px | Không tràn ngang toàn trang; bảng cuộn trong vùng riêng; mở được chi tiết |
| Nhật ký lỗi JavaScript trong phiên kiểm tra | Không ghi nhận lỗi JavaScript |

## Ánh xạ với ca kiểm thử trong báo cáo

| Ca trong báo cáo (mục 9.4–9.5) | Phần được kiểm chứng bởi demo L01 |
|---|---|
| TC01 Đăng nhập/đăng xuất | Đạt: test tự động và L01-TC01, L01-TC08 |
| TC02 Vượt quyền | Một phần: vai trò không hỗ trợ nhận 403. Chưa có API ghi nên chưa kiểm tra quyền ghi |
| TC03 Bản đồ, lọc, chưa quan trắc | Đạt: L01-TC02 đến L01-TC07 |
| TC18 Mất mạng, màn hình 360 px | Một phần: đã kiểm tra màn hình 360 px; chưa ngắt mạng thật |
| TC04–TC17, TC19–TC22 | Ngoài phạm vi demo L01 (xem CR-02 trong `docs/quan-ly/So_CR.md`) |

## Giới hạn kiểm tra

- Chưa thực hiện kiểm thử tải 20 người dùng hoặc đo p95, nên không khẳng định đạt NFR hiệu năng của toàn dự án.
- Chưa ngắt mạng thật để kiểm chứng nhánh tự chuyển nền OpenStreetMap. Nhánh dự phòng đã có trong mã; nền mô phỏng mặc định được dùng xuyên suốt kiểm tra.
- Đây là bản demo một UC, không phải kết quả nghiệm thu toàn bộ hệ thống.
