# BUỔI 3 – PHÂN TÍCH KẾT QUẢ KIỂM THỬ ĐƠN VỊ

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Tổng hợp kết quả chạy `npm test`

| Chỉ số | Giá trị |
|---|---|
| Tổng số ca kiểm thử | 51 |
| Số ca đạt | 42 |
| Số ca thất bại | 9 |

## 2. Phân tích từng ca thất bại

Với mỗi ca thất bại, xác định nguyên nhân thuộc một trong ba loại:

- **LỖI MÃ NGUỒN** – mã nguồn không làm đúng yêu cầu trong SRS v1.1;
- **LỖI CA KIỂM THỬ** – ca kiểm thử của mình hiểu sai yêu cầu hoặc ghi sai kết quả mong đợi;
- **YÊU CẦU CHƯA RÕ** – SRS không đủ căn cứ để kết luận bên nào sai.

| Mã ca | Hàm | Kết quả mong đợi | Kết quả thực tế | Phân loại nguyên nhân | Căn cứ (mã yêu cầu SRS v1.1) |
|---|---|---|---|---|---|
| TC-65130239-01 | validateRegistration | KHONG_HOP_LE | HOP_LE | LỖI MÃ NGUỒN | FR-01.3: Tuổi là số nguyên từ 18 đến 100; mã nguồn viết `< 17` nên chấp nhận tuổi 17 |
| TC-65130239-10 | validateRegistration | KHONG_HOP_LE | HOP_LE | LỖI MÃ NGUỒN | FR-01.4: Mật khẩu có độ dài từ 8 đến 20 ký tự; mã nguồn viết `> 21` nên chấp nhận mật khẩu 21 ký tự |
| TC-65130239-11 | validateRegistration | KHONG_HOP_LE | HOP_LE | LỖI MÃ NGUỒN | FR-01.4: Mật khẩu phải chứa ít nhất một chữ cái và ít nhất một chữ số; mã nguồn bỏ sót điều kiện này |
| TC-65130239-12 | validateRegistration | KHONG_HOP_LE | HOP_LE | LỖI MÃ NGUỒN | FR-01.4: Mật khẩu phải chứa ít nhất một chữ cái và ít nhất một chữ số; mã nguồn bỏ sót điều kiện này |
| TC-65130239-13 | validateQuantity | KHONG_HOP_LE | HOP_LE | LỖI MÃ NGUỒN | FR-03.2: Số lượng của mỗi sản phẩm là số nguyên từ 1 đến 99; mã nguồn viết `n >= 0` nên chấp nhận số lượng bằng 0 |
| TC-65130239-23 | calcShippingFee | 0 | 20000 | LỖI MÃ NGUỒN | FR-04.2: Đơn hàng có tạm tính từ 500.000đ trở lên được miễn phí vận chuyển; mã nguồn viết `> 500000` nên tạm tính 500.000đ bị tính phí |
| TC-65130239-26 | calcShippingFee | 0 | 35000 | LỖI MÃ NGUỒN | FR-04.3: Thành viên VIP được miễn phí vận chuyển ở mọi khu vực; mã nguồn chỉ xét VIP ở nội thành |
| TC-ST-04 | login | failedAttempts = 0 | failedAttempts = 2 | LỖI MÃ NGUỒN | FR-02.3: Một lần đăng nhập đúng sẽ đặt lại bộ đếm số lần sai về 0; mã nguồn không reset `failedAttempts` |
| TC-ST-05 | login | Bị từ chối: "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút" | Bị từ chối: "Sai email hoặc mật khẩu" | LỖI MÃ NGUỒN | FR-02.4: Tài khoản đang khóa phải từ chối kèm thông báo khóa; mã nguồn báo chung "Sai email hoặc mật khẩu" |

## 3. Đối chiếu với kết quả chạy tay ở Buổi 2

Ở Buổi 2 đã chạy tay 5 ca ưu tiên Cao trên giao diện. Lần này kiểm thử ở mức hàm.

**3.1.** Ca nào phát hiện được ở mức hàm mà **không** kiểm được qua giao diện? Vì sao?

