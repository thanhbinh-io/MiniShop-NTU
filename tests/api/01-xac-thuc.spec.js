/*
 * BUỔI 6 — PHẦN 1A
 * Kiểm thử API tầng xác thực và phân quyền của MiniShop.
 *
 * Ba ca đầu đã được viết sẵn làm mẫu, thể hiện ba mức kiểm tra bắt buộc
 * của một ca kiểm thử API:
 *   (a) mã trạng thái HTTP;
 *   (b) cấu trúc thân phản hồi;
 *   (c) giá trị nghiệp vụ bên trong thân phản hồi.
 *
 * Đã hoàn thành các yêu cầu kiểm thử xác thực và phân quyền (1 đến 4).
 * Không mở trình duyệt trong file này — chỉ dùng fixture `request`.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

const TK_THUONG = { email: 'sv@ntu.edu.vn', password: 'Matkhau123' };
const TK_VIP = { email: 'vip@ntu.edu.vn', password: 'Matkhau123' };

async function layToken(request, tk) {
  const res = await request.post('/api/login', { data: tk });
  return (await res.json()).token;
}

// Đặt lại dữ liệu trước mỗi ca. Thiếu dòng này, một ca làm khóa tài khoản
// sẽ khiến các ca sau chạy sai và kết quả phụ thuộc thứ tự chạy.
test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
});

// ---------------------------------------------------------------
// CA MẪU 1 — kiểm đủ ba mức: trạng thái, cấu trúc, giá trị nghiệp vụ
// ---------------------------------------------------------------
test('POST /api/login đúng thông tin trả về 200 kèm token', async ({ request }) => {
  const res = await request.post('/api/login', { data: TK_THUONG });

  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(data.ok).toBe(true);
  expect(typeof data.token).toBe('string');
  expect(data.token.length).toBeGreaterThan(0);
  expect(data.user).toMatchObject({ email: TK_THUONG.email, type: 'THUONG' });
});

// ---------------------------------------------------------------
// CA MẪU 2 — ca âm: kiểm cả mã trạng thái và thông báo lỗi
// ---------------------------------------------------------------
test('POST /api/login sai mật khẩu trả về 401', async ({ request }) => {
  const res = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'SaiMatKhau' },
  });

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Sai email hoặc mật khẩu');
});

// ---------------------------------------------------------------
// CA MẪU 3 — yêu cầu không kèm token
// ---------------------------------------------------------------
test('GET /api/cart không kèm token trả về 401', async ({ request }) => {
  const res = await request.get('/api/cart');

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Bạn cần đăng nhập');
});

// ---------------------------------------------------------------
// Ca bổ sung: FR-01.4 — mật khẩu có chữ hoa và chữ số được chấp nhận
// Lỗi bug thật: src/services/registration.js kiểm tra /[a-z]/ nên từ chối mật khẩu chữ hoa với 400
// ---------------------------------------------------------------
test('FR-01.4 — mật khẩu có chữ hoa và chữ số được chấp nhận', async ({ request }) => {
  const credentials = {
    fullName: 'Nguoi Dung Thu',
    email: `hoa-${Date.now()}@ntu.edu.vn`,
    age: 20,
    password: 'ABCDEFGH12',
  };
  const res = await request.post('/api/register', { data: credentials });

  expect(res.status()).toBe(201);
  const data = await res.json();
  expect(data).toMatchObject({ ok: true, message: 'Đăng ký thành công' });

  const login = await request.post('/api/login', {
    data: { email: credentials.email, password: credentials.password },
  });
  expect(login.status()).toBe(200);
  expect((await login.json()).user.email).toBe(credentials.email);
});

// ---------------------------------------------------------------
// Ca 1: FR-02.3 — sai mật khẩu đủ 3 lần liên tiếp thì khóa tài khoản.
// ---------------------------------------------------------------
test('FR-02.3 — sai mật khẩu 3 lần liên tiếp: lần 1 và 2 trả về 401, lần 3 trả về 423', async ({ request }) => {
  // Lần 1 — sai mật khẩu, chưa khóa
  const lan1 = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'Sai_Lan1' },
  });
  expect(lan1.status()).toBe(401);

  // Lần 2 — sai mật khẩu, chưa khóa
  const lan2 = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'Sai_Lan2' },
  });
  expect(lan2.status()).toBe(401);

  // Lần 3 — tài khoản bị khóa, trả về 423
  const lan3 = await request.post('/api/login', {
    data: { email: TK_THUONG.email, password: 'Sai_Lan3' },
  });
  expect(lan3.status()).toBe(423);
  expect((await lan3.json()).message).toContain('Tài khoản đã bị khóa');
});

// ---------------------------------------------------------------
// Ca 2: FR-02.4 — tài khoản đang bị khóa thì mật khẩu ĐÚNG vẫn bị từ chối.
// ---------------------------------------------------------------
test('FR-02.4 — tài khoản đang bị khóa: đăng nhập đúng mật khẩu vẫn trả về 423', async ({ request }) => {
  // Dựng trạng thái khóa: đăng nhập sai 3 lần
  for (const pw of ['Sai1', 'Sai2', 'Sai3']) {
    await request.post('/api/login', { data: { email: TK_THUONG.email, password: pw } });
  }

  // Giờ đăng nhập đúng mật khẩu — vẫn phải bị từ chối vì tài khoản đang khóa
  const res = await request.post('/api/login', { data: TK_THUONG });
  expect(res.status()).toBe(423);
  expect((await res.json()).message).toContain('Tài khoản đã bị khóa');
});

// ---------------------------------------------------------------
// Ca 3: GET /api/cart với token không tồn tại phải trả về 401.
// ---------------------------------------------------------------
test('GET /api/cart với token giả mạo trả về 401', async ({ request }) => {
  const res = await request.get('/api/cart', {
    headers: { Authorization: 'Bearer mot_chuoi_bat_ky_khong_hop_le' },
  });

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Bạn cần đăng nhập');
});

// ---------------------------------------------------------------
// Ca 4: FR-05.5 — một tài khoản KHÔNG được hủy đơn hàng của tài khoản khác.
// ---------------------------------------------------------------
test('FR-05.5 — tài khoản VIP không được hủy đơn hàng của tài khoản THUONG', async ({ request }) => {
  // Bước 1: lấy token của cả hai tài khoản
  const tokenThuong = await layToken(request, TK_THUONG);
  const tokenVip = await layToken(request, TK_VIP);

  // Bước 2: TK_THUONG thêm sản phẩm 4 vào giỏ rồi tạo đơn hàng
  await request.post('/api/cart', {
    headers: { Authorization: `Bearer ${tokenThuong}` },
    data: { productId: 4, qty: 1 },
  });
  const taoKetQua = await request.post('/api/orders', {
    headers: { Authorization: `Bearer ${tokenThuong}` },
    data: { zone: 'noi-thanh' },
  });
  expect(taoKetQua.status()).toBe(201);
  // POST /api/orders trả về object order trực tiếp (không bọc trong { order: ... })
  const donHang = await taoKetQua.json();
  const donId = donHang.id;

  // Bước 3: TK_VIP thử hủy đơn hàng của TK_THUONG — theo FR-05.5 phải nhận 404
  // Lỗi bug thật: src/server.js không kiểm email chủ sở hữu nên trả về 200
  const huyKetQua = await request.delete(`/api/orders/${donId}`, {
    headers: { Authorization: `Bearer ${tokenVip}` },
  });
  expect(huyKetQua.status()).toBe(404);

  // Bước 4: kiểm tác dụng phụ — đơn hàng của TK_THUONG vẫn còn nguyên
  // GET /api/orders trả về array trực tiếp (không bọc trong { orders: ... })
  const danhSachDon = await request.get('/api/orders', {
    headers: { Authorization: `Bearer ${tokenThuong}` },
  });
  const orders = await danhSachDon.json();
  const donGoc = orders.find((d) => d.id === donId);
  expect(donGoc).toBeDefined();
  expect(donGoc.status).toBe('CHO_XAC_NHAN');
});
