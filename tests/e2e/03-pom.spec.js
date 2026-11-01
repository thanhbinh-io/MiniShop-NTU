/*
 * BUỔI 5 — PHẦN 3: Viết lại ca kiểm thử theo Page Object Model
 *
 * So sánh file này với 01-luong-chinh.spec.js: cùng kịch bản, nhưng mọi locator
 * đã chuyển vào tests/pages/. Ca kiểm thử chỉ còn mô tả NGHIỆP VỤ.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');
const { LoginPage } = require('../pages/LoginPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

// ---------------------------------------------------------------
// CA MẪU ĐÃ VIẾT SẴN — dùng LoginPage đã hoàn thiện.
// Đọc để thấy ca kiểm thử ngắn và dễ đọc hơn hẳn khi dùng Page Object.
// ---------------------------------------------------------------
test('FR-02.2 — đăng nhập sai mật khẩu bị từ chối', async ({ page }) => {
  const trangDangNhap = new LoginPage(page);
  await trangDangNhap.moTrang();
  await trangDangNhap.dangNhap('sv@ntu.edu.vn', 'MatKhauSai');

  await expect(trangDangNhap.thongBao).toHaveText('Sai email hoặc mật khẩu');
});

// ---------------------------------------------------------------
// Viết lại ca FR-04.3 của Phần 1 bằng Page Object.
// Đăng nhập VIP → thêm sản phẩm vào giỏ → tính phí ngoại thành → khẳng định 0đ
// ---------------------------------------------------------------
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

// ---------------------------------------------------------------
// Viết lại ca FR-02.3 của Phần 1 (khóa tài khoản) bằng Page Object.
// Dùng phương thức dangNhapSaiNhieuLan() có sẵn trong LoginPage.
// ---------------------------------------------------------------
test('FR-02.3 viết lại theo POM — khóa tài khoản sau 3 lần sai', async ({ page }) => {
  const trangDangNhap = new LoginPage(page);
  await trangDangNhap.moTrang();
  await trangDangNhap.dangNhapSaiNhieuLan('sv@ntu.edu.vn', 3);

  await expect(trangDangNhap.thongBao).toHaveText(/Tài khoản đã bị khóa/);
});
