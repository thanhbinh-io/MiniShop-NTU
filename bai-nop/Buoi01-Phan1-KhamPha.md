# BUỔI 1 – PHẦN 1: CÀI ĐẶT VÀ KHÁM PHÁ HỆ THỐNG

- **Họ tên: Phạm Thanh Bình** 
- **MSSV: 65130239** 
- **Lớp: 65.CNTT-1** 

## 1. Môi trường

| Mục | Kết quả |
|---|---|
| Phiên bản Node.js (`node -v`) | v24.21.0 |
| Phiên bản npm (`npm -v`) | 11.19.0 |
| Phiên bản Git (`git --version`) | git version 2.55.0.windows.5 |
| Hệ điều hành | Windows |
| Kết quả `npm run lint` (số error / warning) | (16/3) |

Ảnh chụp màn hình (chèn ảnh hoặc đặt file ảnh trong thư mục `bai-nop/hinh/` rồi dẫn link): D:\KTPM\sot357-65130239\bai-nop\hinh\65130239-server.png

- Trang web MiniShop NTU: http://localhost:3000
- Terminal đang chạy server: npm start

## 2. Kịch bản 1 – Đăng ký với tuổi 17

| Câu hỏi | Trả lời |
|---|---|
| Kết quả thực tế | Đăng ký thành công |
| Kết quả mong đợi (theo SRS, ghi rõ mục) | SRS FR-01.3 |
| Có phải failure không? Vì sao? | Có, vì theo SRS, người dùng phải trên 18 tuổi mới được đăng ký, nhưng hệ thống lại cho phép người 17 tuổi đăng ký |
| Defect nằm ở đâu (file, số dòng, đoạn mã) | src/services/registration.js, dòng 20, đoạn : } else if (ageNumber < 17 || ageNumber > 100) { |
| Error nào của con người có thể đã gây ra defect này? | Lập trình viên đã hiểu hoặc triển khai sai yêu cầu về độ tuổi tối thiểu, dẫn đến việc đặt điều kiện kiểm tra là < 17 thay vì điều kiện phù hợp với yêu cầu trong SRS |

## 3. Kịch bản 2 – Đơn hàng 500.000đ, nội thành

| Câu hỏi | Trả lời |
|---|---|
| Tạm tính | 500.000đ |
| Phí vận chuyển hệ thống tính | 20.000đ |
| Theo FR-04.2, phí đúng phải là | 20.000đ |
| Theo Phụ lục A, phí đúng phải là | 0đ |
| Hệ thống đúng hay sai? Có kết luận được không? Vì sao? | Không thể kết luận chắc chắn hệ thống đúng hay sai. Vì Theo FR-04.2, tạm tính trên 500.000đ mới được miễn phí còn phụ lục A lại quy định trường hợp tạm tính 500.000đ ở nội thành được miễn phí. Hai phần của SRS mâu thuẫn nhau.|
| Defect (nếu có) nằm ở đâu: mã nguồn hay tài liệu? | Defect nằm ở tài liệu SRS, cụ thể là sự không nhất quán giữa FR-04.2 và Phụ lục A. Chưa thể kết luận mã nguồn có defect vì chưa có một yêu cầu thống nhất để làm chuẩn đối chiếu. |

## 4. Kịch bản 3 – Tự khám phá

| Mục | Nội dung |
|---|---|
| Chức năng | Đăng ký tài khoản |
| Các bước thực hiện | 1.Vào Đăng ký <br> 2. Nhập họ tên bất kỳ, email mới, tuổi 20 và mật khẩu 21 ký tự <br> 3.Nhấn Đăng ký |
| Dữ liệu sử dụng |Họ tên: thanhbinh; Email: test21@ntu.edu.vn; Tuổi: 20; Mật khẩu: Matkhau12345678901234 |
| Kết quả mong đợi (căn cứ: mục nào của SRS) | Mật khẩu phải có từ 8 đến 20 ký tự |
| Kết quả thực tế | Đăng ký thành công |
| Nhận định (failure? mức độ?) | Có failure, nếu thực tế đăng ký thành công. Nguyên nhân là điều kiện trong code dùng pwd.length > 21 thay vì giới hạn tối đa 20. Mức độ Medium |
