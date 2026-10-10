# BUỔI 2 – BẢNG PHÂN HOẠCH TƯƠNG ĐƯƠNG VÀ GIÁ TRỊ BIÊN

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Tuổi khi đăng ký (FR-01.3)
**Yêu cầu**: *"Tuổi là **số nguyên từ 18 đến 100** (bao gồm cả 18 và 100). Ngoài khoảng này, hệ thống hiển thị thông báo lỗi và không tạo tài khoản."*

**Bảng phân hoạch**
| Lớp tương đương | Hợp lệ? | Khoảng giá trị | Giá trị đại diện | Mã ca |
|---|---|---|---|---|
| Tuổi dưới mức tối thiểu | Không | < 18 (số nguyên) | 17 | TC-65130239-01 |
| Tuổi hợp lệ | Có | 18 ≤ tuổi ≤ 100 (số nguyên) | 18, 100 | TC-65130239-02, TC-65130239-03 |
| Tuổi trên mức tối đa | Không | > 100 (số nguyên) | 101 | TC-65130239-04 |
| Tuổi không phải số nguyên | Không | Số thực, chữ, ký tự đặc biệt | 55.5 | TC-65130239-05 |

**Giá trị biên cần kiểm tra:** 17 (dưới biên dưới), 18 (đúng biên dưới) và 100 (đúng biên trên), 101 (trên biên trên)

**Ca kiểm thử**
| MaCa | YeuCau | KyThuat | MucTieu | TienDieuKien | DuLieuVao | KetQuaMongDoi | DoUuTien |
|---|---|---|---|---|---|---|---|
| TC-65130239-01 | FR-01.3 | BVA | Tuổi 17 (dưới biên dưới) bị từ chối | TD1 | tuoi=17 | Không tạo tài khoản; hiển thị thông báo lỗi | Cao |
| TC-65130239-02 | FR-01.3 | BVA | Tuổi 18 (đúng biên dưới) được chấp nhận | TD1 | tuoi=18 | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | Cao |
| TC-65130239-03 | FR-01.3 | BVA | Tuổi 100 (đúng biên trên) được chấp nhận | TD1 | tuoi=100 | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | TrungBinh |
| TC-65130239-04 | FR-01.3 | BVA | Tuổi 101 (trên biên trên) bị từ chối | TD1 | tuoi=101 | Không tạo tài khoản; hiển thị thông báo lỗi | TrungBinh |
| TC-65130239-05 | FR-01.3 | EP | Tuổi không phải số nguyên bị từ chối | TD1 | tuoi=55.5 | Không tạo tài khoản; hiển thị thông báo lỗi | Thap |

## 2. Mật khẩu khi đăng ký (FR-01.4)
**Yêu cầu**: *"Mật khẩu có độ dài **từ 8 đến 20 ký tự** (bao gồm cả 8 và 20), chứa **ít nhất một chữ cái và ít nhất một chữ số**."*

##### 2a. Độ dài mật khẩu
**Bảng phân hoạch**
| Lớp tương đương | Hợp lệ? | Mô tả | Giá trị đại diện | Mã ca |
|---|---|---|---|---|
| Quá ngắn | Không | Độ dài < 8 | Abcde12 (7 ký tự) | TC-65130239-07 |
| Độ dài hợp lệ | Có | 8 ≤ độ dài ≤ 20 | Abcdef12 (8 ký tự), Abcdefghijklmnop1234 (20 ký tự) | TC-65130239-06, TC-65130239-08, TC-65130239-09 |
| Quá dài | Không | Độ dài > 20 | Abcdefghijklmnopq1234 (21 ký tự) | TC-65130239-10 |

**Giá trị biên độ dài cần kiểm tra:** 7 (dưới biên dưới), 8 (đúng biên dưới) và 20 (đúng biên trên), 21 (trên biên trên) ký tự

