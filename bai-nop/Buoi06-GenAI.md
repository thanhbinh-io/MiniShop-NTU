# BUỔI 6 – PHẢN BIỆN CA KIỂM THỬ DO GEN-AI SINH RA

- **Họ tên:** Phạm Thanh Bình
- **MSSV:** 65130239

## 1. Nguồn bộ ca được phản biện

Đánh dấu một lựa chọn:

- [x] Dùng bộ ca có sẵn trong `docs/Buoi06-TestCaseDoAISinh.md`, đã chép vào `tests/gen-ai/ai-sinh.test.js`
- [ ] Tự sinh bằng công cụ: …………… (ghi rõ tên công cụ, phiên bản và câu lệnh đã dùng)

Nếu tự sinh, dán nguyên văn câu lệnh và kết quả vào phụ lục cuối file. Số ca phải từ 8 trở lên.

## 2. Dự đoán trước khi chạy, và kết quả thật

Đọc `src/services/shipping.js` và mục FR-04 của SRS v1.2, **dự đoán trước** ca nào sẽ đỏ. Sau đó chạy `npm run test:ai` và ghi kết quả thật vào cột bên cạnh.

> Giữ nguyên phần dự đoán kể cả khi dự đoán sai. Chỗ lệch giữa hai cột là chỗ đáng học nhất.

| Mã ca | Dự đoán (xanh/đỏ) | Kết quả thật | Lệch? |
|---|---|---|---|
| AI-01 | xanh | xanh | Không |
| AI-02 | xanh | xanh | Không |
| AI-03 | xanh | xanh | Không |
| AI-04 | xanh | xanh | Không |
| AI-05 | xanh | xanh | Không |
| AI-06 | xanh | xanh | Không |
| AI-07 | xanh | xanh | Không |
| AI-08 | xanh | xanh | Không |
| AI-09 | xanh | xanh | Không |
| AI-10 | đỏ | đỏ | Không |
| AI-11 | đỏ | đỏ | Không |

| Chỉ số | Giá trị |
|---|---|
| Tổng số ca | 11 |
| Số ca đạt | 9 |
| Số ca thất bại | 2 |
| Số ca dự đoán đúng | 11 |

## 3. Phản biện từng ca

Phân loại mỗi ca theo **đúng một** trong bốn nhãn:

- **ĐÚNG** – ca hợp lệ, kết quả mong đợi đúng theo SRS v1.2;
- **SAI KẾT QUẢ** – AI bịa ra hành vi mà hệ thống không có (hallucination);
- **THỪA** – trùng lớp tương đương với ca khác, không tăng khả năng bắt lỗi;
- **LUÔN XANH** – ca không thể thất bại dù mã nguồn sai, nên vô giá trị.

Hai lưu ý khi phân loại: một ca **đỏ** không tự động là `SAI KẾT QUẢ` — phải xác định bên nào sai, ca kiểm thử hay sản phẩm; một ca **xanh** không tự động là `ĐÚNG` — ca luôn xanh cũng xanh. Với nhãn `THỪA`, phải chỉ rõ trùng với ca nào.

