/* ABI Tower — Option A · chrome shared by the homepage and the subpages:
   smooth scroll, toast, brand pattern, header (nav roll, solid state), quick-contact dock,
   leasing form + QR, and the isometric stacking plan (ABI.mountStacking). */
(() => {
  ABI.initSmooth();
  const NS = "http://www.w3.org/2000/svg";
  const $ = id => document.getElementById(id);
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };
  const pts = a => a.map(p => p.join(",")).join(" ");
  ABI.svgEl = el;
  ABI.pts = pts;

  /* ---------- toast + demo links ---------- */
  const toastEl = $("toast");
  let toastT;
  ABI.toast = msg => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  };
  document.querySelectorAll("[data-demo]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); ABI.toast(a.dataset.demo); }));

  /* ---------- brand line pattern — modules from the logo (bar + diagonal stroke) ---------- */
  ABI.buildPattern = function (svg, w, h, shift = 0) {
    const W = 135, H = 142, SHIFT = 27;
    if (!w) { const b = svg.getBoundingClientRect(); w = b.width; h = b.height; }
    const cols = Math.ceil(w / W) + 3, rows = Math.ceil(h / H) + 2;
    if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const fills = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * W - r * SHIFT + (rows * SHIFT) % W - W + shift, oy = r * H - 40;
        el("polygon", { class: "pt-l", points: pts([[ox + 86, oy - 7], [ox + 140, oy - 101], [ox + 166, oy - 54], [ox + 113, oy + 39]]) }, svg);
        const bar = [[ox, oy], [ox + 80, oy], [ox + 103, oy + 39], [ox + 23, oy + 39]];
        el("polygon", { class: "pt-l", points: pts(bar) }, svg);
        if ((r * 7 + c * 3) % 5 === 0 || (r + c) % 7 === 0) fills.push(el("polygon", { class: "pt-f", points: pts(bar) }, svg));
      }
    }
    return fills;
  };
  document.querySelectorAll(".pattern").forEach(svg => {
    const fills = ABI.buildPattern(svg);
    if (svg.classList.contains("hero-pattern")) {
      gsap.to(fills, { opacity: () => gsap.utils.random([.1, .2, .32]), duration: 1.6, stagger: { each: .03, from: "random", repeat: -1, yoyo: true, repeatDelay: 1.2 }, ease: "sine.inOut" });
    } else {
      gsap.to(fills, {
        opacity: () => gsap.utils.random([.3, .55, .85]), stagger: { each: .02, from: "random" }, ease: "none",
        scrollTrigger: { trigger: svg.parentElement, start: "top 85%", end: "bottom 40%", scrub: true }
      });
    }
  });

  /* ---------- header — white over the navy hero, glass pill after; letters roll up on hover (ref: IFC Hanoi) ---------- */
  const hdr = $("hdr");
  document.querySelector(".hdr-burger").addEventListener("click", e => {
    const open = hdr.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const navLinks = [...hdr.querySelectorAll(".hdr-nav a")];
  navLinks.forEach(a => {
    a.addEventListener("click", () => hdr.classList.remove("nav-open"));
    if ((a.getAttribute("href") || "").toLowerCase() === page) { a.classList.add("is-current"); a.setAttribute("aria-current", "page"); }
    // each letter sits in a mask with a copy below it; CSS slides the column up with a small stagger
    const text = a.textContent.trim().normalize("NFC");
    a.setAttribute("aria-label", text);
    a.innerHTML = `<span class="roll" aria-hidden="true">${Array.from(text).map((c, i) => {
      const ch = c === " " ? "&nbsp;" : c;
      return `<span class="lm"><span class="lc" style="--i:${i}"><span>${ch}</span><span>${ch}</span></span></span>`;
    }).join("")}</span>`;
  });
  hdr.querySelectorAll(".hdr-lang button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === "en") ABI.toast("Phiên bản tiếng Anh (EN) sẽ được bổ sung ở giai đoạn build");
  }));
  // the pill turns solid once the navy hero has scrolled under it; the quick-contact dock shows after
  // the hero and steps aside at the footer (same buttons there). Live positions on every scroll so
  // reloads, anchor jumps and the very bottom of the page all get the right state.
  const dock = document.querySelector(".dock");
  const heroEl = document.querySelector(".hero, .phero"), ftrEl = document.querySelector(".ftr");
  const syncChrome = () => {
    const vh = window.innerHeight, heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0, ftrTop = ftrEl.getBoundingClientRect().top;
    hdr.classList.toggle("is-solid", heroBottom <= 80);
    dock && dock.classList.toggle("is-on", heroBottom <= vh * .6 && ftrTop > vh * .9);
  };
  window.addEventListener("scroll", syncChrome, { passive: true });
  window.addEventListener("resize", syncChrome);
  ABI.lenis && ABI.lenis.on("scroll", syncChrome);
  ScrollTrigger.addEventListener("refresh", syncChrome);
  ScrollTrigger.addEventListener("scrollEnd", syncChrome);
  syncChrome();

  /* ---------- leasing form (demo: validates, nothing is sent) + Zalo QR ---------- */
  ABI.mountQR($("qr"), 120);
  const form = $("leadForm"), msg = $("leadMsg");
  if (form) {
    // "Khác" opens an optional text field to describe the need
    const otherBox = $("fOther"), otherInput = otherBox.querySelector("input");
    const otherCheck = form.querySelector('[name="interest"][value="other"]');
    const syncOther = focus => {
      otherBox.classList.toggle("is-on", otherCheck.checked);
      otherInput.disabled = !otherCheck.checked;
      if (otherCheck.checked && focus) setTimeout(() => otherInput.focus({ preventScroll: true }), 250);
    };
    otherCheck.addEventListener("change", () => syncOther(true));
    form.addEventListener("submit", e => {
      e.preventDefault();
      const f = form.elements;
      const bad = [];
      const need = (input, ok) => { input.classList.toggle("is-bad", !ok); if (!ok) bad.push(input); };
      need(f.name, f.name.value.trim().length > 1);
      need(f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()));
      need(f.phone, f.phone.value.replace(/\D/g, "").length >= 9);
      const checks = form.querySelector(".f-checks");
      const anyInterest = [...form.querySelectorAll('[name="interest"]')].some(c => c.checked);
      checks.classList.toggle("is-bad", !anyInterest);
      msg.className = "f-msg";
      if (bad.length || !anyInterest) {
        msg.classList.add("is-err");
        msg.textContent = "Vui lòng điền đủ các mục có dấu *";
        (bad[0] || checks.querySelector("input")).focus();
        return;
      }
      msg.classList.add("is-ok");
      msg.textContent = "Cảm ơn bạn! (Bản demo — thông tin chưa được gửi đi)";
      form.reset();
      syncOther(false);
    });
  }

  /* ---------- auto slideshow (no controls): cross-fades the <img>s inside [data-slides] ---------- */
  ABI.slideshow = function (host, every = 4.2) {
    const slides = [...host.querySelectorAll("img")];
    if (slides.length < 2) return;
    let i = 0;
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[0], { autoAlpha: 1 });
    const dots = host.querySelector(".slides-dots");
    if (dots) dots.innerHTML = slides.map((_, k) => `<i${k ? "" : ' class="is-on"'}></i>`).join("");
    const next = () => {
      const a = slides[i], b = slides[(i = (i + 1) % slides.length)];
      gsap.to(a, { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" });
      gsap.fromTo(b, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" });
      dots && [...dots.children].forEach((d, k) => d.classList.toggle("is-on", k === i));
    };
    if (!ABI.reduceMotion) gsap.delayedCall(every, function tick() { next(); gsap.delayedCall(every, tick); });
  };
  document.querySelectorAll("[data-slides]").forEach(h => ABI.slideshow(h));

  /* ---------- leasing card + generic reveals. Call after any pinned section above them exists. ---------- */
  ABI.lateReveals = function () {
    const lc = document.querySelector(".lease-card");
    lc && gsap.from(lc, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".lease", start: "top 85%" } });
    gsap.utils.toArray("[data-reveal]").forEach(n => gsap.from(n, {
      y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 90%" }
    }));
  };

  /* ------------------------------------------------------------------
     STACKING PLAN — isometric tower, clickable floor groups.
     cfg.groups: top → bottom, each { id, floors:[keys], tag, type }. cfg.onSelect(group) fills the page's panel.
  ------------------------------------------------------------------ */
  ABI.mountStacking = function (iso, cfg) {
    const Cc = .866, Ss = .5, L = 240, D = 140, OX = 175, OY = 412, FH = 20;
    const P = (x, y, z) => [OX + (x - z) * Cc, OY + (x + z) * Ss - y];
    const floorsSpec = [];   // bottom → top
    floorsSpec.push({ key: "B2", y0: -40, y1: -20 }, { key: "B1", y0: -20, y1: 0 }, { key: "1", y0: 0, y1: 30 });
    for (let f = 2; f <= 16; f++) floorsSpec.push({ key: String(f), y0: 30 + (f - 2) * FH, y1: 30 + (f - 1) * FH });
    const roofY = 30 + 15 * FH, ti = 60, tz = 36, th = 16;
    floorsSpec.push({ key: "R", y0: roofY, y1: roofY + th, roof: true });

    el("polygon", { class: "ground", points: pts([P(-30, 0, -30), P(L + 30, 0, -30), P(L + 30, 0, D + 30), P(-30, 0, D + 30)]) }, iso);
    const groupEls = {}, order = [];
    cfg.groups.slice().reverse().forEach(g => {        // bottom → top
      const ge = el("g", { class: `grp t-${g.type}`, "data-g": g.id, tabindex: 0, role: "button", "aria-label": g.tag }, iso);
      groupEls[g.id] = ge; order.push(ge);
      floorsSpec.filter(f => g.floors.includes(f.key)).forEach(f => {
        const fe = el("g", { class: "fl" + (f.key.startsWith("B") ? " is-basement" : "") }, ge);
        const a = f.y0, b = f.y1;
        const x0 = f.roof ? ti : 0, x1 = f.roof ? L - ti : L, z0 = f.roof ? tz : 0, z1 = f.roof ? D - tz : D;
        el("polygon", { class: "fz-l", points: pts([P(x0, a, z1), P(x1, a, z1), P(x1, b, z1), P(x0, b, z1)]) }, fe);
        el("polygon", { class: "fz-r", points: pts([P(x1, a, z0), P(x1, a, z1), P(x1, b, z1), P(x1, b, z0)]) }, fe);
        el("polygon", { class: "fz-t", points: pts([P(x0, b, z0), P(x1, b, z0), P(x1, b, z1), P(x0, b, z1)]) }, fe);
      });
    });

    // labels with leader lines
    const lblEls = {}, lblGroups = {};
    cfg.groups.forEach(g => {
      const fs = floorsSpec.filter(f => g.floors.includes(f.key));
      const ymid = (Math.min(...fs.map(f => f.y0)) + Math.max(...fs.map(f => f.y1))) / 2;
      const [x, y] = P(fs[0].roof ? L - ti : L, ymid, fs[0].roof ? tz : 0);
      const lg = el("g", { class: "lblg" }, iso);
      el("line", { class: "lead", x1: x + 8, y1: y, x2: 470, y2: y }, lg);
      const t = el("text", { class: "lbl", x: 478, y: y + 4 }, lg);
      t.textContent = g.tag;
      lblEls[g.id] = t; lblGroups[g.id] = lg;
    });

    let active = null;
    function select(id) {
      const g = cfg.groups.find(x => x.id === id);
      if (!g || id === active) return;
      if (active) { groupEls[active].classList.remove("is-active"); lblEls[active].classList.remove("is-active"); }
      active = id;
      const ge = groupEls[id];
      ge.classList.add("is-active");
      lblEls[id].classList.add("is-active");
      // explode: everything above the chosen floors lifts so its top slab is revealed
      const idx = order.indexOf(ge);
      order.forEach((o, i) => gsap.to([o, lblGroups[o.dataset.g]], { y: i > idx ? -34 : 0, duration: .7, ease: "power3.inOut" }));
      cfg.onSelect && cfg.onSelect(g);
    }
    Object.entries(groupEls).forEach(([id, ge]) => {
      ge.addEventListener("mouseenter", () => ge.classList.add("is-hover"));
      ge.addEventListener("mouseleave", () => ge.classList.remove("is-hover"));
      ge.addEventListener("click", () => select(id));
      ge.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select(id)));
    });
    cfg.initial && select(cfg.initial);

    gsap.from(iso.querySelectorAll(".grp .fl"), {
      opacity: 0, duration: .5, ease: "power2.out", stagger: { each: .05, from: "start" },
      scrollTrigger: { trigger: iso, start: "top 75%" }
    });
    return { select, hover: (id, on) => groupEls[id] && groupEls[id].classList.toggle("is-hover", on) };
  };

  // GFA / NLA stats count up when they scroll in
  ABI.mountStats = function (dl, summary) {
    summary.forEach(s => {
      const d = document.createElement("div");
      d.innerHTML = `<dt>${s.k}</dt><dd><span>${s.v}</span>${s.unit ? `<small>${s.unit}</small>` : ""}</dd>`;
      dl.appendChild(d);
      const span = d.querySelector("span");
      const target = parseFloat(String(s.v).replace(/\./g, "").replace(",", "."));
      const dec = String(s.v).includes(",") ? 1 : 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.8, ease: "power2.out",
        scrollTrigger: { trigger: dl, start: "top 90%" },
        onUpdate: () => { span.textContent = obj.v.toLocaleString("vi-VN", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
      });
    });
  };

  // brochure plans (Vietnamese edition, 11/2026) + their zone legends
  ABI.LEG = {
    office: [["Văn phòng", "#d6d8e3"], ["Không gian xanh", "#d9f0c0"], ["Khu vực chung & Khu kỹ thuật", "#edf5fc"]],
    lobby: [["Thương mại", "#cceffc"], ["Sảnh", "#e6f7fd"], ["Bãi đỗ xe ngoài trời", "#dcdbdb"], ["Không gian xanh", "#d9f0c0"], ["Khu vực chung & Khu kỹ thuật", "#edf5fc"]],
    basement: [["Khu đỗ xe", "#dbdbdb"], ["Khu vực chung & Khu kỹ thuật", "#edf5fc"]]
  };
  ABI.legendHTML = leg => (leg || []).map(([k, c]) => `<li><i style="--c:${c}"></i>${k}</li>`).join("");

  // lazy images that change a block's height move every trigger below them → re-measure once they settle
  let refreshT;
  const refreshSoon = () => { clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 250); };
  document.querySelectorAll('img[loading="lazy"]').forEach(img => img.complete || img.addEventListener("load", refreshSoon, { once: true }));
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
