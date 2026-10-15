/*
 * BUỔI 3 - PHẦN 1: Kiểm thử hướng dữ liệu
 *
 * Nạp trực tiếp bộ ca đã thiết kế ở Buổi 2 (bai-nop/Buoi02-DuLieuKiemThu.csv)
 * và chạy chúng trên các hàm nghiệp vụ của MiniShop.
 *
 * Chạy riêng file này:  npx jest tests/unit/du-lieu-csv
 */
const { docDuLieuKiemThu } = require('../helpers/doc-csv');
const { validateRegistration } = require('../../src/services/registration');
const { validateQuantity } = require('../../src/services/cart');
const { calcShippingFee } = require('../../src/services/shipping');

describe('validateRegistration - dữ liệu từ Buoi02-DuLieuKiemThu.csv', () => {
  const duLieu = docDuLieuKiemThu('validateRegistration');

  test.each(duLieu)('$maCa: $ketQuaKyVong', ({ thamSo, ketQuaKyVong }) => {
    // Hàm trả về MẢNG thông báo lỗi: mảng rỗng nghĩa là dữ liệu hợp lệ.
    const loi = validateRegistration(thamSo);
    const thucTe = loi.length === 0 ? 'HOP_LE' : 'KHONG_HOP_LE';
    expect(thucTe).toBe(ketQuaKyVong);
  });
});

describe('validateQuantity - dữ liệu từ Buoi02-DuLieuKiemThu.csv', () => {
  const duLieu = docDuLieuKiemThu('validateQuantity');

  test.each(duLieu)('$maCa: $ketQuaKyVong', ({ thamSo, ketQuaKyVong }) => {
    const hopLe = validateQuantity(thamSo.qty ?? thamSo.quantity);
    const thucTe = hopLe ? 'HOP_LE' : 'KHONG_HOP_LE';
    expect(thucTe).toBe(ketQuaKyVong);
  });
});

describe('calcShippingFee - dữ liệu từ Buoi02-DuLieuKiemThu.csv', () => {
  const duLieu = docDuLieuKiemThu('calcShippingFee');

  test.each(duLieu)('$maCa: $ketQuaKyVong', ({ thamSo, ketQuaKyVong }) => {
    const thucTe = calcShippingFee(thamSo);
    expect(thucTe).toBe(Number(ketQuaKyVong));
  });
});

