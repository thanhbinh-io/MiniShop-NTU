# HƯỚNG DẪN NỘP BÀI BẰNG PULL REQUEST

Áp dụng cho **tất cả 6 buổi thực hành** học phần Kiểm thử phần mềm (SOT357).

Trong học phần này, bài thực hành được nộp theo đúng cách các nhóm phát triển phần mềm chuyên nghiệp làm việc: **mỗi thay đổi đi qua một Pull Request (PR) và được review trước khi hợp nhất**. Giảng viên sẽ nhận xét trực tiếp trên từng dòng bài làm của bạn.

---

## Tổng quan

```
 Repo của giảng viên (mẫu)            Repo RIÊNG TƯ của bạn
 ────────────────────────             ─────────────────────────────────────
 minishop-ntu  ──(upstream)──▶  main ──┬── nhánh buoi-01 ──▶ PR ──▶ GV review ──▶ Approve ──▶ Merge
                                       └── nhánh buoi-02 ──▶ PR ──▶ …
```

| Loại bài | Repo | Tên nhánh | Ai mở PR | Ai phải review |
|---|---|---|---|---|
| Cá nhân | `sot357-<MSSV>` (của bạn) | `buoi-XX` | Bạn | Giảng viên |
| Nhóm (chỉ khi đề bài yêu cầu) | `sot357-nhom-<số nhóm>` (của nhóm) | `buoi-XX-nhom` | Thư ký (Scribe) | Moderator **và** giảng viên |

> **Buổi 1 làm hoàn toàn cá nhân**: cả 3 phần nộp chung một PR trên nhánh `buoi-01` của repo `sot357-<MSSV>`. Dòng *Nhóm* chỉ áp dụng cho buổi nào đề bài ghi rõ là bài nhóm.

**Quy tắc bắt buộc**
1. Repo phải để chế độ **Private** (riêng tư).
2. **Không tự bấm Merge** khi giảng viên chưa *Approve*.
3. Chỉ sửa các file mà đề bài cho phép. Hệ thống kiểm tra tự động sẽ báo lỗi nếu bạn sửa file khác.

---

## A. Thiết lập ban đầu (làm MỘT lần, trước Buổi 1, khoảng 15 phút)

### A1. Chuẩn bị
- Tài khoản GitHub, **ảnh đại diện và tên hiển thị** đúng họ tên thật (để giảng viên nhận ra).
- Đã cài Git, Node.js, VS Code (xem `README.md`).

### A2. Tạo repo riêng tư trên GitHub
1. Vào https://github.com/new
2. **Repository name:** `sot357-<MSSV>` (ví dụ `sot357-64130001`)
3. Chọn **Private**.
4. **KHÔNG** tích *Add a README*, *.gitignore*, *license* (repo phải trống hoàn toàn).
5. Bấm **Create repository**, sao chép đường dẫn dạng `https://github.com/<tên-bạn>/sot357-<MSSV>.git`.

### A3. Lấy mã nguồn mẫu và đẩy lên repo của bạn
Mở terminal ở thư mục bạn muốn lưu bài, chạy lần lượt (thay phần trong `< >`):

```bash
git clone <URL-repo-mẫu-của-giảng-viên> sot357-<MSSV>
cd sot357-<MSSV>

# Đổi tên nguồn gốc thành "upstream" (repo của giảng viên, dùng để nhận tài liệu buổi sau)
git remote rename origin upstream

# Gắn repo riêng của bạn làm "origin"
git remote add origin https://github.com/<tên-bạn>/sot357-<MSSV>.git
git push -u origin main
```

Kiểm tra: `git remote -v` phải thấy cả `origin` (repo của bạn) và `upstream` (repo của giảng viên).

> Vì sao không dùng nút *Use this template* hoặc *Fork*? Repo tạo bằng *template* không giữ lịch sử chung với repo mẫu nên không nhận được tài liệu các buổi sau; còn *fork* của repo công khai thì không thể để riêng tư.

### A4. Mời giảng viên vào repo
Trên trang repo: **Settings → Collaborators → Add people** → nhập tài khoản GitHub của giảng viên: `<tài-khoản-GV>`.

