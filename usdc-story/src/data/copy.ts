/** All words on the page, EN + VI. Figures carry their date; simulated values are labelled. */
export type Chip = { kind: "data" | "sim"; text: string };
export type Beat = {
  /** scene-local moment (0..1) this text belongs to */
  t: number;
  side: "l" | "r" | "c";
  head?: string;
  l1: string;
  l2?: string;
  deep?: string[];
  insight?: string;
  chip?: Chip;
};
export type Scene = { id: "s01" | "s03" | "s05"; num: string; kicker: string; title: string; beats: Beat[] };

type Dict = {
  meta: { title: string };
  ui: {
    project: string;
    subtitle: string;
    question: string;
    scroll: string;
    cinematic: string;
    system: string;
    viewHint: string;
    l2: string;
    deep: string;
    insight: string;
    data: string;
    sim: string;
    metaphor: string;
    preview: string;
    previewBody: string;
    next: string;
    replay: string;
    sources: string;
    disclaimer: string;
    credits: string;
    nowebgl: string;
  };
  scenes: Scene[];
  upcoming: { num: string; title: string }[];
  hud: {
    eth: string;
    sol: string;
    flight: string;
    total: string;
    burned: string;
    attested: string;
    minted: string;
    change: string;
    route: string;
    confirm: string;
  };
  vault: {
    cover: string;
    reserves: string;
    usdc: string;
    normal: string;
    stress: string;
    stressNote: string;
    liquid: string;
  };
  compare: {
    title: string;
    cctp: string;
    bridge: string;
    cctpSteps: string[];
    bridgeSteps: string[];
    cctpRisk: string;
    bridgeRisk: string;
  };
  labels: Record<string, string>;
  sys: Record<string, [string, string]>;
};

const sources = [
  "Circle — Transparency & stability page (reserve structure, Circle Reserve Fund)",
  "edgeX News, citing Circle's transparency report of 12 Nov 2026 (circulation, reserves, breakdown)",
  "Circle Internet Group — Form S-1/A and 424B4, SEC 2025 (Circle Reserve Fund, sole shareholder, Rule 2a-7)",
  "CoinDesk — Circle Q3 2026 earnings data (USDC minted / redeemed, circulation)",
  "sec-api.io — Circle Q3 2026 10-Q analysis (reserve income $657.6M, 76% of revenue)",
  "Circle Developer Docs — CCTP finality thresholds and fees (Fast Transfer fee by chain)",
  "Eco — CCTP transfer times by chain (Fast ≈ 20 s, Standard ≈ 15–19 min from Ethereum)",
  "Eco — What is Circle's CCTP (V2 launch Mar 2025, Solana V2 Oct 2025, burn-attest-mint)",
  "USDC.com — What is USDC (native on 30 blockchains as of 6 Feb 2026)",
  "Yahoo Finance — Circle Q4 2025 earnings call (CCTP volume > $41B in 2025, 3.7×)",
  "Cointelegraph / CryptoCompare — March 2023: $3.3B of ~$40B reserves at SVB; low ≈ $0.87",
];

