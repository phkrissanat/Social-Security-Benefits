import {workStatuses} from './advisor.js?v=45';

const phrases = new Map(`
ไม่มีประกันสังคม|No Social Security
สถานะการทำงาน|Employment status
วันที่คาดว่าจะออกจากงาน|Expected last day of work
วันที่สิ้นสุดการจ้าง|Employment end date
สิทธิประกันสังคม|Social Security Benefits
ประเมินสิทธิเบื้องต้นตามประกาศของ สปส โปรดตรวจสอบกับหน่วยงานที่เกี่ยวข้องอีกครั้งเพื่อรับสิทธิ|Preliminary assessment based on Social Security Office announcements. Please confirm your eligibility with the relevant agency before claiming benefits.
ประเมินสิทธิประกันสังคมจากข้อมูลที่คุณกรอก พร้อมแหล่งอ้างอิงทางการ|Estimate Thai Social Security benefits from your profile
ติดตั้ง|Install
เข้าสู่ระบบด้วย Google|Sign in with Google
เข้าสู่ระบบด้วย Google แล้ว|Signed in with Google
ออกจากระบบ|Sign out
ยังไม่ได้ตั้งค่าการเข้าสู่ระบบ Google|Google sign-in is not configured
เข้าสู่ระบบ Google ไม่พร้อมใช้งาน|Google sign-in is unavailable
ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง|Could not sign out. Please try again.
เข้าสู่ระบบ Google ไม่สำเร็จ กรุณาลองอีกครั้ง|Could not sign in with Google. Please try again.
มาตราผู้ประกันตน|Social Security section
ลูกจ้างในระบบ|Employees
ส่งประกันต่อ|Voluntary continuation
อาชีพอิสระ|Self-employed
ทางเลือกมาตรา 40|Section 40 plan
ข้อมูลคำนวณสิทธิ|Your details
ข้อมูลที่จำเป็น|Required details
ข้อมูลส่วนบุคคล (ไม่บันทึก)|Personal details (not saved)
ข้อมูลคำนวณเพิ่มเติม|Optional calculation details
ส่งสมทบ ม.33/39 ต่อเนื่อง (เดือน)|Consecutive Section 33/39 contributions (months)
ส่งสมทบทางเลือกนี้ต่อเนื่อง (เดือน)|Consecutive contributions under this plan (months)
ส่งสมทบ ม.33/39 ต่อเนื่องกี่เดือน|Consecutive Section 33/39 contributions (months)
เช่น 24|e.g. 24
อายุ (ปีเต็ม)|Age (years)
เพศ|Sex
ไม่ระบุ|Not specified
หญิง|Female
ชาย|Male
ค่าจ้างต่อเดือน (บาท)|Monthly wage (THB)
ค่าจ้างต่อเดือนช่วงที่ส่ง ม.33 (บาท)|Monthly wage under Section 33 (THB)
วันหยุดป่วยที่ยังเบิกได้|Eligible sick leave days remaining
ประเภทการเจ็บป่วย|Illness type
ทั่วไป|General illness
โรคเรื้อรังตามเกณฑ์|Qualifying chronic illness
สาเหตุที่ว่างงาน|Reason for unemployment
เลือกเมื่อว่างงาน|Select if unemployed
ถูกเลิกจ้าง|Dismissal
ลาออกหรือสิ้นสุดสัญญา|Resignation or contract end
วันว่างงานที่เบิกได้ (นับจากวันที่ 8)|Eligible unemployment days (from day 8)
วันนอนโรงพยาบาลที่มีสิทธิ|Eligible hospital stay days
วันพักตามแพทย์สั่ง (ไม่นับวันนอน รพ.)|Doctor-ordered rest days (excluding hospital stays)
จำนวนบุตรที่เข้าเกณฑ์|Number of eligible children
ฐานค่าจ้างเฉลี่ย 60 เดือนจากประวัติ (ถ้ามี)|60-month average contribution wage from your records (if available)
วิธีคำนวณเงินสมทบชราภาพ|Retirement contribution method
จ่ายเต็มเพดานตามอัตราปกติ|Standard rates at the wage ceiling
ใช้อัตราของแต่ละงวด รวมงวดลดหย่อน|Historical rates, including reduced rates
เดือนที่ส่ง ม.39 ล่าสุด (เว้นว่างถ้าส่ง ม.39 ทั้งหมด)|Most recent Section 39 months (leave blank if all months were under Section 39)
จำข้อมูลในเครื่องนี้|Remember on this device
ล้างข้อมูล|Clear
สปส. 1506|SSO 1506
ต้องอัปเดตกฎก่อนประเมิน|Benefit rules need updating
ยังไม่มีชุดกฎที่ตรวจทานสำหรับเดือนปัจจุบัน|No reviewed rules are available for this month
กรอกจำนวนเต็ม 0–1,200 เดือน|Enter a whole number from 0 to 1,200
ช่วงที่กรอกยังไม่ถึงเกณฑ์เงินสมทบของรายการปกติ|No standard benefits meet the contribution requirement
กรณีที่ต้องพิจารณาข้อยกเว้น|Possible exceptions
เบราว์เซอร์ไม่อนุญาตให้จำข้อมูล|Your browser blocked local storage
รักษาพยาบาล|Medical care
ค่ารักษาพยาบาล|Medical expenses
เฉพาะบริการที่คุ้มครอง|Covered services only
ณ โรงพยาบาลตามสิทธิหรือเครือข่าย|At your designated hospital or its network
ไม่คิดค่าใช้จ่าย|No charge
เงินชดเชยหยุดงานกรณีเจ็บป่วย|Sick leave compensation
ต่อเนื่องสูงสุด 90 วัน/ครั้ง และรวมไม่เกิน 180 วัน/ปี|Up to 90 consecutive days per case and 180 days per year in total
กรณีเจ็บป่วยเรื้อรัง ไม่เกิน 365 วัน/ปี|Chronic illness: up to 365 days per year
รักษาฉุกเฉิน|Emergency care
นอก รพ.ตามสิทธิ|Outside your designated hospital
แจ้ง รพ.ตามสิทธิโดยเร็ว|Notify your designated hospital promptly
ผู้ป่วยนอก รพ.รัฐ|Public hospital outpatient
ผู้ป่วยนอก รพ.เอกชน|Private hospital outpatient
ผู้ป่วยใน รพ.เอกชน|Private hospital inpatient
ผู้ป่วยใน|Inpatient
ค่าห้องและอาหาร|Room and meals
ตามจริงเท่าที่จำเป็น|Necessary costs
บางรายการตรวจรักษาเบิกเพิ่มได้ตามเกณฑ์|Additional reimbursement is available for some services
เบิกช่วงแรกไม่เกิน 72 ชั่วโมง ไม่นับวันหยุดราชการ|First 72 hours, excluding public holidays
ฉุกเฉินวิกฤต|Critical emergency
ไม่ต้องสำรองจ่าย|No upfront payment
จนพ้นภาวะวิกฤต ภายใน 72 ชั่วโมง รวมวันหยุดราชการ|Until stable, for up to 72 hours including public holidays
อุด/ถอน/ขูดหินปูน|Fillings, extractions and scaling
วงเงินเอกชน|Private-provider limit
รพ.รัฐคู่สัญญาตามเกณฑ์|Separate rules for participating public hospitals
ผ่าฟันคุด|Wisdom tooth surgery
แยกจากวงเงิน 900 บาท/ปี|Separate from the THB 900 annual allowance
ฟันปลอมถอดได้|Removable dentures
วงเงินทำฟันปลอมตามชนิดและจำนวนซี่|Amount depends on denture type and number of teeth
ซ่อมฟันปลอม|Denture repair
รากฟันเทียมรองรับฟันปลอมทั้งปาก|Implants for full dentures
ค่าผ่าตัดเหมาจ่ายต่อคน ภายใน 5 ปีนับจากวันที่ฝัง|Fixed surgical payment per person within 5 years of implantation
ชุดอุปกรณ์รากฟันเทียม|Implant kit
ค่าติดตามการรักษา|Treatment follow-up allowance
ปีแรก 1 ครั้ง|Once in year 1
ปีที่ 2–5 ไม่เกิน 4 ครั้ง/ปี|Up to 4 visits/year in years 2–5
ตรวจและฝากครรภ์|Antenatal care
เบิกตามจริงตามช่วงอายุครรภ์|Actual costs up to each pregnancy-stage limit
ค่าคลอดบุตร|Childbirth allowance
คู่สมรสใช้สิทธิฝ่ายเดียว|Only one spouse can claim
เงินทดแทนคลอดบุตร|Maternity leave compensation
คิด 50% ของฐานรายวัน เป็นเวลา 90 วัน|50% of daily contribution wage for 90 days
ไม่เกิน 2 ครั้ง|Up to 2 claims
สงเคราะห์บุตร|Child allowance
ถึงอายุ 6 ปี|Until age 6
สูงสุด 3 คน|Up to 3 children
อายุไม่เกิน 7 ปี|Up to age 7
สูงสุด 2 คน|Up to 2 children
เงินทดแทนทุพพลภาพ|Disability compensation
ทุพพลภาพ|Disability
ไม่รุนแรง|Non-severe
รุนแรง|Severe
ไม่รุนแรง (ไม่เกิน 180 เดือน)|Non-severe (up to 180 months)
รุนแรง (ตลอดชีวิต)|Severe (lifetime)
ตลอดชีวิต|Lifetime
ไม่รุนแรงไม่เกิน 180 เดือน|Non-severe: up to 180 months
รุนแรงตลอดชีวิต|Severe: lifetime
30% หรือ 50% ของฐานค่าจ้าง|30% or 50% of contribution wage
ค่ารักษาทุพพลภาพ|Disability medical care
รพ.รัฐรับบริการตามสิทธิ|Covered care at public hospitals
ค่าพาหนะรับส่ง|Patient transport
ค่าทำศพ|Funeral allowance
จ่ายให้ผู้จัดการศพ|Paid to the funeral organizer
สงเคราะห์กรณีตาย|Death grant
คิดจาก 50% ของฐานค่าจ้าง|Based on 50% of contribution wage
ส่ง 36–119 เดือน ได้ 4 เท่า|36–119 contribution months: 4 times the base amount
ตั้งแต่ 120 เดือน ได้ 12 เท่า|120 months or more: 12 times the base amount
ว่างงาน|Unemployment
เลิกจ้าง|Dismissal
เลิกจ้าง 60% / ลาออก 30%|Dismissal 60% / resignation 30%
เลิกจ้างไม่เกิน 180 วัน|Dismissal: up to 180 days
ลาออกไม่เกิน 90 วัน|Resignation: up to 90 days
ลาออกหรือหมดสัญญา|Resignation or contract end
เงินชดเชยผู้ป่วยใน|Inpatient compensation
นอน รพ. อย่างน้อย 1 วัน|Hospital stay of at least 1 day
เงินชดเชยหยุดพัก|Rest-day compensation
แพทย์สั่งพักอย่างน้อย 1 วัน|Doctor-ordered rest of at least 1 day
เงินชดเชยพบแพทย์|Medical visit compensation
ไม่ได้นอน รพ. และแพทย์ไม่สั่งพัก|No hospital admission or doctor-ordered rest
ไม่เกิน 3 ครั้ง/ปี|Up to 3 visits/year
จ่ายตลอดชีวิต|Lifetime payments
ตามเดือนสมทบ|Based on contribution months
สงเคราะห์ตายเพิ่ม|Additional death grant
สมทบตั้งแต่ 60 เดือน|At least 60 contribution months
ตรวจจำนวนวันและเพดานร่วม|Check the days entered against the combined limit
รอข้อมูลคำนวณ|Details needed
เงินสมทบชราภาพสะสม|Retirement contributions
คิดจากยอดส่งเต็มเพดานแต่ละงวด|Uses the contribution ceiling for each month
เงินสมทบชราภาพ|Retirement contributions
บำนาญชราภาพ|Retirement pension
คาดการณ์เมื่ออายุ 60 ปี|Projected at age 60
ส่งต่อถึงอายุ 60 ปีตามเกณฑ์ที่ใช้ปัจจุบัน|Assumes contributions continue to age 60 under current rules
เงินออมชราภาพสะสม|Retirement savings
ยังไม่รวมผลตอบแทนและเงินออมเพิ่ม|Excludes returns and extra voluntary savings
เงินเพิ่มเมื่อส่งครบ 180 งวด|Bonus after 180 contribution months
ยังไม่ครบเกณฑ์อายุ|Age requirement not yet met
รับเงินก้อนเมื่ออายุครบ 60 ปีและไม่ส่ง ม.40 ต่อ|Lump sum payable at age 60 after Section 40 contributions end
ไม่รวมผลตอบแทนและมาตรการเฉพาะพื้นที่|Excludes investment returns and local measures
รับเมื่ออายุครบ 55 ปีและสิ้นสุดสถานะผู้ประกันตน|Payable from age 55 after insured status ends
ตรวจค่าจ้างหรือจำนวนเดือน ม.39 ในโปรไฟล์|Check the wage or Section 39 months in your profile
ยังไม่มีอัตราที่ตรวจสอบได้สำหรับช่วงนี้|No verified rates for this period
ต้องมีประวัติเงินสมทบรายงวดเพื่อคำนวณยอดสะสม|Monthly contribution records are needed to calculate the accumulated amount
ต้องมีฐานเงินสมทบจริง 60 เดือนสุดท้าย|Requires actual contribution wages for the final 60 months
ข้อมูลไม่พอคำนวณ|Insufficient data
ตรวจยอดเงินที่กรอก|Check the amount entered
กรอกฐานเฉลี่ยมากกว่า 0 และไม่เกิน 17,500 บาท|Enter an average wage above THB 0 and up to THB 17,500
ยอดสมทบคาดการณ์เมื่ออายุ 60 ปี|Projected contributions at age 60
ข้อมูลยอดสะสมยังไม่ครบ|Contribution history incomplete
ส่งต่อแบบเดิม|Assumes continued contributions on the same basis
ใช้อัตราตามค่าจ้างที่กรอกและเพดานรายงวด|Uses the entered wage subject to each month’s wage ceiling
ไม่รวมผลตอบแทน|Excludes investment returns
ตรวจสุขภาพ|Health screening
ตรวจฟรีตามช่วงอายุและรอบตรวจที่หน่วยบริการเข้าร่วม|Free screening by age and frequency at participating providers
มะเร็งปากมดลูกใช้วิธีตรวจตามช่วงอายุและเกณฑ์ของหน่วยบริการ|Cervical screening method depends on age and provider criteria
คัดกรองการได้ยิน|Hearing screening
ตรวจเต้านมโดยบุคลากรสุขภาพ|Clinical breast examination
ตรวจสายตาและวัดความดันตา|Vision and eye pressure tests
ตรวจความสมบูรณ์ของเม็ดเลือด (CBC)|Complete blood count (CBC)
ตรวจปัสสาวะ|Urinalysis
ตรวจน้ำตาลในเลือดหลังอดอาหาร|Fasting blood glucose
ตรวจการทำงานของไต|Kidney function test
ตรวจไขมันรวมและไขมันดี (HDL)|Total and HDL cholesterol
ตรวจไวรัสตับอักเสบบี (HBsAg)|Hepatitis B screening (HBsAg)
สำหรับผู้เกิดก่อน พ.ศ. 2535|For people born before 1992
คัดกรองมะเร็งปากมดลูกด้วย Pap smear|Cervical screening (Pap smear)
คัดกรองมะเร็งปากมดลูกด้วย VIA|Cervical screening (VIA)
คัดกรองมะเร็งปากมดลูกด้วย HPV DNA|Cervical screening (HPV DNA)
ตรวจเซลล์ปากมดลูก|Examines cervical cells
อายุ 55 ปีขึ้นไปใช้ Pap smear แทน VIA|Pap smear instead of VIA from age 55
ตรวจหาเชื้อ HPV ชนิดเสี่ยงสูง|Tests for high-risk HPV
คัดกรองมะเร็งลำไส้ใหญ่และลำไส้ตรง (FIT)|Colorectal cancer screening (FIT)
ตรวจหาเลือดแฝงในอุจจาระ|Tests for hidden blood in stool
เอกซเรย์ทรวงอก|Chest X-ray
โหลดข้อมูลสิทธิไม่สำเร็จ กรุณาเชื่อมต่ออินเทอร์เน็ตแล้วเปิดใหม่|Could not load benefit rules. Connect to the internet and reopen the app.
ตรวจฐานค่าจ้างหรือจำนวนวัน|Check the wage or number of days entered
อุบัติเหตุหรือผู้รับเงินทุพพลภาพต้องพิจารณาแยก|Separate rules apply to accidents or disability benefit recipients
เงินทดแทนเมื่อหยุดรักษาตัว|Sick leave compensation
ฉุกเฉินนอกโรงพยาบาลตามสิทธิ|Emergency care outside your designated hospital
อุดฟัน ถอนฟัน ขูดหินปูน|Fillings, extractions and scaling
รากฟันเทียมรองรับฟันเทียมทั้งปาก|Implants for full dentures
ตรวจสุขภาพตามช่วงอายุ|Age-based health screening
เงินสงเคราะห์หยุดงานคลอดบุตร|Maternity leave compensation
ค่ารักษาผู้ทุพพลภาพ|Disability medical care
เงินสงเคราะห์กรณีตาย|Death grant
ชราภาพ|Retirement
เจ็บป่วย:ผู้ป่วยใน|Inpatient compensation
เจ็บป่วย:แพทย์สั่งพัก|Rest-day compensation
พบแพทย์โดยไม่ได้นอนหรือสั่งพัก|Medical visit without admission or ordered rest
เงินสงเคราะห์ตายเพิ่มเติม|Additional death grant
ชราภาพ:บำเหน็จเงินก้อน|Retirement lump sum
ช่วงยอดสะสม|Contribution range
ฐานค่าจ้างเฉลี่ยที่ใช้คำนวณสิทธิ (บาท/เดือน)|Average contribution wage (THB/month)
ชดเชยหยุดงานกรณีเจ็บป่วย|Sick leave compensation
50% ของค่าจ้าง/วัน|50% of daily wages
ต่อเนื่องสูงสุด 90 วัน/ครั้ง|Up to 90 consecutive days per case
และ รวมไม่เกิน 180 วัน/ปี|And up to 180 days per year in total
กรณีเรื้อรัง ไม่เกิน 365 วัน/ปี|Chronic illness, up to 365 days per year
ค่ารักษาฉุกเฉิน|Emergency medical expenses
นอกโรงพยาบาลตามสิทธิ|Outside your designated hospital
และแจ้งโรงพยาบาลตามสิทธิโดยเร็ว|And notify your designated hospital promptly
บางรายการตรวจรักษา|Some examinations and treatments
เบิกเพิ่มได้ตามเกณฑ์|Additional reimbursement under applicable rules
เบิกช่วงแรกไม่เกิน 72 ชั่วโมง|Reimbursement for the first 72 hours
ไม่นับวันหยุดราชการ|Excluding public holidays
รพ.รัฐคู่สัญญา ตามเกณฑ์|Participating public hospitals under applicable rules
วงเงินทำฟันปลอมตามชนิด|Allowance depends on denture type
และจำนวนซี่|And number of teeth
รากฟันเทียม|Dental implants
รองรับฟันปลอมทั้งปาก|For full dentures
ค่าผ่าตัดเหมาจ่ายต่อคน|Fixed surgical payment per person
ภายใน 5 ปีนับจากวันที่ฝัง|Within 5 years of implantation
ค่าจัดการศพ|Funeral allowance
สงเคราะห์กรณีเสียชีวิต|Death grant
คำนวณจาก 50% ของฐานค่าจ้าง|Calculated from 50% of the contribution wage
ส่งเงินสมทบ 36–119 เดือน ได้ 4 เท่า|36–119 contribution months, 4 times the base amount
ส่งเงินสมทบ ตั้งแต่ 120 เดือน ได้ 12 เท่า|120 contribution months or more, 12 times the base amount
ชดเชยกรณีว่างงาน|Unemployment compensation
เลิกจ้าง (จ่าย 60% ไม่เกิน 180 วัน)|Dismissal (60%, up to 180 days)
ลาออก/หมดสัญญา (จ่าย 30% ไม่เกิน 90 วัน)|Resignation/contract end (30%, up to 90 days)
`.trim().split('\n').map(line => line.split('|')));

