import {catalogCovers} from './catalog.js';
export function applicableBenefits(catalog,section,option='1',date=null){return catalog.benefits.filter(b=>b.sections.includes(section)&&(!b.options||b.options.includes(option))&&(!date||(!b.effectiveFrom||b.effectiveFrom<=date)&&(!b.effectiveThrough||date<=b.effectiveThrough)))}
export function assessContinuous(catalog,{section,option='1',months,month,date=month+'-01'}){if(!catalogCovers(catalog,month,date))return {status:'stale',matched:[],future:[],short:[],possible:[]};if(!['33','39','40'].includes(section)||!['1','2','3'].includes(option)||!Number.isInteger(months)||months<0||months>1200)return {status:'invalid',matched:[],future:[],short:[],possible:[]};const result={status:'ok',matched:[],future:[],short:[],possible:[]};for(const benefit of applicableBenefits(catalog,section,option,date)){if(benefit.stage==='future'){result.future.push(benefit);continue}if(months>=benefit.gate.min)result.matched.push(benefit);else if(benefit.exception&&months>=benefit.exception.min)result.possible.push(benefit);else result.short.push(benefit)}return result}

export function amountDisplay(b,section,option='1',bases=null) {
  const a=b.amount;
  const money=n=>n.toLocaleString('th-TH',{maximumFractionDigits:2});
  const units={THB:'','THB/day':'/วัน','THB/year':'/ปี','THB/tooth':'/ซี่','THB/person':'/ราย',
    'THB/pregnancy':'/ครรภ์','THB/delivery':'/ครั้ง','THB/visit':'/ครั้ง','THB/child/month':'/คน/เดือน'};
  if (b.id==='maternity_income') {
    const total=bases ? (section==='39'?bases.section39.monthly:bases.section33.max)*a.rate*a.days/30 : null;
    return {headline:total===null?'-':(section==='39'?'':'สูงสุด ')+money(total)+' บาท/ครั้ง',basis:a.text};
  }
  if(a.kind==='procedure_cap') return {headline:(a.value==null?money(a.min)+'–'+money(a.max):money(a.value))+' บาท'+(units[a.unit]??''),basis:''};
  if(Number.isFinite(a.value)) return {headline:('annual_cap'===a.kind?'ไม่เกิน ':a.kind==='pregnancy_cap'?'สูงสุด ':'')+money(a.value)+' บาท'+(units[a.unit]??''),basis:''};
  if(b.id==='sick_income' && bases) {
    const base=section==='39'?bases.section39.monthly:bases.section33.max;
    return {headline:a.rate*100+'% ของฐานค่าจ้างรายวัน',basis:money(base*a.rate)+' บาท'};
  }
  if(b.id==='unemployment') return {headline:'เลิกจ้าง '+a.rates.dismissed*100+'% / ลาออก '+a.rates.resigned*100+'%',basis:a.text};
  if(b.id==='disability') return {headline:a.rates.map(n=>n*100+'%').join(' หรือ ')+' ของฐานค่าจ้าง',basis:a.text};

  if(a.kind==='option_fixed')return {headline:money(a.values[option])+' บาท',basis:'วงเงินตามทางเลือก '+option};
  if(a.kind==='m40_disability_tiers'){
    const key=option==='3'?'opt3':'opt12';
    return {headline:money(a.tiers[0][key])+'–'+money(a.tiers.at(-1)[key])+' บาท/เดือน',basis:a.text};
  }
  if(a.kind==='m40_savings')return {headline:money(a.allocations[option])+' บาทออม/เดือน + ผลตอบแทน',basis:a.text};
  if(b.id==='sick_income'){
    return {headline:a.rate*100+'% ของฐานค่าจ้างรายวัน',basis:a.text};
  }
  if(b.id==='pension')return {headline:'บำนาญ '+a.baseRate*100+'% + ส่วนเพิ่มปีสมทบ',basis:a.text};
  return {headline:a.text,basis:''};
}
