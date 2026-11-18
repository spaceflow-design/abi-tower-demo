/* ABI Tower — Option A · subpage interactions (runs after common.js).
   Every block checks that its section exists, so one file serves all five subpages. */
(() => {
  const $ = id => document.getElementById(id);

  /* ---------- page hero: the colour field fades/settles in, the title resolves letter by letter (as the
     homepage title card), and on scroll the copy drifts up while the glows move slower (depth) ---------- */
  const title = document.querySelector(".phero-title");
  if (title) {
    const text = title.textContent.trim().normalize("NFC");
    title.setAttribute("aria-label", text);          // one readable name; the split letters are hidden from AT
    title.innerHTML = `<span aria-hidden="true">${text.split(/\s+/).map(w => `<span class="wd">${Array.from(w).map(c => `<span class="ch">${c}</span>`).join("")}</span>`).join(" ")}</span>`;
    ABI.kernSplit(title);
    const tl = gsap.timeline({ delay: .05 });
    tl.fromTo(".phero-sky", { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 1.8, ease: "expo.out" }, 0)
      .fromTo(".phero-grid", { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out" }, .2)
      .from(".crumbs", { y: 16, opacity: 0, duration: .8, ease: "expo.out" }, .2)
      .fromTo(".phero-title .ch", { opacity: 0, yPercent: 45, filter: "blur(12px)" },
        { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: .7, ease: "power3.out", stagger: .018 }, .3)
      .from(gsap.utils.toArray(".phero-sub"), { y: 20, opacity: 0, duration: 1, ease: "expo.out" }, .7)
      .from(".phero-scroll", { opacity: 0, duration: .6 }, 1.1);
    const st = { trigger: ".phero", start: "top top", end: "bottom top", scrub: true };
    gsap.to(".phero-in", { yPercent: -18, opacity: .2, ease: "none", scrollTrigger: st });
    gsap.to(".phero-sky", { yPercent: 10, ease: "none", scrollTrigger: st });
  }

  /* ---------- section headings: words rise out of a mask as they scroll in (client 17/11: more motion) ---------- */
  gsap.utils.toArray("main > section:not(.phero) .h2, .contact-card .lease-title").forEach(h => {
    // split on plain spaces only, so "ABI&nbsp;Tower" stays together
    const parts = h.innerHTML.split(/(<br\s*\/?>)/i);
    h.innerHTML = parts.map(p => /^<br/i.test(p) ? p : p.split(/ +/).filter(Boolean).map(w => `<span class="kw"><span class="kwi">${w}</span></span>`).join(" ")).join("");
    gsap.from(h.querySelectorAll(".kwi"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: .045, scrollTrigger: { trigger: h, start: "top 88%" } });
  });

  /* ---------- VỀ CHÚNG TÔI — photo wipe + light sweep, flickering brand modules, drifting index, progress rail ---------- */
  gsap.utils.toArray(".partner").forEach(p => {
    const st = { trigger: p, start: "top 78%" };
    const photo = p.querySelector(".partner-photo");
    gsap.from(photo, { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: st });
    gsap.fromTo(photo.querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: st });
    gsap.to(photo.querySelector(".scan-sweep"), { xPercent: 240, duration: 1.4, delay: .9, ease: "power2.inOut", scrollTrigger: st });
    gsap.from(p.querySelector(".partner-logo"), { y: 40, opacity: 0, duration: 1, delay: .5, ease: "back.out(1.6)", scrollTrigger: st });
    gsap.from(p.querySelectorAll(".partner-copy .eyebrow, .partner-copy .body"), { y: 26, opacity: 0, duration: 1, stagger: .1, delay: .15, ease: "expo.out", scrollTrigger: st });
    const idx = p.querySelector(".partner-idx");
    idx && gsap.fromTo(idx, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true } });
    const deco = p.querySelector(".partner-deco");
    if (deco) {
      const fills = ABI.buildPattern(deco, 220, 300, 20);
      fills.forEach((f, k) => f.setAttribute("class", k % 3 ? "pt-f" : "pt-s"));
      gsap.from(deco.querySelectorAll("polygon"), { opacity: 0, duration: .5, stagger: { each: .008, from: "random" }, scrollTrigger: st });
      ABI.reduceMotion || gsap.to(fills, { opacity: () => gsap.utils.random([.15, .45, 1]), duration: 1.2, ease: "sine.inOut", stagger: { each: .12, from: "random", repeat: -1, yoyo: true, repeatDelay: .8 } });
    }
  });
  const rail = document.querySelector(".team-rail i");
  rail && gsap.to(rail, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".team", start: "top 60%", end: "bottom 60%", scrub: true } });

  /* ---------- THIẾT KẾ THÔNG MINH ---------- */
  const badge = document.querySelector(".award-hl-badge");
  badge && gsap.from(badge, { y: 40, rotate: -8, scale: .8, opacity: 0, duration: 1.3, ease: "back.out(1.6)", scrollTrigger: { trigger: badge, start: "top 95%" } });
  const awm = document.querySelector(".award-hl-media");
  awm && gsap.from(awm, { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: awm, start: "top 85%" } });
  awm && gsap.from(".award-hl-copy > *", { y: 30, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".award-hl-copy", start: "top 85%" } });

  // smart solutions slider (client 17/11): arrows + progress, the hovered / focused card grows, swipe on touch
  const view = document.querySelector(".tech-view");
  if (view) {
    const cards = [...view.querySelectorAll(".tech-card")];
    const bar = document.querySelector(".tech-progress i");
    const [prev, next] = [...document.querySelectorAll(".tech-btn")];
    const smooth = ABI.reduceMotion ? "auto" : "smooth";
    // aria-disabled (not disabled) so a focused arrow keeps keyboard focus at either end
    const setOff = (b, off) => { b.setAttribute("aria-disabled", off); b.classList.toggle("is-off", off); };
    const sync = () => {
      const max = view.scrollWidth - view.clientWidth;
      const p = max > 0 ? view.scrollLeft / max : 1;
      bar.style.transform = `scaleX(${Math.max(.08, p)})`;
      setOff(prev, view.scrollLeft < 4);
      setOff(next, view.scrollLeft > max - 4);
    };
    view.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    // step card by card: scroll to the next card's start (minus the row's start padding), clamped to the end
    const startPad = () => parseFloat(getComputedStyle(view).scrollPaddingLeft) || 0;
    const go = dir => {
      const x = view.scrollLeft + startPad() + 2, lefts = cards.map(c => c.offsetLeft);
      const target = dir > 0 ? lefts.find(l => l > x) : [...lefts].reverse().find(l => l < x - 4);
      const max = view.scrollWidth - view.clientWidth;
      view.scrollTo({ left: target == null ? (dir > 0 ? max : 0) : Math.min(max, Math.max(0, target - startPad())), behavior: smooth });
    };
    [prev, next].forEach(b => b.addEventListener("click", () => b.getAttribute("aria-disabled") !== "true" && go(+b.dataset.dir)));
    // a growing card can push past the visible edge: once it has grown, bring it fully into view
    let reveal;
    const keepInView = c => {
      clearTimeout(reveal);
      reveal = setTimeout(() => {
        const r = c.getBoundingClientRect(), v = view.getBoundingClientRect(), pad = startPad();
        const over = r.right - (v.right - pad), under = (v.left + pad) - r.left;
        if (over > 1) view.scrollBy({ left: over, behavior: smooth });
        else if (under > 1) view.scrollBy({ left: -under, behavior: smooth });
        sync();
      }, 720);
    };
    const hot = c => { cards.forEach(o => o.classList.toggle("is-hot", o === c)); c && keepInView(c); };
    cards.forEach(c => {
      c.tabIndex = 0;
      c.addEventListener("mouseenter", () => hot(c));
      c.addEventListener("focus", () => hot(c));
      c.addEventListener("click", () => hot(c));
    });
    view.addEventListener("mouseleave", () => hot(null));
    sync();
    gsap.from(cards, { y: 50, opacity: 0, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: view, start: "top 85%" } });
  }
  gsap.utils.toArray(".hl-list li").forEach((li, i) => gsap.from(li, { y: 26, opacity: 0, duration: .9, delay: (i % 2) * .08, ease: "expo.out", scrollTrigger: { trigger: li, start: "top 92%" } }));
  const hlm = document.querySelector(".hl-media");
  hlm && gsap.from(hlm, { clipPath: "inset(0% 100% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: hlm, start: "top 80%" } });
  gsap.utils.toArray(".concept-card").forEach((c, i) => gsap.from(c, { y: 60, opacity: 0, duration: 1.2, delay: i * .12, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%" } }));

  /* ---------- VĂN PHÒNG — stacking plan + floor plates ---------- */
  const iso = $("iso"), vList = $("vGroups");
  if (iso && vList) {
    // groups and NLA from the sheet ("Văn phòng" page); NLA per floor from its "Mặt bằng tầng" section
    const VG = [
      { id: "rf", floors: ["R"], tag: "Rooftop", type: "rooftop", label: "Tầng thượng", plan: "mb-rf" },
      { id: "f14-16", floors: ["16", "15", "14"], tag: "14F – 16F", type: "abi", label: "Tầng 14-16", name: "Văn phòng &amp; Game Studio của ABI Tower" },
      { id: "f10-13", floors: ["13", "12", "11", "10"], tag: "10F – 13F", type: "office", label: "Tầng 10 - 13", name: "Văn phòng hạng A cao tầng",
        nla: [["Tầng 10F-13F: Văn phòng", "816.5sqm"]], plan: "mb-f10-13" },
      { id: "f2-9", floors: ["9", "8", "7", "6", "5", "4", "3", "2"], tag: "2F – 9F", type: "office", label: "Tầng 2 - 9", name: "Văn phòng hạng A thấp tầng",
        nla: [["Tầng 2F - Văn phòng", "320.1 sqm"], ["Tầng 3F-5F: Văn phòng", "803.4 sqm"], ["Tầng 6F-9F: Văn phòng", "815.8 sqm"]], plan: "mb-f2" },
      { id: "f1", floors: ["1"], tag: "1F", type: "lobby", label: "Tầng 1", name: "Sảnh đón + Quán Café", nla: [["Diện tích cho thuê", "422 sqm"]], plan: "mb-f1" },
      { id: "fb", floors: ["B1", "B2"], tag: "B1 – B2", type: "basement", label: "Tầng B1-B2", name: "Hầm đỗ xe" }
    ];
    const items = {};
    VG.forEach(g => {
      const li = document.createElement("li");
      li.className = `vg t-${g.type}${g.nla || g.plan ? "" : " is-flat"}`;
      const rows = g.nla ? `<ul>${g.nla.map(([k, v]) => `<li>${k}<strong>${v}</strong></li>`).join("")}</ul>` : "";
      const link = g.plan ? `<a href="#${g.plan}">Mặt bằng tầng <span aria-hidden="true">→</span></a>` : "";
      li.innerHTML = `<button type="button" class="vg-btn" aria-expanded="false"><b>${g.label}</b>${g.name ? `<span>${g.name}</span>` : ""}</button>` +
        (rows || link ? `<div class="vg-more"><div>${rows}${link}</div></div>` : "");
      const btn = li.querySelector(".vg-btn");
      btn.addEventListener("click", () => stack.select(g.id));
      li.addEventListener("mouseenter", () => stack.hover(g.id, true));
      li.addEventListener("mouseleave", () => stack.hover(g.id, false));
      vList.appendChild(li);
      items[g.id] = li;
    });
    const stack = ABI.mountStacking(iso, {
      groups: VG,
      onSelect: g => {
        Object.entries(items).forEach(([id, li]) => {
          li.classList.toggle("is-on", id === g.id);
          li.querySelector(".vg-btn").setAttribute("aria-expanded", id === g.id);
        });
        // the opened row changes the list's height → the floor-plate triggers below must be re-measured
        ABI.refreshSoon(520);
      }
    });
    stack.select("f10-13");
    ABI.mountStats($("stackStats"), ABI.stack.summary);
    gsap.from(".vg", { y: 24, opacity: 0, stagger: .07, duration: .9, ease: "expo.out", scrollTrigger: { trigger: vList, start: "top 85%" } });
  }
  document.querySelectorAll(".fp-legend[data-leg]").forEach(ul => (ul.innerHTML = ABI.legendHTML(ABI.LEG[ul.dataset.leg])));
  // floor index follows the block in view
  const navLinks = [...document.querySelectorAll(".plans-nav a")];
  if (navLinks.length) {
    const setOn = id => navLinks.forEach(a => {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("is-on", on);
      if (on && a.parentElement.parentElement.scrollWidth > a.parentElement.parentElement.clientWidth) {
        const ol = a.parentElement.parentElement;
        ol.scrollTo({ left: a.parentElement.offsetLeft - 16, behavior: "smooth" });
      }
    });
    gsap.utils.toArray(".fl-block").forEach(b => {
      ScrollTrigger.create({ trigger: b, start: "top 55%", end: "bottom 55%", onToggle: s => s.isActive && setOn(b.id) });
      const plan = b.querySelector(".fl-plan");
      gsap.from(plan, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: plan, start: "top 85%" } });
    });
    setOn(navLinks[0].getAttribute("href").slice(1));
  }

  /* ---------- HỆ TIỆN ÍCH CHUNG ---------- */
  const panels = gsap.utils.toArray(".am-panel");
  const stackedPanels = window.matchMedia("(max-width: 720px)");   // phones: panels open in height
  panels.forEach(p => {
    const open = () => {
      if (p.classList.contains("is-open")) return;
      panels.forEach(o => o.classList.toggle("is-open", o === p));
      stackedPanels.matches && ABI.refreshSoon(760);
    };
    p.addEventListener("mouseenter", open);
    p.addEventListener("click", open);
    p.addEventListener("focus", open);
  });
  panels.length && gsap.from(panels, { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.out", stagger: .1, scrollTrigger: { trigger: ".am-row", start: "top 82%" } });
  const gstage = document.querySelector(".green-stage");
  if (gstage) {
    gsap.from(gstage, { clipPath: "inset(14% 8% 0% 8% round 28px)", duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: gstage, start: "top 85%" } });
    gsap.from(".green-card", { y: 60, opacity: 0, duration: 1.2, delay: .3, ease: "expo.out", scrollTrigger: { trigger: gstage, start: "top 70%" } });
  }
  const glogo = document.querySelector(".green-logo");
  glogo && gsap.from(glogo, { scale: .6, rotate: -14, opacity: 0, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: glogo, start: "top 90%" } });
  document.querySelector(".news-card") && gsap.from(".news-card", { y: 50, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".news-grid", start: "top 88%" } });

  /* ---------- LIÊN HỆ CHO THUÊ ---------- */
  const steps = gsap.utils.toArray(".step");
  if (steps.length) {
    const pics = gsap.utils.toArray(".process-media img"), count = document.querySelector(".process-count b");
    const DWELL = 6;   // seconds per step while it plays by itself
    let cur = -1, bar, auto = !ABI.reduceMotion, inView = false;
    const setStep = (i, fromUser) => {
      if (fromUser) auto = false;
      cur = i;
      steps.forEach((s, k) => { s.classList.toggle("is-on", k === i); s.querySelector(".step-head").setAttribute("aria-expanded", k === i); });
      pics.forEach((p, k) => p.classList.toggle("is-on", k === i));
      count && (count.textContent = String(i + 1).padStart(2, "0"));
      bar && bar.kill();
      gsap.set(".step-bar", { scaleX: 0 });
      if (auto && inView) bar = gsap.fromTo(steps[i].querySelector(".step-bar"), { scaleX: 0 }, { scaleX: 1, duration: DWELL, ease: "none", onComplete: () => setStep((i + 1) % steps.length) });
      ABI.refreshSoon(600);   // the open step changes the section height a little
    };
    steps.forEach((s, i) => s.querySelector(".step-head").addEventListener("click", () => setStep(i, true)));
    // hovering or focusing the list pauses the auto-advance; leaving it resumes
    const list = document.querySelector(".steps");
    list.addEventListener("mouseenter", () => bar && bar.pause());
    list.addEventListener("mouseleave", () => bar && auto && bar.resume());
    list.addEventListener("focusin", () => bar && bar.pause());
    ScrollTrigger.create({ trigger: ".process", start: "top 70%", end: "bottom 30%",
      onToggle: st => { inView = st.isActive; if (inView && auto) setStep(Math.max(cur, 0)); else bar && bar.pause(); } });
    setStep(0);
    gsap.from(steps, { y: 26, opacity: 0, stagger: .06, duration: .9, ease: "expo.out", scrollTrigger: { trigger: ".steps", start: "top 88%" } });
  }
  document.querySelector(".cond-card") && gsap.from(".cond-card", { y: 50, opacity: 0, stagger: .12, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".cond-grid", start: "top 85%" } });
  const ccard = document.querySelector(".contact-card");
  if (ccard) {
    gsap.from(ccard, { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ccard, start: "top 85%" } });
    gsap.from(ccard.querySelectorAll(".contact-info > *, .lead"), { y: 30, opacity: 0, stagger: .1, duration: 1, delay: .2, ease: "expo.out", scrollTrigger: { trigger: ccard, start: "top 80%" } });
  }
  const gmap = document.querySelector(".gmap");
  gmap && gsap.from(gmap, { clipPath: "inset(12% 6% 0% 6% round 28px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: gmap, start: "top 85%" } });

  ABI.lateReveals();
})();
