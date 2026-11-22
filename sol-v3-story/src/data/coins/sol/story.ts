/** SOL — The Ship of Light, beginner edition.
 * Short, direct sentences with a concrete example; few technical words, each one
 * explained where it first appears. Nhi is fictional. Sources in references.ts. */
export type Beat = { title: string; body: string[]; term?: string; insight?: string };
export type Chapter = { label: string; title: string; question: string; figure: string; takeaway?: string; beats: Beat[] };

export const chaptersEn: Chapter[] = [
  {
    label: "What is Solana?",
    title: "A shared record book",
    question: "What is Solana, and why do people say it's fast?",
    figure: "An open record book in the middle, with about a dozen computers around it, each holding an identical copy. One computer changes its own copy and the others reject it. Then the SOL coin and what people use Solana for.",
    beats: [
      {
        title: "Solana is a shared record book.",
        body: ["It records who sent money to whom. The book is not kept by a bank: about 650 computers around the world each keep an identical copy."],
      },
      {
        title: "Nobody can change it alone.",
        body: ["Every new line must be checked and accepted by most of those computers. If one computer edits its own copy, the others refuse it."],
      },
      {
        title: "SOL is the network's own coin.",
        body: ["Fees are paid in SOL. People also use Solana to send digital dollars (such as USDC), trade tokens and use apps."],
      },
    ],
  },
  {
    label: "Nhi gets paid",
    title: "20 USDC in under a second",
    question: "What does a payment on Solana look like?",
    figure: "A customer's phone sends a beam of light to Nhi's phone. A timer shows under one second and a fee of $0.0004. Then three rows compare how often Bitcoin, Ethereum and Solana add a new page.",
    takeaway: "Three things make Solana fast: turns to write are planned in advance, many payments are processed at once, and a busy spot doesn't make everything expensive. The next three chapters show them.",
    beats: [
      {
        title: "Nhi sells earrings online.",
        body: ["A customer in Singapore wants to pay 20 USDC — a digital dollar. Nhi sends her wallet address (a QR code), and the customer taps “send”."],
      },
      {
        title: "Under a second, for less than a cent.",
        body: ["The money arrives almost immediately. The fee is 0.000005 SOL — about $0.0004 at a SOL price of $73."],
        insight: "Since a big upgrade in October 2026, a payment can no longer be reversed after about 0.15 seconds (the target), down from about 12.8 seconds.",
      },
      {
        title: "Much faster than other networks.",
        body: ["Each network adds a new page (a “block”) to its book regularly: Bitcoin about every 10 minutes, Ethereum every 12 seconds, Solana every 0.2 seconds."],
      },
    ],
  },
  {
    label: "Taking turns",
    title: "Computers take turns to write",
    question: "Who writes the new pages?",
    figure: "Four computers in a row; a glowing frame moves from one to the next. A strip of numbered pages shows four pages per computer. A phone sends a beam straight to the computer writing now.",
    beats: [
      {
        title: "One computer writes at a time.",
        body: ["At any moment one computer has the pen. It collects payments, writes them on a new page and sends the page to the others to check."],
      },
      {
        title: "The rota is set for a whole day.",
        body: ["Who writes when is worked out about 24 hours in advance. Each computer writes 4 pages in a row — about 0.8 seconds — then the next one takes over."],
        term: "Technical name: leader schedule.",
      },
      {
        title: "Payments go straight to the writer.",
        body: ["Because everyone knows who writes next, the customer's wallet sends the payment straight to that computer. It doesn't sit in a shared waiting line, as on Bitcoin or Ethereum."],
      },
    ],
  },
  {
    label: "At the same time",
    title: "Many payments at the same time",
    question: "A page holds thousands of payments. How are they all done in time?",
    figure: "Four payment cards, each naming the wallets it uses. They move along four lanes at once. Two purchases of the same meme coin have to go one after the other in the same lane.",
    beats: [
      {
        title: "Each payment says which wallets it uses.",
        body: ["For example: customer → Nhi; An → Bình. These two payments have nothing in common."],
      },
      {
        title: "Nothing in common? Do them together.",
        body: ["A computer has many processor cores. Solana gives unrelated payments to different cores and runs them at the same time. Ethereum runs them one by one."],
        term: "Technical name: Sealevel.",
      },
      {
        title: "Same place? One after the other.",
        body: ["When many people buy the same meme coin, those purchases change the same record, so they must wait for each other. That spot slows down; everything else keeps moving."],
      },
    ],
  },
  {
    label: "Fees",
    title: "Cheap fees, even when it's busy",
    question: "Who gets the fee, and what happens when everyone rushes in?",
    figure: "A tiny fee coin splits: half disappears, half goes to the computer that wrote the page. Then a page bar where one meme coin can take only a small slice.",
    beats: [
      {
        title: "The basic fee is tiny.",
        body: ["A payment usually pays 0.000005 SOL. Half is destroyed for good; the other half goes to the computer that wrote the page."],
      },
      {
        title: "In a hurry? Pay a little extra.",
        body: ["When the network is busy, someone in a hurry can add a priority fee to be written first."],
      },
      {
        title: "One busy spot can't fill the page.",
        body: ["A coin everyone is rushing to buy can use at most about 12% of each page. Those buyers bid up fees among themselves, while Nhi's payment stays cheap."],
      },
    ],
  },
  {
    label: "When it stopped",
    title: "The network has stopped before",
    question: "Does going this fast have a downside?",
    figure: "A timeline 2021–2026 with red stops: 17 hours, 7 hours, 19 hours, 5 hours. After February 2024 a long green stretch of 1,000 days.",
    takeaway: "Speed has its own risks. Solana is much steadier now, but its record of stopping is worth knowing.",
    beats: [
      {
        title: "Flooded by bots.",
        body: ["In 2021–2022 automated programs (bots) sent too many transactions at once and the network stopped — once for 17 hours. While it was stopped, nobody could send or receive money."],
      },
      {
        title: "Then software bugs.",
        body: ["In February 2023 it stopped for almost 19 hours, in February 2024 for about 5 hours. Each time the people running the computers had to restart together."],
      },
      {
        title: "1,000 days without a stop.",
        body: ["There has been no stop since 6 February 2024. Flooding the network now costs fees, so the jams of the early years are much rarer."],
      },
    ],
  },
  {
    label: "Expensive machines",
    title: "Fast needs expensive machines",
    question: "Who can help keep the record book?",
    figure: "A large server next to a laptop, with memory bars. Then dots for the number of computers: 2,560 shrinking to about 650. Then a few big dots holding most of the weight.",
    beats: [
      {
        title: "Each computer must be very powerful.",
        body: ["A computer keeping Solana's book in 2026 needs 384–512 GB of memory and a 10 Gbps internet line. A typical laptop has 8–16 GB of memory."],
      },
      {
        title: "So fewer people can do it.",
        body: ["The number of computers fell from 2,560 (March 2023) to about 650 (October 2026), mostly because of the cost."],
      },
      {
        title: "Fewer computers, more concentrated power.",
        body: ["In October 2026 just 18 of the largest operators together had enough weight to stop the network. Most computers also run the same family of software, so one bug can hit almost all of them."],
      },
    ],
  },
  {
    label: "The SOL coin",
    title: "What SOL is for, and its price",
    question: "If the network works well, does SOL go up?",
    figure: "The SOL coin with two uses: paying fees and staking (68%). New SOL flows out every year. Then two price bars: about $293 at the top and $72.83 now.",
    takeaway: "SOL is really used, but new coins keep being added and the price follows market mood more than network speed.",
    beats: [
      {
        title: "Fees and staking.",
        body: ["SOL pays the fees. People can also stake SOL: lock it up to back one of the computers and earn a reward. About 68% of all SOL is staked (May 2026)."],
      },
      {
        title: "New SOL every year.",
        body: ["About 3.6% new SOL is created each year — about 22.9 million coins — and paid as rewards. The rate falls every year; in August 2026 the network voted to make it fall twice as fast."],
      },
      {
        title: "About 75% below its top.",
        body: ["On 17 November 2026 SOL was about $72.83, against a top of about $293 (January 2025). A busy network does not mean the price will rise."],
      },
    ],
  },
  {
    label: "In short",
    title: "The ship of light: strengths and weaknesses",
    question: "So what does Solana do well, and what should you watch?",
    figure: "Two columns beside the ship: green strengths and red weaknesses. Then Nhi's phone shows 20 USDC received.",
    beats: [
      {
        title: "Strengths.",
        body: ["Payments in under a second · fees under one cent · many payments at the same time · a busy spot doesn't raise everyone's fees · 1,000+ days without stopping."],
      },
      {
        title: "Weaknesses.",
        body: ["Stopped several times in 2021–2024 · expensive machines, so only about 650 computers · power held by few · about 3.6% new SOL a year · a very volatile price."],
      },
      {
        title: "What it means for Nhi.",
        body: [
          "Nhi gets 20 USDC almost instantly for almost nothing — that's what Solana does well. Buying SOL is a bet on the coin's price, not just the technology. As of November 2026 Vietnam has no licensed crypto exchange. This is education, not investment advice.",
        ],
      },
    ],
  },
];

