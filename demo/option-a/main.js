/* ABI Tower — Homepage · OPTION A (client feedback rounds 30/10, 3/11, 6/11).
   Shared chrome (header, dock, toast, pattern, leasing form, stacking builder) lives in common.js. */
(() => {
  const mm = gsap.matchMedia();
  const $ = id => document.getElementById(id);
  const el = ABI.svgEl, pts = ABI.pts;

  // intro side ornaments: a small patch of the brand pattern
  document.querySelectorAll(".intro-deco").forEach((svg, i) => {
    const fills = ABI.buildPattern(svg, 220, 300, i * 40);
    fills.forEach((f, k) => f.setAttribute("class", k % 2 ? "pt-s" : "pt-f"));
    gsap.from(svg.querySelectorAll("polygon"), { opacity: 0, duration: .6, stagger: { each: .01, from: "random" }, scrollTrigger: { trigger: ".intro", start: "top 75%" } });
  });

  /* ------------------------------------------------------------------
     HERO — 2-frame motion, plays once on load (ref: IFC/OSI hero video, title-card + tech orb refs)
     Frame 1: navy + brand pattern, crosshair, orb; the two text lines resolve in.
     Frame 2: the tower rises with the LED scan.
     Scrolling back up into the hero rewinds to frame 1; scrolling down plays frame 2 again.
  ------------------------------------------------------------------ */
  const chars = [];
  document.querySelectorAll(".hero-title [data-chars]").forEach(line => {
    const words = line.textContent.trim().normalize("NFC").split(/\s+/);
    line.innerHTML = words.map(w => `<span class="wd">${Array.from(w).map(c => `<span class="ch">${c}</span>`).join("")}</span>`).join(" ");
    chars.push(...line.querySelectorAll(".ch"));
  });
  // one gradient sweep across the 2nd line, painted per character
  function paintGrad() {
    const cs = [...document.querySelectorAll(".hero-title .grad .ch")];
    if (!cs.length) return;
    const rs = cs.map(c => c.getBoundingClientRect());
    const x0 = Math.min(...rs.map(r => r.left)), x1 = Math.max(...rs.map(r => r.right));
    cs.forEach((c, i) => { c.style.backgroundSize = `${x1 - x0}px 100%`; c.style.backgroundPosition = `${x0 - rs[i].left}px 0`; });
  }
  paintGrad();
  document.fonts && document.fonts.ready.then(paintGrad);
  window.addEventListener("resize", paintGrad);

  const frameBtns = [...document.querySelectorAll(".hero-frames button")];
  const bars = frameBtns.map(b => b.querySelector("s"));
  const setFrame = i => frameBtns.forEach((b, k) => { b.classList.toggle("is-on", k === i); b.setAttribute("aria-selected", k === i); });
  // quick intro (client: the building should be up at ~1.5s, no scrolling needed)
  const F1 = 1.3;          // frame 2 starts here
  const HOLD = .9;         // frame 1 fully shown (rewind target)
  const END = 2.2;

  // crosshair draws once
  gsap.fromTo(".cx-h", { scaleX: 0 }, { scaleX: 1, duration: .8, ease: "expo.inOut" });
  gsap.fromTo(".cx-v", { scaleY: 0 }, { scaleY: 1, duration: .8, ease: "expo.inOut", delay: .06 });

  const heroTl = gsap.timeline({ paused: true, onUpdate: () => setFrame(heroTl.time() >= F1 - .15 ? 1 : 0) });
  heroTl
    .set(bars, { scaleX: 0 }, 0)
    .set(".hero-f2", { autoAlpha: 0 }, 0)
    .fromTo(".hero-orb", { scale: .55, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: "expo.out" }, 0)
    .fromTo(".cx-c", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .3, ease: "back.out(2)" }, .1)
    .fromTo(chars, { opacity: 0, filter: "blur(12px)", yPercent: 45 },
      { opacity: 1, filter: "blur(0px)", yPercent: 0, duration: .45, ease: "power3.out", stagger: .008 }, .1)
    .to(bars[0], { scaleX: 1, duration: F1, ease: "none" }, 0)
    // frame 1 → 2
    .to(chars, { opacity: 0, filter: "blur(10px)", yPercent: -35, duration: .35, ease: "power2.in", stagger: .004 }, 1)
    .to(".hero-orb", { scale: 1.9, opacity: 0, duration: .5, ease: "power2.in" }, 1)
    .to(".cx-c", { scale: 0, opacity: 0, duration: .25 }, 1.05)
    .set(".hero-f2", { autoAlpha: 1 }, F1 - .15)
    .fromTo(".hero-tower", { yPercent: 26, opacity: 0, filter: "brightness(2.2) blur(8px)" },
      { yPercent: 0, opacity: 1, filter: "brightness(1) blur(0px)", duration: .9, ease: "expo.out" }, F1 - .15)
    .fromTo(".hero-halo", { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .9, ease: "expo.out" }, F1 - .15)
    .to(bars[1], { scaleX: 1, duration: END - F1, ease: "none" }, F1);

  // forward = towards the tower, back = rewind to the title frame
  let heroDir = 1, rewind = null;
  function heroTo(dir) {
    if (dir === heroDir) return;
    heroDir = dir;
    rewind && rewind.kill();
    if (dir > 0) heroTl.play();
    else {
      const t = heroTl.time();
      heroTl.pause();
      rewind = heroTl.tweenTo(HOLD, { duration: t > HOLD ? Math.max(.4, (t - HOLD) * .55) : HOLD - t, ease: t > HOLD ? "power1.inOut" : "none" });
    }
  }
  gsap.delayedCall(.05, () => heroTl.play());
  frameBtns.forEach((b, i) => b.addEventListener("click", () => heroTo(i ? 1 : -1)));
  ScrollTrigger.create({
    trigger: ".hero", start: "top top", end: "bottom top",
    onUpdate: s => s.direction && heroTo(s.direction)
  });
  if (ABI.reduceMotion) heroTl.progress(1);

  /* ------------------------------------------------------------------
     INTRO — word-by-word reading scrub; overview cards open on hover (+ highlights)
  ------------------------------------------------------------------ */
  const words = ABI.splitWords(document.querySelector(".intro-text"));
  gsap.to(words, {
    opacity: 1, stagger: .05, ease: "none",
    scrollTrigger: { trigger: ".intro-text", start: "top 80%", end: "bottom 50%", scrub: true }
  });
  const cards = gsap.utils.toArray(".ov-card");
  cards.forEach(c => {
    const open = () => cards.forEach(o => o.classList.toggle("is-open", o === c));
    c.addEventListener("mouseenter", open);
    c.addEventListener("click", open);
    c.addEventListener("focus", open);
  });
  gsap.from(cards, {
    clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.out", stagger: .12,
    scrollTrigger: { trigger: ".overview", start: "top 85%" }
  });

  /* ------------------------------------------------------------------
     LOCATION — new connectivity map + 5 category filters
  ------------------------------------------------------------------ */
  const stage = $("mapStage"), viewport = $("mapViewport"), tip = $("mapTip");
  const card = document.querySelector(".map-card");
  stage.innerHTML = window.ABI_MAP2_SVG || "";
  const mapSvg = stage.querySelector("svg");
  const q = s => (mapSvg ? [...mapSvg.querySelectorAll(s)] : []);
  const pois = q(".m-poi");
  const poiByName = {};
  pois.forEach(p => (poiByName[p.dataset.name] = p));

  const CATS = [
    { name: "Hạ tầng giao thông", places: ["Ga Metro (tuyến số 2)", "Ga Metro (tuyến số 4)", "Ga Phú Diễn", "Ga Cầu Diễn", "Cầu Nhật Tân"] },
    { name: "Cơ quan hành chính", places: ["Đại sứ quán Hàn Quốc", "Đại sứ quán Nhật", "Đại sứ quán Úc", "Khu đô thị Ngoại Giao Đoàn", "Bộ Công An", "Ủy ban Nhân dân TP. Hà Nội"] },
    { name: "Khách sạn & Nhà hàng", places: ["Fraser Residence Hanoi", "InterContinental Hanoi Westlake", "Sheraton Hanoi", "Shilla Monogram", "Nhà hàng Đình Làng", "BBQ Chicken", "Crumbs Artelier", "Nhà hàng chay Mộc Nhiên", "Nhà hàng Bò Tơ Quán Mộc", "Quán nhậu Tự Do", "Nhà hàng Fu Rong Hua", "Nhà hàng Maison Sen Buffet"] },
    { name: "Mua sắm & Giải trí", places: ["Lotte Mall Tây Hồ", "Lotte Center Hà Nội", "Indochina Plaza Hanoi (IPH)", "MM Mega Market", "K-Mart", "Bảo tàng Thiên nhiên Việt Nam", "Bảo tàng Dân tộc học Việt Nam", "Bảo tàng Hồ Chí Minh", "Hồ Tây", "Hồ Hoàn Kiếm"] },
    { name: "Tiện ích lân cận", places: ["Trung tâm Samsung R&D", "Khu đô thị Ciputra", "Phòng khám Đa khoa Mirai", "Bệnh viện E", "Bệnh viện Mắt Ánh Sáng", "Trường Quốc tế Liên Hợp Quốc Hà Nội (UNIS)"] }
  ];
  const catBox = $("locCats");
  const catEls = CATS.map((c, i) => {
    const wrap = document.createElement("div");
    wrap.className = "cat";
    wrap.innerHTML = `<button type="button" class="cat-btn" aria-expanded="false"><b>${String(i + 1).padStart(2, "0")}</b><span>${c.name}</span><em>${c.places.length}</em></button><div class="cat-places"><ul></ul></div>`;
    const ul = wrap.querySelector("ul");
    c.places.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      const p = poiByName[name];
      if (p) {
        p._li = li;
        li.tabIndex = 0;
        li.setAttribute("role", "button");
        li.addEventListener("mouseenter", () => hot(p, true));
        li.addEventListener("mouseleave", () => hot(p, false));
        li.addEventListener("click", () => pick(p));
        li.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), pick(p)));
      }
      ul.appendChild(li);
    });
    wrap.querySelector(".cat-btn").addEventListener("click", () => openCat(i));
    catBox.appendChild(wrap);
    return wrap;
  });
  let openIdx = -1;
  function openCat(i) {
    openIdx = openIdx === i ? -1 : i;
    pick(null);
    catEls.forEach((w, k) => { w.classList.toggle("is-open", k === openIdx); w.querySelector(".cat-btn").setAttribute("aria-expanded", k === openIdx); });
    if (!mapSvg) return;
    mapSvg.classList.toggle("is-filter", openIdx > -1);
    const match = pois.filter(p => +p.dataset.cat === openIdx + 1);
    pois.forEach(p => p.classList.toggle("is-match", match.includes(p)));
    if (openIdx > -1) {
      resetView();
      gsap.fromTo(match.map(p => p.querySelector(".m-dot")).filter(Boolean), { scale: .4 }, { scale: 1, transformOrigin: "50% 50%", duration: .6, ease: "back.out(2.4)", stagger: .04 });
    }
  }
  // tooltip sits above the POI's dot (map coords → screen via the SVG's CTM, so zoom/pan are included)
  function placeTip(p) {
    const m = mapSvg.getScreenCTM(), t = p.transform.baseVal.consolidate();
    if (!m || !t) return;
    const pt = mapSvg.createSVGPoint(); pt.x = t.matrix.e; pt.y = t.matrix.f;
    const sp = pt.matrixTransform(m), cr = card.getBoundingClientRect();
    const k = p.classList.contains("is-sel") ? 1.5 : 1.25;
    tip.textContent = p.dataset.name;
    tip.style.left = sp.x - cr.left + "px";
    tip.style.top = sp.y - cr.top - 15 * m.a * k - 4 + "px";
  }
  // client 6/11: a picked place must stand out clearly on the map → sticky selection (bigger red marker,
  // pulsing ring, raised above the others) that stays until another place / category is picked
  let sel = null;
  function pick(p) {
    if (sel === p) p = null;
    if (sel) { sel.classList.remove("is-sel"); sel._li && sel._li.classList.remove("is-sel"); }
    sel = p;
    mapSvg && mapSvg.classList.toggle("has-sel", !!p);
    if (p) {
      p.classList.add("is-sel");
      p._li && p._li.classList.add("is-sel");
      p.parentNode.appendChild(p);              // draw on top of its neighbours
    }
    hot(p, !!p);
  }
  function hot(p, on) {
    pois.forEach(o => { if (o !== p) { o.classList.remove("is-hot"); o._li && o._li.classList.remove("is-hot"); } });
    if (p) { p.classList.toggle("is-hot", on); p._li && p._li.classList.toggle("is-hot", on); }
    // leaving a hovered place falls back to the picked one
    const show = on ? p : sel;
    if (show) placeTip(show);
    tip.classList.toggle("is-on", !!show);
  }
  pois.forEach(p => {
    p.addEventListener("mouseenter", () => hot(p, true));
    p.addEventListener("mouseleave", () => hot(p, false));
    p.addEventListener("click", () => pick(p));
  });

  // draw-on sequence
  if (mapSvg) {
    const rings = q(".m-rings circle, .m-rings path"), roads = q(".m-road path");
    gsap.set([...rings, ...roads], { strokeDasharray: 1, strokeDashoffset: 1 });
    const mapTl = gsap.timeline({ scrollTrigger: { trigger: ".map-card", start: "top 75%" } });
    mapTl.from(q(".m-street"), { opacity: 0, duration: .8 })
      .to(rings, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: .12 }, .1)
      .to(roads, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: .06 }, .3)
      .from(q(".m-rlabels, .m-areas, .m-bridge, .m-metro"), { opacity: 0, duration: .6 }, 1.1)
      .from(q(".m-poi .m-dot"), { scale: 0, transformOrigin: "50% 50%", duration: .5, ease: "back.out(2)", stagger: .02 }, 1)
      .from(q(".m-poi .m-glyph, .m-poi .m-lbl"), { opacity: 0, duration: .5 }, 1.5)
      .from(q(".m-pin"), { y: -40, opacity: 0, duration: .9, ease: "bounce.out" }, 1.2);
  }

  // zoom & pan
  const view = { s: 1, x: 0, y: 0 };
  const META = window.ABI_MAP2_META || { w: 1877.43, h: 1106.01, pin: { x: 940, y: 540 } };
  const PIN = { x: META.pin.x / META.w, y: META.pin.y / META.h };
  function clampView() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    view.x = Math.min(0, Math.max(w - w * view.s, view.x));
    view.y = Math.min(0, Math.max(h - h * view.s, view.y));
  }
  function applyView(animate = true) {
    clampView();
    // force3D:false → the SVG is re-rasterised at the new scale (no blurry bitmap zoom)
    gsap.to(stage, { x: view.x, y: view.y, scale: view.s, duration: animate ? .7 : 0, ease: "power3.out", force3D: false, onUpdate: () => sel && placeTip(sel) });
  }
  function resetView() { view.s = 1; view.x = 0; view.y = 0; applyView(); }
  function zoomAt(s, fx, fy) {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    const px = (fx * w - view.x) / view.s, py = (fy * h - view.y) / view.s;
    view.s = Math.min(3.2, Math.max(1, s));
    view.x = fx * w - px * view.s; view.y = fy * h - py * view.s;
    applyView();
  }
  card.querySelectorAll("[data-zoom]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.zoom;
    if (k === "in") zoomAt(view.s * 1.4, .5, .5);
    if (k === "out") zoomAt(view.s / 1.4, .5, .5);
    if (k === "reset") {
      const w = viewport.clientWidth, h = viewport.clientHeight;
      view.s = 2.2; view.x = w / 2 - PIN.x * w * view.s; view.y = h / 2 - PIN.y * h * view.s; applyView();
    }
  }));
  let drag = null;
  viewport.addEventListener("pointerdown", e => {
    if (view.s <= 1) return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    viewport.classList.add("is-drag"); viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", e => {
    if (!drag) return;
    view.x = drag.vx + e.clientX - drag.x; view.y = drag.vy + e.clientY - drag.y; applyView(false);
  });
  const endDrag = () => { drag = null; viewport.classList.remove("is-drag"); };
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  /* ------------------------------------------------------------------
     DESIGN INSPIRATION — the three images appear one after another
  ------------------------------------------------------------------ */
  const cgs = gsap.utils.toArray(".cg");
  const csTl = gsap.timeline({ scrollTrigger: { trigger: ".cloudsec", start: "top 70%", end: "top 5%", scrub: 1 } });
  cgs.forEach((f, i) => {
    csTl.fromTo(f, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "power2.inOut" }, i * .55)
      .fromTo(f.querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "none" }, i * .55);
  });
  gsap.from(".cs-copy > *", { y: 34, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".cs-copy", start: "top 90%" } });
  // faint clouds drifting behind (client 6/11: "đám mây chìm"); CSS drifts them sideways, scroll adds depth
  gsap.utils.toArray(".cs-cloud").forEach((c, i) => gsap.fromTo(c, { yPercent: 18 + i * 6 }, {
    yPercent: -18 - i * 6, ease: "none", scrollTrigger: { trigger: ".cloudsec", start: "top bottom", end: "bottom top", scrub: true }
  }));

  /* ------------------------------------------------------------------
     GRADE A — glowing rings ("viền") wrap the tower, callouts light up
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
  const calls = gsap.utils.toArray(".call");
  const leaders = document.querySelector(".leaders");
  const leadPaths = calls.map(() => el("path", { pathLength: 1 }, leaders));
  const leadDots = calls.map(() => el("circle", { r: 3.5 }, leaders));
  const leadSide = ["R", "L", "R"];
  function layoutLeaders() {
    const sb = document.querySelector(".ga-stage").getBoundingClientRect();
    leaders.setAttribute("viewBox", `0 0 ${sb.width} ${sb.height}`);
    const m = front.getScreenCTM();
    if (!m) return;
    // measure against the resting layout: the tower and callouts may still carry their entrance offset (y)
    const towerY = gsap.getProperty(".ga-tower", "y") || 0;
    calls.forEach((c, i) => {
      const a = leadSide[i] === "R" ? ringParts[i].anchorR : ringParts[i].anchorL;
      const pt = front.createSVGPoint(); pt.x = a[0]; pt.y = a[1] + GAP / 2;
      const sp = pt.matrixTransform(m);
      const ax = sp.x - sb.left, ay = sp.y - sb.top - towerY;
      const cb = c.getBoundingClientRect();
      const cx = leadSide[i] === "R" ? cb.left - sb.left : cb.right - sb.left;
      const cy = cb.top - sb.top - (gsap.getProperty(c, "y") || 0) + 34;
      const mx = leadSide[i] === "R" ? cx - 30 : cx + 30;
      leadPaths[i].setAttribute("d", `M${ax},${ay} L${mx},${cy} L${cx},${cy}`);
      leadDots[i].setAttribute("cx", ax); leadDots[i].setAttribute("cy", ay);
    });
  }
  ringParts.forEach((r, i) => gsap.to(r.glow, { strokeDashoffset: -0.92, duration: 2.6, ease: "none", repeat: -1, delay: i * .5 }));

  const GA_FULL = "(min-width: 1101px), (min-width: 721px) and (orientation: landscape)";
  mm.add(GA_FULL, () => {
    layoutLeaders();
    leadPaths.forEach(p => gsap.set(p, { strokeDasharray: "1 1", strokeDashoffset: 1 }));
    gsap.set(leadDots, { scale: 0, transformOrigin: "center" });
    gsap.set(calls, { opacity: 0, y: 30 });
    const tl = gsap.timeline({
      // client 6/11: shorter pin so the three callouts are reached with less scrolling
      scrollTrigger: { trigger: ".gradea", start: "top top", end: "+=110%", scrub: .6, pin: ".ga-pin", anticipatePin: 1, onRefresh: layoutLeaders }
    });
    tl.from(".ga-head > *", { y: 40, opacity: 0, stagger: .1, duration: .3 }, 0)
      .from(".ga-tower", { y: 120, duration: .8, ease: "power2.out" }, 0);
    ringParts.forEach((r, i) => {
      const t = .3 + i * .8;
      tl.to([r.b1, r.b2], { strokeDashoffset: 0, duration: .25, ease: "none" }, t)
        .to([r.f1, r.f2], { strokeDashoffset: 0, duration: .6, ease: "power1.inOut" }, t + .1)
        .to(r.fill, { attr: { opacity: 1 }, duration: .3 }, t + .5)
        .to(leadDots[i], { scale: 1, duration: .15 }, t + .55)
        .to(leadPaths[i], { strokeDashoffset: 0, duration: .3 }, t + .6)
        .to(calls[i], { opacity: 1, y: 0, duration: .35 }, t + .7)
        .set(r.glow, { opacity: 1 }, t + .7);
    });
    tl.to({}, { duration: .25 });
    window.addEventListener("resize", layoutLeaders);
    return () => window.removeEventListener("resize", layoutLeaders);
  });
  mm.add("(max-width: 720px), (max-width: 1100px) and (orientation: portrait)", () => {
    ringParts.forEach((r, i) => {
      const st = { trigger: ".ga-tower", start: "top 70%" };
      gsap.to([r.b1, r.b2, r.f1, r.f2], { strokeDashoffset: 0, duration: 1.2, delay: i * .3, scrollTrigger: st });
      gsap.to(r.fill, { attr: { opacity: 1 }, duration: .6, delay: .8 + i * .3, scrollTrigger: st });
      gsap.set(r.glow, { opacity: 1 });
    });
  });

  /* ------------------------------------------------------------------
     STACKING PLAN — isometric, clickable floors → NLA panel
     Client: typical office 10F–13F; ABI Tower office 14F–16F; rooftop above 16F.
     6/11: plans from the Vietnamese floor-plan brochure (B1 + B2 shown together), no "Tầng 14F-16F" heading.
  ------------------------------------------------------------------ */
  const SRC = ABI.stack;
  const G = id => SRC.groups.find(g => g.id === id);
  const HOME_GROUPS = [
    { ...G("f16"), id: "rf", floors: ["R"], tag: "Rooftop", title: "Tầng thượng" },
    { ...G("f15"), id: "f14-16", floors: ["16", "15", "14"], tag: "14F – 16F", desc: "Văn phòng ABI Tower" },
    { ...G("f10-14"), id: "f10-13", floors: ["13", "12", "11", "10"], tag: "10F – 13F", plans: ["v-10-13f.webp"], legend: ABI.LEG.office },
    { ...G("f6-9"), plans: ["v-6-9f.webp"], legend: ABI.LEG.office },
    { ...G("f3-5"), plans: ["v-3-5f.webp"], legend: ABI.LEG.office },
    { ...G("f2"), plans: ["v-2f.webp"], legend: ABI.LEG.office },
    { ...G("f1"), plans: ["v-1f.webp"], legend: ABI.LEG.lobby },
    { ...G("fb"), plans: ["v-b1.webp", "v-b2.webp"], planTags: ["Tầng B1", "Tầng B2"], legend: ABI.LEG.basement }
  ];
  const fpEls = [$("fpTag"), $("fpNla"), $("fpDesc"), $("fpMedia"), $("fpLegend")];
  ABI.mountStacking($("iso"), {
    groups: HOME_GROUPS,
    initial: "f10-13",
    onSelect: g => {
      gsap.fromTo(fpEls, { y: 12, opacity: 0 }, { y: 0, opacity: 1, stagger: .04, duration: .5, ease: "power2.out" });
      $("fpTag").textContent = g.tag;
      $("fpNla").textContent = g.nla ? "Diện tích cho thuê: " + g.nla : "";
      $("fpDesc").textContent = g.desc || "";
      const media = $("fpMedia");
      media.classList.toggle("is-photo", !g.plans);
      media.classList.toggle("is-pair", !!(g.plans && g.plans.length > 1));
      media.innerHTML = g.plans
        ? g.plans.map((p, i) => `<div class="fp-plan">${g.planTags ? `<span>${g.planTags[i]}</span>` : ""}<img src="../assets/plans/${p}" alt="Mặt bằng ${g.planTags ? g.planTags[i] : g.tag}"></div>`).join("")
        : `<img src="../assets/img/${g.img}" alt="${g.title || g.tag}">`;
      $("fpLegend").innerHTML = ABI.legendHTML(g.legend);
    }
  });
  ABI.mountStats($("stackStats"), SRC.summary);

  /* ------------------------------------------------------------------
     AMENITIES — hover list swaps the image with a wipe
  ------------------------------------------------------------------ */
  const items = gsap.utils.toArray(".amen-list li");
  const imgs = gsap.utils.toArray(".amen-view img");
  let ai = 0, z = 1;
  function showAmen(i) {
    if (i === ai) return;
    items.forEach((li, k) => li.classList.toggle("is-on", k === i));
    const img = imgs[i];
    img.style.zIndex = ++z;
    gsap.fromTo(img, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .9, ease: "expo.inOut" });
    gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: "expo.out" });
    ai = i;
  }
  items.forEach((li, i) => {
    li.addEventListener("mouseenter", () => showAmen(i));
    li.addEventListener("click", () => showAmen(i));
    li.addEventListener("focus", () => showAmen(i));
  });
  gsap.from(items, { x: -40, opacity: 0, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".amen-list", start: "top 85%" } });
  gsap.from(".amen-view", { clipPath: "inset(0% 100% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".amen-view", start: "top 85%" } });

  /* ------------------------------------------------------------------
     AWARDS + NEWS
  ------------------------------------------------------------------ */
  gsap.from(".aw-item", { y: 40, opacity: 0, stagger: .12, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".aw-list", start: "top 88%" } });
  gsap.from(".aw-logo img", { scale: .6, rotate: -12, opacity: 0, stagger: .12, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: ".aw-list", start: "top 88%" } });
  gsap.from(".aw-media", { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: ".aw-media", start: "top 85%" } });
  gsap.fromTo(".aw-media .slides-in", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".awards", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".news-card", { y: 50, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".news-grid", start: "top 88%" } });

  // generic reveal for section headings
  gsap.utils.toArray(".loc-copy > *, .stack-head > *, .amen-head > *, .aw-copy > .eyebrow, .aw-copy > .h2, .aw-copy > .body, .news-head > *").forEach(n => gsap.from(n, {
    y: 30, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 90%" }
  }));
  ABI.lateReveals();

  window.addEventListener("load", () => { ScrollTrigger.refresh(); paintGrad(); });
})();
