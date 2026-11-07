export function retirementEstimate({section,option='1',months,averageBase=null,contributions=null,maxBase=17500,pensionRules=null,savingsRules=null}){if(!['33','39','40'].includes(section)||!Number.isInteger(months)||months<0||months>1200)return {type:'invalid'};if(section==='40'){if(!['2','3'].includes(option))return {type:'not_covered'};const principal=months*(savingsRules?.allocations[option]??(option==='2'?50:150)),bonus=option==='3'&&months>=(savingsRules?.bonusOption3.months??180)?(savingsRules?.bonusOption3.value??10000):0;return {type:'savings',amount:principal+bonus,principal,bonus,includesReturns:false}}if(months>=(pensionRules?.thresholdMonths??180)){const rate=(pensionRules?.baseRate??.2)+(pensionRules?.extraRatePer12??.015)*Math.floor((months-(pensionRules?.thresholdMonths??180))/(pensionRules?.extraPeriodMonths??12));if(averageBase===null)return {type:'pension',rate,amount:null};if(!Number.isFinite(averageBase)||averageBase<=0||averageBase>maxBase)return {type:'invalid_base'};return {type:'pension',rate,amount:Math.max(pensionRules?.minimumMonthly??720,Math.round(averageBase*rate*100)/100),minimum:pensionRules?.minimumMonthly??720}}if(contributions===null)return {type:'lump',amount:null,employeeOnly:months<12,includesReturns:false};if(!Number.isFinite(contributions)||contributions<0)return {type:'invalid_contributions'};return {type:'lump',amount:contributions,employeeOnly:months<12,includesReturns:false}}
export function renderRetirement(parent,{section,option,months,value=null,savings=null,age=null,maxBase,benefit,calculation}){const el=(tag,text,target=parent)=>{const n=document.createElement(tag);n.textContent=text;target.append(n);return n};const row=el('article','');row.className='benefit-row retirement-card';row.dataset.benefitId=section==='40'?'m40_retirement':'pension';const heading=el('div','',row);heading.className='benefit-heading';el('h3','เงินชราภาพ',heading);const amount=el('p','',heading);amount.className='amount';amount.id='retirement-amount';const detail=el('p','',row);detail.className='basis';const kind=section==='40'?'savings':months>=(benefit.amount.thresholdMonths)?'pension':'lump';const r=retirementEstimate({section,option,months,averageBase:kind==='pension'?value:null,maxBase,contributions:kind==='lump'?value:null,pensionRules:section==='40'?null:benefit.amount,savingsRules:section==='40'?benefit.amount:null});const currency=n=>n.toLocaleString('th-TH',{maximumFractionDigits:2});const presentation=benefit.presentation;row.retirementPresentation=presentation;row.retirementAge=calculation.retirementAge;
if (kind === 'savings') {
  heading.firstElementChild.textContent = presentation.title;
  amount.classList.add('retirement-balance');
  amount.textContent = currency(r.principal) + ' บาท';
  detail.textContent = presentation.balanceNote;
  if (r.bonus) {
    const bonus = el('div', '', row);
    bonus.className = 'benefit-heading retirement-pension';
    el('h3', presentation.bonusTitle.replace('{months}',benefit.amount.bonusOption3.months), bonus);
    el('strong', currency(r.bonus) + ' บาท', bonus).className = 'retirement-balance';
  }
  el('p', (age !== null && age < 60 ? 'ยังไม่ครบเกณฑ์อายุ · ' : '') +
    'รับเงินก้อนเมื่ออายุครบ 60 ปีและไม่ส่ง ม.40 ต่อ', row).className = 'basis';
  return row;
}
row.insertBefore(amount, detail.nextSibling);
heading.firstElementChild.textContent = presentation.title;
const balance = el('strong', '', heading);
balance.className = 'retirement-balance';
const balanceNote = el('p', '', row);
balanceNote.className = 'basis';
row.insertBefore(balanceNote, detail);
if (savings && savings.covered === savings.months) {
  const total = savings.employee + savings.employer;
  balance.textContent = currency(total)+' บาท';
  balanceNote.textContent = presentation.balanceNote;
} else {
  balance.textContent = '-';
}
if (kind === 'pension') {
  const pensionHeading = el('div', '', row);
  pensionHeading.className = 'benefit-heading retirement-pension';
  el('h3', presentation.pensionTitle, pensionHeading);
  pensionHeading.append(amount);
  row.insertBefore(pensionHeading, detail);
}
if (r.type.startsWith('invalid')) {
  amount.textContent = '-';
  return row;
}
if (r.type === 'pension') {
  amount.textContent = r.amount === null ? '-' : currency(r.amount) + ' บาท/เดือน';
  if (r.amount !== null) {
    const rate = Math.round(r.rate * 10000) / 100;
    detail.append(
      ...presentation.pensionDescription.replace('{rate}',rate).replace('{base}',currency(value))
        .split('\n').flatMap((line,index)=>index?[document.createElement('br'),line]:[line]),
    );
  }
} else if (r.type === 'lump') {
  amount.textContent = r.amount === null ? '-' : 'เงินต้นบำเหน็จ ' + currency(r.amount) + ' บาท';
  detail.textContent = r.employeeOnly
    ? 'อายุ 55 ปีและสิ้นสุดสถานะ · เฉพาะส่วนที่จ่ายเอง'
    : 'อายุ 55 ปีและสิ้นสุดสถานะ · ส่วนตนและนายจ้าง ยังไม่รวมผลตอบแทน';
}
return row;
}

