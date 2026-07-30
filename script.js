// Registramos GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ── 1. SMOOTH SCROLL (LENIS) ──
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing elegante
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false, // Touch is native
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sincronizar Lenis con ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0, 0);


// ── 2. LOADER ELEGANTE ──
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader && !loader.classList.contains('fade-out')) {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.style.display = 'none';
      initHeroAnimations();
    }, 800);
  } else if (!loader) {
    initHeroAnimations();
  }
}

window.addEventListener('load', () => {
  setTimeout(hideLoader, 800);
});

// Fallback de seguridad: si tarda mucho en cargar (ej. en celular con red lenta), forzamos quitar el loader.
setTimeout(hideLoader, 3500);


// ── 3. CURSOR MAGNÉTICO ──
const cursor = document.getElementById('custom-cursor');
let mouseX = 0; let mouseY = 0;
let cursorX = 0; let cursorY = 0;

// Update mouse coords
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animar cursor asíncronamente
function loopCursor() {
  const speed = 0.15; // Suavidad del seguimiento
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(loopCursor);
}
if(window.innerWidth > 768) { loopCursor(); }

// Expandir cursor en hovers
document.querySelectorAll('.hover-target, button, a').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});
// Hacer cursor text-like en inputs
document.querySelectorAll('.hover-text-input').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering-text'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering-text'));
});


// ── 4. NAVBAR STICKY ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


// ── 5. ANIMACIONES GSAP ──
function initHeroAnimations() {
  const tl = gsap.timeline();
  
  // Animar "Alta Reposteria..." palabra por palabra hacia arriba
  tl.to('.gs-title-word', {
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
  });

  // Animar titulo principal
  tl.fromTo('#hero-title', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
    "-=0.5"
  );

  // Aparecer botones
  tl.to('#hero-actions', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out"
  }, "-=1");
}

// Fade Ups generales on Scroll
const isMobile = window.innerWidth <= 768;

gsap.utils.toArray('.gs-fade-up').forEach(element => {
  gsap.fromTo(element, 
    { opacity: 0, y: isMobile ? 30 : 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: isMobile ? "top 98%" : "top 85%", // Dispara mucho antes en celular
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Forzar refresco de GSAP en celulares
window.addEventListener('resize', () => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());

// Parallax Images (Nosotros y Galeria)
gsap.utils.toArray('.gs-parallax-img').forEach(img => {
  gsap.to(img, {
    y: "10%", // Must be opposite of initial CSS
    ease: "none",
    scrollTrigger: {
      trigger: img.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

gsap.utils.toArray('.gs-parallax-gal').forEach(img => {
  gsap.to(img, {
    y: "10%",
    ease: "none",
    scrollTrigger: {
      trigger: img.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

// Hero Parallax Subtlety
gsap.to('.parallax-hero', {
  y: "15%",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});


// ── 6. EXPERIENCE (BEFORE/AFTER SLIDER) ──
const sliderContainer = document.getElementById('slider-container');
const sliderHandle = document.getElementById('slider-handle');
const sliderBefore = document.getElementById('slider-before');
const sliderOverlay = document.getElementById('slider-overlay');

let isDragging = false;

function updateSlider(e) {
  if (!isDragging) return;
  
  const rect = sliderContainer.getBoundingClientRect();
  // Get x position relative to container
  let x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  
  // Limites
  if (x < 0) x = 0;
  if (x > rect.width) x = rect.width;
  
  const percentage = (x / rect.width) * 100;
  
  sliderHandle.style.left = `${percentage}%`;
  // Corta la imagen del "Antes" dinámicamente
  sliderBefore.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
}

if(sliderOverlay) {
  sliderOverlay.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e); });
  sliderOverlay.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e); });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('mousemove', updateSlider);
  window.addEventListener('touchmove', updateSlider);
}


// ── 7. MOBIL NAV ──
function toggleNav() {
  const navLinks = document.getElementById('nav-links');
  if (navLinks) { navLinks.classList.toggle('open'); }
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    const navLinks = document.getElementById('nav-links');
    if (navLinks) { navLinks.classList.remove('open'); }
  });
});


// ── 8. FORM TO WHATSAPP SUBMISSION ──
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    
    if (btn) {
      btn.textContent = 'Redirigiendo a WhatsApp...';
      btn.style.opacity = '0.7';
      
      // Recolectar variables del formulario
      const nombre = document.getElementById('nombre').value;
      const telefono = document.getElementById('telefono').value;
      const selectEvento = document.getElementById('tipoEvento');
      const evento = selectEvento.options[selectEvento.selectedIndex].text;
      const fecha = document.getElementById('fecha').value;
      const detalles = document.getElementById('detalles').value;

      // Estructurar el mensaje
      const mensaje = `Hola *Dulces Momentos* 🍨, vengo de su página web y deseo agendar.\n\n*Mi Nombre:* ${nombre}\n*Teléfono:* ${telefono}\n*Naturaleza del Evento:* ${evento}\n*Fecha Deseada:* ${fecha}\n*Detalles extra:* ${detalles || 'Ninguno en particular'}\n\nQuedo a la espera de su amable seguimiento.`;

      // Número principal de atención
      const numeroAtencion = '525516996751';
      const waUrl = `https://wa.me/${numeroAtencion}?text=${encodeURIComponent(mensaje)}`;

      setTimeout(() => {
        window.open(waUrl, '_blank'); // Abre WhatsApp en nueva pestaña
        
        btn.textContent = 'Redirección Exitosa';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--charcoal)';
        btn.style.borderColor = 'var(--charcoal)';
        btn.style.opacity = '1';
        form.reset();
        
        // Regresa el botón a normal después de 5s
        setTimeout(() => {
           btn.style = '';
           btn.textContent = 'Asegurar Fecha';
        }, 5000);
      }, 500);
    }
  });
}

// ── 9. HERO SPARKLES (PARTICLE SYSTEM) ──
const canvas = document.getElementById('hero-particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 40;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 1;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? '#FADADD' : '#E8A0A8'; // Blush or Accent
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      if (Math.random() > 0.5) {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      } else {
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
