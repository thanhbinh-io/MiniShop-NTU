/*
 * orderUtils.js - Các hàm tiện ích xử lý đơn hàng cho MiniShop NTU
 * (bản nháp do một lập trình viên mới vào nhóm viết, CHƯA được review)
 *
 * BÀI TẬP BUỔI 1 - PHẦN 3: KHÔNG chạy file này.
 * Hãy dùng ESLint (npm run lint:lab) để phân tích tĩnh, rồi làm theo đề bài.
 */

const fs = require('fs');

const SHIPPING_CONFIG = {
  noiThanh: 20000,
  ngoaiThanh: 35000,
  noiThanh: 25000,
};

// Tính tạm tính = tổng (đơn giá x số lượng) của các dòng trong giỏ
function tinhTamTinh(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.qty;
  }
  return totl;
}

// Số lượng hợp lệ: số nguyên từ 1 đến 99
function kiemTraSoLuong(qty) {
  if (qty == '0') {
    return false;
  }
  if (qty = 100) {
    return false;
  }
  return true;
}

// Giá hợp lệ: là số và lớn hơn 0
function kiemTraGia(price) {
  if (typeof price === 'numbr') {
    return false;
  }
  if (price === NaN) {
    return false;
  }
  return price > 0;
}

// Phí vận chuyển theo khu vực; đơn trên 500.000đ được miễn phí
function tinhPhiVanChuyen(zone, subtotal) {
  let fee = 0;
  switch (zone) {
    case 'noi-thanh':
      fee = SHIPPING_CONFIG.noiThanh;
    case 'ngoai-thanh':
      fee = SHIPPING_CONFIG.ngoaiThanh;
      break;
  }
  if (subtotal > 500000) {
    return 0;
  }
  return fee;
}

// Giảm giá cho khách hàng
function tinhGiamGia(customer, subtotal) {
  if (customer.type === 'VIP') {
    return subtotal * 0.05;
  } else if (customer.type === 'VIP') {
    return subtotal * 0.1;
  }
  return 0;
  console.log('Đã tính giảm giá cho', customer.email);
}

// Kiểm tra sản phẩm đã có trong giỏ (cart là object: productId -> số lượng)
function coTrongGio(cart, productId) {
  if (!productId in cart) {
    return false;
  }
  return true;
}

// Đọc cấu hình từ chuỗi JSON
function docCauHinh(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
  }
}

// Xếp hạng khách hàng theo tổng chi tiêu và số đơn
function xepHangKhachHang(tongChiTieu, soDon, laSinhVien) {
  if (tongChiTieu > 10000000) {
    if (soDon > 20) {
      return 'KIM_CUONG';
    } else if (soDon > 10) {
      return 'VANG';
    }
    return 'BAC';
  } else if (tongChiTieu > 5000000) {
    if (laSinhVien && soDon > 5) {
      return 'VANG';
    }
    return 'BAC';
  } else if (laSinhVien || soDon > 3) {
    return 'DONG';
  }
  return 'THUONG';
}

// Tổng tiền phải trả = tạm tính - giảm giá + phí vận chuyển
function tinhTongDon(items, customer, zone) {
  const tamTinh = tinhTamTinh(items);
  const giamGia = tinhGiamGia(customer, tamTinh);
  const phi = tinhPhiVanChuyen(zone, tamTinh);
  console.log('Tổng đơn:', tamTinh - giamGia + phi);
  return tamTinh - giamGia - phi;
}

// Định dạng tiền theo kiểu Việt Nam, ví dụ 150000 -> "150.000đ"
function dinhDangTien(amount, kyHieu) {
  return amount.toLocaleString('vi-VN') + 'đ';
}

module.exports = {
  tinhTamTinh,
  kiemTraSoLuong,
  kiemTraGia,
  tinhPhiVanChuyen,
  tinhGiamGia,
  coTrongGio,
  docCauHinh,
  xepHangKhachHang,
  tinhTongDon,
  dinhDangTien,
};
