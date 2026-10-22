# BUỔI 4 – KIỂM THỬ XÁC NHẬN VÀ KIỂM THỬ HỒI QUY

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Kiểm thử xác nhận

Với mỗi mục trong phần 1 của `docs/GhiChuPhatHanh-v1.1.md`, chạy lại ca kiểm thử tương ứng và kết luận.

Cột **Kết luận** nhận một trong ba giá trị:
- `ĐÃ SỬA` — hành vi đúng hoàn toàn theo SRS v1.2;
- `SỬA CHƯA TRỌN` — có cải thiện nhưng vẫn còn sai lệch so với yêu cầu;
- `CHƯA SỬA` — hành vi không đổi.

| Mã | Lỗi đã báo | Mã ca kiểm thử dùng lại | Kết quả thực tế trên v1.1 | Kết luận | Ghi chú |
|---|---|---|---|---|---|
| F-01 | Chấp nhận tuổi 17 | TC-65130239-01 | Từ chối tạo tài khoản, trả về thông báo lỗi "Tuổi không nằm trong phạm vi cho phép" | ĐÃ SỬA | Đã kiểm tra thêm tuổi 18 và 100 được chấp nhận, tuổi 101 bị từ chối đúng FR-01.3 |
| F-02 | Chấp nhận mật khẩu 21 ký tự | TC-65130239-10 | Mật khẩu 21 ký tự bị từ chối với thông báo "Mật khẩu phải có từ 8 đến 20 ký tự". Tuy nhiên khi thử mật khẩu đúng 8 ký tự (TC-65130239-08: Abcdef12) thì cũng bị từ chối do code viết "pwd.length <= 8" | SỬA CHƯA TRỌN | Đã chặn được 21 ký tự nhưng điều kiện biên viết nhầm "<= 8" làm từ chối sai cả mật khẩu hợp lệ có đúng 8 ký tự theo FR-01.4 |
| F-03 | Không kiểm tra thành phần mật khẩu | TC-65130239-11, TC-65130239-12 | Mật khẩu toàn chữ (Matkhauab) và toàn số (12345678) bị từ chối với thông báo "Mật khẩu phải có ít nhất một chữ cái và một chữ số". Tuy nhiên mật khẩu chữ in hoa kèm số (ABCDEF12) vẫn bị từ chối do regex chỉ kiểm tra "/[a-z]/" | SỬA CHƯA TRỌN | Bỏ sót trường hợp chữ cái in hoa [A-Z], vi phạm yêu cầu "chứa ít nhất một chữ cái" của FR-01.4 |
| F-04 | Bộ đếm sai không được đặt lại | TC-65130239-33 | Đăng nhập sai 1 hoặc 2 lần rồi đăng nhập đúng mật khẩu: user.failedAttempts được đặt lại về 0 | ĐÃ SỬA | Đạt theo FR-02.3, kiểm chứng qua auth-mock.test.js và đăng nhập thực tế |
| F-05 | Thông báo khi bị khóa, tự mở khóa | TC-65130239-32, TC-65130239-34, TC-65130239-35 | Đăng nhập sai 3 lần liên tiếp báo lỗi 423 "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút". Trong thời gian khóa, nhập đúng mật khẩu vẫn bị từ chối. Hết thời gian khóa, tài khoản tự động mở khóa và reset bộ đếm về 0 | ĐÃ SỬA | Kiểm chứng: Mã nguồn đặt LOCK_DURATION_MS = 15*1000 (15 giây) để mô phỏng 15 phút, sau 15 giây tài khoản tự mở khóa đúng nghiệp vụ |
| F-06 | Thêm sản phẩm với số lượng 0 | TC-65130239-13 | Thêm sản phẩm với số lượng 0 bị từ chối, trả về mã lỗi 400 và thông báo "Số lượng phải là số nguyên từ 1 đến 99" | ĐÃ SỬA | Hàm validateQuantity đã chặn n < 1 đúng FR-03.2 |
| F-07 | Chưa giới hạn tổng số lượng giỏ | TC-65130239-19, TC-65130239-20 | Thêm sản phẩm mới làm tổng số lượng vượt 200 bị từ chối với mã lỗi 400. Tuy nhiên khi cập nhật số lượng của sản phẩm đã có sẵn trong giỏ, hàm tongSoLuong cộng dồn cả số lượng mới với số lượng cũ thay vì thay thế, dẫn đến từ chối cập nhật hợp lệ | SỬA CHƯA TRỌN | Logic kiểm tra giỏ hàng chỉ đúng khi thêm sản phẩm mới; sai lệch khi cập nhật số lượng của sản phẩm đã có trong giỏ (FR-03.3 và FR-03.4) |
| F-08 | Thêm sản phẩm không tồn tại | do-phu: addToCart 9999 (TC thêm productId=9999) | Trả về mã lỗi 404 và thông báo "Sản phẩm không tồn tại" | ĐÃ SỬA | Đạt theo FR-03.6; hàm addToCart đã kiểm tra store.findProduct(productId) |
| F-09 | Đơn đúng 500.000đ không miễn phí | TC-65130239-23 | Đơn hàng nội thành có tạm tính đúng 500.000đ được tính phí vận chuyển là 0đ | ĐÃ SỬA | Mã nguồn đã đổi thành subtotal >= FREE_SHIPPING_THRESHOLD đúng FR-04.2 |
| F-10 | VIP ngoại thành vẫn bị tính phí | TC-65130239-26 | Thành viên VIP mua hàng giao ngoại thành được tính phí vận chuyển là 0đ | ĐÃ SỬA | Mã nguồn calcShippingFee đã miễn phí vận chuyển cho VIP ở mọi khu vực đúng FR-04.3 |
| F-11 | Chưa giảm 5% cho VIP | TC-65130239-25 | Khi thành viên VIP tạo đơn hàng trên /api/orders, hệ thống đã tính trường discount bằng 5% tạm tính (ví dụ tạm tính 400.000đ được giảm 20.000đ) | ĐÃ SỬA | Riêng yêu cầu giảm giá 5% cho VIP đã được thực hiện đúng FR-05.3. Tuy nhiên phát hiện lỗi hồi quy mới: công thức tổng tiền quên cộng phí vận chuyển |
| F-12 | Hủy đơn không tồn tại gây lỗi 500 | API-DELETE-01 (DELETE /api/orders/9999) | Hủy đơn không tồn tại trả về 404 "Không tìm thấy đơn hàng"; đơn ở trạng thái khác "CHO_XAC_NHAN" trả về 409 "Chỉ hủy được đơn ở trạng thái Chờ xác nhận" | ĐÃ SỬA | Đạt theo FR-05.5; tuy nhiên mã nguồn đã bỏ điều kiện kiểm tra email chủ sở hữu đơn hàng |

