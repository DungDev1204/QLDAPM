# Đặc tả Use Case để lựa chọn chức năng demo

**Dự án:** Hệ thống quản lý giao thông thông minh — Nhóm 8  
**Mục đích:** Chọn **một luồng chức năng** để xây dựng bản demo độc lập.  
**Căn cứ:** Báo cáo `Bao_cao_QLDA_Giao_thong_Thong_minh_Nhom_8.docx`, các mục 2.1–2.17.  
**Trạng thái:** Đặc tả UC để lựa chọn; chưa triển khai code demo.

**Quy ước:** L01–L14 là mã lựa chọn. UC-DEMO-01–UC-DEMO-14 là mã đặc tả trong tài liệu này, không thay thế mã UC trong báo cáo gốc. Một luồng là một kịch bản của UC; một kịch bản demo đầu cuối có thể đi qua nhiều UC, ví dụ Đăng nhập → Quản lý sự cố → Đăng xuất.

## 1. Phạm vi chung của bản demo

- Mỗi lựa chọn bên dưới bắt đầu bằng đăng nhập, thực hiện một nghiệp vụ và kết thúc khi đã có kết quả rõ ràng. Đăng xuất là bước cuối để kết thúc phiên trình diễn.
- Chỉ xây màn hình và dữ liệu phục vụ luồng được chọn. Các đối tượng liên quan như đoạn đường, tài khoản hoặc cảnh báo có thể được tạo sẵn.
- Dữ liệu giao thông, vị trí và tài khoản là dữ liệu mẫu. Các chức năng mô phỏng phải có nhãn nhận biết.
- Đăng nhập phải kiểm tra tài khoản và vai trò. Máy chủ kiểm tra quyền đối với thao tác ghi và dữ liệu riêng.
- Những thay đổi dữ liệu trong luồng cần được lưu để tải lại trang vẫn xem được kết quả. Có thể dùng cơ sở dữ liệu cục bộ cho bản demo.
- Chưa ấn định công nghệ, thời gian thực hiện hoặc ngày hoàn thành. Số màn hình và mức độ phức tạp dưới đây là đề xuất để so sánh các lựa chọn.

## 2. Bảng lựa chọn nhanh

| Mã | Luồng demo | Vai trò chính | Kết quả cuối | Mức độ tương đối | Màn hình dự kiến |
|---|---|---|---|---|---|
| L01 | Tra cứu bản đồ giao thông | Người dùng / vận hành | Xem trạng thái và chi tiết đoạn đường | Vừa | 2 |
| L02 | Xác minh cảnh báo ùn tắc | Vận hành | Cảnh báo có kết luận và liên kết sự cố nếu được xác nhận | Khá | 3 |
| L03 | Quản lý sự cố giao thông | Vận hành | Phiếu được xử lý, đóng và có lịch sử | Vừa | 3–4 |
| L04 | Gửi và duyệt phản ánh | Người dân + vận hành | Người gửi xem được kết quả duyệt | Vừa | 4–5 |
| L05 | Theo dõi xe buýt | Người dùng / vận hành | Xem vị trí xe và thời điểm cập nhật | Vừa | 2 |
| L06 | Cập nhật bãi đỗ xe | Vận hành | Số chỗ còn được tính và lưu chính xác | Dễ | 3 |
| L07 | Quản lý công trình giao thông | Vận hành | Công trình được lưu và lọc theo thời gian hiệu lực | Dễ–vừa | 3 |
| L08 | Thống kê và xuất CSV | Quản lý | Tải được tệp khớp bộ lọc trên màn hình | Dễ–vừa | 2 |
| L09 | Quản lý tài khoản | Quản trị viên | Tạo, phân quyền hoặc khóa tài khoản | Dễ–vừa | 3 |
| L10 | Cấu hình ngưỡng cảnh báo | Quản trị viên | Lưu cấu hình hợp lệ và ghi nhật ký | Vừa | 2–3 |
| L11 | Tra cứu nhật ký thao tác | Quản trị viên | Tìm và xem được lịch sử của một đối tượng | Dễ | 2 |
| L12 | Xem dự báo tốc độ giao thông | Vận hành / quản lý | Xem dự báo, phiên bản và trạng thái dữ liệu | Khá | 2–3 |
| L13 | Tiếp nhận dữ liệu IoT mô phỏng | Vận hành + bộ phát | Gói hợp lệ được lưu; gói lỗi/trùng được xử lý đúng | Khá | 3 |
| L14 | Quản lý danh mục đoạn đường | Vai trò được cấp quyền quản lý danh mục | Lưu đoạn đường và xem hình học trên bản đồ | Vừa | 3 |

Số màn hình đã tính màn hình đăng nhập. Có thể dùng hộp thoại hoặc các tab để giảm số trang thực tế. Vai trò quản lý danh mục ở L14 và quyền xem dự báo ở L12 là đề xuất cụ thể hóa cho demo, cần chốt khi chọn luồng.

## 3. Đặc tả các Use Case chức năng

Trong mỗi đặc tả, **luồng chính của UC nghiệp vụ bắt đầu sau khi đăng nhập thành công**. Các bước đăng nhập, đổi tài khoản và đăng xuất được giữ trong kịch bản demo để người trình bày có thể thao tác từ đầu đến cuối. L04 đi qua hai UC nghiệp vụ liên quan: gửi/theo dõi phản ánh và duyệt phản ánh; không phải một UC đơn lẻ. Nếu yêu cầu chỉ một UC nghiệp vụ, ưu tiên L03 hoặc L06.

