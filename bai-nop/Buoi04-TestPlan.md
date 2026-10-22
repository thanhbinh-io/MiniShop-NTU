# BUỔI 4 – KẾ HOẠCH KIỂM THỬ (rút gọn)

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239
- **Phiên bản phần mềm:** MiniShop NTU v1.1.0
- **Tài liệu yêu cầu:** SRS v1.2

## 1. Mục tiêu đợt kiểm thử

Đợt kiểm thử nhằm đánh giá toàn diện phiên bản MiniShop NTU v1.1.0 để trả lời 3 câu hỏi cốt lõi: (1) 12 lỗi nhóm phát triển khẳng định đã sửa từ Buổi 1 đến Buổi 3 có thực sự được khắc phục triệt để theo SRS v1.2 hay không; (2) Việc sửa đổi mã nguồn và bổ sung tính năng mới có gây ra lỗi hồi quy làm hỏng các chức năng đang hoạt động đúng hay không; (3) Hệ thống còn tồn tại lỗi tiềm ẩn nào chưa được phát hiện hay không thông qua kiểm thử thăm dò. Từ các kết quả thực nghiệm, nhóm kiểm thử đưa ra kết luận và khuyến nghị chính xác về việc bản v1.1.0 có đủ điều kiện phát hành hay không.

## 2. Phạm vi

| Nội dung | Có kiểm thử | Lý do |
|---|---|---|
| 12 lỗi nhóm phát triển khẳng định đã sửa | Có | Xác nhận lại từng lỗi đã báo (F-01 đến F-12) xem đã sửa hoàn toàn, sửa chưa trọn hay chưa sửa theo SRS v1.2. |
| Các chức năng không nằm trong danh sách sửa | Có | Kiểm thử hồi quy bằng bộ kiểm thử tự động và chạy tay để phát hiện hư hại do việc sửa mã nguồn gây ra. |
| Chức năng mới FR-06 | Có | Đánh giá tính năng mới Tìm kiếm và lọc sản phẩm (8 yêu cầu con) vừa được bổ sung theo đặc tả SRS v1.2. |
| Các chức năng chưa phát triển (K-01, K-02) | Không | Nhà phát triển tuyên bố chưa làm trong phiên bản v1.1.0 theo Ghi chú phát hành mục 4 (K-01: Thanh toán trực tuyến, mã giảm giá, quản lý kho; K-02: Trừ tồn kho khi đặt hàng thành công). |
| Hiệu năng, bảo mật chuyên sâu | Không | Nằm ngoài phạm vi của đợt kiểm thử rút gọn Buổi 4 (thời lượng 3 giờ, tập trung vào kiểm thử chức năng mức đơn vị và giao diện). |

## 3. Rủi ro và mức ưu tiên

Liệt kê 3 vùng chức năng rủi ro cao nhất của đợt này, kèm lý do. Gợi ý cân nhắc: vùng nào vừa bị sửa nhiều nhất, vùng nào liên quan trực tiếp tới tiền của khách hàng, vùng nào ảnh hưởng tới khả năng đăng nhập.

| # | Vùng chức năng | Mức rủi ro | Lý do | Thứ tự kiểm thử |
|---|---|---|---|---|
| 1 | Quản lý đơn hàng, tính tiền và ưu đãi VIP (`src/server.js`, `src/services/shipping.js`) | Cao | Tệp `server.js` bị sửa nhiều logic nghiệp vụ liên quan trực tiếp đến số tiền khách phải trả (tính giảm giá VIP 5%, tổng đơn hàng, hủy đơn); sai lệch sẽ gây thất thoát doanh thu hoặc khiếu nại của khách hàng. | 1 |
| 2 | Đăng ký tài khoản và quy tắc mật khẩu (`src/services/registration.js`) | Cao | Sửa điều kiện biên kiểm tra độ tuổi và bổ sung kiểm tra thành phần mật khẩu; rủi ro chặn người dùng hợp lệ không đăng ký được hoặc bỏ lọt mật khẩu không an toàn ngay tại cửa ngõ hệ thống. | 2 |
| 3 | Đăng nhập và khóa tài khoản (`src/services/auth.js`) | Trung bình | Sửa logic reset bộ đếm lần sai và cơ chế tự mở khóa sau thời gian chờ; rủi ro khóa nhầm ảnh hưởng trải nghiệm người dùng nhưng không gây thất thoát tài chính trực tiếp như Vùng 1 và đã có bộ mock test bao phủ tốt. | 3 |

## 4. Chiến lược

| Loại kiểm thử | Phạm vi áp dụng | Công cụ |
|---|---|---|
| Kiểm thử xác nhận | 12 lỗi đã sửa F-01 đến F-12 trong GhiChuPhatHanh-v1.1.md | Chạy lại các ca kiểm thử tương ứng trên Jest và giao diện Web UI / DevTools |
| Kiểm thử hồi quy | Bộ kiểm thử đơn vị từ Buổi 3 (51 ca) và chức năng lọc sản phẩm FR-06 | Jest (`npm test`), trình duyệt web (kiểm thử hộp đen với bộ ca Pairwise) |
| Exploratory | Chuỗi đăng nhập đúng/sai xen kẽ, hành vi trong và sau thời gian khóa theo Charter CT-05 | Trình duyệt web (Chrome/Edge), DevTools Network/Console |

## 5. Tiêu chí bắt đầu và kết thúc

**Tiêu chí bắt đầu (entry criteria):**
- Bản build MiniShop NTU v1.1.0 cài đặt thành công, server khởi động được (`npm start`).
- Endpoint `/api/health` trả về mã trạng thái 200 kèm `version: "1.1.0"`.
- Tài liệu SRS v1.2 và Ghi chú phát hành v1.1 đã sẵn sàng để đối chiếu.

**Tiêu chí kết thúc (exit criteria):**
- 100% (12/12) ca kiểm thử xác nhận được thực thi và có kết luận rõ ràng (ĐÃ SỬA / SỬA CHƯA TRỌN / CHƯA SỬA).
- 100% các ca kiểm thử hồi quy được chạy; mọi ca thất bại đều được phân tích rõ nguyên nhân (lỗi mã nguồn hay ca kiểm thử lỗi thời).
- Không còn lỗi mức Critical (Nghiêm trọng cao nhất) ở trạng thái mở mà không có giải pháp xử lý hoặc sự chấp thuận rủi ro.
- Hoàn thành đủ 25 phút phiên kiểm thử thăm dò với ít nhất 4 mốc thời gian trong nhật ký và tạo ít nhất 2 GitHub Issues báo cáo lỗi.

## 6. Sản phẩm bàn giao

| Sản phẩm | Nơi nộp |
|---|---|
| Kế hoạch kiểm thử rút gọn (`Buoi04-TestPlan.md`) | Thư mục `bai-nop/` trên nhánh `buoi-04` |
| Báo cáo kiểm thử xác nhận & hồi quy (`Buoi04-XacNhan-HoiQuy.md`) | Thư mục `bai-nop/` trên nhánh `buoi-04` |
| Báo cáo kiểm thử thăm dò & quản lý lỗi (`Buoi04-Exploratory.md`) | Thư mục `bai-nop/` trên nhánh `buoi-04` |
| Báo cáo lỗi (ít nhất 2 issues) | Tab Issues trên GitHub repository cá nhân |
| Pull Request từ nhánh `buoi-04` vào nhánh `main` | GitHub Pull Request repository cá nhân |
