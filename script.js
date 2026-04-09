import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-cmSVB4N0GEGeYYm9sg9ouxYDX6Lr-hk",
  authDomain: "wevion.firebaseapp.com",
  projectId: "wevion",
  storageBucket: "wevion.firebasestorage.app",
  messagingSenderId: "908564339000",
  appId: "1:908564339000:web:a48bcd808c078f5ee409cd"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

function hideLoader() {
  const l = document.getElementById("loader");
  if (!l || l.style.display === "none") return;
  l.style.opacity = "0";
  setTimeout(() => l.style.display = "none", 800);
}
setTimeout(hideLoader, 4000);
window.addEventListener("load", () => setTimeout(hideLoader, 400));

(function () {
  const dot  = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top  = my + "px";
  });
  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
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
    if (heroBg) heroBg.style.transform = `scale(1.1) translateY(${y * 0.3}px)`;
    cinBgs.forEach(bg => {
      const section = bg.closest("section");
      if (!section) return;
      bg.style.transform = `scale(1.08) translateY(${section.getBoundingClientRect().top * 0.2}px)`;
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
    entries.forEach(e => {
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

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", function (e) {
    const t = document.querySelector(this.getAttribute("href"));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});

async function renderWork() {
  const container = document.getElementById("work-cards");
  const badge     = document.getElementById("work-count-badge");
  if (!container) return;

  container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.35);padding:40px 0;">Loading projects...</div>`;

  try {
    const snap     = await getDocs(query(collection(db, "wevionProjects"), orderBy("createdAt", "desc")));
    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (badge) badge.textContent = projects.length;
    container.innerHTML = "";

    if (!projects.length) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,255,255,0.35);padding:60px 0;">Projects coming soon</div>`;
      return;
    }

    projects.forEach((p, i) => {
      const card = document.createElement("div");
      card.className      = "work-card reveal";
      card.dataset.delay  = (i * 100);

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
        </div>`;
      container.appendChild(card);
    });

    container.querySelectorAll(".work-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * -5;
        const ry = ((e.clientX - r.left - r.width  / 2) / r.width)  *  5;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-16px) scale(1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform  = "";
        card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), height 0.55s";
      });
      card.addEventListener("mouseenter", () => {
        card.style.transition = "height 0.55s cubic-bezier(0.34,1.1,0.64,1), transform 0s";
      });
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    container.querySelectorAll(".reveal").forEach(c => obs.observe(c));

  } catch (err) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:rgba(255,80,80,0.7);padding:40px 0;">Could not load projects.</div>`;
    console.error(err);
  }
}

async function renderServices() {
  const grid    = document.getElementById("services-grid");
  const emptyEl = document.getElementById("services-empty");
  if (!grid) return;

  try {
    const snap   = await getDocs(query(collection(db, "wevionServices"), orderBy("createdAt", "asc")));
    const services = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!services.length) {
      grid.style.display = "none";
      if (emptyEl) emptyEl.style.display = "";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    grid.style.display = "";
    grid.innerHTML     = "";

    services.forEach((svc, i) => {
      const img  = svc.img || "https://picsum.photos/id/1015/600/380";
      const card = document.createElement("div");
      card.className    = "flip-card reveal";
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
        </div>`;
      grid.appendChild(card);
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    grid.querySelectorAll(".reveal").forEach(c => obs.observe(c));

  } catch (err) {
    if (emptyEl) emptyEl.style.display = "";
    console.error(err);
  }
}

renderWork();
renderServices();
