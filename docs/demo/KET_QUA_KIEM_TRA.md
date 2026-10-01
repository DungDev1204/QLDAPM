# Kết quả kiểm tra demo L01

Môi trường: Windows, Node.js 25.8.2, Chrome. Ngày kiểm tra: 30/09/2026.

## Kiểm thử tự động

Chạy `npm test` tại `demo/`: **10 bài kiểm thử đạt**.

Bao phủ xác thực bắt buộc tại API; tài khoản sai/khóa; băm mật khẩu; thuộc tính cookie; 10 đoạn GeoJSON; tìm kiếm không dấu; lọc trạng thái/thời gian; mốc không có dữ liệu; ngưỡng phân loại; hết phiên; quyền bị từ chối; CSRF; đăng xuất và nhật ký; không phục vụ tệp mã máy chủ/cơ sở dữ liệu qua HTTP.

## Kiểm tra trực tiếp trên trình duyệt

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

## Giới hạn kiểm tra

- Chưa thực hiện kiểm thử tải 20 người dùng hoặc đo p95; không khẳng định đạt NFR hiệu năng của toàn dự án.
- Chưa thao tác ngắt mạng để kiểm chứng thực tế nhánh tự chuyển nền OpenStreetMap. Nhánh dự phòng đã có trong mã; nền mô phỏng mặc định đã được dùng xuyên suốt kiểm tra.
- Đây là bản demo một UC, không phải kết quả nghiệm thu toàn bộ hệ thống.