Đăng nhập là tiền điều kiện của các UC nghiệp vụ, không mặc định vẽ quan hệ «include» từ mọi UC tới Đăng nhập: phiên đăng nhập có thể được dùng lại qua nhiều chức năng.

### L01 — Đăng nhập → Tra cứu bản đồ giao thông

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-01 |
| Tên UC | Tra cứu bản đồ giao thông |
| Tác nhân | Người dùng, người vận hành hoặc người quản lý |
| Mục tiêu | Xem thông tin giao thông của đoạn đường theo bộ lọc. |
| Kích hoạt | Chọn mục Bản đồ giao thông. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền xem lớp thông tin được yêu cầu; danh mục đoạn đường đã có. |
| Hậu điều kiện thành công | Thông tin phù hợp bộ lọc được hiển thị; dữ liệu nghiệp vụ không bị thay đổi. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Không có dữ liệu: hiển thị thông báo và thời điểm gần nhất.
- A02: Dữ liệu cũ: gắn nhãn mất cập nhật, không thể hiện như dữ liệu bình thường.
- A03: Nền bản đồ lỗi: hiển thị lớp GeoJSON trên nền trống.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR03, FR05; mục 2.12.

1. Người dùng nhập tài khoản và mật khẩu.
2. Hệ thống xác thực, mở bản đồ giao thông.
3. Người dùng bật lớp trạng thái giao thông và chọn đoạn đường hoặc thời gian cần xem.
4. Hệ thống hiển thị màu, nhãn trạng thái, nguồn và thời điểm cập nhật.
5. Người dùng chọn một đoạn đường để xem tốc độ, lưu lượng và chất lượng dữ liệu.
6. Người dùng đổi bộ lọc để so sánh với đoạn đường khác.
7. Kết thúc khi xem được thông tin cần tra cứu; đăng xuất.

**Màn hình:** Đăng nhập; bản đồ có bộ lọc và khung chi tiết.  
**Dữ liệu mẫu:** 10 đoạn đường; các trạng thái thông thoáng, đông, nguy cơ ùn tắc và mất cập nhật.  
**Tình huống cần thể hiện:** Không có dữ liệu; dữ liệu quá cũ; nền bản đồ không tải được nhưng vẫn xem được GeoJSON trên nền trống.  
**Giới hạn demo:** Dùng quan trắc đã chuẩn bị sẵn; chưa cần xây bộ tiếp nhận IoT hoặc AI.

### L02 — Đăng nhập → Xác minh cảnh báo ùn tắc

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-02 |
| Tên UC | Xác minh cảnh báo |
| Tác nhân | Người vận hành |
| Mục tiêu | Ghi nhận kết luận xác minh một cảnh báo. |
| Kích hoạt | Chọn cảnh báo đang mở để xác minh. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền xử lý cảnh báo; cảnh báo và dữ liệu quan trắc liên quan đã tồn tại. |
| Hậu điều kiện thành công | Kết luận, người xác minh và thời điểm được lưu; có mã sự cố liên kết nếu chọn tạo sự cố. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Loại bỏ cảnh báo: nhập lý do, lưu kết luận, kết thúc UC.
- A02: Thiếu dữ liệu: ghi chưa đủ căn cứ, không xác nhận ùn tắc.
- A03: Cảnh báo đã được xử lý: thông báo trạng thái mới và yêu cầu tải lại.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR05–FR07; mục 2.13.

1. Người vận hành đăng nhập.
2. Mở danh sách cảnh báo và chọn một cảnh báo đang mở.
3. Xem đoạn đường, tốc độ, thời điểm và hai cửa sổ quan trắc liên tiếp.
4. Kiểm tra độ mới, số bản tin hợp lệ và thông tin liên quan.
5. Nhập căn cứ xác minh.
6. Chọn xác nhận và tạo phiếu sự cố liên kết, hoặc loại bỏ cảnh báo kèm lý do.
7. Hệ thống lưu kết luận, người xác minh và thời điểm; hiển thị mã sự cố nếu có.
8. Kết thúc tại kết quả xác minh; đăng xuất. Việc xử lý đến khi đóng sự cố thuộc L03.

**Màn hình:** Đăng nhập; danh sách cảnh báo; chi tiết và xác minh.  
**Dữ liệu mẫu:** Một cảnh báo có hai cửa sổ 5 phút đủ dữ liệu và tỷ lệ tốc độ `r < 0,3`; một trường hợp thiếu dữ liệu.  
**Tình huống cần thể hiện:** Thiếu dữ liệu thì không kết luận ùn tắc; cảnh báo đã được người khác xử lý thì yêu cầu tải lại.  
**Giới hạn demo:** Có thể tạo sẵn cửa sổ quan trắc, ghi rõ đây là dữ liệu phát lại. Không bắt người xem chờ đủ 10 phút và không trình bày dữ liệu phát lại như đo trực tiếp.

### L03 — Đăng nhập → Tạo và xử lý sự cố giao thông

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-03 |
| Tên UC | Quản lý sự cố giao thông |
| Tác nhân | Người vận hành; tài khoản thử được phân công xử lý |
| Mục tiêu | Tạo và xử lý sự cố đến trạng thái kết thúc, lưu đủ lịch sử. |
| Kích hoạt | Chọn Tạo sự cố hoặc mở phiếu đang xử lý. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền quản lý sự cố; danh mục đoạn đường và tài khoản phụ trách đã tồn tại. |
| Hậu điều kiện thành công | Phiếu được đóng, có kết quả xử lý và lịch sử người/thời điểm; nhánh không hợp lệ lưu lý do. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Thiếu vị trí hoặc mô tả: từ chối lưu, giữ dữ liệu để sửa.
- A02: Xác minh không hợp lệ: nhập lý do, chuyển Không hợp lệ và kết thúc nhánh.
- A03: Chuyển Mới trực tiếp sang Đã đóng: từ chối, giữ trạng thái hiện tại.
- A04: Đóng thiếu kết quả hoặc người thực hiện: từ chối, yêu cầu bổ sung.
- A05: Xung đột phiên bản: trả lỗi 409, yêu cầu tải lại trước khi sửa.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR07; mục 2.14.  
**Đây là lựa chọn đề xuất cho bản demo chính.**