for (const [, thai, english] of workStatuses) phrases.set(thai, english);

const patterns = [
  [/^50% ของค่าจ้าง\/วัน สูงสุด ([\d,.]+) บาท$/, '50% of daily wages, up to $1 THB'],
  [/^มาตรา (\d+)$/, 'Section $1'],
  [/^ทางเลือก (\d+)$/, 'Plan $1'],
  [/^ผ่านเกณฑ์เงินสมทบ (\d+) รายการ$/, '$1 benefits meet the contribution requirement'],
  [/^ยังไม่ถึงเกณฑ์จากช่วงที่กรอก (\d+) รายการ$/, '$1 benefits below the contribution threshold'],
  [/^(\d+) รายการ$/, '$1 tests'],
  [/^(\d+) รายการตามอายุ$/, '$1 tests by age'],
  [/^(\d+) รายการตามอายุและเพศ$/, '$1 tests by age and sex'],
  [/^(\d+) รายการตามเพศ$/, '$1 tests by sex'],
  [/^อายุตั้งแต่ (\d+) ปีขึ้นไป$/, 'Age $1 and over'],
  [/^อายุ (\d+–\d+) ปี$/, 'Ages $1'],
  [/^อายุครรภ์ไม่เกิน (\d+) สัปดาห์$/, 'Up to $1 weeks pregnant'],
  [/^อายุครรภ์เกิน (\d+) ถึง (\d+) สัปดาห์$/, 'Over $1 to $2 weeks pregnant'],
  [/^อายุครรภ์เกิน (\d+) สัปดาห์$/, 'Over $1 weeks pregnant'],
  [/^ไม่เกิน (\d+) สัปดาห์$/, 'Up to $1 weeks'],
  [/^เกิน (\d+) ถึง (\d+) สัปดาห์$/, 'Over $1 to $2 weeks'],
  [/^เกิน (\d+) สัปดาห์$/, 'Over $1 weeks'],
  [/^(\d+) ครั้ง\/(\d+) ปี$/, '$1 time / $2 years'],
  [/^(\d+) ครั้ง\/ปี$/, '$1 time/year'],
  [/^(\d+) ครั้ง$/, '$1 time'],
  [/^เพดานร่วม (\d+) วัน\/ปี$/, 'Combined limit: $1 days/year'],
  [/^ไม่เกิน (\d+) เดือน$/, 'Up to $1 months'],
  [/^อัตรา ([\d.]+)%$/, '$1% rate'],
  [/^คำนวณจาก ([\d.]+)% ของฐานเงินสมทบเฉลี่ย$/, 'Calculated at $1% of the average contribution base'],
  [/^\(([\d,.]+) บาท\/เดือน\) ก่อนสิ้นสุดสถานะ$/, '($1 THB/month) before coverage ends'],
  [/^ยอดเฉพาะ (\d+) จาก (\d+) งวด$/, 'Covers $1 of $2 contributions'],
  [/^สมทบถึงอายุ (\d+) ปี \((\d+) เดือน\)$/, 'Contributions to age $1 ($2 months)'],
  [/^บำนาญ ([\d.]+)% ของฐานเฉลี่ย$/, '$1% of average contribution wage'],
];