| Mã ca | Phân loại | Giải thích | Căn cứ (SRS v1.2 hoặc mã nguồn) |
|---|---|---|---|
| AI-01 | ĐÚNG | Kiểm tra đúng mức phí nội thành 20.000đ cho đơn hàng thông thường dưới 500k. | SRS v1.2 mục FR-04.1 và `shipping.js:4` |
| AI-02 | ĐÚNG | Kiểm tra đúng mức phí ngoại thành 35.000đ cho đơn hàng thông thường dưới 500k. | SRS v1.2 mục FR-04.1 và `shipping.js:5` |
| AI-03 | THỪA | Trùng hoàn toàn lớp tương đương với AI-01: cùng là khách THUONG, khu vực nội thành, giá trị đơn trong khoảng (0, 500k), đều trả về 20.000đ. | Cùng lớp tương đương với AI-01 (FR-04.1) |
| AI-04 | THỪA | Trùng lớp tương đương với AI-01 và AI-03: không kiểm tra thêm được giá trị biên hay điều kiện rẽ nhánh mới nào. | Cùng lớp tương đương với AI-01 và AI-03 (FR-04.1) |
| AI-05 | ĐÚNG | Kiểm tra trường hợp đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển (0đ). | SRS v1.2 mục FR-04.2 và `shipping.js:20` |
| AI-06 | ĐÚNG | Kiểm tra giá trị biên dưới ngưỡng miễn phí (499.999đ) vẫn phải tính phí 20.000đ. | SRS v1.2 mục FR-04.2 và kỹ thuật phân tích giá trị biên BVA |
| AI-07 | ĐÚNG | Kiểm tra thành viên VIP được miễn phí vận chuyển (0đ) cho đơn hàng bất kỳ. | SRS v1.2 mục FR-04.3 và `shipping.js:17-19` |
| AI-08 | LUÔN XANH | Khẳng định `toBeGreaterThanOrEqual(0)` quá lỏng; dù hàm tính sai lệch ra 1đ, 50.000đ hay 1.000.000đ thì ca vẫn luôn xanh vô giá trị. | Khẳng định yếu, không đối chiếu giá trị xác định từ FR-04.1 |
| AI-09 | LUÔN XANH | Khẳng định `toBeDefined()` không kiểm tra bất kỳ giá trị nghiệp vụ nào; miễn không trả về `undefined` là xanh. | Khẳng định yếu, vi phạm nguyên tắc kiểm thử ba mức |
| AI-10 | SAI KẾT QUẢ | AI bịa ra hành vi "khu vực không hợp lệ trả về phí mặc định 20.000đ". Thực tế hàm ném ngoại lệ Error('Khu vực giao hàng không hợp lệ'). | `shipping.js:11-13` và SRS mục FR-04 (chỉ có noi-thanh và ngoai-thanh) |
| AI-11 | SAI KẾT QUẢ | AI tự suy diễn "tạm tính bằng 0 thì không tính phí (0đ)". Theo SRS và code, đơn hàng 0đ (< 500k) vẫn phải trả phí 20.000đ bình thường. | SRS v1.2 mục FR-04.1, FR-04.2 (ngưỡng miễn phí từ 500k) |

**Tổng hợp:** ĐÚNG 5 / SAI KẾT QUẢ 2 / THỪA 2 / LUÔN XANH 2

## 4. Những gì AI bỏ sót

Đối chiếu với bộ ca của chính mình ở Buổi 2 và Buổi 3.

| Trường hợp bị bỏ sót | Căn cứ trong SRS v1.2 | Hậu quả nếu không kiểm |
|---|---|---|
| Giá trị biên chính xác tại ngưỡng miễn phí: `subtotal = 500000` (đạt đúng 500.000đ) | SRS v1.2 mục FR-04.2 ("từ 500.000đ trở lên") | Nếu lập trình viên viết nhầm điều kiện thành `subtotal > 500000` thay vì `>= 500000`, khách hàng có đơn đúng 500.000đ sẽ bị thu phí sai quy định. |
| Thành viên VIP ở khu vực ngoại thành (`zone = 'ngoai-thanh'`, `customerType = 'VIP'`) | SRS v1.2 mục FR-04.3 ("ở mọi khu vực, không phụ thuộc tạm tính") | Chưa xác minh được tính năng VIP áp dụng đúng cho khu vực ngoại thành (AI mới chỉ kiểm VIP ở nội thành tại AI-07). |
| Giá trị tạm tính không hợp lệ: `subtotal` là số âm, `NaN`, hoặc sai kiểu dữ liệu (chuỗi, null) | Đặc tả tham số hàm và xử lý ngoại lệ trong `shipping.js:14-16` | Bỏ sót nhánh bắt lỗi dữ liệu đầu vào không hợp lệ của hàm tính toán phí, dẫn đến rủi ro lỗi runtime không được xử lý. |
| Gọi hàm với đối tượng rỗng `{}` hoặc không truyền tham số | Giá trị mặc định tham số hàm `calcShippingFee({ subtotal, zone, customerType } = {})` | Không kiểm tra được hành vi ném ngoại lệ khi thiếu tham số bắt buộc. |

