/*
 * BUỔI 5 — PHẦN 1: Tự động hóa ca kiểm thử ưu tiên Cao
 *
 * Chuyển ba ca đã thiết kế ở Buổi 2 thành ca kiểm thử E2E chạy trên trình duyệt thật.
 *
 * Chạy riêng file này:  npx playwright test tests/e2e/01-luong-chinh
 * Xem trình duyệt chạy: npx playwright test tests/e2e/01-luong-chinh --headed
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

const TK_THUONG = { email: 'sv@ntu.edu.vn', matKhau: 'Matkhau123' };
const TK_VIP = { email: 'vip@ntu.edu.vn', matKhau: 'Matkhau123' };

// Mỗi ca kiểm thử bắt đầu từ dữ liệu sạch: giỏ hàng trống, không tài khoản nào bị khóa.
test.beforeEach(async ({ page, request }) => {
  await datLaiDuLieu(request);
  await page.goto('/');
});

// ---------------------------------------------------------------
// CA MẪU ĐÃ VIẾT SẴN — đọc kỹ trước khi làm các TODO bên dưới.
// Tương ứng ca BVA của Buổi 2: đăng ký với tuổi dưới giới hạn.
// ---------------------------------------------------------------
test('FR-01.3 — đăng ký với tuổi 17 bị từ chối', async ({ page }) => {
  await page.getByTestId('reg-name').fill('Nguyen Van A');
  await page.getByTestId('reg-email').fill(`e2e-${Date.now()}@ntu.edu.vn`);
  await page.getByTestId('reg-age').fill('17');
  await page.getByTestId('reg-password').fill('Matkhau123');
  await page.getByTestId('btn-register').click();

  await expect(page.getByTestId('reg-msg')).toHaveText(/Tuổi không nằm trong phạm vi/);
});

// ---------------------------------------------------------------
// FR-02.3 — khóa tài khoản sau 3 lần đăng nhập sai liên tiếp
//
// Các bước:
//   1. Đăng nhập sai mật khẩu 3 lần liên tiếp với tài khoản sv@ntu.edu.vn
//   2. Khẳng định thông báo lần thứ ba nói rõ tài khoản bị khóa
//
// Lưu ý: mỗi lần bấm Đăng nhập là một yêu cầu mạng. Phải CHỜ thông báo của
// lần trước hiện ra rồi mới bấm lần kế tiếp, nếu không các lần bấm chồng lên nhau.
// ---------------------------------------------------------------
test('FR-02.3 — khóa tài khoản sau 3 lần sai', async ({ page }) => {
  await page.getByTestId('login-email').fill(TK_THUONG.email);

  for (let i = 1; i <= 3; i++) {
    await page.getByTestId('login-password').fill(`MatKhauSai${i}`);
    const responsePromise = page.waitForResponse((res) => res.url().includes('/api/login'));
    await page.getByTestId('btn-login').click();
    await responsePromise;
  }

  await expect(page.getByTestId('login-msg')).toHaveText(/Tài khoản đã bị khóa/);
});

// ---------------------------------------------------------------
// FR-04.3 — thành viên VIP được miễn phí vận chuyển ở MỌI khu vực
//
// Các bước:
//   1. Đăng nhập bằng tài khoản VIP
//   2. Thêm một sản phẩm bất kỳ vào giỏ
//   3. Chọn khu vực "Ngoại thành" rồi bấm Tính phí vận chuyển
//   4. Khẳng định thông báo hiển thị phí vận chuyển 0đ
//
// Lưu ý: danh sách sản phẩm tải về có độ trễ ngẫu nhiên. Phải chờ bảng sản phẩm
// hiện ra trước khi thao tác với ô số lượng.
// ---------------------------------------------------------------
test('FR-04.3 — VIP miễn phí vận chuyển ở ngoại thành', async ({ page }) => {
  // 1. Đăng nhập bằng tài khoản VIP
  await page.getByTestId('login-email').fill(TK_VIP.email);
  await page.getByTestId('login-password').fill(TK_VIP.matKhau);
  await page.getByTestId('btn-login').click();
  await expect(page.getByTestId('user-bar')).toContainText('Thành viên VIP');

  // 2. Chờ bảng sản phẩm hiện ra trước khi thao tác với ô số lượng
  await expect(page.getByTestId('product-list').locator('table')).toBeVisible();

  // Thêm một sản phẩm vào giỏ (Áo thun NTU - id: 1)
  await page.getByTestId('qty-1').fill('1');
  await page.getByTestId('add-1').click();
  await expect(page.getByTestId('subtotal')).toBeVisible();

  // 3. Chọn khu vực "Ngoại thành" rồi bấm Tính phí vận chuyển
  await page.getByTestId('zone').selectOption('ngoai-thanh');
  await page.getByTestId('btn-fee').click();

  // 4. Khẳng định thông báo hiển thị phí vận chuyển 0đ
  await expect(page.getByTestId('fee-msg')).toContainText('Phí vận chuyển: 0đ');
});

// ---------------------------------------------------------------
// Ca bảng quyết định tự chọn trong bộ ca Buổi 2:
// TC-65130239-22 — FR-04.1: thành viên thường ngoại thành mua dưới 500k
//
// Để kiểm tra TỔNG TIỀN cuối cùng, bấm nút Đặt hàng chứ không dừng ở nút Tính phí.
// ---------------------------------------------------------------
test('TC-65130239-22 — FR-04.1: thành viên thường ngoại thành tính đúng tổng tiền kèm phí vận chuyển', async ({ page }) => {
  // 1. Đăng nhập bằng tài khoản thường
  await page.getByTestId('login-email').fill(TK_THUONG.email);
  await page.getByTestId('login-password').fill(TK_THUONG.matKhau);
  await page.getByTestId('btn-login').click();
  await expect(page.getByTestId('user-bar')).toContainText('Nguyễn Văn Sinh Viên');

  // 2. Chờ danh sách sản phẩm hiển thị
  await expect(page.getByTestId('product-list').locator('table')).toBeVisible();

  // 3. Thêm 2 Áo thun (id: 1, giá 150.000đ) để tạm tính là 300.000đ (< 500.000đ)
  await page.getByTestId('qty-1').fill('2');
  await page.getByTestId('add-1').click();
  await expect(page.getByTestId('subtotal')).toContainText('300.000đ');

  // 4. Chọn khu vực Ngoại thành (quy định phí là 35.000đ)
  await page.getByTestId('zone').selectOption('ngoai-thanh');

  // 5. Bấm Đặt hàng để kiểm tra tổng tiền cuối cùng
  await page.getByTestId('btn-order').click();

  // Tổng tiền mong đợi = 300.000đ (tạm tính) + 35.000đ (phí ship) = 335.000đ
  await expect(page.getByTestId('fee-msg')).toContainText('335.000đ');
});