**Tổng hợp:** ĐÃ SỬA 9 / SỬA CHƯA TRỌN 3 / CHƯA SỬA 0

## 2. Kiểm thử hồi quy bằng bộ kiểm thử đơn vị

Chạy `npm test` trên bản v1.1 và so sánh với kết quả đã ghi ở Buổi 3.

| Chỉ số | Buổi 3 (v1.0) | Buổi 4 (v1.1) |
|---|---|---|
| Tổng số ca | 51 | 51 |
| Số ca đạt | 42 | 47 |
| Số ca thất bại | 9 | 4 |

### 2.1. Ca chuyển từ thất bại sang đạt

| Tên ca kiểm thử | Lỗi tương ứng đã được sửa |
|---|---|
| `validateRegistration - TC-65130239-01: KHONG_HOP_LE` (tuổi 17) | F-01: Hệ thống chấp nhận đăng ký với tuổi 17 (FR-01.3) |
| `validateRegistration - TC-65130239-10: KHONG_HOP_LE` (mật khẩu 21 ký tự) | F-02: Hệ thống chấp nhận mật khẩu dài 21 ký tự (FR-01.4) |
| `validateRegistration - TC-65130239-11: KHONG_HOP_LE` (mật khẩu không có số) | F-03: Hệ thống chưa kiểm tra mật khẩu phải có cả chữ cái và chữ số (FR-01.4) |
| `validateRegistration - TC-65130239-12: KHONG_HOP_LE` (mật khẩu không có chữ) | F-03: Hệ thống chưa kiểm tra mật khẩu phải có cả chữ cái và chữ số (FR-01.4) |
| `validateQuantity - TC-65130239-13: KHONG_HOP_LE` (số lượng 0) | F-06: Thêm sản phẩm với số lượng 0 vẫn thành công (FR-03.2) |
| `calcShippingFee - TC-65130239-23: 0` (đơn đúng 500.000đ nội thành) | F-09: Đơn hàng đúng 500.000đ không được miễn phí vận chuyển (FR-04.2) |
| `calcShippingFee - TC-65130239-26: 0` (VIP ngoại thành) | F-10: Thành viên VIP ở ngoại thành vẫn bị tính phí vận chuyển (FR-04.3) |
| `auth-mock: đăng nhập đúng sau 2 lần sai thì bộ đếm về 0 (FR-02.3)` | F-04: Bộ đếm số lần đăng nhập sai không được đặt lại sau khi đăng nhập đúng (FR-02.3) |
| `auth-mock: tài khoản đang bị khóa, nhập đúng mật khẩu vẫn bị từ chối kèm thông báo khóa (FR-02.4)` | F-05: Tài khoản bị khóa báo "Sai email hoặc mật khẩu" thay vì thông báo bị khóa (FR-02.4) |

