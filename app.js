import {estimateCompensation} from './compensation.js';
import './preferences.js?v=45';
import {setupAdvisor} from './advisor.js?v=45';
import {initAccount} from './account.js';
import {estimatePensionBase,estimateRetirementContributions,forecastRetirementContributions,renderRetirement,renderRetirementForecast} from './retirement.js';
import {assessContinuous,amountDisplay,applicableBenefits} from './policy.js';
import {validateCatalog,catalogForDate,catalogCovers,presentBenefit} from './catalog.js';
import {loadDeviceProfile,saveDeviceProfile} from './profile.js?v=45';
const $=s=>document.querySelector(s);function node(tag,text,parent){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el}async function loadCatalog() {
  const response = await fetch('./catalog.json', { cache: 'no-cache' });
  if (!response.ok) throw Error('Catalog unavailable');
  const data = await response.json();
  return validateCatalog(data);
}
let catalog;
let catalogData;
try {
  catalogData = await loadCatalog();
} catch {
  node('p','โหลดข้อมูลสิทธิไม่สำเร็จ กรุณาเชื่อมต่ออินเทอร์เน็ตแล้วเปิดใหม่',$('#result'));
  throw Error('Catalog unavailable');
}
const dateFormat = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'});
function currentDate() {
  const {year,month,day}=Object.fromEntries(dateFormat.formatToParts(new Date()).map(part=>[part.type,part.value]));
  return year+'-'+month+'-'+day;
}
let assessmentDate=currentDate();
let month=assessmentDate.slice(0,7);
catalog = catalogForDate(catalogData,assessmentDate);
let section='33';
function count(){const field=$('#continuous');return field.value===''?null:Number(field.value)}function error(message){$('#form-error').textContent=message;$('#form-error').hidden=!message}
function syncProfile(n, option) {
  $('#assessment-fields').hidden = section === 'none';
  const validMonths = Number.isInteger(n) && n >= 0 && n <= 1200;
  const matched = validMonths ? applicableBenefits(catalog, section, option, assessmentDate).filter(benefit => n >= benefit.gate.min) : [];
  const has = (...ids) => matched.some(benefit => ids.includes(benefit.id));
  const screening = has('screening');
  const maternity = has('maternity_income');
  $('#profile-sex').closest('label').hidden = !(maternity || screening);
  document.querySelectorAll('[data-profile]').forEach(label => {
    label.hidden = !label.dataset.profile.split(' ').includes(section);
  });
  const show = (id, visible) => { $(id).closest('label').hidden = !visible; };
  const pension = validMonths && section !== '40' && n >= catalog.benefits.find(b=>b.id==='pension').amount.thresholdMonths;
  const mixed = pension && section === '39' && profileNumber('#profile-months39') < n && profileNumber('#profile-months39') !== null;
  show('#profile-months39', pension && section === '39');
  show('#profile-wage', mixed || (section === '33' &&
    (pension || has('sick_income', 'disability', 'death_grant', 'unemployment') ||
      (maternity && $('#profile-sex').value !== 'male'))));
  $('#profile-wage-label').textContent = mixed ? 'ค่าจ้างต่อเดือนช่วงที่ส่ง ม.33 (บาท)' : 'ค่าจ้างต่อเดือน (บาท)';
  $('#profile-months39').max = validMonths ? n : 0;
}
function profileNumber(id) {
  const field = $(id);
  return !field.validity.valid ? NaN : field.value === '' ? null : field.valueAsNumber;
}
function profileAmount(benefit, option) {
  const inputWage = profileNumber('#profile-wage');
  const wage = inputWage === null ? null : Math.min(inputWage, catalog.bases.section33.max);
  const monthly = section === '39' ? catalog.bases.section39.monthly : wage;
  const {amount} = benefit;
  if (benefit.id === 'm40_disability') {
    const tier = amount.tiers.findLast(entry => count() >= entry.months);
    return tier ? { total: option === '3' ? tier.opt3 : tier.opt12, unit: '/เดือน' } : null;
  }
  if ((!Number.isFinite(monthly) || monthly <= 0) && benefit.id !== 'unemployment') return null;
  if (benefit.id === 'death_grant') {
    const tier = amount.tiers.findLast(entry => count() >= entry.months);
    return tier ? { total: monthly * amount.rate * tier.multiplier } : null;
  }
  if (benefit.id === 'disability') {
    const [mild, severe] = amount.rates;
    const variants=benefit.presentation.variants;
    return { rates: [
      { label: variants[0].label.replace('{amount.mildMaxMonths}',amount.mildMaxMonths), qualifier:variants[0].qualifier, total: monthly * mild, unit: '/เดือน' },
      { label: variants[1].label, total: monthly * severe, unit: '/เดือน' },
    ] };
  }
  const sickness = benefit.id === 'sick_income';
  const jobless = benefit.id === 'unemployment';
  const maternity = benefit.id === 'maternity_income';
  if (!sickness && !jobless && !maternity) return null;
  const context = { section, option, bases: catalog.bases, daysPerMonth:catalog.calculation.daysPerMonth };
  if (jobless) {
    return {rates:benefit.presentation.variants.map(variant=>({
      label:variant.label.replace('{percent}',amount.rates[variant.reason]*100)
        .replace('{days}',amount.maxDays[variant.reason]),
      total:estimateCompensation(benefit,context,{wage,days:1,reason:variant.reason}),
      unit:'/วัน',
    }))};
  }
  const total = estimateCompensation(benefit, context, { wage, days: 1 });
  return total === null ? null : { total, unit: maternity ? '/ครั้ง' : '/วัน' };
}