export const en: Dict = {
  meta: { title: "The Journey of a Digital Dollar — USDC" },
  ui: {
    project: "The Journey of a Digital Dollar",
    subtitle: "Follow the money. Discover what happens behind every USDC.",
    question: "How does a dollar move from the banking system into the blockchain economy — and back?",
    scroll: "Scroll to follow the dollar",
    cinematic: "Cinematic",
    system: "System",
    viewHint: "X-RAY: switch to System view to see the real entities and mechanisms",
    l2: "How it works",
    deep: "Deep dive",
    insight: "Worth knowing",
    data: "Reported",
    sim: "Illustration",
    metaphor: "The glowing object is a metaphor. USDC is fungible: no token is a particular banknote, and no single dollar physically travels through the system. We follow one unit of value to make the machinery visible.",
    preview: "Preview build · 3 flagship scenes",
    previewBody: "You just watched scenes 01, 03 and 05 — the morphing dollar, the reserve vault and the cross-chain portal. The remaining six scenes will slot in between, using the same camera system.",
    next: "Coming in the full journey",
    replay: "Replay from the start",
    sources: "Sources",
    disclaimer: "Educational illustration, not financial advice. Simulated values are labelled. No real transfers are executed. Reserve figures are as reported for 12 Nov 2026 and change every week.",
    credits: "USDC logo © Circle Internet Group, used for identification. Banknote is an original stylised illustration, not a real currency design.",
    nowebgl: "Your browser can't show the 3D world, so you're seeing the simplified version.",
  },
  scenes: [
    {
      id: "s01",
      num: "01",
      kicker: "The birth of digital money",
      title: "What if a dollar could travel like data?",
      beats: [
        {
          t: 0.13,
          side: "l",
          l1: "This is a dollar. For a hundred years it has moved the way banks move: on business days, inside their walls, a few days at a time across borders.",
        },
        {
          t: 0.36,
          side: "r",
          head: "Paper becomes code.",
          l1: "USDC rewrites that dollar as a token — a balance on a blockchain that can move at any hour, to anyone with an address.",
          l2: "USDC is a stablecoin issued by Circle, a US company listed in New York. Each token aims to be worth exactly one US dollar, and Circle's eligible business customers can swap it back for one dollar.",
          chip: { kind: "data", text: "≈ 67.9 billion USDC in circulation · 12 Nov 2026" },
        },
        {
          t: 0.6,
          side: "l",
          head: "Not a bank deposit. Not a Fed dollar.",
          l1: "Money in a bank account is a promise from the bank, usually insured up to $250,000. A digital dollar from the Federal Reserve would be a promise from the state. USDC is a promise from Circle, backed by a pool of reserves — with no deposit insurance.",
          deep: [
            "Who issues it: Circle Internet Group (NYSE: CRCL). Circle mints new USDC when a customer sends dollars, and burns USDC when it pays dollars back.",
            "Where it lives: Circle issues USDC natively on 30 blockchains (as of 6 Feb 2026), including Ethereum, Solana and Base.",
            "What it is not: not FDIC-insured, not legal tender, not a central bank digital currency.",
          ],
          insight: "USDC is busier than it is big. In Q3 2026 Circle created about $104 billion of new USDC and destroyed about $104 billion — while the total in circulation barely moved. Dollars pour in and out of this system every day.",
        },
        {
          t: 0.8,
          side: "c",
          head: "Follow the dollar.",
          l1: "Into the vault that backs it, then across the portal between blockchains.",
        },
      ],
    },
    {
      id: "s03",
      num: "03",
      kicker: "The reserve vault",
      title: "Where is the money behind USDC?",
      beats: [
        {
          t: 0.1,
          side: "l",
          l1: "Under every USDC there is a vault. It holds almost no banknotes. It holds short loans — to the US government and to the biggest banks.",
          chip: { kind: "data", text: "Reserves ≈ $68.1B vs ≈ 67.9B USDC · 12 Nov 2026" },
        },
        {
          t: 0.36,
          side: "r",
          head: "≈ $39.9B · overnight loans",
          l1: "The biggest block, about 59%. Every night this money is lent to large banks, who hand over US Treasury bonds as a guarantee. Next morning the cash comes back — and is lent again.",
          l2: "Finance calls this an overnight reverse repurchase agreement (reverse repo). It matures in one day and is secured by Treasuries.",
          deep: [
            "Why hold it: it pays interest, and it turns back into cash every single day.",
            "Risk: it relies on the banks on the other side and on the collateral being handled correctly. If a bank failed, Circle would keep the Treasuries — which then have to be sold.",
          ],
        },
        {
          t: 0.5,
          side: "l",
          head: "≈ $20.1B · Treasury bills",
          l1: "About 30% sits in IOUs from the US government that are paid back within three months.",
          l2: "Because they mature so soon, their price barely moves when interest rates change, so they can be sold quickly at close to face value.",
          deep: [
            "Risk: small, not zero. Selling tens of billions in a panic can still cost a little, and the cash only arrives on the next settlement.",
          ],
        },
        {
          t: 0.62,
          side: "r",
          head: "≈ $8.0B · cash in banks",
          l1: "About 12% is plain cash, ready for days when many holders want their dollars back at once.",
          l2: "≈ $7.4B sits in 'systemically important' banks — the giants regulators consider too important to fail. ≈ $0.6B is in other banks.",
          deep: [
            "Risk: a bank deposit above the insurance limit can be frozen if the bank fails. That exact thing happened to USDC in March 2023.",
          ],
        },
        {
          t: 0.74,
          side: "l",
          head: "One pool, not millions of lockers.",
          l1: "Most of the loans and Treasury bills sit inside one fund — the Circle Reserve Fund, run by BlackRock. No USDC owns a particular bill. Every token is a claim on the whole pool.",
          l2: "The fund is registered with the US SEC as a government money market fund (ticker USDXX). Circle is its only shareholder, and its holdings are published every business day.",
          insight: "More than half of the money behind USDC is lent out overnight — every night. The vault is less a safe than a machine that lends and collects back every 24 hours. That machine is also Circle's business: reserve income was $657.6M in Q3 2026, about 76% of its revenue.",
        },
        {
          t: 0.84,
          side: "r",
          head: "Is there enough?",
          l1: "On a normal day, slightly more than enough. The real question is how fast the reserves can become cash on a bad day.",
          chip: { kind: "sim", text: "Stress scenario below is a simulation" },
        },
      ],
    },
    {
      id: "s05",
      num: "05",
      kicker: "The cross-chain portal",
      title: "How can USDC move between blockchains?",
      beats: [
        {
          t: 0.08,
          side: "l",
          l1: "Blockchains cannot see each other. Ethereum has no idea what happens on Solana. So 'moving' USDC between them is really two separate events — and someone has to vouch that the first one happened.",
        },
        {
          t: 0.21,
          side: "r",
          head: "Step 1 · Burn",
          l1: "1,000 USDC on Ethereum is destroyed. Not sent — destroyed.",
          l2: "The sender calls Circle's contract (depositForBurn). The tokens leave existence on Ethereum, and the transaction records where they should reappear.",
          chip: { kind: "sim", text: "Example route: Ethereum → Solana · no real transfer" },
        },
        {
          t: 0.34,
          side: "l",
          head: "Step 2 · Attest",
          l1: "Circle signs a message that says: this burn really happened.",
          l2: "Circle's attestation service (called Iris) watches the source chain and signs once the burn is confirmed. Fast Transfer signs as soon as the block lands — about 20 seconds from Ethereum — for a fee of 0.01%. Standard waits for full finality, about 15–19 minutes from Ethereum.",
        },
        {
          t: 0.55,
          side: "r",
          head: "What travels is a message, not money.",
          l1: "For these seconds or minutes the 1,000 USDC exists nowhere. There is only a signed promise in flight.",
          insight: "CCTP has no bridge vault in the middle — the place hackers usually attack. Instead, all trust sits in one spot: Circle's signature. Without it, nothing is minted. In 2025, more than $41 billion moved this way, 3.7× the year before.",
        },
        {
          t: 0.8,
          side: "l",
          head: "Step 3 · Mint",
          l1: "Solana checks Circle's signature and creates 1,000 brand-new USDC.",
          l2: "Anyone can deliver the signed message to the destination contract (receiveMessage). Total supply is back where it was: −1,000 on Ethereum, +1,000 on Solana.",
          deep: [
            "CCTP V2 launched in March 2025 on Ethereum, Avalanche and Base; Solana joined V2 in October 2025.",
            "Fees: Standard Transfer has no Circle fee on most routes (you still pay network gas). Fast Transfer adds a Circle fee set per source chain — 1 basis point from Ethereum or Solana.",
            "The destination USDC is native: the same token Circle issues there directly, not a wrapped copy.",
          ],
        },
        {
          t: 0.95,
          side: "c",
          head: "Burn-and-mint vs lock-and-mint",
          l1: "Why it matters which road your USDC took.",
        },
      ],
    },
  ],
  upcoming: [
    { num: "02", title: "The minting machine" },
    { num: "04", title: "The internet of dollars" },
    { num: "06", title: "The one-dollar question" },
    { num: "07", title: "X-ray: the hidden control layer" },
    { num: "08", title: "When the peg breaks" },
    { num: "09", title: "Back to the real world" },
  ],
  hud: {
    eth: "Ethereum",
    sol: "Solana",
    flight: "In flight (signed message)",
    total: "USDC in existence (this transfer)",
    burned: "Burned",
    attested: "Attested",
    minted: "Minted",
    change: "Net change in total supply",
    route: "Ethereum → Solana · CCTP",
    confirm: "Transfer complete",
  },
  vault: {
    cover: "Coverage",
    reserves: "Reserves",
    usdc: "USDC owed",
    normal: "Normal day · reported 12 Nov 2026",
    stress: "A bank freezes the cash for a weekend",
    stressNote: "Simulated: if all ≈ $8.0B of bank cash were stuck, the assets that can reach holders quickly would cover ≈ 88% for a while. In March 2023, $3.3B of ≈ $40B was stuck at SVB and USDC briefly traded near $0.87.",
    liquid: "Reachable now",
  },
  compare: {
    title: "Two ways to cross",
    cctp: "CCTP · burn and mint",
    bridge: "Typical bridge · lock and mint",
    cctpSteps: ["Burn on chain A", "Circle signs", "Native USDC minted on chain B"],
    bridgeSteps: ["USDC locked in a bridge vault", "Bridge mints an IOU", "Wrapped token (e.g. USDC.e) on chain B"],
    cctpRisk: "You hold real USDC on both sides. Trust: Circle's attestation key.",
    bridgeRisk: "You hold an IOU on the bridge's vault. If the vault is hacked, the IOU can lose its value.",
  },
  labels: {
    note: "ONE DOLLAR · ILLUSTRATIVE",
    paper: "Cotton-linen paper",
    hours: "Moves on bank hours",
    days: "1–5 days abroad",
    token: "1.000000 USDC · 6 decimals",
    anyhour: "24 / 7",
    repo: "Overnight repo · $39.9B",
    tbill: "T-bills < 3 months · $20.1B",
    bank: "Systemic banks · $7.4B",
    other: "Other banks · $0.6B",
    fund: "Circle Reserve Fund",
    pool: "Shared pool",
    tokens: "USDC holders",
    source: "Source · Ethereum",
    dest: "Destination · Solana",
    gate: "Attestation",
  },
  sys: {
    issuer: ["ISSUER", "Circle Internet Group · NYSE: CRCL"],
    contract: ["CONTRACT", "FiatToken · mint / burn by Circle-controlled minters"],
    redeem: ["REDEMPTION", "1:1 for eligible Circle Mint customers"],
    notins: ["NOT", "FDIC-insured · legal tender · a CBDC"],
    repo: ["RESERVE · 58.6%", "Overnight reverse Treasury repo · $39.9B"],
    tbill: ["RESERVE · 29.5%", "U.S. Treasuries < 3 months · $20.1B"],
    bank: ["RESERVE · 10.9%", "Deposits at systemically important banks · $7.4B"],
    other: ["RESERVE · 0.9%", "Other bank deposits · $0.6B"],
    fund: ["WRAPPER", "Circle Reserve Fund (USDXX) · BlackRock · SEC Rule 2a-7 · Circle sole shareholder"],
    pool: ["CLAIM", "67.9B USDC → claim on the whole pool, not on any asset"],
    report: ["REPORTING", "Weekly balances · 12 Nov 2026"],
    burn: ["SOURCE CALL", "TokenMessenger.depositForBurn()"],
    iris: ["ATTESTER", "Circle Iris · signs the burn message"],
    mint: ["DESTINATION CALL", "MessageTransmitter.receiveMessage()"],
    fast: ["MODE", "Fast: sign at block inclusion · fee 1 bps"],
    std: ["MODE", "Standard: sign at hard finality · ~15–19 min from Ethereum"],
  },
};

