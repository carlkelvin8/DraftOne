const scenes = [
  ['Care that feels','like home.','For the ones who raised you. A helping hand in the everyday moments that make home their own.'],
  ['A little time,','together.','The puzzle stays on the table. There’s someone to share a clue, hear an old story, and stay for another cup of tea.'],
  ['Ease into','the evening.','A steady hand to reach the favorite chair. A blanket close by. The small comforts that help your loved one settle in.']
];
const hero = document.querySelector('.hero');
const content = document.querySelector('.content');
const chapters = [...document.querySelectorAll('.chapters button')];
const photos = [...document.querySelectorAll('.photos img')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let timer;
function animateScene() {
  if (motion.matches) return;
  for (const [i, element] of [...content.children].entries()) {
    element.animate([{opacity:0, transform:'translateY(26px)',clipPath:'inset(0 0 80% 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0)'}],{duration:760,delay:i*80,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
  }
}
function show(index) {
  current = (index + scenes.length) % scenes.length;
  const [title, emphasis, description] = scenes[current];
  content.querySelector('h2').replaceChildren(document.createTextNode(title),document.createElement('br'),Object.assign(document.createElement('em'),{textContent:emphasis}));
  content.querySelector('p').textContent = description;
  photos.forEach((img,i)=>img.classList.toggle('active',i===current));
  chapters.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
  document.querySelector('.sceneNum b').textContent=String(current+1).padStart(2,'0');
  animateScene();
}
function playback(on) {
  clearInterval(timer);
  timer = on ? setInterval(()=>show(current+1),7000) : null;
  hero.classList.toggle('playing',on);
  document.querySelector('.playLabel').textContent=on?'Pause the story':'Play the story';
  document.querySelector('.playIcon').textContent=on?'Ⅱ':'▶';
}
function select(index){playback(false);show(index)}
chapters.forEach((button,i)=>button.onclick=()=>select(i));
document.querySelectorAll('.arrows button').forEach((button,i)=>button.onclick=()=>select(current+(i?1:-1)));
document.querySelector('.play').onclick=()=>{if(!timer)show(current+1);playback(!timer)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)playback(false)});
let startX;
hero.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});
hero.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-startX;if(Math.abs(delta)>80)select(current+(delta<0?1:-1))},{passive:true});
animateScene();
if(!motion.matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.animate([{opacity:0,transform:'translateY(48px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,easing:'cubic-bezier(.16,1,.3,1)'});observer.unobserve(entry.target)}
  }),{threshold:.12});
  document.querySelectorAll('.intro,article,#approach>div').forEach(el=>observer.observe(el));
  document.addEventListener('scroll',()=>{const offset=-hero.getBoundingClientRect().top;if(offset<hero.offsetHeight)document.querySelector('.photos').style.transform='translateY('+Math.max(0,offset)*.2+'px)'},{passive:true});
}
const dialog=document.querySelector('dialog');
const need=document.querySelector('#need');
const notes=['Which meals do you most enjoy making? List the steps you’d like help with and the ones you’d like to keep doing yourself.','What would make a good afternoon together? Write down a favorite activity, a comfortable time to visit, and how often company would feel welcome.','Walk through a usual morning or evening together. Note when support would feel welcome, who you feel comfortable with, and which routines matter most.'];
function updateNotes(){document.querySelector('#advice').textContent=notes[need.selectedIndex]}
need.onchange=updateNotes;
updateNotes();
document.querySelectorAll('.find').forEach(button=>button.onclick=()=>{playback(false);dialog.showModal()});
dialog.addEventListener('click',e=>{if(e.target===dialog&&!(e.clientX>=dialog.offsetLeft&&e.clientX<=dialog.offsetLeft+dialog.offsetWidth&&e.clientY>=dialog.offsetTop&&e.clientY<=dialog.offsetTop+dialog.offsetHeight))dialog.close()});
document.querySelector('#save').onclick=()=>{
  const url=URL.createObjectURL(new Blob(['Kuya Joseph | Family care notes\n\n'+need.value+'\n\n'+notes[need.selectedIndex]+'\n\nOur preferences:\n\nQuestions for a care agency:\n'],{type:'text/plain'}));
  const link=Object.assign(document.createElement('a'),{href:url,download:'kuya-joseph-care-notes.txt'});link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