##### 2b. Thành phần ký tự
**Bảng phân hoạch**
| Lớp tương đương | Hợp lệ? | Mô tả | Giá trị đại diện | Mã ca |
|---|---|---|---|---|
| Có chữ cái + có chữ số | Có | Đủ cả hai loại | Matkhau123 | TC-65130239-06 |
| Chỉ có chữ cái, không có chữ số | Không | Thiếu chữ số | Matkhauab | TC-65130239-11 |
| Chỉ có chữ số, không có chữ cái | Không | Thiếu chữ cái | 12345678 | TC-65130239-12 |

**Ca kiểm thử**
| MaCa | YeuCau | KyThuat | MucTieu | TienDieuKien | DuLieuVao | KetQuaMongDoi | DoUuTien |
|---|---|---|---|---|---|---|---|
| TC-65130239-06 | FR-01.4 | EP | Mật khẩu có độ dài hợp lệ và đủ chữ cái, chữ số được chấp nhận | TD1 | matKhau=Matkhau123 | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | Cao |
| TC-65130239-07 | FR-01.4 | BVA | Mật khẩu 7 ký tự (dưới biên dưới) bị từ chối | TD1 | matKhau=Abcde12 | Không tạo tài khoản; hiển thị thông báo lỗi | Cao |
| TC-65130239-08 | FR-01.4 | BVA | Mật khẩu 8 ký tự (đúng biên dưới) được chấp nhận | TD1 | matKhau=Abcdef12 | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | Cao |
| TC-65130239-09 | FR-01.4 | BVA | Mật khẩu 20 ký tự (đúng biên trên) được chấp nhận | TD1 | matKhau=Abcdefghijklmnop1234 | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | TrungBinh |
| TC-65130239-10 | FR-01.4 | BVA | Mật khẩu 21 ký tự (trên biên trên) bị từ chối | TD1 | matKhau=Abcdefghijklmnopq1234 | Không tạo tài khoản; hiển thị thông báo lỗi | TrungBinh |
| TC-65130239-11 | FR-01.4 | EP | Mật khẩu chỉ có chữ cái, không có chữ số bị từ chối | TD1 | matKhau=Matkhauab | Không tạo tài khoản; hiển thị thông báo lỗi | Cao |
| TC-65130239-12 | FR-01.4 | EP | Mật khẩu chỉ có chữ số, không có chữ cái bị từ chối | TD1 | matKhau=12345678 | Không tạo tài khoản; hiển thị thông báo lỗi | TrungBinh |


### 3. Số lượng một sản phẩm trong giỏ (FR-03.2)
**Yêu cầu:** *"Số lượng của mỗi sản phẩm là số nguyên từ 1 đến 99."*

**Bảng phân hoạch**
| Lớp tương đương | Hợp lệ? | Khoảng giá trị | Giá trị đại diện | Mã ca |
|---|---|---|---|---|
| Số lượng dưới mức tối thiểu | Không | ≤ 0 (số nguyên) | 0 | TC-65130239-13 |
| Số lượng hợp lệ | Có | 1 ≤ qty ≤ 99 (số nguyên) | 1, 99 | TC-65130239-14, TC-65130239-15|
| Số lượng trên mức tối đa | Không | ≥ 100 (số nguyên) | 100 | TC-65130239-16 |
| Số lượng không phải số nguyên | Không | Số thực, chữ, ký tự đặc biệt | 1.5 | TC-65130239-17 |

**Giá trị biên cần kiểm tra:** 0 (dưới biên dưới), 1 (đúng biên dưới) và 99 (đúng biên trên), 100 (trên biên trên).

**Ca kiểm thử**
| MaCa | YeuCau | KyThuat | MucTieu | TienDieuKien | DuLieuVao | KetQuaMongDoi | DoUuTien |
|---|---|---|---|---|---|---|---|
| TC-65130239-13 | FR-03.2 | BVA | Số lượng 0 bị từ chối | TD2 | soLuong=0 | Không thêm vào giỏ; hiển thị thông báo lỗi | Cao |
| TC-65130239-14 | FR-03.2 | BVA | Số lượng 1 (đúng biên dưới) được chấp nhận | TD2 | soLuong=1 | Thêm vào giỏ thành công với số lượng 1 | Cao |
| TC-65130239-15 | FR-03.2 | BVA | Số lượng 99 (đúng biên trên) được chấp nhận | TD2 | soLuong=99 | Thêm vào giỏ thành công với số lượng 99 | TrungBinh |
| TC-65130239-16 | FR-03.2 | BVA | Số lượng 100 vượt mức bị từ chối | TD2 | soLuong=100 | Không thêm vào giỏ; hiển thị thông báo lỗi | TrungBinh |
| TC-65130239-17 | FR-03.2 | EP | Số lượng không phải số nguyên bị từ chối | TD2 | soLuong=1.5 | Không thêm vào giỏ; hiển thị thông báo lỗi | Thap |

