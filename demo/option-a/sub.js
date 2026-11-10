/* ABI Tower — Option A · subpage interactions (runs after common.js).
   Every block checks that its section exists, so one file serves all five subpages. */
(() => {
  const $ = id => document.getElementById(id);
  const mm = gsap.matchMedia();
  // same breakpoint as the homepage's pinned Grade A section
  const WIDE = "(min-width: 1101px), (min-width: 721px) and (orientation: landscape)";

  /* ---------- page hero: words rise in, the photo settles from a slow zoom and drifts with scroll ---------- */
  const title = document.querySelector(".phero-title");
  if (title) {
    const words = title.textContent.trim().normalize("NFC").split(/\s+/);
    title.innerHTML = words.map(w => `<span class="wd"><span class="ch">${w}</span></span>`).join(" ");
    const tl = gsap.timeline({ delay: .1 });
    tl.fromTo(".phero-bg img", { scale: 1.14 }, { scale: 1, duration: 2.4, ease: "expo.out" }, 0)
      .from(".crumbs", { y: 16, opacity: 0, duration: .8, ease: "expo.out" }, .15)
      .fromTo(".phero-title .ch", { yPercent: 60, opacity: 0, filter: "blur(10px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: .9, ease: "expo.out", stagger: .06 }, .2)
      .from(".phero-sub", { y: 20, opacity: 0, duration: 1, ease: "expo.out" }, .55);
    gsap.to(".phero-bg", { yPercent: 16, ease: "none", scrollTrigger: { trigger: ".phero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- VỀ CHÚNG TÔI ---------- */
  gsap.utils.toArray(".partner").forEach(p => {
    const st = { trigger: p, start: "top 78%" };
    gsap.from(p.querySelector(".partner-photo"), { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: st });
    gsap.fromTo(p.querySelector(".partner-photo img"), { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: st });
    gsap.from(p.querySelector(".partner-logo"), { y: 40, opacity: 0, duration: 1, delay: .5, ease: "back.out(1.6)", scrollTrigger: st });
  });

  /* ---------- THIẾT KẾ THÔNG MINH ---------- */
  const badge = document.querySelector(".award-hl-badge");
  badge && gsap.from(badge, { y: 30, rotate: -6, opacity: 0, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: badge, start: "top 92%" } });
  const awm = document.querySelector(".award-hl-media");
  awm && gsap.from(awm, { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: awm, start: "top 85%" } });

  // smart solutions: images slide past sideways while the section is pinned, text under each photo
  const track = document.querySelector(".tech-track");
  if (track) {
    mm.add(WIDE, () => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const bar = document.querySelector(".tech-progress i");
      const slide = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: ".tech", start: "top top", end: () => "+=" + Math.max(dist(), window.innerHeight * .6),
          pin: ".tech-pin", scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: s => gsap.set(bar, { scaleX: s.progress })
        }
      });
      // each photo glides inside its frame as the row moves
      track.querySelectorAll(".tech-card img").forEach(img => gsap.fromTo(img, { xPercent: -10 }, {
        xPercent: 0, ease: "none",
        scrollTrigger: { trigger: img.parentElement, containerAnimation: slide, start: "left right", end: "right left", scrub: true }
      }));
    });
    gsap.from(".tech-card", { y: 50, opacity: 0, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: { trigger: track, start: "top 85%" } });
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
        nla: [["Tầng 12F - Tầng văn phòng điển hình", "816.5sqm"]], plan: "mb-f12" },
      { id: "f2-9", floors: ["9", "8", "7", "6", "5", "4", "3", "2"], tag: "2F – 9F", type: "office", label: "Tầng 2 - 9", name: "Văn phòng hạng A thấp tầng",
        nla: [["Tầng 2F - Văn phòng", "320.1 sqm"], ["Tầng 3F-5F: Văn phòng", "803.4 sqm"], ["Tầng 6F-9F: Văn phòng", "815.8 sqm"]], plan: "mb-f2" },
      { id: "f1", floors: ["1"], tag: "1F", type: "lobby", label: "Tầng 1", name: "Sảnh đón + Quán Café", nla: [["Diện tích cho thuê", "950.1 sqm"]], plan: "mb-f1" },
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
  const gm = document.querySelector(".green-media img");
  gm && gsap.fromTo(gm, { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".green", start: "top bottom", end: "bottom top", scrub: true } });
  const glogo = document.querySelector(".green-logo");
  glogo && gsap.from(glogo, { scale: .6, rotate: -14, opacity: 0, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: glogo, start: "top 90%" } });
  document.querySelector(".news-card") && gsap.from(".news-card", { y: 50, opacity: 0, stagger: .1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".news-grid", start: "top 88%" } });

  /* ---------- LIÊN HỆ CHO THUÊ ---------- */
  const steps = gsap.utils.toArray(".step");
  if (steps.length) {
    const pics = gsap.utils.toArray(".process-media img"), count = document.querySelector(".process-count b");
    const setStep = i => {
      steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
      pics.forEach((p, k) => p.classList.toggle("is-on", k === i));
      count && (count.textContent = String(i + 1).padStart(2, "0"));
    };
    steps.forEach((s, i) => {
      ScrollTrigger.create({ trigger: s, start: "top 60%", end: "bottom 60%", onToggle: st => st.isActive && setStep(i) });
      gsap.from(s.children, { y: 26, opacity: 0, stagger: .06, duration: .9, ease: "expo.out", scrollTrigger: { trigger: s, start: "top 88%" } });
    });
    setStep(0);
  }
  document.querySelector(".cond-card") && gsap.from(".cond-card", { y: 50, opacity: 0, stagger: .12, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".cond-grid", start: "top 85%" } });
  const gmap = document.querySelector(".gmap");
  gmap && gsap.from(gmap, { clipPath: "inset(12% 6% 0% 6% round 28px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: gmap, start: "top 85%" } });

  ABI.lateReveals();
})();
