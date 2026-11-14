const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const kinds = new Set(['service','service_schedule','annual_cap','procedure_cap','pregnancy_cap',
  'fixed_per_event','monthly_child','wage_formula','severity_formula','medical_cap','death_tiers',
  'pension_formula','unemployment_formula','daily_fixed','visit_fixed','m40_disability_tiers',
  'option_fixed','m40_savings']);

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}

export function catalogCovers(catalog, month, date=null) {
  if (!monthPattern.test(month)) return false;
  if (!catalog.effectiveFrom) return month === catalog.validMonth;
  if(date) return validDate(date)&&catalog.effectiveFrom<=date&&
    (!catalog.effectiveThrough||date<=catalog.effectiveThrough);
  return catalog.effectiveFrom.slice(0,7) <= month &&
    (!catalog.effectiveThrough || month <= catalog.effectiveThrough.slice(0,7));
}

function merge(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return structuredClone(patch);
  const result = {...base};
  for (const [key, value] of Object.entries(patch)) {
    if (['__proto__','prototype','constructor'].includes(key)) throw Error('Invalid rule key');
    result[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? merge(base?.[key] ?? {}, value) : structuredClone(value);
  }
  return result;
}

export function catalogForDate(catalog, date) {
  if (!validDate(date)) throw Error('Invalid rule date');
  let active = structuredClone(catalog);
  for (const update of [...(catalog.updates ?? [])].sort((a,b) => a.effectiveFrom.localeCompare(b.effectiveFrom))) {
    if (update.effectiveFrom > date) continue;
    const {benefits = [], ...patch} = update;
    active = merge(active, patch);
    for (const benefit of benefits) {
      const index = active.benefits.findIndex(item => item.id === benefit.id);
      if (index < 0) active.benefits.push(structuredClone(benefit));
      else active.benefits[index] = merge(active.benefits[index], benefit);
    }
  }
  const cap = active.retirementContributions.wageCaps.findLast(row => row.from <= date.slice(0,7));
  if (cap) Object.assign(active.bases.section33, {min:cap.min,max:cap.max});
  return active;
}

function checkSnapshot(catalog) {
  if (!Array.isArray(catalog.benefits) || !catalog.benefits.length || !catalog.sources) throw Error('Missing benefits or sources');
  const ids = new Set();
  for (const b of catalog.benefits) {
    if (!b.id || ids.has(b.id) || !b.name || !kinds.has(b.amount?.kind) ||
        !b.presentation?.title || !Number.isInteger(b.gate?.min) || b.gate.min < 0 ||
        !Array.isArray(b.sections) || !b.sections.length || b.sections.some(s => !['33','39','40'].includes(s)) ||
        !Array.isArray(b.sources) || !b.sources.length ||
        b.sources.some(id => !catalog.sources[id] || catalog.sources[id].status === 'draft_not_used')) {
      throw Error('Invalid benefit: ' + b.id);
    }
    ids.add(b.id);
    const a=b.amount;
    const required={
      annual_cap:['value'],pregnancy_cap:['value'],fixed_per_event:['value'],monthly_child:['value','maxChildren'],
      daily_fixed:['value'],visit_fixed:['value','maxVisits'],wage_formula:['rate'],
      death_tiers:['rate'],pension_formula:['baseRate','extraRatePer12','thresholdMonths','averagingMonths','minimumMonthly','extraPeriodMonths'],
      medical_cap:['outpatient','inpatient'],
    }[a.kind]??[];
    if(required.some(key=>!Number.isFinite(a[key])||a[key]<0))throw Error('Missing calculation value: '+b.id);
    if(a.kind==='procedure_cap'&&!(Number.isFinite(a.value)||Number.isFinite(a.min)&&Number.isFinite(a.max)&&a.max>=a.min))
      throw Error('Invalid procedure limits: '+b.id);
    if(a.kind==='unemployment_formula'&&['dismissed','resigned'].some(key=>
      !Number.isFinite(a.rates?.[key])||a.rates[key]<0||a.rates[key]>1||!Number.isInteger(a.maxDays?.[key])))
      throw Error('Invalid unemployment rates');
    if(a.kind==='severity_formula'&&(!Array.isArray(a.rates)||a.rates.length!==2||a.rates.some(rate=>!Number.isFinite(rate)||rate<0||rate>1)))
      throw Error('Invalid disability rates');
    if (b.effectiveFrom && !validDate(b.effectiveFrom)) throw Error('Invalid benefit date: ' + b.id);
    if (b.legalDates !== undefined) checkLegalDates(b.legalDates);
    if (b.effectiveThrough && !validDate(b.effectiveThrough)) throw Error('Invalid benefit end date: ' + b.id);
  }
  for (const id of ['pension','m40_retirement','screening','sick_income','unemployment','death_grant']) {
    if (!ids.has(id)) throw Error('Required benefit missing: ' + id);
  }
  for (const id of ids) {
    for (const source of catalog.benefits.find(b => b.id === id).sources) {
      if (new URL(catalog.sources[source].url).protocol !== 'https:') throw Error('Invalid source URL');
    }
  }
  const caps = catalog.retirementContributions?.wageCaps;
  if (!Array.isArray(caps) || !caps.length || caps.some((row,index) =>
    !monthPattern.test(row.from) || !Number.isFinite(row.min) || !Number.isFinite(row.max) ||
    row.min <= 0 || row.max < row.min || index > 0 && caps[index-1].from >= row.from)) throw Error('Invalid wage ceilings');
  if (!(catalog.bases?.section39?.monthly > 0) || !(catalog.calculation?.daysPerMonth > 0) ||
      !Number.isInteger(catalog.calculation?.retirementAge) || !Array.isArray(catalog.screening)) throw Error('Invalid calculation data');
  for(const table of ['rates','normalRates33']) {
    const rows=catalog.retirementContributions[table];
    if(!Array.isArray(rows)||!rows.length||rows.some((row,index)=>
      !monthPattern.test(row.from)||row.through&&(!monthPattern.test(row.through)||row.through<row.from)||
      index>0&&(!rows[index-1].through||rows[index-1].through>=row.from)||
      ['employee33','employer33',...(table==='rates'?['member39']:[])].some(key=>
        !Number.isFinite(row[key])||row[key]<0||row[key]>1)||
      !row.sources?.length||row.sources.some(id=>!catalog.sources[id]||catalog.sources[id].status==='draft_not_used')))
      throw Error('Invalid contribution rate table: '+table);
  }
  const checkNumbers = value => {
    for (const entry of Object.values(value ?? {})) {
      if (typeof entry === 'number' && (!Number.isFinite(entry) || entry < 0)) throw Error('Invalid rule number');
      if (entry && typeof entry === 'object') checkNumbers(entry);
    }
  };
  checkNumbers(catalog.benefits.map(b => b.amount));
}

function checkLegalDates(entries) {
  if (!Array.isArray(entries) || !entries.length || entries.some(entry =>
    !entry || !validDate(entry.from) || new URL(entry.source).protocol !== 'https:' ||
    (entry.label && ['th', 'en'].some(lang => typeof entry.label[lang] !== 'string' || !entry.label[lang])) ||
    (entry.sections && (!Array.isArray(entry.sections) || !entry.sections.length ||
      entry.sections.some(section => !['33', '39', '40', 'none'].includes(section)))))) {
    throw Error('Invalid legal date');
  }
}

export function validateCatalog(catalog) {
  if (catalog.schemaVersion !== 2 || !catalog.version || !validDate(catalog.reviewedAt) ||
      !validDate(catalog.effectiveFrom) || catalog.effectiveThrough != null &&
      (!validDate(catalog.effectiveThrough) || catalog.effectiveThrough < catalog.effectiveFrom)) {
    throw Error('Invalid catalog version or dates');
  }
  checkSnapshot(catalog);
  for (const entries of Object.values(catalog.advisorDates ?? {})) checkLegalDates(entries);
  const dates = new Set();
  const versions=new Set([catalog.version]);
  for (const update of catalog.updates ?? []) {
    if (!update.version || !validDate(update.effectiveFrom) || !validDate(update.reviewedAt) ||
        update.effectiveFrom < catalog.effectiveFrom || dates.has(update.effectiveFrom)||
        versions.has(update.version)) throw Error('Invalid scheduled update');
    dates.add(update.effectiveFrom);
    versions.add(update.version);
    checkSnapshot(catalogForDate(catalog, update.effectiveFrom));
  }
  return catalog;
}

export function ruleValue(benefit, catalog, path) {
  const amount = benefit.amount;
  const context = {...benefit, amount:{...amount,ratePercent:amount.rate * 100,
    firstTierEnd:amount.tiers?.[1]?.months - 1},
    benefits:Object.fromEntries(catalog.benefits.map(item => [item.id,item]))};
  return path.split('.').reduce((value,key) => value?.[key], context);
}

export function presentBenefit(benefit, catalog, variables={}) {
  const text = value => (value ?? '').replace(/\{([\w.]+)\}/g, (_,path) => {
    const result = variables[path] ?? ruleValue(benefit,catalog,path);
    return typeof result === 'number' && Number.isFinite(result)
      ? result.toLocaleString('th-TH',{maximumFractionDigits:2}) : result ?? '-';
  });
  const p = benefit.presentation;
  return {...p,title:text(p.title),description:text(p.description),headline:p.headline ? text(p.headline) : undefined,
    sickDescription:text(p.sickDescription),
    rates:p.rates?.map(rate => ({...rate,label:text(rate.label),detail:text(rate.detail),
      total:rate.valueRef ? ruleValue(benefit,catalog,rate.valueRef) : rate.total}))};
}
