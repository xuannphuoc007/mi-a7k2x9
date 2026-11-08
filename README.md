# Market Intelligence Dashboard

Dashboard nội bộ theo dõi crypto, stablecoin, USDT/VND, FX và vĩ mô. Dữ liệu được thu thập tự động **mỗi sáng khoảng 07:10–07:30, rồi mỗi 30 phút từ 08:00 đến 17:00 (giờ Việt Nam)** bằng GitHub Actions, lưu thành file JSON trong repo và hiển thị trên GitHub Pages. Không cần máy chủ, không cần máy tính bật liên tục, không tốn phí với các nguồn mặc định.

> Đây là ảnh chụp dữ liệu hằng ngày, **không phải dữ liệu real-time**. Mỗi chỉ số ghi rõ nguồn, thời điểm và trạng thái chất lượng.

---

## 2. Vận hành hằng ngày

| Việc cần làm | Cách làm |
|---|---|
| Chụp ảnh tỷ giá và lãi suất | Nút **Snapshot** ở đầu trang: tải số mới nhất trên máy chủ rồi tạo ảnh (tải về hoặc sao chép). Số liệu trễ tối đa khoảng 35 phút trong giờ hành chính |
| Chụp ảnh tỷ giá và lãi suất | Nút **Snapshot** ở đầu trang (hoặc link `.../#/?snapshot=1`): tải số mới nhất trên máy chủ rồi tạo ảnh để tải về hoặc sao chép. Trong giờ 08:00–17:00 số liệu trễ tối đa khoảng 35 phút |
| Xem dữ liệu ngày cũ | Chọn ngày ở góc phải trên cùng. Bản lưu của một ngày là lần chạy lưu cuối cùng trong ngày (thường lúc 17:00). Bản lưu của một ngày là lần chạy 17:00 (hoặc lần chạy cuối cùng có lưu). Link có dạng `.../#/?date=2026-11-05`, gửi được cho người khác |
| Nhập tay: USD/VND liên ngân hàng, forward 1 tháng (giá yết), lãi suất liên ngân hàng VND/USD qua đêm và VND 1 tháng, tồn kho USDT, ghi chú chính sách (tỷ giá trung tâm NHNN đã tự động, chỉ nhập tay khi nguồn tự động lỗi) | Mở `config/manual_inputs.json` trên GitHub → bút chì → sửa `value`, `date` (YYYY-MM-DD), `updated_by` → *Commit*. Website tự build lại sau ~2 phút; lần thu thập sáng hôm sau đưa số vào tính toán |
| Đổi ngưỡng rủi ro / quy tắc regime | Sửa `config/settings.json` (`risk_thresholds`, `regime`) |
| Tắt nguồn P2P | `config/settings.json` → `p2p.enabled: false` (xem mục 4) |
| Chạy lại ngay | *Actions* → *Daily data update* → *Run workflow* (tick *force* nếu hôm nay đã chạy) |
| Xuất số liệu | Nút ⬇ (CSV toàn bộ chỉ số) hoặc nút 📄 (In → Lưu thành PDF) |
| Kiểm tra nguồn lỗi | Log trong tab *Actions*, hoặc mục `sources` trong `public/data/latest.json` |
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
| USD/VND niêm yết | Vietcombank, BIDV, Techcombank | Không | Mua chuyển khoản, mua tiền mặt, bán |
| USD chợ đen | tygiausd.org, tygia.vn | Không | Không có nguồn chính thức; đọc từ trang web nên có thể hỏng nếu trang đổi giao diện |
| Tin lớn | RSS: CNBC, BBC, Fed, CoinDesk, Cointelegraph, Decrypt, VnExpress, CafeF | Không | Chấm điểm bằng từ khoá trong `scripts/collectors/news.py`, không dùng AI; tiêu đề giữ ngôn ngữ gốc |
| Tỷ giá trung tâm NHNN, giá mua/bán của NHNN | sbv.gov.vn (trang tỷ giá); allratestoday.com dự phòng | Không | Theo ngày áp dụng của NHNN |
| Lãi suất bình quân liên ngân hàng VND (qua đêm, 1 tháng) | sbv.gov.vn (trang lãi suất); Stockbiz dự phòng cho kỳ hạn qua đêm | Không | Theo ngày áp dụng của NHNN |
| USD/VND liên ngân hàng (giá chốt phiên), lãi suất liên ngân hàng USD (qua đêm, 1 tháng) | VIRA, Bản tin Kinh tế - Tài chính ngày (MSB Research) | Không | Số của phiên trước; không phải ngày nào cũng có bản tin, khi đó giữ số của bản tin gần nhất |
| USD/VND thị trường quốc tế | Yahoo Finance `USDVND=X` | — | Giá tham chiếu quốc tế, có lịch sử 1 năm |
| SOFR, tín phiếu Mỹ 4 tuần | FRED | Tuỳ chọn | Lãi suất qua đêm USD và tham chiếu 1 tháng |
| Forward 1 tháng (giá yết), tồn kho | Nhập tay | — | Không có nguồn công khai miễn phí |
| Forward 1 tháng (tính) | Spot liên ngân hàng × (1 + VND 1 tháng × 30/365) ÷ (1 + USD 1 tháng × 30/360) | — | Giá lý thuyết, không phải giá ngân hàng yết. Chỉ dùng đúng kỳ hạn 1 tháng; thiếu đầu vào hoặc đầu vào cũ thì không tính |
| Volatility | Tính từ chuỗi có sẵn và lịch sử tích luỹ | — | Trang Volatility; biến thiếu dữ liệu tự bị bỏ qua và tự tính khi đủ |
| Lịch FOMC | `config/fomc.json` | — | Theo federalreserve.gov (kiểm tra 05/11/2026) |
| USDT/VND P2P | Binance, OKX, Bybit, Bitget | Không | **Đang bật.** Đọc endpoint nội bộ của website các sàn |