1. Người vận hành đăng nhập và mở danh sách sự cố.
2. Chọn **Tạo sự cố**.
3. Nhập loại sự cố, đoạn đường/vị trí, mức ưu tiên và mô tả.
4. Lưu phiếu; hệ thống cấp mã và đặt trạng thái **Mới**.
5. Mở chi tiết, nhập căn cứ xác minh và chuyển sang **Đã xác minh**.
6. Chọn một tài khoản thử làm người phụ trách.
7. Chuyển sang **Đang xử lý** và ghi nội dung xử lý.
8. Nhập kết quả xử lý, chọn **Đóng phiếu**.
9. Hệ thống kiểm tra dữ liệu, chuyển sang **Đã đóng** và lưu người thực hiện, thời gian, lịch sử thay đổi.
10. Trở về danh sách, lọc trạng thái **Đã đóng**, mở lại phiếu để chứng minh dữ liệu đã lưu; đăng xuất.

**Chuỗi trạng thái:** `Mới → Đã xác minh → Đang xử lý → Đã đóng`. Nhánh **Không hợp lệ** phải có lý do.

**Màn hình:** Đăng nhập; danh sách; tạo phiếu; chi tiết kèm lịch sử.  
**Dữ liệu mẫu:** Hai tài khoản vận hành và ba đoạn đường có sẵn; một tình huống sự cố giả lập.  
**Tình huống cần thể hiện:** Thiếu vị trí/mô tả; chuyển thẳng từ Mới sang Đã đóng; đóng phiếu thiếu kết quả xử lý; cập nhật xung đột phiên bản.  
**Giới hạn demo:** Tạo sự cố thủ công; chọn đoạn đường và vị trí mẫu. Không cần xây cảnh báo tự động, IoT, AI hoặc hệ thống điều phối ngoài đời.

### L04 — Đăng nhập → Gửi phản ánh → Duyệt → Theo dõi kết quả

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-04 |
| Tên UC | Gửi, duyệt và theo dõi phản ánh |
| Tác nhân | Người dân thử nghiệm; người vận hành |
| Mục tiêu | Người gửi nhận được kết quả xử lý phản ánh đã gửi. |
| Kích hoạt | Người dân chọn Gửi phản ánh; người vận hành chọn phiếu Chờ duyệt. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có tài khoản của hai vai trò; chỉ người vận hành được duyệt; có sự cố mẫu nếu cần liên kết. |
| Hậu điều kiện thành công | Phản ánh có mã theo dõi và kết quả duyệt; người gửi xem được phiếu của mình; phiếu chưa duyệt không công khai. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Thiếu vị trí hoặc nội dung: từ chối gửi và yêu cầu bổ sung.
- A02: Từ chối phản ánh: bắt buộc nhập lý do, người gửi xem được kết quả.
- A03: Yêu cầu bổ sung: lưu yêu cầu để người gửi chỉnh sửa, chưa chấp nhận phiếu.
- A04: Truy cập phiếu người khác: từ chối, không trả dữ liệu riêng.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR12; mục 2.14.

1. Người dân thử nghiệm đăng nhập.
2. Chọn **Gửi phản ánh**, chọn vị trí, loại và nhập nội dung.
3. Gửi biểu mẫu; hệ thống trả mã theo dõi và trạng thái **Chờ duyệt**.
4. Người gửi mở **Phản ánh của tôi**, xem phiếu vừa gửi rồi đăng xuất.
5. Người vận hành đăng nhập, mở hàng đợi phản ánh.
6. Đọc chi tiết, chọn chấp nhận và liên kết sự cố, hoặc từ chối kèm lý do. Có thể bổ sung nhánh yêu cầu thêm thông tin sau.
7. Hệ thống lưu kết quả duyệt; nội dung chưa duyệt không xuất hiện công khai.
8. Người vận hành đăng xuất; người gửi đăng nhập lại và xem kết quả phiếu của mình.
9. Kết thúc khi người gửi thấy kết quả duyệt; đăng xuất.

**Màn hình:** Đăng nhập dùng chung; gửi phản ánh; danh sách cá nhân; hàng đợi duyệt; chi tiết.  
**Dữ liệu mẫu:** Hai tài khoản người dân, một tài khoản vận hành, một sự cố có sẵn để liên kết.  
**Tình huống cần thể hiện:** Thiếu vị trí; từ chối không có lý do; người dùng sửa mã phiếu để xem phản ánh của người khác phải bị từ chối.  
**Giới hạn demo:** Chưa làm tải ảnh FR18 và gợi ý gần trùng FR17; liên kết thủ công với sự cố có sẵn, không triển khai thêm vòng đời sự cố.