export const chaptersVi: Chapter[] = [
  {
    label: "Solana là gì?",
    title: "Một cuốn sổ ghi chép chung",
    question: "Solana là gì, và vì sao người ta nói nó nhanh?",
    figure: "Một cuốn sổ mở ở giữa, xung quanh là khoảng chục máy tính, mỗi máy giữ một bản giống hệt. Một máy tự sửa bản của mình và bị các máy khác từ chối. Sau đó là đồng SOL và những việc người ta làm trên Solana.",
    beats: [
      {
        title: "Solana là một cuốn sổ chung.",
        body: ["Nó ghi lại ai gửi tiền cho ai. Cuốn sổ không do ngân hàng nào giữ: khoảng 650 máy tính trên khắp thế giới, mỗi máy giữ một bản giống hệt nhau."],
      },
      {
        title: "Không ai sửa sổ một mình được.",
        body: ["Mỗi dòng mới phải được đa số các máy kiểm tra và đồng ý. Một máy tự sửa bản của mình thì các máy khác không chấp nhận."],
      },
      {
        title: "SOL là đồng tiền của mạng.",
        body: ["Phí giao dịch được trả bằng SOL. Trên Solana, người ta còn gửi đô la số (như USDC), mua bán token và dùng các ứng dụng."],
      },
    ],
  },
  {
    label: "Nhi nhận tiền",
    title: "20 USDC, chưa tới một giây",
    question: "Một lần trả tiền trên Solana trông thế nào?",
    figure: "Điện thoại của khách bắn một tia sáng tới điện thoại của Nhi. Đồng hồ báo dưới một giây, phí 0,0004 USD. Sau đó ba hàng so sánh Bitcoin, Ethereum và Solana thêm trang sổ mới nhanh thế nào.",
    takeaway: "Có ba điều làm Solana nhanh: lượt ghi sổ được xếp sẵn, nhiều giao dịch được làm cùng lúc, và chỗ đông không làm đắt cả mạng. Ba chương tiếp theo lần lượt nói về từng điều.",
    beats: [
      {
        title: "Nhi bán bông tai trên mạng.",
        body: ["Một khách ở Singapore muốn trả 20 USDC — một loại đô la số. Nhi gửi địa chỉ ví (mã QR), khách bấm “gửi”."],
      },
      {
        title: "Chưa tới một giây, phí chưa tới 1 xu.",
        body: ["Tiền tới ví Nhi gần như ngay lập tức. Phí là 0,000005 SOL — khoảng 0,0004 USD khi SOL giá 73 USD."],
        insight: "Sau bản nâng cấp lớn tháng 10/2026, một giao dịch không thể bị đảo ngược sau khoảng 0,15 giây (mục tiêu), thay vì khoảng 12,8 giây trước đó.",
      },
      {
        title: "Nhanh hơn nhiều mạng khác.",
        body: ["Mạng nào cũng định kỳ thêm một trang mới (gọi là “khối”) vào sổ: Bitcoin khoảng 10 phút một lần, Ethereum 12 giây, Solana 0,2 giây."],
      },
    ],
  },
  {
    label: "Thay phiên ghi sổ",
    title: "Các máy thay phiên nhau ghi sổ",
    question: "Ai là người viết trang mới?",
    figure: "Bốn máy tính xếp hàng; một khung sáng chuyển từ máy này sang máy kia. Một dải trang được đánh số, mỗi máy viết bốn trang. Điện thoại bắn tia sáng thẳng tới máy đang viết.",
    beats: [
      {
        title: "Mỗi lúc chỉ một máy được ghi.",
        body: ["Máy đang tới lượt gom các giao dịch, viết thành một trang mới rồi gửi cho các máy khác kiểm tra."],
      },
      {
        title: "Lịch thay phiên có sẵn cho cả ngày.",
        body: ["Máy nào ghi vào lúc nào được tính trước cho khoảng 24 giờ. Mỗi máy ghi 4 trang liền — khoảng 0,8 giây — rồi tới máy kế tiếp."],
        term: "Tên kỹ thuật: leader schedule.",
      },
      {
        title: "Giao dịch được gửi thẳng tới máy đang ghi.",
        body: ["Vì ai cũng biết máy nào ghi tiếp, ví của khách gửi giao dịch thẳng tới máy đó, không phải nằm chờ trong một hàng chung như ở Bitcoin hay Ethereum."],
      },
    ],
  },
  {
    label: "Làm cùng lúc",
    title: "Nhiều giao dịch được làm cùng lúc",
    question: "Một trang có hàng nghìn giao dịch — làm sao kịp?",
    figure: "Bốn thẻ giao dịch, mỗi thẻ ghi rõ những ví nó dùng. Chúng chạy cùng lúc trên bốn làn. Hai lệnh mua cùng một đồng meme phải đi lần lượt trong một làn.",
    beats: [
      {
        title: "Mỗi giao dịch nói trước nó dùng những ví nào.",
        body: ["Ví dụ: khách → Nhi; An → Bình. Hai giao dịch này không liên quan gì tới nhau."],
      },
      {
        title: "Không liên quan thì làm cùng lúc.",
        body: ["Máy tính có nhiều nhân xử lý. Solana chia các giao dịch không liên quan cho nhiều nhân làm cùng một lúc. Ethereum thì làm lần lượt từng cái."],
        term: "Tên kỹ thuật: Sealevel.",
      },
      {
        title: "Cùng một chỗ thì làm lần lượt.",
        body: ["Khi nhiều người cùng mua một đồng meme, các lệnh đó cùng sửa một chỗ trong sổ nên phải chờ nhau. Chỗ đó chậm lại, phần còn lại vẫn chạy bình thường."],
      },
    ],
  },
  {
    label: "Phí",
    title: "Phí rẻ, kể cả khi mạng đông",
    question: "Ai nhận phí, và chuyện gì xảy ra khi mọi người đổ xô vào?",
    figure: "Một đồng phí rất nhỏ tách đôi: một nửa biến mất, một nửa cho máy đã ghi trang. Sau đó là thanh một trang sổ, trong đó một đồng meme chỉ được chiếm một phần nhỏ.",
    beats: [
      {
        title: "Phí cơ bản rất nhỏ.",
        body: ["Một giao dịch thường trả 0,000005 SOL. Một nửa bị huỷ vĩnh viễn, nửa còn lại trả cho máy đã ghi trang đó."],
      },
      {
        title: "Cần gấp thì trả thêm một chút.",
        body: ["Lúc mạng đông, ai cần gấp có thể trả thêm phí ưu tiên để được ghi trước."],
      },
      {
        title: "Một chỗ đông không chiếm hết trang.",
        body: ["Một đồng coin đang bị săn mua chỉ được dùng tối đa khoảng 12% mỗi trang. Những người mua coin đó tranh nhau trả phí cao, còn giao dịch của Nhi vẫn rẻ."],
      },
    ],
  },
  {
    label: "Những lần dừng",
    title: "Mạng từng dừng hẳn",
    question: "Nhanh như vậy thì có mặt trái không?",
    figure: "Dòng thời gian 2021–2026 với các điểm dừng màu đỏ: 17 giờ, 7 giờ, 19 giờ, 5 giờ. Sau tháng 2/2024 là một đoạn xanh dài 1.000 ngày.",
    takeaway: "Nhanh cũng có rủi ro riêng. Solana giờ ổn định hơn nhiều, nhưng lịch sử dừng mạng vẫn là điều nên biết.",
    beats: [
      {
        title: "Bị bot dội giao dịch.",
        body: ["Năm 2021–2022, các chương trình tự động (bot) gửi quá nhiều giao dịch cùng lúc làm mạng dừng — có lần tới 17 giờ. Trong lúc dừng, không ai gửi hay nhận tiền được."],
      },
      {
        title: "Rồi tới lỗi phần mềm.",
        body: ["Tháng 2/2023 mạng dừng gần 19 giờ, tháng 2/2024 khoảng 5 giờ. Mỗi lần, những người chạy máy phải cùng nhau khởi động lại."],
      },
      {
        title: "Hơn 1.000 ngày không dừng.",
        body: ["Từ 6/2/2024 tới nay mạng chưa dừng lần nào. Gửi giao dịch rác giờ phải trả phí, nên kiểu tắc nghẽn của những năm đầu hiếm hơn hẳn."],
      },
    ],
  },
  {
    label: "Máy đắt tiền",
    title: "Muốn nhanh thì máy phải đắt",
    question: "Ai có thể cùng giữ cuốn sổ?",
    figure: "Một máy chủ lớn cạnh một chiếc laptop, kèm thanh bộ nhớ. Sau đó là các chấm thể hiện số máy: từ 2.560 còn khoảng 650. Rồi vài chấm lớn nắm phần lớn sức nặng.",
    beats: [
      {
        title: "Mỗi máy phải rất mạnh.",
        body: ["Một máy giữ sổ Solana năm 2026 cần 384–512 GB RAM và đường mạng 10 Gbps. Một laptop phổ thông có 8–16 GB RAM."],
      },
      {
        title: "Nên ít người chạy được.",
        body: ["Số máy giảm từ 2.560 (3/2023) xuống khoảng 650 (10/2026), phần lớn vì chi phí cao."],
      },
      {
        title: "Ít máy thì quyền lực dồn về ít người.",
        body: ["Tháng 10/2026, chỉ cần khoảng 18 bên lớn nhất cộng lại là đủ sức làm dừng mạng. Phần lớn máy còn dùng chung một họ phần mềm, nên một lỗi có thể ảnh hưởng gần như tất cả."],
      },
    ],
  },
  {
    label: "Đồng SOL",
    title: "SOL dùng để làm gì, và giá ra sao",
    question: "Mạng chạy tốt thì giá SOL có tăng không?",
    figure: "Đồng SOL với hai công dụng: trả phí và đặt cọc (68%). Mỗi năm có SOL mới chảy ra. Sau đó là hai cột giá: đỉnh khoảng 293 USD và hiện tại 72,83 USD.",
    takeaway: "SOL được dùng thật, nhưng SOL mới vẫn được tạo thêm mỗi năm và giá đi theo tâm lý thị trường nhiều hơn theo tốc độ mạng.",
    beats: [
      {
        title: "Trả phí và đặt cọc.",
        body: ["SOL dùng để trả phí. Người giữ SOL còn có thể đặt cọc (stake): khoá SOL để ủng hộ một máy giữ sổ và nhận thưởng. Khoảng 68% số SOL đang được đặt cọc (5/2026)."],
      },
      {
        title: "Mỗi năm có thêm SOL mới.",
        body: ["Mỗi năm tạo thêm khoảng 3,6% SOL — khoảng 22,9 triệu đồng — để trả thưởng. Tỉ lệ này giảm dần mỗi năm; tháng 8/2026 mạng đã bỏ phiếu cho giảm nhanh gấp đôi."],
      },
      {
        title: "Thấp hơn đỉnh khoảng 75%.",
        body: ["Ngày 17/11/2026, SOL giá khoảng 72,83 USD, trong khi đỉnh là khoảng 293 USD (1/2025). Mạng được dùng nhiều không có nghĩa là giá sẽ tăng."],
      },
    ],
  },
  {
    label: "Tóm lại",
    title: "Con tàu ánh sáng: điểm mạnh, điểm yếu",
    question: "Vậy Solana làm tốt điều gì, và cần để ý điều gì?",
    figure: "Hai cột bên con tàu: điểm mạnh màu xanh, điểm yếu màu đỏ. Sau đó điện thoại của Nhi báo đã nhận 20 USDC.",
    beats: [
      {
        title: "Điểm mạnh.",
        body: ["Chuyển tiền dưới 1 giây · phí chưa tới 1 xu · nhiều giao dịch làm cùng lúc · chỗ đông không làm đắt cả mạng · hơn 1.000 ngày không dừng."],
      },
      {
        title: "Điểm yếu.",
        body: ["Từng dừng mạng nhiều lần 2021–2024 · máy đắt nên chỉ khoảng 650 máy · quyền lực dồn về ít bên · mỗi năm thêm khoảng 3,6% SOL mới · giá biến động rất mạnh."],
      },
      {
        title: "Với Nhi.",
        body: [
          "Nhi nhận 20 USDC gần như tức thì, phí gần như bằng 0 — đó là điều Solana làm tốt. Còn mua SOL là đặt cược vào giá đồng coin, không chỉ vào công nghệ. Tính tới tháng 11/2026, Việt Nam chưa có sàn crypto nào được cấp phép. Đây là nội dung giáo dục, không phải lời khuyên đầu tư.",
        ],
      },
    ],
  },
];
