const dayMs = 86400000;
const source = {
  unemployment: 'https://www.sso.go.th/wpr/main/service/กองทุนประกันสังคม_detail_detail_1_125_696/236_236',
  continuation: 'https://www.sso.go.th/wpr/main/service/กองทุนประกันสังคม_detail_detail_1_125_697/237_237',
  health: 'https://region2.prd.go.th/th/content/category/detail/id/9/iid/196638',
  goldCard: 'https://media.nhso.go.th/assets/portals/1/files/UC_69_final.pdf',
  oldAge: 'https://www.sso.go.th/wpr/main/service/กองทุนประกันสังคม_detail_detail_1_125_695/235_235',
  oldAge40: 'https://www.sso.go.th/wpr/main/service/กองทุนประกันสังคม_detail_detail_1_125_698/249_249',
  severance: 'https://www.mol.go.th/forums/topic/เงินชดเชยเกษียนอายุ/หน้า/5/',
  leave: 'https://www.mol.go.th/employee/สิทธิหน้าที่นายจ้าง-ลูกจ้าง',
  provident: 'https://www.sec.or.th/TH/Template3/Articles/2566/281166.pdf',
  allowance: 'https://www.dop.go.th/th/faq/view=967',
  unpaid: 'https://info.go.th/procedure/94e56d2e-7531-4826-a723-08ae42348858/view',
  occupational: 'https://www.sso.go.th/wpr/rayong/service/กองทุนเงินทดแทน_detail_detail_74_126_0/45_45',
  jobs: 'https://www.doe.go.th/prd/lmi-east/news/param/site/116/cat/7/sub/0/pull/detail/view/detail/object_id/99211',
};

const practicalDetails = {
  unemployment: [
    'เริ่มนับสิทธิวันที่ 8 ของการว่างงานเมื่อเข้าเกณฑ์ ขึ้นทะเบียนกับกรมการจัดหางานและรายงานตัวตามนัดทุกเดือน',
    'Eligible payments start on the eighth day of unemployment. Register with the Department of Employment and report monthly as scheduled.',
  ],
  continuation: [
    'สมทบอัตราปกติ 432 บาท/เดือน คุ้มครองรักษาพยาบาล คลอดบุตร ทุพพลภาพ เสียชีวิต สงเคราะห์บุตร และชราภาพ',
    'Standard contribution: THB 432/month. Covers medical care, childbirth, disability, death, child allowance and old age.',
  ],
  health: [
    'ช่วงคุ้มครองต่อครอบคลุมเจ็บป่วย คลอดบุตร ทุพพลภาพ และเสียชีวิต ตามเงื่อนไขของแต่ละกรณี',
    'Extended coverage includes illness, childbirth, disability and death, subject to each benefit’s conditions.',
  ],
  severance: [
    'อายุงาน 120 วันถึงก่อนครบ 1 ปี ได้ 30 วัน · ครบ 1 ปีได้ 90 วัน · ครบ 3 ปีได้ 180 วัน · ครบ 6 ปีได้ 240 วัน · ครบ 10 ปีได้ 300 วัน · ครบ 20 ปีได้ 400 วัน',
    'Minimum service and pay: 120 days → 30 days’ wages, 1 year → 90, 3 years → 180, 6 years → 240, 10 years → 300, 20 years → 400.',
  ],
  leave: [
    'ใช้ได้ทั้งกรณีลาออกและถูกเลิกจ้าง คิดจากค่าจ้างตามจำนวนวันพักร้อนที่มีสิทธิสะสมไว้',
    'Applies to both resignation and dismissal. Payment is based on accrued eligible leave days and wages.',
  ],
  provident: [
    'ยอดขึ้นกับเงินสะสม เงินสมทบนายจ้างตามข้อบังคับกองทุน และผลการลงทุน กรณีเกษียณตั้งแต่อายุ 55 ปีและเป็นสมาชิกต่อเนื่องอย่างน้อย 5 ปี อาจได้รับยกเว้นภาษีตามเกณฑ์',
    'The balance depends on your savings, vested employer contributions and investment returns. Retirement from age 55 with at least 5 continuous years of membership may qualify for tax exemption.',
  ],
  oldAge: [
    'ส่งน้อยกว่า 12 เดือน รับส่วนที่ตนจ่ายเพื่อชราภาพ ตั้งแต่ 12 เดือนแต่ไม่ครบ 180 เดือน รวมส่วนของนายจ้างและผลตอบแทนตามเกณฑ์ ยื่นขอรับเงินที่สำนักงานประกันสังคม',
    'Under 12 months: your old-age contributions. From 12 to 179 months: applicable employer contributions and returns are included. Apply with the Social Security Office.',
  ],
  oldAge40: [
    'ทางเลือก 2 สะสมเพื่อชราภาพ 50 บาท/งวด ทางเลือก 3 สะสม 150 บาท/งวด และมีเงินเพิ่ม 10,000 บาทเมื่อส่งครบ 180 งวด รวมผลตอบแทนตามที่ สปส. กำหนด',
    'Option 2 allocates THB 50 per contribution and option 3 allocates THB 150. Option 3 adds THB 10,000 after 180 contributions. Returns follow SSO rules.',
  ],
  allowance: [
    'ใช้บัตรประชาชนและทะเบียนบ้านยืนยันสิทธิที่เทศบาล อบต. หรือสำนักงานเขต หากรับสวัสดิการประจำจากรัฐ ให้ท้องถิ่นตรวจคุณสมบัติ',
    'Confirm with your municipality, subdistrict office or district office using your ID and household registration. Regular public benefits can affect eligibility.',
  ],
  unpaid: [
    'ยื่นที่สำนักงานสวัสดิการและคุ้มครองแรงงานจังหวัดหรือพื้นที่กรุงเทพฯ เตรียมบัตรประจำตัวและหลักฐานการจ้างหรือเลิกจ้างที่มี',
    'Contact the provincial or Bangkok labour protection office. Bring identification and available employment or dismissal records.',
  ],
  occupational: [
    'ยื่นแบบ กท.16 ที่สำนักงานประกันสังคม พร้อมหลักฐานทางการแพทย์และข้อมูลการทำงานเดิม',
    'Submit form KT.16 to the Social Security Office with medical evidence and details of your previous work.',
  ],
  jobs: [
    'ค้นหาตำแหน่งงานผู้สูงอายุผ่านระบบไทยมีงานทำของกรมการจัดหางานได้ฟรี',
    'Search vacancies for older workers for free through the Department of Employment’s Thai Mee Ngan Tham service.',
  ],
};

