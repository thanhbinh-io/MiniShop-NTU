/*
 * Page Object cho màn hình Sản phẩm và bộ lọc (FR-06).
 */
class ProductPage {
  constructor(page) {
    this.page = page;
    this.danhSach = page.getByTestId('product-list');
    this.nutLoc = page.getByTestId('btn-loc');
    this.nutXoaBoLoc = page.getByTestId('btn-xoabo-loc');
    this.thongBaoRong = page.getByTestId('khong-co-ket-qua');

    this.oTuKhoa = page.getByTestId('f-tukhoa');
    this.oDanhMuc = page.getByTestId('f-danhmuc');
    this.oKhoangGia = page.getByTestId('f-khoanggia');
    this.oSapXep = page.getByTestId('f-sapxep');
    this.oConHang = page.getByTestId('f-conhang');
  }

  async moTrang() {
    await this.page.goto('/');
    await this.chokKetQua();
  }

  /**
   * Chờ danh sách tải xong. Danh sách sản phẩm có độ trễ ngẫu nhiên, nên
   * mọi thao tác với nó đều phải chờ qua phương thức này.
   * ĐÃ VIẾT SẴN — dùng làm mẫu cho cách chờ đúng, không dùng waitForTimeout.
   */
  async chokKetQua() {
    await this.danhSach.locator('table, [data-testid="khong-co-ket-qua"]').first()
      .waitFor({ state: 'visible' });
  }

  /**
   * Áp dụng bộ lọc. Tham số là một đối tượng, chỉ truyền tiêu chí cần dùng:
   *   await trangSP.loc({ danhMuc: 'qua-luu-niem', sapXep: 'gia-giam' });
   */
  async loc({ tuKhoa, danhMuc, khoangGia, sapXep, conHang } = {}) {
    if (tuKhoa !== undefined) {
      await this.oTuKhoa.fill(tuKhoa);
    }
    if (danhMuc !== undefined) {
      await this.oDanhMuc.selectOption(danhMuc);
    }
    if (khoangGia !== undefined) {
      await this.oKhoangGia.selectOption(khoangGia);
    }
    if (sapXep !== undefined) {
      await this.oSapXep.selectOption(sapXep);
    }
    if (conHang !== undefined) {
      if (conHang) {
        await this.oConHang.check();
      } else {
        await this.oConHang.uncheck();
      }
    }
    await this.nutLoc.click();
    await this.chokKetQua();
  }

  /** Trả về mảng tên sản phẩm đang hiển thị, theo đúng thực tế trên màn hình. */
  async danhSachTen() {
    await this.chokKetQua();
    if (await this.thongBaoRong.isVisible()) {
      return [];
    }
    return (await this.danhSach.locator('table tr:has(td) td:nth-child(1)').allTextContents())
      .map((ten) => ten.trim());
  }

  /**
   * Trả về mảng giá dạng SỐ, theo đúng thực tế trên màn hình.
   * Trên giao diện giá hiển thị dạng "150.000đ" nên phải bỏ dấu chấm và chữ đ.
   */
  async danhSachGia() {
    await this.chokKetQua();
    if (await this.thongBaoRong.isVisible()) {
      return [];
    }
    const gia = await this.danhSach.locator('table tr:has(td) td:nth-child(3)').allTextContents();
    return gia.map((mucGia) => Number(mucGia.replace(/[^\d]/g, '')));
  }

  /** Trả về mảng nội dung cột Tồn kho, theo đúng thực tế trên màn hình. */
  async danhSachTonKho() {
    await this.chokKetQua();
    if (await this.thongBaoRong.isVisible()) {
      return [];
    }
    return (await this.danhSach.locator('table tr:has(td) td:nth-child(4)').allTextContents())
      .map((tonKho) => tonKho.trim());
  }

  /** Thêm một sản phẩm vào giỏ theo mã sản phẩm. ĐÃ VIẾT SẴN. */
  async themVaoGio(maSanPham, soLuong) {
    await this.chokKetQua();
    const phanHoi = this.page.waitForResponse(
      (response) => response.url().endsWith('/api/cart') && response.request().method() === 'POST'
    );
    await this.page.getByTestId(`qty-${maSanPham}`).fill(String(soLuong));
    await this.page.getByTestId(`add-${maSanPham}`).click();
    await phanHoi;
  }

  async xoaBoLoc() {
    await this.nutXoaBoLoc.click();
    await this.chokKetQua();
  }

  
}


module.exports = { ProductPage };