### 2.2. Ca chuyển từ đạt sang thất bại (lỗi hồi quy)

Đây là phần quan trọng nhất của buổi học: bản sửa lỗi đã làm hỏng thứ vốn đang chạy đúng.

| Tên ca kiểm thử | Kết quả mong đợi | Kết quả thực tế trên v1.1 | Nguyên nhân: lỗi hồi quy của mã nguồn, hay ca kiểm thử đã lỗi thời? | Căn cứ (SRS v1.2) |
|---|---|---|---|---|
| `validateRegistration - TC-65130239-08: HOP_LE` (mật khẩu đúng 8 ký tự: `Abcdef12`) | `HOP_LE` (tài khoản đăng ký thành công) | `KHONG_HOP_LE` (báo lỗi: "Mật khẩu phải có từ 8 đến 20 ký tự") | **Lỗi hồi quy của mã nguồn:** Mã nguồn viết nhầm điều kiện biên `pwd.length <= 8` thay vì `< 8`, dẫn đến từ chối mật khẩu có đúng 8 ký tự | FR-01.4: Mật khẩu có độ dài từ 8 đến 20 ký tự (bao gồm cả 8 và 20) |
| `do-phu: giá trị đơn hàng âm thì ném lỗi` (`calcShippingFee` với `subtotal = -10000`) | Ném ngoại lệ: "Giá trị đơn hàng không hợp lệ" | Hàm không ném ngoại lệ mà trả về phí 20000 | **Lỗi hồi quy của mã nguồn:** Trong `shipping.js`, lập trình viên đã xóa điều kiện kiểm tra `subtotal < 0`, chấp nhận đơn hàng có giá trị âm | FR-04: Tạm tính của đơn hàng là tổng giá trị hàng hóa, không thể là số âm |
| `do-phu: xem chi tiết giỏ khi sản phẩm không tồn tại trong danh mục` (`addToCart(EMAIL, 9999, 1)`) | `kq.ok === true`, hiển thị tên sản phẩm là `(không xác định)` và giá 0 | `kq.ok === false`, status 404, message "Sản phẩm không tồn tại" | **Ca kiểm thử đã lỗi thời:** Bản v1.0 có lỗi F-08 cho phép thêm sản phẩm rác vào giỏ, ca test cũ viết để phản ánh lỗi đó. Bản v1.1 đã sửa F-08 đúng chuẩn nên ca test cũ bị fail | FR-03.6: Thêm vào giỏ một sản phẩm không tồn tại, hệ thống báo lỗi "Sản phẩm không tồn tại" |
| `auth-mock: sai mật khẩu MAX_FAILED_ATTEMPTS lần liên tiếp thì tài khoản bị khóa` | `kq.message === 'Tài khoản đã bị khóa'` | `kq.message === 'Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút'` | **Ca kiểm thử đã lỗi thời:** Ca kiểm thử ở Buổi 3 so sánh với chuỗi thông báo rút gọn chưa chuẩn của v1.0. Bản v1.1 đã cập nhật thông báo đầy đủ theo đúng SRS | FR-02.4: Thông báo phải là "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút" |

