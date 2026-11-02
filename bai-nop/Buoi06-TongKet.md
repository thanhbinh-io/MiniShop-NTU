# BUỔI 6 – TỔNG KẾT CHUỖI SÁU BUỔI THỰC HÀNH

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239
- **Đường dẫn repo:** https://github.com/LOQ-ntu/sot357-65130239

## 1. Hồ sơ kiểm thử đã xây dựng

| Buổi | Sản phẩm | Vị trí trong repo | Số lượng |
|---|---|---|---|
| 1 | Phiếu review SRS, mã đã sửa theo ESLint | `bai-nop/Buoi01-ReviewSRS.md`, `src/lab-static/orderUtils.js` | 11 lỗi tài liệu, 8 cảnh báo linter |
| 2 | Bộ ca kiểm thử thiết kế | `bai-nop/Buoi02-DesignTestCases.md` | 24 ca kiểm thử hộp đen |
| 3 | Bộ kiểm thử đơn vị | `tests/unit/*.test.js` | 25 ca kiểm thử Jest |
| 4 | Test plan, kết quả xác nhận và hồi quy, báo cáo lỗi | `bai-nop/Buoi04-TestPlan.md`, `bai-nop/Buoi04-BaoCaoKetQua.md` | 3 issue GitHub, 12 ca xác nhận, 10 ca hồi quy |
| 5 | Bộ kiểm thử đầu cuối, Page Object | `tests/e2e/*.spec.js`, `tests/pages/*.js` | 21 ca kiểm thử Playwright E2E |
| 6 | Bộ kiểm thử API, pipeline CI | `tests/api/*.spec.js`, `.github/workflows/kiem-thu-day-du.yml` | 21 ca API, 1 quy trình CI 9 bước |

## 2. Bản đồ lỗi theo tầng kiểm thử

Với mỗi lỗi đã phát hiện trong cả khóa, ghi lại **tầng nào bắt được**. Đánh dấu `X` vào các cột tương ứng; một lỗi có thể bị bắt ở nhiều tầng. Phải điền **ít nhất 9 dấu `X`**.

Chín dòng đầu đã được ghi tên sẵn. Các dòng trống ở cuối dành cho những lỗi khác mà bản thân đã phát hiện trong cả đợt — kể cả lỗi tài liệu tìm được ở Buổi 1 và lỗi chỉ tầng đơn vị bắt được; thêm dòng nếu cần.

| Lỗi | Review tĩnh | Đơn vị | API | E2E | Thủ công / thăm dò |
|---|---|---|---|---|---|
| Chấp nhận tuổi dưới giới hạn | X | X | X | X | X |
| Mật khẩu 8 ký tự bị từ chối | X | X | | | X |
| Mật khẩu chữ in hoa bị từ chối | X | X | X | | X |
| Giỏ hàng cộng dồn khi cập nhật số lượng | X | X | X | X | X |
| Tài khoản tự mở khóa quá sớm | | X | | | X |
| Hủy được đơn của tài khoản khác | | | X | | |
| Tổng tiền thiếu phí vận chuyển | | | X | X | X |
| Sắp xếp giá giảm dần không hoạt động | | | X | X | X |
| Lọc "chỉ còn hàng" không hoạt động | | | X | X | X |
| Ngưỡng miễn phí vận chuyển SRS mâu thuẫn | X | | | | |
| **Tổng số dấu theo tầng** | 5 | 5 | 7 | 5 | 8 |

### 2.1. Nhận xét

**2.1.1.** Lỗi nào **chỉ** bắt được ở một tầng duy nhất? Lập bảng, mỗi dòng gồm: lỗi, tầng duy nhất bắt được, và hậu quả nếu bỏ tầng đó khỏi chiến lược kiểm thử.

| Lỗi | Tầng duy nhất bắt được | Hậu quả nếu bỏ tầng này |
|---|---|---|
| Hủy được đơn của tài khoản khác (Lỗ hổng IDOR / Phân quyền) | API | Nếu bỏ tầng API, lỗ hổng này sẽ lọt ra môi trường sản phẩm (production). Kẻ xấu có thể gửi request DELETE trực tiếp đến API để hủy toàn bộ đơn hàng của khách hàng khác mà không thể bị phát hiện qua UI hay Unit test. |
| Ngưỡng miễn phí vận chuyển SRS mâu thuẫn (giữa 300k và 500k) | Review tĩnh | Nếu bỏ review tĩnh, sự mơ hồ trong tài liệu yêu cầu sẽ dẫn tới lập trình viên hiểu một kiểu, kiểm thử viên hiểu một kiểu, gây lãng phí thời gian tranh cãi khi viết test. |

