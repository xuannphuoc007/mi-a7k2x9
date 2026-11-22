/** SOL — The Ship of Light. How Solana moves fast, what that costs, and the SOL token.
 * Each beat: a short title, one or two plain sentences with a concrete example,
 * and optionally the real technical name (term). Nhi is fictional. Sources in references.ts. */
export type Beat = { title: string; body: string[]; term?: string; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "One beam of light",
    title: "20 USDC in under a second",
    question: "How can Solana be this fast and this cheap?",
    figure: "A customer's phone sends a beam of light to the ship of light and on to Nhi's phone. A timer and a tiny fee appear. Then three tracks race: Bitcoin, Ethereum and Solana.",
    takeaway: "Solana is not fast because of one trick but because of several design choices working together. The next six chapters take them one at a time.",
    beats: [
      {
        title: "Nhi gets paid.",
        body: ["Nhi sells handmade earrings online. A customer in Singapore pays her 20 USDC (a digital dollar) from a Solana wallet."],
      },
      {
        title: "Final in under a second, for almost nothing.",
        body: ["The basic fee is 0.000005 SOL per signature — about $0.0004 at a SOL price of $73. Since October 2026 the payment is usually final in under a second."],
      },
      {
        title: "Three networks, three speeds.",
        body: ["Bitcoin adds a block about every 10 minutes, Ethereum every 12 seconds, Solana every 0.2 seconds."],
      },
    ],
  },
  {
    label: "The rota",
    title: "Everyone knows who is next",
    question: "Who puts transactions into a block?",
    figure: "A strip of numbered blocks coloured by validator. Each validator holds four blocks in a row; a pointer moves along the strip and the turn passes on.",
    beats: [
      {
        title: "Validators take turns.",
        body: ["About 650 computers (validators) run Solana. In each turn one of them is the leader: it collects transactions, packs them into blocks and sends the blocks to the others to check."],
        term: "Real name: leader.",
      },
      {
        title: "The rota is set for a whole day.",
        body: ["Who leads when is worked out in advance for an epoch of 432,000 blocks — about 24 hours at today's speed. A validator with more SOL staked on it gets more turns."],
        term: "Real name: leader schedule.",
      },
      {
        title: "Four blocks each, then the next one.",
        body: ["Each leader keeps four blocks in a row — 0.8 seconds — then the next leader on the list takes over. Nobody waits for a vote on who goes next."],
      },
    ],
  },
  {
    label: "No waiting room",
    title: "Sent straight to the leader",
    question: "Where does a transaction go before it is in a block?",
    figure: "Left: a waiting room crowded with transactions. Right: a Solana wallet sends a beam straight to the current leader and the next two leaders.",
    beats: [
      {
        title: "Bitcoin and Ethereum have a waiting room.",
        body: ["New transactions are passed between computers and sit in a shared queue (the mempool) until a block producer picks them."],
      },
      {
        title: "Solana sends them straight.",
        body: ["Because the rota is known, the wallet's transaction goes directly to the current leader and the next few leaders. The next leader can get ready before its turn."],
        term: "Real name: Gulf Stream.",
      },
      {
        title: "Transactions expire.",
        body: ["Each transaction names a recent block. If it is not included within 150 blocks — about 30 seconds now — it expires and the wallet sends it again."],
      },
    ],
  },
  {
    label: "The counter",
    title: "A counter that proves the order",
    question: "How do computers agree what came first without asking each other?",
    figure: "A tape of numbers ticks forward. Transactions are stamped at step 1,204 and 1,207. Checkers verify pieces of the tape side by side. Then a badge: Alpenglow, 21 October 2026.",
    beats: [
      {
        title: "The leader runs a counter that never stops.",
        body: ["The computer repeats one hash calculation (SHA-256), feeding each result into the next. Each step has to wait for the one before, so the length of the chain shows that time has passed."],
        term: "Real name: Proof of History (PoH).",
      },
      {
        title: "Every transaction gets a step number.",
        body: ["If the customer's payment lands at step 1,204 and another at step 1,207, everyone can see which came first. Checking the chain is much faster than making it, because checkers can split it up and work in parallel."],
      },
      {
        title: "Since 21 October 2026: a new way to vote.",
        body: ["The Alpenglow upgrade replaced how validators vote to confirm blocks. Agreement no longer depends on this counter, and final confirmation dropped from about 12.8 seconds to a target of 0.15 seconds."],
        insight: "The counter was Solana's founding idea in 2017. Nine years later the network moved its voting to a faster design.",
      },
    ],
  },
  {
    label: "Blocks in pieces",
    title: "Cutting a block into small pieces",
    question: "How do you get a big block to hundreds of computers quickly?",
    figure: "A block breaks into small pieces plus spare pieces. The leader sends them to a small group, which forwards them to the next layer. One lost piece is rebuilt from the spares.",
    beats: [
      {
        title: "Cut the block into pieces.",
        body: ["The leader cuts each block into small pieces (shreds) and adds spare pieces. If some get lost on the way, the receiver can still rebuild the whole block."],
        term: "Real name: shreds with erasure coding.",
      },
      {
        title: "Pass them on in layers.",
        body: ["The leader does not send to every computer itself. It sends each piece to a small group, which forwards it to the next. If each computer forwards to 200 others, two layers reach 40,000."],
        term: "Real name: Turbine.",
      },
      {
        title: "The lesson of 2023.",
        body: ["In February 2023 one validator sent out an oversized block — about 150,000 pieces instead of a few hundred. The filters were overwhelmed and the network stopped for almost 19 hours."],
      },
    ],
  },
  {
    label: "Many lanes",
    title: "Running transactions side by side",
    question: "A block holds thousands of transactions. How do they all run in time?",
    figure: "Four lanes of light. Transactions that touch different accounts run in different lanes at the same time; two that touch the same meme coin queue in one lane.",
    beats: [
      {
        title: "Each transaction says what it will touch.",
        body: ["A Solana transaction must list the accounts it will read and change. For example: customer → Nhi's wallet; An → Bình's wallet."],
        term: "Real name: Sealevel.",
      },
      {
        title: "No overlap? Run at the same time.",
        body: ["Transactions that don't change the same account are spread over many processor cores and run at once. Ethereum runs its transactions one after another."],
      },
      {
        title: "Overlap? Queue up.",
        body: ["When many people buy the same meme coin, those transactions all change the same account, so they run one by one. The busy spot slows down; the rest of the network carries on."],
      },
    ],
  },
  {
    label: "Fees",
    title: "Cheap fees — and a jam stays local",
    question: "Who gets the fee, and what happens when the network is busy?",
    figure: "A fee coin splits: half burns, half goes to the leader. A priority fee goes fully to the leader. Then a block bar of 100 million units with a hot account capped at 12 million.",
    takeaway: "Fees stay tiny for most people because a rush on one coin can only use a slice of each block.",
    beats: [
      {
        title: "Basic fee: half is burned.",
        body: ["Each signature pays 0.000005 SOL. Half is burned (destroyed for good); the other half goes to the leader that made the block."],
      },
      {
        title: "In a hurry? Add a priority fee.",
        body: ["When it's busy, users can add a priority fee to be placed first. Since February 2025 all of this fee goes to the leader; none of it is burned any more."],
      },
      {
        title: "One hot spot can use at most 12% of a block.",
        body: ["Since 29 July 2026 a block can hold 100 million compute units, but one busy account can use at most 12 million. When a meme coin goes wild, fees rise there — Nhi's payments stay cheap."],
        term: "Real name: local fee markets.",
      },
    ],
  },
  {
    label: "When it stopped",
    title: "The times the network stopped (2021–2024)",
    question: "What is the risk of going this fast?",
    figure: "A timeline from 2021 to 2026 with red stops sized by hours: 17 h, 7 h, 19 h, 5 h. After February 2024 a long green stretch: 1,000 days.",
    takeaway: "Solana has fixed many weak points, but its history of halts is why many institutions still watch it closely.",
    beats: [
      {
        title: "2021–2022: flooded by bots.",
        body: ["In September 2021 bots flooded a token sale and the network stopped for 17 hours. In April–May 2022 NFT-minting bots stopped it again for about 7 hours."],
      },
      {
        title: "2023–2024: software bugs.",
        body: ["In February 2023 an oversized block stopped it for almost 19 hours. In February 2024 a bug in the code that loads programs stopped it for about 5 hours. Each time validators had to restart together."],
      },
      {
        title: "Since then: 1,000 days without a halt.",
        body: ["There has been no full stop since 6 February 2024; the 1,000-day mark came around 2 November 2026. Spam now costs priority fees, so the jams of the early years are much rarer."],
      },
    ],
  },
  {
    label: "An expensive engine",
    title: "Running a validator is expensive",
    question: "Who can take part in running the network?",
    figure: "A server spec card. A bar chart of validators: 2,560, 795, 654. Then a software split: almost all Agave-based, Firedancer separate.",
    beats: [
      {
        title: "Server-class hardware.",
        body: ["A Solana validator in 2026 needs about 24 or more processor cores, 384–512 GB of memory, enterprise NVMe drives and a 10 Gbps line. A typical laptop has 8–16 GB of memory."],
      },
      {
        title: "Far fewer validators.",
        body: ["From 2,560 validators in March 2023 to 795 in January 2026. When Alpenglow switched on on 21 October 2026, 654 took part."],
        insight: "In October 2026, about 18 of the largest operators together held enough stake to halt the network.",
      },
      {
        title: "Mostly one family of software.",
        body: ["Most validators run Agave or a version built from it. Jump's Firedancer is written from scratch, but it could not join the switch to Alpenglow, so on 21 October 2026 the network moved over on Agave-based software alone."],
        insight: "A bug in shared software can hit almost the whole network at once.",
      },
    ],
  },
  {
    label: "Faster in 2026",
    title: "Three speed-ups in 2026",
    question: "What is Solana changing?",
    figure: "Three gauges: block capacity 60 → 100 million; block time 400 → 200 ms; final confirmation 12.8 s → 0.15 s target.",
    beats: [
      {
        title: "Bigger blocks.",
        body: ["29 July 2026: each block's capacity rose from 60 million to 100 million compute units (+66%)."],
      },
      {
        title: "Blocks twice as often.",
        body: ["From 400 to 200 milliseconds, in four steps; the last one took effect on 9 October 2026. A transaction's expiry window is now 30 seconds."],
      },
      {
        title: "Final almost at once.",
        body: ["Alpenglow (21 October 2026) targets final confirmation in about 0.15 seconds instead of 12.8. One independent sample of the first 24 hours measured a median of about 0.4 seconds."],
        insight: "It was the first time Solana changed how it reaches agreement since launch in 2020.",
      },
    ],
  },
  {
    label: "The SOL token",
    title: "SOL: fees, staking and new coins",
    question: "Does a well-running network mean a higher SOL price?",
    figure: "A SOL coin: fees flow in, half burns. New SOL flows out to stakers. An inflation line falls toward 1.5%, sooner under the new plan. A price card: $72.83, 75% below the top.",
    takeaway: "SOL is really used, but supply still grows about 3.6% a year and the price follows market mood more than network speed.",
    beats: [
      {
        title: "SOL pays fees and is staked.",
        body: ["About 68% of all SOL is staked on validators (May 2026). Stakers earn from newly issued SOL and from fees."],
      },
      {
        title: "New SOL every year.",
        body: ["On 18 October 2026 issuance was 3.60% a year on a supply of about 636 million SOL — about 22.9 million new SOL a year, or more than 62,000 a day."],
      },
      {
        title: "Issuance will shrink twice as fast.",
        body: ["In August 2026 validators voted to cut the issuance rate by 30% a year instead of 15%, reaching the 1.5% floor around 2029 instead of 2032. The change still has to be switched on in the software."],
      },
      {
        title: "The price: about 75% below its top.",
        body: ["On 17 November 2026 SOL was about $72.83 — down about 44% in a year and about 75% below its top of about $293 (January 2025). U.S. investors have been able to buy SOL funds (ETFs) since October 2025."],
        insight: "Record network use, weak price: a good network does not automatically lift its token.",
      },
    ],
  },
  {
    label: "Verdict",
    title: "The ship of light: strengths and weaknesses",
    question: "So what makes Solana fast — and what does it trade away?",
    figure: "Two columns beside the ship: green strengths and red weaknesses. Then Nhi's phone shows 20 USDC received.",
    beats: [
      {
        title: "Strengths.",
        body: ["A rota known in advance · no waiting room · transactions side by side · basic fee 0.000005 SOL · a jam stays local · final in under a second · 1,000+ days without a halt."],
      },
      {
        title: "Weaknesses.",
        body: ["Network halts in 2021–2024 · expensive hardware, so few validators (≈650) · mostly one family of software · about 3.6% new SOL a year · a volatile price (−75% from the top)."],
      },
      {
        title: "What it means for Nhi.",
        body: [
          "Nhi gets 20 USDC almost instantly for a negligible fee — that is what Solana does well. Buying SOL is a bet on the token, not just the technology. As of November 2026 Vietnam has no licensed crypto exchange. This is education, not investment advice.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Một tia sáng",
    title: "20 USDC, chưa tới một giây",
    question: "Solana làm cách nào để nhanh và rẻ như vậy?",
    figure: "Điện thoại của khách bắn một tia sáng tới con tàu ánh sáng rồi tới điện thoại của Nhi. Một đồng hồ và mức phí rất nhỏ hiện ra. Sau đó ba đường đua: Bitcoin, Ethereum và Solana.",
    takeaway: "Solana nhanh không nhờ một mẹo duy nhất mà nhờ nhiều thiết kế cùng lúc. Sáu chương tiếp theo đi qua từng cái.",
    beats: [
      {
        title: "Nhi nhận tiền.",
        body: ["Nhi bán bông tai handmade trên mạng. Một khách ở Singapore trả cô 20 USDC (đô la số) từ ví Solana."],
      },
      {
        title: "Xong trong chưa tới một giây, phí gần như bằng 0.",
        body: ["Phí cơ bản là 0,000005 SOL cho mỗi chữ ký — khoảng 0,0004 USD khi SOL giá 73 USD. Từ tháng 10/2026, khoản thanh toán thường được xác nhận chắc chắn trong chưa tới một giây."],
      },
      {
        title: "Ba mạng, ba tốc độ.",
        body: ["Bitcoin tạo một khối khoảng 10 phút một lần, Ethereum 12 giây một lần, Solana 0,2 giây một lần."],
      },
    ],
  },
  {
    label: "Lịch trực",
    title: "Ai làm tiếp đã được biết trước",
    question: "Ai là người gom giao dịch vào khối?",
    figure: "Một dải khối đánh số, tô màu theo máy xác thực. Mỗi máy giữ bốn khối liên tiếp; mũi tên chạy dọc dải và lượt được chuyển sang máy kế tiếp.",
    beats: [
      {
        title: "Các máy xác thực thay phiên nhau.",
        body: ["Khoảng 650 máy tính (máy xác thực, validator) cùng chạy Solana. Mỗi lượt, một máy làm người dẫn: nhận giao dịch, xếp vào khối rồi gửi khối cho các máy khác kiểm tra."],
        term: "Tên gọi thật: leader.",
      },
      {
        title: "Lịch được lập sẵn cho cả ngày.",
        body: ["Ai dẫn vào lúc nào được tính trước cho cả một kỳ (epoch) gồm 432.000 khối — khoảng 24 giờ ở tốc độ hiện nay. Máy được đặt cọc nhiều SOL hơn thì có nhiều lượt hơn."],
        term: "Tên gọi thật: leader schedule.",
      },
      {
        title: "Mỗi máy 4 khối, rồi đổi người.",
        body: ["Mỗi người dẫn giữ 4 khối liên tiếp — 0,8 giây — rồi máy kế tiếp trong lịch tiếp quản. Không ai phải chờ bỏ phiếu xem ai làm tiếp."],
      },
    ],
  },
  {
    label: "Không có phòng chờ",
    title: "Gửi thẳng tới người dẫn",
    question: "Giao dịch đi đâu trước khi được đưa vào khối?",
    figure: "Bên trái: một phòng chờ chật kín giao dịch. Bên phải: ví Solana bắn tia sáng thẳng tới người dẫn hiện tại và hai người dẫn kế tiếp.",
    beats: [
      {
        title: "Bitcoin và Ethereum có phòng chờ.",
        body: ["Giao dịch mới được chuyển qua lại giữa các máy và nằm trong một hàng chờ chung (mempool) cho tới khi được chọn vào khối."],
      },
      {
        title: "Solana gửi thẳng.",
        body: ["Vì lịch đã biết trước, giao dịch từ ví được chuyển ngay tới người dẫn hiện tại và vài người dẫn kế tiếp. Người dẫn kế tiếp có thể chuẩn bị trước khi tới lượt."],
        term: "Tên gọi thật: Gulf Stream.",
      },
      {
        title: "Giao dịch có hạn dùng.",
        body: ["Mỗi giao dịch ghi kèm một khối gần đây. Nếu sau 150 khối — khoảng 30 giây hiện nay — vẫn chưa được đưa vào, giao dịch hết hạn và ví phải gửi lại."],
      },
    ],
  },
  {
    label: "Bộ đếm",
    title: "Một bộ đếm chứng minh thứ tự",
    question: "Làm sao các máy biết giao dịch nào tới trước mà không cần hỏi nhau?",
    figure: "Một dải số chạy liên tục. Giao dịch được đóng dấu ở bước 1.204 và 1.207. Các máy kiểm tra chia dải số ra kiểm cùng lúc. Sau đó là huy hiệu Alpenglow, 21/10/2026.",
    beats: [
      {
        title: "Người dẫn chạy một bộ đếm không ngừng.",
        body: ["Máy lặp đi lặp lại một phép băm (SHA-256), lấy kết quả lần trước làm đầu vào lần sau. Bước sau phải chờ bước trước, nên độ dài dãy số cho thấy thời gian đã trôi qua."],
        term: "Tên gọi thật: Proof of History (PoH).",
      },
      {
        title: "Mỗi giao dịch được gắn số bước.",
        body: ["Nếu khoản tiền của khách nằm ở bước 1.204 và một giao dịch khác ở bước 1.207, ai cũng thấy cái nào tới trước. Kiểm tra dãy số nhanh hơn nhiều so với tạo ra nó, vì máy kiểm tra có thể chia nhỏ và kiểm cùng lúc."],
      },
      {
        title: "Từ 21/10/2026: cách bỏ phiếu mới.",
        body: ["Bản nâng cấp Alpenglow thay cách các máy bỏ phiếu xác nhận khối. Việc đồng thuận không còn dựa vào bộ đếm này, và thời gian xác nhận chắc chắn giảm từ khoảng 12,8 giây xuống mục tiêu 0,15 giây."],
        insight: "Bộ đếm là ý tưởng gốc của Solana từ năm 2017. Chín năm sau, mạng chuyển việc bỏ phiếu sang cách mới nhanh hơn.",
      },
    ],
  },
  {
    label: "Chia khối thành mảnh",
    title: "Cắt khối thành nhiều mảnh nhỏ",
    question: "Làm sao gửi một khối lớn tới hàng trăm máy thật nhanh?",
    figure: "Một khối vỡ thành nhiều mảnh nhỏ kèm mảnh dự phòng. Người dẫn gửi cho một nhóm nhỏ, nhóm đó chuyển tiếp cho tầng sau. Một mảnh bị rơi được ghép lại từ mảnh dự phòng.",
    beats: [
      {
        title: "Cắt khối thành mảnh.",
        body: ["Người dẫn cắt mỗi khối thành nhiều mảnh nhỏ (shred) và thêm vài mảnh dự phòng. Nếu một số mảnh bị rơi trên đường, máy nhận vẫn ghép lại được cả khối."],
        term: "Tên gọi thật: shred và mã sửa lỗi (erasure code).",
      },
      {
        title: "Chuyển tiếp theo tầng.",
        body: ["Người dẫn không tự gửi cho từng máy. Nó gửi mỗi mảnh cho một nhóm nhỏ, nhóm đó chuyển tiếp cho nhóm sau. Nếu mỗi máy chuyển cho 200 máy, chỉ hai tầng đã tới được 40.000 máy."],
        term: "Tên gọi thật: Turbine.",
      },
      {
        title: "Bài học năm 2023.",
        body: ["Tháng 2/2023, một máy xác thực gửi ra một khối quá lớn — khoảng 150.000 mảnh thay vì vài trăm. Bộ lọc bị quá tải và mạng dừng gần 19 giờ."],
      },
    ],
  },
  {
    label: "Nhiều làn",
    title: "Chạy nhiều giao dịch cùng lúc",
    question: "Một khối có hàng nghìn giao dịch — chạy lần lượt từng cái sao kịp?",
    figure: "Bốn làn ánh sáng. Giao dịch đụng tới các tài khoản khác nhau chạy ở các làn khác nhau cùng lúc; hai giao dịch cùng đụng tới một đồng meme phải xếp hàng trong một làn.",
    beats: [
      {
        title: "Mỗi giao dịch khai trước nó đụng tới đâu.",
        body: ["Giao dịch trên Solana phải ghi rõ những tài khoản nó sẽ đọc và sẽ sửa. Ví dụ: khách → ví Nhi; An → ví Bình."],
        term: "Tên gọi thật: Sealevel.",
      },
      {
        title: "Không đụng nhau thì chạy cùng lúc.",
        body: ["Các giao dịch không sửa chung tài khoản nào được chia cho nhiều nhân xử lý (CPU core) và chạy cùng lúc. Ethereum thì chạy lần lượt từng giao dịch một."],
      },
      {
        title: "Đụng nhau thì xếp hàng.",
        body: ["Khi nhiều người cùng mua một đồng meme, các giao dịch đó đều sửa cùng một tài khoản nên phải chạy nối tiếp. Chỗ đông bị chậm, phần còn lại của mạng vẫn chạy bình thường."],
      },
    ],
  },
  {
    label: "Phí",
    title: "Phí rẻ — và chỗ tắc không làm tắc cả mạng",
    question: "Ai nhận phí, và chuyện gì xảy ra khi mạng đông?",
    figure: "Một đồng phí tách đôi: một nửa bị đốt, một nửa cho người dẫn. Phí ưu tiên đi hết cho người dẫn. Sau đó là thanh khối 100 triệu đơn vị, trong đó một tài khoản nóng bị giới hạn 12 triệu.",
    takeaway: "Phí vẫn rất rẻ với đa số người dùng vì cơn sốt ở một đồng coin chỉ dùng được một phần nhỏ của mỗi khối.",
    beats: [
      {
        title: "Phí cơ bản: một nửa bị đốt.",
        body: ["Mỗi chữ ký trả 0,000005 SOL. Một nửa bị đốt (mất vĩnh viễn), nửa còn lại trả cho người dẫn đã tạo khối."],
      },
      {
        title: "Muốn nhanh hơn thì thêm phí ưu tiên.",
        body: ["Khi mạng đông, người dùng có thể trả thêm phí ưu tiên để được xếp trước. Từ tháng 2/2025, toàn bộ phí này thuộc về người dẫn, không còn bị đốt một nửa."],
      },
      {
        title: "Một chỗ nóng chỉ dùng được tối đa 12% khối.",
        body: ["Từ 29/7/2026, mỗi khối chứa tối đa 100 triệu đơn vị tính toán, nhưng một tài khoản đông đúc chỉ được dùng tối đa 12 triệu. Khi một đồng meme gây sốt, phí ở chỗ đó tăng, còn giao dịch của Nhi vẫn rẻ."],
        term: "Tên gọi thật: local fee markets.",
      },
    ],
  },
  {
    label: "Những lần dừng",
    title: "Những lần mạng dừng hẳn (2021–2024)",
    question: "Nhanh như vậy thì có rủi ro gì?",
    figure: "Một dòng thời gian 2021–2026 với các điểm dừng màu đỏ theo số giờ: 17 giờ, 7 giờ, 19 giờ, 5 giờ. Sau tháng 2/2024 là một đoạn xanh dài: 1.000 ngày.",
    takeaway: "Solana đã sửa nhiều điểm yếu, nhưng lịch sử dừng mạng là lý do nhiều tổ chức vẫn theo dõi kỹ.",
    beats: [
      {
        title: "2021–2022: bị bot dội giao dịch.",
        body: ["Tháng 9/2021, bot dội giao dịch trong một đợt mở bán token làm mạng dừng 17 giờ. Tháng 4–5/2022, bot săn NFT lại làm mạng dừng khoảng 7 giờ."],
      },
      {
        title: "2023–2024: lỗi phần mềm.",
        body: ["Tháng 2/2023, một khối quá lớn làm mạng dừng gần 19 giờ. Tháng 2/2024, một lỗi trong phần nạp chương trình làm mạng dừng khoảng 5 giờ. Mỗi lần, các máy xác thực phải cùng nhau khởi động lại."],
      },
      {
        title: "Từ đó tới nay: 1.000 ngày không dừng.",
        body: ["Từ 6/2/2024 mạng chưa dừng hẳn lần nào; mốc 1.000 ngày tới vào khoảng 2/11/2026. Gửi giao dịch rác giờ phải trả phí ưu tiên, nên kiểu tắc nghẽn của những năm đầu hiếm hơn hẳn."],
      },
    ],
  },
  {
    label: "Máy phải mạnh",
    title: "Chạy một máy xác thực rất tốn kém",
    question: "Ai có thể tham gia giữ mạng?",
    figure: "Một thẻ cấu hình máy chủ. Biểu đồ số máy xác thực: 2.560, 795, 654. Sau đó là tỉ lệ phần mềm: gần như toàn bộ là họ Agave, Firedancer đứng riêng.",
    beats: [
      {
        title: "Cấu hình cỡ máy chủ lớn.",
        body: ["Một máy xác thực Solana năm 2026 cần khoảng 24 nhân CPU trở lên, 384–512 GB RAM, ổ NVMe loại doanh nghiệp và đường mạng 10 Gbps. Một máy tính xách tay phổ thông có 8–16 GB RAM."],
      },
      {
        title: "Số máy xác thực giảm mạnh.",
        body: ["Từ 2.560 máy (3/2023) xuống 795 máy (1/2026). Khi Alpenglow bật ngày 21/10/2026, có 654 máy tham gia."],
        insight: "Tháng 10/2026, chỉ khoảng 18 bên vận hành lớn nhất cộng lại đã giữ đủ phần đặt cọc để làm dừng mạng.",
      },
      {
        title: "Gần như chỉ một họ phần mềm.",
        body: ["Phần lớn máy chạy Agave hoặc bản dựng từ Agave. Firedancer của Jump được viết lại từ đầu, nhưng chưa tham gia được đợt chuyển sang Alpenglow, nên ngày 21/10/2026 mạng chuyển đổi chỉ với các máy chạy phần mềm họ Agave."],
        insight: "Một lỗi trong phần mềm dùng chung có thể ảnh hưởng gần như cả mạng cùng lúc.",
      },
    ],
  },
  {
    label: "Tăng tốc 2026",
    title: "Ba lần tăng tốc trong năm 2026",
    question: "Solana đang thay đổi những gì?",
    figure: "Ba đồng hồ: sức chứa khối 60 → 100 triệu; thời gian mỗi khối 400 → 200 mili giây; xác nhận chắc chắn 12,8 giây → mục tiêu 0,15 giây.",
    beats: [
      {
        title: "Khối chứa nhiều hơn.",
        body: ["Ngày 29/7/2026, sức chứa mỗi khối tăng từ 60 triệu lên 100 triệu đơn vị tính toán (+66%)."],
      },
      {
        title: "Khối ra nhanh gấp đôi.",
        body: ["Từ 400 xuống 200 mili giây, chia làm bốn bước; bước cuối có hiệu lực ngày 9/10/2026. Hạn dùng của một giao dịch vì thế còn 30 giây."],
      },
      {
        title: "Xác nhận chắc chắn gần như tức thì.",
        body: ["Alpenglow (21/10/2026) đặt mục tiêu xác nhận cuối cùng trong khoảng 0,15 giây thay vì 12,8 giây. Một mẫu đo độc lập trong 24 giờ đầu ghi được trung vị khoảng 0,4 giây."],
        insight: "Đây là lần đầu Solana đổi cách đồng thuận kể từ khi ra mắt năm 2020.",
      },
    ],
  },
  {
    label: "Token SOL",
    title: "SOL: trả phí, đặt cọc và SOL mới",
    question: "Mạng chạy tốt thì giá SOL có tăng không?",
    figure: "Đồng SOL: phí chảy vào, một nửa bị đốt. SOL mới chảy ra cho người đặt cọc. Đường lạm phát giảm dần về 1,5%, sớm hơn theo kế hoạch mới. Thẻ giá: 72,83 USD, thấp hơn đỉnh 75%.",
    takeaway: "SOL được dùng thật, nhưng nguồn cung vẫn tăng khoảng 3,6% mỗi năm và giá đi theo tâm lý thị trường nhiều hơn theo tốc độ mạng.",
    beats: [
      {
        title: "SOL dùng để trả phí và đặt cọc.",
        body: ["Khoảng 68% tổng số SOL đang được đặt cọc (stake) cho các máy xác thực (5/2026). Người đặt cọc nhận thưởng từ SOL mới phát hành và từ phí."],
      },
      {
        title: "Mỗi năm có thêm SOL mới.",
        body: ["Ngày 18/10/2026, mức phát hành là 3,60%/năm trên tổng cung khoảng 636 triệu SOL — khoảng 22,9 triệu SOL mới mỗi năm, tức hơn 62.000 SOL mỗi ngày."],
      },
      {
        title: "Tốc độ giảm phát hành được nhân đôi.",
        body: ["Tháng 8/2026, các máy xác thực bỏ phiếu giảm mức phát hành 30% mỗi năm thay vì 15%, để chạm mức sàn 1,5% vào khoảng 2029 thay vì 2032. Thay đổi này vẫn chờ được bật trong phần mềm."],
      },
      {
        title: "Giá: thấp hơn đỉnh khoảng 75%.",
        body: ["Ngày 17/11/2026, SOL giá khoảng 72,83 USD — giảm khoảng 44% trong một năm và thấp hơn đỉnh khoảng 293 USD (1/2025) khoảng 75%. Nhà đầu tư Mỹ mua được quỹ SOL (ETF) từ tháng 10/2025."],
        insight: "Mạng dùng nhiều kỷ lục mà giá vẫn yếu: mạng tốt không tự động làm giá token tăng.",
      },
    ],
  },
  {
    label: "Tóm lại",
    title: "Con tàu ánh sáng: điểm mạnh, điểm yếu",
    question: "Vậy Solana nhanh nhờ đâu — và phải đánh đổi gì?",
    figure: "Hai cột bên con tàu: điểm mạnh màu xanh, điểm yếu màu đỏ. Sau đó điện thoại của Nhi báo đã nhận 20 USDC.",
    beats: [
      {
        title: "Điểm mạnh.",
        body: ["Lịch trực biết trước · gửi thẳng, không phòng chờ · chạy nhiều giao dịch cùng lúc · phí cơ bản 0,000005 SOL · chỗ tắc không lan ra cả mạng · xác nhận chắc chắn dưới 1 giây · hơn 1.000 ngày không dừng."],
      },
      {
        title: "Điểm yếu.",
        body: ["Từng dừng mạng 2021–2024 · máy xác thực đắt nên ít người chạy (≈650) · gần như một họ phần mềm · mỗi năm thêm khoảng 3,6% SOL mới · giá biến động mạnh (−75% từ đỉnh)."],
      },
      {
        title: "Với Nhi.",
        body: [
          "Nhi nhận 20 USDC gần như tức thì với mức phí không đáng kể — đó là điều Solana làm tốt. Còn mua SOL là đặt cược vào token, không chỉ vào công nghệ. Tính tới tháng 11/2026, Việt Nam chưa có sàn crypto nào được cấp phép. Đây là nội dung giáo dục, không phải lời khuyên đầu tư.",
        ],
      },
    ],
  },
];
