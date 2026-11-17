/** Key moments in XRP's history (Act 3 · The Journey). Prices are read from the series at each date. */
export type JKind = "milestone" | "product" | "legal" | "win" | "peak" | "crash";
export type JEvent = { id: string; date: string; t: number; kind: JKind; en: { title: string; body: string }; vi: { title: string; body: string } };

const dy = (iso: string) => {
  const d = new Date(iso + "T12:00:00Z");
  const y = d.getUTCFullYear();
  return y + (d.getTime() - Date.UTC(y, 0, 1)) / (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1));
};
const E = (id: string, date: string, kind: JKind, en: [string, string], vi: [string, string]): JEvent => ({
  id, date, t: dy(date), kind, en: { title: en[0], body: en[1] }, vi: { title: vi[0], body: vi[1] },
});

export const journeyEvents: JEvent[] = [
  E("launch", "2012-06-02", "milestone",
    ["XRP Ledger goes live", "100 billion XRP are created at once. No mining, and no way to make more."],
    ["XRP Ledger hoạt động", "100 tỷ XRP được tạo ra cùng lúc. Không đào coin, và không có cách tạo thêm."]),
  E("company", "2012-09-15", "milestone",
    ["A company gets 80 billion XRP", "The founders start NewCoin (soon OpenCoin, now Ripple) and give it 80% of all XRP to build uses for it."],
    ["Một công ty nhận 80 tỷ XRP", "Các nhà sáng lập lập NewCoin (sau là OpenCoin, nay là Ripple) và trao cho công ty 80% tổng số XRP để xây dựng ứng dụng."]),
  E("fincen", "2015-05-05", "legal",
    ["$700,000 penalty from FinCEN", "The first civil enforcement action against a virtual currency exchanger: Ripple sold XRP without the required anti-money-laundering program."],
    ["Phạt 700.000 USD từ FinCEN", "Vụ xử phạt dân sự đầu tiên với một bên trao đổi tiền ảo: Ripple bán XRP mà không có chương trình chống rửa tiền theo quy định."]),
  E("escrow", "2017-12-07", "product",
    ["55 billion XRP locked in escrow", "Ripple locks most of its XRP so that at most 1 billion can unlock each month."],
    ["Khoá 55 tỷ XRP trong escrow", "Ripple khoá phần lớn XRP của mình để mỗi tháng tối đa 1 tỷ được mở khoá."]),
  E("peak2018", "2018-01-07", "peak",
    ["Boom peak ≈ $2.75", "XRP's highest daily close of the 2017–18 boom in Coin Metrics data. Within a year it lost most of that gain."],
    ["Đỉnh cơn sốt ≈ 2,75 USD", "Giá đóng cửa ngày cao nhất của cơn sốt 2017–18 theo dữ liệu Coin Metrics. Chưa đầy một năm sau, phần lớn mức tăng đã mất."]),
  E("xrapid", "2018-10-01", "product",
    ["xRapid: XRP for payments abroad", "Ripple's first product that uses XRP to move money between countries goes into commercial use with three firms."],
    ["xRapid: XRP cho chuyển tiền quốc tế", "Sản phẩm đầu tiên của Ripple dùng XRP để chuyển tiền giữa các nước được đưa vào sử dụng thương mại với ba công ty."]),
  E("sec", "2020-12-22", "legal",
    ["The SEC sues Ripple", "The US regulator says Ripple raised over $1.3 billion through unregistered securities offerings of XRP. Several US exchanges suspend XRP."],
    ["SEC kiện Ripple", "Cơ quan quản lý Mỹ cho rằng Ripple đã huy động hơn 1,3 tỷ USD qua việc chào bán XRP như chứng khoán không đăng ký. Một số sàn Mỹ tạm ngừng XRP."]),
  E("torres", "2023-07-13", "win",
    ["Court: exchange sales aren't securities", "Judge Torres rules that XRP sold on public exchanges was not a securities offering — but Ripple's direct sales to institutions were."],
    ["Toà: bán trên sàn không phải chứng khoán", "Thẩm phán Torres phán XRP bán trên sàn công khai không phải chào bán chứng khoán — nhưng việc Ripple bán trực tiếp cho tổ chức thì có."]),
  E("penalty", "2024-08-07", "legal",
    ["$125 million penalty", "The court fines Ripple $125 million for the institutional sales — far below the roughly $2 billion the SEC asked for."],
    ["Phạt 125 triệu USD", "Toà phạt Ripple 125 triệu USD cho các khoản bán cho tổ chức — thấp hơn nhiều so với khoảng 2 tỷ USD mà SEC đề nghị."]),
  E("rlusd", "2024-12-17", "product",
    ["RLUSD dollar token launches", "A stablecoin worth $1, issued by a Ripple subsidiary supervised in New York. It is not XRP."],
    ["Ra mắt đồng đô la số RLUSD", "Một stablecoin giá 1 USD do công ty con của Ripple phát hành, chịu giám sát tại New York. Nó không phải XRP."]),
  E("peak2025", "2025-07-21", "peak",
    ["Highest close ≈ $3.55", "XRP's highest daily close in Coin Metrics data, during the 2025 rally."],
    ["Giá đóng cửa cao nhất ≈ 3,55 USD", "Giá đóng cửa ngày cao nhất của XRP theo dữ liệu Coin Metrics, trong đợt tăng năm 2025."]),
  E("caseend", "2025-08-07", "win",
    ["The SEC case ends", "Both sides drop their appeals. The $125 million penalty and a limit on direct institutional sales stay in place."],
    ["Vụ kiện SEC khép lại", "Hai bên rút kháng cáo. Khoản phạt 125 triệu USD và lệnh hạn chế bán trực tiếp cho tổ chức vẫn giữ nguyên."]),
  E("etf", "2025-11-13", "product",
    ["US spot XRP funds open", "Exchange-traded funds holding XRP start trading in the US, drawing over $666 million in their first month."],
    ["Quỹ ETF XRP giao ngay mở tại Mỹ", "Các quỹ hoán đổi danh mục nắm giữ XRP bắt đầu giao dịch tại Mỹ, hút hơn 666 triệu USD trong tháng đầu."]),
  E("rwa", "2026-06-15", "product",
    ["Real-world assets ≈ $4.18 billion", "Tokenized bonds, commodities and funds on the XRP Ledger grow about 28-fold in a year (Evernorth, RWA.xyz data)."],
    ["Tài sản thực ≈ 4,18 tỷ USD", "Trái phiếu, hàng hoá và quỹ được token hoá trên XRP Ledger tăng khoảng 28 lần trong một năm (Evernorth, dữ liệu RWA.xyz)."]),
  E("below1", "2026-11-14", "crash",
    ["Closes below $1", "XRP settles at about $0.91, its lowest daily close since November 2024, as Bitcoin falls and fund money flows out."],
    ["Đóng cửa dưới 1 USD", "XRP chốt quanh 0,91 USD, giá đóng cửa ngày thấp nhất kể từ tháng 11/2024, khi Bitcoin giảm và tiền rút khỏi các quỹ."]),
];