### L05 — Đăng nhập → Theo dõi xe buýt mô phỏng

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-05 |
| Tên UC | Theo dõi xe buýt |
| Tác nhân | Người dùng hoặc người vận hành |
| Mục tiêu | Xem vị trí mới nhất và chất lượng cập nhật của xe buýt. |
| Kích hoạt | Chọn tuyến xe buýt cần theo dõi. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền tra cứu; tuyến, xe và nguồn GPS mô phỏng đã được chuẩn bị. |
| Hậu điều kiện thành công | Vị trí mới nhất hợp lệ và thời điểm được hiển thị; trạng thái dữ liệu cũ được phân biệt rõ. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: GPS quá 120 giây: gắn nhãn Mất cập nhật.
- A02: Gói GPS đến muộn: không ghi đè vị trí mới hơn.
- A03: Tọa độ ngoài vùng thử: đánh dấu/từ chối theo quy tắc dữ liệu, không cập nhật vị trí hợp lệ hiện tại.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR09; mục 2.15.

1. Người dùng đăng nhập, mở chức năng xe buýt.
2. Chọn một tuyến trong danh sách.
3. Hệ thống hiển thị vị trí mới nhất của các xe thuộc tuyến.
4. Người dùng chọn một xe để xem mã xe, tuyến và thời điểm GPS.
5. Bộ phát lại dữ liệu mô phỏng gửi vị trí tiếp theo; giao diện cập nhật xe trên bản đồ.
6. Người dùng quan sát trường hợp ngừng nhận dữ liệu và nhãn **Mất cập nhật**.
7. Kết thúc khi theo dõi được xe và nhận biết chất lượng dữ liệu; đăng xuất.

**Màn hình:** Đăng nhập; bản đồ xe buýt kèm chọn tuyến.  
**Dữ liệu mẫu:** Hai tuyến, năm xe và tệp tọa độ GPS giả lập.  
**Tình huống cần thể hiện:** GPS quá 120 giây; bản tin đến muộn không đưa xe về vị trí cũ; tọa độ ngoài vùng thử bị kiểm tra.  
**Giới hạn demo:** Không dự đoán giờ đến, không tối ưu tuyến. Nếu tăng tốc thời gian mô phỏng thì hiển thị rõ chế độ phát lại.

### L06 — Đăng nhập → Cập nhật số chỗ bãi đỗ

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-06 |
| Tên UC | Cập nhật bãi đỗ xe |
| Tác nhân | Người vận hành |
| Mục tiêu | Cập nhật sức chứa, số đang dùng và tính số chỗ còn. |
| Kích hoạt | Chọn chỉnh sửa một bãi đỗ. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền cập nhật; bản ghi bãi đỗ đã tồn tại. |
| Hậu điều kiện thành công | Số liệu hợp lệ được lưu; chỗ còn được tính lại; có nguồn/người và thời điểm cập nhật. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Số âm hoặc đang dùng vượt sức chứa: từ chối lưu, yêu cầu sửa.
- A02: Sức chứa bằng 0: chỉ chấp nhận đang dùng bằng 0, hiển thị ngừng cung cấp và không tính tỷ lệ bằng phép chia cho 0.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR10; mục 2.15.

1. Người vận hành đăng nhập.
2. Mở danh sách bãi đỗ, chọn một bãi.
3. Xem sức chứa, số chỗ đang dùng, số chỗ còn và thời điểm cập nhật.
4. Nhập sức chứa và số chỗ đang dùng mới.
5. Nhấn lưu; hệ thống kiểm tra dữ liệu.
6. Hệ thống tính **Chỗ còn = Sức chứa − Đang dùng**, lưu dữ liệu và thông tin cập nhật.
7. Người dùng xem lại danh sách hoặc thẻ chi tiết để kiểm tra kết quả; đăng xuất.

**Màn hình:** Đăng nhập; danh sách bãi đỗ; biểu mẫu chi tiết.  
**Dữ liệu mẫu:** Ba bãi đỗ, gồm còn chỗ, đầy và ngừng cung cấp.  
**Tình huống cần thể hiện:** Số âm; số đang dùng vượt sức chứa; sức chứa bằng 0 phải hiển thị ngừng cung cấp và không chia cho 0.  
**Giới hạn demo:** Cập nhật thủ công; không đặt chỗ, thanh toán hoặc kết nối cảm biến.

### L07 — Đăng nhập → Tạo và tra cứu công trình giao thông

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-07 |
| Tên UC | Quản lý công trình giao thông |
| Tác nhân | Người vận hành |
| Mục tiêu | Lưu công trình và xem đúng thời gian hiệu lực. |
| Kích hoạt | Chọn tạo hoặc chỉnh sửa công trình. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền quản lý; đoạn đường liên quan đã tồn tại. |
| Hậu điều kiện thành công | Công trình được lưu; danh sách phân biệt chưa bắt đầu, đang hiệu lực và đã kết thúc. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Ngày kết thúc trước ngày bắt đầu: từ chối lưu và yêu cầu sửa.
- A02: Thiếu đoạn đường hoặc thông tin bắt buộc: giữ biểu mẫu, yêu cầu bổ sung.
- A03: Công trình hết hạn: hiển thị trong bộ lọc lịch sử.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR11; mục 2.15.

1. Người vận hành đăng nhập, mở danh sách công trình.
2. Chọn tạo công trình.
3. Nhập tên, vị trí/đoạn đường, ngày bắt đầu, ngày kết thúc và mức ảnh hưởng.
4. Lưu; hệ thống kiểm tra thông tin và tạo bản ghi.
5. Chọn bộ lọc **Đang hiệu lực** tại ngày xem.
6. Mở công trình vừa tạo để xem chi tiết; đổi bộ lọc để xem công trình đã hết hạn.
7. Kết thúc khi lưu được công trình và lọc đúng thời gian; đăng xuất.

