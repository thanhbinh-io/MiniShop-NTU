# BUỔI 1 – PHẦN 3: PHÂN TÍCH TĨNH VỚI ESLINT

- **Họ tên: Phạm Thanh Bình** 
- **MSSV: 65130239** 

## 1. Kết quả chạy công cụ

Lệnh: `npm run lint:lab`

| Tổng số problem | Số error | Số warning |
|---|---|---|
| 19 | 16 | 3 |

Ảnh chụp kết quả: 

## 2. Bảng phân tích

Phân loại: **DEFECT** (chắc chắn gây sai/dừng chương trình) · **SMELL** (khó bảo trì, tiềm ẩn rủi ro) · **CHẤP NHẬN** (không cần sửa, giải thích lý do)

| STT | Dòng | Rule | Vấn đề (giải thích bằng lời của bạn) | Hậu quả nếu chạy chương trình | Phân loại | Cách sửa |
|---|---|---|---|---|---|---|
| 1 | 9:7 | no-unused-vars | Khai báo biến fs nhưng không sử dụng ở bất kỳ đâu trong file. | Làm mã nguồn dư thừa, gây khó đọc và tạo phụ thuộc không cần thiết. | SMELL | Xóa dòng const fs = require('fs'); |
| 2 | 14:3 | no-dupe-keys | Thuộc tính noiThanh bị khai báo lặp lại hai lần trong cùng một đối tượng cấu hình. | Giá trị khai báo phía sau sẽ ghi đè giá trị phía trước, có thể làm sai dữ liệu tính phí. | DEFECT | Đổi tên key thứ hai thành ngoaiThanh hoặc xóa thuộc tính bị trùng. |
| 3 | 21:5 | no-unused-vars | Khai báo và gán giá trị cho biến total nhưng biến này không được sử dụng ở các câu lệnh sau. | Kết quả tính toán bị bỏ phí và làm code khó đọc, khó bảo trì. | SMELL | Sử dụng biến total ở nơi cần thiết hoặc xóa phần khai báo không cần thiết. |
| 4 | 23:10 | no-undef | Sử dụng biến totl chưa từng được định nghĩa, có thể là lỗi gõ sai tên biến total. | Khi chạy đến dòng này có thể phát sinh ReferenceError: totl is not defined, làm chương trình dừng. | DEFECT | Sửa totl thành total. |
| 5 | 28:11 | eqeqeq | Sử dụng toán tử == thay vì ===, khiến JavaScript có thể tự động chuyển đổi kiểu dữ liệu khi so sánh. | Có thể cho kết quả so sánh sai logic, ví dụ 0 == '' trả về true. | SMELL | Thay == bằng ===. |
| 6 | 31:7 | no-cond-assign | Dùng toán tử gán = bên trong điều kiện if thay vì toán tử so sánh. | Giá trị biến bị thay đổi ngoài ý muốn, làm điều kiện và luồng xử lý bị sai. | DEFECT | Thay = bằng toán tử so sánh phù hợp, thường là ===. |
| 7 | 31:7 | no-constant-condition | Điều kiện của if tạo ra một giá trị cố định nên không thực sự kiểm tra dữ liệu đầu vào. | Một nhánh có thể luôn được thực hiện và nhánh còn lại không bao giờ được thực hiện. | DEFECT | Sửa thành biểu thức điều kiện dựa trên biến hoặc dữ liệu đầu vào thực tế. |
| 8 | 39:24 | valid-typeof | Chuỗi được dùng để so sánh với typeof không phải là tên kiểu dữ liệu hợp lệ trong JavaScript. | Điều kiện kiểm tra kiểu dữ liệu luôn cho kết quả false, khiến nhánh xử lý tương ứng không được thực hiện. | DEFECT | Sửa thành tên kiểu hợp lệ như string, number, function. |
| 9 | 42:7 | use-isnan | So sánh trực tiếp một giá trị với NaN bằng == hoặc ===. | Phép so sánh với NaN luôn cho kết quả sai vì NaN !== NaN, nên không phát hiện đúng dữ liệu không phải số. | DEFECT | Sử dụng Number.isNaN(...) để kiểm tra. |
| 10 | 54:5 | no-fallthrough | Một nhánh case trong switch không có break hoặc return để kết thúc. | Chương trình tiếp tục chạy xuống case tiếp theo, có thể làm kết quả xử lý sai. | DEFECT | Thêm break hoặc return vào cuối nhánh case nếu không chủ ý fallthrough. |
| 11 | 68:14 | no-dupe-else-if | Điều kiện của else if bị trùng với điều kiện đã kiểm tra ở nhánh phía trên. | Nhánh else if bị trùng không thể được thực hiện, làm một phần logic trở thành mã chết. | DEFECT | Sửa điều kiện để phản ánh đúng logic nghiệp vụ hoặc xóa nhánh bị trùng. |
| 12 | 72:3 | no-unreachable | Có câu lệnh được đặt sau return nên chương trình không thể chạy đến câu lệnh đó. | Câu lệnh phía sau return không bao giờ được thực thi, làm logic viết ra nhưng không có tác dụng. | SMELL | Xóa câu lệnh không thể thực thi hoặc di chuyển nó lên trước return nếu cần thực hiện. |
| 13 | 72:3 | no-console | Sử dụng console.log trong phần xử lý của chương trình. | Có thể làm xuất thông tin debug không cần thiết ra terminal và làm mã nguồn không phù hợp với quy chuẩn của dự án. | SMELL | Xóa console.log hoặc thay bằng cơ chế logging phù hợp của hệ thống. |
| 14 | 77:7 | no-unsafe-negation | Đặt ! trước toán hạng trái của toán tử in như !key in obj, khiến phép ! được thực hiện trước phép in. | JavaScript có thể kiểm tra một giá trị boolean với obj thay vì kiểm tra key không tồn tại trong obj, dẫn đến sai logic. | DEFECT | Viết !(key in obj) để phủ định toàn bộ phép kiểm tra. |
| 15 | 87:12 | no-unused-vars | Tham số ngoại lệ e trong catch (e) được khai báo nhưng không được sử dụng. | Tạo biến dư thừa và có thể gây hiểu nhầm rằng thông tin lỗi được sử dụng để xử lý hoặc log lỗi. | SMELL | Dùng catch {} nếu không cần thông tin lỗi, hoặc sử dụng e để xử lý hoặc log lỗi. |
| 16 | 87:15 | no-empty | Khối lệnh catch {} không có bất kỳ câu lệnh xử lý nào bên trong. | Lỗi có thể bị bỏ qua hoàn toàn, khiến sự cố khó phát hiện và khó gỡ lỗi. | SMELL | Thêm xử lý lỗi phù hợp hoặc ghi chú rõ việc bỏ qua lỗi là có chủ đích. |
| 17 | 92:1 | complexity | Hàm xepHangKhachHang có Cyclomatic Complexity bằng 9, cao hơn ngưỡng cho phép là 5. | Hàm có nhiều nhánh xử lý, làm code khó đọc, khó bảo trì và cần nhiều trường hợp kiểm thử hơn. | CHẤP NHẬN | Có thể giữ nguyên nếu độ phức tạp xuất phát từ logic nghiệp vụ cần thiết; hoặc tách hàm thành các hàm nhỏ hơn. |
| 18 | 116:3 | no-console | Sử dụng console.log để xuất thông tin ra terminal. | Tạo thông tin debug không cần thiết và có thể vi phạm quy chuẩn logging của dự án. | SMELL | Xóa console.log hoặc thay bằng cơ chế logging phù hợp. |
| 19 | 121:31 | no-unused-vars | Tham số kyHieu được khai báo trong hàm nhưng không được sử dụng trong thân hàm. | Làm chữ ký hàm dư thừa và gây hiểu nhầm rằng kyHieu có ảnh hưởng đến kết quả xử lý. | SMELL | Xóa tham số kyHieu nếu không cần thiết hoặc sử dụng nó trong logic nếu thực sự cần. |