**2.1.2.** Tầng nào bắt được nhiều lỗi nhất? Có phải tầng đó quan trọng nhất không? Giải thích.
- Tầng **Thủ công / thăm dò** bắt được nhiều biểu hiện lỗi nhất (8 dấu X), tiếp theo là **API** (6 dấu X) và **Đơn vị / Tĩnh / E2E** (5 dấu X).
- **Không phải cứ bắt được nhiều lỗi nhất là quan trọng nhất.** Mỗi tầng có vai trò và chi phí riêng:
  - Kiểm thử thủ công rất nhạy với các lỗi giao diện và trải nghiệm người dùng, nhưng tốn thời gian, dễ sai sót do con người và không thể chạy tự động hàng trăm lần mỗi ngày khi có code mới.
  - Kiểm thử tĩnh và đơn vị bắt lỗi từ rất sớm (Shift-Left Testing) khi chi phí sửa chữa còn rẻ nhất.
  - Tầng API bắt được các lỗi bảo mật và phân quyền mà không tầng nào khác bắt được.
  - Sự kết hợp bổ trợ giữa các tầng mới tạo nên chất lượng toàn diện.

**2.1.3.** Đối chiếu với **tháp kiểm thử** (Chương 6): tỷ lệ số ca giữa ba tầng trong repo của mình là bao nhiêu? Tỷ lệ đó có hợp lý không?
- Tỷ lệ số ca kiểm thử tự động trong repo:
  - Đơn vị: 25 ca (~38%)
  - API: 21 ca (~31%)
  - Đầu cuối (E2E): 21 ca (~31%)
- **Đánh giá:** Tỷ lệ này có hình dáng tương đối cân đối giữa các tầng tự động, tuy nhiên phần kiểm thử đơn vị (25 ca) còn hơi thấp so với mô hình kim tự tháp chuẩn (vốn khuyến nghị tầng đơn vị chiếm 60–70% số lượng ca vì tốc độ nhanh và chi phí thấp). Tầng E2E (21 ca) chiếm tỷ trọng khá lớn, điều này làm tổng thời gian chạy CI kéo dài lên gần 3 phút. Nếu phát triển tiếp, nhóm nên mở rộng thêm số lượng ca ở tầng Đơn vị và API để giảm bớt tải cho tầng E2E.

## 3. Chi phí và giá trị của từng tầng

Thời gian chạy phải **đo thật**, không ước lượng. Cột cuối đếm số lỗi mà **chỉ** tầng đó phát hiện được, lấy từ bản đồ ở mục 2.

| Tầng | Số ca | Thời gian chạy (đo thật) | Thời gian viết (ước lượng, giờ) | Số lỗi riêng tầng này bắt được |
|---|---|---|---|---|
| Review tĩnh | 11 mục review + ESLint | 1.8s (ESLint) | 3h | 1 |
| Đơn vị | 25 ca | 1.5s | 2h | 0 |
| API | 21 ca | 10.2s | 2.5h | 2 |
| E2E | 21 ca | 43.3s | 4h | 0 |
| Thủ công / thăm dò | 12 ca xác nhận + charter | ~25 phút | 1h | 0 |

**3.1.** Nếu đợt kiểm thử chỉ còn **một nửa** thời gian, thứ tự ưu tiên giữ lại các tầng là gì? Căn cứ vào bảng trên, không căn cứ vào cảm nhận.
- Căn cứ vào chi phí thời gian chạy và khả năng bắt lỗi độc nhất:
  1. **Tầng API (Ưu tiên 1):** Thời gian chạy nhanh (8.3s), chi phí viết vừa phải (2.5h), bắt được lỗi nghiêm trọng độc nhất mà không tầng nào thay thế được (Lỗi IDOR).
  2. **Tầng Đơn vị (Ưu tiên 2):** Thời gian chạy cực nhanh (1.5s), kiểm tra triệt để các rẽ nhánh logic và tính toán giá trị biên với chi phí thấp nhất.
  3. **Tầng Review tĩnh (Ưu tiên 3):** Phát hiện lỗi mâu thuẫn tài liệu ngay từ đầu giúp tiết kiệm toàn bộ thời gian hiểu nhầm ở các bước sau.
  4. **Tầng E2E (Cắt giảm bớt):** Chỉ giữ lại 2–3 ca kiểm thử luồng chính quan trọng nhất (Smoke test), vì thời gian viết lâu nhất (4h) và thời gian chạy chậm nhất (43.3s).
  5. **Tầng Thủ công (Chuyển sang tự động hóa):** Cắt giảm phần kiểm thử thủ công lặp đi lặp lại, chỉ dành thời gian ngắn cho kiểm thử thăm dò (Exploratory Testing) các tính năng nhạy cảm.

