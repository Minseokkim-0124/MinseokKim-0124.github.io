// A restrained silver-blue energy trail. The system cursor stays visible.
(() => {
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const canvas = document.createElement("canvas");
  canvas.className = "cursor-magic";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }

  const palette = {
    dark: ["210,221,236", "119,152,196", "158,177,204"],
    light: ["58,76,103", "65,102,152", "92,112,140"],
  };
  let enabled = false;
  let frame = 0;
  let previousTime = 0;
  let lastPointer = null;
  let lastEmission = 0;
  let particles = [];
  let ripples = [];
  let width = innerWidth;
  let height = innerHeight;
  const limit = 80;

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    particles = [];
    ripples = [];
    lastPointer = null;
    context.clearRect(0, 0, width, height);
  }
  function updatePreference() {
    enabled = pointer.matches && !reducedMotion.matches;
    canvas.hidden = !enabled;
    stop();
    if (enabled) resize();
  }
  function addParticle(x, y, vx, vy, burst = false) {
    particles.push({
      x,
      y,
      vx,
      vy,
      age: 0,
      life: burst ? 300 + Math.random() * 300 : 240 + Math.random() * 320,
      size: burst ? 0.8 + Math.random() * 1.1 : 0.6 + Math.random() * 0.8,
      length: burst ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
      rotation: Math.atan2(vy, vx),
      color: Math.floor(Math.random() * 3),
    });
    if (particles.length > limit) particles.shift();
  }
  function render(now) {
    const delta = previousTime ? Math.min(now - previousTime, 40) : 16.7;
    const step = delta / 16.7;
    previousTime = now;
    context.clearRect(0, 0, width, height);
    const light = document.documentElement.dataset.theme === "light";
    const colors = palette[light ? "light" : "dark"];
    context.globalCompositeOperation = light ? "source-over" : "lighter";
    particles = particles.filter((p) => p.age < p.life);
    for (const p of particles) {
      p.age += delta;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.vx *= Math.pow(0.98, step);
      p.vy *= Math.pow(0.98, step);
      const fade = Math.pow(Math.max(0, 1 - p.age / p.life), 1.7);
      const alpha = fade * (light ? 0.55 : 0.72);
      const radius = p.size * (0.55 + 0.45 * fade);
      const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
      glow.addColorStop(0, `rgba(${colors[p.color]},${alpha * 0.13})`);
      glow.addColorStop(1, `rgba(${colors[p.color]},0)`);
      context.fillStyle = glow;
      context.fillRect(p.x - radius * 4, p.y - radius * 4, radius * 8, radius * 8);
      context.strokeStyle = `rgba(${colors[p.color]},${alpha})`;
      context.lineWidth = Math.max(0.65, radius * 0.7);
      context.lineCap = "round";
      const tail = p.length * (0.4 + 0.6 * fade);
      context.beginPath();
      context.moveTo(p.x, p.y);
      context.lineTo(p.x - Math.cos(p.rotation) * tail, p.y - Math.sin(p.rotation) * tail);
      context.stroke();
    }
    ripples = ripples.filter((r) => r.age < 300);
    for (const r of ripples) {
      r.age += delta;
      const progress = Math.min(r.age / 300, 1);
      context.strokeStyle = `rgba(${colors[0]},${0.18 * (1 - progress)})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(r.x, r.y, 5 + 22 * progress, 0, Math.PI * 2);
      context.stroke();
    }
    context.globalCompositeOperation = "source-over";
    if (particles.length || ripples.length) frame = requestAnimationFrame(render);
    else {
      frame = 0;
      previousTime = 0;
      context.clearRect(0, 0, width, height);
    }
  }
  function start() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function mayAnimate(event) {
    return enabled && event.pointerType === "mouse" && !document.hidden && !document.querySelector("dialog[open]");
  }
  document.addEventListener(
    "pointermove",
    (event) => {
      if (!mayAnimate(event)) return;
      const now = performance.now();
      const next = { x: event.clientX, y: event.clientY };
      if (!lastPointer) {
        lastPointer = next;
        lastEmission = now;
        return;
      }
      if (now - lastEmission < 14) return;
      const dx = next.x - lastPointer.x,
        dy = next.y - lastPointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) return;
      // Do not draw a long streak when re-entering after a pause or scroll.
      const discontinuity = distance > 180 || now - lastEmission > 160;
      const count = discontinuity ? 2 : Math.min(4, Math.ceil(distance / 9));
      for (let i = 0; i < count; i++) {
        const t = discontinuity ? 1 : (i + 1) / count;
        const x = lastPointer.x + dx * t + (Math.random() - 0.5) * 4;
        const y = lastPointer.y + dy * t + (Math.random() - 0.5) * 4;
        addParticle(x, y, (Math.random() - 0.5) * 0.9 - (dx / distance) * 0.35, (Math.random() - 0.5) * 0.9 - (dy / distance) * 0.35);
      }
      lastPointer = next;
      lastEmission = now;
      start();
    },
    { passive: true }
  );
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!mayAnimate(event) || event.button !== 0) return;
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.2;
        const speed = 0.7 + Math.random() * 1.4;
        addParticle(event.clientX, event.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed, true);
      }
      ripples.push({ x: event.clientX, y: event.clientY, age: 0 });
      if (ripples.length > 4) ripples.shift();
      start();
    },
    { passive: true }
  );
  document.documentElement.addEventListener("pointerleave", stop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  window.addEventListener("blur", stop);
  window.addEventListener("scroll", stop, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      stop();
      if (enabled) resize();
    },
    { passive: true }
  );
  pointer.addEventListener("change", updatePreference);
  reducedMotion.addEventListener("change", updatePreference);
  updatePreference();
})();
