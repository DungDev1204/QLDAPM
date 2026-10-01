# Demo L01 / UC-DEMO-01 — Tra cứu bản đồ giao thông

## 1. Phạm vi đã triển khai

Một UC nghiệp vụ tra cứu bản đồ cùng đăng nhập/đăng xuất dùng chung. Người dùng xem 10 đoạn đường mô phỏng ở phía Tây Nam Hà Nội, lọc theo tên/mã, trạng thái và mốc thời gian; chọn đoạn đường để xem thông số, nguồn và thời điểm quan trắc.

| Thành phần UC | Nội dung |
|---|---|
| Tác nhân | Người xem bản đồ, người vận hành, người quản lý |
| Tiền điều kiện | Máy chủ hoạt động; tài khoản hợp lệ, chưa bị khóa |
| Kích hoạt | Đăng nhập và mở Bản đồ giao thông |
| Luồng chính | Xác thực → tải GeoJSON và quan trắc → chọn bộ lọc → chọn đoạn đường → xem chi tiết → đăng xuất |
| Hậu điều kiện | Hiển thị đúng dữ liệu theo bộ lọc; dữ liệu giao thông không bị thay đổi; đăng xuất hủy phiên phía máy chủ |
| Ngoại lệ | Sai tài khoản; tài khoản khóa; hết phiên; thiếu dữ liệu; dữ liệu cũ; không có kết quả; nền bản đồ hoặc API lỗi |

Không triển khai các UC tạo sự cố, duyệt phản ánh, xe buýt, bãi đỗ hoặc AI trong bản demo này.

## 2. Cài đặt và chạy

Yêu cầu Node.js **22.13 trở lên** và npm. Kiểm tra bằng `node --version`. Môi trường thực hiện: Windows, Node.js 25.8.2.

Tại thư mục gốc dự án:

```powershell
cd demo
npm ci
npm start
```

Mở **http://localhost:3000**. Dừng máy chủ bằng `Ctrl+C`. Máy chủ chỉ lắng nghe trên máy cục bộ `127.0.0.1`.

Hoặc chạy `Chay_demo.ps1` ở thư mục gốc bằng PowerShell. Nếu cổng 3000 đã được dùng, chạy:

```powershell
$env:PORT=3001
npm start
```

Sau đó mở `http://localhost:3001`. Thư viện Leaflet được phục vụ từ máy cục bộ. Chỉ cần Internet khi cài thư viện lần đầu hoặc bật nền OpenStreetMap.

## 3. Tài khoản thử

| Tên đăng nhập | Mật khẩu | Vai trò | Kết quả |
|---|---|---|---|
| `demo` | `Demo@123` | Người xem bản đồ | Đăng nhập, tra cứu |
| `vanhanh` | `Demo@123` | Người vận hành | Đăng nhập, tra cứu |
| `quanly` | `Demo@123` | Người quản lý | Đăng nhập, tra cứu |
| `bikhoa` | `Demo@123` | Tài khoản bị khóa | Bị từ chối đăng nhập |

Đây là tài khoản công khai chỉ phục vụ trình diễn cục bộ. Mật khẩu được băm bằng scrypt trong SQLite. Phiên có thời hạn 30 phút, dùng cookie HttpOnly và SameSite; đăng xuất kiểm tra CSRF và xóa phiên ở máy chủ. Khi triển khai HTTPS, đặt `COOKIE_SECURE=1` để thêm thuộc tính Secure; bản hiện tại chạy HTTP cục bộ.

## 4. Kịch bản demo chính, khoảng 3–5 phút

