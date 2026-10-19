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
  // In-page navigation. Pinned sections sit inside a .pin-spacer, so measure the spacer instead.
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      const el = id.length > 1 && document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const box = el.parentElement && el.parentElement.classList.contains("pin-spacer") ? el.parentElement : el;
      const y = id === "#top" ? 0 : box.getBoundingClientRect().top + window.scrollY;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: ABI.reduceMotion ? "auto" : "smooth" });
    });
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

/* "Data cloud" — the cloud-computing reading of The Cloud: a cloud silhouette built from
   network nodes and links, with data packets running along the links (and optional
   uplinks to a target, e.g. the tower crown). Canvas 2D, paused while off-screen.
   opts: box {x,y,w} as fractions of the canvas (cloud height = w * 0.62),
         density (≈ interior nodes), dark (bool, for navy backgrounds),
         links() → [{x,y}] canvas-px targets for uplink streams. */
ABI.dataCloud = function (canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const o = Object.assign({ box: { x: .1, y: .1, w: .8 }, density: 90, dark: false, links: null, alpha: 1 }, opts);
  const lobes = [[.30, .44, .17], [.50, .30, .22], [.71, .43, .17], [.17, .53, .085], [.84, .53, .085]];
  const rect = [.17, .44, .84, .615];
  const inside = (x, y, m = 0) => lobes.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) < r - m) ||
    (x > rect[0] + m && x < rect[2] - m && y > rect[1] + m && y < rect[3] - m);
  // seeded random → same cloud on every load
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pts = [];
  // contour nodes
  lobes.forEach(([cx, cy, r]) => {
    const n = Math.round(r * 120);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (!inside(x, y, -.004) || inside(x, y, .012)) continue;
      if (y > rect[3] + .002) continue;
      pts.push({ x, y, edge: true });
    }
  });
  for (let x = rect[0]; x <= rect[2]; x += .035) pts.push({ x, y: rect[3], edge: true });
  // interior nodes with a minimum spacing
  let guard = 0;
  while (pts.filter(p => !p.edge).length < o.density && guard++ < 6000) {
    const x = .1 + rnd() * .8, y = .06 + rnd() * .58;
    if (!inside(x, y, .02)) continue;
    if (pts.some(p => Math.hypot(p.x - x, p.y - y) < .036)) continue;
    pts.push({ x, y, edge: false });
  }
  pts.forEach(p => { p.ph = rnd() * Math.PI * 2; p.sp = .6 + rnd() * .8; p.pulse = 0; });
  // links: 3 nearest neighbours
  const edges = [], key = new Set();
  pts.forEach((p, i) => {
    pts.map((q, j) => [j, Math.hypot(p.x - q.x, p.y - q.y)]).filter(([j]) => j !== i)
      .sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([j, d]) => {
        const k = i < j ? i + "-" + j : j + "-" + i;
        if (!key.has(k) && d < .09) { key.add(k); edges.push([Math.min(i, j), Math.max(i, j), d]); }
      });
  });
  const bottom = pts.filter(p => p.edge && p.y > rect[3] - .01);
  const C = o.dark
    ? { node: "rgba(255,255,255,.9)", edgeNode: "#00aeef", line: "rgba(160,200,255,", pkt: "#7fe0ff", up: "rgba(0,174,239," }
    : { node: "#21409a", edgeNode: "#00aeef", line: "rgba(33,64,154,", pkt: "#00aeef", up: "rgba(0,174,239," };
  let W = 0, H = 0, S = 1, OX = 0, OY = 0, dpr = 1, spread = 0, fade = 1, raf = 0, visible = true, t0 = performance.now();
  const packets = [], ups = [];
  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const b = typeof o.box === "function" ? o.box() : o.box;
    S = W * b.w; OX = W * b.x; OY = H * b.y;
  }
  const P = p => {
    const t = (performance.now() - t0) / 1000;
    const jx = Math.sin(t * p.sp + p.ph) * .004, jy = Math.cos(t * p.sp * .8 + p.ph) * .004;
    const cx = .5, cy = .4;
    return [OX + (cx + (p.x + jx - cx) * (1 + spread)) * S, OY + (cy + (p.y + jy - cy) * (1 + spread * .6)) * S];
  };
  function frame() {
    raf = 0;
    if (!visible) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = o.alpha * fade;
    const XY = pts.map(P);
    // links
    ctx.lineWidth = 1;
    edges.forEach(([i, j, d]) => {
      ctx.strokeStyle = C.line + (pts[i].edge && pts[j].edge ? .55 : .2 + (.09 - d) * 2) + ")";
      ctx.beginPath(); ctx.moveTo(...XY[i]); ctx.lineTo(...XY[j]); ctx.stroke();
    });
    // uplinks to targets
    const targets = o.links ? o.links() : [];
    targets.forEach((tg, k) => {
      const from = XY[pts.indexOf(bottom[Math.round((k + 1) * bottom.length / (targets.length + 1)) % bottom.length])];
      ctx.strokeStyle = C.up + ".35)"; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(...from); ctx.lineTo(tg.x, tg.y); ctx.stroke(); ctx.setLineDash([]);
      tg._from = from;
    });
    // nodes
    pts.forEach((p, i) => {
      p.pulse = Math.max(0, p.pulse - .02);
      const r = (p.edge ? 2.1 : 1.5) + p.pulse * 3;
      ctx.fillStyle = p.edge ? C.edgeNode : C.node;
      ctx.beginPath(); ctx.arc(XY[i][0], XY[i][1], r, 0, 7); ctx.fill();
      if (p.pulse > 0) { ctx.strokeStyle = C.up + p.pulse * .6 + ")"; ctx.beginPath(); ctx.arc(XY[i][0], XY[i][1], r + 6 * (1 - p.pulse) + 2, 0, 7); ctx.stroke(); }
    });
    // packets along links
    if (packets.length < 22 && Math.random() < .35) {
      const e = edges[Math.floor(Math.random() * edges.length)];
      packets.push({ e, t: 0, v: .015 + Math.random() * .02, dir: Math.random() < .5 });
    }
    ctx.fillStyle = C.pkt; ctx.shadowColor = C.pkt; ctx.shadowBlur = 8;
    for (let k = packets.length - 1; k >= 0; k--) {
      const pk = packets[k]; pk.t += pk.v;
      const [a, b] = pk.dir ? [pk.e[0], pk.e[1]] : [pk.e[1], pk.e[0]];
      if (pk.t >= 1) { pts[b].pulse = 1; packets.splice(k, 1); continue; }
      const x = XY[a][0] + (XY[b][0] - XY[a][0]) * pk.t, y = XY[a][1] + (XY[b][1] - XY[a][1]) * pk.t;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fill();
    }
    // packets on uplinks
    targets.forEach((tg, k) => {
      if (!tg._from) return;
      if (!ups.some(u => u.k === k && u.t < .3) && Math.random() < .06) ups.push({ k, t: 0 });
    });
    for (let k = ups.length - 1; k >= 0; k--) {
      const u = ups[k], tg = targets[u.k]; u.t += .012;
      if (!tg || u.t >= 1) { ups.splice(k, 1); continue; }
      const x = tg._from[0] + (tg.x - tg._from[0]) * u.t, y = tg._from[1] + (tg.y - tg._from[1]) * u.t;
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill();
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    if (!ABI.reduceMotion) raf = requestAnimationFrame(frame);
  }
  size(); frame();
  new ResizeObserver(() => { size(); if (!raf) frame(); }).observe(canvas);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) frame(); }).observe(canvas);
  return {
    set spread(v) { spread = v; }, set fade(v) { fade = v; },
    redraw() { if (!raf) frame(); }
  };
};

