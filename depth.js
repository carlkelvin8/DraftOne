(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const control = document.querySelector('.motion-toggle, .draft-two-motion');
  const stage = document.querySelector('.family-preparation, .routine-guide');
  const track = document.createElement('div');
  track.className = 'depth-track';
  stage.before(track);
  track.append(stage);
  stage.classList.add('depth-stage');
  const picture = stage.querySelector('.preparation-photo, .routine-image');
  const wordHeadings = [...document.querySelectorAll('.added-section h2, .getting-started h2')];
  const words = [];
  for (const heading of wordHeadings) {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part.trim()) {
          fragment.append(document.createTextNode(part));
          continue;
        }
        const span = document.createElement('span');
        span.className = 'depth-word';
        span.textContent = part;
        words.push(span);
        fragment.append(span);
      }
      node.replaceWith(fragment);
    }
  }
  const items = [...document.querySelectorAll('.preferences-grid article, .preparation-list li')];
  const curtains = [...document.querySelectorAll('.family-questions, .questions')];
  const footer = document.querySelector('footer');
  const limit = value => Math.min(1, Math.max(0, value));
  let running = false;
  let active = false;

  function draw() {
    running = false;
    if (!active) return;
    const top = document.querySelector('header').offsetHeight + 44;
    document.body.style.setProperty('--depth-top', top + 'px');
    const progress = limit((top - track.getBoundingClientRect().top) / Math.max(1, track.offsetHeight - innerHeight + top));
    stage.style.setProperty('--depth-turn', (18 - progress * 30) + 'deg');
    stage.style.setProperty('--depth-y', (45 - progress * 85) + 'px');
    stage.style.setProperty('--depth-scale', .84 + progress * .16);
    stage.style.setProperty('--image-scale', 1.18 - progress * .13);
    stage.style.setProperty('--copy-y', (30 - progress * 60) + 'px');
    for (const heading of wordHeadings) {
      const reveal = limit((innerHeight - heading.getBoundingClientRect().top) / (innerHeight * .65));
      const spans = [...heading.querySelectorAll('.depth-word')];
      spans.forEach((word, index) => {
        const amount = limit(reveal * 2 - index / spans.length);
        word.style.setProperty('--word-opacity', .18 + amount * .82);
        word.style.setProperty('--word-y', (1 - amount) * 35 + 'px');
      });
    }
    for (const item of items) {
      const rect = item.parentElement.getBoundingClientRect();
      const index = [...item.parentElement.children].indexOf(item);
      const reveal = limit((innerHeight - rect.top - index * 65) / (innerHeight * .65));
      item.style.setProperty('--item-opacity', .2 + reveal * .8);
      item.style.setProperty('--item-y', (1 - reveal) * 65 + 'px');
      item.style.setProperty('--item-angle', (1 - reveal) * -25 + 'deg');
    }
    for (const section of curtains) {
      const reveal = limit((innerHeight - section.getBoundingClientRect().top) / (innerHeight * .6));
      section.style.setProperty('--section-inset', (1 - reveal) * 7 + '%');
      section.style.setProperty('--section-round', (1 - reveal) * 90 + 'px');
    }
    const footerProgress = limit((innerHeight - footer.getBoundingClientRect().top) / innerHeight);
    footer.style.setProperty('--footer-turn', footerProgress * 180 + 'deg');
  }

  function requestDraw() {
    if (running) return;
    running = true;
    requestAnimationFrame(draw);
  }

  function syncMotion() {
    active = !preference.matches && control.getAttribute('aria-pressed') === 'true';
    document.body.classList.toggle('depth-enabled', active);
    if (!active) {
      for (const element of [stage, picture, ...words, ...items, ...curtains, footer]) {
        for (const name of [...element.style]) {
          if (/^--(depth-|image-scale|copy-y|pointer-|word-|item-|section-|footer-)/.test(name)) element.style.removeProperty(name);
        }
      }
    }
    requestDraw();
  }

  picture.addEventListener('pointermove', event => {
    if (!active || event.pointerType !== 'mouse') return;
    const bounds = stage.getBoundingClientRect();
    picture.style.setProperty('--pointer-turn', ((event.clientX - bounds.left) / bounds.width - .5) * 10 + 'deg');
    picture.style.setProperty('--pointer-pitch', -((event.clientY - bounds.top) / bounds.height - .5) * 8 + 'deg');
  });
  picture.addEventListener('pointerleave', () => {
    picture.style.setProperty('--pointer-turn', '0deg');
    picture.style.setProperty('--pointer-pitch', '0deg');
  });
  new MutationObserver(syncMotion).observe(control, { attributes: true, attributeFilter: ['aria-pressed'] });
  preference.addEventListener('change', syncMotion);
  addEventListener('scroll', requestDraw, { passive: true });
  addEventListener('resize', requestDraw);
  document.fonts.ready.then(requestDraw);
  syncMotion();
})();