export function estimateRetirementContributions(rules, { section, months, month, wage, months39, normalCeiling = false }) {
  if (!rules || !['33', '39'].includes(section) || !Number.isInteger(months) || months < 0 || months > 1200 ||
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const recent39 = section === '39' ? months39 ?? months : 0;
  normalCeiling = section === '33' && normalCeiling;
  if (normalCeiling) wage = null;
  if (!Number.isInteger(recent39) || recent39 < 0 || recent39 > months) return null;
  if (months > recent39 && wage != null && (!Number.isFinite(wage) || wage <= 0)) return null;
  const fullCeiling = months > recent39 && wage == null;
  const [year, calendarMonth] = month.split('-').map(Number);
  let employee = 0;
  let employer = 0;
  let covered = 0;
  let boundedMonths = 0;
  let extraCeiling = 0;
  for (let offset = 1; offset <= months; offset++) {
    const serial = year * 12 + calendarMonth - 1 - offset;
    const period = String(Math.floor(serial / 12)).padStart(4, '0') + '-' + String(serial % 12 + 1).padStart(2, '0');
    const rates = normalCeiling ? rules.normalRates33 ?? [] : rules.rates;
    const rate = rates.find(row => row.from <= period && (!row.through || period <= row.through));
    const cap = rules.wageCaps.findLast(row => row.from <= period);
    const voluntary = offset <= recent39;
    if (!voluntary && !cap) continue;
    const base = voluntary ? rules.base39 : Math.min(cap.max, Math.max(cap.min, wage ?? cap.max));
    if (!rate) {
      const total = !normalCeiling && rules.totalOnly?.find(row => row.from <= period && period <= row.through);
      if (total) {
        boundedMonths++;
        extraCeiling += voluntary ? total.member39Baht * 100
          : Math.round(base * total.employee33) * 100 + Math.round(base * total.employer33) * 100;
      }
      continue;
    }
    employee += Math.round(base * (voluntary ? rate.member39 : rate.employee33) * 100);
    employer += voluntary ? 0 : Math.round(base * rate.employer33 * 100);
    covered++;
  }
  return { employee: employee / 100, employer: employer / 100, covered, months, ...(boundedMonths ? {boundedMonths, extraCeiling: extraCeiling / 100} : {}), ...(fullCeiling ? { fullCeiling } : {}), ...(normalCeiling ? { normalCeiling } : {}) };
}
export function estimatePensionBase(rules, { section, month, wage, months39, futureMonths = null, averagingMonths = 60 }) {
  if (!rules || !['33', '39'].includes(section) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const recent39 = section === '39' ? months39 ?? averagingMonths : 0;
  if (!Number.isInteger(recent39) || recent39 < 0) return null;
  if (recent39 < averagingMonths && wage != null && (!Number.isFinite(wage) || wage <= 0)) return null;
  const [year, calendarMonth] = month.split('-').map(Number);
  let sum = 0;
  for (let offset = 1; offset <= averagingMonths; offset++) {
    if (offset <= recent39) {
      sum += rules.base39;
      continue;
    }
    const date = new Date(Date.UTC(year, calendarMonth - 1 - offset, 1));
    const period = date.toISOString().slice(0, 7);
    const cap = rules.wageCaps.findLast(row => row.from <= period);
    if (!cap) return null;
    const wageForMonth = futureMonths === null || offset <= futureMonths ? wage : null;
    sum += Math.min(cap.max, Math.max(cap.min, wageForMonth ?? cap.max));
  }
  return sum / averagingMonths;
}
export function forecastRetirementContributions(rules, {section, option, month, age, wage, normalCeiling, allocation, savings, months, retirementAge=60}) {
  if (!Number.isInteger(age) || age < 15 || age > 120 || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const remaining = Math.max(retirementAge - age, 0) * 12;
  if (section === '40' && Number.isFinite(allocation)) {
    return {remaining, additional: remaining * allocation, total: (months + remaining) * allocation};
  }
  const endMonth = String(Number(month.slice(0, 4)) + remaining / 12) + month.slice(4);
  const projected = estimateRetirementContributions(rules, {
    section, months: remaining, month: endMonth, wage, normalCeiling,
  });
  if (!projected || projected.covered !== remaining) return null;
  const additional = projected.employee + projected.employer;
  const historyCovered = savings && savings.covered + (savings.boundedMonths ?? 0) === savings.months;
  const total = historyCovered ? savings.employee + savings.employer + additional : null;
  return {remaining, additional, total, upper: total === null ? null : total + (savings.extraCeiling ?? 0)};
}

export function renderRetirementForecast(row, forecast) {
  if (!forecast) return;
  const money = value => value.toLocaleString('th-TH', {maximumFractionDigits: 2});
  const box = document.createElement('div');
  box.className = 'retirement-forecast';
  const add = (label, value) => {
    const line = document.createElement('div');
    line.className = 'forecast-line';
    const left = document.createElement('span');
    const right = document.createElement('strong');
    left.textContent = label;
    right.textContent = value;
    line.append(left, right);
    box.append(line);
  };
  const additional = Number.isFinite(forecast.additional) ? money(forecast.additional) + ' บาท' : '-';
  const labels=row.retirementPresentation;
  const label=value=>value.replace('{age}',row.retirementAge).replace('{months}',forecast.remaining);
  add(label(labels.additionalLabel),additional);
  const total = Number.isFinite(forecast.total) && !(forecast.upper > forecast.total)
    ? money(forecast.total) + ' บาท' : '-';
  add(label(labels.totalLabel),total);
  const note = document.createElement('p');
  note.className = 'basis';
  note.textContent = additional === '-' ? '' : labels.forecastNote;
  box.append(note);
  row.insertBefore(box, row.dataset.benefitId === 'pension' ? row.querySelector('.retirement-pension') : null);
}
