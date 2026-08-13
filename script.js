/* CEDAR & WOLF — interaction layer */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Enquiry form feedback ---------- */
(() => {
  const form = document.getElementById("enquiry-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  const button = form.querySelector("button[type='submit']");
  const originalButton = button?.innerHTML;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!button || button.disabled) return;

    button.disabled = true;
    button.innerHTML = "Sending Enquiry&hellip;";
    status.hidden = true;
    status.classList.remove("is-visible");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("https://formsubmit.co/ajax/cedarandwolfstudios@gmail.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === "false" || result.success === false) {
        throw new Error("Submission was not accepted");
      }

      form.reset();
      status.textContent = "Thank you. Your enquiry has been sent and I'll be in touch soon.";
    } catch (error) {
      status.innerHTML = 'The form could not send just now. Please email <a href="mailto:cedarandwolfstudios@gmail.com">cedarandwolfstudios@gmail.com</a> or <a href="mailto:tamaramaekhan@gmail.com">tamaramaekhan@gmail.com</a>.';
    } finally {
      window.clearTimeout(timeout);
      status.hidden = false;
      status.classList.add("is-visible");
      button.disabled = false;
      button.innerHTML = originalButton;
    }
  });
})();

/* ---------- Load-in ---------- */
(() => {
  // Trigger entrance animations on the next frame so transitions run.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  });
})();

/* ---------- Magnetic buttons ---------- */
(() => {
  if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.style.transition = "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
})();

/* ---------- Nav: hide on scroll down, raise background ---------- */
(() => {
  const nav = document.getElementById("nav");
  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 300);
    lastY = y;
  }, { passive: true });
})();

/* ---------- Scroll reveals (staggered within groups) ---------- */
(() => {
  // Stagger siblings inside list-like groups, then drop the delay after the
  // entrance so it never slows down hover transitions.
  document.querySelectorAll(".work__grid, .identity__grid, .services__list, .packages__grid, .process__list, .manifesto__foot").forEach((group) => {
    [...group.children].forEach((el, i) => {
      if (el.classList.contains("reveal")) el.style.transitionDelay = `${(i % 6) * 0.09}s`;
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
        setTimeout(() => { entry.target.style.transitionDelay = ""; }, 1400);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
})();

/* ---------- Scroll progress bar ---------- */
(() => {
  const bar = document.getElementById("progressBar");
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

/* ---------- Hero mouse parallax ---------- */
(() => {
  if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;

  const hero = document.querySelector(".hero");
  const orb = document.querySelector(".hero__orb");
  const title = document.querySelector(".hero__title");
  let targetX = 0, targetY = 0, x = 0, y = 0;

  hero.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  hero.addEventListener("mouseleave", () => { targetX = 0; targetY = 0; });

  const render = () => {
    x += (targetX - x) * 0.05;
    y += (targetY - y) * 0.05;
    // `translate` keeps the orb's transform-based drift animation intact
    orb.style.translate = `${x * -30}px ${y * -20}px`;
    title.style.translate = `${x * 12}px ${y * 8}px`;
    requestAnimationFrame(render);
  };
  render();
})();

/* ---------- Manifesto: light up word by word on scroll ---------- */
(() => {
  const el = document.getElementById("manifestoText");
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");
  const spans = el.querySelectorAll(".word");

  const update = () => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(Math.max((vh * 0.85 - rect.top) / (rect.height + vh * 0.4), 0), 1);
    const lit = Math.floor(progress * spans.length);
    spans.forEach((s, i) => s.classList.toggle("is-lit", i < lit));
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ---------- Footer local time ---------- */
(() => {
  const el = document.getElementById("localTime");
  const update = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    el.textContent = `LOCAL — ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };
  update();
  setInterval(update, 1000);
})();
