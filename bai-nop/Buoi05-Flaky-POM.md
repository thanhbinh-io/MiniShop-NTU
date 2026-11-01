# BUỔI 5 – CA KIỂM THỬ FLAKY VÀ PAGE OBJECT MODEL

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Ca kiểm thử flaky

### 1.1. Quan sát trước khi sửa

Chạy `npx playwright test tests/e2e/02-flaky --repeat-each=5` **trước khi sửa** và ghi lại.

| Ca kiểm thử | Số lần đạt / tổng số lần chạy | Thông báo lỗi khi thất bại |
|---|---|---|
| danh sách sản phẩm hiển thị đủ 7 mặt hàng | 2/5 | Error: expect(received).toBe(expected) // Expected: 8, Received: 0 |
| tính phí vận chuyển cho thành viên thường | 1/5 | Error: expect(received).toContain(expected) // Expected substring: "Phí vận chuyển", Received string: "" |

### 1.2. Nguyên nhân

| Ca kiểm thử | Dòng lệnh gây flaky | Vì sao nó không ổn định |
|---|---|---|
| danh sách sản phẩm hiển thị đủ 7 mặt hàng | `await page.waitForTimeout(600);` | Đoán thời gian chờ cố định 600ms không thể đảm bảo mạng đã phản hồi, vì API GET /api/products trả về với độ trễ ngẫu nhiên 100–1500ms. Khi thời gian phản hồi thực tế vượt quá 600ms, DOM chưa tải xong bảng sản phẩm nên đếm được 0 dòng thay vì 8 dòng. |
| tính phí vận chuyển cho thành viên thường | `const thongBao = await page.getByTestId('fee-msg').textContent();` | Đọc nội dung thông báo ngay lập tức sau khi click nút Tính phí vận chuyển, trong khi yêu cầu gửi lên server là bất đồng bộ. Khi máy chủ chưa kịp phản hồi thì textContent() nhận chuỗi rỗng `""`. |

### 1.3. Cách sửa

| Ca kiểm thử | Đã thay bằng gì | Vì sao cách mới ổn định |
|---|---|---|
| danh sách sản phẩm hiển thị đủ 7 mặt hàng | `await expect(page.getByTestId('product-list').locator('tr')).toHaveCount(8);` | Sử dụng web-first assertion của Playwright. Lệnh tự động chờ và thử lại liên tục (auto-waiting & retry) cho đến khi đủ 8 dòng (1 dòng tiêu đề + 7 sản phẩm) xuất hiện trong DOM hoặc hết timeout. |
| tính phí vận chuyển cho thành viên thường | `await expect(page.getByTestId('fee-msg')).toContainText('Phí vận chuyển');` | Sử dụng web-first assertion tự động chờ cho đến khi thông báo từ máy chủ được cập nhật và hiển thị trên màn hình mới thực hiện kiểm tra. |

### 1.4. Xác nhận sau khi sửa

Chạy lại `npx playwright test tests/e2e/02-flaky --repeat-each=5`:

| Ca kiểm thử | Số lần đạt / tổng số lần chạy |
|---|---|
| danh sách sản phẩm hiển thị đủ 7 mặt hàng | 5/5 |
| tính phí vận chuyển cho thành viên thường | 5/5 |

### 1.5. Câu hỏi phân tích

**1.5.1.** Playwright có tùy chọn `retries` để chạy lại ca thất bại. Vì sao cấu hình của học phần đặt `retries: 0`? Trong dự án thật, đặt `retries: 2` có phải cách tốt để xử lý ca flaky không?
- Cấu hình học phần đặt `retries: 0` có chủ đích để sinh viên nhìn thấy trực tiếp các ca kiểm thử flaky bị fail, từ đó tìm hiểu nguyên nhân gốc rễ và sửa bằng web-first assertion thay vì che giấu lỗi bằng cách chạy lại.
- Trong dự án thật, đặt `retries: 2` chỉ là giải pháp tình thế nhằm tránh làm nghẽn pipeline CI/CD tạm thời. Đó KHÔNG phải là cách tốt để xử lý ca flaky, vì nó làm tăng thời gian chạy test, che lấp các lỗi chập chờn thực tế của hệ thống và làm cả nhóm mất niềm tin vào bộ kiểm thử.