### A5. Khai báo repo
Điền link repo vào biểu mẫu giảng viên cung cấp: [Google ](https://docs.google.com/forms/d/e/1FAIpQLSdEjsJn2HUxLWmiFHy9alfB7wnAGQWvDtT3H-XGsZJRKpW5XQ/viewform?usp=publish-editor).

### A6. Repo nhóm (chỉ Moderator của nhóm làm)
> Chỉ làm khi đề bài một buổi nào đó yêu cầu bài nhóm. **Buổi 1 không cần.**

Làm lại A2 → A5 với tên `sot357-nhom-<số nhóm>` (ví dụ `sot357-nhom-03`), và ở bước A4 mời **cả giảng viên lẫn tất cả thành viên nhóm**. Các thành viên chấp nhận lời mời trong email, sau đó `git clone` repo nhóm về máy.

---

## B. Quy trình nộp bài MỖI BUỔI

### B1. Đầu buổi: nhận tài liệu mới
```bash
git checkout main
git pull upstream main     # nhận tài liệu buổi mới từ giảng viên
git push origin main       # cập nhật lên repo của bạn
```

### B2. Tạo nhánh cho buổi học
```bash
git checkout -b buoi-01            # bài cá nhân Buổi 1
# hoặc, trong repo nhóm (chỉ khi đề bài có bài nhóm):
git checkout -b buoi-XX-nhom
```
Tên nhánh phải **đúng chính xác** như trên (chữ thường, có gạch nối, số có 2 chữ số).

### B3. Làm bài và commit thường xuyên
```bash
git add bai-nop/ src/lab-static/orderUtils.js
git commit -m "Buoi 1: hoan thanh Phan 1"
```
Nên commit **sau mỗi phần**, không đợi đến cuối. Nội dung commit ngắn gọn, nói rõ đã làm gì.

> Không dùng `git add .` nếu chưa chắc: dễ đẩy nhầm file rác. Thư mục `node_modules/` đã được bỏ qua sẵn.

### B4. Đẩy lên và mở Pull Request
```bash
git push -u origin buoi-01
```
Sau đó trên GitHub:
1. Vào repo, bấm nút vàng **Compare & pull request** (hoặc tab *Pull requests → New pull request*).
2. Kiểm tra: **base: `main`** ← **compare: `buoi-01`**.
3. Tiêu đề: `[Buổi 1] <Họ tên> – <MSSV>` (bài nhóm: `[Buổi 1] Nhóm 03 – Biên bản review`).
4. Điền phần mô tả theo mẫu có sẵn.
5. Cột bên phải, mục **Reviewers**: chọn giảng viên (bài nhóm: chọn thêm Moderator).
6. Bấm **Create pull request**.

### B5. Chờ kiểm tra tự động
Ngay sau khi mở PR, mục **Checks** sẽ chạy trong khoảng 1 phút:
- ✅ **xanh:** bài đã qua kiểm tra hình thức (đúng nhánh, đúng file, ESLint sạch…);
- ❌ **đỏ:** bấm *Details* để xem mục nào chưa đạt, sửa lại trên máy, `commit` + `push`. PR tự cập nhật và kiểm tra chạy lại.

> Ở Buổi 1, lúc nộp cuối giờ **dấu ❌ ở mục ESLint là bình thường** nếu bạn chưa sửa xong Phần 3. Bạn có đến 23:59 để push thêm commit sửa.

Kiểm tra tự động chỉ xét **hình thức**. Điểm nội dung do giảng viên chấm.

### B6. Nhận góp ý và sửa bài
Giảng viên sẽ review và chọn một trong ba:

| Giảng viên chọn | Ý nghĩa | Bạn làm gì |
|---|---|---|
| **Comment** | Góp ý, không bắt buộc sửa | Đọc, trả lời nếu cần |
| **Request changes** | Phải sửa | Sửa trên cùng nhánh, commit, push. Trả lời từng góp ý (ví dụ "Đã sửa ở commit abc123") rồi bấm *Resolve conversation*. Sau đó bấm biểu tượng 🔄 cạnh tên giảng viên để yêu cầu review lại |
| **Approve** | Bài đạt | Bấm **Merge pull request** → *Confirm merge* |

### B7. Sau khi merge
```bash
git checkout main
git pull origin main
```
Máy bạn đã sẵn sàng cho buổi sau (quay lại B1).

---

## C. Làm việc nhóm với Pull Request (bài nhóm)

> Chỉ áp dụng cho buổi có bài nhóm. **Buổi 1 không dùng mục này.**

Buổi review là để luyện đúng các vai trò trong Chương 3. Vì vậy PR nhóm cũng chia vai:

1. **Scribe** tạo nhánh `buoi-XX-nhom`, commit biên bản, mở PR, chọn Reviewers là **Moderator** và **giảng viên**.
2. **Mọi thành viên khác** vào tab *Files changed* và để lại **ít nhất 1 nhận xét** trên biên bản (bổ sung lỗi, sửa phân loại…).
3. Scribe cập nhật theo nhận xét.
4. **Moderator** bấm *Review changes → Approve* khi nhóm thống nhất.
5. Giảng viên review sau cùng.

Lịch sử nhận xét trên PR là căn cứ chấm tiêu chí "quy trình review" và **mức đóng góp của từng thành viên**.

---

## D. Dùng giao diện VS Code thay cho dòng lệnh

VS Code làm được hầu hết các bước trên mà không cần gõ lệnh:
- **Tạo nhánh:** bấm tên nhánh ở góc dưới bên trái → *Create new branch* → nhập `buoi-01`.
- **Commit:** biểu tượng *Source Control* (Ctrl+Shift+G) → bấm `+` bên cạnh file để chọn → nhập nội dung → *Commit*.
- **Push:** bấm *Sync Changes* / *Publish Branch*.
- **Mở PR, xem góp ý ngay trong VS Code:** cài tiện ích *GitHub Pull Requests* (nhà phát hành: GitHub).

Riêng bước A3 (thiết lập `upstream`, `origin`) nên làm bằng dòng lệnh đúng như hướng dẫn.

---

## E. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `remote: Repository not found` khi push | Sai URL `origin` (`git remote -v` để xem), hoặc đang đăng nhập nhầm tài khoản |
| `! [rejected] … (fetch first)` | `git pull origin <tên-nhánh>` rồi push lại |
| Lỡ làm bài trên `main` | `git checkout -b buoi-01` (nhánh mới mang theo thay đổi chưa commit), rồi commit bình thường |
| Lỡ commit trên `main` rồi | `git branch buoi-01` → `git reset --hard upstream/main` → `git checkout buoi-01` (hỏi giảng viên nếu chưa chắc) |
| Kiểm tra báo "Không được sửa: …" | Hoàn tác file đó: `git checkout main -- <đường-dẫn-file>` → commit → push |
| Kiểm tra báo "Tên nhánh … không có trong quy định" | Đổi tên nhánh: `git branch -m buoi-01` → `git push origin -u buoi-01` → đóng PR cũ, mở PR mới |
| `git pull upstream main` báo xung đột (conflict) | Thường do bạn sửa file không được phép. Báo giảng viên, **không tự xóa bừa** |
| Không thấy nút *Merge* | Bạn chưa được giảng viên *Approve*, hoặc có xung đột với `main` |

---

## F. Bảng lệnh Git tóm tắt

| Việc cần làm | Lệnh |
|---|---|
| Xem đang ở nhánh nào, file nào đã sửa | `git status` |
| Nhận tài liệu buổi mới | `git checkout main` → `git pull upstream main` → `git push origin main` |
| Tạo nhánh buổi học | `git checkout -b buoi-XX` |
| Chọn file để commit | `git add <file hoặc thư mục>` |
| Commit | `git commit -m "nội dung"` |
| Đẩy nhánh lên GitHub | `git push -u origin buoi-XX` (lần đầu), `git push` (các lần sau) |
| Xem lịch sử | `git log --oneline -10` |
| Hoàn tác một file về bản gốc | `git checkout main -- <file>` |
