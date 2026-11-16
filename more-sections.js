const sectionMotion = matchMedia('(prefers-reduced-motion: reduce)');
const addedSections = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const motionPaused = document.querySelector('.motion-toggle[aria-pressed="false"], .draft-two-motion[aria-pressed="false"]');
    if (!sectionMotion.matches && !motionPaused) {
      entry.target.animate([
        { opacity: .2, transform: 'translateY(50px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 850, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    addedSections.unobserve(entry.target);
  }
}, { threshold: .12 });
document.querySelectorAll('.added-section > div').forEach(element => addedSections.observe(element));

const routineTabs = [...document.querySelectorAll('[data-routine]')];
const routines = [
  { label: 'A COMFORTABLE START', heading: 'Make the morning yours.', text: 'Prepare breakfast together, put the groceries away, and leave time for that first cup of tea. Choose which tasks you want to share.', photo: 'images/morning.webp', alt: 'Preparing fresh food together in a home kitchen' },
  { label: 'TIME FOR GOOD COMPANY', heading: 'Share an afternoon.', text: 'Bring out a favorite puzzle, read a book together, or catch up over a cup of tea. Make room for the company and activities you enjoy.', photo: 'images/afternoon.webp', alt: 'An older adult and companion looking through a book together' },
  { label: 'AN EASIER WIND-DOWN', heading: 'Settle into your evening.', text: 'A hand with daily routines, the favorite chair, and a comfortable place to rest. Talk about which parts of the evening you would like support with.', photo: 'images/evening.webp', alt: 'A caregiver offering support beside an armchair' }
];

function selectRoutine(index) {
  const routine = routines[index];
  routineTabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  const panel = document.querySelector('#routine-panel');
  panel.setAttribute('aria-labelledby', routineTabs[index].id);
  panel.querySelector('.routine-label').textContent = routine.label;
  panel.querySelector('h3').textContent = routine.heading;
  panel.querySelector('p').textContent = routine.text;
  const image = document.querySelector('.routine-image img');
  image.src = routine.photo;
  image.alt = routine.alt;
  if (!sectionMotion.matches && !document.querySelector('.draft-two-motion[aria-pressed="false"]')) {
    image.animate([{ opacity: .25, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 550, easing: 'ease-out' });
  }
}
routineTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectRoutine(index));
  tab.addEventListener('keydown', event => {
    const targets = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    selectRoutine(targets[event.key]);
    routineTabs[targets[event.key]].focus();
  });
});