**Màn hình:** Đăng nhập; danh sách có bộ lọc; tạo/chỉnh sửa công trình.  
**Dữ liệu mẫu:** Ba công trình: chưa bắt đầu, đang hiệu lực, đã kết thúc.  
**Tình huống cần thể hiện:** Ngày kết thúc trước ngày bắt đầu; thiếu đoạn đường; công trình hết hạn thuộc lớp lịch sử.  
**Giới hạn demo:** Không quản lý hồ sơ pháp lý, hợp đồng hoặc chi phí thi công.

### L08 — Đăng nhập → Thống kê → Xuất báo cáo CSV

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-08 |
| Tên UC | Thống kê và xuất báo cáo |
| Tác nhân | Người quản lý |
| Mục tiêu | Xem thống kê và tải tệp CSV khớp bộ lọc. |
| Kích hoạt | Mở trang thống kê và chọn Xem báo cáo. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền xem/xuất báo cáo; có dữ liệu mẫu hoặc tập dữ liệu rỗng hợp lệ. |
| Hậu điều kiện thành công | CSV UTF-8 được tạo với tiêu đề và dữ liệu khớp bộ lọc; không thay đổi dữ liệu nguồn. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Khoảng ngày sai: từ chối truy vấn, yêu cầu sửa.
- A02: Không có bản ghi: hiển thị bảng rỗng có nhãn; CSV nếu xuất vẫn có tiêu đề.
- A03: Nhiều phản ánh cùng sự cố: đếm theo mã sự cố duy nhất.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR08; mục 2.15.

1. Người quản lý đăng nhập, mở trang thống kê.
2. Chọn ngày bắt đầu, ngày kết thúc và đoạn đường.
3. Với thống kê sự cố, chọn hoặc xem rõ tiêu chí thời gian: theo ngày tạo hay ngày đóng.
4. Nhấn xem; hệ thống hiển thị bảng và biểu đồ tương ứng.
5. Kiểm tra số sự cố hoặc số liệu quan trắc theo bộ lọc.
6. Nhấn **Xuất CSV** và tải tệp về.
7. Mở tệp để đối chiếu tiêu đề, số dòng và dữ liệu với màn hình; đăng xuất.

**Màn hình:** Đăng nhập; thống kê có bảng, biểu đồ và nút xuất.  
**Dữ liệu mẫu:** Quan trắc hoặc sự cố tạo sẵn cho vài ngày và ba đoạn đường.  
**Tình huống cần thể hiện:** Khoảng ngày sai; không có dữ liệu; nhiều phản ánh liên kết một sự cố vẫn chỉ đếm một sự cố. CSV dùng UTF-8 và tiêu đề tiếng Việt.  
**Giới hạn demo:** Khi chọn luồng này nên chốt một loại thống kê, ưu tiên sự cố; không cần xây chức năng tạo dữ liệu nguồn.

### L09 — Đăng nhập quản trị → Quản lý tài khoản

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-09 |
| Tên UC | Quản lý tài khoản |
| Tác nhân | Quản trị viên |
| Mục tiêu | Tạo, phân quyền và khóa tài khoản thử. |
| Kích hoạt | Chọn tạo tài khoản hoặc thao tác trên tài khoản có sẵn. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền quản trị tài khoản; các vai trò đã được định nghĩa. |
| Hậu điều kiện thành công | Tài khoản và quyền được lưu; thay đổi có nhật ký; tài khoản khóa không đăng nhập được. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Tên đăng nhập trùng: từ chối tạo và yêu cầu tên khác.
- A02: Thiếu dữ liệu bắt buộc: từ chối lưu.
- A03: Người không có quyền gọi API quản trị: trả 403.
- A04: Đăng nhập tài khoản bị khóa: từ chối tạo phiên.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR15; quy trình chi tiết dưới đây là đề xuất cụ thể hóa cho demo.

1. Quản trị viên đăng nhập, mở danh sách tài khoản.
2. Chọn tạo tài khoản, nhập tên đăng nhập, thông tin cần thiết, mật khẩu khởi tạo và vai trò.
3. Lưu; hệ thống kiểm tra trùng tên, lưu mật khẩu dưới dạng băm và ghi nhật ký.
4. Đăng xuất, dùng tài khoản mới đăng nhập để kiểm tra quyền đã cấp.
5. Đăng nhập lại bằng quản trị viên và khóa tài khoản thử.
6. Thử đăng nhập bằng tài khoản đã khóa; hệ thống từ chối.
7. Kết thúc khi chứng minh được tạo, phân quyền và khóa tài khoản.

**Màn hình:** Đăng nhập; danh sách tài khoản; tạo/chỉnh sửa.  
**Dữ liệu mẫu:** Một quản trị viên, một tài khoản thử và một trang nội bộ dùng kiểm tra quyền.  
**Tình huống cần thể hiện:** Tên đăng nhập trùng; tài khoản bị khóa; người không có quyền gọi API quản trị.  
**Giới hạn demo:** Không cần đăng ký công khai, email, OTP hoặc quên mật khẩu. Không đưa mật khẩu hoặc khóa bí mật vào nhật ký.

