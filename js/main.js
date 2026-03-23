/* =====================================================
   DR. FÁBIO FAGGIONE – MAIN JS
   ===================================================== */

/* --- AOS Init --- */
AOS.init({ once: true, offset: 60, duration: 750 });

/* --- Header scroll --- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

/* --- Hamburger / Mobile nav --- */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});
nav.querySelectorAll('.nav__link, .btn--nav').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* --- Smooth scroll for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* --- Swipers --- */
new Swiper('.antesdepois-swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 24,
  navigation: {
    nextEl: '.antesdepois-swiper .swiper-button-next',
    prevEl: '.antesdepois-swiper .swiper-button-prev',
  },
  pagination: { el: '.antesdepois-swiper .swiper-pagination', clickable: true },
  breakpoints: {
    768: { slidesPerView: 1 },
    992: { slidesPerView: 1 },
  },
});

new Swiper('.depo-swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 24,
  autoplay: { delay: 5000, disableOnInteraction: false },
  pagination: { el: '.depo-swiper .swiper-pagination', clickable: true },
  breakpoints: {
    640:  { slidesPerView: 1 },
    900:  { slidesPerView: 2 },
    1100: { slidesPerView: 3 },
  },
});

/* --- FAQ Accordion --- */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item  = btn.closest('.faq-item');
    const body  = item.querySelector('.faq-item__a');
    const open  = item.classList.contains('active');

    // close all
    document.querySelectorAll('.faq-item.active').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-item__a').style.maxHeight = null;
      i.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
    });

    if (!open) {
      item.classList.add('active');
      body.style.maxHeight = body.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* --- Counter animation --- */
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.getAttribute('data-target');
    const step   = target / 60;
    let current  = 0;
    const tick = () => {
      current += step;
      if (current < target) {
        el.textContent = Math.ceil(current);
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* --- Lead Form --- */
const form = document.getElementById('leadForm');
if (form) {
  // WhatsApp mask
  const waInput = document.getElementById('whatsapp');
  waInput.addEventListener('input', () => {
    let v = waInput.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    waInput.value = v;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const nome   = form.nome.value.trim();
    const wa     = form.whatsapp.value.trim();
    const cidade = form.cidade.value.trim();
    const lgpd   = form.lgpd.checked;

    if (!nome || !wa || !cidade || !lgpd) {
      showAlert('Por favor, preencha todos os campos e aceite o termo de contato.', 'error');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    // WhatsApp redirect as lead capture
    const msg = encodeURIComponent(
      `Olá Dr. Fábio! Me chamo ${nome}, sou de ${cidade} e gostaria de agendar minha avaliação gratuita. Meu WhatsApp: ${wa}`
    );

    setTimeout(() => {
      showAlert('Ótimo! Redirecionando para o WhatsApp...', 'success');
      setTimeout(() => {
        window.open(`https://wa.me/5517997927094?text=${msg}`, '_blank');
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Agendar minha avaliação';
      }, 1200);
    }, 700);
  });
}

function showAlert(msg, type) {
  const old = document.querySelector('.form-alert');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = `form-alert form-alert--${type}`;
  el.style.cssText = `
    padding: 12px 16px; border-radius: 10px; font-size: .85rem;
    font-family: var(--font1); font-weight: 600; margin-top: 12px;
    background: ${type === 'success' ? '#D1FAE5' : '#FEE2E2'};
    color: ${type === 'success' ? '#065F46' : '#991B1B'};
    border: 1px solid ${type === 'success' ? '#A7F3D0' : '#FECACA'};
    text-align: center;
  `;
  el.textContent = msg;
  document.getElementById('leadForm').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/* --- Lazy load placeholder images with gradient fallback --- */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function () {
    // Create a nice gradient placeholder instead of broken image
    const wrap = this.closest('.hero__bg, .caso-img, .aparelho-card__img, .sobre__img-wrap, .galeria__item, .depo-card__author');
    if (!this.classList.contains('logo__img')) {
      this.style.opacity = '0';
      if (this.parentElement) {
        this.parentElement.style.background = 'linear-gradient(135deg, #1E2A45 0%, #0057D8 100%)';
      }
    }
  });
});