**1.5.2.** Một ca flaky gây thiệt hại gì cho nhóm phát triển? Vì sao ca flaky nguy hiểm hơn ca luôn thất bại?
- Thiệt hại: Làm lãng phí thời gian của nhóm phát triển và tester khi phải điều tra các lỗi giả (false positive), gây tắc nghẽn CI/CD, làm chậm tiến độ phát hành sản phẩm.
- Ca flaky nguy hiểm hơn ca luôn thất bại vì: Ca luôn thất bại (luôn đỏ) báo hiệu rõ ràng có bug hoặc test case sai nên sẽ được xử lý ngay. Còn ca flaky khiến nhóm phát triển quen dần với việc "chạy lại là xanh" và hình thành thói quen bỏ qua mọi ca đỏ, từ đó có thể vô tình bỏ lọt các lỗi nghiêm trọng vào môi trường thực tế (production).

**1.5.3.** Ngoài độ trễ mạng, nêu **hai** nguyên nhân khác thường gây ra ca kiểm thử flaky.
1. Ô nhiễm dữ liệu / phụ thuộc thứ tự chạy (Shared state / Test pollution): Dữ liệu giữa các ca kiểm thử không được làm sạch (ví dụ ca trước đăng ký email hoặc thay đổi trạng thái giỏ hàng mà không reset), dẫn đến ca sau chạy thất bại ngẫu nhiên tùy thứ tự thực thi.
2. Xung đột luồng giao diện / Hiệu ứng chuyển động (UI animation & race condition): Các phần tử giao diện đang trong quá trình chuyển động (animation), bị disable tạm thời hoặc bị phần tử khác che khuất trong chốc lát khiến thao tác click bị trượt.

## 2. Page Object Model

### 2.1. Các lớp đã xây dựng

| Lớp | Số locator | Số phương thức | Màn hình tương ứng |
|---|---|---|---|
| LoginPage | 5 | 3 | Màn hình Đăng nhập (kèm thanh người dùng) |
| ProductPage | 9 | 8 | Màn hình Sản phẩm và bộ lọc |
| CartPage | 6 | 3 | Màn hình Giỏ hàng và đặt hàng |

### 2.2. So sánh trước và sau

Chọn **một** ca kiểm thử đã viết ở cả hai dạng (Phần 1 và Phần 3).

| Chỉ số | Bản ở Phần 1 (không POM) | Bản ở Phần 3 (có POM) |
|---|---|---|
| Số dòng trong thân ca kiểm thử | 18 | 8 |
| Số locator xuất hiện trong file spec | 7 | 0 |

Dán hai đoạn mã cạnh nhau:

```javascript
// Phần 1 — không dùng Page Object
test('FR-04.3 — VIP miễn phí vận chuyển ở ngoại thành', async ({ page }) => {
  await page.getByTestId('login-email').fill(TK_VIP.email);
  await page.getByTestId('login-password').fill(TK_VIP.matKhau);
  await page.getByTestId('btn-login').click();
  await expect(page.getByTestId('user-bar')).toContainText('Thành viên VIP');

  await expect(page.getByTestId('product-list').locator('table')).toBeVisible();

  await page.getByTestId('qty-1').fill('1');
  await page.getByTestId('add-1').click();
  await expect(page.getByTestId('subtotal')).toBeVisible();

  await page.getByTestId('zone').selectOption('ngoai-thanh');
  await page.getByTestId('btn-fee').click();

  await expect(page.getByTestId('fee-msg')).toContainText('Phí vận chuyển: 0đ');
});
```

