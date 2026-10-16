/* ABI Tower — Homepage demo · OPTION B "Ambition" */
(() => {
  ABI.initSmooth();
  const mm = gsap.matchMedia();
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };
  const pts = a => a.map(p => p.join(",")).join(" ");

  /* ------------------------------------------------------------------
     HEADER
  ------------------------------------------------------------------ */
  const hdr = document.getElementById("hdr");
  document.querySelector(".hdr-burger").addEventListener("click", e => {
    const open = hdr.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  hdr.querySelectorAll(".hdr-nav a").forEach(a => a.addEventListener("click", () => hdr.classList.remove("nav-open")));

  /* ------------------------------------------------------------------
     BRAND LINE PATTERN — modules from the logo (bar + diagonal stroke)
  ------------------------------------------------------------------ */
  function buildPattern(svg) {
    const W = 135, H = 142, SHIFT = 27;
    const box = svg.getBoundingClientRect();
    const cols = Math.ceil(box.width / W) + 3, rows = Math.ceil(box.height / H) + 2;
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    const fills = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ox = c * W - r * SHIFT + (rows * SHIFT) % W - W, oy = r * H - 40;
        el("polygon", { class: "pt-l", points: pts([[ox + 86, oy - 7], [ox + 140, oy - 101], [ox + 166, oy - 54], [ox + 113, oy + 39]]) }, svg);
        const bar = [[ox, oy], [ox + 80, oy], [ox + 103, oy + 39], [ox + 23, oy + 39]];
        el("polygon", { class: "pt-l", points: pts(bar) }, svg);
        if ((r * 7 + c * 3) % 5 === 0 || (r + c) % 7 === 0) fills.push(el("polygon", { class: "pt-f", points: pts(bar) }, svg));
      }
    }
    return fills;
  }
  document.querySelectorAll(".pattern").forEach(svg => {
    const fills = buildPattern(svg);
    gsap.to(fills, {
      opacity: () => gsap.utils.random([.35, .6, .9]), stagger: { each: .02, from: "random" }, ease: "none",
      scrollTrigger: { trigger: svg.parentElement, start: "top 85%", end: "bottom 40%", scrub: true }
    });
  });

  /* ------------------------------------------------------------------
     HERO — kinetic title, logo mark draws itself, image folds into an "A" slant
  ------------------------------------------------------------------ */
  const markPaths = document.querySelectorAll(".hero-mark path");
  markPaths.forEach(p => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
  gsap.timeline({ delay: .2 })
    .from(".hero-media img", { scale: 1.3, duration: 2.4, ease: "expo.out" }, 0)
    .from(".hero-title .ln > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .1 }, .3)
    .from(".hero .tag, .hero-meta", { opacity: 0, y: 16, duration: .9 }, .8)
    .to(markPaths, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", stagger: .15 }, .5);

  mm.add("(min-width: 721px)", () => {
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "+=100%", scrub: 1, pin: true, anticipatePin: 1 } })
      .fromTo(".hero-media", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(34% 16%, 92% 16%, 80% 86%, 22% 86%)", ease: "none" }, 0)
      .to(".hero-media img", { scale: 1.02, ease: "none" }, 0)
      .to(".hero-shade", { opacity: .2, ease: "none" }, 0)
      .to(".hero-copy", { yPercent: -40, opacity: 0, ease: "none" }, 0)
      .to(".hero-mark", { x: -120, rotate: -8, opacity: .25, ease: "none" }, 0)
      .to(".hero-meta", { opacity: 0, duration: .2 }, 0);
  });
  ScrollTrigger.create({
    trigger: ".intro", start: "top 70px",
    onEnter: () => hdr.classList.add("is-solid"),
    onLeaveBack: () => hdr.classList.remove("is-solid")
  });

  /* ------------------------------------------------------------------
     INTRO — words rise line by line
  ------------------------------------------------------------------ */
  const iw = ABI.splitWords(document.querySelector(".intro-text"));
  gsap.from(iw, {
    yPercent: 105, opacity: 0, stagger: .025, ease: "none",
    scrollTrigger: { trigger: ".intro-text", start: "top 82%", end: "bottom 55%", scrub: .6 }
  });

  /* ------------------------------------------------------------------
     OVERVIEW — horizontal pinned track
  ------------------------------------------------------------------ */
  mm.add("(min-width: 721px)", () => {
    const track = document.querySelector(".ovw-track");
    const dist = () => track.scrollWidth - window.innerWidth;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".ovw", start: "top top", end: () => "+=" + dist(), scrub: 1, pin: ".ovw-pin", invalidateOnRefresh: true, anticipatePin: 1 }
    });
    tl.to(track, { x: () => -dist(), ease: "none" }, 0)
      .to(".ovw-bar i", { width: "100%", ease: "none" }, 0)
      .fromTo(".ovw-img img", { xPercent: -6 }, { xPercent: 6, ease: "none" }, 0);
  });
  gsap.from(".ovw-item", { y: 80, opacity: 0, stagger: .12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".ovw", start: "top 75%" } });

  /* ------------------------------------------------------------------
     LOCATION — pinned map story: draw ring roads → zoom to Starlake → pull back
  ------------------------------------------------------------------ */
  const stage = document.getElementById("locStage");
  const map = ABI.mountMap(stage);
  const PIN = { x: 619.9 / 1877.43, y: 527 / 1106.01 };
  const steps = gsap.utils.toArray(".loc-steps i");
  const setStep = k => steps.forEach((s, i) => s.classList.toggle("is-on", i <= k));
  setStep(0);
  const locMap = document.getElementById("locMap");
  gsap.set(stage, { xPercent: -50, yPercent: -50 });
  const focus = (s, fx, fy) => ({   // transform that puts the pin at (fx, fy) of the map frame
    scale: s,
    x: () => locMap.clientWidth * (fx - .5) - (PIN.x - .5) * stage.offsetWidth * s,
    y: () => locMap.clientHeight * (fy - .5) - (PIN.y - .5) * stage.offsetHeight * s
  });

  mm.add("(min-width: 721px)", () => {
    gsap.set(stage, { ...focus(1.15, .62, .55) });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".loc", start: "top top", end: "+=260%", scrub: 1, pin: ".loc-pin", anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => setStep(self.progress < .36 ? 0 : self.progress < .72 ? 1 : 2)
      }
    });
    tl.fromTo(".loc-card", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: .3 }, 0)
      .to(map.querySelectorAll(".m-ring path"), { strokeDashoffset: 0, duration: 1, stagger: .06 }, 0)
      .to(map.querySelector(".m-rlabels"), { opacity: 1, duration: .3 }, .6)
      .to(map.querySelector(".m-areas"), { opacity: 1, duration: .3 }, .5)
      .to(map.querySelector(".m-icons"), { opacity: 1, duration: .3 }, .8)
      .to(stage, { ...focus(2.3, .7, .52), duration: 1.2, ease: "power2.inOut" }, 1.2)
      .to(map.querySelectorAll(".m-poi .m-lbl"), { opacity: 1, duration: .5, stagger: .02 }, 1.8)
      .to(map.querySelectorAll(".m-poi .m-lbl"), { opacity: 0, duration: .3 }, 2.8)
      .to(stage, { ...focus(1.25, .64, .6), duration: 1.2, ease: "power2.inOut" }, 2.8)
      .to(map.querySelector(".m-noibai"), { opacity: 1, duration: .4 }, 3.4)
      .to({}, { duration: .3 });
  });
  mm.add("(max-width: 720px)", () => {
    gsap.set(stage, { ...focus(1, .5, .5) });
    gsap.set(map.querySelectorAll(".m-rlabels, .m-areas, .m-icons, .m-noibai"), { opacity: 1 });
    gsap.to(map.querySelectorAll(".m-ring path"), { strokeDashoffset: 0, duration: 1.4, stagger: .08, scrollTrigger: { trigger: ".loc-map", start: "top 70%" } });
  });

  /* ------------------------------------------------------------------
     DESIGN INSPIRATION — cloud line + images appear one after another
  ------------------------------------------------------------------ */
  const cline = document.querySelector(".cloud-line path");
  const cl = cline.getTotalLength();
  gsap.set(cline, { strokeDasharray: cl, strokeDashoffset: cl });
  gsap.to(cline, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".cloud", start: "top 70%", end: "bottom 60%", scrub: 1 } });
  gsap.utils.toArray(".cg").forEach((g, i) => {
    gsap.from(g, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 120, ease: "none",
      scrollTrigger: { trigger: ".cloud-gal", start: `top ${85 - i * 12}%`, end: `top ${45 - i * 12}%`, scrub: 1 }
    });
    gsap.fromTo(g.querySelector("img"), { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: g, start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.to(".cl1", { xPercent: 80, ease: "none", scrollTrigger: { trigger: ".cloud", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".cl2", { xPercent: -70, ease: "none", scrollTrigger: { trigger: ".cloud", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".cl3", { xPercent: 50, yPercent: -30, ease: "none", scrollTrigger: { trigger: ".cloud", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".cl4", { xPercent: 60, ease: "none", scrollTrigger: { trigger: ".cloud", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".cloud-copy > *", { y: 40, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".cloud-copy", start: "top 85%" } });

  /* ------------------------------------------------------------------
     GRADE A — outlined rings ("viền") wrap the tower, callouts light up
  ------------------------------------------------------------------ */
  const front = document.querySelector(".rings-front"), back = document.querySelector(".rings-back");
  const CORNER = 263, W = 737, GAP = 26;
  const RINGS = [430, 720, 990];
  const ringParts = RINGS.map(yC => {
    const yL = yC - 50, yR = yC + 150;
    const Lp = [-46, yL - 8], C = [CORNER, yC + 18], R = [W + 48, yR + 10];
    const B = [R[0] + Lp[0] - C[0], R[1] + Lp[1] - C[1]];
    const off = p => [p[0], p[1] + GAP];
    const g = el("g", {}, front), gb = el("g", {}, back);
    const fill = el("polygon", { class: "r-fill", points: pts([Lp, C, R, off(R), off(C), off(Lp)]), opacity: 0 }, g);
    const f1 = el("path", { class: "r-base", d: `M${pts([Lp, C, R])}`, pathLength: 1 }, g);
    const f2 = el("path", { class: "r-base", d: `M${pts([off(Lp), off(C), off(R)])}`, pathLength: 1 }, g);
    const glow = el("path", { class: "r-glow", d: `M${pts([Lp, C, R])}`, pathLength: 1 }, g);
    const b1 = el("path", { class: "r-base", d: `M${pts([R, B, Lp])}`, pathLength: 1 }, gb);
    const b2 = el("path", { class: "r-base", d: `M${pts([off(R), off(B), off(Lp)])}`, pathLength: 1 }, gb);
    [f1, f2, b1, b2].forEach(p => gsap.set(p, { strokeDasharray: "1 1", strokeDashoffset: 1 }));
    gsap.set(glow, { strokeDasharray: "0.08 0.92", strokeDashoffset: 0.08, opacity: 0 });
    return { fill, f1, f2, b1, b2, glow, anchorL: Lp, anchorR: R };
  });
  // fix dashed back rings after reveal
  const calls = gsap.utils.toArray(".call");
  const leaders = document.querySelector(".leaders");
  const leadPaths = calls.map(() => el("path", { pathLength: 1 }, leaders));
  const leadDots = calls.map(() => el("circle", { r: 3.5 }, leaders));
  const leadSide = ["R", "L", "R"];
  function layoutLeaders() {
    const sb = document.querySelector(".ga-stage").getBoundingClientRect();
    leaders.setAttribute("viewBox", `0 0 ${sb.width} ${sb.height}`);
    const m = front.getScreenCTM();
    calls.forEach((c, i) => {
      const a = leadSide[i] === "R" ? ringParts[i].anchorR : ringParts[i].anchorL;
      const pt = front.createSVGPoint(); pt.x = a[0]; pt.y = a[1] + GAP / 2;
      const sp = pt.matrixTransform(m);
      const ax = sp.x - sb.left, ay = sp.y - sb.top;
      const cb = c.getBoundingClientRect();
      const cx = leadSide[i] === "R" ? cb.left - sb.left : cb.right - sb.left;
      const cy = cb.top - sb.top + 34;
      const mx = leadSide[i] === "R" ? cx - 30 : cx + 30;
      leadPaths[i].setAttribute("d", `M${ax},${ay} L${mx},${cy} L${cx},${cy}`);
      leadDots[i].setAttribute("cx", ax); leadDots[i].setAttribute("cy", ay);
    });
  }

  mm.add("(min-width: 721px)", () => {
    layoutLeaders();
    leadPaths.forEach(p => gsap.set(p, { strokeDasharray: "1 1", strokeDashoffset: 1 }));
    gsap.set(leadDots, { scale: 0, transformOrigin: "center" });
    gsap.set(calls, { opacity: 0, y: 30 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".ga", start: "top top", end: "+=260%", scrub: 1, pin: ".ga-pin", anticipatePin: 1, onRefresh: layoutLeaders }
    });
    tl.from(".ga-head > *", { y: 40, opacity: 0, stagger: .1, duration: .4 }, 0)
      .from(".ga-tower", { y: 120, duration: 1, ease: "power2.out" }, 0);
    ringParts.forEach((r, i) => {
      const t = .5 + i * 1.1;
      tl.to([r.b1, r.b2], { strokeDashoffset: 0, duration: .25, ease: "none" }, t)
        .to([r.f1, r.f2], { strokeDashoffset: 0, duration: .6, ease: "power1.inOut" }, t + .1)
        .to(r.fill, { attr: { opacity: 1 }, duration: .3 }, t + .5)
        .to(leadDots[i], { scale: 1, duration: .15 }, t + .55)
        .to(leadPaths[i], { strokeDashoffset: 0, duration: .3 }, t + .6)
        .to(calls[i], { opacity: 1, y: 0, duration: .35 }, t + .7)
        .set(r.glow, { opacity: 1 }, t + .7);
    });
    tl.to({}, { duration: .4 });
    // light pulse running along each ring
    ringParts.forEach((r, i) => gsap.to(r.glow, { strokeDashoffset: -0.92, duration: 2.6, ease: "none", repeat: -1, delay: i * .5 }));
    window.addEventListener("resize", layoutLeaders);
    return () => window.removeEventListener("resize", layoutLeaders);
  });
  mm.add("(max-width: 720px)", () => {
    ringParts.forEach((r, i) => {
      const st = { trigger: ".ga-tower", start: "top 70%" };
      gsap.to([r.b1, r.b2, r.f1, r.f2], { strokeDashoffset: 0, duration: 1.2, delay: i * .3, scrollTrigger: st });
      gsap.to(r.fill, { attr: { opacity: 1 }, duration: .6, delay: .8 + i * .3, scrollTrigger: st });
    });
  });

  /* ------------------------------------------------------------------
     STACKING PLAN — 2D elevation; each floor is a drawer that slides out
  ------------------------------------------------------------------ */
  const elev = document.getElementById("elev");
  const width = k => k === "R" ? 34 : k.startsWith("B") ? 94 : k === "1" ? 84 : (k === "15" || k === "16") ? 62 : 70;
  const rows = {};
  const addRow = (key, label, g) => {
    const row = document.createElement("div");
    row.className = "ev-row k-" + (g ? g.type : "roof");
    row.setAttribute("role", "listitem");
    row.style.setProperty("--w", width(key) + "%");
    row.innerHTML = `<span class="ev-k">${label}</span><div class="ev-bar">${g ? `<span><b>${g.tag}</b><em>${g.nla || ""}</em></span>` : ""}</div>`;
    if (g) {
      row.tabIndex = 0;
      row.dataset.g = g.id;
      row.addEventListener("mouseenter", () => hotGroup(g.id, true));
      row.addEventListener("mouseleave", () => hotGroup(g.id, false));
      row.addEventListener("click", () => selectGroup(g.id));
      row.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), selectGroup(g.id)));
      (rows[g.id] = rows[g.id] || []).push(row);
    }
    elev.appendChild(row);
    return row;
  };
  addRow("R", "Tum", null);
  ABI.floorOrder.forEach(k => {
    if (k === "B1") { const gl = document.createElement("div"); gl.className = "ev-ground"; elev.appendChild(gl); }
    addRow(k, k.startsWith("B") ? k : k + "F", ABI.floorGroup[k]);
  });
  function hotGroup(id, on) { rows[id].forEach(r => r.classList.toggle("is-hot", on)); }
  const $ = id => document.getElementById(id);
  let cur = null;
  function selectGroup(id) {
    if (cur) rows[cur].forEach(r => r.classList.remove("is-on"));
    cur = id;
    rows[id].forEach(r => r.classList.add("is-on"));
    const g = ABI.stack.groups.find(x => x.id === id);
    $("spTag").textContent = g.tag;
    $("spNla").innerHTML = g.nla ? `<small>Diện tích cho thuê</small>${g.nla}` : "";
    $("spTitle").textContent = g.title;
    $("spDesc").textContent = g.desc || "";
    const media = $("spMedia");
    media.classList.toggle("is-photo", !g.plan);
    media.innerHTML = g.plan ? `<img src="../assets/plans/${g.plan}" alt="Mặt bằng ${g.tag}">` : `<img src="../assets/img/${g.img}" alt="${g.title}">`;
    gsap.fromTo(["#spTag", "#spNla", "#spTitle", "#spDesc", "#spMedia"], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .05, ease: "power2.out" });
  }
  selectGroup("f6-9");
  gsap.from(".ev-row, .ev-ground", {
    scaleX: 0, transformOrigin: "50% 50%", duration: .6, ease: "power3.out", stagger: { each: .035, from: "end" },
    scrollTrigger: { trigger: elev, start: "top 75%" }
  });
  const stats = $("stkStats");
  ABI.stack.summary.forEach(s => {
    const d = document.createElement("div");
    d.innerHTML = `<dt>${s.k}</dt><dd><span>${s.v}</span>${s.unit ? `<small>${s.unit}</small>` : ""}</dd>`;
    stats.appendChild(d);
    const span = d.querySelector("span");
    const target = parseFloat(String(s.v).replace(/\./g, "").replace(",", "."));
    const dec = String(s.v).includes(",") ? 1 : 0;
    const o = { v: 0 };
    gsap.to(o, {
      v: target, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: stats, start: "top 85%" },
      onUpdate: () => (span.textContent = o.v.toLocaleString("vi-VN", { minimumFractionDigits: dec, maximumFractionDigits: dec }))
    });
  });

  /* ------------------------------------------------------------------
     AMENITIES — hover list swaps the image with a slanted wipe
  ------------------------------------------------------------------ */
  const items = gsap.utils.toArray(".amn-list li");
  const imgs = gsap.utils.toArray(".amn-view img");
  let ai = 0, z = 1;
  function showAmen(i) {
    if (i === ai) return;
    items.forEach((li, k) => li.classList.toggle("is-on", k === i));
    const img = imgs[i];
    img.style.zIndex = ++z;
    gsap.fromTo(img, { clipPath: "polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)" },
      { clipPath: "polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)", duration: .9, ease: "expo.inOut" });
    gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: "expo.out" });
    ai = i;
  }
  items.forEach((li, i) => { li.addEventListener("mouseenter", () => showAmen(i)); li.addEventListener("click", () => showAmen(i)); });
  gsap.from(items, { x: -40, opacity: 0, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".amn-list", start: "top 80%" } });
  gsap.from(".amn-view", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".amn-view", start: "top 80%" } });

  /* ------------------------------------------------------------------
     LEED + LEASING
  ------------------------------------------------------------------ */
  gsap.to(".leed-media img", { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".leed", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".leed-ring", { rotate: 180, ease: "none", scrollTrigger: { trigger: ".leed", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".leed-badge img", { scale: .5, rotate: -90, opacity: 0, duration: 1.3, ease: "back.out(1.5)", scrollTrigger: { trigger: ".leed-badge", start: "top 80%" } });
  gsap.from(".leed-copy > *:not(.leed-badge)", { y: 40, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".leed-copy", start: "top 75%" } });
  gsap.fromTo(".lease-bg img", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".lease", start: "top bottom", end: "bottom bottom", scrub: true } });
  const lw = ABI.splitWords(document.querySelector(".lease-title"));
  gsap.from(lw, { yPercent: 110, stagger: .04, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".lease-title", start: "top 80%" } });
  gsap.from(".lease-row > *", { y: 30, opacity: 0, stagger: .12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".lease-row", start: "top 90%" } });
  ABI.mountQR(document.getElementById("qr"), 136, "#161b47");

  gsap.utils.toArray(".amn-head > *, .stk-top > div > *").forEach(n => gsap.from(n, {
    y: 36, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 88%" }
  }));

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
