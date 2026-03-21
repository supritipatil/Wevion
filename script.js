/* ═══════════════════════════════════════
   WEVION — Premium Script v3.0
   ═══════════════════════════════════════ */

// ── LOADER ──
function hideLoader() {
  const loader = document.getElementById("loader");
  if (!loader || loader.style.display === "none") return;
  loader.style.opacity = "0";
  loader.style.visibility = "hidden";
  setTimeout(() => loader.style.display = "none", 800);
}
// Force hide after 2s regardless of slow/missing images
setTimeout(hideLoader, 2000);
// Hide early if everything loads fast
window.addEventListener("load", () => setTimeout(hideLoader, 400));

// ── PARTICLE NETWORK ──
(function () {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  const COUNT = 70;
  let mouseX = -1000, mouseY = -1000;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r = Math.random() * 1.6 + 0.3;
      this.alpha = Math.random() * 0.35 + 0.08;
      this.color = ["124,58,237","167,139,250","34,211,238","232,121,249"][Math.floor(Math.random()*4)];
    }
    update() {
      const dx = mouseX - this.x, dy = mouseY - this.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 200 && dist > 0) { this.vx += dx/dist*0.012; this.vy += dy/dist*0.012; }
      this.vx *= 0.999; this.vy *= 0.999;
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(${this.color},${this.alpha})`; ctx.fill(); }
  }
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 130) { ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(124,58,237,${0.06*(1-dist/130)})`; ctx.lineWidth=0.5; ctx.stroke(); }
      }
    }
  }
  function animate() { ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); drawLines(); requestAnimationFrame(animate); }
  animate();
})();

// ── CURSOR ──
(function () {
  const glow = document.querySelector(".cursor-glow");
  const cursor = document.querySelector(".custom-cursor");
  const ring = document.querySelector(".cursor-ring");
  if (!cursor) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove", e => {
    mx=e.clientX; my=e.clientY;
    glow.style.left=mx+"px"; glow.style.top=my+"px";
    cursor.style.left=mx+"px"; cursor.style.top=my+"px";
  });
  function animRing() { rx+=(mx-rx)*.1; ry+=(my-ry)*.1; ring.style.left=rx+"px"; ring.style.top=ry+"px"; requestAnimationFrame(animRing); }
  animRing();
  document.querySelectorAll("a,button,.tilt-card,.work-card,.contact-card,.magnetic-btn").forEach(el => {
    el.addEventListener("mouseenter",()=>cursor.classList.add("hovering"));
    el.addEventListener("mouseleave",()=>cursor.classList.remove("hovering"));
  });
})();

// ── HERO SPOTLIGHT ──
(function(){
  const hero = document.querySelector(".hero");
  const spot = document.getElementById("hero-spotlight");
  if (!hero || !spot) return;
  hero.addEventListener("mousemove", e => {
    const rect = hero.getBoundingClientRect();
    spot.style.left = (e.clientX - rect.left) + "px";
    spot.style.top  = (e.clientY - rect.top)  + "px";
  });
})();

// ── NAVBAR ──
window.addEventListener("scroll", () => {
  document.querySelector(".navbar")?.classList.toggle("scrolled", window.scrollY > 60);
});

// ── MOBILE MENU ──
(function(){
  const ham = document.getElementById("hamburger");
  const nav = document.getElementById("mobile-nav");
  if (!ham||!nav) return;
  ham.addEventListener("click",()=>{
    ham.classList.toggle("active"); nav.classList.toggle("active");
    document.body.style.overflow = nav.classList.contains("active")?"hidden":"";
  });
  nav.querySelectorAll("a").forEach(l=>l.addEventListener("click",()=>{
    ham.classList.remove("active"); nav.classList.remove("active"); document.body.style.overflow="";
  }));
})();

