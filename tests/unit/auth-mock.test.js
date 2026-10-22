/*
 * BUỔI 3 - PHẦN 4: Kiểm thử với mock
 *
 * Nghiệp vụ khóa tài khoản (FR-02.2 đến FR-02.4) đọc dữ liệu người dùng từ
 * src/data/store.js. Nếu dùng dữ liệu thật, các ca kiểm thử sẽ ảnh hưởng lẫn nhau:
 * ca này khóa tài khoản thì ca sau chạy sai. Vì vậy ta mock mô-đun kho dữ liệu.
 */
const store = require('../../src/data/store');
const { login, MAX_FAILED_ATTEMPTS } = require('../../src/services/auth');

jest.mock('../../src/data/store');

function taoNguoiDung(ghiDe = {}) {
  return {
    email: 'sv@ntu.edu.vn',
    password: 'Matkhau123',
    fullName: 'Nguyen Van Sinh Vien',
    type: 'THUONG',
    failedAttempts: 0,
    locked: false,
    ...ghiDe,
  };
}

describe('login - nghiệp vụ khóa tài khoản', () => {
  let nguoiDung;

  beforeEach(() => {
    jest.resetAllMocks();
    nguoiDung = taoNguoiDung();
    store.findUser.mockImplementation((email) => (email === nguoiDung.email ? nguoiDung : undefined));
  });

  // Ví dụ mẫu đã viết sẵn.
  test('đăng nhập đúng thì thành công', () => {
    const kq = login('sv@ntu.edu.vn', 'Matkhau123');
    expect(kq.ok).toBe(true);
    expect(kq.user.email).toBe('sv@ntu.edu.vn');
  });

  test('email không tồn tại thì báo sai email hoặc mật khẩu', () => {
    const kq = login('khongtontai@ntu.edu.vn', 'Matkhau123');
    expect(kq.ok).toBe(false);
    expect(kq.status).toBe(401);
    expect(kq.message).toBe('Sai email hoặc mật khẩu');
  });

  test('sai mật khẩu 2 lần thì tài khoản chưa bị khóa', () => {
    login('sv@ntu.edu.vn', 'saimatkhau');
    const kq = login('sv@ntu.edu.vn', 'saimatkhau');
    expect(kq.ok).toBe(false);
    expect(kq.status).toBe(401);
    expect(nguoiDung.failedAttempts).toBe(2);
    expect(nguoiDung.locked).toBe(false);
  });

  test('sai mật khẩu MAX_FAILED_ATTEMPTS lần liên tiếp thì tài khoản bị khóa', () => {
    login('sv@ntu.edu.vn', 'sai1');
    login('sv@ntu.edu.vn', 'sai2');
    const kq = login('sv@ntu.edu.vn', 'sai3');
    expect(kq.ok).toBe(false);
    expect(kq.status).toBe(423);
    // v1.1 cập nhật thông báo khóa đầy đủ theo FR-02.4
    expect(kq.message).toBe('Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút');
    expect(nguoiDung.locked).toBe(true);
    expect(nguoiDung.failedAttempts).toBe(MAX_FAILED_ATTEMPTS);
  });

  test('đăng nhập đúng sau 2 lần sai thì bộ đếm về 0 (FR-02.3)', () => {
    login('sv@ntu.edu.vn', 'sai1');
    login('sv@ntu.edu.vn', 'sai2');
    const kq = login('sv@ntu.edu.vn', 'Matkhau123');
    expect(kq.ok).toBe(true);
    expect(nguoiDung.failedAttempts).toBe(0);
  });

  test('tài khoản đang bị khóa, nhập đúng mật khẩu vẫn bị từ chối kèm thông báo khóa (FR-02.4)', () => {
    nguoiDung.locked = true;
    const kq = login('sv@ntu.edu.vn', 'Matkhau123');
    expect(kq.ok).toBe(false);
    expect(kq.message).toBe('Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút');
  });
});