### L10 — Đăng nhập quản trị → Cấu hình ngưỡng cảnh báo

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-10 |
| Tên UC | Cấu hình ngưỡng cảnh báo |
| Tác nhân | Quản trị viên |
| Mục tiêu | Thay đổi ngưỡng hợp lệ và truy vết được thay đổi. |
| Kích hoạt | Mở cấu hình và chọn chỉnh sửa ngưỡng. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền cấu hình; có cấu hình hiện hành và bộ mẫu kiểm tra. |
| Hậu điều kiện thành công | Cấu hình hợp lệ được lưu; nhật ký lưu giá trị cũ/mới, người sửa và thời điểm. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Ngưỡng sai thứ tự hoặc ngoài miền hợp lệ: từ chối lưu.
- A02: Thiếu lý do thay đổi: yêu cầu bổ sung theo quy ước demo.
- A03: Mẫu không đủ dữ liệu: hiển thị chưa đủ dữ liệu, không áp nhãn phân loại bình thường.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR15, FR05–FR06; mục 2.4. Bố cục màn hình thử ngưỡng là đề xuất cho demo.

1. Quản trị viên đăng nhập và mở cấu hình giao thông.
2. Xem các ngưỡng hiện tại: tỷ lệ tốc độ 0,3 và 0,6; tối thiểu 8/10 bản tin hợp lệ; hai cửa sổ liên tiếp để tạo cảnh báo.
3. Sửa một cấu hình được cho phép và nhập lý do thay đổi.
4. Hệ thống kiểm tra miền giá trị và thứ tự các ngưỡng rồi lưu.
5. Xem kết quả phân loại trên bộ dữ liệu mô phỏng cố định trước và sau thay đổi.
6. Mở lịch sử để xem giá trị cũ, giá trị mới, người sửa và thời điểm; đăng xuất.

**Màn hình:** Đăng nhập; cấu hình kèm kiểm tra mẫu; lịch sử thay đổi có thể đặt cùng trang.  
**Dữ liệu mẫu:** Các tỷ lệ tốc độ nằm dưới, đúng và trên ngưỡng.  
**Tình huống cần thể hiện:** Ngưỡng không đúng thứ tự; giá trị không hợp lệ; dữ liệu không đủ chất lượng thì không được phân loại như bình thường.  
**Giới hạn demo:** Mô phỏng tác động với mẫu cố định; không cần bộ IoT chạy liên tục hoặc xử lý toàn bộ lịch sử.

### L11 — Đăng nhập quản trị → Tra cứu nhật ký

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-11 |
| Tên UC | Tra cứu nhật ký |
| Tác nhân | Quản trị viên |
| Mục tiêu | Xác định người, thời điểm và nội dung thao tác trên đối tượng. |
| Kích hoạt | Mở nhật ký và thực hiện tìm kiếm. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền đọc nhật ký; bản ghi mẫu đã được chuẩn bị. |
| Hậu điều kiện thành công | Danh sách và chi tiết phù hợp bộ lọc được hiển thị; nhật ký không bị sửa. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Khoảng thời gian sai: yêu cầu nhập lại.
- A02: Không có kết quả: hiển thị danh sách rỗng.
- A03: Không có quyền: trả 403; không hiển thị dữ liệu nhật ký.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR16; quy trình giao diện là đề xuất cụ thể hóa cho demo.

1. Quản trị viên đăng nhập và mở nhật ký thao tác.
2. Chọn khoảng thời gian, người thực hiện hoặc mã đối tượng.
3. Nhấn tìm kiếm; hệ thống trả danh sách phù hợp.
4. Chọn một bản ghi để xem hành động, đối tượng và thời điểm.
5. Theo mã đối tượng, xem chuỗi thay đổi liên quan.
6. Kết thúc khi xác định được ai đã thao tác gì và khi nào; đăng xuất.

**Màn hình:** Đăng nhập; nhật ký có bộ lọc và khung chi tiết.  
**Dữ liệu mẫu:** Nhật ký tạo, xác minh, xử lý và đóng một phiếu sự cố; nhật ký đăng nhập mẫu.  
**Tình huống cần thể hiện:** Không có kết quả; khoảng thời gian sai; tài khoản không có quyền bị từ chối; không lộ mật khẩu/khóa.  
**Giới hạn demo:** Nhật ký chỉ đọc. Nếu dùng bản ghi tạo sẵn phải ghi rõ là dữ liệu mẫu.

### L12 — Đăng nhập → Xem dự báo tốc độ sau 5 phút

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-12 |
| Tên UC | Xem dự báo tốc độ |
| Tác nhân | Người vận hành hoặc người quản lý được cấp quyền |
| Mục tiêu | Xem dự báo sau 5 phút cùng nguồn mô hình và trạng thái dữ liệu. |
| Kích hoạt | Chọn đoạn đường trên trang dự báo. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền xem; dữ liệu, phương pháp nền và kết quả đánh giá đã được chuẩn bị. |
| Hậu điều kiện thành công | Hiển thị dự báo với thời điểm đích, phiên bản và nhãn mô hình/nền; hoặc thông báo không đủ dữ liệu. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Thiếu đặc trưng: thông báo không đủ dữ liệu, không tự sinh dự báo giả.
- A02: Mô hình không tải được: dùng nền có nhãn nếu đầu vào nền hợp lệ.
- A03: MAE mô hình cao hơn nền: chọn nền và hiển thị kết quả so sánh thật.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR13–FR14; mục 2.17.

1. Người có quyền xem dự báo đăng nhập, mở trang dự báo.
2. Chọn đoạn đường và xem thời điểm quan trắc gần nhất.
3. Hệ thống kiểm tra dữ liệu đầu vào.
4. Nếu đủ dữ liệu, trả tốc độ dự báo sau 5 phút, thời điểm sinh, thời điểm đích, phiên bản mô hình và trạng thái dữ liệu.
5. Người dùng xem kết quả dự báo, phân biệt với tốc độ đã quan trắc.
6. Xem bảng MAE của mô hình và phương pháp nền trên tập kiểm tra đã chuẩn bị.
7. Kiểm tra nhánh thiếu dữ liệu hoặc chuyển sang phương pháp nền có nhãn; đăng xuất.

