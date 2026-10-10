# BUỔI 2 – CHẠY THỬ VÀ MA TRẬN TRUY VẾT

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 0. Đối chiếu SRS v1.1 với phiếu review Buổi 1
SRS v1.1 đã sửa nhiều lỗi: thống nhất tuổi 18–100 (FR-01.3), định nghĩa mật khẩu mạnh (FR-01.4), bổ sung email trùng (FR-01.5), thống nhất quy tắc khóa tài khoản (FR-02.3, FR-02.4), định lượng giỏ hàng tối đa 200 (FR-03.4), ngưỡng miễn phí "từ 500.000đ" (FR-04.2). Một số lỗi đã phát hiện ở Buổi 1 như thiếu định nghĩa mật khẩu mạnh, nhưng lỗi thiếu điều kiện hủy đơn (FR-05.5) và ngưỡng cụ thể giỏ hàng dễ bỏ sót vì cần đọc kỹ ngữ cảnh sử dụng. Lỗi bỏ sót chủ yếu do chưa đối chiếu kỹ giữa các mục liên quan trong SRS.

## 1. Kết quả chạy thử 5 ca ưu tiên Cao

| Mã ca | Tóm tắt ca | Kết quả mong đợi (chép từ TestCase.csv) | Kết quả thực tế | Pass/Fail |
|---|---|---|---|---|
| TC-65130239-02 | Tuổi 18 (đúng biên dưới) được chấp nhận | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | Tạo tài khoản thành công; hiển thị "Đăng ký thành công" | Pass |
| TC-65130239-07 | Mật khẩu 7 ký tự (dưới biên dưới) bị từ chối | Không tạo tài khoản; hiển thị thông báo lỗi | Không tạo tài khoản; hiển thị thông báo lỗi trên form | Pass |
| TC-65130239-21 | Thành viên thường mua nội thành dưới 500k | Tạm tính: 300.000đ; Giảm giá: 0đ; Phí vận chuyển: 20.000đ; Tổng tiền: 320.000đ | Tạm tính: 300.000đ; Giảm giá: 0đ; Phí vận chuyển: 20.000đ; Tổng tiền: 320.000đ | Pass |
| TC-65130239-23 | Thành viên thường mua đúng biên 500k nội thành freeship | Tạm tính: 500.000đ; Giảm giá: 0đ; Phí vận chuyển: 0đ; Tổng tiền: 500.000đ | Tạm tính: 500.000đ; Giảm giá: 0đ; Phí vận chuyển: 20.000đ; Tổng tiền: 520.000đ | Fail |
| TC-65130239-32 | Sai mật khẩu 3 lần liên tiếp tài khoản bị khóa 15 phút | Hiển thị thông báo "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút"; tài khoản chuyển sang trạng thái bị khóa (S3) | Hiển thị thông báo "Tài khoản đã bị khóa, vui lòng thử lại sau 15 phút" và tài khoản bị khóa | Pass |

### Phân tích các ca Fail

| Mã ca | Nguyên nhân: mã nguồn sai hay ca kiểm thử sai? | Căn cứ (mã yêu cầu trong SRS v1.1) |
|---|---|---|
| TC-65130239-23 | **Mã nguồn sai.** Mã nguồn sử dụng điều kiện so sánh nghiêm ngặt `subtotal > 500000` thay vì `>= 500000` dẫn đến đơn hàng đạt đúng mốc 500.000đ vẫn bị tính phí vận chuyển 20.000đ. Ca kiểm thử của sinh viên xác định phí vận chuyển 0đ là chính xác theo đặc tả. | Căn cứ **FR-04.2**: *"Đơn hàng có tạm tính từ 500.000đ trở lên được miễn phí vận chuyển."* |

## 2. Ma trận truy vết (RTM)

Bảng ma trận truy vết đối soát toàn bộ 25 yêu cầu chức năng (FR) trong đặc tả SRS v1.1:

