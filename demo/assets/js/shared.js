/* ABI Tower — shared data & helpers for both homepage demos.
   Text below is copied from "ABI Tower - Website Content & Ref" (column E).
   Values marked (brochure) come from ABI Tower_Brochure.pdf where column E has no figure. */

window.ABI = window.ABI || {};

ABI.stack = {
  title: "Sơ đồ tầng (Stacking Plan)",
  summary: [
    { k: "Tầng nổi", v: 16 },
    { k: "Tầng hầm", v: 2 },
    { k: "Tầng tum", v: 1 },
    { k: "Tổng diện tích sàn (GFA)", v: "22.934,7", unit: "m²" },
    { k: "Diện tích thuê (NLA)", v: "12.667,6", unit: "m²" }
  ],
  // Groups, top → bottom. `floors` = floor keys that belong to the group.
  groups: [
    {
      id: "f16", floors: ["16"], tag: "16F", type: "rooftop",
      title: "Tầng 16: Tầng thượng",
      desc: "Không gian mở với tầm nhìn bao trọn cảnh quan khu vực Starlake, tích hợp với khoảng vườn xanh và quán cà phê mang đến không gian thư giãn, kết nối, tái tạo năng lượng",
      img: "rooftop.webp"
    },
    {
      id: "f15", floors: ["15"], tag: "15F", type: "abi",
      title: "Tầng 15: Văn phòng & Game Studio của ABI Tower",
      img: "studio.webp"
    },
    {
      id: "f10-14", floors: ["14", "13", "12", "11", "10"], tag: "10F – 14F", type: "office",
      title: "Tầng 12F - Tầng văn phòng điển hình",
      nla: "816.5 sqm",
      desc: "Khu văn phòng cao tầng sở hữu tầm nhìn thoáng đãng và ánh sáng tự nhiên từ mặt kính hướng Bắc, kết hợp cùng hạ tầng quản trị thông minh mang đến không gian làm việc tiện nghi và tối ưu hiệu suất.",
      plan: "f10-14.webp"
    },
    {
      id: "f6-9", floors: ["9", "8", "7", "6"], tag: "6F – 9F", type: "office",
      title: "Tầng 2 - 14: Văn phòng hạng A",
      nla: "815.8 sqm", nlaSource: "brochure",
      desc: "Mặt bằng không cột, hệ thống sàn nâng cùng các giải pháp văn phòng thông minh mang đến không gian làm việc linh hoạt, tối ưu hiệu quả",
      plan: "f6-9.webp"
    },
    {
      id: "f3-5", floors: ["5", "4", "3"], tag: "3F – 5F", type: "office",
      title: "Tầng 3F-5F: Văn phòng",
      nla: "803.4 sqm",
      desc: "Với thiết kế tối ưu linh hoạt, khu văn phòng tầng thấp cho phép doanh nghiệp dễ dàng điều chỉnh và bố trí linh hoạt theo quy mô và nhu cầu sử dụng",
      plan: "f3-5.webp"
    },
    {
      id: "f2", floors: ["2"], tag: "2F", type: "office",
      title: "Tầng 2F - Văn phòng",
      nla: "320.1 sqm",
      desc: "Thiết kế thông trần mở ra tầm nhìn bao quát xuống khu vực sảnh chính đánh dấu điểm khởi đầu cho chuỗi không gian làm việc hiện đại và chuẩn mực tại ABI Tower.",
      plan: "f2.webp"
    },
    {
      id: "f1", floors: ["1"], tag: "1F", type: "lobby",
      title: "Tầng 1F - Sảnh đón tích hợp Cà phê ngoài trời",
      nla: "422 sqm",
      desc: "Sảnh đón khách kết nối trực tiếp với quảng trường ngoài trời, nổi bật cùng đài phun nước hologram công nghệ cao và cụm điêu khắc kiến trúc \"The Cloud\". Khu vực cà phê ngoài trời đan xen nhiều mảng xanh, tạo nên một không gian thoáng đãng, ấn tượng ngay từ điểm chạm đầu tiên.",
      plan: "f1.webp"
    },
    {
      id: "fb", floors: ["B1", "B2"], tag: "B1 – B2", type: "basement",
      title: "Tầng B1-B2: Hầm đỗ xe",
      img: "basement.webp"
    }
  ]
};

// floor key → group lookup
ABI.floorGroup = {};
ABI.stack.groups.forEach(g => g.floors.forEach(f => (ABI.floorGroup[f] = g)));
ABI.floorOrder = ["16", "15", "14", "13", "12", "11", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "B1", "B2"];

ABI.contact = { hotline: "0829-898-389", tel: "0829898389", email: "sales@catgojsc.com" };

