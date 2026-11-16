const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionControl = document.querySelector('.draft-two-motion');
const introScroll = document.querySelector('.intro-scroll');
const independenceScroll = document.querySelector('.independence-scroll');
const portrait = document.querySelector('.portrait-layout');
const portraitImage = document.querySelector('.portrait-main img');
const introCopy = document.querySelector('.intro-text');
const photoTile = document.querySelector('.photo-tile');
const stamp = document.querySelector('.circle-stamp');
const optionGrid = document.querySelector('.option-grid');
const optionCards = [...document.querySelectorAll('.option-card')];
const independenceImage = document.querySelector('.independence-photo img');
const independenceCopy = document.querySelector('.independence-text');
const closingTitle = document.querySelector('.closing h2');
const scrollHeadings = [...document.querySelectorAll('.section-heading h2, .questions h2')];
let motionActive = !reducedMotion.matches;
let motionFrame = false;
const bounded = value => Math.min(1, Math.max(0, value));

function sectionProgress(element, top) {
  return bounded((top - element.getBoundingClientRect().top) / Math.max(1, element.offsetHeight - innerHeight + top));
}

function updateSecondMotion() {
  motionFrame = false;
  const top = document.querySelector('.site-header').offsetHeight + 44;
  document.body.style.setProperty('--pinned-top', top + 'px');
  document.querySelector('.draft-two-progress').style.transform = 'scaleX(' + bounded(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) + ')';
  if (!motionActive) return;
  const progress = sectionProgress(introScroll, top);
  const compact = innerWidth <= 800;
  portrait.style.transform = 'translateX(' + progress * (compact ? 10 : -65) + 'px) scale(' + (1 + progress * .3) + ') rotate(' + progress * -7 + 'deg)';
  portraitImage.style.transform = 'scale(' + (1 + progress * .18) + ')';
  photoTile.style.transform = 'translate(' + (-progress * 55) + 'px,' + progress * 45 + 'px) rotate(' + (-7 - progress * 22) + 'deg)';
  stamp.style.transform = 'rotate(' + (10 + progress * 150) + 'deg) scale(' + (1 - progress * .2) + ')';
  introCopy.style.transform = 'translateY(' + (-progress * 80) + 'px)';
  introCopy.style.opacity = String(1 - progress * .65);

  const gridProgress = bounded((innerHeight - optionGrid.getBoundingClientRect().top) / (innerHeight * .8));
  optionCards.forEach((card, index) => {
    const reveal = compact
      ? bounded((innerHeight - card.getBoundingClientRect().top + parseFloat(card.dataset.offset || 0)) / (innerHeight * .75))
      : bounded(gridProgress * 1.5 - index * .2);
    const offset = (1 - reveal) * 85;
    // Read the stable grid position on desktop. On mobile, translate is tracked separately.
    card.dataset.offset = compact ? String(offset) : '0';
    card.style.transform = 'translateY(' + offset + 'px) rotateX(' + (1 - reveal) * 32 + 'deg) rotate(' + (1 - reveal) * (index - 1) * 12 + 'deg)';
    card.style.opacity = String(.15 + reveal * .85);
  });

  const supportProgress = sectionProgress(independenceScroll, top);
  independenceImage.style.transform = 'scale(' + (1.05 + supportProgress * .28) + ') translateX(' + (-supportProgress * 4) + '%)';
  independenceCopy.style.transform = 'translateY(' + (60 - supportProgress * 120) + 'px)';
  for (const heading of scrollHeadings) {
    const reveal = bounded((innerHeight - heading.getBoundingClientRect().top) / (innerHeight * .55));
    heading.style.clipPath = 'inset(0 0 ' + (1 - reveal) * 100 + '% 0)';
  }
  const closing = document.querySelector('.closing').getBoundingClientRect();
  const closingProgress = bounded((innerHeight - closing.top) / (innerHeight * .7));
  closingTitle.style.transform = 'translateX(' + (1 - closingProgress) * 100 + 'px) scale(' + (.8 + closingProgress * .2) + ')';
}

function queueSecondMotion() {
  if (motionFrame) return;
  motionFrame = true;
  requestAnimationFrame(updateSecondMotion);
}

const enteredSections = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (motionActive) {
      entry.target.animate([
        { opacity: 0, transform: 'translateY(70px) rotate(2deg)' },
        { opacity: 1, transform: 'translateY(0) rotate(0)' }
      ], { duration: 950, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    enteredSections.unobserve(entry.target);
  }
}, { threshold: .12 });
document.querySelectorAll('.steps-grid article, .faq-list').forEach(element => enteredSections.observe(element));

function toggleSecondMotion(value) {
  motionActive = value;
  document.body.classList.toggle('motion-active', value);
  motionControl.textContent = value ? 'Motion on' : 'Motion off';
  motionControl.setAttribute('aria-pressed', String(value));
  if (!value) {
    for (const element of [portrait, portraitImage, photoTile, stamp, introCopy, ...optionCards, independenceImage, independenceCopy, closingTitle, ...scrollHeadings]) {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
      element.style.removeProperty('clip-path');
    }
    document.getAnimations().forEach(animation => animation.finish());
  }
  queueSecondMotion();
}

motionControl.addEventListener('click', () => toggleSecondMotion(!motionActive));
reducedMotion.addEventListener('change', event => toggleSecondMotion(!event.matches));
addEventListener('scroll', queueSecondMotion, { passive: true });
addEventListener('resize', queueSecondMotion);
document.fonts.ready.then(queueSecondMotion);
toggleSecondMotion(motionActive);