## 3. Sau khi sửa

Kết quả `npm run lint:lab` sau khi sửa (ảnh chụp hoặc dán kết quả):

```
D:\KTPM\sot357-65130239\bai-nop\hinh\65130239-ketqua.png
```

## 4. Lỗi logic ESLint không phát hiện được

| STT | Hàm | Mô tả lỗi | Căn cứ (chú thích hàm / mục SRS) | Vì sao ESLint không phát hiện được? |
|---|---|---|---|---|
| 1 | tinhTongDon | Chú thích ghi "tạm tính − giảm giá + phí vận chuyển", nhưng code lại trừ phí vận chuyển bằng công thức tamTinh - giamGia - phi. | Chú thích ngay trên hàm; FR-05.2 trong SRS. | Đây là mã hợp lệ về cú pháp, ESLint không hiểu được ý nghĩa nghiệp vụ để biết phí vận chuyển phải được cộng hay trừ. |
| 2 | kiemTraSoLuong | Chú thích ghi "số nguyên từ 1 đến 99", nhưng hàm không kiểm tra qty có phải số nguyên hay không, nên giá trị như 1.5 hoặc abc vẫn có thể lọt qua. | Chú thích ngay trên hàm; FR-03.2 trong SRS. | Thiếu điều kiện kiểm tra số nguyên là vấn đề về logic nghiệp vụ, không phải mẫu lỗi cú pháp cố định mà ESLint có thể nhận diện. |

## 5. (Không bắt buộc) Nhận xét về phân tích tĩnh trong trình soạn thảo