const goldCardServices = [
  ['รักษาทั่วไปและโรคเรื้อรัง', 'General and chronic care',
    'ตรวจ วินิจฉัย ยาตามเกณฑ์ ผ่าตัด และนอนโรงพยาบาลตามความจำเป็น เริ่มที่หน่วยบริการประจำหรือหน่วยที่เข้าร่วม',
    'Covered visits, diagnosis, medicines, surgery and inpatient care as needed. Start with your registered or participating provider.'],
  ['รักษาเฉพาะทาง', 'Specialist care',
    'ครอบคลุมบริการตามเกณฑ์ เช่น รักษามะเร็งและบำบัดทดแทนไต ให้หน่วยบริการประเมินและประสานส่งต่อ',
    'Covered specialist care includes eligible cancer treatment and kidney replacement therapy. Your provider assesses and coordinates referral.'],
  ['ทันตกรรม', 'Dental care',
    'อุดฟัน ถอนฟัน ขูดหินปูน และฟันเทียมตามเกณฑ์ คลินิกทันตกรรมชุมชนอบอุ่นที่เข้าร่วมให้บริการพื้นฐานตามรายการและจำนวนครั้งที่กำหนด',
    'Eligible fillings, extractions, scaling and dentures. Participating community dental clinics provide designated basic services within visit limits.'],
  ['ป้องกันโรคและดูแลแม่และเด็ก', 'Prevention and maternal and child care',
    'วัคซีน คัดกรองตามวัย ฝากครรภ์ คลอด และดูแลหลังคลอดตามเกณฑ์',
    'Eligible vaccination, age-based screening, antenatal care, delivery and postpartum care.'],
  ['ฟื้นฟูและดูแลต่อเนื่อง', 'Rehabilitation and follow-up',
    'กายภาพบำบัด อุปกรณ์ช่วยเหลือ และบริการฟื้นฟูตามการประเมินของหน่วยบริการ',
    'Physiotherapy, assistive devices and rehabilitation based on a provider assessment.'],
  ['ฉุกเฉินวิกฤต', 'Critical emergency',
    'ไปโรงพยาบาลใกล้ที่สุดหรือโทร 1669 เมื่อเข้าเกณฑ์ UCEP ใช้สิทธิได้จนพ้นวิกฤตหรือย้ายได้อย่างปลอดภัย ภายใน 72 ชั่วโมง',
    'Go to the nearest hospital or call 1669. Eligible UCEP care continues until stable or safe to transfer, for up to 72 hours.'],
];

