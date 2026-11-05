# Market Intelligence Dashboard

Dashboard nội bộ theo dõi crypto, stablecoin, USDT/VND, FX và vĩ mô. Dữ liệu được thu thập tự động **mỗi sáng khoảng 07:10–07:30 (giờ Việt Nam)** bằng GitHub Actions, lưu thành file JSON trong repo và hiển thị trên GitHub Pages. Không cần máy chủ, không cần máy tính bật liên tục, không tốn phí với các nguồn mặc định.

> Đây là ảnh chụp dữ liệu hằng ngày, **không phải dữ liệu real-time**. Mỗi chỉ số ghi rõ nguồn, thời điểm và trạng thái chất lượng.

---

## 1. Đưa website lên mạng — checklist thao tác tay (khoảng 10 phút)

1. **Tạo repo** trên GitHub (ví dụ `mi-a7k2x9`, đặt tên khó đoán). Xem mục 5 về quyền riêng tư trước khi chọn Public/Private.
2. **Đưa code lên repo** (Claude có thể push giúp nếu bạn cấp quyền repo).
3. **Bật GitHub Pages**: repo → *Settings* → *Pages* → *Build and deployment* → *Source* chọn **GitHub Actions**.
4. **Cho phép Actions ghi dữ liệu**: *Settings* → *Actions* → *General* → *Workflow permissions* chọn **Read and write permissions** → *Save*.
5. **(Tuỳ chọn) Thêm API key miễn phí**: *Settings* → *Secrets and variables* → *Actions* → *New repository secret*:
   - `COINGECKO_DEMO_KEY` — đăng ký tại coingecko.com/en/api (giảm rủi ro bị chặn do gọi quá nhiều).
   - `FRED_API_KEY` — đăng ký tại fred.stlouisfed.org (không có vẫn chạy qua CSV công khai).
6. **Chạy lần đầu**: tab *Actions* → **Daily data update** → *Run workflow*. Chờ 3–5 phút.
7. **Mở website**: *Settings* → *Pages* hiển thị đường link `https://<tài-khoản>.github.io/<tên-repo>/`. Gửi link cho người cần xem.
8. **Bảo vệ nhánh** (khuyến nghị): *Settings* → *Branches* → *Add rule* cho `main`: bật *Require a pull request before merging* cho người khác; thêm ngoại lệ cho GitHub Actions nếu bật “Do not allow bypassing”.

Sau bước 6, hệ thống tự chạy mỗi ngày. Không cần làm gì thêm.

## 2. Vận hành hằng ngày

| Việc cần làm | Cách làm |
|---|---|
| Xem dữ liệu ngày cũ | Chọn ngày ở góc phải trên cùng. Link có dạng `.../#/?date=2026-11-05`, gửi được cho người khác |
| Cập nhật tỷ giá trung tâm NHNN, lãi suất liên ngân hàng, tồn kho USDT, ghi chú chính sách | Mở `config/manual_inputs.json` trên GitHub → bút chì → sửa `value`, `date` (YYYY-MM-DD), `updated_by` → *Commit*. Website tự build lại sau ~2 phút; lần thu thập sáng hôm sau đưa số vào tính toán |
| Đổi ngưỡng rủi ro / quy tắc regime | Sửa `config/settings.json` (`risk_thresholds`, `regime`) |
| Bật nguồn P2P | `config/settings.json` → `p2p.enabled: true` — **chỉ sau khi pháp chế xác nhận** (xem mục 4) |
| Chạy lại ngay | *Actions* → *Daily data update* → *Run workflow* (tick *force* nếu hôm nay đã chạy) |
| Xuất số liệu | Nút ⬇ (CSV toàn bộ chỉ số) hoặc nút 📄 (In → Lưu thành PDF) |
| Kiểm tra nguồn lỗi | Trang **Data Sources & Status** trên website, hoặc log trong tab *Actions* |
| Huỷ một lần cập nhật sai (rollback) | Repo → *Commits* → mở commit `data: cập nhật …` sai → *Revert* → website tự build lại. Hoặc sửa file trong `public/data/` |

Nếu một nguồn lỗi, các nguồn khác vẫn chạy; chỉ số liên quan hiển thị “Chưa có dữ liệu” kèm lý do. Nếu **tất cả** nguồn lỗi, hệ thống không ghi đè dữ liệu cũ.

## 3. Nguồn dữ liệu

| Nhóm | Nguồn | Cần key? | Ghi chú |
|---|---|---|---|
| Giá, vốn hoá, dominance, volume | CoinGecko API | Không (key Demo tuỳ chọn) | Giá tổng hợp nhiều sàn |
| Nến 1D / 1H | Binance `data-api.binance.vision` | Không | Endpoint dữ liệu công khai, dùng được từ máy chủ GitHub ở Mỹ |
| Funding, OI, Long/Short, Volume Delta, CVD, basis | OKX API v5 | Không | **Chỉ một sàn**, không đại diện toàn thị trường. CVD hợp lệ vì OKX phân loại taker buy/sell |
| Fear & Greed | alternative.me | Không | |
| Nguồn cung stablecoin | DefiLlama | Không | |
| Lãi suất Fed, lợi suất, CPI, PCE, NFP, thất nghiệp | FRED | Không (key tuỳ chọn) | CPI/PCE hiển thị YoY và kỳ tham chiếu |
| USD/VND niêm yết | Vietcombank (website) | Không | Mua chuyển khoản, mua tiền mặt, bán |
| Tỷ giá trung tâm NHNN, LNH, tồn kho | Nhập tay | — | NHNN không có API công khai ổn định |
| Lịch FOMC | `config/fomc.json` | — | Theo federalreserve.gov (kiểm tra 05/11/2026) |
| USDT/VND P2P | Binance P2P, OKX P2P | Không | **Mặc định tắt** |

