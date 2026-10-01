/* =========================================================
   Portfólio — interações
   ========================================================= */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // entrada do hero (espera as fontes para não pular o layout)
  const start = () => requestAnimationFrame(() => document.body.classList.add("loaded"));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  setTimeout(start, 1500);

  /* ---------- nav: some ao descer, volta ao subir ---------- */
  const nav = $("#nav");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("solid", y > 40);
    nav.classList.toggle("hide", y > lastY && y > 400 && !document.body.classList.contains("menu-open"));
    lastY = y;
  }, { passive: true });

  const menuBtn = $("#menu-btn");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$(".nav-links a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- palavras que se reescrevem no título ---------- */
  const swap = $("#swap");
  const words = ["e-commerces", "painéis", "automações", "sistemas", "sites"];
  if (swap && !reduce) {
    let wi = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async function loop() {
      await sleep(2600);
      while (true) {
        const cur = words[wi];
        for (let i = cur.length; i >= 0; i--) { swap.textContent = cur.slice(0, i); await sleep(38); }
        wi = (wi + 1) % words.length;
        const next = words[wi];
        await sleep(180);
        for (let i = 1; i <= next.length; i++) { swap.textContent = next.slice(0, i); await sleep(70); }
        await sleep(2200);
      }
    })();
  }

  /* ---------- campo de pontos interativo (hero) ---------- */
  const canvas = $("#field");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let W, H, dpr, pts = [], gap, visible = true, t0 = performance.now();

    function build() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = W < 700 ? 26 : 32;
      pts = [];
      for (let y = gap / 2; y < H; y += gap)
        for (let x = gap / 2; x < W; x += gap) pts.push({ x, y, ox: x, oy: y });
    }
    let running = false;
    function kick() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }
    function frame(now) {
      running = false;
      if (!visible) return;
      const t = (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      ctx.clearRect(0, 0, W, H);
      const R = 170;
      for (const p of pts) {
        // ondulação lenta + repulsão suave do cursor
        const wave = Math.sin(p.ox * 0.012 + t * 0.8) * Math.cos(p.oy * 0.012 + t * 0.6);
        let dx = p.ox - mouse.x, dy = p.oy - mouse.y;
        const d = Math.hypot(dx, dy);
        let push = 0;
        if (d < R) push = (1 - d / R) ** 2;
        const tx = p.ox + (d ? (dx / d) * push * 26 : 0);
        const ty = p.oy + (d ? (dy / d) * push * 26 : 0) + wave * 2;
        p.x += (tx - p.x) * 0.18; p.y += (ty - p.y) * 0.18;
        const a = 0.2 + wave * 0.08 + push * 0.8;
        const size = 1.5 + push * 2;
        ctx.fillStyle = push > 0.05 ? `rgba(215,255,58,${a})` : `rgba(243,242,236,${a})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }
      if (!reduce) kick();
    }
    build();
    let lastW = innerWidth, rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (innerWidth === lastW && pts.length) return; // barra do navegador no celular: ignora
        lastW = innerWidth; build(); if (reduce) frame(performance.now()); else kick();
      }, 150);
    });
    canvas.parentElement.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top;
    });
    canvas.parentElement.addEventListener("pointerleave", () => { mouse.tx = mouse.ty = -9999; });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (!reduce) kick(); }).observe(canvas);
    requestAnimationFrame(frame);
  }

  /* ---------- cursor personalizado + botões magnéticos ---------- */
  if (finePointer && !reduce) {
    const ring = $(".cursor"), dot = $(".cursor-dot"), label = $(".cursor .label");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    let moving = false;
    function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.2) requestAnimationFrame(loop); else moving = false;
    }
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY; document.body.classList.add("has-cursor");
      if (!moving) { moving = true; requestAnimationFrame(loop); }
    });
    document.documentElement.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
    $$("a, button, [data-cursor], .pr").forEach((el) => {
      el.addEventListener("pointerenter", () => { ring.classList.add("hover"); label.textContent = el.dataset.cursor || ""; });
      el.addEventListener("pointerleave", () => { ring.classList.remove("hover"); label.textContent = ""; });
    });
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2, my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.25}px, ${my * 0.3}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 600);
      });
    });
  }

  /* ---------- inclinação 3D + reflexo nos projetos ---------- */
  if (finePointer && !reduce) {
    $$("[data-tilt]").forEach((card) => {
      const media = card.closest(".p-media");
      const shine = $(".shine", card);
      media.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = `rotateY(${(px - 0.5) * 8}deg) rotateX(${(0.5 - py) * 6}deg) translateZ(0)`;
        if (shine) { shine.style.setProperty("--mx", px * 100 + "%"); shine.style.setProperty("--my", py * 100 + "%"); }
      });
      media.addEventListener("pointerleave", () => (card.style.transform = ""));
    });
    $$(".stack-col").forEach((c) => c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    }));
  }

  /* ---------- princípios abrem no toque (telas sem hover) ---------- */
  $$(".pr").forEach((p) => p.addEventListener("click", () => p.classList.toggle("open")));

  /* ---------- revelar ao rolar ---------- */
  const io = new IntersectionObserver((ens) => ens.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    io.unobserve(en.target);
    if (en.target.classList.contains("stats")) countUp(en.target);
  }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  $$(".rv").forEach((el) => io.observe(el));

  function countUp(root) {
    $$("[data-count]", root).forEach((el) => {
      const end = +el.dataset.count, plus = el.hasAttribute("data-plus");
      const suffix = plus ? "<sup>+</sup>" : "";
      if (reduce) { el.innerHTML = end + suffix; return; }
      const t0 = performance.now(), dur = 1400;
      (function step(now) {
        const k = Math.min(1, (now - t0) / dur);
        el.innerHTML = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* ---------- texto "sobre" acende palavra por palavra ---------- */
  const about = $("#about-text");
  if (about) {
    // embrulha cada palavra mantendo o trecho em itálico
    const wrapWords = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part.trim()) return frag.appendChild(document.createTextNode(part));
            const s = document.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrapWords(n);
      });
    };
    wrapWords(about);
    const ws = $$(".w", about);
    const update = () => {
      const r = about.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const n = Math.round(k * ws.length);
      ws.forEach((w, i) => w.classList.toggle("on", i < n));
    };
    if (reduce) ws.forEach((w) => w.classList.add("on"));
    else { addEventListener("scroll", update, { passive: true }); update(); }
  }

  /* ---------- relógio do rodapé ---------- */
  const clock = $("#clock");
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  };
  tick(); setInterval(tick, 30000);
})();