// Hero network: cloud-computing cloud beside the tower crown, uplinks landing on the roof.
ABI.heroNet = function () {
  const cv = document.querySelector(".hero-net"), img = document.querySelector(".hero-tower img");
  if (!cv || !img) return null;
  const mobile = () => window.innerWidth <= 720;
  return ABI.dataCloud(cv, {
    box: () => (mobile() ? { x: .52, y: .5, w: .44 } : { x: .715, y: .06, w: .26 }),
    density: 70,
    links: () => {
      const r = img.getBoundingClientRect(), c = cv.getBoundingClientRect();
      return [[.42, .03], [.52, .06], [.62, .095]].map(([fx, fy]) => ({ x: r.left - c.left + r.width * fx, y: r.top - c.top + r.height * fy }));
    }
  });
};

// Small cloud-computing networks (replace the soft "floating clouds").
ABI.cloudNets = function () {
  document.querySelectorAll(".cs-net").forEach((c, i) => {
    ABI.dataCloud(c, { box: { x: .04, y: .1, w: .92 }, density: 34 });
    if (!ABI.reduceMotion) gsap.to(c, { y: i % 2 ? -16 : 16, duration: 4.5 + i, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });
};

// Split text of an element into word spans (keeps Vietnamese diacritics intact).
ABI.splitWords = function (el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(" ");
  return el.querySelectorAll(".wi");
};
