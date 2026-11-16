# Sổ yêu cầu thay đổi (CR) — Nhóm 8

Sổ này áp dụng quy trình kiểm soát thay đổi ở mục 4.5 của báo cáo. Đường cơ sở gốc là báo cáo kế hoạch (FR01–FR16, kiến trúc mục 3.1). Mỗi CR ghi lý do, ảnh hưởng và quyết định.

> **Nhóm cần điền:** người đề nghị và các mục đánh dấu *(nhóm điền)*. Ngày quyết định lấy theo biên bản họp trong `bien-ban-hop/`. Không điền nếu quyết định chưa được thống nhất trong buổi họp.

## CR-01 — Đổi công nghệ cho bản demo

| Mục | Nội dung |
|---|---|
| Người đề nghị | *(nhóm điền)* |
| Ngày quyết định | 13/10/2026, buổi họp MOM-02 (QĐ-07) |
| Nội dung | Bản demo dùng Node.js (`node:http`, `node:sqlite`), JavaScript thuần và Leaflet 1.9.4 thay cho React + FastAPI + PostgreSQL + Worker Python + Docker Compose ở mục 3.1 |
| Lý do | Demo chỉ có một UC, cần chạy được trên máy báo cáo không có Internet và không cần cài Docker hay PostgreSQL. Có thể đóng gói thành một tệp `.exe` |
| Yêu cầu liên quan | FR01, FR03; NFR06, NFR07 |
| Ảnh hưởng phạm vi | Không thêm chức năng. Kiến trúc mục 3.1 vẫn là kiến trúc mục tiêu của hệ thống đầy đủ |
| Ảnh hưởng lịch, chi phí | Không phát sinh chi phí. Không cần máy chủ thử và tên miền ở mục 6.1 cho bản demo |
| Ảnh hưởng kiểm thử | Bỏ bước khởi động Docker Compose (mục 10.1). Kiểm thử bằng `node --test` |
| Rủi ro | Không dùng lại được mã khi chuyển sang kiến trúc mục tiêu. Chấp nhận vì phạm vi demo nhỏ |
| Quyết định | Chấp nhận tại MOM-02 |

## CR-02 — Thu hẹp sản phẩm bàn giao về demo L01

| Mục | Nội dung |
|---|---|
| Người đề nghị | *(nhóm điền)* |
| Ngày quyết định | 13/10/2026, buổi họp MOM-02 (QĐ-06) |
| Nội dung | Thay vì nguyên mẫu đầy đủ FR01–FR16, sản phẩm phần mềm bàn giao là **một luồng UC-DEMO-01 — Tra cứu bản đồ giao thông** kèm đăng nhập/đăng xuất. Các phân hệ còn lại giữ ở mức phân tích thiết kế trong báo cáo |
| Lý do | Mục 1.10 đặt điều kiện xác minh yêu cầu nộp của học phần. Yêu cầu là trình diễn một luồng chức năng chạy được. Theo R01 (phạm vi quá rộng, P×I = 9) và R09 (quá tải tuần 4), nhóm ưu tiên một luồng hoàn chỉnh, có kiểm thử |
| Vì sao chọn L01 thay vì L03 | Đặc tả lựa chọn khuyến nghị L03. Nhóm chọn L01 vì nó thể hiện rõ đặc trưng GIS của đề tài và các quy tắc chất lượng dữ liệu (phân mức, mất cập nhật, thiếu dữ liệu, chưa quan trắc). L01 cũng là nền chung mà các luồng khác đều dùng lại |
| Yêu cầu đáp ứng | FR01 (đạt), FR03 (đạt), FR05/FR06 (một phần: phân mức một cửa sổ, chưa tổng hợp từ gói IoT và chưa sinh cảnh báo hai cửa sổ), FR02 (một phần: danh mục 10 đoạn có sẵn, chưa có chức năng quản lý) |
| Yêu cầu chuyển ra ngoài bản bàn giao | FR04, FR07–FR16 và các ca TC04–TC17, TC19–TC22. Giữ trong báo cáo làm thiết kế cho giai đoạn sau |
| Ảnh hưởng cổng nghiệm thu (mục 9.6) | Cổng nghiệm thu áp dụng cho phạm vi sau CR: FR01, FR03 và các ca TC01, TC03 cùng phần áp dụng được của TC02, TC18 |
| Ảnh hưởng lịch, chi phí | Giờ công và chi phí của các gói G, H, I (WBS 4.4, 5.1, 6.1) chưa sử dụng. Nhóm cập nhật giờ thực tế *(nhóm điền)* |
| Quyết định | Chấp nhận tại MOM-02 |
