# BUỔI 2 – PAIRWISE (BÀI TỰ CHỌN, ĐIỂM CỘNG)

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239
## 1. Tính số tổ hợp đầy đủ (Cartesian Product)

Màn hình **Tìm kiếm và lọc sản phẩm** có 5 tham số đầu vào với số lượng giá trị tương ứng:
1. **Từ khóa (3 giá trị):** Rỗng, Khớp, Không khớp
2. **Danh mục (3 giá trị):** Tất cả, Quà lưu niệm, Đồ dùng học tập
3. **Khoảng giá (3 giá trị):** Dưới 100k, 100k–300k, Trên 300k
4. **Sắp xếp (3 giá trị):** Giá tăng, Giá giảm, Mới nhất
5. **Chỉ còn hàng (2 giá trị):** Có, Không

* **Tổng số tổ hợp kiểm thử toàn diện (Exhaustive Testing):**
  \\[N = 3 \times 3 \times 3 \times 3 \times 2 = 162 \text{ tổ hợp}\\]

## 2. Bảng bộ ca kiểm thử Pairwise (Tổ hợp 2 yếu tố)

Áp dụng kỹ thuật kiểm thử từng cặp (Pairwise / 2-way combinatorial testing), toàn bộ **78 cặp giá trị tương tác** giữa 5 tham số được phủ kín hoàn toàn chỉ với **12 ca kiểm thử**:

| STT | Từ khóa | Danh mục | Khoảng giá | Sắp xếp | Chỉ còn hàng |
|---|---|---|---|---|---|
| **PW-01** | Rỗng | Tất cả | Trên 300k | Mới nhất | Có |
| **PW-02** | Rỗng | Quà lưu niệm | Dưới 100k | Giá tăng | Có |
| **PW-03** | Rỗng | Quà lưu niệm | 100k–300k | Mới nhất | Không |
| **PW-04** | Rỗng | Đồ dùng học tập | 100k–300k | Giá giảm | Có |
| **PW-05** | Khớp | Tất cả | Dưới 100k | Giá giảm | Không |
| **PW-06** | Khớp | Quà lưu niệm | 100k–300k | Giá giảm | Không |
| **PW-07** | Khớp | Đồ dùng học tập | Dưới 100k | Mới nhất | Có |
| **PW-08** | Khớp | Đồ dùng học tập | Trên 300k | Giá tăng | Không |
| **PW-09** | Không khớp | Tất cả | Dưới 100k | Mới nhất | Không |
| **PW-10** | Không khớp | Tất cả | 100k–300k | Giá tăng | Không |
| **PW-11** | Không khớp | Quà lưu niệm | Trên 300k | Giá giảm | Có |
| **PW-12** | Không khớp | Đồ dùng học tập | Trên 300k | Giá giảm | Không |

## 3. So sánh số lượng ca và hiệu quả tối ưu

* **Số ca đầy đủ:** 162 ca
* **Số ca Pairwise:** 12 ca
* **Tỷ lệ giảm thiểu:** 
  \\[\frac{162 - 12}{162} \times 100\% \approx 92.6\%\\]
* **Đánh giá:** Phương pháp Pairwise giúp giảm hơn **92%** số lượng ca kiểm thử cần thực hiện, tiết kiệm phần lớn thời gian và chi phí kiểm thử mà vẫn đảm bảo kiểm tra được toàn bộ tương tác giữa bất kỳ 2 tham số nào.

## 4. Nhận xét: Pairwise KHÔNG phát hiện được loại lỗi nào?

Mặc dù rất hiệu quả trong việc phát hiện lỗi tương tác 2 yếu tố, Pairwise **không thể phát hiện** các loại lỗi sau:

1. **Lỗi tương tác từ 3 tham số trở lên (Higher-order interactions / 3-way, 4-way, N-way):**
   * *Ví dụ:* Một lỗi lập trình trong câu truy vấn SQL chỉ phát sinh khi người dùng đồng thời chọn: Từ khóa `"khớp"` **VÀ** Khoảng giá `"trên 300k"` **VÀ** Sắp xếp `"Giá giảm"`. Nếu bộ ca 12 ca trên vô tình không chứa đúng bộ ba này cùng lúc, lỗi sẽ bị bỏ sót.
2. **Lỗi giá trị biên và dữ liệu bất thường (Invalid / Boundary inputs):**
   * Pairwise chỉ tổ hợp các giá trị danh nghĩa được định nghĩa trước; kỹ thuật này không thay thế được phân tích giá trị biên (BVA) hay phân hoạch tương đương (EP) cho các dữ liệu nhập tự do (như ô tìm kiếm nhập ký tự đặc biệt, chuỗi SQL injection, hoặc chuỗi quá dài).
3. **Lỗi phụ thuộc logic nghiệp vụ ngầm (Complex Business Logic Constraints):**
   * Các lỗi luồng nghiệp vụ phức tạp diễn ra theo chuỗi thời gian hoặc trạng thái trước đó (như lịch sử giỏ hàng, phiên đăng nhập) không thể phát hiện thông qua việc tổ hợp độc lập các giá trị trên một màn hình lọc.