/* ---------- helpers ---------- */

ABI.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync.
ABI.initSmooth = function () {
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!ABI.reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.1, smoothWheel: true,
      // horizontal trackpad swipes over a sideways scroller (the smart-tech slider) belong to that scroller
      virtualScroll: d => !(d.event && d.event.target && d.event.target.closest && d.event.target.closest(".tech-view") && Math.abs(d.deltaX) > Math.abs(d.deltaY))
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // pin spacers change the page height → keep Lenis' scroll limit in sync
    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ABI.lenis = lenis;
  }
  // In-page navigation (delegated, so links added later work too). Pinned sections sit inside a
  // .pin-spacer, so measure the spacer instead; the target's scroll-margin-top keeps it clear of the header.
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute("href");
    const el = id.length > 1 && document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const box = el.parentElement && el.parentElement.classList.contains("pin-spacer") ? el.parentElement : el;
    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const y = id === "#top" ? 0 : box.getBoundingClientRect().top + window.scrollY - margin;
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: ABI.reduceMotion ? "auto" : "smooth" });
    // keyboard users continue from the target, not from the link they pressed
    if (!el.hasAttribute("tabindex")) { el.setAttribute("tabindex", "-1"); el.setAttribute("data-focus-target", ""); }
    el.focus({ preventScroll: true });
  });
  return lenis;
};

// Inject the connectivity map SVG and return the <svg> element.
ABI.mountMap = function (host) {
  host.innerHTML = window.ABI_MAP_SVG || "";
  return host.querySelector("svg");
};

