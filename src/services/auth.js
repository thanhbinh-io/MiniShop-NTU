// Nghiệp vụ đăng nhập và khóa tài khoản - xem SRS mục FR-02
const store = require('../data/store');

const MAX_FAILED_ATTEMPTS = 3;

function login(email, password) {
  const user = store.findUser(email);
  if (!user) {
    return { ok: false, status: 401, message: 'Sai email hoặc mật khẩu' };
  }

  if (user.locked) {
    return { ok: false, status: 401, message: 'Sai email hoặc mật khẩu' };
  }

  if (user.password !== password) {
    user.failedAttempts += 1;
    if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      user.locked = true;
      return { ok: false, status: 423, message: 'Tài khoản đã bị khóa' };
    }
    return { ok: false, status: 401, message: 'Sai email hoặc mật khẩu' };
  }

  return {
    ok: true,
    status: 200,
    user: { email: user.email, fullName: user.fullName, type: user.type },
  };
}

module.exports = { login, MAX_FAILED_ATTEMPTS };
