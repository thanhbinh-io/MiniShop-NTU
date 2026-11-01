/*
 * BUỔI 5 — PHẦN 2: Nhận diện và sửa ca kiểm thử flaky
 *
 * "Flaky" là ca kiểm thử cho kết quả KHÁC NHAU giữa các lần chạy dù mã nguồn
 * và dữ liệu không đổi. Nó tệ hơn ca luôn đỏ: cả nhóm mất niềm tin vào bộ kiểm thử
 * và bắt đầu bỏ qua mọi ca đỏ.
 *
 * Chạy nhiều lần để quan sát:  npx playwright test tests/e2e/02-flaky --repeat-each=5
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

// ---------------------------------------------------------------
// CA FLAKY SỐ 1 — ĐÃ SỬA BẰNG WEB-FIRST ASSERTION
//
// Thay vì waitForTimeout(600) (đoán thời gian chờ), dùng toHaveCount
// để Playwright tự chờ danh sách sản phẩm hiển thị đủ 8 dòng (1 tiêu đề + 7 sản phẩm).
// ---------------------------------------------------------------
test('danh sách sản phẩm hiển thị đủ 7 mặt hàng', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('product-list').locator('tr')).toHaveCount(8);
});

// ---------------------------------------------------------------
// CA FLAKY SỐ 2 — ĐÃ SỬA BẰNG WEB-FIRST ASSERTION
//
// Thay vì đọc textContent() ngay sau khi bấm nút (khi máy chủ chưa kịp phản hồi),
// dùng await expect(locator).toContainText(...) để Playwright tự chờ thông báo xuất hiện.
// ---------------------------------------------------------------
test('tính phí vận chuyển cho thành viên thường', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('login-email').fill('sv@ntu.edu.vn');
  await page.getByTestId('login-password').fill('Matkhau123');
  await page.getByTestId('btn-login').click();

  await expect(page.getByTestId('product-list').locator('table')).toBeVisible();
  await page.getByTestId('qty-4').fill('1');
  await page.getByTestId('add-4').click();

  await page.getByTestId('zone').selectOption('noi-thanh');
  await page.getByTestId('btn-fee').click();

  await expect(page.getByTestId('fee-msg')).toContainText('Phí vận chuyển');
});