export const workStatuses = [
  ['', 'เลือกสถานะ', 'Select status'],
  ['employed', 'ทำงานเป็นลูกจ้าง', 'Employed'],
  ['planning', 'กำลังจะออกจากงาน', 'Planning to leave a job'],
  ['laid-off', 'ถูกเลิกจ้าง', 'Laid off'],
  ['resigned', 'ลาออก', 'Resigned'],
  ['contract-ended', 'หมดสัญญา', 'Contract ended'],
  ['retired', 'เกษียณ', 'Retired'],
  ['self-employed', 'ประกอบอาชีพอิสระ', 'Self-employed'],
  ['not-working', 'ไม่ได้ทำงาน', 'Not working'],
];

const endedStatuses = ['laid-off', 'resigned', 'contract-ended', 'retired'];
const statusesBySection = {
  '33': ['', 'employed', 'planning', ...endedStatuses],
  '39': ['', 'retired', 'self-employed', 'not-working'],
  '40': ['', 'retired', 'self-employed', 'not-working'],
  none: workStatuses.map(([value]) => value),
};

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return null;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value ? date : null;
}

function dateString(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  return new Date(+date + days * dayMs);
}

function addMonths(date, months) {
  const next = new Date(+date);
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + months + 1, 0);
  next.setUTCDate(Math.min(date.getUTCDate(), next.getUTCDate()));
  return next;
}

export function employmentDateKind(status) {
  if (status === 'planning') return 'planned';
  return endedStatuses.includes(status) ? 'actual' : null;
}

