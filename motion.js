const motionButton = document.querySelector('.motion-toggle');
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
const openingTrack = document.querySelector('.opening-track');
const storyTrack = document.querySelector('.story-track');
const opening = document.querySelector('.opening');
const album = document.querySelector('.album');
const openingCopy = document.querySelector('.opening-copy');
const serviceCards = [...document.querySelectorAll('.servicegrid article')];
const steps = [...document.querySelectorAll('.visit-steps li')];
let enabled = !systemMotion.matches;
let scheduled = false;
let lastScene = -1;
const clamp = value => Math.min(1, Math.max(0, value));

for (const heading of document.querySelectorAll('.opening h1, .intro h2, #approach h2, .visit-intro h2, .check-in h2')) {
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
      const mask = document.createElement('span');
      mask.className = 'word-mask';
      const word = document.createElement('span');
      word.textContent = part;
      mask.append(word);
      fragment.append(mask);
    }
    node.replaceWith(fragment);
  }
}
const headings = [...document.querySelectorAll('h1, .intro h2, #approach h2, .visit-intro h2, .check-in h2')];

function renderMotion() {
  scheduled = false;
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.transform = 'scaleX(' + clamp(scrollY / Math.max(1, scrollable)) + ')';
  if (!enabled) return;
  const headerHeight = document.querySelector('header').offsetHeight + 44;
  const openingProgress = clamp((headerHeight - openingTrack.getBoundingClientRect().top) / (openingTrack.offsetHeight - innerHeight + headerHeight));
  opening.style.setProperty('--front-x', (-openingProgress * 22) + '%');
  opening.style.setProperty('--front-angle', (-2 - openingProgress * 22) + 'deg');
  opening.style.setProperty('--middle-x', (openingProgress * 24) + '%');
  opening.style.setProperty('--middle-angle', (8 + openingProgress * 25) + 'deg');
  opening.style.setProperty('--back-x', (-openingProgress * 4) + '%');
  opening.style.setProperty('--back-angle', (-8 + openingProgress * 5) + 'deg');
  album.style.transform = 'translateY(' + (-openingProgress * 55) + 'px) scale(' + (1 + openingProgress * .13) + ')';
  openingCopy.style.transform = 'translateY(' + (-openingProgress * 60) + 'px)';
  const storyProgress = clamp((headerHeight - storyTrack.getBoundingClientRect().top) / (storyTrack.offsetHeight - innerHeight + headerHeight));
  const scene = Math.min(2, Math.floor(storyProgress * 3));
  if (scene !== lastScene) {
    lastScene = scene;
    playback(false);
    show(scene);
  }
  const entry = clamp((innerHeight - storyTrack.getBoundingClientRect().top) / innerHeight);
  hero.style.setProperty('--story-inset', ((1 - entry) * 6) + '%');
  hero.style.setProperty('--story-radius', ((1 - entry) * 60) + 'px');
  serviceCards.forEach((card, index) => {
    // The container supplies a stable position while each card moves within it.
    const sectionProgress = clamp((innerHeight - document.querySelector('.servicegrid').getBoundingClientRect().top - index * 65) / (innerHeight * .9));
    card.style.transform = 'translateY(' + (1 - sectionProgress) * 100 + 'px) rotateX(' + (1 - sectionProgress) * 22 + 'deg) rotate(' + (1 - sectionProgress) * (index - 1) * 9 + 'deg)';
    card.style.opacity = String(.18 + sectionProgress * .82);
  });
  for (const heading of headings) {
    const progress = clamp((innerHeight - heading.getBoundingClientRect().top) / (innerHeight * .55));
    const words = [...heading.querySelectorAll('.word-mask > span')];
    words.forEach((word, index) => {
      const reveal = clamp(progress * 1.8 - index / Math.max(1, words.length));
      word.style.transform = 'translateY(' + (1 - reveal) * 115 + '%) rotate(' + (1 - reveal) * 7 + 'deg)';
      word.style.opacity = String(reveal);
    });
  }
  const visit = document.querySelector('.visit');
  const visitProgress = clamp((headerHeight - visit.getBoundingClientRect().top) / Math.max(1, visit.offsetHeight - innerHeight));
  document.querySelector('.visit-photos').style.setProperty('--visit-progress', visitProgress);
  let focused = 0;
  steps.forEach((step, index) => {
    if (step.getBoundingClientRect().top < innerHeight * .7) focused = index;
  });
  steps.forEach((step, index) => step.classList.toggle('in-focus', index === focused));
}

function scheduleMotion() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(renderMotion);
}

function setMotion(value) {
  enabled = value;
  document.body.classList.toggle('motion-enabled', enabled);
  motionButton.textContent = enabled ? 'Motion on' : 'Motion off';
  motionButton.setAttribute('aria-pressed', String(enabled));
  if (!enabled) {
    for (const element of [album, openingCopy, ...serviceCards, ...document.querySelectorAll('.word-mask > span')]) {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
    }
  }
  lastScene = -1;
  scheduleMotion();
}
motionButton.addEventListener('click', () => setMotion(!enabled));
systemMotion.addEventListener('change', event => setMotion(!event.matches));
addEventListener('scroll', scheduleMotion, { passive: true });
addEventListener('resize', scheduleMotion);
document.fonts.ready.then(scheduleMotion);
setMotion(enabled);

const cursor = document.querySelector('.custom-cursor');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

function syncCursorAvailability() {
  document.body.classList.toggle('cursor-enabled', finePointer.matches);
  cursor.classList.remove('cursor-visible');
}

document.addEventListener('pointermove', event => {
  if (!finePointer.matches || event.pointerType === 'touch') return;
  cursor.style.transform = 'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0) translate(-50%,-50%)';
  cursor.classList.add('cursor-visible');
  cursor.classList.toggle('cursor-link', Boolean(event.target.closest('a, button, select, summary')));
}, { passive: true });

document.addEventListener('pointerdown', () => cursor.classList.add('cursor-down'));
document.addEventListener('pointerup', () => cursor.classList.remove('cursor-down'));
document.documentElement.addEventListener('pointerleave', () => cursor.classList.remove('cursor-visible', 'cursor-down'));
window.addEventListener('blur', () => cursor.classList.remove('cursor-visible', 'cursor-down'));
finePointer.addEventListener('change', syncCursorAvailability);
syncCursorAvailability();
