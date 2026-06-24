// Smooth interactive portfolio effects
(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Inject small helper styles
  const style = document.createElement("style");
  style.textContent = `
    html { scroll-behavior: smooth; }
    .js-reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .7s ease, transform .7s ease;
    }
    .js-reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      z-index: 9999;
      background: linear-gradient(90deg, #14b8a6, #6366f1, #f43f5e);
      transition: width .08s linear;
    }
    .cursor-glow {
      position: fixed;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      opacity: .22;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(99,102,241,.55), transparent 65%);
      mix-blend-mode: screen;
    }
    .nav-active {
      color: #14b8a6 !important;
    }
  `;
  document.head.appendChild(style);

  // Scroll progress
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = height > 0 ? (scrollTop / height) * 100 : 0;
    progress.style.width = `${percentage}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  // Reveal sections/cards on scroll
  const revealTargets = document.querySelectorAll(
    "section, .project, .project-card, .card, .skill, .experience, .timeline-item"
  );

  revealTargets.forEach((element) => {
    element.classList.add("js-reveal");
  });

  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  // Active nav link while scrolling
  const sections = [...document.querySelectorAll("section[id]")];
  const navLinks = [...document.querySelectorAll('nav a[href^="#"], header a[href^="#"]')];

  const setActiveNav = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("nav-active", isActive);
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // Magnetic buttons/links
  const magneticItems = document.querySelectorAll(
    "button, .btn, .button, .cta, nav a, .social a"
  );

  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      if (prefersReducedMotion) return;

      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translate(0, 0)";
    });
  });

  // Project/card tilt effect
  const tiltCards = document.querySelectorAll(
    ".project, .project-card, .card"
  );

  tiltCards.forEach((card) => {
    card.style.transformStyle = "preserve-3d";
    card.style.transition = "transform .2s ease, box-shadow .2s ease";

    card.addEventListener("mousemove", (event) => {
      if (prefersReducedMotion) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((0.5 - y / rect.height)) * 8;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.boxShadow = "0 18px 45px rgba(0, 0, 0, .18)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
      card.style.boxShadow = "";
    });
  });

  // Cursor glow
  if (!prefersReducedMotion && window.innerWidth > 768) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    const animateGlow = () => {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;

      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;

      requestAnimationFrame(animateGlow);
    };

    animateGlow();
  }

  // Typing effect for hero title if present
  const heroTitle = document.querySelector(".hero h1, #home h1, h1");

  if (heroTitle && !prefersReducedMotion) {
    const text = heroTitle.textContent.trim();

    if (text.length > 0 && text.length < 80) {
      heroTitle.textContent = "";

      [...text].forEach((char, index) => {
        setTimeout(() => {
          heroTitle.textContent += char;
        }, index * 45);
      });
    }
  }
})();
