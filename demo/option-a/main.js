/* ABI Tower — Homepage demo · OPTION A "Cloud / Aurora" */
(() => {
  ABI.initSmooth();
  const mm = gsap.matchMedia();
  const isMobile = () => window.innerWidth <= 720;

  /* ------------------------------------------------------------------
     HEADER — white logo over hero, glass pill after
  ------------------------------------------------------------------ */
  const hdr = document.getElementById("hdr");
  document.querySelector(".hdr-burger").addEventListener("click", e => {
    const open = hdr.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  hdr.querySelectorAll(".hdr-nav a").forEach(a => a.addEventListener("click", () => hdr.classList.remove("nav-open")));

  /* ------------------------------------------------------------------
     HERO — title rises, tower lifts out of the aurora on scroll
  ------------------------------------------------------------------ */
  gsap.from(".hero-title .line > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: .12, delay: .15 });
  gsap.from(".hero .eyebrow", { opacity: 0, y: 14, duration: 1, delay: .5 });
  gsap.from(".hero-tower", { y: 80, opacity: 0, duration: 1.6, ease: "expo.out", delay: .3 });

  // tower stays grounded; the cloud-computing network spreads out and fades as you scroll
  const net = ABI.heroNet();
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero", start: "top top", end: "+=100%", scrub: 1, pin: true, anticipatePin: 1,
      onUpdate: st => { if (net) { net.spread = st.progress * .9; net.fade = 1 - st.progress * .85; } }
    }
  });
  heroTl
    .to(".hero-tower", { y: () => -window.innerHeight * .1, scale: 1.04, ease: "none" }, 0)
    .to(".hero-copy", { y: -120, opacity: 0, ease: "none" }, 0)
    .to(".hero-grid", { yPercent: -8, ease: "none" }, 0)
    .to(".hero-scroll", { opacity: 0, duration: .1 }, 0);

  ScrollTrigger.create({
    trigger: ".intro", start: "top 80px",
    onEnter: () => hdr.classList.add("is-solid"),
    onLeaveBack: () => hdr.classList.remove("is-solid")
  });

  /* ------------------------------------------------------------------
     INTRO — word-by-word reading scrub
  ------------------------------------------------------------------ */
  const words = ABI.splitWords(document.querySelector(".intro-text"));
  gsap.to(words, {
    opacity: 1, stagger: .05, ease: "none",
    scrollTrigger: { trigger: ".intro-text", start: "top 78%", end: "bottom 45%", scrub: true }
  });

  /* ------------------------------------------------------------------
     OVERVIEW — expanding image cards
  ------------------------------------------------------------------ */
  const cards = gsap.utils.toArray(".ov-card");
  cards.forEach(c => {
    const open = () => cards.forEach(o => o.classList.toggle("is-open", o === c));
    c.addEventListener("mouseenter", open);
    c.addEventListener("click", open);
  });
  gsap.from(cards, {
    clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.out", stagger: .12,
    scrollTrigger: { trigger: ".overview", start: "top 82%" }
  });

  /* ------------------------------------------------------------------
     LOCATION — connectivity map (draw-on + hover + zoom/pan)
  ------------------------------------------------------------------ */
  const mapSvg = ABI.mountMap(document.getElementById("mapStage"));
  const stage = document.getElementById("mapStage");
  const viewport = document.getElementById("mapViewport");
  const tip = document.getElementById("mapTip");
  const card = document.querySelector(".map-card");
  const pois = [...mapSvg.querySelectorAll(".m-poi")];
  const list = document.getElementById("poiList");

  pois.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b>${p.dataset.name}`;
    li.addEventListener("mouseenter", () => hot(p, true));
    li.addEventListener("mouseleave", () => hot(p, false));
    list.appendChild(li);
    p.addEventListener("mouseenter", () => hot(p, true));
    p.addEventListener("mouseleave", () => hot(p, false));
    p.addEventListener("click", () => hot(p, !p.classList.contains("is-hot")));
    p._li = li;
  });
  function hot(p, on) {
    pois.forEach(o => { if (o !== p) { o.classList.remove("is-hot"); o._li.classList.remove("is-hot"); } });
    p.classList.toggle("is-hot", on);
    p._li.classList.toggle("is-hot", on);
    if (on) {
      const r = p.querySelector(".m-hit").getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      tip.textContent = p.dataset.name;
      tip.style.left = r.left - cr.left + r.width / 2 + "px";
      tip.style.top = r.top - cr.top + "px";
    }
    tip.classList.toggle("is-on", on);
  }

  // draw-on sequence
  const mapTl = gsap.timeline({ scrollTrigger: { trigger: ".map-card", start: "top 75%" } });
  mapTl
    .from(mapSvg.querySelectorAll(".m-street path"), { opacity: 0, duration: 1, stagger: .01 })
    .to(mapSvg.querySelectorAll(".m-ring path"), { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: .08 }, .2)
    .to(mapSvg.querySelector(".m-areas"), { opacity: 1, duration: .8 }, .8)
    .to(mapSvg.querySelector(".m-rlabels"), { opacity: 1, duration: .6 }, 1.4)
    .to(mapSvg.querySelector(".m-noibai"), { opacity: 1, duration: .6 }, 1.6)
    .to(mapSvg.querySelector(".m-icons"), { opacity: 1, duration: .8 }, 1.2)
    .from(mapSvg.querySelector(".m-pin"), { y: -40, opacity: 0, duration: .9, ease: "bounce.out" }, 1.3)
    .from(mapSvg.querySelector(".m-logo"), { opacity: 0, x: -20, duration: .8 }, 1.5);

  // zoom & pan
  const view = { s: 1, x: 0, y: 0 };
  const PIN = { x: 619.9 / 1877.43, y: 527 / 1106.01 };
  function clampView() {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    view.x = Math.min(0, Math.max(w - w * view.s, view.x));
    view.y = Math.min(0, Math.max(h - h * view.s, view.y));
  }
  function applyView(animate = true) {
    clampView();
    gsap.to(stage, { x: view.x, y: view.y, scale: view.s, duration: animate ? .7 : 0, ease: "power3.out" });
    mapSvg.classList.toggle("show-labels", view.s >= 1.9);
  }
  function zoomAt(s, fx, fy) {
    const w = viewport.clientWidth, h = viewport.clientHeight;
    const px = (fx * w - view.x) / view.s, py = (fy * h - view.y) / view.s; // content point under focus
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
     DESIGN INSPIRATION — cloud images appear one after another
  ------------------------------------------------------------------ */
  const frames = gsap.utils.toArray(".cs-frame");
  const dots = gsap.utils.toArray(".cs-dots i");
  gsap.set(frames.slice(1), { clipPath: "inset(100% 0% 0% 0% round 28px)" });
  gsap.set(frames[0], { clipPath: "inset(0% 0% 0% 0% round 28px)" });
  dots[0].classList.add("is-on");
  const setDot = i => dots.forEach((d, k) => d.classList.toggle("is-on", k === i));

  mm.add("(min-width: 721px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".cloudsec", start: "top top", end: "+=220%", scrub: 1, pin: ".cloudsec-pin", anticipatePin: 1,
        onUpdate: self => setDot(Math.min(2, Math.floor(self.progress * 3)))
      }
    });
    tl.from(".cs-copy > *", { y: 40, opacity: 0, stagger: .1, duration: .5 }, 0)
      .to(frames[0], { scale: .92, duration: 1 }, .4)
      .to(frames[1], { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "power2.inOut" }, .4)
      .fromTo(frames[1].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "none" }, .4)
      .to(frames[1], { scale: .92, duration: 1 }, 1.5)
      .to(frames[2], { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "power2.inOut" }, 1.5)
      .fromTo(frames[2].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "none" }, 1.5)
      .to(".cs-sky .n1", { xPercent: 25, duration: 2.6, ease: "none" }, 0)
      .to(".cs-sky .n2", { xPercent: -25, duration: 2.6, ease: "none" }, 0);
  });
  mm.add("(max-width: 720px)", () => {
    frames.forEach((f, i) => i && gsap.to(f, {
      clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none",
      scrollTrigger: { trigger: ".cloudsec", start: `top+=${i * 30}% top`, end: `+=40%`, scrub: true }
    }));
  });
  // idle cloud drift
  ABI.cloudNets();

  /* ------------------------------------------------------------------
     GRADE A — ribbons wrap around the tower (ref: The Spiral)
  ------------------------------------------------------------------ */
  const NS = "http://www.w3.org/2000/svg";
  const front = document.querySelector(".ribbons-front");
  const back = document.querySelector(".ribbons-back");
  const CORNER = 263, W = 737, T = 84;
  const BANDS = [440, 720, 990];
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };
  const pts = a => a.map(p => p.join(",")).join(" ");
  const defsF = el("defs", {}, front), defsB = el("defs", {}, back);
  const gL = el("linearGradient", { id: "rbL", x1: 0, x2: 1, y1: 0, y2: 0 }, defsF);
  el("stop", { offset: 0, "stop-color": "#7fd8f8" }, gL); el("stop", { offset: 1, "stop-color": "#00aeef" }, gL);
  const gR = el("linearGradient", { id: "rbR", x1: 0, x2: 1, y1: 0, y2: 0 }, defsF);
  el("stop", { offset: 0, "stop-color": "#00aeef" }, gR); el("stop", { offset: 1, "stop-color": "#21409a" }, gR);
  const gB = el("linearGradient", { id: "rbB", x1: 0, x2: 1, y1: 0, y2: 0 }, defsB);
  el("stop", { offset: 0, "stop-color": "#21409a" }, gB); el("stop", { offset: 1, "stop-color": "#232960" }, gB);

  const bandClips = BANDS.map((yC, i) => {
    const yL = yC - 50, yR = yC + 150;
    const cf = el("clipPath", { id: "cf" + i }, defsF);
    const rf = el("rect", { x: -90, y: 0, width: 0, height: 1465 }, cf);
    const cb = el("clipPath", { id: "cb" + i }, defsB);
    const rb = el("rect", { x: -90, y: 0, width: 0, height: 1465 }, cb);
    // back tails (left: emerging from behind, right: wrapping behind)
    const gb = el("g", { "clip-path": `url(#cb${i})` }, back);
    el("polygon", { class: "band-face", fill: "url(#rbB)", points: pts([[-58, yL + 40], [0, yL], [0, yL + T], [-58, yL + 40 + T]]) }, gb);
    el("polygon", { class: "band-face", fill: "url(#rbB)", points: pts([[W, yR], [W + 66, yR - 46], [W + 66, yR - 46 + T], [W, yR + T]]) }, gb);
    // front faces
    const gf = el("g", { "clip-path": `url(#cf${i})` }, front);
    el("polygon", { class: "band-face", fill: "url(#rbL)", points: pts([[0, yL], [CORNER, yC], [CORNER, yC + T], [0, yL + T]]) }, gf);
    el("polygon", { class: "band-face", fill: "url(#rbR)", points: pts([[CORNER, yC], [W, yR], [W, yR + T], [CORNER, yC + T]]) }, gf);
    el("polyline", { class: "band-edge", points: pts([[0, yL], [CORNER, yC], [W, yR]]) }, gf);
    el("polyline", { class: "band-edge", points: pts([[0, yL + T], [CORNER, yC + T], [W, yR + T]]) }, gf);
    return [rf, rb];
  });
  const usps = gsap.utils.toArray(".usp");

  mm.add("(min-width: 721px)", () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".gradea", start: "top top", end: "+=240%", scrub: 1, pin: ".ga-pin", anticipatePin: 1,
        onUpdate: self => {
          const k = Math.min(2, Math.floor(self.progress * 3.05));
          usps.forEach((u, i) => u.classList.toggle("is-on", self.progress > .04 && i <= k && i === k));
        }
      }
    });
    tl.from(".ga-head > *", { y: 40, opacity: 0, stagger: .1, duration: .4 }, 0)
      .from(".ga-tower", { y: 80, duration: 1, ease: "power2.out" }, 0);
    bandClips.forEach(([rf, rb], i) => {
      const at = .3 + i * 1;
      tl.to(rb, { attr: { width: 70 }, duration: .15, ease: "none" }, at)
        .to(rf, { attr: { width: 920 }, duration: .7, ease: "power1.inOut" }, at + .05)
        .to(rb, { attr: { width: 920 }, duration: .1, ease: "none" }, at + .65);
    });
    tl.to({}, { duration: .4 });
  });
  mm.add("(max-width: 720px)", () => {
    bandClips.forEach(([rf, rb], i) => {
      gsap.to([rf, rb], { attr: { width: 920 }, duration: 1.2, delay: i * .25, ease: "power2.inOut", scrollTrigger: { trigger: ".ga-tower", start: "top 70%" } });
    });
    usps.forEach(u => u.classList.add("is-on"));
  });

  /* ------------------------------------------------------------------
     STACKING PLAN — isometric, clickable floors → NLA panel
  ------------------------------------------------------------------ */
  const iso = document.getElementById("iso");
  const C = .866, S = .5, L = 240, D = 140, OX = 175, OY = 412, FH = 20;
  const P = (x, y, z) => [OX + (x - z) * C, OY + (x + z) * S - y];
  const floorsSpec = [];   // bottom → top
  floorsSpec.push({ key: "B2", y0: -40, y1: -20 }, { key: "B1", y0: -20, y1: 0 }, { key: "1", y0: 0, y1: 30 });
  for (let f = 2; f <= 16; f++) floorsSpec.push({ key: String(f), y0: 30 + (f - 2) * FH, y1: 30 + (f - 1) * FH });
  const roofY = 30 + 15 * FH;

  el("polygon", { class: "ground", points: pts([P(-30, 0, -30), P(L + 30, 0, -30), P(L + 30, 0, D + 30), P(-30, 0, D + 30)]) }, iso);
  const groupEls = {};
  const order = [];
  ABI.stack.groups.slice().reverse().forEach(g => {        // bottom → top
    const ge = el("g", { class: `grp t-${g.type}`, "data-g": g.id, tabindex: 0, role: "button", "aria-label": g.tag }, iso);
    groupEls[g.id] = ge; order.push(ge);
    floorsSpec.filter(f => g.floors.includes(f.key)).forEach(f => {
      const fe = el("g", { class: "fl" + (f.key.startsWith("B") ? " is-basement" : "") }, ge);
      const a = f.y0, b = f.y1;
      el("polygon", { class: "fz-l", points: pts([P(0, a, D), P(L, a, D), P(L, b, D), P(0, b, D)]) }, fe);
      el("polygon", { class: "fz-r", points: pts([P(L, a, 0), P(L, a, D), P(L, b, D), P(L, b, 0)]) }, fe);
      el("polygon", { class: "fz-t", points: pts([P(0, b, 0), P(L, b, 0), P(L, b, D), P(0, b, D)]) }, fe);
    });
  });
  // rooftop "tum" block
  const tum = el("g", { class: "fl tum" }, iso);
  const ti = 60, tz = 36, th = 16;
  el("polygon", { class: "fz-l", points: pts([P(ti, roofY, D - tz), P(L - ti, roofY, D - tz), P(L - ti, roofY + th, D - tz), P(ti, roofY + th, D - tz)]) }, tum);
  el("polygon", { class: "fz-r", points: pts([P(L - ti, roofY, tz), P(L - ti, roofY, D - tz), P(L - ti, roofY + th, D - tz), P(L - ti, roofY + th, tz)]) }, tum);
  el("polygon", { class: "fz-t", points: pts([P(ti, roofY + th, tz), P(L - ti, roofY + th, tz), P(L - ti, roofY + th, D - tz), P(ti, roofY + th, D - tz)]) }, tum);
  tum.querySelectorAll("polygon").forEach(p => { p.style.stroke = "#232960"; p.style.strokeWidth = 1; });

  // labels with leader lines
  const lblEls = {}, lblGroups = {};
  ABI.stack.groups.forEach(g => {
    const fs = floorsSpec.filter(f => g.floors.includes(f.key));
    const ymid = (Math.min(...fs.map(f => f.y0)) + Math.max(...fs.map(f => f.y1))) / 2;
    const [x, y] = P(L, ymid, 0);
    const lg = el("g", { class: "lblg" }, iso);
    el("line", { class: "lead", x1: x + 8, y1: y, x2: 470, y2: y }, lg);
    const t = el("text", { class: "lbl", x: 478, y: y + 4 }, lg);
    t.textContent = g.tag;
    lblEls[g.id] = t; lblGroups[g.id] = lg;
  });

  // panel
  const chips = document.getElementById("fpChips");
  const $ = id => document.getElementById(id);
  ABI.stack.groups.forEach(g => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "tab"; b.textContent = g.tag; b.dataset.g = g.id;
    b.addEventListener("click", () => select(g.id));
    chips.appendChild(b);
  });
  let active = null;
  function select(id) {
    const g = ABI.stack.groups.find(x => x.id === id);
    if (active) {
      groupEls[active].classList.remove("is-active");
      lblEls[active].classList.remove("is-active");
    }
    active = id;
    const ge = groupEls[id];
    ge.classList.add("is-active");
    lblEls[id].classList.add("is-active");
    // explode: everything above the chosen floors lifts so its top slab is revealed
    const idx = order.indexOf(ge);
    order.forEach((o, i) => gsap.to([o, lblGroups[o.dataset.g]], { y: i > idx ? -34 : 0, duration: .7, ease: "power3.inOut" }));
    gsap.to(tum, { y: -34, duration: .7, ease: "power3.inOut" });
    chips.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b.dataset.g === id));

    const panel = [$("fpTag"), $("fpTitle"), $("fpNla"), $("fpDesc"), $("fpMedia")];
    gsap.fromTo(panel, { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .5, ease: "power2.out" });
    $("fpTag").textContent = g.tag;
    $("fpTitle").textContent = g.title;
    $("fpNla").textContent = g.nla ? "Diện tích cho thuê: " + g.nla : "";
    $("fpDesc").textContent = g.desc || "";
    const media = $("fpMedia");
    media.classList.toggle("is-photo", !g.plan);
    media.innerHTML = g.plan
      ? `<img src="../assets/plans/${g.plan}" alt="Mặt bằng ${g.tag}">`
      : `<img src="../assets/img/${g.img}" alt="${g.title}">`;
  }
  Object.entries(groupEls).forEach(([id, ge]) => {
    ge.addEventListener("mouseenter", () => ge.classList.add("is-hover"));
    ge.addEventListener("mouseleave", () => ge.classList.remove("is-hover"));
    ge.addEventListener("click", () => select(id));
    ge.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select(id)));
  });
  select("f10-14");

  gsap.from(iso.querySelectorAll(".grp .fl, .tum"), {
    opacity: 0, duration: .5, ease: "power2.out", stagger: { each: .05, from: "start" },
    scrollTrigger: { trigger: ".stack", start: "top 70%" }
  });

  // stats count-up
  const stats = $("stackStats");
  ABI.stack.summary.forEach(s => {
    const d = document.createElement("div");
    d.innerHTML = `<dt>${s.k}</dt><dd><span>${s.v}</span>${s.unit ? `<small>${s.unit}</small>` : ""}</dd>`;
    stats.appendChild(d);
    const span = d.querySelector("span");
    const target = parseFloat(String(s.v).replace(/\./g, "").replace(",", "."));
    const dec = String(s.v).includes(",") ? 1 : 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: "power2.out",
      scrollTrigger: { trigger: stats, start: "top 85%" },
      onUpdate: () => { span.textContent = obj.v.toLocaleString("vi-VN", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    });
  });

  /* ------------------------------------------------------------------
     AMENITIES — draggable track
  ------------------------------------------------------------------ */
  const track = document.getElementById("amenTrack");
  const bar = document.getElementById("amenBar");
  let tx = 0, tDrag = null;
  const maxX = () => Math.min(0, -(track.scrollWidth - track.clientWidth));
  const setTx = (v, animate) => {
    tx = Math.max(maxX(), Math.min(0, v));
    gsap.to(track, { x: tx, duration: animate ? .9 : .25, ease: "power3.out" });
    const m = maxX();
    gsap.to(bar, { width: (m ? 25 + 75 * (tx / m) : 100) + "%", duration: .4 });
  };
  track.addEventListener("pointerdown", e => { tDrag = { x: e.clientX, t: tx, moved: 0 }; track.classList.add("is-drag"); track.setPointerCapture(e.pointerId); });
  track.addEventListener("pointermove", e => { if (!tDrag) return; tDrag.moved = e.clientX - tDrag.x; setTx(tDrag.t + tDrag.moved * 1.2); });
  const tEnd = () => { tDrag = null; track.classList.remove("is-drag"); };
  track.addEventListener("pointerup", tEnd); track.addEventListener("pointercancel", tEnd);
  document.querySelectorAll(".amen-nav button").forEach(b => b.addEventListener("click", () => {
    const step = track.querySelector(".amen-card").offsetWidth + 18;
    setTx(tx - step * +b.dataset.dir, true);
  }));
  gsap.from(".amen-card", {
    y: 80, opacity: 0, duration: 1.1, ease: "expo.out", stagger: .1,
    scrollTrigger: { trigger: ".amen-track", start: "top 85%" }
  });

  /* ------------------------------------------------------------------
     LEED + LEASING
  ------------------------------------------------------------------ */
  gsap.to(".leed-bg", { yPercent: 10, ease: "none", scrollTrigger: { trigger: ".leed", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.from(".leed-badge", { rotate: -120, scale: .6, opacity: 0, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: ".leed-card", start: "top 75%" } });
  gsap.from(".leed-card", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".leed-card", start: "top 85%" } });
  gsap.from(".lease-card", { y: 80, scale: .96, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".lease", start: "top 80%" } });
  ABI.mountQR(document.getElementById("qr"), 148);

  // generic reveal for section headings
  gsap.utils.toArray(".loc-copy > *, .stack-head > *, .amen-head > *").forEach(n => gsap.from(n, {
    y: 36, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 88%" }
  }));

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
