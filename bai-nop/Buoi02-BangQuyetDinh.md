# BUỔI 2 – BẢNG QUYẾT ĐỊNH: PHÍ VẬN CHUYỂN VÀ GIẢM GIÁ

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239
- **Yêu cầu liên quan:** FR-04.1, FR-04.2, FR-04.3, FR-05.2, FR-05.3

## 1. Điều kiện và hành động

| Ký hiệu | Điều kiện | Các giá trị |
|---|---|---|
| C1 | Loại thành viên | Thường / VIP |
| C2 | Khu vực giao hàng | Nội thành / Ngoại thành |
| C3 | Tạm tính ≥ 500.000đ? | Có / Không |

| Ký hiệu | Hành động |
|---|---|
| A1 | Phí vận chuyển |
| A2 | Giảm giá |
| A3 | Tổng tiền = Tạm tính − Giảm giá + Phí vận chuyển |

Số luật của bảng đầy đủ = 2 × 2 × 2 = **8 luật**

## 2. Bảng quyết định đầy đủ

| | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 |
|---|---|---|---|---|---|---|---|---|
| **C1** Loại thành viên | VIP | VIP | VIP | VIP | Thường | Thường | Thường | Thường |
| **C2** Khu vực | Nội thành | Nội thành | Ngoại thành | Ngoại thành | Nội thành | Nội thành | Ngoại thành | Ngoại thành |
| **C3** Tạm tính ≥ 500.000đ | Có | Không | Có | Không | Có | Không | Có | Không |
| **A1** Phí vận chuyển | 0đ | 0đ | 0đ | 0đ | 0đ | 20.000đ | 0đ | 35.000đ |
| **A2** Giảm giá | 5% tạm tính | 5% tạm tính | 5% tạm tính | 5% tạm tính | 0đ | 0đ | 0đ | 0đ |
| **A3** Tổng tiền | TT − 5%TT + 0 | TT − 5%TT + 0 | TT − 5%TT + 0 | TT − 5%TT + 0 | TT + 0 | TT + 20.000 | TT + 0 | TT + 35.000 |

**Giải thích bảng đầy đủ:**
- L1–L4: VIP luôn miễn phí vận chuyển (FR-04.3), không phụ thuộc khu vực và tạm tính → A1 = 0đ. VIP luôn giảm 5% (FR-05.3) → A2 = 5%.
- L5, L7: Thường + tạm tính ≥ 500.000đ → miễn phí vận chuyển (FR-04.2), không giảm giá.
- L6: Thường + nội thành + tạm tính < 500.000đ → phí 20.000đ (FR-04.1).
- L8: Thường + ngoại thành + tạm tính < 500.000đ → phí 35.000đ (FR-04.1).

## 3. Bảng rút gọn

Dùng `–` cho giá trị *don't care*.

| | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| **C1** Loại thành viên | VIP | Thường | Thường | Thường |
| **C2** Khu vực | – | – | Nội thành | Ngoại thành |
| **C3** Tạm tính ≥ 500.000đ | – | Có | Không | Không |
| **A1** Phí vận chuyển | 0đ | 0đ | 20.000đ | 35.000đ |
| **A2** Giảm giá | 5% tạm tính | 0đ | 0đ | 0đ |
| **A3** Tổng tiền | TT × 0,95 | TT | TT + 20.000 | TT + 35.000 |

Từ 8 luật rút gọn còn **4 luật**.

**Giải thích việc gộp:**

- **R1** gộp L1, L2, L3, L4: Khi khách hàng là VIP, phí vận chuyển luôn bằng 0đ (FR-04.3) và giảm giá luôn là 5% (FR-05.3), bất kể khu vực và tạm tính. Do đó C2 và C3 đều là don't care.
- **R2** gộp L5, L7: Khi khách Thường có tạm tính ≥ 500.000đ, phí vận chuyển = 0đ (FR-04.2) bất kể khu vực. Do đó C2 là don't care.
- **R3** = L6: Thường + nội thành + tạm tính < 500.000đ → phí 20.000đ. Không gộp được.
- **R4** = L8: Thường + ngoại thành + tạm tính < 500.000đ → phí 35.000đ. Không gộp được.

## 4. Ánh xạ sang ca kiểm thử

| Luật rút gọn | Mã ca trong Buoi02-TestCase.csv | Mô tả kịch bản |
|---|---|---|
| **R1** (VIP: Phí 0đ, Giảm 5%) | TC-65130239-25, TC-65130239-26, TC-65130239-27 | VIP nội thành, VIP ngoại thành, VIP đơn lớn ≥ 500k |
| **R2** (Thường ≥ 500k: Phí 0đ) | TC-65130239-23, TC-65130239-24 | Thường nội thành ≥ 500k, Thường ngoại thành ≥ 500k |
| **R3** (Thường, Nội, < 500k: Phí 20k) | TC-65130239-21 | Thường nội thành đơn 300k |
| **R4** (Thường, Ngoại, < 500k: Phí 35k) | TC-65130239-22, TC-65130239-28 | Thường ngoại thành đơn 300k, đơn 200k |
| **Ca biên 500.000đ** | TC-65130239-23, TC-65130239-27 | Kiểm tra đúng mốc 500.000đ và mốc 550.000đ |

**Ghi chú về biên:** Giá sản phẩm trong MiniShop đều là bội số của 50.000đ (50k, 100k, 150k, 200k, 350k). Các giá trị tạm tính có thể tạo quanh ngưỡng 500.000đ:
- **450.000đ** (< 500k): Ví dụ 3 × Áo thun NTU (150k) = 450.000đ
- **500.000đ** (= 500k): Ví dụ 1 × Balo laptop (350k) + 1 × Áo thun NTU (150k) = 500.000đ
- **550.000đ** (> 500k): Ví dụ 1 × Balo laptop (350k) + 1 × Nón bảo hiểm NTU (200k) = 550.000đ

Giá trị **499.000đ** và **501.000đ** (biên ±1) **không thể tạo được** qua giao diện vì tất cả sản phẩm đều có giá là bội số của 50.000đ. Đây là ràng buộc kiểm thử thực tế — muốn kiểm biên chính xác cần gọi trực tiếp hàm `calcShippingFee` với tham số tùy ý.