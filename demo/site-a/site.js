/* ABI Tower — multi-page website (Option A look). One script for every page:
   each module runs only when its markup is present. Pinned sections are set up
   first (in page order) so every other ScrollTrigger measures the final layout. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };
  const pts = a => a.map(p => p.join(",")).join(" ");
  document.documentElement.classList.remove("no-js");

  const lenis = ABI.initSmooth();
  const mm = gsap.matchMedia();
  const desktop = "(min-width: 721px)", mobile = "(max-width: 720px)";

  /* ================================================================
     PAGE TRANSITION — brand gradient curtain between pages
  ================================================================ */
  const pt = $(".pt");
  if (pt) {
    gsap.to(pt, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut", delay: .05 });
    $$("a[href]").forEach(a => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || /^(tel:|mailto:|https?:)/.test(href) || a.target === "_blank") return;
      a.addEventListener("click", e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault();
        gsap.set(pt, { visibility: "visible", animation: "none" });
        gsap.fromTo(pt, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .65, ease: "expo.inOut", onComplete: () => (location.href = href) });
      });
    });
    window.addEventListener("pageshow", e => e.persisted && gsap.set(pt, { clipPath: "inset(0% 0% 100% 0%)" }));
  }

  /* ================================================================
     HEADER
  ================================================================ */
  const hdr = $("#hdr");
  $(".hdr-burger").addEventListener("click", e => {
    const open = hdr.classList.toggle("nav-open");
    e.currentTarget.setAttribute("aria-expanded", open);
  });
  $$(".hdr-nav a").forEach(a => a.addEventListener("click", () => hdr.classList.remove("nav-open")));

  /* ================================================================
     PINNED MODULES (page order)
  ================================================================ */

  // HOME HERO — tower lifts out of the aurora
  if ($(".hero")) {
    gsap.from(".hero-title .line > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: .12, delay: .35 });
    gsap.from(".hero .eyebrow", { opacity: 0, y: 14, duration: 1, delay: .7 });
    gsap.from(".hero-tower", { y: 80, opacity: 0, duration: 1.6, ease: "expo.out", delay: .45 });
    const net = ABI.heroNet();
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "+=100%", scrub: 1, pin: true, anticipatePin: 1,
      onUpdate: st => { if (net) { net.spread = st.progress * .9; net.fade = 1 - st.progress * .85; } } } })
      .to(".hero-tower", { y: () => -window.innerHeight * .1, scale: 1.04, ease: "none" }, 0)
      .to(".hero-copy", { y: -120, opacity: 0, ease: "none" }, 0)
      .to(".hero-grid", { yPercent: -8, ease: "none" }, 0)
      .to(".hero-scroll", { opacity: 0, duration: .1 }, 0);
  }

  // SUBPAGE HERO
  if ($(".phero")) {
    gsap.from(".phero h1 .line > span", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .1, delay: .4 });
    gsap.from(".phero .eyebrow, .phero-sub", { opacity: 0, y: 18, duration: 1, stagger: .1, delay: .7 });
    gsap.fromTo(".phero-media img", { scale: 1.15 }, { scale: 1, duration: 2.2, ease: "expo.out", delay: .1 });
    gsap.to(".phero-media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".phero", start: "top top", end: "bottom top", scrub: true } });
  }

  // DESIGN INSPIRATION — cloud images appear one after another (pinned)
  if ($(".cloudsec")) {
    const frames = $$(".cs-frame"), dots = $$(".cs-dots i");
    gsap.set(frames.slice(1), { clipPath: "inset(100% 0% 0% 0% round 28px)" });
    gsap.set(frames[0], { clipPath: "inset(0% 0% 0% 0% round 28px)" });
    dots[0] && dots[0].classList.add("is-on");
    const setDot = i => dots.forEach((d, k) => d.classList.toggle("is-on", k === i));
    mm.add(desktop, () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: ".cloudsec", start: "top top", end: "+=220%", scrub: 1, pin: ".cloudsec-pin", anticipatePin: 1,
          onUpdate: s => setDot(Math.min(2, Math.floor(s.progress * 3)))
        }
      })
        .from(".cs-copy > *", { y: 40, opacity: 0, stagger: .1, duration: .5 }, 0)
        .to(frames[0], { scale: .92, duration: 1 }, .4)
        .to(frames[1], { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "power2.inOut" }, .4)
        .fromTo(frames[1].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "none" }, .4)
        .to(frames[1], { scale: .92, duration: 1 }, 1.5)
        .to(frames[2], { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "power2.inOut" }, 1.5)
        .fromTo(frames[2].querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "none" }, 1.5)
        .to(".cs-sky .n1", { xPercent: 25, duration: 2.6, ease: "none" }, 0)
        .to(".cs-sky .n2", { xPercent: -25, duration: 2.6, ease: "none" }, 0);
    });
    mm.add(mobile, () => {
      frames.forEach((f, i) => i && gsap.to(f, {
        clipPath: "inset(0% 0% 0% 0% round 28px)", ease: "none",
        scrollTrigger: { trigger: ".cloudsec", start: `top+=${i * 30}% top`, end: "+=40%", scrub: true }
      }));
    });
  }

  // GRADE A — ribbons wrap around the tower (ref: The Spiral)
  if ($(".ribbons-front")) {
    const front = $(".ribbons-front"), back = $(".ribbons-back");
    const CORNER = 263, W = 737, T = 84, BANDS = [440, 720, 990];
    const defsF = el("defs", {}, front), defsB = el("defs", {}, back);
    const grad = (id, defs, a, b) => { const g = el("linearGradient", { id, x1: 0, x2: 1, y1: 0, y2: 0 }, defs); el("stop", { offset: 0, "stop-color": a }, g); el("stop", { offset: 1, "stop-color": b }, g); };
    grad("rbL", defsF, "#7fd8f8", "#00aeef"); grad("rbR", defsF, "#00aeef", "#21409a"); grad("rbB", defsB, "#21409a", "#232960");
    const clips = BANDS.map((yC, i) => {
      const yL = yC - 50, yR = yC + 150;
      const rf = el("rect", { x: -90, y: 0, width: 0, height: 1465 }, el("clipPath", { id: "cf" + i }, defsF));
      const rb = el("rect", { x: -90, y: 0, width: 0, height: 1465 }, el("clipPath", { id: "cb" + i }, defsB));
      const gb = el("g", { "clip-path": `url(#cb${i})` }, back);
      el("polygon", { class: "band-face", fill: "url(#rbB)", points: pts([[-58, yL + 40], [0, yL], [0, yL + T], [-58, yL + 40 + T]]) }, gb);
      el("polygon", { class: "band-face", fill: "url(#rbB)", points: pts([[W, yR], [W + 66, yR - 46], [W + 66, yR - 46 + T], [W, yR + T]]) }, gb);
      const gf = el("g", { "clip-path": `url(#cf${i})` }, front);
      el("polygon", { class: "band-face", fill: "url(#rbL)", points: pts([[0, yL], [CORNER, yC], [CORNER, yC + T], [0, yL + T]]) }, gf);
      el("polygon", { class: "band-face", fill: "url(#rbR)", points: pts([[CORNER, yC], [W, yR], [W, yR + T], [CORNER, yC + T]]) }, gf);
      el("polyline", { class: "band-edge", points: pts([[0, yL], [CORNER, yC], [W, yR]]) }, gf);
      el("polyline", { class: "band-edge", points: pts([[0, yL + T], [CORNER, yC + T], [W, yR + T]]) }, gf);
      return [rf, rb];
    });
    const usps = $$(".gradea .usp");
    mm.add(desktop, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".gradea", start: "top top", end: "+=240%", scrub: 1, pin: ".ga-pin", anticipatePin: 1,
          onUpdate: s => { const k = Math.min(2, Math.floor(s.progress * 3.05)); usps.forEach((u, i) => u.classList.toggle("is-on", s.progress > .04 && i === k)); }
        }
      });
      tl.from(".ga-head > *", { y: 40, opacity: 0, stagger: .1, duration: .4 }, 0).from(".ga-tower", { y: 80, duration: 1, ease: "power2.out" }, 0);
      clips.forEach(([rf, rb], i) => {
        const at = .3 + i;
        tl.to(rb, { attr: { width: 70 }, duration: .15, ease: "none" }, at)
          .to(rf, { attr: { width: 920 }, duration: .7, ease: "power1.inOut" }, at + .05)
          .to(rb, { attr: { width: 920 }, duration: .1, ease: "none" }, at + .65);
      });
      tl.to({}, { duration: .4 });
    });
    mm.add(mobile, () => {
      clips.forEach(([rf, rb], i) => gsap.to([rf, rb], { attr: { width: 920 }, duration: 1.2, delay: i * .25, ease: "power2.inOut", scrollTrigger: { trigger: ".ga-tower", start: "top 70%" } }));
      usps.forEach(u => u.classList.add("is-on"));
    });
  }

  // SMART SPECS — horizontal image run, text under each image
  if ($(".specs")) {
    const track = $(".specs-track"), items = $$(".spec"), cur = $(".specs-count b");
    mm.add(desktop, () => {
      const dist = () => track.scrollWidth - window.innerWidth;
      gsap.timeline({
        scrollTrigger: {
          trigger: ".specs", start: "top top", end: () => "+=" + dist() * 1.1, scrub: 1, pin: ".specs-pin", anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: s => { if (cur) cur.textContent = String(Math.min(items.length, 1 + Math.floor(s.progress * items.length))).padStart(2, "0"); }
        }
      })
        .to(track, { x: () => -dist(), ease: "none" }, 0)
        .to(".specs-bar i", { width: "100%", ease: "none" }, 0)
        .fromTo(".spec img", { xPercent: -5 }, { xPercent: 5, ease: "none" }, 0);
    });
    gsap.from(items, { y: 70, opacity: 0, stagger: .08, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".specs", start: "top 70%" } });
  }

  /* ================================================================
     NON-PINNED MODULES
  ================================================================ */

  // header becomes solid after the hero
  if ($(".hero")) ScrollTrigger.create({ trigger: ".intro", start: "top 80px", onEnter: () => hdr.classList.add("is-solid"), onLeaveBack: () => hdr.classList.remove("is-solid") });
  else hdr.classList.add("is-solid");   // subpage heroes are photos of varying brightness → keep the glass header for legibility

  // in-page section nav (scroll-spy)
  const sub = $$(".subnav a");
  sub.forEach(a => {
    const target = $(a.getAttribute("href"));
    if (!target) return;
    ScrollTrigger.create({
      trigger: target, start: "top 55%", end: "bottom 55%",
      onToggle: s => {
        if (!s.isActive) return;
        sub.forEach(x => x.classList.toggle("is-on", x === a));
        a.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }
    });
  });

  // INTRO word scrub
  if ($(".intro-text")) {
    const w = ABI.splitWords($(".intro-text"));
    gsap.to(w, { opacity: 1, stagger: .05, ease: "none", scrollTrigger: { trigger: ".intro-text", start: "top 78%", end: "bottom 45%", scrub: true } });
  }

  // OVERVIEW expanding cards (+ amenity panels share the behaviour)
  [[".ov-card", ".overview"], [".apanel", ".apanels"]].forEach(([sel, wrap]) => {
    const cards = $$(sel);
    if (!cards.length) return;
    cards.forEach(c => {
      const open = () => cards.forEach(o => o.classList.toggle("is-open", o === c));
      c.addEventListener("mouseenter", open); c.addEventListener("click", open);
    });
    gsap.from(cards, { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: wrap, start: "top 82%" } });
  });

  // CONNECTIVITY MAP — full (interactive) or teaser (draw-on only)
  const mapStage = $("#mapStage");
  if (mapStage) {
    const svg = ABI.mountMap(mapStage);
    const card = $(".map-card"), viewport = $("#mapViewport"), tip = $("#mapTip"), list = $("#poiList");
    const teaser = card.classList.contains("is-teaser");
    gsap.timeline({ scrollTrigger: { trigger: card, start: "top 75%" } })
      .from(svg.querySelectorAll(".m-street path"), { opacity: 0, duration: 1, stagger: .01 })
      .to(svg.querySelectorAll(".m-ring path"), { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: .08 }, .2)
      .to(svg.querySelector(".m-areas"), { opacity: 1, duration: .8 }, .8)
      .to(svg.querySelector(".m-rlabels"), { opacity: 1, duration: .6 }, 1.4)
      .to(svg.querySelector(".m-noibai"), { opacity: 1, duration: .6 }, 1.6)
      .to(svg.querySelector(".m-icons"), { opacity: 1, duration: .8 }, 1.2)
      .from(svg.querySelector(".m-pin"), { y: -40, opacity: 0, duration: .9, ease: "bounce.out" }, 1.3)
      .from(svg.querySelector(".m-logo"), { opacity: 0, x: -20, duration: .8 }, 1.5);

    if (!teaser) {
      const pois = $$(".m-poi", svg);
      const hot = (p, on) => {
        pois.forEach(o => { if (o !== p) { o.classList.remove("is-hot"); o._li && o._li.classList.remove("is-hot"); } });
        p.classList.toggle("is-hot", on); p._li && p._li.classList.toggle("is-hot", on);
        if (on) {
          const r = p.querySelector(".m-hit").getBoundingClientRect(), cr = card.getBoundingClientRect();
          tip.textContent = p.dataset.name;
          tip.style.left = r.left - cr.left + r.width / 2 + "px"; tip.style.top = r.top - cr.top + "px";
        }
        tip.classList.toggle("is-on", on);
      };
      pois.forEach((p, i) => {
        if (list) {
          const li = document.createElement("li");
          li.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b>${p.dataset.name}`;
          li.addEventListener("mouseenter", () => hot(p, true)); li.addEventListener("mouseleave", () => hot(p, false));
          list.appendChild(li); p._li = li;
        }
        p.addEventListener("mouseenter", () => hot(p, true)); p.addEventListener("mouseleave", () => hot(p, false));
        p.addEventListener("click", () => hot(p, !p.classList.contains("is-hot")));
      });
      const view = { s: 1, x: 0, y: 0 }, PIN = { x: 619.9 / 1877.43, y: 527 / 1106.01 };
      const apply = (anim = true) => {
        const w = viewport.clientWidth, h = viewport.clientHeight;
        view.x = Math.min(0, Math.max(w - w * view.s, view.x)); view.y = Math.min(0, Math.max(h - h * view.s, view.y));
        gsap.to(mapStage, { x: view.x, y: view.y, scale: view.s, duration: anim ? .7 : 0, ease: "power3.out" });
        svg.classList.toggle("show-labels", view.s >= 1.9);
      };
      const zoomAt = (s, fx, fy) => {
        const w = viewport.clientWidth, h = viewport.clientHeight;
        const px = (fx * w - view.x) / view.s, py = (fy * h - view.y) / view.s;
        view.s = Math.min(3.2, Math.max(1, s)); view.x = fx * w - px * view.s; view.y = fy * h - py * view.s; apply();
      };
      $$("[data-zoom]", card).forEach(b => b.addEventListener("click", () => {
        const k = b.dataset.zoom;
        if (k === "in") zoomAt(view.s * 1.4, .5, .5);
        if (k === "out") zoomAt(view.s / 1.4, .5, .5);
        if (k === "reset") { const w = viewport.clientWidth, h = viewport.clientHeight; view.s = 2.2; view.x = w / 2 - PIN.x * w * view.s; view.y = h / 2 - PIN.y * h * view.s; apply(); }
      }));
      let drag = null;
      viewport.addEventListener("pointerdown", e => { if (view.s <= 1) return; drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; viewport.classList.add("is-drag"); viewport.setPointerCapture(e.pointerId); });
      viewport.addEventListener("pointermove", e => { if (!drag) return; view.x = drag.vx + e.clientX - drag.x; view.y = drag.vy + e.clientY - drag.y; apply(false); });
      const end = () => { drag = null; viewport.classList.remove("is-drag"); };
      viewport.addEventListener("pointerup", end); viewport.addEventListener("pointercancel", end);
    }
  }

  // STACKING PLAN — isometric, clickable floors → NLA panel
  const iso = $("#iso");
  if (iso) {
    const C = .866, S = .5, L = 240, D = 140, OX = 175, OY = 412, FH = 20;
    const P = (x, y, z) => [OX + (x - z) * C, OY + (x + z) * S - y];
    const spec = [{ key: "B2", y0: -40, y1: -20 }, { key: "B1", y0: -20, y1: 0 }, { key: "1", y0: 0, y1: 30 }];
    for (let f = 2; f <= 16; f++) spec.push({ key: String(f), y0: 30 + (f - 2) * FH, y1: 30 + (f - 1) * FH });
    const roofY = 30 + 15 * FH;
    el("polygon", { class: "ground", points: pts([P(-30, 0, -30), P(L + 30, 0, -30), P(L + 30, 0, D + 30), P(-30, 0, D + 30)]) }, iso);
    const groupEls = {}, order = [];
    ABI.stack.groups.slice().reverse().forEach(g => {
      const ge = el("g", { class: `grp t-${g.type}`, "data-g": g.id, tabindex: 0, role: "button", "aria-label": g.tag }, iso);
      groupEls[g.id] = ge; order.push(ge);
      spec.filter(f => g.floors.includes(f.key)).forEach(f => {
        const fe = el("g", { class: "fl" + (f.key.startsWith("B") ? " is-basement" : "") }, ge), a = f.y0, b = f.y1;
        el("polygon", { class: "fz-l", points: pts([P(0, a, D), P(L, a, D), P(L, b, D), P(0, b, D)]) }, fe);
        el("polygon", { class: "fz-r", points: pts([P(L, a, 0), P(L, a, D), P(L, b, D), P(L, b, 0)]) }, fe);
        el("polygon", { class: "fz-t", points: pts([P(0, b, 0), P(L, b, 0), P(L, b, D), P(0, b, D)]) }, fe);
      });
    });
    const tum = el("g", { class: "fl tum" }, iso), ti = 60, tz = 36, th = 16;
    el("polygon", { class: "fz-l", points: pts([P(ti, roofY, D - tz), P(L - ti, roofY, D - tz), P(L - ti, roofY + th, D - tz), P(ti, roofY + th, D - tz)]) }, tum);
    el("polygon", { class: "fz-r", points: pts([P(L - ti, roofY, tz), P(L - ti, roofY, D - tz), P(L - ti, roofY + th, D - tz), P(L - ti, roofY + th, tz)]) }, tum);
    el("polygon", { class: "fz-t", points: pts([P(ti, roofY + th, tz), P(L - ti, roofY + th, tz), P(L - ti, roofY + th, D - tz), P(ti, roofY + th, D - tz)]) }, tum);
    $$("polygon", tum).forEach(p => { p.style.stroke = "#232960"; p.style.strokeWidth = 1; });
    const lblEls = {}, lblGroups = {};
    ABI.stack.groups.forEach(g => {
      const fs = spec.filter(f => g.floors.includes(f.key));
      const [x, y] = P(L, (Math.min(...fs.map(f => f.y0)) + Math.max(...fs.map(f => f.y1))) / 2, 0);
      const lg = el("g", { class: "lblg" }, iso);
      el("line", { class: "lead", x1: x + 8, y1: y, x2: 470, y2: y }, lg);
      const t = el("text", { class: "lbl", x: 478, y: y + 4 }, lg); t.textContent = g.tag;
      lblEls[g.id] = t; lblGroups[g.id] = lg;
    });
    const chips = $("#fpChips");
    ABI.stack.groups.forEach(g => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.textContent = g.tag; b.dataset.g = g.id;
      b.addEventListener("click", () => select(g.id)); chips.appendChild(b);
    });
    let active = null;
    function select(id) {
      const g = ABI.stack.groups.find(x => x.id === id);
      if (active) { groupEls[active].classList.remove("is-active"); lblEls[active].classList.remove("is-active"); }
      active = id;
      const ge = groupEls[id], idx = order.indexOf(ge);
      ge.classList.add("is-active"); lblEls[id].classList.add("is-active");
      order.forEach((o, i) => gsap.to([o, lblGroups[o.dataset.g]], { y: i > idx ? -34 : 0, duration: .7, ease: "power3.inOut" }));
      gsap.to(tum, { y: -34, duration: .7, ease: "power3.inOut" });
      $$("button", chips).forEach(b => b.setAttribute("aria-selected", b.dataset.g === id));
      gsap.fromTo(["#fpTag", "#fpTitle", "#fpNla", "#fpDesc", "#fpMedia"], { y: 14, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .5, ease: "power2.out" });
      $("#fpTag").textContent = g.tag; $("#fpTitle").textContent = g.title;
      $("#fpNla").textContent = g.nla ? "Diện tích cho thuê: " + g.nla : ""; $("#fpDesc").textContent = g.desc || "";
      const media = $("#fpMedia");
      media.classList.toggle("is-photo", !g.plan);
      media.innerHTML = g.plan ? `<img src="../assets/plans/${g.plan}" alt="Mặt bằng ${g.tag}">` : `<img src="../assets/img/${g.img}" alt="${g.title}">`;
    }
    Object.entries(groupEls).forEach(([id, ge]) => {
      ge.addEventListener("mouseenter", () => ge.classList.add("is-hover")); ge.addEventListener("mouseleave", () => ge.classList.remove("is-hover"));
      ge.addEventListener("click", () => select(id));
      ge.addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), select(id)));
    });
    select("f10-14");
    gsap.from($$(".grp .fl, .tum", iso), { opacity: 0, duration: .5, ease: "power2.out", stagger: .05, scrollTrigger: { trigger: iso, start: "top 75%" } });
  }

  // STATS (stacking summary) count-up
  $$("[data-stats]").forEach(stats => {
    ABI.stack.summary.forEach(s => {
      const d = document.createElement("div");
      d.innerHTML = `<dt>${s.k}</dt><dd><span>${s.v}</span>${s.unit ? `<small>${s.unit}</small>` : ""}</dd>`;
      stats.appendChild(d);
      countUp(d.querySelector("span"), String(s.v), stats);
    });
  });
  $$("[data-count]").forEach(n => countUp(n, n.dataset.count, n));
  function countUp(node, raw, trigger) {
    const target = parseFloat(raw.replace(/\./g, "").replace(",", ".")), dec = raw.includes(",") ? 1 : 0, o = { v: 0 };
    node.textContent = "0";
    gsap.to(o, { v: target, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger, start: "top 85%" },
      onUpdate: () => (node.textContent = o.v.toLocaleString("vi-VN", { minimumFractionDigits: dec, maximumFractionDigits: dec })) });
  }

  // AMENITIES draggable track
  const track = $("#amenTrack");
  if (track) {
    const bar = $("#amenBar");
    let tx = 0, d = null;
    const maxX = () => Math.min(0, -(track.scrollWidth - track.clientWidth));
    const setTx = (v, anim) => {
      tx = Math.max(maxX(), Math.min(0, v));
      gsap.to(track, { x: tx, duration: anim ? .9 : .25, ease: "power3.out" });
      const m = maxX(); gsap.to(bar, { width: (m ? 25 + 75 * (tx / m) : 100) + "%", duration: .4 });
    };
    track.addEventListener("pointerdown", e => { d = { x: e.clientX, t: tx }; track.classList.add("is-drag"); track.setPointerCapture(e.pointerId); });
    track.addEventListener("pointermove", e => d && setTx(d.t + (e.clientX - d.x) * 1.2));
    const end = () => { d = null; track.classList.remove("is-drag"); };
    track.addEventListener("pointerup", end); track.addEventListener("pointercancel", end);
    $$(".amen-nav button").forEach(b => b.addEventListener("click", () => setTx(tx - (track.querySelector(".amen-card").offsetWidth + 18) * +b.dataset.dir, true)));
    gsap.from(".amen-card", { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: track, start: "top 85%" } });
  }

  // FLOOR PLAN tabs
  const plans = $(".plans");
  if (plans) {
    const data = JSON.parse($("#plansData").textContent);
    const tabs = $(".plans-tabs", plans), img = $(".plans-img", plans);
    data.forEach((p, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.textContent = p.tab;
      b.addEventListener("click", () => show(i)); tabs.appendChild(b);
    });
    function show(i) {
      const p = data[i];
      $$("button", tabs).forEach((b, k) => b.setAttribute("aria-selected", k === i));
      img.classList.remove("is-zoom"); img.classList.toggle("is-photo", !!p.photo);
      img.innerHTML = `<img src="${p.photo ? "../assets/img/" + p.photo : "../assets/plans/" + p.plan}" alt="${p.title}">`;
      $(".plans-info h3", plans).textContent = p.title;
      const nla = $(".plans-info .fp-nla", plans); nla.textContent = p.nla ? "Diện tích cho thuê: " + p.nla : "";
      $(".plans-info p.d", plans).textContent = p.desc;
      gsap.fromTo([img, ".plans-info > *"], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .05, ease: "power2.out" });
    }
    img.addEventListener("click", () => img.classList.toggle("is-zoom"));
    show(3);
  }

  // GALLERY lightbox
  const gal = $(".gallery");
  if (gal) {
    const items = $$("button", gal), lb = $(".lb"), lbImg = $("img", lb), cap = $(".lb-c", lb);
    let i = 0;
    const open = k => { i = (k + items.length) % items.length; lbImg.src = items[i].querySelector("img").src; lbImg.alt = items[i].querySelector("img").alt; cap.textContent = `${i + 1} / ${items.length}`; lb.classList.add("is-on"); lenis && lenis.stop(); };
    const close = () => { lb.classList.remove("is-on"); lenis && lenis.start(); };
    items.forEach((b, k) => b.addEventListener("click", () => open(k)));
    $(".lb-x", lb).addEventListener("click", close);
    $(".lb-p", lb).addEventListener("click", () => open(i - 1));
    $(".lb-n", lb).addEventListener("click", () => open(i + 1));
    lb.addEventListener("click", e => e.target === lb && close());
    document.addEventListener("keydown", e => { if (!lb.classList.contains("is-on")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") open(i - 1); if (e.key === "ArrowRight") open(i + 1); });
    gsap.from(items, { y: 50, opacity: 0, duration: 1, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: gal, start: "top 80%" } });
  }

  // NEWS filter chips
  const chipsN = $(".chips");
  if (chipsN) {
    $$("button", chipsN).forEach(b => b.addEventListener("click", () => {
      $$("button", chipsN).forEach(x => x.classList.toggle("is-on", x === b));
      $$(".news-card").forEach(c => { const show = b.dataset.cat === "all" || c.dataset.cat === b.dataset.cat; gsap.to(c, { opacity: show ? 1 : .18, scale: show ? 1 : .97, duration: .4 }); });
    }));
  }

  // LEASING PROCESS — line fills, steps light up
  const proc = $(".process");
  if (proc) {
    gsap.to(".process-line i", { height: "100%", ease: "none", scrollTrigger: { trigger: proc, start: "top 60%", end: "bottom 60%", scrub: true } });
    $$(".step", proc).forEach(s => ScrollTrigger.create({ trigger: s, start: "top 62%", onEnter: () => s.classList.add("is-on"), onLeaveBack: () => s.classList.remove("is-on") }));
  }

  // ENQUIRY form (demo — not wired to a backend)
  const form = $(".form");
  if (form) form.addEventListener("submit", e => { e.preventDefault(); const n = $(".form-note", form); n.textContent = n.dataset.ok; n.classList.add("is-ok"); });

  // DESIGN page — cloud line over the photo, LED lines on the facade, logo mark
  $$("[data-draw]").forEach(p => {
    const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
    gsap.to(p, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: p.closest("section"), start: "top 70%", end: "center 40%", scrub: 1 } });
  });
  $$(".amb-media .led").forEach((l, i) => gsap.fromTo(l, { yPercent: 100 }, { yPercent: -100, duration: 2.4 + (i % 3) * .5, ease: "none", repeat: -1, delay: i * .35 }));

  // generic reveals + parallax
  $$("[data-reveal]").forEach(n => gsap.from(n, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 88%" } }));
  $$("[data-stagger]").forEach(n => gsap.from(n.children, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", stagger: .08, scrollTrigger: { trigger: n, start: "top 85%" } }));
  $$("[data-parallax]").forEach(img => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  if ($(".leed-badge")) gsap.from(".leed-badge", { rotate: -120, scale: .6, opacity: 0, duration: 1.4, ease: "back.out(1.4)", scrollTrigger: { trigger: ".leed-badge", start: "top 85%" } });
  if ($(".lease-card")) gsap.from(".lease-card", { y: 80, scale: .96, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".lease", start: "top 80%" } });
  if ($(".award-badge .ring")) gsap.to(".award-badge .ring", { rotate: 120, ease: "none", scrollTrigger: { trigger: ".award", start: "top bottom", end: "bottom top", scrub: true } });
  ABI.cloudNets();
  ABI.mountQR($("#qr"), 148);

  // deep links from other pages (e.g. tin-tuc-lien-he.html#dia-chi)
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
    const t = location.hash && $(location.hash);
    if (!t) return;
    const box = t.parentElement.classList.contains("pin-spacer") ? t.parentElement : t;
    const y = box.getBoundingClientRect().top + window.scrollY;
    lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y);
  });
})();