## 5. Kiểm chứng lời tuyên bố của AI

AI khẳng định bộ ca của nó *"đạt 100% độ bao phủ câu lệnh và có thể dùng ngay trong dự án"*.

Đo thật bằng `npm run coverage:ai`.

| Chỉ số | AI tuyên bố | Đo được thực tế |
|---|---|---|
| Bao phủ câu lệnh | 100% | 91.66% |
| Bao phủ nhánh | (không nêu) | 81.81% |
| Dòng chưa được phủ | (không nêu) | Dòng 15 (`throw new Error('Giá trị đơn hàng không hợp lệ')`) |

**5.1.** Nhận xét về độ tin cậy của lời tuyên bố này:
- Lời tuyên bố của Gen-AI là **sai sự thật và gây hiểu lầm nghiêm trọng (ảo giác / hallucination)**. AI tuyên bố 100% statement coverage nhưng thực tế chỉ đạt 91.66%, và nhánh kiểm tra `subtotal` không hợp lệ (dòng 15) hoàn toàn chưa được chạm tới.
- Bộ ca cũng không thể "dùng ngay trong dự án" như quảng cáo, vì nó có 2 ca thất bại (AI-10, AI-11) do AI tự bịa kết quả mong đợi, nếu đưa vào CI sẽ làm đỏ toàn bộ quy trình một cách oan uổng.

**5.2.** Trong bộ ca này có ca thuộc nhãn `LUÔN XANH`. Những ca đó có làm **tăng** độ bao phủ hay không? Điều đó nói lên hạn chế gì của việc dùng độ bao phủ làm thước đo chất lượng bộ kiểm thử?
- **Có.** Các ca `LUÔN XANH` như AI-08 và AI-09 vẫn thực thi qua các dòng code của hàm `calcShippingFee`, do đó công cụ đo độ bao phủ (Jest coverage) vẫn tính các dòng đó đã được duyệt qua và làm tăng tỷ lệ phần trăm bao phủ.
- **Hạn chế của độ bao phủ:** Độ bao phủ (Code Coverage) chỉ đo xem **dòng code nào đã được chạy qua**, chứ **hoàn toàn không đo xem kết quả trả về có được kiểm tra đúng đắn hay không**. Một bộ kiểm thử có thể đạt 100% độ bao phủ nhưng chứa toàn các khẳng định rỗng (`toBeDefined()`, `true === true`) và không phát hiện được bất kỳ lỗi logic nào. Do đó, độ bao phủ chỉ là điều kiện cần, không thể là thước đo duy nhất để đánh giá chất lượng bộ kiểm thử.

## 6. Kết luận

**6.1.** Trong 11 ca, bao nhiêu ca **dùng được ngay**, bao nhiêu ca **phải sửa**, bao nhiêu ca **nên bỏ**? Tính tỷ lệ dùng được. Viết thêm 4–6 dòng như một nhận xét review nếu nhận bộ ca này từ một đồng nghiệp mới vào nghề.
- **Thống kê:**
  - Dùng được ngay: **5 ca** (AI-01, AI-02, AI-05, AI-06, AI-07).
  - Phải sửa: **2 ca** (AI-10 sửa thành kiểm tra ném ngoại lệ; AI-11 sửa kết quả mong đợi thành 20.000đ).
  - Nên bỏ: **4 ca** (AI-03, AI-04 do trùng lớp tương đương thừa thãi; AI-08, AI-09 do khẳng định yếu, luôn xanh vô giá trị).
  - **Tỷ lệ dùng được ngay:** 5 / 11 ≈ **45.45%**.