1. Mở trang đăng nhập. Chọn **Điền tài khoản**, sau đó **Đăng nhập**.
2. Giới thiệu nhãn **Dữ liệu mô phỏng**. Mặc định chọn mốc **08:00 · 30/09/2026**, xem đủ 10 đoạn đường.
3. Giới thiệu chú giải: thông thoáng, đông, nguy cơ ùn tắc, mất cập nhật, thiếu dữ liệu, chưa quan trắc. Bốn thẻ tổng quan luôn tính trên toàn bộ 10 đoạn tại mốc thời gian đang xem.
4. Chọn **Nguyễn Trãi** trong danh sách hoặc trên bản đồ. Xem tốc độ **12 km/h**, tốc độ tham chiếu **50 km/h**, tỷ lệ **0,24** và **10/10** bản tin hợp lệ.
5. Giải thích tỷ lệ dưới 0,3 là **Nguy cơ ùn tắc**. Đây là phân mức quan trắc của một cửa sổ, chưa phải cảnh báo hai cửa sổ hay sự cố đã xác minh.
6. Lọc **Thông thoáng**, chọn **Áp dụng bộ lọc**. Tại mốc mặc định có bốn đoạn phù hợp.
7. Chuyển sang **Bảng dữ liệu**. Bộ lọc và đoạn đang chọn được giữ khi chuyển chế độ. Chọn tên đường trong bảng để xem chi tiết.
8. Đặt lại bộ lọc, tìm `nguyen trai` không dấu. Chọn mốc **07:50** rồi áp dụng: tốc độ thành **34 km/h**, trạng thái **Thông thoáng**.
9. Chọn **Đặt lại**, bật/tắt **Trạng thái giao thông** để chuyển giữa đường có màu trạng thái và đường màu trung tính. Bật **Điểm đo mô phỏng** để xem điểm nguồn quan trắc.
10. Chọn **Đăng xuất**. Giao diện trở về trang đăng nhập; phiên cũ không đọc được API dữ liệu.

Nếu trước đó đã thay bộ lọc, ứng dụng nhớ lựa chọn trong trình duyệt. Chọn **Đặt lại** trước khi bắt đầu bài trình diễn để trở về mốc 08:00 và toàn bộ đoạn đường.

## 5. Kịch bản ngoại lệ

| Kịch bản | Cách thao tác | Kết quả mong đợi |
|---|---|---|
| Sai mật khẩu | Nhập `demo` và mật khẩu sai | Thông báo lỗi, không vào ứng dụng |
| Tài khoản khóa | Dùng `bikhoa` / `Demo@123` | Từ chối đăng nhập |
| Dữ liệu cũ | Mốc 08:00, chọn Vũ Trọng Phụng | Mất cập nhật; bản tin lúc 07:52; thông số hiện tại hiển thị “—” |
| Chưa đủ bản tin | Chọn Chiến Thắng | Thiếu dữ liệu; 5/10 bản tin; không thay thông số bằng 0 |
| Chưa quan trắc | Chọn Văn Quán | Không có bản ghi; vẫn thấy hình học đường |
| Không có dữ liệu ở mốc xem | Chọn 08:00 ngày 29/09, áp dụng | Hiển thị thông báo và mốc có dữ liệu gần nhất trong bộ mẫu; vẫn xem được hình học |
| Không có đoạn phù hợp | Tìm `khong-co-duong-nay`, áp dụng | Danh sách rỗng, thông báo đổi bộ lọc |
| Nền trực tuyến lỗi | Ngắt Internet nhưng giữ máy chủ chạy, bật nền OpenStreetMap | Tự trở về nền mô phỏng khi nhận lỗi tải ô bản đồ hoặc hết thời gian chờ |
| Máy chủ mất kết nối | Sau khi đã tải dữ liệu, dừng máy chủ rồi chọn Tải lại | Thông báo không tải được; kết quả cũ có nhãn, không thông báo thành công |
| Hết phiên | Phiên quá 30 phút hoặc kiểm tra bằng bài test tự động | API trả 401; thao tác tiếp theo đưa người dùng về đăng nhập |
| API không có phiên | Truy cập `/api/traffic` bằng cửa sổ riêng chưa đăng nhập | API trả 401 |

## 6. Dữ liệu và quy tắc

