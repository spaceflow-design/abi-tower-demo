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

/* Cloud-computing cloud (refs: Cloudflare line-art cloud, Antimetal/Base dot-matrix,
   Customer.io hub beams). A clean single-stroke cloud-icon outline with a dot-matrix
   fill that a slow light band sweeps across; small "ports" on the outline; optional
   curved beams from the ports to targets (the tower crown). Canvas 2D, calm on purpose.
   opts.clouds(W, H) → [{ cx, cy, w, flip, dir }] in canvas px (cloud height = w * 2/3)
   opts.beams(W, H, clouds) → [{ cloud, port:[u,v] (icon units), to:{x,y} }] */
ABI.iconCloud = function (canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  // Material "cloud" glyph — icon box x 0…24, y 4…20
  const SHAPE = new Path2D("M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z");
  const PERIM = 64;                                   // ≈ outline length in icon units (for the draw-on)
  const PORTS = [[6, 20], [19, 20], [12, 4], [0.2, 14.6], [23.8, 15.2]];
  const o = Object.assign({ clouds: (W, H) => [{ cx: W / 2, cy: H / 2, w: W * .86 }], beams: null, gap: 7, delay: 0, solid: false, globalBand: false, dim: 1, ports: true }, opts);
  let W = 0, H = 0, dpr = 1, raf = 0, visible = true, fade = 1, spread = 0;
  const t0 = performance.now() + o.delay * 1000, comets = [];
  const size = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
  };
  // icon-space → canvas px for one cloud
  const mat = c => {
    const s = c.w / 24, off = (c.dir || 0) * spread * 90, offY = (c.dy || 0) * spread * 120;
    const x0 = c.cx + off - (c.flip ? -c.w / 2 : c.w / 2), y0 = c.cy + offY - (c.w * 16 / 24) / 2 - 4 * s;
    return { a: c.flip ? -s : s, d: s, e: x0, f: y0 };
  };
  const pt = (m, [u, v]) => [m.e + m.a * u, m.f + m.d * v];
  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  function frame(now) {
    raf = 0;
    if (!visible) return;
    const t = Math.max(0, (now - t0) / 1000), k1 = ease(t / 1.4), k2 = ease((t - .5) / 1.2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = fade;
    const cs = o.clouds(W, H), ms = cs.map(mat);
    // beams first (under the clouds)
    const beams = o.beams ? o.beams(W, H, cs) : [];
    const curves = beams.map(b => {
      const F = pt(ms[b.cloud], b.port), T = [b.to.x, b.to.y];
      return [F, [F[0] + (T[0] - F[0]) * .55, F[1]], [T[0] + (F[0] - T[0]) * .12, T[1] + Math.abs(F[1] - T[1]) * .5], T];
    });
    curves.forEach(c => {
      const g = ctx.createLinearGradient(c[0][0], c[0][1], c[3][0], c[3][1]);
      g.addColorStop(0, "rgba(33,64,154,.5)"); g.addColorStop(.6, "rgba(33,64,154,.4)"); g.addColorStop(1, "rgba(0,174,239,.2)");
      ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.save(); ctx.globalAlpha = fade * k2;
      ctx.beginPath(); ctx.moveTo(...c[0]); ctx.bezierCurveTo(...c[1], ...c[2], ...c[3]); ctx.stroke();
      ctx.restore();
    });
    cs.forEach((c, i) => {
      const m = ms[i], h = c.w * 16 / 24;
      // soft body
      ctx.save(); ctx.setTransform(dpr * m.a, 0, 0, dpr * m.d, dpr * m.e, dpr * m.f);
      const body = ctx.createLinearGradient(0, 4, 0, 20);
      if (o.solid) { body.addColorStop(0, "#ffffff"); body.addColorStop(1, "#e6eff9"); }
      else { body.addColorStop(0, "rgba(255,255,255,.9)"); body.addColorStop(1, "rgba(207,225,244,.55)"); }
      ctx.globalAlpha = fade * k1; ctx.fillStyle = body; ctx.fill(SHAPE);
      // dot matrix, clipped to the cloud, with a slow diagonal light band
      ctx.clip(SHAPE);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const left = Math.min(m.e, m.e + m.a * 24), top = m.f + 4 * m.d, g = o.gap;
      const band = ((t * .18) % 1.6) - .3;            // 0…1 sweep, then a pause
      for (let y = Math.floor(top / g) * g; y < top + h; y += g) {
        for (let x = Math.floor(left / g) * g; x < left + c.w; x += g) {
          const p = o.globalBand ? (x / W) * .8 + (y / H) * .2 : ((x - left) / c.w) * .7 + ((y - top) / h) * .3;
          const lit = Math.max(0, 1 - Math.abs(p - band) / (o.globalBand ? .07 : .12));
          ctx.globalAlpha = fade * k2 * (.2 + .65 * lit) * o.dim;
          ctx.fillStyle = lit > .35 ? "#00aeef" : "#21409a";
          ctx.fillRect(x - .7, y - .7, 1.4, 1.4);
        }
      }
      ctx.restore();
      // outline (draws itself on load)
      ctx.save(); ctx.setTransform(dpr * m.a, 0, 0, dpr * m.d, dpr * m.e, dpr * m.f);
      const st = ctx.createLinearGradient(0, 0, 24, 0);
      st.addColorStop(0, "#21409a"); st.addColorStop(1, "#00aeef");
      ctx.strokeStyle = st; ctx.lineWidth = 1.5 / Math.abs(m.a); ctx.lineJoin = "round";
      ctx.setLineDash([PERIM * k1, PERIM]); ctx.globalAlpha = fade;
      ctx.stroke(SHAPE);
      ctx.restore();
      // ports
      ctx.globalAlpha = fade * k2;
      if (o.ports) PORTS.forEach(pp => {
        const [x, y] = pt(m, pp);
        ctx.fillStyle = "#fff"; ctx.strokeStyle = "#21409a"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill(); ctx.stroke();
      });
    });
    // rare, slow comets of light along the beams
    curves.forEach((c, i) => { if (k2 >= 1 && !comets.some(u => u.i === i) && Math.random() < .006) comets.push({ i, t: 0 }); });
    const bz = (c, tt) => { const u = 1 - tt; return [0, 1].map(j => u * u * u * c[0][j] + 3 * u * u * tt * c[1][j] + 3 * u * tt * tt * c[2][j] + tt * tt * tt * c[3][j]); };
    ctx.lineCap = "round";
    for (let n = comets.length - 1; n >= 0; n--) {
      const cm = comets[n], c = curves[cm.i]; cm.t += .0045;
      if (!c || cm.t >= 1) { comets.splice(n, 1); continue; }
      const env = Math.sin(Math.PI * cm.t);
      for (let q = 0; q < 12; q++) {
        const a = bz(c, Math.max(0, cm.t - .18 * q / 12)), b = bz(c, Math.max(0, cm.t - .18 * (q + 1) / 12));
        ctx.globalAlpha = fade * env * .9 * (1 - q / 12); ctx.strokeStyle = "#00aeef"; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    if (!ABI.reduceMotion) raf = requestAnimationFrame(frame);
  }
  size(); raf = requestAnimationFrame(frame);
  new ResizeObserver(() => { size(); if (!raf) raf = requestAnimationFrame(frame); }).observe(canvas);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(canvas);
  return { set spread(v) { spread = v; }, set fade(v) { fade = v; }, resize() { size(); } };
};

// Hero (ref: Popcorn "Tomorrow's Telecom" on Mobbin): a band of overlapping clouds along the
// bottom edge — two large ones behind the tower, three in front hiding its base.
ABI.heroNet = function () {
  const back = document.querySelector(".hero-net"), front = document.querySelector(".hero-net-front");
  if (!back) return null;
  const mobile = () => window.innerWidth <= 720;
  const layout = (W, H) => mobile()
    ? {
        back: [{ cx: W * .1, cy: H * .9, w: W * .62, flip: true, dir: -1 }, { cx: W * .92, cy: H * .88, w: W * .6, dir: 1 }],
        front: [{ cx: W * .5, cy: H * .975, w: W * .8, dy: 1 }]
      }
    : {
        back: [{ cx: W * .15, cy: H * .86, w: W * .3, flip: true, dir: -1 }, { cx: W * .85, cy: H * .845, w: W * .32, dir: 1 }],
        front: [
          { cx: W * .3, cy: H * .985, w: W * .24, dir: -1, dy: .6 },
          { cx: W * .5, cy: H * .955, w: W * .3, flip: true, dy: 1 },
          { cx: W * .71, cy: H * .99, w: W * .26, dir: 1, dy: .6 }
        ]
      };
  const nets = [ABI.iconCloud(back, { delay: .3, gap: 8, globalBand: true, dim: .8, ports: false, clouds: (W, H) => layout(W, H).back })];
  if (front) nets.push(ABI.iconCloud(front, { delay: .55, gap: 8, globalBand: true, solid: true, ports: false, clouds: (W, H) => layout(W, H).front }));
  return { set spread(v) { nets.forEach(n => (n.spread = v)); }, set fade(v) { nets.forEach(n => (n.fade = v)); } };
};

// Small clouds used as the "floating cloud" elements in the Cloud section.
ABI.cloudNets = function () {
  document.querySelectorAll(".cs-net").forEach((c, i) => {
    ABI.iconCloud(c, { gap: 6, clouds: (W, H) => [{ cx: W / 2, cy: H / 2, w: W * .86, flip: i % 2 === 1 }] });
    if (!ABI.reduceMotion) gsap.to(c, { y: i % 2 ? -14 : 14, duration: 5 + i, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });
};

// Split text of an element into word spans (keeps Vietnamese diacritics intact).
ABI.splitWords = function (el) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(" ");
  return el.querySelectorAll(".wi");
};
