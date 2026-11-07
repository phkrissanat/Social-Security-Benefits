export function readProfile(text) {
  let saved;
  try { saved=JSON.parse(text); } catch { return null; }
  if (!saved || !['33','39','40'].includes(saved.section)) return null;
  const fields=saved.fields&&typeof saved.fields==='object'&&!Array.isArray(saved.fields)?saved.fields:{};
  return {
    section:saved.section,
    option:['1','2','3'].includes(saved.option)?saved.option:'1',
    months:Number.isInteger(saved.months)&&saved.months>=0&&saved.months<=1200?saved.months:null,
    asOf:saved.asOf,
    fields:Object.fromEntries(Object.entries(fields).filter(([key,value])=>
      !['__proto__','constructor','prototype'].includes(key)&&typeof value==='string')),
  };
}