// ── SPLIT TEXT ──
(function(){
  document.querySelectorAll(".split-text").forEach(el => {
    const text = el.textContent;
    el.textContent = "";
    const isLine2 = el.classList.contains("line2");
    const base = isLine2 ? 0.7 : 0.3;
    text.split("").forEach((ch,i) => {
      const s = document.createElement("span");
      s.className = "char";
      s.textContent = ch===" " ? "\u00A0" : ch;
      s.style.animationDelay = (base + i*0.045)+"s";
      s.style.background = "inherit";
      s.style.webkitBackgroundClip = "text";
      s.style.backgroundClip = "text";
      s.style.color = "transparent";
      el.appendChild(s);
    });
  });
})();

// ── SCROLL REVEAL ──
(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(()=>e.target.classList.add("visible"), e.target.dataset.delay||0);
        obs.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll(".reveal,.reveal-card").forEach((el,i)=>{
    if (el.classList.contains("reveal-card")) el.dataset.delay=(i%3)*150;
    obs.observe(el);
  });
})();

// ── COUNTER ──
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, target=parseInt(el.dataset.count), dur=2000, start=performance.now();
      function tick(now){
        const p=Math.min((now-start)/dur,1), eased=1-Math.pow(1-p,3), cur=Math.round(eased*target);
        if(target===100) el.textContent=cur+"%";
        else if(target===2026) el.textContent=cur.toLocaleString();
        else el.textContent=cur+"+";
        if(p<1) requestAnimationFrame(tick);
        else el.textContent=target===100?"100%":target===2026?"2026":target+"+";
      }
      requestAnimationFrame(tick); obs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll(".stat-number[data-count]").forEach(el=>obs.observe(el));
})();

// ── TILT CARDS ──
(function(){
  document.querySelectorAll(".tilt-card").forEach(card=>{
    const glare=card.querySelector(".card-glare");
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      const rx2=((y-r.height/2)/r.height)*-10, ry2=((x-r.width/2)/r.width)*10;
      card.style.transform=`perspective(900px) rotateX(${rx2}deg) rotateY(${ry2}deg) scale(1.02)`;
      if(glare) { glare.style.background=`radial-gradient(circle at ${x}px ${y}px,rgba(255,255,255,0.07),transparent 60%)`; glare.style.opacity="1"; }
    });
    card.addEventListener("mouseleave",()=>{
      card.style.transform="perspective(900px) rotateX(0) rotateY(0) scale(1)";
      card.style.transition="transform .5s cubic-bezier(0.22,0.61,0.36,1)";
      if(glare) glare.style.opacity="0";
    });
    card.addEventListener("mouseenter",()=>{ card.style.transition="none"; });
  });
})();

// ── MAGNETIC BUTTONS ──
(function(){
  document.querySelectorAll(".magnetic-btn").forEach(btn=>{
    btn.addEventListener("mousemove",e=>{
      const r=btn.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
      btn.style.transform=`translate(${x*.18}px,${y*.18}px)`;
    });
    btn.addEventListener("mouseleave",()=>{ btn.style.transform="translate(0,0)"; btn.style.transition="transform .4s cubic-bezier(0.22,0.61,0.36,1)"; });
    btn.addEventListener("mouseenter",()=>{ btn.style.transition="none"; });
    btn.addEventListener("click",function(e){
      const rip=document.createElement("span"); rip.className="ripple";
      const r=this.getBoundingClientRect(), size=Math.max(r.width,r.height);
      rip.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      this.appendChild(rip); setTimeout(()=>rip.remove(),600);
    });
  });
})();

// ── PARALLAX ──
(function(){
  const glows = document.querySelectorAll(".hero-glow-1,.hero-glow-2,.hero-glow-3");
  const shapes = document.querySelectorAll(".floating");
  window.addEventListener("scroll",()=>{
    const sc = window.scrollY;
    if(sc>window.innerHeight) return;
    glows.forEach((g,i)=>{ g.style.transform=`translateY(${sc*[.15,.1,.08][i]}px)`; });
    shapes.forEach((s,i)=>{ s.style.transform=`translateY(${sc*(0.05+i*.02)}px)`; });
  });
})();

