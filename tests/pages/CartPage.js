/*
 * Page Object cho khu vực Giỏ hàng và đặt hàng.
 */
class CartPage {
  constructor(page) {
    this.page = page;
    this.gio = page.getByTestId('cart');
    this.tamTinh = page.getByTestId('subtotal');
    this.khuVuc = page.getByTestId('zone');
    this.nutTinhPhi = page.getByTestId('btn-fee');
    this.nutDatHang = page.getByTestId('btn-order');
    this.thongBaoPhi = page.getByTestId('fee-msg');
    this.thongBao = this.thongBaoPhi;
  }

  /** Chọn khu vực rồi bấm Tính phí vận chuyển, chờ thông báo hiện ra. */
  async tinhPhi(khuVuc) {
    const phanHoi = this.page.waitForResponse(
      (response) => response.url().endsWith('/api/shipping-fee') && response.request().method() === 'POST'
    );
    if (khuVuc) {
      await this.khuVuc.selectOption(khuVuc);
    }
    await this.nutTinhPhi.click();
    await phanHoi;
    await this.thongBaoPhi.filter({ hasText: /\S/ }).waitFor({ state: 'visible' });
  }

  /** Chọn khu vực rồi bấm Đặt hàng, chờ thông báo hiện ra. */
  async datHang(khuVuc) {
    const phanHoi = this.page.waitForResponse(
      (response) => response.url().endsWith('/api/orders') && response.request().method() === 'POST'
    );
    if (khuVuc) {
      await this.khuVuc.selectOption(khuVuc);
    }
    await this.nutDatHang.click();
    await phanHoi;
    await this.thongBaoPhi.filter({ hasText: /\S/ }).waitFor({ state: 'visible' });
  }

  /** Xóa một sản phẩm khỏi giỏ theo mã sản phẩm. ĐÃ VIẾT SẴN. */
  async xoaSanPham(maSanPham) {
    const phanHoi = this.page.waitForResponse(
      (response) => response.url().endsWith(`/api/cart/${maSanPham}`) &&
        response.request().method() === 'DELETE'
    );
    await this.page.getByTestId(`remove-${maSanPham}`).click();
    await phanHoi;
    await this.page.getByTestId(`remove-${maSanPham}`).waitFor({ state: 'detached' });
  }
}

module.exports = { CartPage };