function formatEstimate({total, unit = '', qualifier = ''}) {
  if (!Number.isFinite(total)) return '-';
  const amount = total.toLocaleString('th-TH', {maximumFractionDigits: 2}) + ' บาท' + unit;
  return qualifier ? qualifier + ' ' + amount : amount;
}

let healthChecksOpen = false;

function renderHealthChecks(row) {
  const age = profileNumber('#profile-age');
  const sex = $('#profile-sex').value;
  const hasAge = Number.isInteger(age) && $('#profile-age').checkValidity();
  const earliestBirthYear = Number(month.slice(0, 4)) - age - 1;
  const checks = catalog.screening
    .filter(check => !sex || !check.sex || check.sex === sex)
    .map(check => ({
      ...check,
      bands: hasAge ? check.bands.filter(([, , minimum, maximum]) =>
        minimum === undefined ? earliestBirthYear < 1992 : age >= minimum && (maximum === undefined || age <= maximum)
      ) : check.bands,
    }))
    .filter(check => check.bands.length);
  const details = node('details', '', row);
  details.className = 'health-checks';
  details.open = healthChecksOpen;
  const summary = node('summary', '', details);
  node('strong', catalog.benefits.find(b=>b.id==='screening').presentation.title, summary);
  node('span', checks.length + ' รายการ', summary).className = 'amount';
  const list = node('ul', '', details);
  list.className = 'health-check-list';
  for (const {name, bands} of checks) {
    const item = node('li', '', list);
    const heading = node('div', '', item);
    heading.className = 'health-check-line';
    node('strong', name, heading);
    if (bands.length === 1) {
      const [[age, frequency]] = bands;
      if (frequency) node('span', frequency, heading).className = 'amount';
      node('p', age, item).className = 'benefit-note';
      continue;
    }
    for (const [age, frequency] of bands) {
      const line = node('div', '', item);
      line.className = 'health-check-line';
      node('span', age, line);
      node('span', frequency, line).className = 'amount';
    }
  }
}

