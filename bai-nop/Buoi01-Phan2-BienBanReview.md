# BIÊN BẢN REVIEW TÀI LIỆU YÊU CẦU

## Thông tin chung

| Mục | Nội dung |
|---|---|
| Họ tên | Phạm Thanh Bình |
| MSSV | 65130239 |
| Tài liệu được review | MSN-SRS – Đặc tả yêu cầu MiniShop NTU, phiên bản 1.0 |
| Loại review | Review theo checklist (cá nhân) |
| Ngày | 27/9/2026|
| Bước 1 – Khởi động | từ 9:45 đến 9:50 |
| Bước 2 – Đọc lần 1 (theo trình tự) | từ 9:50 đến 10:20 |
| Bước 3 – Đọc lần 2 (đối chiếu chéo) | từ 10:20 đến 10:40 |
| Bước 4 – Hoàn thiện biên bản | từ 10:40 đến 11:00 |

## Danh sách lỗi

Loại lỗi: MƠ HỒ · MÂU THUẪN · THIẾU · KHÔNG KIỂM THỬ ĐƯỢC · KHÔNG KHẢ THI · THUẬT NGỮ · SAI SỐ LIỆU
Mức độ: Major · Minor

| STT | Vị trí (mã yêu cầu / mục) | Mô tả lỗi | Mã checklist | Loại lỗi | Mức độ | Tìm thấy ở lần đọc (1/2) | Đề xuất sửa |
|---|---|---|---|---|---|---|---|
| 1 | Mục 2.2 và FR-01.3 | Mục 2.2 quy định người đăng ký phải từ 18 tuổi trở lên (≥ 18), trong khi FR-01.3 ghi "trên 18 tuổi" (> 18). Mâu thuẫn tại giá trị biên đúng 18 tuổi. | CL-02 | MÂU THUẪN | Major | 2 | Thống nhất điều kiện tuổi, ví dụ sửa FR-01.3 thành "Người dùng từ 18 tuổi trở lên (tuổi ≥ 18) mới được đăng ký". |
| 2 | FR-01.4 | Yêu cầu mật khẩu phải "đủ mạnh để đảm bảo an toàn" nhưng không quy định tiêu chí cụ thể, dẫn đến cách hiểu và kiểm thử khác nhau. | CL-01 | MƠ HỒ | Major | 1 | Quy định cụ thể: mật khẩu từ 8 đến 20 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt. |
| 3 | FR-01.1, FR-01.2 | FR-01.1 yêu cầu nhập họ tên, email, tuổi, mật khẩu nhưng FR-01.2 chỉ bắt buộc họ tên; chưa quy định tính bắt buộc của các trường còn lại và kiểu dữ liệu của tuổi. | CL-03 | THIẾU | Major | 1 | Xác định rõ các trường bắt buộc (email, tuổi, mật khẩu); bổ sung quy định tuổi là số nguyên dương. |
| 4 | FR-02.3 và NFR-03 | FR-02.3 quy định tài khoản bị khóa sau 3 lần đăng nhập sai liên tiếp, trong khi NFR-03 lại quy định khóa sau 5 lần đăng nhập sai. | CL-02 | MÂU THUẪN | Major | 2 | Thống nhất một số lần đăng nhập sai duy nhất trong toàn bộ tài liệu; đồng thời bổ sung thời gian khóa hoặc cơ chế mở khóa. |
| 5 | FR-03.4 | Cụm từ "chứa một số lượng sản phẩm hợp lý" không xác định số lượng cụ thể, khiến yêu cầu khó hiểu và khó kiểm thử. | CL-01 | MƠ HỒ | Minor | 1 | Quy định rõ giới hạn số lượng sản phẩm giỏ hàng được phép chứa, ví dụ: tối đa 50 loại sản phẩm và tổng số lượng không vượt quá 200. |
| 6 | FR-05.3, Mục 1.3 và Mục 2.1 | Sử dụng thuật ngữ "Khách hàng thân thiết" chưa được định nghĩa trong Mục 1.3 và không nằm trong các nhóm người dùng được nêu ở Mục 2.1. | CL-06 | THUẬT NGỮ | Major | 1 | Bổ sung định nghĩa "Khách hàng thân thiết", nêu rõ điều kiện đạt được và làm rõ thuật ngữ này đồng nghĩa với "Thành viên VIP" hay là nhóm riêng. |
| 7 | FR-05.5 | Quy định thành viên có thể hủy đơn hàng nhưng không nêu rõ đơn hàng ở trạng thái nào được phép hủy, thời hạn hủy và trạng thái sau khi hủy. | CL-03 | THIẾU | Major | 1 | Bổ sung điều kiện hủy đơn, thời hạn cho phép hủy và trạng thái đơn sau khi hủy, ví dụ: chỉ được hủy khi đơn ở trạng thái "Chờ xác nhận" và sau đó chuyển thành "Đã hủy". |
| 8 | UC-03 (Bước 3, 4) và FR-05 | UC-03 có bước nhập mã giảm giá và hiển thị số tiền giảm, nhưng các FR chưa mô tả cách kiểm tra tính hợp lệ, điều kiện áp dụng và xử lý mã giảm giá. | CL-08 | THIẾU | Major | 2 | Bổ sung yêu cầu chức năng về mã giảm giá: cấu trúc mã, kiểm tra hạn dùng, điều kiện áp dụng và cách tính khoản giảm trừ vào đơn hàng. |
| 9 | Phụ lục A (Dòng #2) và FR-04.1 | Dòng #2 của Phụ lục A ghi phí vận chuyển ngoại thành là 30.000 VNĐ, không khớp với FR-04.1 quy định phí ngoại thành là 35.000 VNĐ. | CL-07 | SAI SỐ LIỆU | Major | 2 | Thống nhất số liệu giữa hai phần. Nếu FR-04.1 đúng thì sửa phí vận chuyển dòng #2 của Phụ lục A từ 30.000 VNĐ thành 35.000 VNĐ. |
| 10 | Phụ lục A (Dòng #3) và FR-04.2 | FR-04.2 quy định miễn phí ship khi tạm tính "trên 500.000 VNĐ", nhưng Phụ lục A dòng #3 có tạm tính đúng 500.000 VNĐ và phí ship ghi 0 VNĐ. | CL-02 | MÂU THUẪN | Major | 2 | Làm rõ mốc 500.000 VNĐ: nếu đúng 500.000 VNĐ được miễn phí thì sửa FR-04.2 thành "từ 500.000 VNĐ trở lên"; nếu phải trên 500.000 VNĐ thì sửa phí ship ở Phụ lục A. |
| 11 | NFR-01 | Yêu cầu hệ thống "phản hồi nhanh với mọi thao tác" nhưng không quy định thời gian phản hồi tối đa, không có tiêu chí khách quan để đo lường và kiểm thử. | CL-04 | KHÔNG KIỂM THỬ ĐƯỢC | Minor | 1 | Quy định thời gian phản hồi định lượng cụ thể, ví dụ: thời gian tải trang và xử lý dữ liệu không vượt quá 2 giây trong điều kiện mạng tiêu chuẩn. |
| 12 | NFR-02 | Yêu cầu hệ thống "hoạt động 100% thời gian và không bao giờ xảy ra lỗi" mang tính tuyệt đối, không khả thi về mặt kỹ thuật và chi phí vận hành. | CL-05 | KHÔNG KHẢ THI | Major | 1 | Điều chỉnh thành chỉ tiêu sẵn sàng thực tế, ví dụ: độ sẵn sàng đạt tối thiểu 99,5% mỗi tháng, không tính thời gian bảo trì định kỳ có thông báo trước. |
| 13 | FR-01.5 | Yêu cầu email "phải đúng định dạng" nhưng không nêu rõ tiêu chí hợp lệ, dẫn đến khó xác định chính xác dữ liệu hợp lệ và thiết kế ca kiểm thử tương ứng. | CL-01 | MƠ HỒ | Minor | 1 | Quy định rõ tiêu chí định dạng email hợp lệ, ví dụ: phải có phần tên người dùng, ký tự @ và tên miền hợp lệ; đồng thời thống nhất tiêu chí kiểm tra với nhóm phát triển và kiểm thử. |
| 14 | NFR-04 | Yêu cầu "hiển thị tốt trên màn hình có chiều rộng từ 360px trở lên" nhưng không định nghĩa cụ thể thế nào là "hiển thị tốt", nên chưa đủ cơ sở để kiểm thử giao diện thống nhất. | CL-04 | KHÔNG KIỂM THỬ ĐƯỢC | Minor | 1 | Bổ sung tiêu chí kiểm thử cụ thể, ví dụ: không xuất hiện thanh cuộn ngang, không bị che khuất nội dung chính và các thành phần giao diện không bị chồng lấn ở chiều rộng từ 360px trở lên. |

## Thống kê

| Loại lỗi | Số lượng |
|---|---:|
| MƠ HỒ | 3 |
| MÂU THUẪN | 3 |
| THIẾU | 3 |
| KHÔNG KIỂM THỬ ĐƯỢC | 2 |
| KHÔNG KHẢ THI | 1 |
| THUẬT NGỮ | 1 |
| SAI SỐ LIỆU | 1 |
| **Tổng** | **14** |
| Trong đó Major / Minor | **10 Major / 4 Minor** |

## Các điểm cần hỏi lại BA (em chưa chắc ý đồ tác giả)

1. Điều kiện tuổi đăng ký tài khoản: Người đúng 18 tuổi có được phép đăng ký hay không? Mục 2.2 ghi "từ 18 tuổi trở lên" nhưng FR-01.3 lại ghi "trên 18 tuổi".
2. Thuật ngữ "Khách hàng thân thiết": Nhóm này có đồng nhất với "Thành viên VIP" ở Mục 2.1 không, hay là một nhóm riêng? Nếu là nhóm riêng thì tiêu chí để trở thành "Khách hàng thân thiết" là gì?
3. Mốc miễn phí vận chuyển: Đơn hàng có giá trị tạm tính đúng 500.000 VNĐ có được miễn phí vận chuyển hay không? FR-04.2 và Phụ lục A dòng #3 đang thể hiện khác nhau.
4. Cơ chế khóa tài khoản: Hệ thống sẽ khóa tài khoản sau 3 lần hay 5 lần đăng nhập sai liên tiếp? Sau khi bị khóa thì thời gian khóa hoặc cơ chế mở khóa như thế nào?

## Kết luận review

Đánh dấu một lựa chọn:

- [ ] **Chấp nhận** – tài liệu dùng được ngay
- [ ] **Chấp nhận có điều kiện** – dùng được sau khi sửa các lỗi đã nêu, không cần review lại
- [x] **Review lại** – phải sửa và tổ chức review lần 2

Lý do: 

## Tự đánh giá (3–5 câu)

1. Lần đọc thứ hai giúp em tìm thêm 5 lỗi (STT 1, 4, 8, 9, 10), chủ yếu là MÂU THUẪN, THIẾU và SAI SỐ LIỆU khi đối chiếu chéo các phần tài liệu.
2. Nếu review theo nhóm, các lỗi MÂU THUẪN, THIẾU, THUẬT NGỮ và SAI SỐ LIỆU sẽ dễ phát hiện hơn vì nhiều Reviewer có các góc nhìn khác nhau và Author có thể giải thích ngay ý đồ yêu cầu.
3. Lần sau em sẽ lập bảng đối chiếu tuổi, số lần đăng nhập sai, ngưỡng tiền, phí vận chuyển và thuật ngữ ngay từ vòng đọc đầu để phát hiện lỗi sớm hơn.