## 4. Giới hạn hiện tại (cần biết)

- **Chưa kiểm thử với API thật.** Môi trường xây dựng bị chặn mạng. Toàn bộ parser được kiểm thử bằng dữ liệu giả lập theo cấu trúc tài liệu công khai. Lần chạy đầu trên GitHub mới xác nhận thật; nguồn nào lỗi thì chỉ số đó bị ẩn trên website, các nguồn khác không bị ảnh hưởng.
- **USDT/VND P2P đang bật.** Các sàn không có API P2P công khai; collector gọi endpoint nội bộ mà website của họ dùng, nên có thể đổi hoặc bị chặn và có thể không phù hợp điều khoản dịch vụ của sàn. Tắt bằng `p2p.enabled: false`.
- **DXY không có**: chỉ số độc quyền của ICE. Dùng *Nominal Broad USD Index* (FRED DTWEXBGS) làm chỉ báo thay thế. Chuỗi này của FRED có độ trễ vài ngày.
- **Liquidation toàn thị trường, stablecoin exchange inflow/outflow, ngày công bố & kỳ vọng thị trường cho CPI/NFP**: cần nguồn trả phí (CoinGlass, CryptoQuant…), để Phase 2.
- **Đơn vị Volume Delta/CVD** theo đơn vị OKX trả về (chưa xác minh là coin hay USD); đọc theo dấu và độ lớn tương đối.
- **BTC Dominance và tương quan USD/VND ↔ USDT/VND** dùng lịch sử hệ thống tự lưu, cần tích luỹ vài tuần.
- **Đánh giá tin** gồm 3 lớp tách biệt, không phải khuyến nghị: *hướng tác động* theo quy tắc (`scripts/analyzers/news_signal.py`, không khớp quy tắc thì ghi "Chưa rõ hướng"); *giọng tin* do mô hình FinTwitBERT (giấy phép MIT) chấm ngay trên máy chủ GitHub, không cần API key, chỉ tin tiếng Anh, độ tin cậy từ 70% (`scripts/analyzers/tone.py`); *thực tế 24 giờ* đặt cạnh để đối chiếu. Cả ba đều chưa được đo độ chính xác trên lịch sử dài.
- **Không có quy trình duyệt** theo yêu cầu.
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
