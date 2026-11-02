/*
 * BUỔI 6 — PHẦN 1B
 * Kiểm thử API tầng nghiệp vụ: giỏ hàng, đơn hàng và bộ lọc sản phẩm.
 *
 * Bốn ca đầu đã được viết sẵn làm mẫu cho ba nhóm kiểm tra:
 *   - ca âm trả về 4xx kèm thông báo;
 *   - quy tắc nghiệp vụ trong thân phản hồi;
 *   - tác dụng phụ, kiểm bằng một lời gọi API thứ hai.
 *
 * Đã hoàn thành các yêu cầu kiểm thử nghiệp vụ (5 đến 12).
 * Không mở trình duyệt trong file này — chỉ dùng fixture `request`.
 */
const { test, expect } = require('@playwright/test');
const { datLaiDuLieu } = require('../helpers/dat-lai-du-lieu');

let token;

async function dangNhap(request, email = 'sv@ntu.edu.vn') {
  const res = await request.post('/api/login', { data: { email, password: 'Matkhau123' } });
  return (await res.json()).token;
}

function kemToken(tok = token) {
  return { headers: { Authorization: `Bearer ${tok}` } };
}

test.beforeEach(async ({ request }) => {
  await datLaiDuLieu(request);
  token = await dangNhap(request);
});

// ---------------------------------------------------------------
// GIỎ HÀNG — ca mẫu
// ---------------------------------------------------------------
test('FR-03.2 — thêm sản phẩm với số lượng 0 trả về 400', async ({ request }) => {
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 0 } });

  expect(res.status()).toBe(400);
  expect((await res.json()).message).toContain('Số lượng phải là số nguyên từ 1 đến 99');
});

test('FR-03.6 — thêm sản phẩm không tồn tại trả về 404', async ({ request }) => {
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 999, qty: 1 } });

  expect(res.status()).toBe(404);
  expect((await res.json()).message).toBe('Sản phẩm không tồn tại');
});

test('FR-03.3 — thêm lại sản phẩm đã có thì CẬP NHẬT số lượng, không cộng dồn', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 2 } });
  const res = await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 5 } });

  expect(res.status()).toBe(200);
  const gio = (await res.json()).cart;
  expect(gio.items).toHaveLength(1);
  expect(gio.items[0].qty).toBe(5);
  expect(gio.subtotal).toBe(250000); // 5 × 50.000đ
});

// Ca mẫu về TÁC DỤNG PHỤ: lời gọi thứ hai mới kiểm được trạng thái sau đó.
test('FR-05.1 — đặt hàng thành công thì giỏ hàng được làm trống', async ({ request }) => {
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 1 } });
  await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });

  const gio = await (await request.get('/api/cart', kemToken())).json();
  expect(gio.items).toHaveLength(0);
  expect(gio.subtotal).toBe(0);
});

// ---------------------------------------------------------------
// Ca 5: FR-03.5 — xóa một sản phẩm KHÔNG có trong giỏ phải trả về 404.
// ---------------------------------------------------------------
test('FR-03.5 — xóa sản phẩm không có trong giỏ hàng trả về 404', async ({ request }) => {
  // Giỏ đang trống, xóa productId=3 phải nhận 404
  const res = await request.delete('/api/cart/3', kemToken());

  expect(res.status()).toBe(404);
});

// ---------------------------------------------------------------
// Ca 6: FR-05.1 — đặt hàng khi giỏ TRỐNG phải trả về 400 kèm thông báo.
// ---------------------------------------------------------------
test('FR-05.1 — đặt hàng khi giỏ trống trả về 400', async ({ request }) => {
  const res = await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });

  expect(res.status()).toBe(400);
  expect((await res.json()).message).toBe('Giỏ hàng đang trống');
});

// ---------------------------------------------------------------
// Ca 7: FR-05.2 — kiểm công thức tổng tiền, thành viên THUONG, zone nội thành.
// Sản phẩm 4: Balo laptop 350.000đ; shippingFee nội thành = 20.000đ.
// Lỗi cài sẵn: src/server.js tính total = subtotal - discount (bỏ + shippingFee)
// nên total thực tế = 350000 thay vì 370000. Ca này ĐỎ — ghi nhận bug.
// ---------------------------------------------------------------
test('FR-05.2 — tổng tiền đơn hàng = tạm tính - giảm giá + phí vận chuyển (THUONG, nội thành)', async ({ request }) => {
  // Thêm sản phẩm 4 (350.000đ) vào giỏ
  await request.post('/api/cart', { ...kemToken(), data: { productId: 4, qty: 1 } });

  // Tạo đơn hàng với zone nội thành
  const res = await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });
  expect(res.status()).toBe(201);

  // POST /api/orders trả về object order trực tiếp (không bọc trong { order: ... })
  const don = await res.json();
  // Kiểm từng thành phần (mức b)
  expect(don.subtotal).toBe(350000);
  expect(don.discount).toBe(0);
  expect(don.shippingFee).toBe(20000);
  // Kiểm quan hệ nghiệp vụ — KHÔNG dùng số cứng (mức c)
  expect(don.total).toBe(don.subtotal - don.discount + don.shippingFee);
});