```javascript
// Phần 3 — dùng Page Object
test('FR-04.3 viết lại theo POM — VIP miễn phí vận chuyển ngoại thành', async ({ page }) => {
  const trangDangNhap = new LoginPage(page);
  const trangSanPham = new ProductPage(page);
  const trangGio = new CartPage(page);

  await trangDangNhap.moTrang();
  await trangDangNhap.dangNhap('vip@ntu.edu.vn', 'Matkhau123');
  await trangSanPham.themVaoGio(1, 1);
  await trangGio.tinhPhi('ngoai-thanh');

  await expect(trangGio.thongBao).toContainText('Phí vận chuyển: 0đ');
});
```

### 2.3. Kịch bản thay đổi giao diện

Giả sử lập trình viên đổi `data-testid="btn-login"` thành `data-testid="nut-dang-nhap"`.

| Câu hỏi | Trả lời |
|---|---|
| Nếu **không** dùng POM, phải sửa bao nhiêu chỗ trong bài của mình? | 4 chỗ (tại tất cả các ca kiểm thử trong 01-luong-chinh.spec.js và 02-flaky.spec.js có gọi trực tiếp btn-login) |
| Nếu **có** dùng POM, phải sửa bao nhiêu chỗ? | 1 chỗ duy nhất (trong constructor của LoginPage.js: this.nutDangNhap = page.getByTestId('nut-dang-nhap')) |

### 2.4. Câu hỏi phân tích

**2.4.1.** Vì sao Page Object **không được** chứa `expect()`? Điều gì xảy ra nếu đặt khẳng định vào trong Page Object?
- Page Object đóng vai trò là một tầng trừu tượng đại diện cho cấu trúc giao diện và các hành vi (thao tác) của người dùng, không đại diện cho mục tiêu kiểm tra. Khẳng định `expect()` thuộc về ca kiểm thử vì mỗi ca kiểm thử có kỳ vọng khác nhau trên cùng một thao tác (ví dụ: cùng bấm Đăng nhập nhưng ca kiểm tra thành công kỳ vọng chào mừng, ca kiểm tra thất bại kỳ vọng báo lỗi). Nếu đặt `expect()` trong Page Object sẽ làm mất tính tái sử dụng, gây phụ thuộc cứng nhắc và vi phạm nguyên lý Single Responsibility.

**2.4.2.** Phương thức `dangNhapSaiNhieuLan()` trong `LoginPage` có chờ thông báo hiện ra sau mỗi lần bấm. Nếu bỏ phần chờ đó thì ca kiểm thử khóa tài khoản sẽ ra sao?
- Nếu bỏ phần chờ, các thao tác điền mật khẩu và bấm Đăng nhập sẽ thực hiện liên tục ngay lập tức trong khi máy chủ chưa kịp phản hồi các request trước. Do đó, request thứ 3 có thể được gửi đi trước khi bộ đếm sai trên server kịp ghi nhận lần 1 và lần 2, khiến tài khoản chưa bị khóa và ca kiểm thử sẽ bị thất bại ngẫu nhiên (flaky).

**2.4.3.** Bài này dùng `datLaiDuLieu()` để đặt lại dữ liệu trước mỗi ca. Liên hệ với kỹ thuật **mock** đã học ở Buổi 3: hai cách này giống và khác nhau ở điểm nào?
- Giống nhau: Cả hai đều nhằm mục đích cô lập môi trường kiểm thử, đảm bảo mỗi ca kiểm thử bắt đầu từ trạng thái dữ liệu độc lập, sạch sẽ và không phụ thuộc vào thứ tự chạy của các ca khác.
- Khác nhau: Kỹ thuật `mock` (Buổi 3) can thiệp ở tầng mã nguồn ứng dụng (Unit test), thay thế các hàm/module phụ thuộc (như DB hoặc API) bằng các đối tượng giả lập trong bộ nhớ, không thực sự lưu trữ hay gọi network. Trong khi đó, hàm `datLaiDuLieu()` (Buổi 5) thực hiện một yêu cầu mạng thật (`POST /api/test/reset`) đến máy chủ đang chạy để reset lại toàn bộ dữ liệu thật trong bộ nhớ về trạng thái ban đầu, áp dụng cho kiểm thử tích hợp/hệ thống E2E trên trình duyệt thật.