> Một ca đang xanh chuyển sang đỏ **không phải lúc nào cũng** là lỗi mã nguồn. Nếu yêu cầu thay đổi hoặc hành vi cũ vốn đã sai, chính ca kiểm thử mới là thứ cần cập nhật. Trường hợp đó, ghi rõ ở bảng trên và sửa ca kiểm thử.

**Thực hiện cập nhật 2 ca kiểm thử đã lỗi thời:**
- Đã sửa ca `do-phu: xem chi tiết giỏ khi sản phẩm không tồn tại trong danh mục` trong `tests/unit/do-phu.test.js`: kỳ vọng `kq.ok === false`, status 404 và message "Sản phẩm không tồn tại" theo đúng FR-03.6.
- Đã sửa ca `auth-mock: sai mật khẩu MAX_FAILED_ATTEMPTS lần liên tiếp thì tài khoản bị khóa` trong `tests/unit/auth-mock.test.js`: cập nhật chuỗi thông báo khóa sang "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút" theo đúng FR-02.4.

**Kết quả chạy lại sau khi cập nhật ca test lỗi thời:**
- **Tổng số ca:** 51
- **Số ca đạt:** 49
- **Số ca thất bại còn lại:** 2 ca (cô lập chính xác 100% hai lỗi hồi quy thực sự của mã nguồn: `TC-65130239-08` do viết nhầm `<= 8` và ca kiểm tra `subtotal < 0` trong `shipping.js` do bị xóa điều kiện biên âm).

## 3. Kiểm thử hồi quy trên chức năng mới FR-06

Chạy bộ ca pairwise (bài tự chọn Buổi 2) hoặc tự thiết kế tối thiểu 6 ca cho màn hình lọc.