// ---------------------------------------------------------------
// Ca 8: FR-05.3 + FR-04.3 — thành viên VIP, zone ngoại thành.
// Sản phẩm 4: 350.000đ. VIP: discount = 5%, shippingFee = 0 (miễn phí mọi khu vực).
// Ca này có thể XANH vì shippingFee=0, nên lỗi bỏ + shippingFee không ảnh hưởng.
// ---------------------------------------------------------------
test('FR-05.3 + FR-04.3 — đơn hàng VIP: giảm 5%, miễn phí vận chuyển, total đúng công thức', async ({ request }) => {
  const tokenVip = await dangNhap(request, 'vip@ntu.edu.vn');

  // VIP thêm sản phẩm 4 vào giỏ
  await request.post('/api/cart', { ...kemToken(tokenVip), data: { productId: 4, qty: 1 } });

  // Tạo đơn với zone ngoại thành — VIP được miễn phí vận chuyển ở mọi khu vực
  const res = await request.post('/api/orders', { ...kemToken(tokenVip), data: { zone: 'ngoai-thanh' } });
  expect(res.status()).toBe(201);

  // POST /api/orders trả về object order trực tiếp (không bọc trong { order: ... })
  const don = await res.json();
  // Kiểm thành phần: discount = 5% tạm tính, shippingFee = 0
  expect(don.subtotal).toBe(350000);
  expect(don.discount).toBe(350000 * 0.05); // 17500
  expect(don.shippingFee).toBe(0);
  // Kiểm quan hệ nghiệp vụ (FR-05.2)
  expect(don.total).toBe(don.subtotal - don.discount + don.shippingFee);
});

// ---------------------------------------------------------------
// Ca 9: FR-05.5 — hủy một đơn hàng KHÔNG tồn tại.
// ---------------------------------------------------------------
test('FR-05.5 — hủy đơn hàng không tồn tại trả về 404', async ({ request }) => {
  const res = await request.delete('/api/orders/9999', kemToken());

  expect(res.status()).toBe(404);
  expect((await res.json()).message).toContain('Không tìm thấy');
});

// ---------------------------------------------------------------
// Ca 10: FR-05.5 — hủy LẠI một đơn đã hủy phải trả về 409.
// ---------------------------------------------------------------
test('FR-05.5 — hủy lại đơn hàng đã hủy trả về 409', async ({ request }) => {
  // Tạo đơn hàng trước
  await request.post('/api/cart', { ...kemToken(), data: { productId: 3, qty: 1 } });
  const taoRes = await request.post('/api/orders', { ...kemToken(), data: { zone: 'noi-thanh' } });
  expect(taoRes.status()).toBe(201);
  // POST /api/orders trả về object order trực tiếp
  const donId = (await taoRes.json()).id;

  // Hủy lần một — phải được 200
  const huyLan1 = await request.delete(`/api/orders/${donId}`, kemToken());
  expect(huyLan1.status()).toBe(200);

  // Hủy lần hai — phải trả về 409
  const huyLan2 = await request.delete(`/api/orders/${donId}`, kemToken());
  expect(huyLan2.status()).toBe(409);
});

// ---------------------------------------------------------------
// Ca 11: FR-06.5 và FR-06.6 — bộ lọc sản phẩm.
// ---------------------------------------------------------------
test('FR-06.5 — sapXep=gia-giam: danh sách phải sắp xếp giảm dần theo giá', async ({ request }) => {
  const res = await request.get('/api/products?sapXep=gia-giam');

  expect(res.status()).toBe(200);
  // GET /api/products trả về array trực tiếp (không bọc trong { products: ... })
  const products = await res.json();
  const prices = products.map((p) => p.price);
  // So mảng giá với chính nó sau khi sắp xếp giảm dần — cách kiểm không phụ thuộc dữ liệu
  const expected = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(expected);
});

test('FR-06.6 — conHang=co: tất cả sản phẩm phải có stock > 0', async ({ request }) => {
  const res = await request.get('/api/products?conHang=co');

  expect(res.status()).toBe(200);
  // GET /api/products trả về array trực tiếp (không bọc trong { products: ... })
  const products = await res.json();
  expect(products.length).toBeGreaterThan(0);
  // Mọi phần tử phải có stock > 0
  for (const p of products) {
    expect(p.stock).toBeGreaterThan(0);
  }
});

// ---------------------------------------------------------------
// Ca 12: FR-06.7 — tổ hợp nhiều tiêu chí trong một lời gọi.
// Danh mục do-dung-hoc-tap + giá dưới 100k:
//   - Sổ tay sinh viên (50.000đ, id=3)
//   - Bút ký NTU (35.000đ, id=6)
// ---------------------------------------------------------------
test('FR-06.7 — lọc đồng thời danh mục do-dung-hoc-tap và giá duoi-100k', async ({ request }) => {
  const res = await request.get('/api/products?danhMuc=do-dung-hoc-tap&khoangGia=duoi-100k');

  expect(res.status()).toBe(200);
  // GET /api/products trả về array trực tiếp (không bọc trong { products: ... })
  const products = await res.json();
  const tenSanPham = products.map((p) => p.name).sort();
  // Suy từ dữ liệu mẫu trong SRS v1.2: id=3 (50k) và id=6 (35k)
  expect(tenSanPham).toEqual(['Bút ký NTU', 'Sổ tay sinh viên'].sort());
});