function translatePart(text) {
  if (phrases.has(text)) return phrases.get(text);
  for (const [pattern, replacement] of patterns) {
    if (pattern.test(text)) return text.replace(pattern, replacement);
  }
  if (text.includes(' — ')) {
    const [name, condition] = text.split(' — ');
    return translatePart(name) + ' — ' + condition
      .replace(/^อย่างน้อย (\d+) เดือน(?: ใน (\d+) เดือน)?$/, (_, minimum, window) =>
        'At least ' + minimum + ' months' + (window ? ' in the previous ' + window + ' months' : ''));
  }
  return text.replace(/^ตามจริง สูงสุด /, 'Actual costs up to ')
    .replace(/^(สูงสุด|ไม่เกิน) /, 'Up to ')
    .replace(/บาท\/(คน\/เดือน|วัน|เดือน|ปี|ซี่|ครั้ง|ราย|ชุด|ครรภ์)/g, (_, unit) =>
      'THB/' + ({'คน/เดือน':'child/month', วัน:'day', เดือน:'month', ปี:'year', ซี่:'tooth',
        ครั้ง:'claim', ราย:'person', ชุด:'kit', ครรภ์:'pregnancy'})[unit])
    .replace(/บาท/g, 'THB');
}

export function english(text) {
  return text.split('\n').map(line =>
    line.replace(/\S(?:[\s\S]*\S)?/, content => content.split(' · ').map(translatePart).join(' · '))
  ).join('\n');
}