// ── WORK CARDS ──
let projects = JSON.parse(localStorage.getItem("wevionProjects")) || [
  {
    title:"Darpan Enterprises",
    desc:"Expert Electronics & Electrical Repair Services in Chinchwad — full service website with contact integration, service listings & modern UI.",
    img:"https://picsum.photos/id/442/600/380",
    link:"https://darpaneneterprises.netlify.app/"
  },
  {
    title:"Vrundhavan Collection",
    desc:"Elegant saree & accessories e-catalogue with admin panel, category management and WhatsApp order integration.",
    img:"vrundhavan_collection.jpeg",
    link:""
  },
  {
    title:"Wedding Digital Card",
    desc:"A beautiful animated digital wedding invitation with RSVP, location map, music & shareable link — designed for modern couples.",
    img:"card1.png",
    link:""
  },
  {
    title:"Business Website",
    desc:"Corporate site for a fintech startup with smooth scroll animations & live stats dashboard.",
    img:"https://picsum.photos/id/1015/600/380",
    link:""
  },
  {
    title:"Wevion Logo Design",
    desc:"Signature logo and brand identity for Wevion — rocket + cursor icon with blue-to-pink gradient. Crafted with precision.",
    img:"wevion_logo_dark.png",
    link:""
  },
  {
    title:"Digital Business Card",
    desc:"Interactive digital visiting card with shareable link, music & smooth animations — impress in one tap.",
    img:"https://picsum.photos/id/237/600/380",
    link:""
  }
];

function renderWork() {
  const container = document.getElementById("work-cards");
  const badge = document.getElementById("work-count-badge");
  if (!container) return;
  container.innerHTML = "";
  if (badge) badge.textContent = projects.length;

  projects.forEach((proj, i) => {
    const card = document.createElement("div");
    card.className = "work-card reveal-card";
    card.style.transitionDelay = (i * 100) + "ms";
    card.innerHTML = `
      <img src="${proj.img}" alt="${proj.title}" class="project-img" onerror="this.src='https://picsum.photos/id/1015/600/380'">
      <div class="work-card-overlay">
        <h3>${proj.title}</h3>
        <p>${proj.desc}</p>
        ${proj.link ? `<a href="${proj.link}" target="_blank" class="visit-btn" onclick="event.stopPropagation()">Visit Site →</a>` : ""}
      </div>`;
    container.appendChild(card);
  });

  // Tilt on work cards
  container.querySelectorAll(".work-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx2 = ((y - r.height/2)/r.height) * -5;
      const ry2 = ((x - r.width/2)/r.width) * 5;
      card.style.transform = `perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-10px) scale(1.01)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform .5s cubic-bezier(0.22,0.61,0.36,1)";
    });
    card.addEventListener("mouseenter", () => card.style.transition = "none");
  });

  // Re-observe
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); } });
  },{threshold:.08});
  container.querySelectorAll(".reveal-card").forEach(c=>obs.observe(c));
}
renderWork();

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click",function(e){
    const t=document.querySelector(this.getAttribute("href"));
    if(t){e.preventDefault();t.scrollIntoView({behavior:"smooth",block:"start"});}
  });
});

// ── WHATSAPP FALLBACK ──
function sendWhatsApp(event){
  event.preventDefault();
  const name=document.getElementById("name")?.value||"";
  const email=document.getElementById("email")?.value||"";
  const message=document.getElementById("message")?.value||"";
  window.open("https://wa.me/917768989575?text="+encodeURIComponent("Name: "+name+"\nEmail: "+email+"\nProject: "+message),"_blank");
}

// ── GLOWING SECTION HEADINGS on scroll ──
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.style.textShadow="0 0 80px rgba(124,58,237,0.25)";
      else e.target.style.textShadow="none";
    });
  },{threshold:.5});
  document.querySelectorAll(".section h2").forEach(h=>obs.observe(h));
})();