| # | Từ khóa | Danh mục | Khoảng giá | Sắp xếp | Chỉ còn hàng | Kết quả mong đợi | Kết quả thực tế | Pass/Fail |
|---|---|---|---|---|---|---|---|---|
| 1 | *(bỏ trống)* | Tất cả | Trên 300k | Mới nhất | Có | 2 sản phẩm: Áo khoác gió NTU (id: 7), Balo laptop (id: 4) theo thứ tự id giảm dần | Đúng 2 sản phẩm: Áo khoác gió NTU (id: 7), Balo laptop (id: 4) | Pass |
| 2 | *(bỏ trống)* | Quà lưu niệm | Dưới 100k | Giá tăng | Có | Hiển thị thông báo "Không tìm thấy sản phẩm phù hợp" (không có món nào < 100k) | Hiển thị "Không tìm thấy sản phẩm phù hợp" | Pass |
| 3 | NTU | Tất cả | Dưới 100k | Mới nhất | Không | 1 sản phẩm: Bút ký NTU (id: 6, giá 35.000đ) | 1 sản phẩm: Bút ký NTU (giá 35.000đ) | Pass |
| 4 | *(bỏ trống)* | Đồ dùng học tập | 100k–300k | Giá giảm | Có | Hiển thị thông báo "Không tìm thấy sản phẩm phù hợp" (các món học tập có giá 35k, 50k, 350k) | Hiển thị "Không tìm thấy sản phẩm phù hợp" | Pass |
| 5 | *(bỏ trống)* | Tất cả | *(tất cả)* | Giá giảm | Không | Danh sách 7 sản phẩm sắp xếp giảm dần theo giá: Áo khoác gió (450k) $\to$ Balo (350k) $\to$ Nón BH (200k) $\to$ Áo thun (150k) $\to$ Bình nước (100k) $\to$ Sổ tay (50k) $\to$ Bút ký (35k) | Danh sách bị sắp xếp tăng dần theo giá: Bút ký (35k) $\to$ Sổ tay (50k) $\to$ ... do mã nguồn viết chung điều kiện `sapXep === 'gia-tang' \|\| sapXep === 'gia-giam'` đều sort `a.price - b.price` | Fail |
| 6 | *(bỏ trống)* | Quà lưu niệm | 100k–300k | Mới nhất | Có | Chỉ hiển thị sản phẩm còn hàng: Áo thun NTU (id: 1, tồn: 12). Ẩn Bình nước (tồn 0) và Nón BH (tồn 0) | Hiển thị cả 3 sản phẩm gồm cả Bình nước (tồn: 0) và Nón BH (tồn: 0) do mã nguồn viết `filter(p => p.stock >= 0)` | Fail |

## 4. Ma trận truy vết cập nhật

| Yêu cầu | Mã ca phủ | Trạng thái trên v1.1 (Đạt / Không đạt / Chưa phủ) |
|---|---|---|
| FR-01.3 | TC-65130239-01, TC-65130239-02, TC-65130239-03, TC-65130239-04 | Đạt |
| FR-01.4 | TC-65130239-06, TC-65130239-07, TC-65130239-08, TC-65130239-10, TC-65130239-11, TC-65130239-12 | Không đạt |
| FR-02.3 | TC-65130239-31, TC-65130239-32, TC-65130239-33, auth-mock | Đạt |
| FR-02.4 | TC-65130239-34, TC-65130239-35, TC-65130239-36, auth-mock | Đạt |
| FR-03.2 | TC-65130239-13, TC-65130239-14, TC-65130239-15, TC-65130239-16 | Đạt |
| FR-03.4 | TC-65130239-18, TC-65130239-19, TC-65130239-20 | Không đạt |
| FR-03.6 | do-phu (addToCart với ID không tồn tại) | Đạt |
| FR-04.2 | TC-65130239-23, TC-65130239-24 | Đạt |
| FR-04.3 | TC-65130239-25, TC-65130239-26 | Đạt |
| FR-05.2 | TC-65130239-28, ca đặt hàng API /api/orders | Không đạt |
| FR-05.3 | TC-65130239-27, ca đặt hàng VIP /api/orders | Đạt |
| FR-05.5 | ca DELETE /api/orders/:id | Không đạt |
| FR-06.1 | Dữ liệu danh mục và tồn kho của 7 sản phẩm trong store.js (PW-01 đến PW-06) | Đạt |
| FR-06.2 | PW-03, PW-05 | Đạt |
| FR-06.3 | PW-02, PW-04 | Đạt |
| FR-06.4 | PW-01, PW-02 | Đạt |
| FR-06.5 | PW-05 | Không đạt |
| FR-06.6 | PW-06 | Không đạt |
| FR-06.7 | PW-01, PW-02, PW-03, PW-04, PW-05, PW-06 | Đạt |
| FR-06.8 | PW-05, PW-06 (hiển thị nhãn Hết hàng cho sản phẩm tồn kho = 0) | Đạt |