## 4. Giới hạn hiện tại (cần biết)

- **Chưa kiểm thử với API thật.** Môi trường xây dựng bị chặn mạng. Toàn bộ parser được kiểm thử bằng dữ liệu giả lập theo cấu trúc tài liệu công khai. Lần chạy đầu trên GitHub mới xác nhận thật; nguồn nào sai cấu trúc sẽ hiện “Lỗi” ở trang Status, các nguồn khác không bị ảnh hưởng.
- **USDT/VND P2P tắt mặc định.** Binance và OKX không có API P2P công khai; collector gọi endpoint nội bộ mà website của họ dùng. Bật chỉ khi pháp chế xác nhận phù hợp điều khoản, hoặc thay bằng nguồn OTC/nội bộ được cấp quyền. Khi tắt, P2P premium, spread, liquidity pressure, cross-exchange spread hiển thị “Chưa có dữ liệu”. Khi bật, máy chủ GitHub ở Mỹ có thể bị nền tảng chặn.
- **DXY không có**: chỉ số độc quyền của ICE. Dùng *Nominal Broad USD Index* (FRED DTWEXBGS) làm chỉ báo thay thế, ghi rõ trên giao diện. Chuỗi này của FRED có độ trễ vài ngày.
- **Liquidation toàn thị trường, stablecoin exchange inflow/outflow, ngày công bố & kỳ vọng thị trường cho CPI/NFP**: cần nguồn trả phí (CoinGlass, CryptoQuant…), để Phase 2.
- **Đơn vị Volume Delta/CVD** theo đơn vị OKX trả về (chưa xác minh là coin hay USD); đọc theo dấu và độ lớn tương đối.
- **BTC Dominance và tương quan USD/VND ↔ USDT/VND** dùng lịch sử hệ thống tự lưu, cần tích luỹ vài tuần.
- **Không có AI và không có quy trình duyệt** theo yêu cầu. Tín hiệu vĩ mô và market making là quy tắc định lượng, có ghi nhãn Fact/Analysis.
- Lịch FOMC 2027 là dự kiến; cập nhật `config/fomc.json` khi Fed công bố.

## 5. Bảo mật & quyền riêng tư — đọc trước khi chọn Public/Private

- GitHub Pages **không có đăng nhập**: ai có link đều xem được. Website có `noindex` và `robots.txt` để Google không lập chỉ mục, nhưng đó không phải bảo mật.
- **Gói GitHub Free bắt buộc repo Public** mới bật được Pages. Khi đó toàn bộ code, cấu hình, `manual_inputs.json` và lịch sử dữ liệu đều công khai trên GitHub, ai tìm thấy tài khoản của bạn đều xem được — link khó đoán không che được điều này.
- **GitHub Pro (~4 USD/tháng)** cho phép Pages từ repo Private: code và lịch sử được giấu, nhưng website vẫn mở với ai có link.
- **Không nhập** tồn kho nội bộ, số dư, đối tác hay thông tin nhạy cảm vào `manual_inputs.json` nếu repo Public.
- Cần bảo mật thật (đăng nhập bằng email công ty): chuyển hosting sang **Cloudflare Pages + Cloudflare Access** (miễn phí đến 50 người dùng). Code không cần sửa; chỉ thay bước deploy.
- API key chỉ nằm trong GitHub Secrets, chỉ workflow thu thập dữ liệu dùng tới, không bao giờ xuất hiện trong website hay file JSON. Workflow kiểm tra chất lượng chạy trên Pull Request **không** được truy cập secrets.

## 6. Cấu trúc thư mục

```
config/            settings.json (ngưỡng, bật/tắt nguồn), manual_inputs.json (nhập tay), fomc.json
scripts/
  collectors/      mỗi nguồn một file: crypto, derivatives, stablecoins, sentiment, macro, vn_fx, p2p
  analyzers/       analytics.py — volatility, tương quan, regime, bảng rủi ro, tín hiệu theo quy tắc
  validators/      quality.py (schema, độ mới, ngoại lai, lệch nguồn), check_data.py
  run_pipeline.py  điều phối toàn bộ
public/data/       latest.json, index.json, history/YYYY/MM/YYYY-MM-DD.json (do bot tạo)
src/               frontend React + TypeScript (pages, components, charts, hooks, services, utils)
tests/             unit test Python (dữ liệu giả lập chỉ dùng trong test)
.github/workflows/ daily-update.yml, deploy.yml, quality-check.yml
```

Quy trình dữ liệu: **API → kiểm tra → chuẩn hoá → tính toán → JSON → build → GitHub Pages.** Mỗi chỉ số có `value`, `unit`, `source`, `timestamp`, `quality` (`ok`, `stale`, `missing`, `error`, `manual`, `warning`) và `kind` (bid / ask / mid / tham chiếu / giá khớp).

## 7. Dành cho lập trình viên

```bash
pip install -r requirements.txt && python -m pytest -q     # test pipeline
python -m scripts.run_pipeline                              # thu thập thật (cần mạng)
npm ci && npm run dev                                       # giao diện tại localhost:5173
npm run typecheck && npm test && npm run build
```

Mở rộng sau này: thay `services/data.ts` để đọc từ Supabase/PostgreSQL, hoặc thêm collector mới trong `scripts/collectors/` và đăng ký trong `SOURCES` của `run_pipeline.py`.
