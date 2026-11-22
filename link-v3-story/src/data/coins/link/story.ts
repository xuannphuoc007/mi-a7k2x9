/** LINK, explained with a pawnshop and the price of gold — beginner edition.
 * Each beat: a short title, one or two plain sentences, an everyday comparison (life),
 * and optionally the real technical name (term) for readers who want it.
 * Narrator: Khoa, who runs a small lending app (fictional). Sources in references.ts. */
export type Beat = { title: string; body: string[]; life?: string; term?: string; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "A pawnshop behind glass",
    title: "A pawnshop that can't see outside",
    question: "How can a lending app know today's price?",
    figure: "A pawnshop counter inside a glass room. A customer hands over 1 ETH. The machine behind the counter shows a question mark where the price should be.",
    beats: [
      {
        title: "Khoa runs a pawnshop — on the internet.",
        body: ["Customers leave 1 ETH as a pledge and borrow dollars. The app is a program that runs by itself on a blockchain, with no staff."],
        life: "Like a pawnshop: you leave gold, you borrow cash.",
      },
      {
        title: "To lend safely, it needs today's price.",
        body: ["If ETH is worth $3,000, the app may lend $2,000. If the price drops, it must know at once."],
        life: "A pawnshop must know today's gold price before handing out cash.",
      },
      {
        title: "But the blockchain is a sealed glass room.",
        body: ["Programs on a blockchain can only see what is already written inside. They cannot open a website or phone an exchange."],
        life: "A shop with no windows, no phone and no internet.",
        term: "Real name: smart contracts can't read off-chain data.",
      },
    ],
  },
  {
    label: "Someone to bring the price",
    title: "Someone has to bring the price in",
    question: "Who tells the glass room what gold costs today?",
    figure: "A messenger walks from a gold shop to the glass room carrying a price slip. A second scene: a dishonest messenger brings a fake price and the shop lends too much.",
    beats: [
      {
        title: "That person is called a price messenger.",
        body: ["Someone outside checks the price and writes it into the blockchain."],
        life: "A runner who goes to the gold shop and comes back with the price.",
        term: "Real name: an oracle.",
      },
      {
        title: "One messenger is risky.",
        body: ["If that one person lies, falls asleep or is bribed, the app lends the wrong amount and someone loses money."],
        life: "One wrong price slip and the pawnshop hands out far too much cash.",
      },
      {
        title: "Chainlink: many independent messengers.",
        body: ["Chainlink is a network of many separate companies doing this job together, so no single one can cheat or stop the service."],
        life: "Instead of trusting one runner, you send nine who don't work for each other.",
        insight: "Real companies run Chainlink messengers, including Swisscom and Deutsche Telekom.",
      },
    ],
  },
  {
    label: "Ask nine shops",
    title: "Ask nine shops, keep the middle price",
    question: "If nine messengers bring nine prices, which one is right?",
    figure: "Nine messengers each visit a different gold shop. Their prices are lined up; one strange price is thrown out; the middle one is chosen; all nine sign one slip; only that slip enters the glass room.",
    beats: [
      {
        title: "① Each one checks a different shop.",
        body: ["Every messenger collects prices from its own sources, such as different exchanges."],
        life: "Nine runners, nine gold shops.",
      },
      {
        title: "② Line the prices up, keep the middle.",
        body: ["The prices are sorted and the middle one is chosen. A crazy price at the edge is simply ignored."],
        life: "If eight shops say 100 and one says 92, you don't believe the 92.",
        term: "Real name: the median.",
      },
      {
        title: "③ All of them sign one slip.",
        body: ["Instead of nine separate notes, they agree on one price slip and most of them sign it. The blockchain checks the signatures."],
        life: "One receipt with many stamps is harder to fake than one stamp.",
      },
      {
        title: "④ Only one slip goes in — so it's cheap.",
        body: ["Writing to a blockchain costs a fee. Sending one signed slip instead of nine cut the messengers' fees by up to 90% (since 2021)."],
        life: "One courier trip instead of nine.",
        term: "Real name: Off-Chain Reporting (OCR).",
      },
    ],
  },
  {
    label: "Price board or phone call",
    title: "A price board, or a phone call?",
    question: "When does the new price arrive?",
    figure: "Left: a price board on the wall that changes when the price moves enough or every hour. Right: a customer phones for the price at the exact moment of buying.",
    beats: [
      {
        title: "The price board on the wall.",
        body: ["The ETH price is updated when it moves 0.5% — or at least every hour. Enough for a pawnshop like Khoa's."],
        life: "The gold price board in a shop window.",
        term: "Real name: Data Feeds (push).",
      },
      {
        title: "The phone call.",
        body: ["Fast trading apps can't wait an hour. They ask for a fresh, signed price at the exact moment of a trade — in under a second."],
        life: "Calling the shop to ask \"what's the price right now?\" just before you buy.",
        term: "Real name: Data Streams (pull).",
      },
      {
        title: "Same signatures, different delivery.",
        body: ["Both prices are signed by many messengers. The board is always there; the call is faster and paid only when used."],
      },
    ],
  },
  {
    label: "No shop of its own",
    title: "Chainlink owns no shop",
    question: "Is Chainlink a blockchain like Ethereum or Solana?",
    figure: "Five glass rooms — Ethereum, Solana, Base, Arbitrum, BNB Chain — each served by the same team of messengers. Chainlink has no room of its own.",
    takeaway: "Chainlink is not a blockchain. It is a service that works for many blockchains. LINK is how that service gets paid.",
    beats: [
      {
        title: "Chainlink is not a blockchain.",
        body: ["Ethereum, Solana and BNB Chain are \"shops\". Chainlink has no shop of its own — its messengers serve dozens of shops at once."],
        life: "Like a delivery company: it owns no stores, it serves all of them.",
      },
      {
        title: "LINK is the messengers' pay.",
        body: ["LINK is a token that lives on Ethereum. It is used to pay for Chainlink's work and as a deposit messengers put up."],
        life: "The wage you pay the runners.",
      },
      {
        title: "So it earns differently.",
        body: ["ETH, SOL and BNB earn when people use their blockchain. LINK only earns when someone pays for a Chainlink service."],
        life: "ETH is like rent for the shop; LINK is like the delivery fee.",
        insight: "That is why the network can be busy while the LINK price stays weak — see chapter 9.",
      },
    ],
  },
  {
    label: "Checking safes, drawing lots",
    title: "Checking the safe, drawing lots",
    question: "What else can the messengers bring in?",
    figure: "A messenger opens a safe and reports how much is inside; a coin printer stops when the safe isn't full enough. Then a lottery box: the winning number comes with a sealed certificate.",
    beats: [
      {
        title: "Checking the safe.",
        body: ["Some coins promise to be backed by dollars or gold in a safe. Messengers report how much is really in the safe."],
        life: "An inspector who counts the gold in the vault and posts the number.",
        term: "Real name: Proof of Reserve.",
      },
      {
        title: "Not enough in the safe? No new coins.",
        body: ["The coin's program can refuse to print more if the safe doesn't hold enough. Issuers such as 21Shares use this."],
        life: "The printer locks when the vault count is too low.",
      },
      {
        title: "Fair lottery draws.",
        body: ["Blockchains can't roll dice by themselves. Chainlink brings a random number with a proof; if anyone changes the number, the proof fails."],
        life: "A lottery drawn with a sealed certificate anyone can check.",
        term: "Real name: VRF (verifiable randomness).",
      },
    ],
  },
  {
    label: "A border with two checkpoints",
    title: "Moving money between shops",
    question: "How do you move money from one blockchain to another safely?",
    figure: "Two glass rooms joined by a border crossing with two separate checkpoints. Money passes only when both agree; the second checkpoint can close the gate.",
    takeaway: "Chainlink's transfer service has a second, separate checkpoint that must approve every batch — and can shut the gate if something looks wrong.",
    beats: [
      {
        title: "Old bridges were robbed.",
        body: ["In 2022 thieves stole $624 million from Ronin, $325 million from Wormhole and $190 million from Nomad — all \"bridges\" between blockchains."],
        life: "A border with one sleepy guard.",
      },
      {
        title: "Two checkpoints that don't share anything.",
        body: ["In Chainlink's version, one team checks the money, then a second, separate team checks it again with different software. Both must agree."],
        life: "Two customs posts run by different staff, using different machines.",
        term: "Real name: CCIP and its Risk Management Network.",
      },
      {
        title: "The second checkpoint can close the gate.",
        body: ["If it sees something strange, it stops all transfers until the problem is fixed. After other bridges were hacked, projects with over $3 billion moved here."],
        life: "A red barrier that drops across every lane.",
      },
    ],
  },
  {
    label: "Deposit and alarm",
    title: "A deposit — and an alarm bell",
    question: "What if a messenger stops working?",
    figure: "Messengers put LINK into a deposit box. The price board stays frozen; a clock reaches three hours; someone rings the bell; each messenger loses 700 LINK and the person who rang gets 7,000 LINK.",
    beats: [
      {
        title: "Messengers leave a deposit.",
        body: ["To take the job, messengers lock up LINK as a deposit. Ordinary holders can add LINK too."],
        life: "A courier leaves a deposit before taking parcels.",
        term: "Real name: staking (up to 45 million LINK).",
      },
      {
        title: "Frozen for 3 hours? Ring the bell.",
        body: ["If the ETH price on Ethereum isn't updated for more than three hours, anyone in the deposit pool can ring the alarm."],
        life: "The price board hasn't changed all afternoon.",
      },
      {
        title: "Fine for them, reward for you.",
        body: ["Each messenger on that job loses 700 LINK; whoever rang the bell gets 7,000 LINK. Ordinary holders are not fined."],
        life: "Late couriers lose part of their deposit; the person who reported it gets a bonus.",
        insight: "So far this covers one price (ETH/USD) and the fine is small — a start, not full insurance.",
      },
    ],
  },
  {
    label: "LINK in, LINK out",
    title: "The LINK token: money in, money out",
    question: "Does more use mean a higher LINK price?",
    figure: "A piggy bank fills slowly with LINK bought from fees. Next to it, a much wider tap pours LINK out of the company's wallets onto an exchange.",
    takeaway: "Usage now buys LINK — but about 14 times more LINK flows out to the market than the piggy bank buys.",
    beats: [
      {
        title: "Only 1 billion LINK will ever exist.",
        body: ["All were created in 2017: 35% sold to the public (about $32 million), 35% kept for messengers and the ecosystem, 30% kept by the company."],
        life: "A fixed box of 1 billion tokens.",
      },
      {
        title: "Fees are turned into LINK and saved.",
        body: ["Customers can pay in other currencies; the fees are automatically turned into LINK and put in a reserve. By 13 November 2026 it held about 6.68 million LINK."],
        life: "A piggy bank that fills a little every day.",
        term: "Real name: Chainlink Reserve.",
      },
      {
        title: "But a bigger tap is open.",
        body: ["Each quarter about 19 million LINK leave the company's wallets, mostly to the Binance exchange — about 6 million a month, versus about 0.45 million a month going into the piggy bank."],
        life: "Filling a bucket with a cup while a hose drains it.",
        insight: "About 14 LINK out for every 1 LINK in.",
      },
    ],
  },
  {
    label: "From 2017 to today",
    title: "From 10 cents to today",
    question: "What happened to the LINK price?",
    figure: "A price line: 10 cents in 2017, $52.88 in 2021, a stuck price board during the LUNA crash in 2022, and $8.85 in November 2026.",
    beats: [
      {
        title: "2017: sold at about 10 cents.",
        body: ["The founders sold LINK to the public for roughly 9–11 cents each."],
      },
      {
        title: "2021: the peak — $52.88.",
        body: ["Lending apps boomed and all needed prices. On 10 May 2021 LINK hit $52.88 — about 580 times the sale price."],
      },
      {
        title: "2022: a price board got stuck.",
        body: ["When the LUNA coin crashed to $0.01, Chainlink's LUNA board kept showing its built-in minimum of $0.107. Attackers borrowed against the wrong price; the Venus app lost about $11 million."],
        life: "A shop's board still says gold is $100 after it fell to $10.",
        insight: "Lesson for apps like Khoa's: double-check the price and keep an emergency stop.",
      },
      {
        title: "2026: about $9.",
        body: ["On 15 November 2026 LINK closed at $8.85 — about 84% below the top — even though more banks and apps use Chainlink than ever."],
        insight: "Swift is testing it with 17 banks, UBS has done real transactions, and US investors can buy LINK funds (ETFs). Many bank projects are still trials.",
      },
    ],
  },
  {
    label: "In short",
    title: "In short",
    question: "Is Chainlink good? Is LINK a good buy?",
    figure: "Two rows: solid blue links for strengths, cracked red links for weaknesses; and the reminder that the service is not the same as the token.",
    beats: [
      {
        title: "What's strong.",
        body: ["Many independent messengers · one signed price · a second checkpoint for transfers · deposits that can be fined · used by most big lending apps and tested by banks."],
      },
      {
        title: "What's weak.",
        body: ["LINK only earns from services, and fees can be paid in other coins · about 19 million LINK released every quarter · one company still steers · faster rivals (Pyth, RedStone) · messengers can still be wrong (LUNA)."],
      },
      {
        title: "The service is not the token.",
        body: [
          "Khoa will use Chainlink prices, plus his own safety checks. If you buy LINK, you bet on the token, not just the service: watch the releases, the piggy bank and how much is paid in LINK. As of November 2026 Vietnam has no licensed crypto exchange. This is education, not investment advice.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Tiệm cầm đồ sau lớp kính",
    title: "Tiệm cầm đồ không nhìn ra ngoài",
    question: "Một ứng dụng cho vay làm sao biết giá hôm nay?",
    figure: "Một quầy cầm đồ nằm trong căn phòng kính. Khách đưa 1 ETH. Chiếc máy sau quầy hiện dấu chấm hỏi ở chỗ ghi giá.",
    beats: [
      {
        title: "Khoa mở một tiệm cầm đồ — trên mạng.",
        body: ["Khách để lại 1 ETH làm vật cầm cố rồi vay đô la. Ứng dụng là một chương trình tự chạy trên blockchain, không có nhân viên."],
        life: "Giống tiệm cầm đồ: bạn để lại vàng, bạn vay tiền mặt.",
      },
      {
        title: "Muốn cho vay an toàn, phải biết giá hôm nay.",
        body: ["Nếu 1 ETH đáng 3.000 USD, ứng dụng có thể cho vay 2.000 USD. Nếu giá giảm, nó phải biết ngay."],
        life: "Tiệm cầm đồ phải biết giá vàng hôm nay trước khi đưa tiền.",
      },
      {
        title: "Nhưng blockchain là một căn phòng kính kín.",
        body: ["Chương trình trên blockchain chỉ thấy những gì đã ghi sẵn bên trong. Nó không mở được trang web, không gọi được cho sàn."],
        life: "Một tiệm không cửa sổ, không điện thoại, không internet.",
        term: "Tên gọi thật: hợp đồng thông minh không đọc được dữ liệu bên ngoài chuỗi.",
      },
    ],
  },
  {
    label: "Người báo giá",
    title: "Phải có người mang giá vào",
    question: "Ai cho căn phòng kính biết giá vàng hôm nay?",
    figure: "Một người đưa tin đi từ tiệm vàng tới căn phòng kính, cầm tờ báo giá. Cảnh thứ hai: người đưa tin gian dối mang giá giả và tiệm cho vay quá tay.",
    beats: [
      {
        title: "Người đó gọi là người báo giá.",
        body: ["Một ai đó bên ngoài xem giá rồi ghi giá vào blockchain."],
        life: "Một người chạy ra tiệm vàng hỏi giá rồi quay về báo.",
        term: "Tên gọi thật: oracle.",
      },
      {
        title: "Chỉ một người thì rủi ro.",
        body: ["Nếu người đó nói dối, ngủ quên hay bị mua chuộc, ứng dụng cho vay sai và có người mất tiền."],
        life: "Một tờ báo giá sai là tiệm cầm đồ phát tiền quá tay.",
      },
      {
        title: "Chainlink: nhiều người báo giá độc lập.",
        body: ["Chainlink là mạng gồm nhiều công ty riêng biệt cùng làm việc này, nên không một bên nào gian lận hay làm dừng dịch vụ được."],
        life: "Thay vì tin một người, bạn cử chín người không làm cho nhau.",
        insight: "Các công ty thật đang chạy máy báo giá cho Chainlink, trong đó có Swisscom và Deutsche Telekom.",
      },
    ],
  },
  {
    label: "Hỏi chín tiệm vàng",
    title: "Hỏi chín tiệm, lấy giá ở giữa",
    question: "Chín người mang về chín mức giá, tin giá nào?",
    figure: "Chín người đưa tin mỗi người tới một tiệm vàng khác nhau. Các mức giá xếp hàng; một giá lạ bị bỏ; giá ở giữa được chọn; cả chín ký một tờ; chỉ tờ đó đi vào căn phòng kính.",
    beats: [
      {
        title: "① Mỗi người hỏi một tiệm khác nhau.",
        body: ["Mỗi người báo giá tự lấy giá từ nguồn riêng, ví dụ các sàn khác nhau."],
        life: "Chín người chạy, chín tiệm vàng.",
      },
      {
        title: "② Xếp giá theo thứ tự, lấy giá ở giữa.",
        body: ["Các mức giá được xếp hàng và lấy giá nằm giữa. Một giá vô lý ở rìa bị bỏ qua."],
        life: "Tám tiệm nói 100, một tiệm nói 92 — bạn không tin con số 92.",
        term: "Tên gọi thật: trung vị (median).",
      },
      {
        title: "③ Tất cả cùng ký một tờ.",
        body: ["Thay vì chín tờ riêng, họ thống nhất một tờ báo giá và đa số cùng ký. Blockchain tự kiểm tra các chữ ký."],
        life: "Một tờ biên nhận nhiều con dấu thì khó làm giả hơn một con dấu.",
      },
      {
        title: "④ Chỉ một tờ đi vào — nên rẻ.",
        body: ["Ghi lên blockchain phải trả phí. Gửi một tờ đã ký thay vì chín tờ giúp người báo giá giảm tới 90% phí (từ năm 2021)."],
        life: "Một chuyến giao thay vì chín chuyến.",
        term: "Tên gọi thật: Off-Chain Reporting (OCR).",
      },
    ],
  },
  {
    label: "Bảng giá hay gọi điện",
    title: "Bảng giá treo tường, hay gọi điện hỏi?",
    question: "Khi nào giá mới được đưa vào?",
    figure: "Bên trái: bảng giá trên tường đổi số khi giá lệch đủ nhiều hoặc mỗi giờ. Bên phải: khách gọi điện hỏi giá ngay lúc mua.",
    beats: [
      {
        title: "Bảng giá treo tường.",
        body: ["Giá ETH được cập nhật khi lệch 0,5% — hoặc ít nhất mỗi giờ một lần. Đủ dùng cho tiệm cầm đồ như của Khoa."],
        life: "Bảng giá vàng ở cửa tiệm.",
        term: "Tên gọi thật: Data Feeds (kiểu đẩy).",
      },
      {
        title: "Gọi điện hỏi giá.",
        body: ["Ứng dụng giao dịch nhanh không chờ được một giờ. Chúng xin một mức giá mới, có chữ ký, đúng lúc giao dịch — trong chưa tới một giây."],
        life: "Gọi cho tiệm hỏi \"giá bây giờ bao nhiêu?\" ngay trước khi mua.",
        term: "Tên gọi thật: Data Streams (kiểu kéo).",
      },
      {
        title: "Cùng chữ ký, khác cách giao.",
        body: ["Cả hai đều được nhiều người báo giá ký. Bảng giá thì luôn có sẵn; gọi điện thì nhanh hơn và chỉ trả tiền khi dùng."],
      },
    ],
  },
  {
    label: "Không có tiệm riêng",
    title: "Chainlink không có tiệm riêng",
    question: "Chainlink có phải là một blockchain như Ethereum hay Solana?",
    figure: "Năm căn phòng kính — Ethereum, Solana, Base, Arbitrum, BNB Chain — được cùng một đội người báo giá phục vụ. Chainlink không có phòng nào của riêng mình.",
    takeaway: "Chainlink không phải blockchain. Nó là dịch vụ làm việc cho nhiều blockchain. LINK là cách trả tiền cho dịch vụ đó.",
    beats: [
      {
        title: "Chainlink không phải blockchain.",
        body: ["Ethereum, Solana, BNB Chain là những \"tiệm\". Chainlink không có tiệm nào — đội của nó phục vụ hàng chục tiệm cùng lúc."],
        life: "Giống một công ty giao hàng: không sở hữu cửa hàng nào, nhưng phục vụ tất cả.",
      },
      {
        title: "LINK là tiền công của người báo giá.",
        body: ["LINK là một token nằm trên Ethereum. Nó dùng để trả công cho Chainlink và làm tiền đặt cọc của người báo giá."],
        life: "Tiền công bạn trả cho người chạy việc.",
      },
      {
        title: "Nên cách kiếm tiền cũng khác.",
        body: ["ETH, SOL, BNB thu tiền khi người ta dùng blockchain của họ. LINK chỉ thu khi có người trả tiền cho dịch vụ Chainlink."],
        life: "ETH giống tiền thuê mặt bằng; LINK giống phí giao hàng.",
        insight: "Vì vậy mạng có thể rất bận mà giá LINK vẫn yếu — xem chương 9.",
      },
    ],
  },
  {
    label: "Kiểm két & bốc thăm",
    title: "Kiểm két sắt, bốc thăm công bằng",
    question: "Người báo giá còn mang được gì vào nữa?",
    figure: "Một người kiểm tra mở két sắt và báo số tiền bên trong; máy in tiền dừng khi két không đủ. Sau đó là thùng bốc thăm: số trúng thưởng đi kèm một giấy chứng nhận niêm phong.",
    beats: [
      {
        title: "Kiểm két sắt.",
        body: ["Có những đồng coin hứa được bảo đảm bằng đô la hay vàng trong két. Người báo giá báo lên chuỗi trong két thật sự có bao nhiêu."],
        life: "Người kiểm kho đếm vàng trong két rồi dán con số ra ngoài.",
        term: "Tên gọi thật: Proof of Reserve.",
      },
      {
        title: "Két không đủ thì không in thêm.",
        body: ["Chương trình của đồng coin có thể từ chối in thêm nếu két không đủ. Các bên như 21Shares đang dùng cách này."],
        life: "Máy in tự khoá khi số đếm trong két quá thấp.",
      },
      {
        title: "Bốc thăm công bằng.",
        body: ["Blockchain không tự gieo xúc xắc được. Chainlink mang vào một con số ngẫu nhiên kèm bằng chứng; ai sửa con số là bằng chứng không khớp."],
        life: "Bốc thăm có giấy chứng nhận niêm phong ai cũng kiểm tra được.",
        term: "Tên gọi thật: VRF (số ngẫu nhiên kiểm chứng được).",
      },
    ],
  },
  {
    label: "Cửa khẩu hai trạm",
    title: "Chuyển tiền giữa các tiệm",
    question: "Làm sao chuyển tiền từ blockchain này sang blockchain khác cho an toàn?",
    figure: "Hai căn phòng kính nối bằng một cửa khẩu có hai trạm kiểm tra riêng biệt. Tiền chỉ qua khi cả hai đồng ý; trạm thứ hai có thể đóng cổng.",
    takeaway: "Dịch vụ chuyển tiền của Chainlink có trạm kiểm tra thứ hai, độc lập, phải duyệt từng lô — và có thể đóng cổng nếu thấy bất thường.",
    beats: [
      {
        title: "Những cây cầu cũ từng bị cướp.",
        body: ["Năm 2022 kẻ trộm lấy 624 triệu USD từ Ronin, 325 triệu từ Wormhole, 190 triệu từ Nomad — đều là \"cầu nối\" giữa các blockchain."],
        life: "Một cửa khẩu chỉ có một người gác đang ngủ gật.",
      },
      {
        title: "Hai trạm kiểm tra không dùng chung gì.",
        body: ["Với Chainlink, một đội kiểm tra tiền, rồi một đội khác, riêng biệt, kiểm lại bằng phần mềm khác. Cả hai phải đồng ý."],
        life: "Hai trạm hải quan, hai đội nhân viên, hai loại máy khác nhau.",
        term: "Tên gọi thật: CCIP và Risk Management Network.",
      },
      {
        title: "Trạm thứ hai có thể đóng cổng.",
        body: ["Thấy điều gì lạ, trạm này dừng mọi lệnh chuyển cho tới khi sửa xong. Sau khi các cầu khác bị hack, các dự án giữ hơn 3 tỷ USD đã chuyển sang đây."],
        life: "Một thanh chắn đỏ hạ xuống trên mọi làn.",
      },
    ],
  },
  {
    label: "Tiền cọc & còi báo động",
    title: "Tiền đặt cọc — và chiếc còi báo động",
    question: "Nếu người báo giá ngừng làm việc thì sao?",
    figure: "Người báo giá bỏ LINK vào hộp đặt cọc. Bảng giá đứng im; đồng hồ chạy tới ba giờ; có người bấm còi; mỗi người báo giá mất 700 LINK, người bấm còi nhận 7.000 LINK.",
    beats: [
      {
        title: "Người báo giá phải đặt cọc.",
        body: ["Muốn nhận việc, người báo giá khoá LINK làm tiền cọc. Người giữ LINK bình thường cũng có thể góp vào."],
        life: "Shipper đặt cọc trước khi nhận hàng đi giao.",
        term: "Tên gọi thật: staking (tối đa 45 triệu LINK).",
      },
      {
        title: "Đứng im 3 giờ? Bấm còi.",
        body: ["Nếu giá ETH trên Ethereum không được cập nhật quá ba giờ, bất kỳ ai trong quỹ đặt cọc đều có thể bấm báo động."],
        life: "Bảng giá không đổi số cả buổi chiều.",
      },
      {
        title: "Họ bị phạt, bạn được thưởng.",
        body: ["Mỗi người báo giá phụ trách việc đó mất 700 LINK; người bấm còi nhận 7.000 LINK. Người giữ LINK bình thường không bị phạt."],
        life: "Shipper giao trễ bị trừ cọc; người báo lại được thưởng.",
        insight: "Hiện mới áp cho một mức giá (ETH/USD) và mức phạt còn nhỏ — là bước đầu, chưa phải bảo hiểm đầy đủ.",
      },
    ],
  },
  {
    label: "LINK vào & LINK ra",
    title: "Token LINK: tiền vào, tiền ra",
    question: "Dùng nhiều hơn có làm giá LINK tăng?",
    figure: "Một con heo đất được bỏ thêm LINK mua từ tiền phí, từ từ đầy lên. Bên cạnh, một vòi nước to hơn nhiều xả LINK từ ví công ty ra sàn.",
    takeaway: "Lượng dùng giờ đã mua LINK — nhưng LINK chảy ra thị trường nhiều gấp khoảng 14 lần số bỏ vào heo đất.",
    beats: [
      {
        title: "Chỉ có đúng 1 tỷ LINK.",
        body: ["Tất cả được tạo năm 2017: 35% bán ra công chúng (khoảng 32 triệu USD), 35% để dành cho người báo giá và hệ sinh thái, 30% công ty giữ."],
        life: "Một hộp cố định 1 tỷ token.",
      },
      {
        title: "Tiền phí đổi thành LINK rồi cất đi.",
        body: ["Khách có thể trả phí bằng tiền khác; phí được tự đổi sang LINK và bỏ vào quỹ. Đến 13/11/2026 quỹ có khoảng 6,68 triệu LINK."],
        life: "Một con heo đất mỗi ngày đầy thêm một chút.",
        term: "Tên gọi thật: Chainlink Reserve.",
      },
      {
        title: "Nhưng có một vòi xả to hơn.",
        body: ["Mỗi quý khoảng 19 triệu LINK rời ví công ty, phần lớn lên sàn Binance — khoảng 6 triệu mỗi tháng, so với khoảng 0,45 triệu mỗi tháng bỏ vào heo đất."],
        life: "Múc nước vào xô bằng cái ca, trong khi vòi dưới đáy đang xả.",
        insight: "Khoảng 14 LINK ra cho mỗi 1 LINK vào.",
      },
    ],
  },
  {
    label: "Từ 2017 tới nay",
    title: "Từ 10 cent tới hôm nay",
    question: "Giá LINK đã đi thế nào?",
    figure: "Đường giá: 10 cent năm 2017, 52,88 USD năm 2021, bảng giá bị kẹt khi LUNA sụp năm 2022, và 8,85 USD tháng 11/2026.",
    beats: [
      {
        title: "2017: bán với giá khoảng 10 cent.",
        body: ["Nhóm sáng lập bán LINK ra công chúng với giá khoảng 9–11 cent mỗi đồng."],
      },
      {
        title: "2021: đỉnh — 52,88 USD.",
        body: ["Các ứng dụng cho vay bùng nổ và đều cần giá. Ngày 10/5/2021 LINK chạm 52,88 USD — gấp khoảng 580 lần giá bán ban đầu."],
      },
      {
        title: "2022: một bảng giá bị kẹt.",
        body: ["Khi đồng LUNA sụp xuống 0,01 USD, bảng giá LUNA của Chainlink vẫn hiện mức sàn cài sẵn 0,107 USD. Kẻ tấn công vay theo giá sai; ứng dụng Venus mất khoảng 11 triệu USD."],
        life: "Bảng giá ở tiệm vẫn ghi vàng 100 khi giá thật đã rơi còn 10.",
        insight: "Bài học cho ứng dụng như của Khoa: tự kiểm tra lại giá và có nút dừng khẩn cấp.",
      },
      {
        title: "2026: khoảng 9 USD.",
        body: ["Ngày 15/11/2026 LINK đóng cửa ở 8,85 USD — thấp hơn đỉnh khoảng 84% — dù ngân hàng và ứng dụng dùng Chainlink nhiều hơn bao giờ hết."],
        insight: "Swift đang thử với 17 ngân hàng, UBS đã làm giao dịch thật, và nhà đầu tư Mỹ mua được quỹ LINK (ETF). Nhiều dự án ngân hàng vẫn chỉ là thử nghiệm.",
      },
    ],
  },
  {
    label: "Tóm lại",
    title: "Tóm lại",
    question: "Chainlink có tốt không? LINK có đáng mua không?",
    figure: "Hai hàng: mắt xích xanh chắc chắn cho điểm mạnh, mắt xích đỏ nứt cho điểm yếu; và lời nhắc rằng dịch vụ không giống với token.",
    beats: [
      {
        title: "Điểm mạnh.",
        body: ["Nhiều người báo giá độc lập · một tờ giá có chữ ký chung · trạm kiểm tra thứ hai khi chuyển tiền · tiền cọc có thể bị phạt · được phần lớn ứng dụng cho vay lớn dùng và ngân hàng thử nghiệm."],
      },
      {
        title: "Điểm yếu.",
        body: ["LINK chỉ thu từ dịch vụ, và phí có thể trả bằng đồng khác · khoảng 19 triệu LINK được xả mỗi quý · một công ty vẫn cầm lái · đối thủ nhanh hơn (Pyth, RedStone) · người báo giá vẫn có thể sai (LUNA)."],
      },
      {
        title: "Dịch vụ không phải là token.",
        body: [
          "Khoa sẽ dùng giá của Chainlink, kèm bước tự kiểm tra. Nếu bạn mua LINK, bạn đặt cược vào token chứ không chỉ vào dịch vụ: hãy theo dõi lượng xả, heo đất và bao nhiêu phí được trả bằng LINK. Tính tới tháng 11/2026 Việt Nam chưa có sàn crypto được cấp phép. Đây là nội dung giáo dục, không phải lời khuyên đầu tư.",
        ],
      },
    ],
  },
];