export function benefitAdvice({status, section, option, age, endDate, today, unemployment}) {
  if (!statusesBySection[section]?.includes(status)) status = '';
  const advice = [];
  const add = (id, title, detail, date, action) =>
    advice.push({id, title, detail, date: date && dateString(date), source: source[id], action});
  const kind = employmentDateKind(status);
  const entered = parseDate(endDate);
  const date = entered && (kind === 'planned' ? endDate >= today : kind === 'actual' && endDate <= today) ? entered : null;
  const ageKnown = Number.isInteger(age) && age >= 15 && age <= 120;

  if (kind && ['33', '39'].includes(section)) {
    if (status !== 'retired') {
      add('unemployment', ['ขึ้นทะเบียนว่างงาน', 'Register as unemployed'], [
        'ภายใน 30 วันหลังสิ้นสุดการจ้าง ต้องเคยส่ง ม.33 อย่างน้อย 6 เดือนใน 15 เดือนก่อนว่างงาน และยังไม่มีสิทธิรับเงินชราภาพ',
        'Within 30 days of leaving. Requires at least 6 Section 33 contribution months in the previous 15 months and no old-age benefit entitlement.',
      ], date && addDays(date, 30), ['https://e-service.doe.go.th/', 'ขึ้นทะเบียน', 'Register']);
    }
    if (section === '33') {
      const sixMonths = date && addMonths(date, 6);
      add('continuation', ['สมัคร ม.39', 'Apply for Section 39'], [
        'สมัครภายใน 6 เดือน หากเคยส่ง ม.33 อย่างน้อย 12 เดือน การรับเงินชราภาพต้องรอจนสิ้นสุดสถานะ ม.39',
        'Apply within 6 months if you contributed under Section 33 for at least 12 months. Old-age benefits start after Section 39 coverage ends, if eligible.',
      ], sixMonths, ['https://eself.sso.go.th/', 'สมัครกับ สปส.', 'Apply with SSO']);
      add('health', ['ตรวจสิทธิรักษาพยาบาล', 'Check healthcare coverage'], [
        'หากเข้าเกณฑ์ ใช้สิทธิประกันสังคมต่อได้ 6 เดือน หากไม่ได้ต่อ ม.39 ให้ตรวจสิทธิบัตรทองเมื่อครบกำหนด',
        'If eligible, your Social Security coverage continues for 6 months. Check Gold Card eligibility when it ends if you do not continue under Section 39.',
      ], sixMonths);
    }
  }

  if (['employed', 'planning', 'laid-off', 'contract-ended', 'retired'].includes(status)) {
    add('severance', ['ค่าชดเชยจากนายจ้าง', 'Employer severance'], [
      'กรณีเลิกจ้างหรือเกษียณตามกฎหมาย เมื่อเข้าเกณฑ์ได้รับ 30–400 วันของค่าจ้างอัตราสุดท้าย ตามอายุงานกับนายจ้าง',
      'Qualifying dismissal or retirement pays 30–400 days of final wages based on service with that employer.',
    ]);
  }
  if (kind) {
    add('leave', ['ค่าจ้างวันพักร้อนสะสม', 'Accrued annual leave pay'], [
      'ตรวจยอดวันพักร้อนสะสมที่มีสิทธิรับค่าจ้างกับนายจ้าง',
      'Check your payable accrued annual leave with your employer.',
    ]);
    add('provident', ['กองทุนสำรองเลี้ยงชีพ', 'Provident fund'], [
      'ถ้าเป็นสมาชิก ขอรับยอดและเงื่อนไขการรับเงินจากนายจ้างหรือผู้จัดการกองทุน',
      'Members can request their balance and payout terms from their employer or fund manager.',
    ]);
  }
  if (endedStatuses.includes(status)) {
    add('unpaid', ['กองทุนสงเคราะห์ลูกจ้าง', 'Employee Welfare Fund'], [
      'หากนายจ้างค้างค่าชดเชย ติดต่อพนักงานตรวจแรงงานเพื่อยื่นคำร้องและตรวจสิทธิเงินสงเคราะห์',
      'If severance remains unpaid, contact a labour inspector about filing a claim and checking fund eligibility.',
    ]);
    add('occupational', ['โรคจากงานเดิม', 'Work-related illness after leaving'], [
      'หากเกิดโรคจากงานเดิมหลังออกจากงาน ยื่นกองทุนเงินทดแทนภายใน 2 ปีนับจากวันที่ทราบว่าเจ็บป่วย',
      'For a work-related illness arising after employment ends, file a Workers’ Compensation Fund claim within 2 years of learning of the illness.',
    ]);
  }
  if (section === 'none' || section === '40' || (section === '33' && kind)) {
    const transition = section === '33';
    add('goldCard', ['สิทธิบัตรทอง (30 บาท)', 'Gold Card healthcare'], [
      (transition ? 'ใช้ได้เมื่อความคุ้มครองรักษาพยาบาลจากประกันสังคมสิ้นสุดและไม่ได้ต่อ ม.39 · ' : '') +
        'สำหรับคนไทยที่มีเลขประจำตัวประชาชน 13 หลักและไม่มีสิทธิรักษาพยาบาลของรัฐอื่น',
      (transition ? 'Available after Social Security healthcare ends if you do not continue under Section 39. ' : '') +
        'For Thai citizens with a 13-digit national ID and no other public healthcare coverage.',
    ], null, ['tel:1330', 'โทร สปสช. 1330', 'Call NHSO 1330']);
  }
  if (status && section === '40' && ['2', '3'].includes(option)) {
    add('oldAge40', ['บำเหน็จชราภาพ ม.40', 'Section 40 old-age lump sum'], [
      'ยื่นเมื่ออายุครบ 60 ปีและสิ้นสุดสถานะ ม.40',
      'Apply from age 60 after Section 40 coverage ends.',
    ]);
  } else if (status && ['33', '39'].includes(section)) {
    add('oldAge', ['เงินชราภาพ ม.33/39', 'Section 33/39 old-age benefit'], [
      'ยื่นเมื่ออายุครบ 55 ปีและสิ้นสุดสถานะ ม.33/39 ส่งครบ 180 เดือนรับบำนาญ ส่งไม่ครบรับบำเหน็จตามเกณฑ์',
      'Apply from age 55 after Section 33/39 coverage ends. At least 180 contribution months qualify for a pension. Shorter histories may qualify for a lump sum.',
    ]);
  }
  if (ageKnown && age >= 60) {
    const amount = age >= 90 ? '1,000' : age >= 80 ? '800' : age >= 70 ? '700' : '600';
    add('allowance', ['เบี้ยยังชีพผู้สูงอายุ', 'Older person’s allowance'], [
      amount + ' บาท/เดือน หากเข้าเกณฑ์ ยืนยันสิทธิกับท้องถิ่นตามทะเบียนบ้าน',
      'THB ' + amount + '/month if eligible. Confirm with your local authority.',
    ]);
  }
  if (age >= 60 && (endedStatuses.includes(status) || status === 'not-working')) {
    add('jobs', ['หางานและฝึกอาชีพผู้สูงอายุ', 'Jobs and skills training for older people'], [
      'กรมการจัดหางานมีบริการหางานและแนะแนวอาชีพอิสระ',
      'The Department of Employment offers job matching and guidance for self-employment.',
    ]);
  }
  const jobless = advice.find(item => item.id === 'unemployment');
  if (jobless && unemployment) {
    const rate = reason => Math.round(unemployment.rates[reason] * 100);
    const dismissed = rate('dismissed');
    const resigned = rate('resigned');
    const {dismissed: dismissalDays, resigned: resignationDays} = unemployment.maxDays;
    jobless.payment = [
      'เลิกจ้าง ' + dismissed + '% ไม่เกิน ' + dismissalDays + ' วัน · ลาออกหรือหมดสัญญา ' + resigned + '% ไม่เกิน ' + resignationDays + ' วัน ของฐานค่าจ้างรายวัน',
      'Daily wage basis: dismissed ' + dismissed + '% up to ' + dismissalDays + ' days; resigned or contract ended ' + resigned + '% up to ' + resignationDays + ' days.',
    ];
  }
  return advice;
}