function moneyRow(benefit,parent,{future=false,possible=false}={}){
  const option=$('#option').value;
  if(future){
    const months = count();
    const ageInput = profileNumber('#profile-age');
    const age = $('#profile-age').checkValidity() ? ageInput : null;
    if (section === '40') {
      const row = renderRetirement(parent, {section, option, months, age, benefit, calculation:catalog.calculation});
      if (age !== null && age < catalog.calculation.retirementAge) renderRetirementForecast(row, forecastRetirementContributions(null, {
        section, option, months, month, age, retirementAge:catalog.calculation.retirementAge, allocation: benefit.amount.allocations[option],
      }));
      return;
    }
    const months39 = section === '39' ? profileNumber('#profile-months39') ?? months : 0;
    const knownMonths39 = Number.isInteger(months39) && months39 <= months ? months39 : 0;
    const rules = catalog.retirementContributions;
    const savings = section === '33' || knownMonths39 === months
      ? estimateRetirementContributions(rules, {section, months, month, months39, normalCeiling: section === '33'}) : null;
    const yearsToRetirement = age === null ? null : Math.max(catalog.calculation.retirementAge - age, 0);
    const endMonth = yearsToRetirement === null ? null : String(Number(month.slice(0, 4)) + yearsToRetirement) + month.slice(4);
    const futureMonths = yearsToRetirement === null ? 0 : yearsToRetirement * 12;
    const finalMonths39 = section === '39' ? knownMonths39 + futureMonths : 0;
    const wage = profileNumber('#profile-wage');
    const hasWage = Number.isFinite(wage) && wage > 0;
    const canCalculatePension = section === '33' ? futureMonths === 0 || hasWage : finalMonths39 >= benefit.amount.averagingMonths;
    const value = endMonth && canCalculatePension
      ? estimatePensionBase(rules, {
        section, month: endMonth, months39: finalMonths39, futureMonths, averagingMonths:benefit.amount.averagingMonths,
        wage: section === '33' && futureMonths > 0 ? wage : null,
      }) : null;
    const maxBase = endMonth ? rules.wageCaps.findLast(cap => cap.from <= endMonth)?.max : undefined;
    const row = renderRetirement(parent, {section, option, months: months + futureMonths, value, savings, maxBase, benefit, calculation:catalog.calculation});
    if (futureMonths > 0) {
      const forecast = section === '33' && !hasWage ? null :
        forecastRetirementContributions(rules, {section, option, months, month, age, savings, wage, retirementAge:catalog.calculation.retirementAge});
      renderRetirementForecast(row, forecast ?? {remaining: futureMonths});
    }
    return;
  }
  const row=node('article','',parent);
  row.className='benefit-row compact-benefit';
  row.dataset.benefitId=benefit.id;
  row.dataset.sources=benefit.sources.join(' ');
  if (benefit.id === 'screening') {
    renderHealthChecks(row);
    return;
  }
  const presentation = presentBenefit(benefit,catalog);
  const {title,description:summary,headline:amount} = presentation;
  const estimate = possible ? null : profileAmount(benefit, option);
  const display = amountDisplay(benefit, section, option, catalog.bases);
  const headline = amount ?? display.headline.replace(/(\d)(?=บาท|รายการ)/g, '$1 ').replace(/(ไม่เกิน|สูงสุด)(?=\d)/g, '$1 ');
  const heading = node('div', '', row);
  heading.className = 'benefit-heading';
  node('h3', title, heading);
  const requiresCalculation = ['sick_income', 'unemployment', 'disability', 'death_grant', 'maternity_income', 'm40_disability'].includes(benefit.id);
  const disabilityRates = benefit.id === 'disability' && estimate?.rates;
  const sickLeave = benefit.id === 'sick_income';
  const formula = !sickLeave && !disabilityRates && !['death_grant', 'unemployment'].includes(benefit.id) &&
    (requiresCalculation || estimate) ? headline : '';
  const cap = benefit.sharedMaxDays?.[option];
  const note = possible ? benefit.exception.note : [summary, cap ? 'เพดานร่วม '+cap+' วัน/ปี' : ''].filter(Boolean).join(' · ');
  const description = [formula, disabilityRates ? '' : note].filter(Boolean).join(' · ');
  if (description) {
    const paragraph = node('p', '', row);
    paragraph.className = 'benefit-note';
    for (const line of description.split('\n')) {
      if (paragraph.hasChildNodes()) paragraph.append(document.createElement('br'));
      paragraph.append(line);
    }
  }
  if (sickLeave) {
    const maximum = estimateCompensation(benefit, {section, option, bases: catalog.bases}, {
      wage: catalog.bases.section33.max, days: 1,
    });
    node('p', presentBenefit(benefit,catalog,{maximum:formatEstimate({total:maximum,qualifier:'สูงสุด'})})
      .sickDescription,row).className='benefit-note';
  }
  const rateItems = estimate?.rates ?? presentation.rates;
  if (rateItems && !estimate?.rates && (amount || presentation.showHeadline)) node('p', headline, heading).className = 'amount money-value';
  if (rateItems) {
    const rates = node('div', '', row);
    rates.className = 'benefit-rates';
    for (const rate of rateItems) {
      const line = node('div', '', rates);
      line.className = 'benefit-rate';
      node('span', rate.label, line);
      const value = rate.display ?? formatEstimate(rate);
      node('p', value, line).className = value.includes('บาท') ? 'amount money-value' : 'amount';
      if (rate.detail) node('p', rate.detail, rates).className = 'benefit-note';
    }
  } else {
    const right = estimate ? formatEstimate(estimate) : requiresCalculation ? '-' : headline;
    const value = node('p', right, heading);
    value.className = 'amount';
    value.classList.toggle('money-value', right.includes('บาท'));
  }
}
function renderAssessment(){const root=$('#result');healthChecksOpen=root.querySelector('.health-checks')?.open??healthChecksOpen;root.replaceChildren();error('');const field=$('#continuous');syncProfile(count(), $('#option').value);field.setAttribute('aria-invalid','false');$('#option-wrap').hidden=section!=='40';$('#continuous-label').textContent=section==='40'?'ส่งสมทบทางเลือกนี้ต่อเนื่อง (เดือน)':'ส่งสมทบ ม.33/39 ต่อเนื่อง (เดือน)';if(!catalogCovers(catalog,month,currentDate())){node('h2','ต้องอัปเดตกฎก่อนประเมิน',root);node('p','ยังไม่มีชุดกฎที่ตรวจทานสำหรับเดือนปัจจุบัน',root);return}if(!field.checkValidity()){field.setAttribute('aria-invalid','true');error('กรอกจำนวนเต็ม 0–1,200 เดือน');return}const n=count();if(n===null)return;const profileCatalog=$('#profile-sex').value==='male'?{...catalog,benefits:catalog.benefits.filter(b=>b.id!=='maternity_income')}:catalog;const result=assessContinuous(profileCatalog,{section,option:$('#option').value,months:n,month,date:currentDate()});const retirement = n > 0 && (section === '40' || n >= catalog.benefits.find(b=>b.id==='pension').amount.thresholdMonths) ? result.future[0] : null;const pension = section !== '40' && retirement;node('h2','ผ่านเกณฑ์เงินสมทบ '+(result.matched.length + Number(Boolean(pension)))+' รายการ',root);if(pension)moneyRow(retirement,root,{future:true});for(const benefit of result.matched)moneyRow(benefit,root);if(!result.matched.length)node('p','ช่วงที่กรอกยังไม่ถึงเกณฑ์เงินสมทบของรายการปกติ',root).className='empty-filter';if(result.possible.length){node('h3','กรณีที่ต้องพิจารณาข้อยกเว้น',root).className='group-heading';result.possible.forEach(b=>moneyRow(b,root,{possible:true}))}if(retirement && section === '40')moneyRow(retirement,root,{future:true});if(result.short.length){const detail=node('details','',root);node('summary','ยังไม่ถึงเกณฑ์จากช่วงที่กรอก '+result.short.length+' รายการ',detail);for(const b of result.short)node('p',b.name+' — อย่างน้อย '+b.gate.min+' เดือน'+(b.gate.window?' ใน '+b.gate.window+' เดือน':''),detail)}}
const guestProfileKey = 'guest';
let profileKey = guestProfileKey;
let profileLoad = 0;
const form = $('#form');
const advisor = $('#advisor');
const renderAdvisor = setupAdvisor(form, advisor);

