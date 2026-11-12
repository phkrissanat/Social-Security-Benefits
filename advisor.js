const dayMs = 86400000;
const source = {
  unemployment: 'https://www.sso.go.th/wpr/main/service/กองทุนประกันสังคม_detail_detail_1_125_696/236_236',
  continuation: 'https://www.sso.go.th/wpr/main/service/กองทุนประกันสังคม_detail_detail_1_125_697/237_237',
  health: 'https://region2.prd.go.th/th/content/category/detail/id/9/iid/196638',
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

export function benefitAdvice({status, section, option, age, endDate, today}) {
  const advice = [];
  const add = (id, title, detail, date, action) =>
    advice.push({id, title, detail, date: date && dateString(date), source: source[id], action});
  const kind = employmentDateKind(status);
  const entered = parseDate(endDate);
  const date = entered && (kind === 'planned' ? endDate >= today : kind === 'actual' && endDate <= today) ? entered : null;
  if (!status) return advice;
  const ageKnown = Number.isInteger(age) && age >= 15 && age <= 120;

  if (kind && section !== '40') {
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
  if (section === '40' && ['2', '3'].includes(option)) {
    add('oldAge40', ['บำเหน็จชราภาพ ม.40', 'Section 40 old-age lump sum'], [
      'ยื่นเมื่ออายุครบ 60 ปีและสิ้นสุดสถานะ ม.40',
      'Apply from age 60 after Section 40 coverage ends.',
    ]);
  } else if (section !== '40') {
    add('oldAge', ['เงินชราภาพ ม.33/39', 'Section 33/39 old-age benefit'], [
      'ยื่นเมื่ออายุครบ 55 ปีและสิ้นสุดสถานะ ม.33/39 ส่งครบ 180 เดือนรับบำนาญ ส่งไม่ครบรับบำเหน็จตามเกณฑ์',
      'Apply from age 55 after Section 33/39 coverage ends. At least 180 contribution months qualify for a pension. Shorter histories may qualify for a lump sum.',
    ]);
  }
  if (ageKnown) {
    const amount = age >= 90 ? '1,000' : age >= 80 ? '800' : age >= 70 ? '700' : '600';
    add('allowance', ['เบี้ยยังชีพผู้สูงอายุ', 'Older person’s allowance'], age < 60 ? [
      'เริ่มที่ 600 บาท/เดือนเมื่ออายุครบ 60 ปีและเข้าเกณฑ์ ยืนยันสิทธิกับท้องถิ่นตามทะเบียนบ้าน',
      'Starts at THB 600/month from age 60 if eligible. Confirm with your local authority.',
    ] : [
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
  for (const [value, thai] of workStatuses) status.add(new Option(thai, value));

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
    const kind = employmentDateKind(status.value);
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
      node(row, 'a', english ? 'Official criteria' : 'เกณฑ์ทางการ').href = item.source;
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
  }

  return render;
}
