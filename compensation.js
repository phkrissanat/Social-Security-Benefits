const kinds = ['sick_income', 'maternity_income', 'unemployment', 'm40_inpatient'];

export function estimateCompensation(benefit, { section, option, bases, rest, daysPerMonth=30 }, values) {
  if (!kinds.includes(benefit.id) || !benefit.sections.includes(section)) return null;
  const { wage, days, reason, inpatient, home } = values;
  const validDays = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;
  if (benefit.id === 'm40_inpatient') {
    const limit = benefit.sharedMaxDays[option];
    if (!rest || !validDays(inpatient, limit) || !validDays(home, limit) || inpatient + home > limit) return null;
    return inpatient * benefit.amount.value + home * rest.amount.value;
  }

  const monthly = section === '39' ? bases.section39.monthly : wage;
  if (!Number.isFinite(monthly) || monthly <= 0 || monthly > (section === '39' ? bases.section39.monthly : bases.section33.max)) return null;
  const { amount } = benefit;
  let total;
  if (benefit.id === 'maternity_income') {
    total = monthly * amount.rate * amount.days / daysPerMonth;
  } else if (benefit.id === 'unemployment') {
    if (!['dismissed', 'resigned'].includes(reason) || !validDays(days, amount.maxDays[reason])) return null;
    total = monthly * amount.rates[reason] * days / daysPerMonth;
  } else {
    if (!validDays(days, reason === 'chronic' ? amount.maxDays.chronic : amount.maxDays.perCase)) return null;
    total = monthly * amount.rate * days / daysPerMonth;
  }
  return Math.round(total * 100) / 100;
}