| Yêu cầu | Tóm tắt yêu cầu | Mã ca phủ yêu cầu này | Số ca |
|---|---|---|---|
| FR-01.1 | Form nhập thông tin đăng ký | CHƯA PHỦ | 0 |
| FR-01.2 | Họ tên bắt buộc khi đăng ký | CHƯA PHỦ | 0 |
| FR-01.3 | Tuổi đăng ký từ 18 đến 100 | TC-65130239-01, TC-65130239-02, TC-65130239-03, TC-65130239-04, TC-65130239-05 | 5 |
| FR-01.4 | Mật khẩu 8–20 ký tự, có chữ và số | TC-65130239-06, TC-65130239-07, TC-65130239-08, TC-65130239-09, TC-65130239-10, TC-65130239-11, TC-65130239-12 | 7 |
| FR-01.5 | Email đúng định dạng và không trùng | CHƯA PHỦ | 0 |
| FR-01.6 | Thông báo "Đăng ký thành công" | CHƯA PHỦ | 0 |
| FR-02.1 | Đăng nhập bằng email và mật khẩu | TC-65130239-29 | 1 |
| FR-02.2 | Báo lỗi khi sai thông tin đăng nhập | TC-65130239-30 | 1 |
| FR-02.3 | Khóa tài khoản sau 3 lần sai liên tiếp; reset khi đúng | TC-65130239-31, TC-65130239-32, TC-65130239-33 | 3 |
| FR-02.4 | Khóa trong 15 phút, từ chối đăng nhập, tự mở khóa | TC-65130239-34, TC-65130239-35, TC-65130239-36 | 3 |
| FR-03.1 | Quyền thêm sản phẩm vào giỏ hàng | CHƯA PHỦ | 0 |
| FR-03.2 | Số lượng mỗi SP là số nguyên từ 1 đến 99 | TC-65130239-13, TC-65130239-14, TC-65130239-15, TC-65130239-16, TC-65130239-17 | 5 |
| FR-03.3 | Cập nhật số lượng nếu SP đã có trong giỏ | CHƯA PHỦ | 0 |
| FR-03.4 | Tổng số lượng tất cả SP trong giỏ ≤ 200 | TC-65130239-18, TC-65130239-19, TC-65130239-20 | 3 |
| FR-03.5 | Xóa sản phẩm khỏi giỏ hàng | CHƯA PHỦ | 0 |
| FR-03.6 | Báo lỗi khi thêm SP không tồn tại hoặc hết hàng | CHƯA PHỦ | 0 |
| FR-04.1 | Phí vận chuyển tiêu chuẩn 20k / 35k | TC-65130239-21, TC-65130239-22 | 2 |
| FR-04.2 | Miễn phí ship đơn từ 500.000đ trở lên | TC-65130239-23, TC-65130239-24 | 2 |
| FR-04.3 | Miễn phí ship cho thành viên VIP | TC-65130239-25, TC-65130239-26 | 2 |
| FR-04.4 | Hiển thị phí vận chuyển trước khi xác nhận | CHƯA PHỦ | 0 |
| FR-05.1 | Quy trình đặt hàng COD và địa chỉ | CHƯA PHỦ | 0 |
| FR-05.2 | Thành viên thường không được giảm giá | TC-65130239-21, TC-65130239-22, TC-65130239-23, TC-65130239-24, TC-65130239-28 | 5 |
| FR-05.3 | VIP giảm 5%; xét freeship theo tạm tính trước giảm | TC-65130239-25, TC-65130239-26, TC-65130239-27 | 3 |
| FR-05.4 | Xóa giỏ và gửi email xác nhận sau khi đặt | CHƯA PHỦ | 0 |
| FR-05.5 | Hủy đơn hàng khi ở trạng thái "Chờ xác nhận" | CHƯA PHỦ | 0 |

### Phân loại các yêu cầu chưa được phủ và lý do:
1. **Ngoài phạm vi 4 trường dữ liệu thực hành của Buổi 2:**
   * `FR-01.1` (Form đăng ký chung), `FR-01.2` (Họ tên bắt buộc), `FR-01.5` (Email trùng): Đề bài chỉ yêu cầu thiết kế ca cho 2 trường là Tuổi và Mật khẩu.
2. **Không thuộc 3 kỹ thuật thực hành hôm nay (EP/BVA, DT, ST):**
   * `FR-01.6`, `FR-03.1`, `FR-03.3`, `FR-03.5`, `FR-03.6`, `FR-04.4`, `FR-05.1`, `FR-05.4`: Thuộc nhóm kiểm thử chức năng giao diện luồng cơ bản (Functional UI/Flow testing) hoặc kiểm thử thông báo hiển thị, không áp dụng bảng phân hoạch/bảng quyết định/chuyển trạng thái.
3. **Ngoài phạm vi Buổi 2 (thuộc bài thực hành khác):**
   * `FR-05.5` (Hủy đơn hàng): Cần thiết kế sơ đồ chuyển trạng thái riêng cho vòng đời đơn hàng, nằm ngoài phạm vi đăng nhập và giỏ hàng của buổi này.

**Tổng kết độ phủ yêu cầu:**
* **Độ phủ theo 19 yêu cầu trọng tâm của bài thực hành:** **13 / 19** yêu cầu (**68.4%**).
* **Độ phủ trên toàn bộ 25 yêu cầu chức năng (FR) của SRS v1.1:** **13 / 25** yêu cầu (**52.0%**).

## 3. Tự đánh giá

**3.1. Bộ ca kiểm thử có ca nào thừa không (hai ca cùng một lớp tương đương)?**  
Không có ca thừa. Các ca cùng thuộc khoảng hợp lệ như TC-02 (tuổi 18) và TC-03 (tuổi 100) là các ca kiểm tra giá trị biên (BVA) bắt buộc. Ở trường số lượng, ca TC-17 kiểm tra riêng lớp số không phải số nguyên (1.5), đảm bảo mỗi lớp tương đương có ca đại diện độc lập mà không bị trùng lặp.

**3.2. Kỹ thuật nào chiếm nhiều thời gian nhất? Vì sao?**  
Bảng quyết định (DT) chiếm nhiều thời gian nhất vì phải lập bảng đầy đủ 8 luật, tính chính xác 4 con số (tạm tính, giảm giá, phí vận chuyển, tổng tiền) cho mỗi luật, sau đó rút gọn bằng kỹ thuật *don't care* và giải thích căn cứ. Việc kết hợp các sản phẩm trong MiniShop để tạo mức tạm tính quanh ngưỡng 500.000đ cũng đòi hỏi tính toán kỹ.

**3.3. Nếu chỉ được chạy 5 ca trong toàn bộ bộ ca, sẽ chọn 5 ca nào? Vì sao?**  
Chọn: **TC-65130239-02** (biên tuổi 18), **TC-65130239-07** (mật khẩu quá ngắn), **TC-65130239-23** (biên miễn phí ship 500.000đ), **TC-65130239-29** (đăng nhập đúng cơ bản), và **TC-65130239-32** (khóa tài khoản sau 3 lần sai liên tiếp).  
*Lý do:* 5 ca này bao quát cả 3 kỹ thuật (BVA, DT, ST), phủ các chức năng cốt lõi có rủi ro cao nhất về bảo mật đăng nhập, tính toán tài chính đơn hàng và điều kiện tạo tài khoản.
