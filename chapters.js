const visitSteps = [...document.querySelectorAll('.visit-steps li')];
const visitPhotos = [...document.querySelectorAll('.visit-photos img')];
const mobileVisit = matchMedia('(max-width: 700px)');
let framePending = false;
let activeStep = -1;

function syncVisitPhoto() {
  framePending = false;
  const readingLine = innerHeight * (mobileVisit.matches ? .67 : .53);
  let index = 0;
  visitSteps.forEach((step, position) => {
    if (step.getBoundingClientRect().top <= readingLine) index = position;
  });
  if (index === activeStep) return;
  activeStep = index;
  visitPhotos.forEach((photo, position) => photo.classList.toggle('selected', position === index));
}

function scheduleVisitPhoto() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(syncVisitPhoto);
}

addEventListener('scroll', scheduleVisitPhoto, { passive: true });
addEventListener('resize', scheduleVisitPhoto);
syncVisitPhoto();