- **Ca phát hiện được:** Các ca kiểm thử giá trị biên bị chặn bởi HTML5 validation trên giao diện (như nhập số lượng `quantity = 0` hoặc số thập phân `1.5`, tuổi là số thực `55.5`), ca gọi hàm với tham số bất thường (giá trị âm, chuỗi, thiếu tham số) và ca kiểm tra bộ đếm số lần đăng nhập sai `user.failedAttempts` được reset về 0 (FR-02.3).
- **Vì sao:** Trên giao diện web, các thuộc tính HTML5 (`min="1"`, `max="99"`, `step="1"`) hoặc mã JavaScript phía client ngăn chặn người dùng gửi dữ liệu không hợp lệ xuống hàm backend; đồng thời các biến trạng thái nội bộ trong bộ nhớ (`failedAttempts`) không được hiển thị trực tiếp lên giao diện nên chạy tay không thể quan sát được giá trị của chúng. Kiểm thử đơn vị ở mức hàm gọi trực tiếp hàm và kiểm tra được cấu trúc dữ liệu bên trong.

**3.2.** Ca nào phải kiểm qua giao diện mới thấy, kiểm ở mức hàm không đủ?

- **Các ca:**
  + Kiểm tra hiển thị thông báo popup/toast "Đăng ký thành công" hoặc thông báo khóa tài khoản xuất hiện đúng kiểu và vị trí trên màn hình.
  + Kiểm tra định dạng hiển thị tiền tệ Việt Nam (NFR-05: số tiền có dấu chấm phân cách hàng nghìn và đuôi `đ`, ví dụ `150.000đ`).
  + Kiểm tra tính phản hồi của giao diện: khi người dùng thay đổi số lượng trong giỏ hàng hoặc chọn khu vực giao hàng, tổng tiền trên màn hình tự động cập nhật ngay lập tức mà không cần tải lại trang.
  + Kiểm tra trải nghiệm chuyển trang: sau khi đăng nhập thành công thì chuyển hướng về trang chủ và hiển thị tên người dùng trên thanh điều hướng.

**3.3.** Nêu một ưu điểm và một hạn chế của kiểm thử đơn vị so với chạy tay trên giao diện.

- **Ưu điểm:** Tốc độ thực thi cực nhanh (51 ca chạy trong dưới 1 giây), hoàn toàn tự động hóa và có thể chạy lặp lại trong quy trình CI/CD; cô lập chính xác vị trí dòng lệnh bị lỗi và dễ dàng giả lập các kịch bản biên khó dựng (bằng mock).
- **Hạn chế:** Không kiểm thử được sự phối hợp giữa các tầng (frontend - backend - cơ sở dữ liệu), không phát hiện được lỗi giao diện người dùng (CSS, layout, font chữ) và không phản ánh được trải nghiệm thực tế của người dùng cuối.

## 4. Chất lượng bộ ca thiết kế ở Buổi 2

Khi chuyển bộ ca sang mã Jest, có ca nào phải sửa lại không?

| Mã ca | Vấn đề gặp phải khi chuyển thành mã | Đã sửa như thế nào |
|---|---|---|
| Không có | Bộ dữ liệu ở Buổi 2 đã thiết kế đầu vào dưới dạng JSON chuẩn và kết quả mong đợi chuẩn hóa (`HOP_LE`/`KHONG_HOP_LE`, số tiền phí vận chuyển), khớp chính xác với SRS v1.1 | Giữ nguyên toàn bộ ca trong file CSV; xử lý chuyển đổi kiểu dữ liệu (chuỗi sang số, boolean sang nhãn hợp lệ) trực tiếp trong file kiểm thử Jest |

Nếu không phải sửa ca nào, ghi rõ "không có" và nêu lý do bộ ca đã đủ rõ.

- **Lý do:** Bộ ca thiết kế ở Buổi 2 trong file `Buoi02-DuLieuKiemThu.csv` đã định lượng rõ ràng dữ liệu đầu vào dưới dạng JSON hợp lệ, kết quả mong đợi được chuẩn hóa thành các hằng số rõ ràng (`HOP_LE`, `KHONG_HOP_LE`, số nguyên phí vận chuyển), bám sát từng quy tắc trong SRS v1.1 nên khi ánh xạ sang cú pháp `test.each` của Jest không phát sinh hiểu nhầm hay phải điều chỉnh kết quả mong đợi.