**3.2.** Nếu chỉ còn thời gian viết thêm 10 ca kiểm thử cho MiniShop, sẽ viết ở tầng nào? Vì sao?
- Tôi sẽ chọn viết ở **Tầng API**.
- **Lý do:**
  1. Tầng API có tỷ lệ chi phí / hiệu quả (cost-effectiveness) tối ưu: thời gian thực thi rất nhanh (vài mili-giây cho mỗi request) nhưng vẫn kiểm thử được toàn bộ chu trình xử lý của backend (Express router, middleware xác thực, cơ sở dữ liệu/store).
  2. Tầng API cho phép giả lập các tình huống biên phức tạp và các luồng bảo mật độc hại (như token hết hạn, request giả mạo, IDOR, brute-force tấn công đăng nhập) mà giao diện web người dùng không hỗ trợ thực hiện.

## 4. Đánh giá chất lượng và khuyến nghị phát hành

### 4.1. Đối chiếu tiêu chí kết thúc

Dẫn lại tiêu chí kết thúc đã viết trong kế hoạch kiểm thử Buổi 4 (`bai-nop/Buoi04-TestPlan.md`).

| Tiêu chí kết thúc (nguyên văn Buổi 4) | Trạng thái hiện tại | Đạt / Không đạt |
|---|---|---|
| 100% (12/12) ca kiểm thử xác nhận được thực thi và có kết luận rõ ràng (ĐÃ SỬA / SỬA CHƯA TRỌN / CHƯA SỬA). | Đã thực thi đủ 12/12 ca và ghi nhận chi tiết trong báo cáo Buổi 4. | Đạt |
| 100% các ca kiểm thử hồi quy được chạy; mỗi ca thất bại đều được phân tích rõ nguyên nhân (lỗi mã nguồn hay ca kiểm thử lỗi thời). | Đã thực thi toàn bộ ca hồi quy và xác định rõ 3 ca thất bại do lỗi cài sẵn của MiniShop v1.1. | Đạt |
| Không còn lỗi mức Critical (Nghiêm trọng cao nhất) ở trạng thái mở mà không có giải pháp xử lý hoặc sự chấp thuận rủi ro. | Hiện tại hệ thống vẫn còn lỗi Critical về phân quyền API (FR-05.5 IDOR hủy đơn) và lỗi High về tính sai tổng tiền (FR-05.2 thiếu phí vận chuyển) chưa được vá. | **Không đạt** |
| Hoàn thành đủ 25 phút phiên kiểm thử thăm dò với ít nhất 4 mốc thời gian trong nhật ký và tạo ít nhất 2 GitHub Issues báo cáo lỗi. | Đã hoàn thành phiên 25 phút, nhật ký 5 mốc thời gian và mở đủ các issue báo cáo lỗi. | Đạt |

### 4.2. Tóm tắt tình trạng chất lượng
Hiện tại MiniShop NTU v1.1.0 vẫn còn **3 lỗi chức năng và bảo mật nghiêm trọng đang mở (chưa sửa)**:
1. **Lỗi bảo mật Critical (FR-05.5):** API hủy đơn hàng cho phép tài khoản này hủy đơn hàng của tài khoản khác mà không kiểm tra email chủ sở hữu.
2. **Lỗi tài chính High (FR-05.2):** Tổng tiền thanh toán của đơn hàng bỏ quên không cộng phí vận chuyển, gây thất thoát doanh thu cho cửa hàng.
3. **Lỗi trải nghiệm người dùng Medium (FR-06.5, FR-06.6):** Tính năng lọc "chỉ còn hàng" vẫn hiển thị hàng hết tồn kho và tính năng sắp xếp giá giảm dần lại sắp xếp tăng dần.
Vùng chức năng có rủi ro cao nhất là **Thanh toán đơn hàng (Checkout/Orders)** và **Bảo mật phân quyền API**.

