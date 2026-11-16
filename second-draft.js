const planner = document.querySelector('.planner');
const careType = document.querySelector('#care-type');
const carePrompt = document.querySelector('#care-prompt');
const prompts = [
  'Which household task would feel easier with a helping hand? Note your favorite meals, usual shopping day, and the things you enjoy doing yourself.',
  'What would make a good afternoon together? Note your favorite activities, a comfortable time to visit, and how often you would enjoy company.',
  'Which parts of your daily routine would you like help with? Note your preferences, what feels comfortable, and what you want to keep doing yourself.'
];

function updatePrompt() {
  carePrompt.textContent = prompts[careType.selectedIndex];
}

document.querySelectorAll('.open-planner, .option-card').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.care) careType.value = button.dataset.care;
    updatePrompt();
    planner.showModal();
  });
});
careType.addEventListener('change', updatePrompt);
document.querySelector('.close-planner').addEventListener('click', () => planner.close());
document.querySelector('#download-plan').addEventListener('click', () => {
  const text = 'Kuya Joseph | My care starting point\n\n' + careType.value + '\n\n' + carePrompt.textContent + '\n\nMy preferences\n\nQuestions for my care agency\n';
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: 'kuya-joseph-care-notes.txt' });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
updatePrompt();