function updateAdvice() {
  if (form.inert) return;
  renderAdvisor({
    section,
    option: $('#option').value,
    age: profileNumber('#profile-age'),
    today: currentDate(),
    unemployment: catalog.benefits.find(benefit => benefit.id === 'unemployment')?.amount,
  });
}

function render() {
  updateAdvice();
  if (section === 'none') {
    syncProfile(null, $('#option').value);
    $('#option-wrap').hidden = true;
    $('#result').replaceChildren();
    error('');
    return;
  }
  renderAssessment();
}

new MutationObserver(updateAdvice).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang'],
});

const profileFields = [...document.querySelectorAll('#profile input[id], #profile select[id]')]
  .filter(field => field.id !== 'continuous');

async function save() {
  const key = profileKey;
  try {
    await saveDeviceProfile(key, {
      section, option: $('#option').value, months: count(), asOf: month,
      fields: Object.fromEntries(profileFields.map(field => [field.id, field.value])),
    });
  } catch {
    if (profileKey === key) error('เบราว์เซอร์ไม่อนุญาตให้จำข้อมูล');
  }
}

function selectSection(value) {
  section = value;
  document.querySelectorAll('[data-section]').forEach(button =>
    button.setAttribute('aria-pressed', String(button.dataset.section === section)));
}

