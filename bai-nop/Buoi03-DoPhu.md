# BUỔI 3 – BÁO CÁO BAO PHỦ MÃ NGUỒN

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Kết quả đo lần đầu (chỉ với ca của Phần 1)

Chạy `npm run coverage` **trước khi** bổ sung ca ở Phần 3.

| File | % Statements | % Branch | % Functions |
|---|---|---|---|
| src/services/shipping.js | 91.66 | 84.61 | 100 |
| src/services/cart.js | 65.62 | 53.33 | 70 |
| src/services/registration.js | 60 | 65.38 | 50 |
| src/services/auth.js | 53.33 | 37.5 | 100 |

## 2. Các nhánh chưa được phủ

Mở `coverage/lcov-report/index.html` để xem chi tiết. Liệt kê các nhánh chưa phủ của hai file cần đạt 100%.

| File | Dòng | Nhánh chưa phủ (mô tả) | Vì sao bộ ca Phần 1 không chạm tới |
|---|---|---|---|
| src/services/shipping.js | 9 | Nhánh giá trị mặc định `{ subtotal, zone, customerType } = {}` khi gọi hàm không truyền đối số | Bộ ca nạp từ CSV luôn truyền đủ đối tượng tham số, không có ca nào gọi hàm không truyền tham số |
| src/services/shipping.js | 13 | Nhánh điều kiện `typeof subtotal !== 'number' \|\| subtotal < 0` đúng (ném lỗi `Giá trị đơn hàng không hợp lệ`) | Bộ ca Buổi 2 chỉ kiểm thử các giá trị tạm tính hợp lệ (từ 200.000đ đến 600.000đ), chưa kiểm thử giá trị âm hoặc kiểu dữ liệu không phải số |
| src/services/cart.js | 12 | Nhánh `!store.carts[email]` trong `getCart` (khởi tạo giỏ hàng mới cho email chưa từng có giỏ) | Ở Phần 1 chỉ chạy hàm `validateQuantity` độc lập; ca mẫu giỏ hàng dùng email cố định đã được làm trống sẵn qua `clearCart`, chưa gọi với email mới |
| src/services/cart.js | 21, 24 | Nhánh sản phẩm không tồn tại trong kho (`product` là null/undefined) trong `cartDetail` (gán `price = 0` và `name = '(không xác định)'`) | Ca mẫu ở Phần 1 chỉ thêm sản phẩm hợp lệ có ID 1 sẵn trong kho, chưa có ca nào thêm sản phẩm không tồn tại trong danh mục |
| src/services/cart.js | 35 | Nhánh `!validateQuantity(qty)` trong `addToCart` (trả về lỗi 400 'Số lượng phải là số nguyên từ 1 đến 99') | Ca mẫu ở Phần 1 chỉ gọi `addToCart` với số lượng hợp lệ (`qty = 2`); hàm `validateQuantity` chỉ được kiểm thử tách rời ở khối riêng |
| src/services/cart.js | 40 | Nhánh `if (line)` trong `addToCart` (cập nhật số lượng khi sản phẩm đã có sẵn trong giỏ) | Ca mẫu ở Phần 1 chỉ thêm sản phẩm vào giỏ rỗng lần đầu, chưa có ca kiểm thử thêm tiếp sản phẩm đã có trong giỏ |
| src/services/cart.js | 51 | Cả hàm `removeFromCart` gồm 2 nhánh: sản phẩm không có trong giỏ (`index === -1`) và xóa sản phẩm thành công | Phần 1 và ca mẫu chưa có ca kiểm thử nào gọi hàm `removeFromCart` |

## 3. Kết quả sau khi bổ sung ca

| File | % Statements | % Branch | % Functions |
|---|---|---|---|
| src/services/shipping.js | 100 | 100 | 100 |
| src/services/cart.js | 100 | 100 | 100 |

Số ca đã bổ sung: 9

## 4. Câu hỏi phân tích

**4.1.** Một hàm đạt 100% bao phủ câu lệnh nhưng chỉ 60% bao phủ nhánh. Điều đó nghĩa là gì? Cho ví dụ cụ thể từ mã nguồn MiniShop.