### 4.3. Khuyến nghị

- **Kết luận:** **KHÔNG ĐỦ** điều kiện phát hành (NOT READY FOR RELEASE).
- **Căn cứ:**
  - Vi phạm trực tiếp tiêu chí kết thúc số 3 của kế hoạch kiểm thử: vẫn tồn tại lỗi mức Critical về an ninh bảo mật và tính toán tài chính chưa được khắc phục.
  - Có 4 ca kiểm thử API và 3 ca kiểm thử E2E liên tục báo ĐỎ trong quy trình CI.
- **Nếu không đủ, danh sách việc phải làm trước, theo thứ tự:**
  1. **Vá lỗi bảo mật API (Ưu tiên 1 - Ngay lập tức):** Bổ sung điều kiện kiểm tra `order.email === req.user.email` trong endpoint `DELETE /api/orders/:id` tại `src/server.js:151-154`.
  2. **Vá lỗi tính tổng tiền (Ưu tiên 2):** Sửa dòng 138 trong `src/server.js` thành `total: detail.subtotal - discount + fee`.
  3. **Vá lỗi lọc và sắp xếp sản phẩm (Ưu tiên 3):** Sửa `src/server.js:60` thành `p.stock > 0` và `src/server.js:66-67` tách rõ logic sort giảm dần `b.price - a.price`.
  4. **Chạy lại toàn bộ bộ kiểm thử hồi quy trên CI:** Đảm bảo tất cả các tầng Đơn vị, API, E2E đều đạt 100% màu XANH trước khi xem xét phát hành.

### 4.4. Ba việc nên làm tiếp theo về mặt kiểm thử nếu dự án tiếp tục
1. **Bổ sung kiểm thử tải và hiệu năng (Performance Testing):** Dùng k6 hoặc Artillery để kiểm tra khả năng chịu tải của các endpoint giỏ hàng và đặt hàng khi có nhiều sinh viên truy cập đồng thời.
2. **Nâng cao độ bao phủ kiểm thử bảo mật (Security Testing):** Viết thêm bộ ca kiểm thử tự động cho các lỗ hổng OWASP Top 10 phổ biến như SQL/NoSQL Injection, XSS và phân quyền theo vai trò (RBAC).
3. **Tối ưu hóa pipeline CI:** Thiết lập cơ chế cache cho trình duyệt Playwright và song song hóa (parallelization) các ca kiểm thử E2E để giảm thời gian chạy build từ 2.5 phút xuống dưới 1 phút.

## 5. Tự đánh giá

**5.1.** Ba điều đã làm tốt nhất trong cả đợt:
1. Áp dụng chuẩn chỉ mô hình Page Object Model (POM) ở Buổi 5 giúp mã kiểm thử E2E rõ ràng, dễ bảo trì và tách biệt hoàn toàn giữa UI locator và kịch bản test.
2. Thiết kế và triển khai thành công bộ kiểm thử API toàn diện, phát hiện được lỗ hổng phân quyền nghiêm trọng (IDOR) mà các tầng kiểm thử khác bỏ sót.
3. Xây dựng quy trình CI tự động trung thực trên GitHub Actions với `if: always()` và tách bạch hiện vật báo cáo HTML riêng theo từng tầng.

**5.2.** Ba điều sẽ làm khác nếu bắt đầu lại:
1. Sẽ đầu tư viết thêm nhiều ca kiểm thử đơn vị và giá trị biên ngay từ đầu để phát hiện lỗi sớm trước khi viết E2E.
2. Khi viết assertion kiểm thử, sẽ tránh tuyệt đối các khẳng định yếu (`toBeDefined()`, `toBeGreaterThanOrEqual(0)`) hoặc các giá trị trung hòa phép tính (`shippingFee = 0`) để không bị che khuất lỗi.
3. Lập bảng đường mốc đỏ (Red baseline) ngay từ phiên bản đầu tiên có lỗi để dễ dàng theo dõi lỗi hồi quy qua từng commit.

