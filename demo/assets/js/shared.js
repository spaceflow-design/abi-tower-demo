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
      nla: "950.1 sqm",
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
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
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
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(" ");
  return el.querySelectorAll(".wi");
};