- **Ý nghĩa:** Bao phủ câu lệnh (Statement Coverage) 100% chỉ có nghĩa là mọi dòng lệnh trong hàm đều được thực thi ít nhất một lần. Tuy nhiên, một cấu trúc rẽ nhánh (như `if` không có `else`) có hai nhánh luồng điều khiển: điều kiện đúng (đi vào trong thân `if`) và điều kiện sai (bỏ qua `if`). Nếu các ca kiểm thử luôn làm điều kiện `true` và chạy vào trong thân `if`, thì 100% dòng lệnh vẫn được duyệt qua, nhưng nhánh điều kiện `false` chưa từng được kích hoạt. Vì vậy, bao phủ nhánh chỉ đạt 50% - 60%.
- **Ví dụ cụ thể từ MiniShop:** Trong `src/services/cart.js`, hàm `getCart(email)`:
```javascript
function getCart(email) {
  if (!store.carts[email]) {
    store.carts[email] = [];
  }
  return store.carts[email];
}
```
Nếu chỉ chạy các ca kiểm thử với email chưa từng có giỏ hàng, dòng `store.carts[email] = []` sẽ được chạy và dòng `return store.carts[email]` cũng được chạy -> đạt 100% bao phủ câu lệnh của hàm. Tuy nhiên, nhánh khi `store.carts[email]` đã tồn tại (điều kiện `if` nhận giá trị `false` và bỏ qua khối lệnh gán) không bao giờ được kiểm tra, do đó bao phủ nhánh chỉ đạt 50%.

**4.2.** Giả sử `calcShippingFee` đạt 100% bao phủ nhánh và tất cả ca đều xanh. Có thể kết luận hàm này không còn lỗi không? Giải thích.

- **Không thể kết luận hàm này không còn lỗi.**
- **Giải thích:**
  1. *Lỗi bỏ sót yêu cầu :* Bao phủ nhánh 100% chỉ chứng minh mọi nhánh rẽ hiện có trong mã nguồn đã được chạy qua, nhưng không chứng minh mã nguồn đã hiện thực đầy đủ mọi yêu cầu nghiệp vụ theo SRS v1.1. Nếu lập trình viên quên viết một quy tắc hoặc điều kiện nghiệp vụ, kiểm thử hộp trắng không thể phát hiện nhánh bị thiếu đó.
  2. *Bộ ca kiểm thử có thể giả định sai kết quả:* Nếu kiểm thử viên thiết kế kết quả mong đợi theo hành vi sai của mã nguồn thay vì theo SRS, các ca kiểm thử vẫn "xanh" và đạt 100% nhánh nhưng thực chất hệ thống vẫn bị lỗi nghiệp vụ.
  3. *Lỗi phối hợp dữ liệu và tương tác:* Hàm có thể chạy đúng khi gọi đơn lẻ nhưng gặp lỗi khi tích hợp với các dịch vụ khác (như giỏ hàng, đặt hàng), hoặc lỗi xử lý số thực / số lớn ngoài các giá trị biên đã kiểm thử.

**4.3.** Trong bốn file ở mục 1, file nào có bao phủ thấp nhất? Nếu chỉ còn thời gian viết thêm 3 ca kiểm thử, sẽ viết cho hàm nào và vì sao?

- **File có bao phủ thấp nhất:** `src/services/auth.js` (Statement coverage: 53.33%, Branch coverage: 37.5%).
- **Hàm được chọn để viết thêm 3 ca:** Hàm `login` trong `src/services/auth.js`.
- **Vì sao:**
  1. *Tầm quan trọng về bảo mật:* `auth.js` phụ trách xác thực và khóa tài khoản người dùng, là chốt chặn an ninh quan trọng nhất của hệ thống nhằm chống lại các cuộc tấn công dò mật khẩu (brute-force). Lỗi ở mô-đun này có mức độ rủi ro nghiêm trọng nhất.
  2. *Mức độ bao phủ hiện tại quá thấp:* Với chỉ 37.5% bao phủ nhánh, phần lớn các nhánh xử lý lỗi và bảo mật (nhập sai mật khẩu, tích lũy số lần sai, khóa tài khoản sau 3 lần sai liên tiếp, và chặn người dùng khi tài khoản đang bị khóa theo FR-02.2, FR-02.3, FR-02.4) hoàn toàn chưa được kiểm thử. Viết 3 ca cho hàm `login` sẽ nâng cao tối đa độ tin cậy an ninh cho hệ thống.