## 4. Tổng số lượng sản phẩm trong giỏ (FR-03.4)
**Yêu cầu:** *"Tổng số lượng của tất cả sản phẩm trong giỏ không vượt quá 200."*

**Bảng phân hoạch**
| Lớp tương đương | Hợp lệ? | Khoảng giá trị | Giá trị đại diện | Mã ca |
|---|---|---|---|---|
| Tổng giỏ hợp lệ | Có | 1 ≤ tổng ≤ 200 | 50 (hợp lệ), 200 (đúng biên trên) | TC-65130239-18, TC-65130239-19 |
| Tổng giỏ vượt mức tối đa | Không | > 200 | 201 (trên biên trên) | TC-65130239-20 |

**Giá trị biên cần kiểm tra:** 200 (đúng biên trên) và 201 (ngay trên biên trên).

**Ca kiểm thử**
| MaCa | YeuCau | KyThuat | MucTieu | TienDieuKien | DuLieuVao | KetQuaMongDoi | DoUuTien |
|---|---|---|---|---|---|---|---|
| TC-65130239-18 | FR-03.4 | EP | Tổng số lượng giỏ 50 hợp lệ | TD2 | soLuong=50 | Giỏ hàng cập nhật thành công, tổng số lượng = 50 | TrungBinh |
| TC-65130239-19 | FR-03.4 | BVA | Tổng số lượng giỏ đạt đúng biên 200 | TD2 | SP1=99, SP2=99, SP3=2 | Giỏ hàng cập nhật thành công, tổng số lượng = 200 | TrungBinh |
| TC-65130239-20 | FR-03.4 | BVA | Tổng giỏ 201 vượt giới hạn bị từ chối | TD2 | SP1=99, SP2=99, SP3=3 | Không thêm vào giỏ; hiển thị thông báo lỗi | Cao |

### Ghi chú / Điểm cần làm rõ với bộ phận phân tích nghiệp vụ (BA)

1. **Về thông báo lỗi tuổi (FR-01.3):** SRS v1.1 chỉ ghi *"hiển thị thông báo lỗi và không tạo tài khoản"* mà chưa định nghĩa nội dung thông báo cụ thể khi tuổi vi phạm hoặc khi nhập ký tự chữ/số thực. **Hướng xử lý:** Giả định hệ thống hiển thị thông báo lỗi chung; đề xuất BA bổ sung chuỗi thông báo chuẩn trên giao diện.
2. **Về ký tự đặc biệt trong mật khẩu (FR-01.4):** SRS chỉ quy định *"chứa ít nhất một chữ cái và ít nhất một chữ số"*, chưa làm rõ mật khẩu có bắt buộc hoặc cho phép ký tự đặc biệt hay không. **Hướng xử lý:** Không kiểm tra ký tự đặc biệt trong phạm vi này; đề xuất BA làm rõ quy tắc.
3. **Về dữ liệu không phải số ở trường số lượng (FR-03.2):** SRS chưa mô tả hành vi khi người dùng nhập chữ hoặc số âm/số thập phân vào ô số lượng. **Hướng xử lý:** Giả định ô nhập liệu chỉ chấp nhận số nguyên dương, các giá trị khác bị chặn và báo lỗi.
4. **Về thông báo khi giỏ hàng vượt 200 (FR-03.4):** SRS chưa chỉ rõ câu thông báo cụ thể khi tổng sản phẩm vượt quá 200. **Hướng xử lý:** Kiểm chứng hành vi chặn thêm hàng và hiển thị lỗi cảnh báo giới hạn giỏ.