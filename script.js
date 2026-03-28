function hideLoader() {
  const l = document.getElementById("loader");
  if (!l || l.style.display === "none") return;
  l.style.opacity = "0";
  setTimeout(() => l.style.display = "none", 800);
}
setTimeout(hideLoader, 2200);
window.addEventListener("load", () => setTimeout(hideLoader, 400));
(function () {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });
  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll("a, button, .flip-card, .work-card, .contact-card").forEach(el => {
    el.addEventListener("mouseenter", () => dot.classList.add("big"));
    el.addEventListener("mouseleave", () => dot.classList.remove("big"));
  });
})();
window.addEventListener("scroll", () => {
  document.querySelector(".navbar")?.classList.toggle("scrolled", window.scrollY > 60);
});
(function () {
  const heroBg = document.getElementById("hero-bg");
  const cinBgs = document.querySelectorAll(".cin-bg");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (heroBg) {
      heroBg.style.transform = `scale(1.1) translateY(${y * 0.3}px)`;
    }

    cinBgs.forEach(bg => {
      const section = bg.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const offset = rect.top * 0.2;
      bg.style.transform = `scale(1.08) translateY(${offset}px)`;
    });
  });
})();
(function () {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    btn.classList.toggle("on");
    nav.classList.toggle("on");
    document.body.style.overflow = nav.classList.contains("on") ? "hidden" : "";
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      btn.classList.remove("on");
      nav.classList.remove("on");
      document.body.style.overflow = "";
    });
  });
})();
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), e.target.dataset.delay || 0);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.dataset.delay = (i % 4) * 100;
    obs.observe(el);
  });
})();
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const start = performance.now();
      const dur = 2000;
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const cur = Math.round(ease * target);
        if (target === 100) el.textContent = cur + "%";
        else if (target === 2026) el.textContent = cur;
        else el.textContent = cur + "+";
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target === 100 ? "100%" : target === 2026 ? "2026" : target + "+";
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-num[data-count]").forEach(el => obs.observe(el));
})();
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function (e) {
    const t = document.querySelector(this.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});
function renderWork() {
  const container = document.getElementById("work-cards");
  const badge = document.getElementById("work-count-badge");
  if (!container) return;
  const projects = JSON.parse(localStorage.getItem("wevionProjects") || "[]");
  if (badge) badge.textContent = projects.length;
  container.innerHTML = "";
  if (!projects.length) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.35);padding:60px 0;">
      Projects coming soon — add them via Admin Panel
    </div>`;
    return;
  }
  projects.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "work-card reveal";
    card.style.transitionDelay = (i * 100) + "ms";
    card.dataset.delay = (i * 100);
    const img = p.img || "https://picsum.photos/id/1015/600/380";
    const tag = p.tag || "Project";
    card.innerHTML = `
      <img src="${img}" alt="${p.title}" onerror="this.src='https://picsum.photos/id/1015/600/380'">
      <div class="work-card-overlay">
        <h3>${p.title}</h3>
        <div class="work-card-desc">${p.desc}</div>
        <div class="work-card-footer">
          <span class="work-card-tag">${tag}</span>
          ${p.link
        ? `<a href="${p.link}" target="_blank" class="visit-btn" onclick="event.stopPropagation()">Visit Site →</a>`
        : `<span class="preview-trigger">Private Project</span>`
      }
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  container.querySelectorAll(".work-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y - r.height / 2) / r.height) * -5;
      const ry = ((x - r.width / 2) / r.width) * 5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-16px) scale(1.02)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), height 0.55s cubic-bezier(0.34,1.1,0.64,1)";
    });
    card.addEventListener("mouseenter", () => {
      card.style.transition = "height 0.55s cubic-bezier(0.34,1.1,0.64,1), transform 0s";
    });
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  container.querySelectorAll(".reveal").forEach(c => obs.observe(c));
}

renderWork();
function renderServices() {
  const grid = document.getElementById("services-grid");
  const emptyEl = document.getElementById("services-empty");
  if (!grid) return;
  const saved = JSON.parse(localStorage.getItem("wevionServices") || "[]");
  if (!saved.length) {
    grid.style.display = "none";
    if (emptyEl) emptyEl.style.display = "";
    return;
  }

  if (emptyEl) emptyEl.style.display = "none";
  grid.style.display = "";
  grid.innerHTML = "";
  saved.forEach((svc, i) => {
    const img = svc.img || "https://picsum.photos/id/1015/600/380";
    const card = document.createElement("div");
    card.className = "flip-card reveal";
    card.dataset.delay = (i * 120);
    card.innerHTML = `
      <div class="flip-inner">
        <div class="flip-front">
          <div class="flip-front-img">
            <img src="${img}" alt="${svc.title}" onerror="this.src='https://picsum.photos/id/1015/600/380'">
          </div>
          <div class="card-icon">${svc.icon || "⚡"}</div>
          <h3>${svc.title}</h3>
          <div class="flip-hint">Hover to explore ↗</div>
        </div>
        <div class="flip-back">
          <div class="flip-back-icon">${svc.icon || "⚡"}</div>
          <h3>${svc.title}</h3>
          <p>${svc.desc}</p>
          <span class="card-tag">${svc.tag || "Service"}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  grid.querySelectorAll(".reveal").forEach(c => obs.observe(c));
}

renderServices();
