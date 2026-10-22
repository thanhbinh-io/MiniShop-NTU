# BUỔI 4 – KIỂM THỬ THĂM DÒ VÀ BÁO CÁO LỖI

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Phiên kiểm thử thăm dò (session-based testing)

| Mục | Nội dung |
|---|---|
| Mã charter được giao | CT-05 |
| Nội dung charter | Thăm dò **đăng nhập và khóa tài khoản**: chuỗi đăng nhập sai và đúng xen kẽ, hành vi trong và sau thời gian khóa |
| Thời gian bắt đầu | 14:00 |
| Thời gian kết thúc | 14:25 |
| Thời lượng thực tế | 25 phút |

### 1.1. Nhật ký phiên

Ghi theo dòng thời gian, kể cả những thử nghiệm không phát hiện gì.

| Thời điểm | Đã thử điều gì | Quan sát được |
|---|---|---|
| 14:02 | Đăng nhập thành công với tài khoản hợp lệ `sv@ntu.edu.vn` và mật khẩu đúng `Matkhau123` | Đăng nhập thành công (status 200), nhận token xác thực và giao diện chuyển sang trạng thái đã đăng nhập, thông tin người dùng hiển thị đúng |
| 14:07 | Thử chuỗi đăng nhập sai 1 lần (nhập sai mật khẩu), sau đó đăng nhập đúng mật khẩu ở lần thứ 2 | Lần 1 trả về mã lỗi 401 "Sai email hoặc mật khẩu". Lần 2 đăng nhập thành công; kiểm tra bộ nhớ cho thấy biến `user.failedAttempts` đã được đặt lại về 0 (đúng yêu cầu FR-02.3) |
| 14:13 | Thử chuỗi đăng nhập sai 2 lần liên tiếp với các mật khẩu khác nhau, rồi lần 3 nhập đúng mật khẩu | Ở lần 1 và 2, hệ thống báo 401 "Sai email hoặc mật khẩu" và tài khoản chưa bị khóa (`failedAttempts = 2`). Ở lần 3 nhập đúng mật khẩu, hệ thống cho phép đăng nhập thành công và bộ đếm sai được reset về 0 |
| 14:18 | Thử đăng nhập sai liên tiếp 3 lần với mật khẩu không đúng | Ở lần sai thứ 3, hệ thống trả về mã lỗi 423 và thông báo "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút". Thử đăng nhập tiếp ngay sau đó với mật khẩu ĐÚNG: hệ thống vẫn từ chối và hiển thị thông báo khóa (đúng yêu cầu FR-02.4) |
| 14:22 | Kiểm tra cơ chế tự động mở khóa sau thời gian khóa | Do mã nguồn đặt `LOCK_DURATION_MS = 15 * 1000` (15 giây) để mô phỏng 15 phút, tiến hành đợi 15 giây rồi đăng nhập lại bằng mật khẩu đúng `Matkhau123`. Kết quả: Hệ thống tự động mở khóa thành công, cho phép đăng nhập và reset bộ đếm về 0 |
| 14:25 | Thử đăng nhập với email viết hoa toàn bộ `SV@NTU.EDU.VN` và nhập sai mật khẩu 3 lần | Hệ thống chuẩn hóa email không phân biệt chữ hoa chữ thường (`toLowerCase()`), sau 3 lần sai vẫn khóa đúng tài khoản sinh viên |

### 1.2. Phân bổ thời gian

| Hoạt động | Ước lượng % thời gian |
|---|---|
| Thiết lập dữ liệu, chuẩn bị | 15% |
| Thăm dò theo charter | 55% |
| Điều tra và thu hẹp hiện tượng bất thường | 20% |
| Ghi chép | 10% |

### 1.3. Phát hiện

**Kết quả trong phạm vi Charter CT-05:**
- Trong 25 phút thực hiện phiên thăm dò bám sát charter CT-05 (luồng đăng nhập, chuỗi đúng/sai xen kẽ, cơ chế khóa và tự mở khóa), hệ thống MiniShop v1.1.0 hoạt động chính xác theo đặc tả SRS v1.2 (FR-02.3, FR-02.4), **không phát sinh khiếm khuyết mới trong phạm vi charter**.
- Các nghi vấn kỹ thuật phát sinh liên quan (như hằng số thời gian khóa mock 15s) được ghi nhận đúng quy tắc vào Mục 1.4 "Câu hỏi còn bỏ ngỏ".

**Danh mục các lỗi nghiêm trọng phát hiện trong đợt kiểm thử hôm nay (chuyển sang tạo Issue ở Mục 2):**  
Theo yêu cầu của đề bài (tạo ít nhất 2 issue từ bất kỳ hoạt động nào: xác nhận, hồi quy, hoặc thăm dò), các lỗi nghiêm trọng nhất phát hiện trong buổi kiểm thử được tổng hợp dưới đây:

| # | Hiện tượng | Nguồn phát hiện | Có tái hiện được không | Mức nghiêm trọng dự kiến | Đã báo thành issue |
|---|---|---|---|---|---|
| 1 | Mật khẩu hợp lệ đúng 8 ký tự (`Abcdef12`) bị từ chối đăng ký với thông báo "Mật khẩu phải có từ 8 đến 20 ký tự" do điều kiện biên viết nhầm `<= 8` | Kiểm thử hồi quy (`TC-65130239-08`) | Có tái hiện được (100%) | High | Đã báo (Issue #1) |
| 2 | Tổng tiền đơn hàng (`total`) trên API `/api/orders` bị tính thiếu phí vận chuyển (`subtotal - discount` thay vì `subtotal - discount + fee`), làm sai lệch tiền thanh toán COD | Kiểm thử xác nhận F-11 & Kiểm tra mã nguồn API | Có tái hiện được (100%) | Critical | Đã báo (Issue #2) |
| 3 | Sắp xếp sản phẩm theo tiêu chí "Giá giảm" (`gia-giam`) trên API `/api/products` và giao diện thực tế lại sắp xếp giá tăng dần | Kiểm thử hồi quy FR-06.5 (`PW-05`) | Có tái hiện được (100%) | Medium | Đã báo (Issue #3) |

### 1.4. Câu hỏi còn bỏ ngỏ

Những chỗ nghi ngờ nhưng chưa đủ thời gian hoặc chưa đủ căn cứ để kết luận:

1. Hằng số thời gian khóa trong mã nguồn `src/services/auth.js` đang được thiết lập là 15 giây (`LOCK_DURATION_MS = 15 * 1000`) nhằm phục vụ việc kiểm thử nhanh trong buổi thực hành; tuy nhiên trên môi trường sản xuất (production) có cấu hình chuyển biến này về đúng 15 phút (900.000 ms) theo đúng đặc tả SRS FR-02.4 hay không?
2. API hủy đơn hàng `DELETE /api/orders/:id` trong `src/server.js` đã bị xóa bỏ điều kiện kiểm tra quyền sở hữu (`o.email === req.user.email`), cho phép bất kỳ thành viên nào cũng có thể hủy đơn hàng của người khác nếu biết ID đơn: đây là lỗi bảo mật phân quyền (IDOR) hay là chủ đích thiết kế cho phép kiểm thử?

## 2. Báo cáo lỗi trên GitHub Issues

Tạo **ít nhất 2 issue** trong repo của mình theo mẫu `.github/ISSUE_TEMPLATE/bao-cao-loi.md`.

| # | Tiêu đề issue | Đường dẫn issue | Severity | Priority | Nguồn phát hiện |
|---|---|---|---|---|---|
| 1 | [BUG] Mật khẩu có độ dài đúng 8 ký tự bị từ chối đăng ký do sai lệch điều kiện biên | https://github.com/PhamThanhBinh2k5/sot357-65130239/issues/1 | High | High | Kiểm thử hồi quy (`TC-65130239-08`) |
| 2 | [BUG] Tổng tiền đơn hàng không cộng phí vận chuyển dẫn đến sai lệch số tiền thanh toán COD | https://github.com/PhamThanhBinh2k5/sot357-65130239/issues/2 | Critical | High | Kiểm thử xác nhận F-11 & Kiểm tra mã nguồn API |
| 3 | [BUG] Sắp xếp sản phẩm theo tiêu chí Giá giảm dần trả về thứ tự giá tăng dần | https://github.com/PhamThanhBinh2k5/sot357-65130239/issues/3 | Medium | Medium | Kiểm thử hồi quy FR-06.5 (`PW-05`) |

### 2.1. Giải thích lựa chọn Severity và Priority

Chọn **Issue #2** ([BUG] Tổng tiền đơn hàng không cộng phí vận chuyển dẫn đến sai lệch số tiền thanh toán COD):
- **Severity (Critical):** Đây là lỗi nghiêm trọng ở mức tính toán tài chính cốt lõi. Trong `src/server.js`, công thức tính tổng tiền đơn hàng viết là `total: detail.subtotal - discount`, hoàn toàn bỏ quên biến phí vận chuyển `fee`. Khi người dùng đặt hàng chọn hình thức COD, hóa đơn và số tiền khách phải trả bị tính thiếu toàn bộ khoản phí ship (20.000đ ở nội thành hoặc 35.000đ ở ngoại thành đối với đơn dưới 500.000đ của thành viên thường). Lỗi này gây sai lệch dữ liệu thanh toán và thất thoát trực tiếp doanh thu của cửa hàng trên mọi đơn hàng phát sinh phí.
- **Priority (High):** Chức năng đặt hàng và tính tiền là luồng nghiệp vụ tạo ra doanh thu quan trọng nhất của hệ thống thương mại điện tử MiniShop NTU. Do lỗi ảnh hưởng trực tiếp đến dòng tiền của đơn vị vận hành và đối soát với bên giao nhận hàng, lỗi cần được lập trình viên sửa chữa ngay lập tức trước khi phát hành phiên bản đến người dùng.

### 2.2. Trường hợp Severity và Priority lệch nhau

Trong các lỗi đã phát hiện ở buổi này, có những trường hợp mức độ nghiêm trọng (Severity) và mức độ ưu tiên (Priority) không đồng nhất:
- **Severity High nhưng Priority Medium/Low:** Điển hình là lỗi tại API `DELETE /api/orders/:id` khi lập trình viên bỏ điều kiện `o.email === req.user.email`, dẫn đến lỗ hổng IDOR (thành viên đăng nhập có thể gửi request xóa đơn hàng của thành viên khác nếu đoán được ID đơn). Về mặt kỹ thuật, Severity là High vì vi phạm tính bảo mật và toàn vẹn dữ liệu. Tuy nhiên, về mặt Priority, lỗi này có thể được xếp ở mức Medium vì hệ thống MiniShop NTU hiện đang ở quy mô nội bộ trường học, mã ID đơn tự tăng nội bộ và người dùng không có giao diện trực tiếp để nhập ID đơn của người khác; các lỗi sai lệch tiền bạc trực tiếp như Issue #2 vẫn cần ưu tiên sửa trước.
- **Severity Low nhưng Priority High:** Ví dụ như lỗi sai chính tả nút bấm chức năng trên thanh điều hướng hoặc lỗi hiển thị định dạng tiền tệ thiếu ký hiệu `đ` ở trang chủ. Về mặt kỹ thuật lỗi này không làm hỏng dữ liệu hay chết server (Severity Low), nhưng do nằm ngay tại vị trí người dùng nhìn thấy đầu tiên, gây ấn tượng xấu về chất lượng sản phẩm nên trong kinh doanh thường được yêu cầu sửa ngay (Priority High).

## 3. Vòng đời lỗi

Ghi lại phản hồi của nhóm phát triển (do giảng viên đóng vai) với các issue đã gửi.

| Issue | Trạng thái nhận được | Phản hồi | Hành động tiếp theo của kiểm thử viên |
|---|---|---|---|
| Issue #1: Mật khẩu đúng 8 ký tự bị từ chối | Fixed | Nhóm phát triển xác nhận lỗi viết nhầm `<= 8`, đã sửa thành `< 8` trong nhánh `hotfix/registration-boundary` | Chạy lại ca kiểm thử `TC-65130239-08` trên bản sửa lỗi; khi kết quả chuyển sang Đạt thì đóng (Close) issue với ghi chú xác nhận |
| Issue #2: Tổng tiền đơn hàng bỏ quên phí vận chuyển | Need more info | Nhóm phát triển hỏi: Có phải thành viên VIP được miễn phí ship nên tổng tiền không cần cộng phí không? | Bổ sung dẫn chứng đặc tả SRS v1.2 mục FR-05.2: Công thức `Tổng tiền = Tạm tính - Giảm giá + Phí vận chuyển` áp dụng cho mọi đối tượng. Với thành viên thường đơn < 500k ngoại thành, phí 35.000đ vẫn bắt buộc phải cộng vào tổng đơn. Cung cấp dữ liệu tái hiện chi tiết để nhóm phát triển chuyển trạng thái sang Đang sửa |

## 4. Kết luận đợt kiểm thử

Dựa trên tiêu chí kết thúc đã nêu trong kế hoạch kiểm thử, trả lời: **Bản 1.1 KHÔNG đủ điều kiện phát hành.**

Lập luận:
1. Về kiểm thử xác nhận: Có tới 3/12 lỗi được tuyên bố đã sửa nhưng thực tế chỉ ở mức `SỬA CHƯA TRỌN` (F-02, F-03, F-07), trong đó việc sửa F-02 gây ra lỗi hồi quy mới chặn người dùng đăng ký mật khẩu hợp lệ có 8 ký tự.
2. Về kiểm thử hồi quy: Phát hiện lỗi hồi quy mức **Critical** tại API đặt hàng (`src/server.js`), làm mất phí vận chuyển trong tổng tiền đơn hàng (vi phạm tiêu chí kết thúc: không được còn lỗi Critical mở).
3. Về chức năng mới FR-06: Xuất hiện lỗi sắp xếp giá giảm dần bị đảo ngược thành giá tăng dần và tùy chọn chỉ hiện hàng tồn kho bị sai điều kiện biên (`stock >= 0`).
Do các tiêu chí kết thúc bắt buộc chưa đạt và rủi ro tài chính còn tồn tại, nhóm kiểm thử khuyến nghị nhóm phát triển khắc phục các issue đã báo và tiến hành đợt kiểm thử hồi quy tiếp theo trước khi phát hành chính thức.
