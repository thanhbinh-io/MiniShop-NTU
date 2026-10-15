/*
 * BUỔI 3 - PHẦN 3: Bổ sung ca kiểm thử để đạt bao phủ nhánh
 *
 * Mục tiêu: 100% bao phủ nhánh cho hai file
 *   - src/services/shipping.js
 *   - src/services/cart.js
 *
 * Xem phần chưa phủ:  npm run coverage   rồi mở coverage/lcov-report/index.html
 */
const { calcShippingFee } = require('../../src/services/shipping');
const cart = require('../../src/services/cart');

describe('calcShippingFee - các nhánh ngoại lệ', () => {
  // Ví dụ mẫu: một nhánh ném lỗi đã được viết sẵn.
  test('khu vực không hợp lệ thì ném lỗi', () => {
    expect(() => calcShippingFee({ subtotal: 100000, zone: 'tinh-khac', customerType: 'THUONG' }))
      .toThrow('Khu vực giao hàng không hợp lệ');
  });

  test('gọi hàm không truyền tham số thì ném lỗi khu vực không hợp lệ', () => {
    expect(() => calcShippingFee()).toThrow('Khu vực giao hàng không hợp lệ');
  });

  test('giá trị đơn hàng không phải là số thì ném lỗi', () => {
    expect(() => calcShippingFee({ subtotal: 'khong-phai-so', zone: 'noi-thanh', customerType: 'THUONG' }))
      .toThrow('Giá trị đơn hàng không hợp lệ');
  });

  test('giá trị đơn hàng âm thì ném lỗi', () => {
    expect(() => calcShippingFee({ subtotal: -10000, zone: 'noi-thanh', customerType: 'THUONG' }))
      .toThrow('Giá trị đơn hàng không hợp lệ');
  });
});

describe('cart - các nhánh của nghiệp vụ giỏ hàng', () => {
  const EMAIL = 'test-buoi03@ntu.edu.vn';

  beforeEach(() => {
    cart.clearCart(EMAIL); // mỗi ca kiểm thử bắt đầu với giỏ trống
  });

  // Ví dụ mẫu: một ca đã được viết sẵn để tập test này chạy được.
  test('thêm sản phẩm mới vào giỏ', () => {
    const kq = cart.addToCart(EMAIL, 1, 2);
    expect(kq.ok).toBe(true);
    expect(kq.cart.items).toHaveLength(1);
  });

  test('lấy giỏ hàng cho email chưa từng có giỏ hàng', () => {
    const emailMoi = 'chua-co-gio@ntu.edu.vn';
    const detail = cart.cartDetail(emailMoi);
    expect(detail.items).toHaveLength(0);
    expect(detail.subtotal).toBe(0);
  });

  test('thêm sản phẩm với số lượng không hợp lệ', () => {
    const kq = cart.addToCart(EMAIL, 1, -1);
    expect(kq.ok).toBe(false);
    expect(kq.status).toBe(400);
    expect(kq.message).toBe('Số lượng phải là số nguyên từ 1 đến 99');
  });

  test('cập nhật số lượng khi sản phẩm đã có sẵn trong giỏ', () => {
    cart.addToCart(EMAIL, 1, 2);
    const kq = cart.addToCart(EMAIL, 1, 5);
    expect(kq.ok).toBe(true);
    expect(kq.cart.items).toHaveLength(1);
    expect(kq.cart.items[0].qty).toBe(5);
  });

  test('xem chi tiết giỏ khi sản phẩm không tồn tại trong danh mục', () => {
    const kq = cart.addToCart(EMAIL, 9999, 1);
    expect(kq.ok).toBe(true);
    expect(kq.cart.items[0].name).toBe('(không xác định)');
    expect(kq.cart.items[0].price).toBe(0);
  });

  test('xóa sản phẩm không có trong giỏ', () => {
    const kq = cart.removeFromCart(EMAIL, 999);
    expect(kq.ok).toBe(false);
    expect(kq.status).toBe(404);
    expect(kq.message).toBe('Sản phẩm không có trong giỏ');
  });

  test('xóa sản phẩm có sẵn trong giỏ thành công', () => {
    cart.addToCart(EMAIL, 1, 2);
    const kq = cart.removeFromCart(EMAIL, 1);
    expect(kq.ok).toBe(true);
    expect(kq.status).toBe(200);
    expect(kq.cart.items).toHaveLength(0);
  });
});
