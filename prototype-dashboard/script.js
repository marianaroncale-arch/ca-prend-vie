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
// Progression en mémoire et sauvegarde locale de test ; aucune donnée envoyée à Wix.
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
  saveProgress();
});
$('question-note').addEventListener('input', event => {state.notes[state.active] = event.target.value; saveProgress();});
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
    saveProgress();
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
  saveProgress();
  renderKit();
});
updateProgress();


// Deux profils fictifs pour vérifier la séparation des collections avant le raccord Wix.
const STORAGE_PREFIX = 'ca-prend-vie:aurora:v1:';
let profile = 'a';
let cards = [];
let history = [];
const memoryFallback = {};
function snapshot(){
  return {version:1,visited:[...state.visited],notes:state.notes,hypothesis:state.hypothesis,cards,history};
}
function saveProgress(){
  const data = snapshot();
  memoryFallback[profile] = JSON.stringify(data);
  try {
    localStorage.setItem(STORAGE_PREFIX + profile, JSON.stringify(data));
    $('save-status').textContent = 'Enregistré dans ce navigateur · ' + new Date().toLocaleTimeString('fr-FR');
  } catch {
    $('save-status').textContent = 'Sauvegarde persistante indisponible : vos données restent seulement dans cette page. Ne la fermez pas.';
  }
}
function loadProgress(){
  let raw;
  try { raw = localStorage.getItem(STORAGE_PREFIX + profile) || memoryFallback[profile]; }
  catch { raw = memoryFallback[profile]; }
  let data = {};
  try { const parsed = JSON.parse(raw || '{}'); if(parsed && parsed.version === 1) data = parsed; }
  catch { $('save-status').textContent = 'Sauvegarde illisible. Ce profil repart sans progression.'; }
  state.visited = new Set(Array.isArray(data.visited) ? data.visited.filter(id=>indicators.some(item=>item.id===id)) : []);
  state.notes = {};
  indicators.forEach(item=>{if(typeof data.notes?.[item.id] === 'string') state.notes[item.id]=data.notes[item.id].slice(0,2000);});
  state.hypothesis = state.visited.size===5 && Number.isInteger(data.hypothesis) && data.hypothesis>=0 && data.hypothesis<hypotheses.length ? data.hypothesis : null;
  cards = Array.isArray(data.cards) && data.cards.includes('repere-01') ? ['repere-01'] : [];
  history = Array.isArray(data.history) ? data.history.filter(event=>event?.card==='repere-01' && typeof event.at==='string' && Number.isFinite(Date.parse(event.at))).slice(0,1) : [];
  state.active = null;
  if(dialog.open) dialog.close();
  if($('kit-dialog').open) $('kit-dialog').close();
  $('hypothesis').hidden=true; $('dashboard').hidden=false;
  $('question-note').value='';
  document.querySelectorAll('input[name=hypothesis]').forEach(input=>{input.checked=Number(input.value)===state.hypothesis && state.hypothesis!==null;});
  $('feedback').hidden=state.hypothesis===null;
  $('specific-feedback').textContent=state.hypothesis===null ? '' : hypotheses[state.hypothesis].feedback;
  updateProgress(); renderKit(); saveProgress();
}
function renderKit(){
  const owned=cards.includes('repere-01');
  $('open-kit').textContent=`Mon kit · ${cards.length}/10`;
  $('collect-card').disabled=owned || state.hypothesis===null || state.visited.size!==5;
  $('collect-card').textContent=owned ? 'Déjà dans mon kit · 1/10' : 'Ajouter à mon kit de transformation';
  $('card-state').textContent=owned ? 'Carte acquise. Elle reste dans votre kit lorsque vous recommencez l’activité.' : state.hypothesis===null ? 'Carte verrouillée. Consultez les cinq détails et choisissez une hypothèse pour la découvrir.' : 'Vous avez formulé une hypothèse : votre premier repère est disponible.';
  document.querySelector('#kit-dialog .collectible').hidden=!owned && state.hypothesis===null;
  $('card-history').replaceChildren();
  if(!history.length){const li=document.createElement('li');li.textContent='Aucune carte collectée pour ce profil.';$('card-history').append(li);}
  history.forEach(event=>{const li=document.createElement('li');li.textContent='Repère 01 — Complétion ≠ Impact · collecté le '+new Date(event.at).toLocaleString('fr-FR');$('card-history').append(li);});
}
function openKit(){renderKit();$('kit-dialog').showModal();}
$('open-kit').addEventListener('click',openKit);
$('discover-card').addEventListener('click',openKit);
$('close-kit').addEventListener('click',()=>$('kit-dialog').close());
$('collect-card').addEventListener('click',()=>{
  if(state.hypothesis===null || state.visited.size!==5 || cards.includes('repere-01')) return;
  cards.push('repere-01');
  history.push({card:'repere-01',at:new Date().toISOString(),hypothesis:state.hypothesis});
  saveProgress(); renderKit();
});
$('test-player').addEventListener('change',event=>{saveProgress();profile=event.target.value==='b'?'b':'a';loadProgress();});
$('erase-profile').addEventListener('click',()=>{
  if(!window.confirm('Effacer les notes, les cartes et l’historique de ce profil de test uniquement ?')) return;
  cards=[];history=[];state.visited.clear();state.notes={};state.hypothesis=null;
  saveProgress();loadProgress();$('open-kit').focus();
});
loadProgress();