**5.3.** Một kỹ thuật muốn học sâu hơn, kèm lý do:
- **Kỹ thuật Kiểm thử Hợp đồng API (API Contract Testing / Pact):**
  - **Lý do:** Trong kiến trúc microservices và phát triển ứng dụng hiện đại, backend và frontend thường do các nhóm khác nhau phát triển độc lập. Kỹ thuật Contract Testing đảm bảo giao ước API giữa hai bên luôn đồng nhất mà không cần phải chờ dựng toàn bộ hệ thống lên mới kiểm thử được như E2E.

## 6. Danh mục chuyển giao

Giả định có người khác tiếp nhận công việc kiểm thử MiniShop. Ghi những gì người đó cần để bắt đầu làm việc trong vòng **một giờ**.

### 6.1. Cần đọc gì, theo thứ tự

| Thứ tự | File | Vì sao cần đọc |
|---|---|---|
| 1 | `docs/SRS-MiniShop-v1.2.md` | Hiểu rõ toàn bộ yêu cầu nghiệp vụ, cấu trúc dữ liệu, tài khoản mẫu và các quy tắc tính toán của MiniShop. |
| 2 | `bai-nop/Buoi06-TongKet.md` | Nắm được bức tranh tổng thể: hiện trạng lỗi, tỷ lệ đạt của các tầng và các vấn đề bảo mật/nghiệp vụ đang tồn đọng. |
| 3 | `bai-nop/Buoi06-BaoCaoAPI-CI.md` (mục 7) | Xem đường mốc đỏ đã biết để biết trước những ca kiểm thử nào đang fail do lỗi cài sẵn, tránh tốn thời gian debug lại lỗi cũ. |
| 4 | `.github/workflows/kiem-thu-day-du.yml` | Hiểu cấu trúc quy trình CI, các bước thực thi và cách thu thập báo cáo kiểm thử. |

### 6.2. Cần chạy lệnh nào

| Lệnh | Kết quả mong đợi |
|---|---|
| `npm run lint` | Hoàn thành phân tích tĩnh, có cảnh báo nhỏ nhưng exit code 0 (do continue-on-error). |
| `npm test` | Chạy 25 ca kiểm thử đơn vị Jest, kết quả 25 ca ĐẠT (xanh toàn bộ, ~1.5s). |
| `npm run api` | Chạy 21 ca kiểm thử Playwright API, kết quả 16 ca ĐẠT, 5 ca THẤT BẠI (do lỗi backend cài sẵn, ~10s). |
| `npm run e2e` | Chạy 21 ca kiểm thử Playwright E2E, kết quả 17 ca ĐẠT, 3 ca THẤT BẠI, 1 SKIP (do lỗi backend cài sẵn, ~45s). |

### 6.3. Cần biết trước điều gì về các ca đang đỏ
- Hệ thống hiện tại có **8 ca kiểm thử đỏ đã biết trước** (5 ca API và 3 ca E2E) do lỗi nằm trong `src/`:
  1. Hủy đơn hàng không kiểm tra chủ sở hữu (FR-05.5 - `src/server.js:150-159`).
  2. Tổng tiền thanh toán không cộng phí vận chuyển (FR-05.2 - `src/server.js:138`).
  3. Sắp xếp giá giảm dần bị lỗi thành tăng dần (FR-06.5 - `src/server.js:66-67`).
  4. Lọc sản phẩm còn hàng lấy cả hàng có tồn kho = 0 (FR-06.6 - `src/server.js:60`).
  5. Đăng ký tài khoản mật khẩu chữ hoa bị từ chối 400 (FR-01.4 - `src/services/registration.js:30`).
- Người tiếp nhận **tuyệt đối không tự ý sửa `src/` để làm xanh test** nếu chưa có chỉ đạo từ trưởng nhóm; các ca đỏ này là bằng chứng ghi nhận lỗi sản phẩm.

### 6.4. Xác nhận trạng thái repo khi bàn giao

- [x] `npm run lint` chạy được
- [x] `npm test` chạy được, số ca đơn vị: 25 , số ca đỏ: 0
- [x] `npm run api` chạy được, số ca: 21 , số ca đỏ: 5
- [x] `npm run e2e` chạy được, số ca: 21 , số ca đỏ: 3
- [x] Quy trình CI đã cấu hình đầy đủ và đã chạy ít nhất một lần
- [x] Mọi báo cáo từ Buổi 1 đến Buổi 6 đều có trong `bai-nop/`
