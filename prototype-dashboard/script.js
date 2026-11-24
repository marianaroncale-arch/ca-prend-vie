// Le contenu suit les écrans 07–09 du scénario révisé.
const indicators = [
  {id:'completion', value:'83 %', title:'Complétion', question:'Terminer dit-il quelque chose de l’usage au travail ?', detail:'83 % ont terminé. 62 % des participants ont terminé dans les 48 heures précédant la date limite.', followup:'Question à garder : « Que signifie cette concentration en fin de délai ? »'},
  {id:'satisfaction', value:'4,4 / 5', title:'Satisfaction', question:'Être satisfait signifie-t-il avoir appris ?', detail:'4,4 / 5. Extraits : « Clair. » « Bien fait. » « Facile à suivre. »', followup:'Question : « Ces avis décrivent-ils un changement de pratique ? »'},
  {id:'certification', value:'78 %', title:'Certification', question:'Que vérifie exactement cette certification ?', detail:'78 % sont certifiés. La majorité des personnes certifiées réussit dès la première tentative.', followup:'Question : « Le test porte-t-il sur des connaissances ou sur leur application ? »'},
  {id:'retour', value:'12 %', title:'Retour J+30', question:'Qui déclare un changement et sur quelle base ?', detail:'12 % déclarent avoir changé au moins une pratique.', followup:'Questions : « Combien de personnes ont répondu ? Comment la question était-elle formulée ? » Ces précisions ne figurent pas encore au dossier : le pourcentage reste un signal à vérifier.'},
  {id:'forum', value:'11 %', title:'Publication dans le forum', question:'Que font les personnes qui ne publient pas ?', detail:'11 % publient.', followup:'Question : « Le taux de publication renseigne-t-il sur toutes les formes de participation ? »'}
];
const hypotheses = [
  {text:'La formation fonctionne globalement bien.', feedback:'Les indicateurs de parcours sont encourageants ; l’objectif annoncé reste l’évolution des pratiques. Vérifions ce qui se passe après.'},
  {text:'Les indicateurs ne racontent qu’une partie de l’histoire.', feedback:'C’est l’hypothèse la mieux étayée à ce stade. Les données de parcours et le signal J+30 posent des questions différentes.'},
  {text:'Les participants n’ont probablement pas retenu le contenu.', feedback:'C’est une hypothèse possible, mais aucune donnée présentée ne démontre un défaut de mémorisation.'}
];
// Mémoire temporaire : aucun stockage local ni envoi de données.
const state = {visited:new Set(), notes:{}, hypothesis:null, active:null};
const $ = id => document.getElementById(id);
const dialog = $('detail-dialog');

function updateProgress(){
  const count = state.visited.size;
  $('count').textContent = `${count}/5 détails consultés`;
  $('exploration').value = count;
  $('formulate').disabled = count !== indicators.length;
  $('unlock-message').textContent = count === indicators.length
    ? 'Vous avez cinq résultats, mais aussi cinq questions. Quelle hypothèse souhaitez-vous maintenant mettre à l’épreuve ?'
    : 'Consultez les cinq détails pour formuler votre hypothèse.';
  indicators.forEach(item => {
    const visited = state.visited.has(item.id);
    $(`card-${item.id}`).classList.toggle('visited', visited);
    $(`badge-${item.id}`).textContent = visited ? '✓ Détail consulté' : 'À explorer';
  });
}

function openIndicator(item){
  state.active = item.id;
  $('detail-title').textContent = `${item.title} — ${item.value}`;
  $('detail-question').textContent = item.question;
  $('detail-copy').textContent = item.detail;
  $('detail-followup').textContent = item.followup;
  $('question-note').value = state.notes[item.id] || '';
  $('detail-content').hidden = !state.visited.has(item.id);
  $('show-detail').hidden = state.visited.has(item.id);
  dialog.showModal();
}

indicators.forEach(item => {
  const card = document.createElement('article');
  card.id = `card-${item.id}`;
  card.className = 'card';
  // Les chaînes ci-dessous proviennent uniquement du scénario, jamais des notes saisies.
  card.innerHTML = `<span class="badge" id="badge-${item.id}">À explorer</span><h2>${item.title}</h2><div class="value">${item.value}</div><p>${item.question}</p><button aria-label="Explorer : ${item.title}">Explorer l’indicateur</button>`;
  card.querySelector('button').addEventListener('click', () => openIndicator(item));
  $('indicators').append(card);
});

$('show-detail').addEventListener('click', () => {
  state.visited.add(state.active);
  $('detail-content').hidden = false;
  // Déplacer le focus avant de masquer le bouton activé.
  $('detail-content').tabIndex = -1;
  $('detail-content').focus();
  $('show-detail').hidden = true;
  updateProgress();
});
$('question-note').addEventListener('input', event => {state.notes[state.active] = event.target.value;});
$('close-detail').addEventListener('click', () => dialog.close());
$('return-dashboard').addEventListener('click', () => dialog.close());

hypotheses.forEach((item,index) => {
  const label = document.createElement('label');
  label.className = 'choice';
  const radio = document.createElement('input');
  radio.type = 'radio'; radio.name = 'hypothesis'; radio.value = index;
  const text = document.createElement('span'); text.textContent = item.text;
  label.append(radio,text);
  radio.addEventListener('change', () => {
    state.hypothesis = index;
    $('specific-feedback').textContent = item.feedback;
    $('feedback').hidden = false;
  });
  $('choices').append(label);
});
$('formulate').addEventListener('click', () => {
  if(state.visited.size !== indicators.length) return;
  $('dashboard').hidden = true;
  $('hypothesis').hidden = false;
  $('hypothesis-title').focus();
});
$('back').addEventListener('click', () => {
  $('hypothesis').hidden = true;
  $('dashboard').hidden = false;
  $('formulate').focus();
});
$('restart').addEventListener('click', () => {
  if(dialog.open) dialog.close();
  state.visited.clear(); state.notes = {}; state.hypothesis = null; state.active = null;
  document.querySelectorAll('input[name=hypothesis]').forEach(input => {input.checked = false;});
  $('question-note').value = '';
  $('feedback').hidden = true;
  $('specific-feedback').textContent = '';
  $('hypothesis').hidden = true;
  $('dashboard').hidden = false;
  updateProgress();
  $('dashboard-title').tabIndex = -1;
  $('dashboard-title').focus();
});
updateProgress();