- 10 đoạn đường với hình học GeoJSON được đơn giản hóa theo khu vực Hà Đông, Thanh Xuân. Vị trí, ranh giới và số liệu chỉ phục vụ học phần.
- Có ba ảnh chụp quan trắc: 07:50, 07:55 và 08:00 ngày 30/09/2026, giờ Việt Nam. Một mốc 29/09 không có dữ liệu dùng thử ngoại lệ.
- Thời gian mô phỏng cố định để có thể trình diễn lại; độ cũ được tính so với **mốc đang xem**, không so với giờ thật của máy. Phiên đăng nhập vẫn hết hạn theo giờ thật.
- Tốc độ tham chiếu > 0; đủ ít nhất 8/10 bản tin mới được phân mức. Tỷ lệ tốc độ ≥ 0,6: thông thoáng; ≥ 0,3 và < 0,6: đông; < 0,3: nguy cơ ùn tắc.
- Bản tin quá 120 giây: mất cập nhật. Thiếu tốc độ hoặc không đủ bản tin: thiếu dữ liệu. Không có quan trắc: chưa quan trắc.
- Màu luôn đi kèm nhãn trong danh sách, bảng, chú giải và khung chi tiết.
- Lớp bản đồ nền mặc định chạy cục bộ; OpenStreetMap chỉ là tùy chọn cần Internet. Lớp đường mô phỏng và API cục bộ hoạt động độc lập với nền trực tuyến.

## 7. Cấu trúc mã và lưu trữ

```text
demo/
  server.mjs           Máy chủ HTTP, API, phiên và kiểm tra quyền
  src/database.mjs    Tạo SQLite, tài khoản, dữ liệu mẫu
  src/fixtures.mjs    GeoJSON, các mốc quan trắc, quy tắc phân loại
  public/index.html   Giao diện đăng nhập và tra cứu
  public/style.css    Giao diện máy tính và điện thoại
  public/app.js       Tương tác bản đồ, bộ lọc, bảng và xử lý lỗi
  test/traffic.test.mjs  Kiểm thử API, xác thực và nghiệp vụ
  data/demo.sqlite    Sinh tự động khi chạy lần đầu
```

SQLite lưu tài khoản, phiên, nhật ký đăng nhập/đăng xuất, đoạn đường và quan trắc. Dữ liệu được giữ khi khởi động lại. Bộ lọc lưu trong localStorage; không lưu mật khẩu hay token phiên tại đó. Nếu muốn tạo lại dữ liệu mẫu sau khi sửa fixtures, dừng máy chủ, sao lưu rồi xóa `demo/data/demo.sqlite` cùng các tệp WAL/SHM nếu còn, sau đó chạy lại.

API chính:

| Phương thức | Đường dẫn | Mục đích |
|---|---|---|
| POST | `/api/login` | Xác thực và tạo phiên |
| GET | `/api/session` | Kiểm tra phiên, lấy vai trò và CSRF token |
| GET | `/api/meta` | Danh sách mốc xem và nhãn trạng thái |
| GET | `/api/traffic?period=0800&status=all&q=` | Lọc phía máy chủ và trả các Feature GeoJSON |
| POST | `/api/logout` | Kiểm tra CSRF, hủy phiên |

## 8. Kiểm thử

```powershell
cd demo
npm test
```

Các bài test dùng SQLite riêng trong bộ nhớ, không sửa cơ sở dữ liệu đang demo. Bao phủ đăng nhập sai/đúng, tài khoản khóa, quyền, hết phiên, đăng xuất, CSRF, lọc, mốc rỗng, ngưỡng 0,3/0,6, dữ liệu cũ và chất lượng bản tin.

Tài liệu kỹ thuật dùng khi triển khai: [Leaflet 1.9.4](https://leafletjs.com/reference.html), [Node.js SQLite](https://nodejs.org/api/sqlite.html). Không cần khóa API bản đồ để chạy nền mô phỏng.
