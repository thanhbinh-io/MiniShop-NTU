/*
 * BUỔI 5 — PHẦN 4: Tự động hóa kiểm thử hồi quy cho FR-06
 *
 * Ở Buổi 4, màn hình lọc sản phẩm được kiểm thử THỦ CÔNG, mỗi tổ hợp mất vài phút.
 * Phần này biến chúng thành bộ kiểm thử chạy lại được trong vài giây — đó chính là
 * lý do tồn tại của kiểm thử tự động.
 *
 * Dùng ProductPage đã hoàn thiện ở Phần 3.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');
const { ProductPage } = require('../pages/ProductPage');

let trangSanPham;

test.beforeEach(async ({ page, request }) => {
  await datLaiDuLieu(request);
  trangSanPham = new ProductPage(page);
  await trangSanPham.moTrang();
});

// ---------------------------------------------------------------
// CA MẪU ĐÃ VIẾT SẴN
// ---------------------------------------------------------------
test('FR-06.3 — lọc theo danh mục Đồ dùng học tập', async () => {
  await trangSanPham.loc({ danhMuc: 'do-dung-hoc-tap' });
  const ten = await trangSanPham.danhSachTen();

  expect(ten).toHaveLength(3);
  expect(ten).toEqual(expect.arrayContaining(['Sổ tay sinh viên', 'Bút ký NTU', 'Balo laptop']));
});

// ---------------------------------------------------------------
// Bộ ca kiểm thử cho FR-06 phủ các yêu cầu của SRS v1.2:
//   FR-06.2  lọc theo từ khóa (khớp một phần, không phân biệt hoa thường)
//   FR-06.4  lọc theo khoảng giá, chú ý BIÊN của khoảng 100.000đ–300.000đ
//   FR-06.5  sắp xếp giá tăng dần VÀ sắp xếp giá giảm dần (hai ca riêng)
//   FR-06.6  chỉ hiện sản phẩm còn hàng
//   FR-06.7  tổ hợp nhiều tiêu chí, và trường hợp không có kết quả
// ---------------------------------------------------------------
test('FR-06.2 — lọc theo từ khóa không phân biệt hoa thường', async () => {
  await trangSanPham.loc({ tuKhoa: 'áo' });
  const ten = await trangSanPham.danhSachTen();

  expect(ten).toHaveLength(2);
  expect(ten).toEqual(expect.arrayContaining(['Áo thun NTU', 'Áo khoác gió NTU']));
});

test('FR-06.4 — lọc theo khoảng giá 100k-300k bao gồm hai đầu mút', async () => {
  await trangSanPham.loc({ khoangGia: '100k-300k' });
  const ten = await trangSanPham.danhSachTen();

  expect(ten).toHaveLength(3);
  expect(ten).toEqual(expect.arrayContaining(['Áo thun NTU', 'Bình nước giữ nhiệt', 'Nón bảo hiểm NTU']));
});

test('FR-06.5 — sắp xếp theo giá tăng dần', async () => {
  await trangSanPham.loc({ sapXep: 'gia-tang' });
  const gia = await trangSanPham.danhSachGia();

  expect(gia.length).toBeGreaterThan(0);
  expect(gia).toEqual([...gia].sort((a, b) => a - b));
});

test('FR-06.5 — sắp xếp theo giá giảm dần', async () => {
  await trangSanPham.loc({ sapXep: 'gia-giam' });
  const gia = await trangSanPham.danhSachGia();

  expect(gia.length).toBeGreaterThan(0);
  expect(gia).toEqual([...gia].sort((a, b) => b - a));
});

test('FR-06.6 — chỉ hiện sản phẩm còn hàng', async () => {
  await trangSanPham.loc({ conHang: true });
  const tonKho = await trangSanPham.danhSachTonKho();

  expect(tonKho).not.toContain('Hết hàng');
  expect(tonKho).not.toContain('0');
  expect(tonKho).toHaveLength(5);
});

test('FR-06.7 — áp dụng đồng thời từ khóa, danh mục, khoảng giá và tồn kho', async () => {
  await trangSanPham.loc({
    tuKhoa: 'bút',
    danhMuc: 'do-dung-hoc-tap',
    khoangGia: 'duoi-100k',
    conHang: true,
  });

  expect(await trangSanPham.danhSachTen()).toEqual(['Bút ký NTU']);
});

test('FR-06.7 — tổ hợp tiêu chí không có kết quả hiển thị thông báo phù hợp', async () => {
  await trangSanPham.loc({ tuKhoa: 'balo', danhMuc: 'qua-luu-niem' });
  const ten = await trangSanPham.danhSachTen();

  expect(ten).toEqual([]);
  await expect(trangSanPham.thongBaoRong).toBeVisible();
  await expect(trangSanPham.thongBaoRong).toHaveText('Không tìm thấy sản phẩm phù hợp.');
});