**Màn hình:** Đăng nhập; dự báo; kết quả đánh giá có thể đặt trong một tab.  
**Dữ liệu mẫu:** Dữ liệu tổng hợp có seed cố định; mô hình đã huấn luyện và bảng đánh giá thực sự được tính từ lần chạy.  
**Tình huống cần thể hiện:** Không đủ đặc trưng; mô hình không tải được; mô hình có MAE cao hơn nền thì dùng nền và ghi rõ.  
**Giới hạn demo:** Huấn luyện/đánh giá chạy bằng script trước buổi demo, không cần màn hình huấn luyện. Không tự đặt số MAE. Nếu chỉ mô phỏng giao diện thì phải ghi rõ và chưa xem đó là hoàn thành FR13.

### L13 — Đăng nhập giám sát → Phát dữ liệu IoT mẫu → Kiểm tra tiếp nhận

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-13 |
| Tên UC | Tiếp nhận dữ liệu IoT |
| Tác nhân | Bộ phát IoT đã đăng ký; người vận hành theo dõi kết quả |
| Mục tiêu | Lưu đúng một bản ghi cho mỗi gói hợp lệ và phản hồi rõ gói lỗi. |
| Kích hoạt | Bộ phát gửi HTTP tới API tiếp nhận. |
| Tiền điều kiện | Nguồn máy có khóa riêng và mã nguồn được cấp; người theo dõi đã đăng nhập; điểm đo tồn tại. |
| Hậu điều kiện thành công | Gói hợp lệ được lưu và trả request_id; gói lỗi không tạo bản ghi quan trắc hợp lệ; gói trùng không tăng số bản ghi. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Khóa hoặc nguồn không hợp lệ: từ chối tiếp nhận.
- A02: Sai cấu trúc, giá trị hoặc thời gian: trả lý do lỗi.
- A03: Trùng source_id + sequence_no: trả trạng thái đã nhận, không ghi thêm.
- A04: Dữ liệu quá cũ: chỉ lưu lịch sử có cờ theo quy tắc, không ghi đè dữ liệu mới.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01, FR04; mục 2.13.

1. Người vận hành đăng nhập và mở trang theo dõi tiếp nhận dữ liệu.
2. Khởi chạy bộ phát mẫu riêng với khóa nguồn được cấu hình ở phía máy chủ hoặc script.
3. Bộ phát gửi `source_id`, `sequence_no`, `observed_at` và dữ liệu đo.
4. Máy chủ xác thực nguồn, kiểm tra cấu trúc, miền giá trị, thời gian và bản tin trùng.
5. Gói hợp lệ được lưu, trả mã tiếp nhận và `request_id`.
6. Người vận hành tải lại danh sách để xem bản ghi đã nhận.
7. Bộ phát gửi lại gói cũ và một gói lỗi; hệ thống không ghi trùng, trả lý do lỗi cho gói không hợp lệ.
8. Người vận hành kiểm tra số bản ghi và nhật ký; dừng bộ phát rồi đăng xuất.

**Màn hình:** Đăng nhập; danh sách gói nhận; chi tiết kết quả/lỗi.  
**Dữ liệu mẫu:** Một nguồn hợp lệ, một nguồn lạ, một gói trùng và một gói sai giá trị.  
**Tình huống cần thể hiện:** Nguồn không hợp lệ; trùng cặp `source_id + sequence_no`; dữ liệu thiếu không bị tự đổi thành 0.  
**Giới hạn demo:** Bộ phát xác thực bằng khóa nguồn, không dùng phiên đăng nhập của người vận hành. Không đưa khóa vào giao diện. Luồng kết thúc ở tiếp nhận, chưa cần tổng hợp cửa sổ, cảnh báo hoặc AI.

### L14 — Đăng nhập → Quản lý danh mục đoạn đường

| Thành phần | Đặc tả |
|---|---|
| Mã UC | UC-DEMO-14 |
| Tên UC | Quản lý danh mục đoạn đường |
| Tác nhân | Tài khoản được cấp quyền quản lý danh mục |
| Mục tiêu | Lưu thông tin và hình học hợp lệ của đoạn đường. |
| Kích hoạt | Chọn thêm hoặc chỉnh sửa đoạn đường. |
| Tiền điều kiện | Phiên người dùng hợp lệ. Có quyền quản lý danh mục; có mẫu GeoJSON và quy tắc kiểm tra. |
| Hậu điều kiện thành công | Đoạn đường được lưu; danh sách và hình học xem trước phản ánh dữ liệu đã lưu. |
| Bảo đảm khi thất bại | Không báo thành công hoặc lưu một phần thay đổi nghiệp vụ khi thao tác thất bại; giữ dữ liệu đã lưu hợp lệ trước đó. |

**Luồng thay thế và ngoại lệ**

- A01: Mã trùng: từ chối tạo.
- A02: GeoJSON sai: chỉ rõ lỗi và không lưu hình học không hợp lệ.
- A03: Thiếu tên hoặc tốc độ tham chiếu không hợp lệ: yêu cầu sửa trước khi lưu.

**Luồng chính — kịch bản demo từ đăng nhập đến kết thúc**

**Yêu cầu liên quan:** FR01–FR02. Vai trò quản lý danh mục và thao tác giao diện là đề xuất cụ thể hóa cho demo.