const escapeCalendar = text => text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/[;,]/g, '\\$&');

export function reminderCalendar(items, today, now = new Date()) {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Social Security Benefits//Reminders//EN', 'CALSCALE:GREGORIAN'];
  for (const item of items) {
    if (!item.date || item.date < today) continue;
    lines.push('BEGIN:VEVENT', 'UID:' + item.id + '-' + item.date + '@social-security-benefits',
      'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + item.date.replace(/-/g, ''),
      'SUMMARY:' + escapeCalendar(item.title), 'DESCRIPTION:' + escapeCalendar(item.detail),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + escapeCalendar(item.title),
      'END:VALARM', 'END:VEVENT');
  }
  const encoder = new TextEncoder();
  const folded = lines.flatMap(line => {
    const chunks = [];
    let chunk = '', bytes = 0;
    for (const character of line) {
      const size = encoder.encode(character).length;
      if (bytes + size > 75) {
        chunks.push(chunk);
        chunk = ' ';
        bytes = 1;
      }
      chunk += character;
      bytes += size;
    }
    return [...chunks, chunk];
  });
  return [...folded, 'END:VCALENDAR', ''].join('\r\n');
}

export function setupAdvisor(form, panel) {
  const status = form.querySelector('#profile-work');
  const dateFields = {
    planned: form.querySelector('#profile-planned-end'),
    actual: form.querySelector('#profile-ended'),
  };
  const options = workStatuses.map(([value, thai]) => new Option(thai, value));
  status.replaceChildren(...options);
  let displayedSection;
  form.addEventListener('reset', () => {
    displayedSection = undefined;
    status.replaceChildren(...options);
  });

  const node = (parent, tag, content, className) => {
    const element = document.createElement(tag);
    element.textContent = content;
    if (className) element.className = className;
    parent.append(element);
    return element;
  };

  function render(profile) {
    const english = document.documentElement.lang === 'en';
    const language = Number(english);
    if (!english) {
      options.forEach((option, index) => {
        const thai = workStatuses[index][1];
        if (option.textContent !== thai) option.textContent = thai;
      });
    }
    if (displayedSection !== profile.section) {
      const selected = status.value;
      const allowed = statusesBySection[profile.section];
      status.replaceChildren(...options.filter(option => allowed.includes(option.value)));
      status.value = allowed.includes(selected) ? selected : '';
      displayedSection = profile.section;
    }
    const kind = profile.section === '33' ? employmentDateKind(status.value) : null;
    for (const [type, field] of Object.entries(dateFields)) {
      field.closest('label').hidden = kind !== type;
    }
    dateFields.planned.min = profile.today;
    dateFields.actual.max = profile.today;
    const field = kind && dateFields[kind];
    const advice = benefitAdvice({...profile, status: status.value, endDate: field?.validity.valid ? field.value : ''});
    panel.replaceChildren();
    panel.hidden = advice.length === 0;
    if (!advice.length) return;

    const dateFormat = new Intl.DateTimeFormat(english ? 'en-GB' : 'th-TH', {
      dateStyle: 'medium', timeZone: 'UTC',
    });
    const calendarItems = [];
    node(panel, 'h2', english ? 'Your benefits checklist' : 'สิทธิที่ควรตรวจสอบ');
    if (field?.value && !field.validity.valid) {
      node(panel, 'p', english ? 'Check the employment end date.' : 'โปรดตรวจสอบวันที่สิ้นสุดการจ้าง', 'advisor-date');
    }
    const list = node(panel, 'ul', '', 'advisor-list');
    for (const item of advice) {
      const title = item.title[language];
      const detail = item.detail[language];
      const row = node(list, 'li', '', 'advisor-item');
      node(row, 'h3', title);
      node(row, 'p', detail);
      if (item.payment) node(row, 'p', item.payment[language]);
      if (practicalDetails[item.id]) node(row, 'p', practicalDetails[item.id][language]);
      if (item.id === 'goldCard') {
        row.classList.add('advisor-gold-card');
        node(row, 'p', english
          ? 'Choose a regular provider through the NHSO app, LINE or a public health facility. Show your national ID when using a covered service.'
          : 'เลือกหน่วยบริการประจำผ่านแอป สปสช., LINE สปสช. หรือสถานพยาบาลรัฐ และแสดงบัตรประชาชนเมื่อใช้บริการตามสิทธิ');
        const services = node(row, 'dl', '', 'advisor-services');
        for (const service of goldCardServices) {
          node(services, 'dt', service[language]);
          node(services, 'dd', service[language + 2]);
        }
      }
      if (item.date) {
        const remaining = Math.round((+parseDate(item.date) - +parseDate(profile.today)) / dayMs);
        let timing;
        if (english) {
          timing = remaining < 0 ? 'Past due' : remaining === 0 ? 'Today' : remaining + (remaining === 1 ? ' day left' : ' days left');
        } else {
          timing = remaining < 0 ? 'พ้นกำหนด' : remaining === 0 ? 'วันนี้' : 'อีก ' + remaining + ' วัน';
        }
        const date = node(row, 'time', dateFormat.format(parseDate(item.date)) + ' · ' + timing, 'advisor-date');
        date.dateTime = item.date;
        date.dataset.urgent = String(remaining >= 0 && remaining <= 7);
        if (remaining >= 0) calendarItems.push({...item, title, detail});
      }
      if (item.action) node(row, 'a', item.action[language + 1]).href = item.action[0];
    }
    if (calendarItems.length) {
      const button = node(panel, 'button', english ? 'Download calendar reminders' : 'ดาวน์โหลดไฟล์เตือนลงปฏิทิน', 'advisor-calendar');
      button.type = 'button';
      button.onclick = () => {
        const file = new Blob([reminderCalendar(calendarItems, profile.today)], {type: 'text/calendar;charset=utf-8'});
        const url = URL.createObjectURL(file);
        const download = document.createElement('a');
        download.href = url;
        download.download = 'benefit-reminders.ics';
        download.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
    }
    const references = node(panel, 'details', '', 'advisor-references');
    node(references, 'summary', english ? 'Official sources' : 'แหล่งอ้างอิง');
    for (const item of advice) node(references, 'a', item.title[language]).href = item.source;
  }

  return render;
}