// Demo QR (Zalo QR not supplied yet — placeholder pointing at the hotline's Zalo link).
ABI.mountQR = function (host, size, dark, light) {
  if (!host || typeof QRCode === "undefined") return;
  host.innerHTML = "";
  new QRCode(host, {
    text: "https://zalo.me/" + ABI.contact.tel,
    width: size, height: size,
    colorDark: dark || "#232960", colorLight: light || "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
};

// Split text of an element into word spans (keeps Vietnamese diacritics intact).
ABI.splitWords = function (el) {
  const words = el.textContent.trim().split(/[^\S\u00a0]+/);   // no-break spaces (ABI.keepWords) stay inside a word
  el.innerHTML = words.map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(" ");
  return el.querySelectorAll(".wi");
};

/* ---------- Vietnamese words never break at a line end (client 19/11) ----------
   A Vietnamese word is often two or three syllables separated by spaces ("văn phòng", "Hà Nội"), and a line break
   between them reads as a broken word. Every term in ABI.WORDS gets no-break spaces between its syllables at run
   time, so the copy in the HTML stays exactly as the client wrote it. The list was built from every syllable pair in
   the site's copy (compounds, reduplicatives, names, number + unit) — add a term here when new copy brings a new one.
   Matching ignores case; a term never runs across punctuation; the longest term wins. */
ABI.WORDS = [
  "ABI Tower", "an ninh", "an toàn", "bao quát", "BBQ Chicken", "Biểu tượng", "Bàn giao", "Bán lẻ", "báo cháy", "Bãi đỗ xe",
  "Bò Tơ", "bước tiến", "bảo chứng", "Bảo tàng", "bất động", "bất động sản", "bắt buộc", "bắt đầu", "bề dày", "bền vững",
  "Bệnh viện", "Bệnh viện E", "bố trí", "bổ sung", "bứt phá", "cam kết", "cao tầng", "Catgo Investment", "Catgo Investment JSC", "chi phí",
  "Chiến thắng", "chiếu sáng", "Chiều cao", "cho phép", "cho thuê", "chuyên nghiệp", "chuyển động", "chuẩn mực", "Chí Minh", "chính thức",
  "chúng tôi", "chất lượng", "Chủ đầu tư", "chủ động", "chứng chỉ", "Chứng nhận", "chữa cháy", "con người", "Crumbs Artelier", "cung cấp",
  "cà phê", "cách âm", "cây xanh", "có thể", "Công An", "công nghệ", "công trình", "công ty", "cơ bản", "Cơ quan",
  "cảm biến", "cảm giác", "Cảm hứng", "cảm nhận", "Cảm ơn", "Cảnh quan", "cất nóc", "Cầu Diễn", "Cập nhật", "cốt lõi",
  "cổ phần", "cộng hưởng", "cộng đồng", "cụ thể", "danh giá", "Danh hiệu", "di chuyển", "diện mạo", "Diện tích", "doanh nghiệp",
  "dài hạn", "Dân tộc", "Dân tộc học", "dấu ấn", "dễ dàng", "dự án", "Fraser Residence", "Fu Rong", "Fu Rong Hua", "giai đoạn",
  "giao lưu", "giao thông", "giá trị", "giám sát", "giải pháp", "Giải thưởng", "Giải trí", "giật cấp", "Google Maps", "góp phần",
  "gắn kết", "Hanoi Westlake", "hiện thực", "hiện thực hóa", "hiện đại", "hiệu quả", "hiệu suất", "Hoàn Kiếm", "HPA & PARTNERS", "Hoàn thiện", "hoàn tất",
  "hoạt động", "Hà Nội", "Hàn Quốc", "hàng ngày", "hàng đầu", "hành chính", "Hình tượng", "hạ tầng", "hạng A", "Hạng mục",
  "hấp thụ", "Hệ sinh thái", "Hệ thống", "Họ tên", "Hồ Chí", "Hồ Chí Minh", "Hồ Tây", "hỗ trợ", "hội tụ", "Hợp Quốc",
  "hợp tác", "Hợp đồng", "Indochina Plaza", "Investment JSC", "khu vực", "khác biệt", "Khách sạn", "khách thuê", "khám phá", "không gian",
  "không khí", "khơi mở", "khơi nguồn", "khắt khe", "khẳng định", "khởi tạo", "khởi đầu", "kinh doanh", "kinh nghiệm", "Kiến trúc",
  "kiến tạo", "Kính hộp", "kết hợp", "kết nối", "kỷ nguyên", "kỹ thuật", "LEED Gold", "linh hoạt", "Liên hệ", "Liên Hợp",
  "Liên Hợp Quốc", "Lotte Mall", "làm việc", "lành mạnh", "lân cận", "lý tưởng", "lĩnh vực", "lựa chọn", "Maison Sen", "mong muốn",
  "Mua sắm", "màn hình", "môi trường", "Mặt bằng", "Mặt dựng", "Mặt kính", "Mặt sàn", "Mặt tiền", "mặt đứng", "mềm mại",
  "Mộc Nhiên", "mục tiêu", "Nghệ thuật", "ngoài trời", "Ngoại Giao", "Ngoại Giao Đoàn", "ngôn ngữ", "nhanh chóng", "nhiệt độ", "Nhu cầu",
  "Nhà hàng", "Nhân dân", "nhân sự", "nhân viên", "Nhật Tân", "nhẹ nhàng", "nuôi dưỡng", "năng lượng", "năng lực", "nền tảng",
  "nổi bật", "Nội Bài", "nội thất", "Phiên bản", "phát triển", "phân luồng", "Phòng họp", "Phòng khám", "phù hợp", "Phú Diễn",
  "quan tâm", "quy mô", "Quy trình", "quy tụ", "quy định", "Quán Mộc", "Quán nhậu", "quý khách", "quản lý", "quản trị",
  "quảng trường", "Quốc tế", "Rong Hua", "rõ ràng", "rộng mở", "Sheraton Hanoi", "Shilla Monogram", "sinh thái", "Sky Café", "sàn nâng",
  "sáng tạo", "Sân bay", "Sơ đồ", "sẵn sàng", "sở hữu", "sứ mệnh", "sứ quán", "sức khỏe", "sử dụng", "tham quan",
  "Tham vọng", "thang máy", "The Cloud", "thi công", "thiên nhiên", "Thiết kế", "thoáng đãng", "thoải mái", "thuận lợi", "thuận tiện",
  "thông minh", "thông thoáng", "thông thủy", "thông tin", "thúc đẩy", "thư giãn", "thương mại", "thấp tầng", "thập kỷ", "thế giới",
  "thế hệ", "thống nhất", "thủ tục", "thực chiến", "thực tế", "thực vật", "Tin tức", "tinh thần", "tiên phong", "tiêu chuẩn",
  "tiến độ", "tiếng Anh", "tiết kiệm", "tiện nghi", "tiện ích", "Trang chủ", "Trung tâm", "tràn đầy", "Trạm sạc", "Trải nghiệm",
  "trọn vẹn", "Trọng tải", "Trở thành", "trực tiếp", "tuân thủ", "tài nguyên", "tái tạo", "Tây Hồ", "Tây Hồ Tây", "tích hợp",
  "Tòa nhà", "tư duy", "tư vấn", "tương lai", "tạo dựng", "tầm nhìn", "tầng hầm", "tầng nổi", "tầng thượng", "Tầng tum",
  "tập trung", "tập đoàn", "Tọa lạc", "tốc độ", "tối đa", "tối ưu", "tổ hợp", "Tổng thầu", "tổng thể", "Tự Do",
  "tự hào", "tự nhiên", "tự động", "uy tín", "uốn lượn", "vinh danh", "Việt Nam", "Vui lòng", "Vành đai", "Vành đai 2",
  "Vành đai 3", "Vách ngăn", "Văn phòng", "vượt trội", "vận hành", "vị thế", "Vị trí", "xe máy", "xe điện", "Xuân Tảo",
  "Xuân Đỉnh", "Xuất phát", "xây dựng", "yêu cầu", "ánh sáng", "Ô H2CC2", "ý tưởng", "ô tô", "đa dạng", "Đa khoa", "đa năng",
  "đa tầng", "đan xen", "điêu khắc", "điều chỉnh", "điều hòa", "điều hướng", "điều khiển", "điều khoản", "Điều kiện", "điểm chạm",
  "Điểm nhấn", "điểm đến", "điển hình", "điện thoại", "điện toán", "đài phun nước", "Đám mây", "đánh dấu", "Đình Làng", "đô thị",
  "Đăng ký", "đơn vị", "Đại sứ", "Đại sứ quán", "đại đô thị", "đảm bảo", "đầu tiên", "đầu tư", "đắc địa", "đỉnh cao",
  "Địa chỉ", "định hình", "Định hướng", "đồng hành", "đổi mới", "Đội ngũ", "đột phá", "ưu tiên", "ưu đãi", "ấn tượng",
  "Ủy ban", "ứng dụng"
];
ABI.keepWords = (function () {
  const terms = new Map();   // lower-case first syllable → [syllable arrays], longest first
  ABI.WORDS.forEach(w => {
    const s = w.toLocaleLowerCase("vi").split(" ");
    if (s.length < 2) return;
    (terms.get(s[0]) || terms.set(s[0], []).get(s[0])).push(s);
  });
  terms.forEach(list => list.sort((a, b) => b.length - a.length));
  const LEAD = /^[(“"‘'[]+/, TRAIL = /[)”"’'\].,;:!?…]+$/;
  const UNIT = /^(sqm|m²|m2|m|km|kW|KW|kg|kg\/m2|phút|%)$/, LABEL = /^(tầng|quý|tháng|khung|số|khối)$/;
  const SKIP = "script,style,noscript,svg,textarea,input,select,option,#hdr,.dock,[data-nokeep]";
  const bindText = text => {
    if (!/[^\S\u00a0]/.test(text)) return text;
    const parts = text.split(/([^\S\u00a0]+)/);   // words at even indexes, whitespace runs (as the source wrote them) at odd ones
    for (let i = 0; i < parts.length; i += 2) {
      const first = parts[i].replace(LEAD, "").toLocaleLowerCase("vi");
      if (TRAIL.test(parts[i]) || parts[i + 2] === undefined || LEAD.test(parts[i + 2])) continue;
      const next = parts[i + 2].replace(TRAIL, "");
      // a number keeps its unit (422 sqm, ~800 m²), a label keeps its number (Tầng 12F, Quý 1, Tháng 11)
      if ((/\d$/.test(first) && UNIT.test(next)) || (LABEL.test(first) && /^[0-9]|^B\d/.test(next))) { parts[i + 1] = "\u00a0"; i += 2; continue; }
      const cands = first && terms.get(first);
      if (!cands) continue;
      for (const s of cands) {
        let ok = true;
        for (let k = 1; k < s.length && ok; k++) {
          const w = parts[i + 2 * k];
          if (w === undefined || LEAD.test(w)) { ok = false; break; }
          const core = w.replace(TRAIL, "");
          if (core.toLocaleLowerCase("vi") !== s[k] || (k < s.length - 1 && core !== w)) ok = false;
        }
        if (!ok) continue;
        for (let k = 1; k < s.length; k++) parts[i + 2 * k - 1] = "\u00a0";   // a whitespace run renders as one space anyway
        i += 2 * (s.length - 1);
        break;
      }
    }
    return parts.join("");
  };
  const bindNode = n => {
    if (!n.parentElement || n.parentElement.closest(SKIP)) return;
    const t = bindText(n.data);
    if (t !== n.data) n.data = t;
  };
  const run = root => {
    if (root.nodeType === 3) return bindNode(root);
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) bindNode(n);
  };
  return run;
})();
ABI.keepWords(document.body);
// text added or changed later (stacking panel, floor plans, map lists, form messages) gets the same treatment
new MutationObserver(list => list.forEach(m => {
  if (m.type === "characterData") ABI.keepWords(m.target);
  else m.addedNodes.forEach(n => (n.nodeType === 1 || n.nodeType === 3) && ABI.keepWords(n));
})).observe(document.body, { subtree: true, childList: true, characterData: true });