export const vi: Dict = {
  meta: { title: "Hành trình của một đồng đô số — USDC" },
  ui: {
    project: "Hành trình của một đồng đô số",
    subtitle: "Đi theo dòng tiền. Xem điều gì diễn ra phía sau mỗi đồng USDC.",
    question: "Một đồng đô đi từ ngân hàng vào thế giới blockchain — rồi quay về — như thế nào?",
    scroll: "Cuộn để đi theo đồng đô",
    cinematic: "Điện ảnh",
    system: "Hệ thống",
    viewHint: "X-RAY: chuyển sang chế độ Hệ thống để thấy các đơn vị và cơ chế thật",
    l2: "Cách nó vận hành",
    deep: "Đào sâu",
    insight: "Đáng chú ý",
    data: "Số liệu công bố",
    sim: "Minh hoạ",
    metaphor: "Vật thể phát sáng chỉ là hình ảnh ẩn dụ. USDC có thể thay thế cho nhau: không đồng nào gắn với một tờ tiền cụ thể, và không có đồng đô nào thật sự “đi” xuyên hệ thống. Ta theo một đơn vị giá trị để nhìn thấy cỗ máy.",
    preview: "Bản duyệt · 3 cảnh chính",
    previewBody: "Bạn vừa xem cảnh 01, 03 và 05 — đồng đô biến hình, két dự trữ và cổng xuyên chuỗi. Sáu cảnh còn lại sẽ được chèn vào giữa, dùng cùng hệ thống camera.",
    next: "Sẽ có trong bản đầy đủ",
    replay: "Xem lại từ đầu",
    sources: "Nguồn",
    disclaimer: "Nội dung giáo dục, không phải lời khuyên tài chính. Số liệu mô phỏng đều được ghi rõ. Không có giao dịch thật nào được thực hiện. Số liệu dự trữ theo báo cáo ngày 12/11/2026 và thay đổi hằng tuần.",
    credits: "Logo USDC © Circle Internet Group, dùng để nhận diện. Tờ tiền là hình minh hoạ tự vẽ, không phải mẫu tiền thật.",
    nowebgl: "Trình duyệt của bạn không hiển thị được thế giới 3D, nên đây là bản rút gọn.",
  },
  scenes: [
    {
      id: "s01",
      num: "01",
      kicker: "Khi đồng tiền hoá thành dữ liệu",
      title: "Nếu một đồng đô có thể đi như dữ liệu thì sao?",
      beats: [
        {
          t: 0.13,
          side: "l",
          l1: "Đây là một đô la. Suốt trăm năm, nó đi theo cách của ngân hàng: chỉ trong ngày làm việc, chỉ trong hệ thống của họ, và mất vài ngày nếu chuyển ra nước ngoài.",
        },
        {
          t: 0.36,
          side: "r",
          head: "Tờ giấy thành dòng mã.",
          l1: "USDC viết lại đồng đô đó thành một token — một số dư trên blockchain, chuyển được bất kỳ giờ nào, tới bất kỳ ai có địa chỉ ví.",
          l2: "USDC là stablecoin do Circle, một công ty Mỹ niêm yết ở New York, phát hành. Mỗi token nhắm giá đúng 1 đô la Mỹ, và khách hàng doanh nghiệp đủ điều kiện của Circle có thể đổi lại lấy 1 đô.",
          chip: { kind: "data", text: "≈ 67,9 tỷ USDC đang lưu hành · 12/11/2026" },
        },
        {
          t: 0.6,
          side: "l",
          head: "Không phải tiền gửi ngân hàng. Không phải đô của Fed.",
          l1: "Tiền trong tài khoản ngân hàng là lời hứa của ngân hàng, thường được bảo hiểm tới 250.000 đô. Một đồng đô số do Cục Dự trữ Liên bang phát hành sẽ là lời hứa của nhà nước. USDC là lời hứa của Circle, đảm bảo bằng một quỹ dự trữ chung — và không có bảo hiểm tiền gửi.",
          deep: [
            "Ai phát hành: Circle Internet Group (mã CRCL trên sàn NYSE). Circle tạo USDC mới khi khách gửi đô vào, và đốt USDC khi trả đô ra.",
            "Nằm ở đâu: Circle phát hành USDC gốc trên 30 blockchain (tính đến 6/2/2026), trong đó có Ethereum, Solana và Base.",
            "Không phải là: tiền gửi được bảo hiểm, tiền pháp định, hay tiền số của ngân hàng trung ương.",
          ],
          insight: "USDC bận rộn hơn là to lớn. Trong quý 3/2026, Circle tạo mới khoảng 104 tỷ đô USDC và cũng huỷ khoảng 104 tỷ — trong khi tổng lượng lưu hành gần như đứng yên. Tiền đổ vào và rút ra khỏi hệ thống này mỗi ngày.",
        },
        {
          t: 0.8,
          side: "c",
          head: "Đi theo đồng đô.",
          l1: "Xuống chiếc két đang bảo chứng cho nó, rồi qua cánh cổng giữa các blockchain.",
        },
      ],
    },
    {
      id: "s03",
      num: "03",
      kicker: "Két dự trữ",
      title: "Tiền thật phía sau USDC nằm ở đâu?",
      beats: [
        {
          t: 0.1,
          side: "l",
          l1: "Dưới mỗi đồng USDC là một chiếc két. Trong đó gần như không có tờ tiền nào. Chỉ có những khoản cho vay ngắn hạn — cho chính phủ Mỹ và cho các ngân hàng lớn nhất.",
          chip: { kind: "data", text: "Dự trữ ≈ 68,1 tỷ đô so với ≈ 67,9 tỷ USDC · 12/11/2026" },
        },
        {
          t: 0.36,
          side: "r",
          head: "≈ 39,9 tỷ đô · cho vay qua đêm",
          l1: "Khối lớn nhất, khoảng 59%. Mỗi tối, số tiền này được cho các ngân hàng lớn vay, đổi lại họ gửi trái phiếu Chính phủ Mỹ làm tài sản bảo đảm. Sáng hôm sau tiền quay về — rồi lại được cho vay tiếp.",
          l2: "Giới tài chính gọi đây là hợp đồng mua lại đảo ngược qua đêm (reverse repo). Nó đáo hạn sau một ngày và được bảo đảm bằng trái phiếu Chính phủ Mỹ.",
          deep: [
            "Vì sao giữ: có lãi, và mỗi ngày đều quay lại thành tiền mặt.",
            "Rủi ro: phụ thuộc vào ngân hàng ở phía bên kia và việc giữ tài sản bảo đảm đúng cách. Nếu một ngân hàng sụp, Circle giữ lại trái phiếu — rồi phải bán chúng đi.",
          ],
        },
        {
          t: 0.5,
          side: "l",
          head: "≈ 20,1 tỷ đô · tín phiếu Kho bạc",
          l1: "Khoảng 30% nằm trong giấy nợ của Chính phủ Mỹ, được trả lại trong vòng ba tháng.",
          l2: "Vì đáo hạn rất sớm, giá của chúng gần như không đổi khi lãi suất thay đổi, nên có thể bán nhanh với giá sát mệnh giá.",
          deep: ["Rủi ro: nhỏ, nhưng không bằng 0. Bán vài chục tỷ đô trong lúc hoảng loạn vẫn có thể mất chút ít, và tiền chỉ về sau kỳ thanh toán kế tiếp."],
        },
        {
          t: 0.62,
          side: "r",
          head: "≈ 8,0 tỷ đô · tiền gửi ngân hàng",
          l1: "Khoảng 12% là tiền mặt, sẵn sàng cho những ngày nhiều người cùng muốn đổi USDC lấy đô.",
          l2: "≈ 7,4 tỷ đô nằm ở các ngân hàng “quan trọng mang tính hệ thống” — những ngân hàng khổng lồ mà cơ quan quản lý coi là quá quan trọng để sụp. ≈ 0,6 tỷ ở các ngân hàng khác.",
          deep: ["Rủi ro: tiền gửi vượt hạn mức bảo hiểm có thể bị kẹt nếu ngân hàng sụp. Đó chính xác là điều đã xảy ra với USDC vào tháng 3/2023."],
        },
        {
          t: 0.74,
          side: "l",
          head: "Một quỹ chung, không phải hàng triệu ngăn tủ.",
          l1: "Phần lớn các khoản cho vay và tín phiếu nằm trong một quỹ — Circle Reserve Fund, do BlackRock quản lý. Không đồng USDC nào sở hữu riêng một tờ tín phiếu. Mỗi token là quyền đòi trên toàn bộ quỹ.",
          l2: "Quỹ này đăng ký với Uỷ ban Chứng khoán Mỹ (SEC) dưới dạng quỹ thị trường tiền tệ chính phủ (mã USDXX). Circle là cổ đông duy nhất, và danh mục được công bố mỗi ngày làm việc.",
          insight: "Hơn một nửa số tiền phía sau USDC được cho vay qua đêm — đêm nào cũng vậy. Chiếc két giống một cỗ máy cho vay rồi thu về mỗi 24 giờ hơn là một két sắt. Cỗ máy đó cũng là việc kinh doanh của Circle: thu nhập từ dự trữ đạt 657,6 triệu đô trong quý 3/2026, khoảng 76% doanh thu.",
        },
        {
          t: 0.84,
          side: "r",
          head: "Có đủ không?",
          l1: "Ngày bình thường thì dư một chút. Câu hỏi thật là: vào ngày xấu, dự trữ biến thành tiền mặt nhanh đến đâu.",
          chip: { kind: "sim", text: "Kịch bản căng thẳng bên dưới là mô phỏng" },
        },
      ],
    },
    {
      id: "s05",
      num: "05",
      kicker: "Cổng xuyên chuỗi",
      title: "USDC đi từ blockchain này sang blockchain khác bằng cách nào?",
      beats: [
        {
          t: 0.08,
          side: "l",
          l1: "Các blockchain không nhìn thấy nhau. Ethereum không biết gì về những gì xảy ra trên Solana. Nên “chuyển” USDC giữa chúng thực ra là hai sự kiện riêng biệt — và phải có ai đó xác nhận rằng sự kiện đầu tiên đã xảy ra.",
        },
        {
          t: 0.21,
          side: "r",
          head: "Bước 1 · Đốt",
          l1: "1.000 USDC trên Ethereum bị huỷ. Không phải gửi đi — mà bị huỷ.",
          l2: "Người gửi gọi hợp đồng của Circle (depositForBurn). Token biến mất khỏi Ethereum, và giao dịch ghi lại nơi chúng sẽ xuất hiện lại.",
          chip: { kind: "sim", text: "Tuyến ví dụ: Ethereum → Solana · không có giao dịch thật" },
        },
        {
          t: 0.34,
          side: "l",
          head: "Bước 2 · Xác nhận",
          l1: "Circle ký một thông điệp: lệnh đốt này là thật.",
          l2: "Dịch vụ xác nhận của Circle (tên là Iris) theo dõi chuỗi nguồn và ký khi lệnh đốt được xác nhận. Fast Transfer ký ngay khi khối được ghi — khoảng 20 giây từ Ethereum — với phí 0,01%. Standard chờ giao dịch chốt hẳn, khoảng 15–19 phút từ Ethereum.",
        },
        {
          t: 0.55,
          side: "r",
          head: "Thứ đi qua cổng là thông điệp, không phải tiền.",
          l1: "Trong vài giây hay vài phút này, 1.000 USDC không tồn tại ở đâu cả. Chỉ có một lời hứa đã được ký đang trên đường đi.",
          insight: "CCTP không có két của cầu nối ở giữa — nơi hacker thường nhắm tới. Đổi lại, toàn bộ niềm tin dồn vào một điểm: chữ ký của Circle. Không có chữ ký, không gì được tạo ra. Năm 2025, hơn 41 tỷ đô đã đi qua con đường này, gấp 3,7 lần năm trước.",
        },
        {
          t: 0.8,
          side: "l",
          head: "Bước 3 · Tạo mới",
          l1: "Solana kiểm tra chữ ký của Circle và tạo ra 1.000 USDC hoàn toàn mới.",
          l2: "Ai cũng có thể mang thông điệp đã ký tới hợp đồng ở chuỗi đích (receiveMessage). Tổng cung trở lại như cũ: −1.000 trên Ethereum, +1.000 trên Solana.",
          deep: [
            "CCTP V2 ra mắt tháng 3/2025 trên Ethereum, Avalanche và Base; Solana có V2 từ tháng 10/2025.",
            "Phí: Standard Transfer không thu phí của Circle trên hầu hết các tuyến (vẫn trả phí mạng). Fast Transfer có thêm phí Circle tuỳ chuỗi nguồn — 0,01% nếu đi từ Ethereum hoặc Solana.",
            "USDC ở chuỗi đích là USDC gốc: chính loại token Circle phát hành trực tiếp ở đó, không phải bản sao bọc lại.",
          ],
        },
        {
          t: 0.95,
          side: "c",
          head: "Đốt-rồi-tạo và khoá-rồi-tạo",
          l1: "Vì sao USDC của bạn đi đường nào lại quan trọng.",
        },
      ],
    },
  ],
  upcoming: [
    { num: "02", title: "Cỗ máy đúc tiền" },
    { num: "04", title: "Internet của đồng đô" },
    { num: "06", title: "Câu hỏi một đô la" },
    { num: "07", title: "X-ray: lớp kiểm soát ẩn" },
    { num: "08", title: "Khi neo giá bị gãy" },
    { num: "09", title: "Trở về thế giới thật" },
  ],
  hud: {
    eth: "Ethereum",
    sol: "Solana",
    flight: "Đang trên đường (thông điệp đã ký)",
    total: "USDC đang tồn tại (của lệnh này)",
    burned: "Đã đốt",
    attested: "Đã xác nhận",
    minted: "Đã tạo",
    change: "Thay đổi ròng của tổng cung",
    route: "Ethereum → Solana · CCTP",
    confirm: "Hoàn tất chuyển",
  },
  vault: {
    cover: "Độ phủ",
    reserves: "Dự trữ",
    usdc: "USDC phải trả",
    normal: "Ngày bình thường · báo cáo 12/11/2026",
    stress: "Một ngân hàng giữ kẹt tiền mặt qua cuối tuần",
    stressNote: "Mô phỏng: nếu toàn bộ ≈ 8,0 tỷ đô tiền gửi ngân hàng bị kẹt, phần tài sản đến tay người giữ nhanh được chỉ phủ khoảng 88% trong một thời gian. Tháng 3/2023, 3,3 tỷ trong ≈ 40 tỷ đô bị kẹt ở SVB và USDC có lúc chỉ còn khoảng 0,87 đô.",
    liquid: "Lấy ra được ngay",
  },
  compare: {
    title: "Hai cách để qua cầu",
    cctp: "CCTP · đốt rồi tạo",
    bridge: "Cầu nối thông thường · khoá rồi tạo",
    cctpSteps: ["Đốt trên chuỗi A", "Circle ký xác nhận", "Tạo USDC gốc trên chuỗi B"],
    bridgeSteps: ["USDC bị khoá trong két của cầu", "Cầu tạo ra một giấy nợ", "Token bọc (vd. USDC.e) trên chuỗi B"],
    cctpRisk: "Bạn giữ USDC thật ở cả hai bên. Niềm tin đặt vào: khoá ký của Circle.",
    bridgeRisk: "Bạn giữ giấy nợ trên két của cầu. Nếu két bị hack, giấy nợ có thể mất giá trị.",
  },
  labels: {
    note: "MỘT ĐÔ LA · MINH HOẠ",
    paper: "Giấy cotton-lanh",
    hours: "Chỉ chạy giờ hành chính",
    days: "1–5 ngày ra nước ngoài",
    token: "1.000000 USDC · 6 số lẻ",
    anyhour: "24 / 7",
    repo: "Cho vay qua đêm · 39,9 tỷ $",
    tbill: "Tín phiếu < 3 tháng · 20,1 tỷ $",
    bank: "Ngân hàng lớn · 7,4 tỷ $",
    other: "Ngân hàng khác · 0,6 tỷ $",
    fund: "Circle Reserve Fund",
    pool: "Quỹ chung",
    tokens: "Người giữ USDC",
    source: "Nguồn · Ethereum",
    dest: "Đích · Solana",
    gate: "Xác nhận",
  },
  sys: {
    issuer: ["BÊN PHÁT HÀNH", "Circle Internet Group · NYSE: CRCL"],
    contract: ["HỢP ĐỒNG", "FiatToken · chỉ minter do Circle kiểm soát được tạo / đốt"],
    redeem: ["ĐỔI LẠI", "1:1 cho khách hàng Circle Mint đủ điều kiện"],
    notins: ["KHÔNG PHẢI", "tiền gửi có bảo hiểm · tiền pháp định · CBDC"],
    repo: ["DỰ TRỮ · 58,6%", "Reverse repo qua đêm bảo đảm bằng trái phiếu Mỹ · 39,9 tỷ $"],
    tbill: ["DỰ TRỮ · 29,5%", "Tín phiếu Kho bạc Mỹ < 3 tháng · 20,1 tỷ $"],
    bank: ["DỰ TRỮ · 10,9%", "Tiền gửi ở ngân hàng quan trọng hệ thống · 7,4 tỷ $"],
    other: ["DỰ TRỮ · 0,9%", "Tiền gửi ngân hàng khác · 0,6 tỷ $"],
    fund: ["LỚP BỌC", "Circle Reserve Fund (USDXX) · BlackRock · SEC Rule 2a-7 · Circle là cổ đông duy nhất"],
    pool: ["QUYỀN ĐÒI", "67,9 tỷ USDC → đòi trên cả quỹ, không gắn với tài sản nào"],
    report: ["BÁO CÁO", "Số dư hằng tuần · 12/11/2026"],
    burn: ["LỆNH Ở CHUỖI NGUỒN", "TokenMessenger.depositForBurn()"],
    iris: ["BÊN XÁC NHẬN", "Circle Iris · ký thông điệp đốt"],
    mint: ["LỆNH Ở CHUỖI ĐÍCH", "MessageTransmitter.receiveMessage()"],
    fast: ["CHẾ ĐỘ", "Fast: ký khi khối được ghi · phí 1 bps"],
    std: ["CHẾ ĐỘ", "Standard: ký khi chốt hẳn · ~15–19 phút từ Ethereum"],
  },
};

export { sources };
export type { Dict };