1. Tài khoản được cấp quyền quản lý danh mục đăng nhập.
2. Mở danh sách đoạn đường, chọn thêm mới.
3. Nhập mã, tên, tốc độ tham chiếu và hình học GeoJSON.
4. Hệ thống kiểm tra dữ liệu và hình học trước khi lưu.
5. Xem đoạn đường mới trong danh sách và bản đồ xem trước.
6. Chỉnh sửa thông tin, lưu và mở lại để kiểm tra dữ liệu đã cập nhật; đăng xuất.

**Màn hình:** Đăng nhập; danh sách; biểu mẫu có bản đồ xem trước.  
**Dữ liệu mẫu:** Danh mục 10 đoạn đường và các mẫu GeoJSON đúng/sai.  
**Tình huống cần thể hiện:** GeoJSON sai; mã trùng; thiếu tên; tốc độ tham chiếu không phù hợp cho phép tính phân loại.  
**Giới hạn demo:** Không làm công cụ vẽ bản đồ phức tạp; có thể nạp GeoJSON mẫu. Không cần xóa đoạn đường hoặc xử lý quan hệ dữ liệu lịch sử trong bản tối thiểu.

## 3A. UC dùng chung: Đăng nhập và đăng xuất

### UC-DEMO-AUTH-01 — Đăng nhập

| Thành phần | Đặc tả |
|---|---|
| Tác nhân | Người dùng có tài khoản thử |
| Mục tiêu | Thiết lập phiên hợp lệ và nhận quyền truy cập |
| Tiền điều kiện | Hệ thống hoạt động; tài khoản đã được tạo |
| Kích hoạt | Người dùng mở trang đăng nhập và gửi thông tin |
| Hậu điều kiện | Phiên có thời hạn được tạo; hệ thống trả vai trò và ghi sự kiện đăng nhập |

**Luồng chính**

1. Người dùng nhập tên đăng nhập và mật khẩu.
2. Hệ thống kiểm tra thông tin, trạng thái tài khoản.
3. Hệ thống tạo phiên và xác định vai trò.
4. Giao diện mở màn hình phù hợp để bắt đầu UC nghiệp vụ đã chọn.

**Ngoại lệ**

- A01: Thông tin sai hoặc tài khoản khóa → thông báo đăng nhập không thành công; không tạo phiên.
- A02: Phiên hết hạn trong UC nghiệp vụ → yêu cầu đăng nhập lại; không thực hiện thao tác ghi khi chưa xác thực lại.
- A03: Đã đăng nhập nhưng không đủ quyền → từ chối chức năng tại máy chủ; không xem đây là lỗi mật khẩu.

### UC-DEMO-AUTH-02 — Đăng xuất

**Tác nhân:** Người đang có phiên đăng nhập.  
**Tiền điều kiện:** Có phiên hợp lệ.  
**Kích hoạt:** Chọn Đăng xuất.

1. Người dùng chọn Đăng xuất.
2. Hệ thống hủy phiên và đưa về trang đăng nhập.
3. Yêu cầu sử dụng phiên cũ bị từ chối.

**Hậu điều kiện:** Không tiếp tục truy cập dữ liệu nội bộ bằng phiên đã hủy. Phiếu hoặc dữ liệu nghiệp vụ đã lưu vẫn được giữ.

## 4. Đề xuất chọn một luồng

| Nhu cầu trình diễn | Lựa chọn | Lý do |
|---|---|---|
| Có nghiệp vụ rõ, thể hiện đầy đủ xử lý và lưu dữ liệu | **L03 — Quản lý sự cố** | Có vòng đời trạng thái, kiểm tra điều kiện đóng, phân công và lịch sử; ít phụ thuộc bên ngoài |
| Muốn bản demo gọn, dễ chạy và dễ giải thích | **L06 — Cập nhật bãi đỗ** | Một biểu mẫu, một phép tính và các kiểm tra dữ liệu rõ ràng |
| Muốn thể hiện tương tác giữa hai vai trò | **L04 — Gửi và duyệt phản ánh** | Thấy được quá trình người dân gửi, vận hành duyệt, người gửi theo dõi |
| Muốn nhấn mạnh đặc trưng giám sát giao thông | **L02 — Xác minh cảnh báo** | Liên kết dữ liệu quan trắc, kết luận của người vận hành và sự cố |
| Muốn trình diễn phần AI trong báo cáo | **L12 — Dự báo tốc độ** | Có kết quả dự báo và đối chiếu MAE, nhưng cần thêm bước chuẩn bị mô hình và dữ liệu |

**Khuyến nghị chọn L03 / UC-DEMO-03.** Phạm vi có thể chốt thành: đăng nhập → tạo sự cố thủ công → xác minh → phân công → ghi xử lý → đóng phiếu → xem lịch sử → đăng xuất. Luồng này đủ để trình diễn giao diện, API, cơ sở dữ liệu, phân quyền và quy tắc nghiệp vụ trong một chức năng.

## 5. Cách chốt lựa chọn trước khi viết code

Chỉ cần chọn một mã, ví dụ: **“Chọn UC-DEMO-03 — quản lý sự cố, làm demo web chạy trên máy.”**

Sau khi chọn, phần triển khai sẽ gồm màn hình cho luồng đó, dữ liệu và tài khoản mẫu, hướng dẫn chạy, kịch bản thao tác khi thuyết trình và kiểm tra các nhánh lỗi chính. Các chức năng còn lại trong tài liệu không thuộc phạm vi code demo.