function restoreProfile(saved) {
  if (!saved) return;
  selectSection(saved.section);
  $('#option').value = saved.option;
  if (saved.months !== null) $('#continuous').value = saved.months;
  for (const field of profileFields) {
    const value = saved.fields[field.id];
    if (typeof value !== 'string') continue;
    if (field.tagName === 'SELECT' && ![...field.options].some(option => option.value === value)) continue;
    field.value = value;
  }
}

document.querySelectorAll('[data-section]').forEach(button => {
  button.onclick = () => {
    selectSection(button.dataset.section);
    render();
    save();
  };
});
form.onsubmit = event => event.preventDefault();
function updateProfile() {
  render();
  save();
}
form.addEventListener('input', updateProfile);
form.addEventListener('change', updateProfile);
form.inert = true;
await initAccount($('.workspace'), async userId => {
  const load = ++profileLoad;
  profileKey = userId ? 'account:' + userId : guestProfileKey;
  form.inert = true;
  form.reset();
  $('#result').replaceChildren();
  advisor.replaceChildren();
  advisor.hidden = true;
  selectSection('33');
  const saved = await loadDeviceProfile(profileKey).catch(() => null);
  if (load !== profileLoad) return;
  restoreProfile(saved);
  $('#profile').open = count() === null && !$('#profile-work').value;
  form.inert = false;
  render();
});
let installEvent;addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;$('#install').hidden=false});$('#install').onclick=async()=>{await installEvent?.prompt();$('#install').hidden=true};if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});


let refreshing = false;
async function refreshRules() {
  if (refreshing || document.hidden) return;
  refreshing = true;
  try {
    let next = catalogData;
    try {
      next = await loadCatalog();
    } catch {
      // Continue using the last validated rules while offline.
    }
    const nextDate=currentDate();
    const active = catalogForDate(next,nextDate);
    catalogData = next;
    if (nextDate !== assessmentDate || active.version !== catalog.version ||
        active.bases.section33.max !== catalog.bases.section33.max) {
      assessmentDate=nextDate;
      month=assessmentDate.slice(0,7);
      catalog = active;
      render();
    }
  } catch {
    // Keep the current catalog if the network fails or the new file is incompatible.
  } finally {
    refreshing = false;
  }
}
document.addEventListener('visibilitychange', refreshRules);
addEventListener('online', refreshRules);
setInterval(refreshRules, 60 * 1000);