- **Nhận xét review:**
  > "Bộ ca kiểm thử của bạn đã phủ được các luồng nghiệp vụ cơ bản và có chú ý đến giá trị biên (AI-06). Tuy nhiên, cần loại bỏ các ca kiểm thử trùng lặp lớp tương đương (AI-03, AI-04) và các khẳng định quá yếu như `toBeDefined()`, `toBeGreaterThanOrEqual(0)` vì chúng không mang lại giá trị phát hiện lỗi. Đặc biệt lưu ý ca AI-10 và AI-11 đang tự suy diễn hành vi không có trong SRS v1.2, làm sai lệch kết quả thực tế. Bạn hãy bổ sung thêm ca kiểm thử tại đúng ngưỡng 500.000đ và các ca kiểm thử ngoại lệ dữ liệu đầu vào trước khi tích hợp vào dự án."

**6.2.** Giữa hai việc — tự viết bộ ca từ đầu, và sửa bộ ca do AI sinh ra — việc nào mất ít công hơn cho hàm `calcShippingFee`? Trả lời **có số liệu** (số ca phải đọc, số ca phải sửa, số ca phải viết thêm), không trả lời theo cảm nhận.
- **Tự viết từ đầu:**
  - Thiết kế bộ ca chuẩn từ SRS gồm 6 ca (nội thành, ngoại thành, đúng 500k, trên 500k, VIP ngoại thành, lỗi zone/subtotal).
  - Công sức: Thiết kế 6 ca, viết 6 ca mã nguồn trong khoảng 10–15 phút.
- **Sửa bộ ca do AI sinh ra:**
  - Phải đọc và rà soát kỹ lưỡng 11 ca do AI sinh ra.
  - Phải phân tích tìm nguyên nhân và sửa 2 ca sai kết quả (AI-10, AI-11).
  - Phải xóa bỏ 4 ca (2 ca thừa, 2 ca luôn xanh).
  - Phải viết bổ sung ít nhất 3 ca bị thiếu (ngưỡng 500k, VIP ngoại thành, ngoại lệ đầu vào).
- **Kết luận:** Đối với một hàm nghiệp vụ ngắn và rõ ràng như `calcShippingFee`, việc **tự viết từ đầu mất ít công hơn**. Việc dùng AI đòi hỏi kiểm thử viên phải đọc hiểu cả 11 ca, mất công gỡ lỗi các ảo giác (hallucination) mà AI bịa ra và vẫn phải tự viết thêm các ca biên quan trọng.

**6.3.** Mục 0.3 của đề bài đã loại `tests/gen-ai/` khỏi `npm test`. Sau khi phản biện xong, nêu **điều kiện cụ thể** để một bộ ca do AI sinh ra được phép đưa vào quy trình tự động.
Một bộ ca do AI sinh ra chỉ được phép đưa vào quy trình tự động khi thỏa mãn đầy đủ 4 điều kiện:
1. **Được kiểm thử viên rà soát thủ công (Human-in-the-loop review):** Từng ca kiểm thử phải được đối chiếu trực tiếp với tài liệu đặc tả yêu cầu (SRS), loại bỏ toàn bộ các khẳng định yếu (luôn xanh) và ca thừa.
2. **Khẳng định đúng hành vi hệ thống:** 100% ca kiểm thử được giữ lại phải có kết quả mong đợi chính xác theo đặc tả; không chứa bất kỳ ca nào bị ảo giác (hallucination).
3. **Đã chạy kiểm chứng trên môi trường thật:** Bộ ca phải chạy thử và đạt kết quả kiểm thử mong đợi (hoặc phát hiện đúng bug đã được xác nhận).
4. **Bổ sung đủ các trường hợp biên và ngoại lệ:** Đảm bảo không bỏ sót các giá trị biên tại ngưỡng và các nhánh ném ngoại lệ dữ liệu đầu vào.
