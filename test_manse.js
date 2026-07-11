const { calcSaju } = require('./services/manseryeok');

const cases = [
  { name:'김가영', birthDate:'1999-02-21', birthTime:'11:00', region:'울산광역시', expect:['己卯','丙寅','甲辰','己巳'] },
  { name:'박성남', birthDate:'1992-12-11', birthTime:null,    region:'울산광역시', expect:['壬申','壬子','辛酉', null] },
  { name:'이엘라', birthDate:'2022-11-22', birthTime:'22:00', region:'서울특별시', expect:['壬寅','辛亥','己卯','乙亥'] },
  { name:'이유낭', birthDate:'2012-05-13', birthTime:'23:56', region:'서울특별시', expect:['壬辰','乙巳','乙亥','丙子'] },
  { name:'김영은', birthDate:'1975-05-19', birthTime:null,    region:'강원도',     expect:['乙卯','辛巳','乙丑', null] },
  { name:'박찬영', birthDate:'1951-05-15', birthTime:'09:28', region:'서울특별시', expect:['辛卯','癸巳','乙卯','辛巳'] },
];

let pass = 0, total = 0, allOk = true;
console.log('=== 만세력 엔진 v2 검증 (포스텔러 기준) ===\n');

for (const c of cases) {
  const r = calcSaju({ birthDate: c.birthDate, birthTime: c.birthTime, calendar: '양력', region: c.region });
  const got = [r.pillars.year, r.pillars.month, r.pillars.day, r.pillars.hour];
  const labels = ['년','월','일','시'];
  const marks = got.map((g, i) => {
    if (c.expect[i] === null) return '－';
    total++;
    if (g === c.expect[i]) { pass++; return 'O'; }
    allOk = false;
    return 'X';
  });

  console.log(`[${c.name}] ${c.birthDate} ${c.birthTime || '시간모름'} · ${c.region}`);
  if (r.timeCorrection.correctedTime) {
    console.log(`  보정: ${r.timeCorrection.originalTime} → ${r.timeCorrection.correctedTime} (${r.timeCorrection.notes.join(', ')})`);
  }
  console.log(`  기대: ${c.expect.map(e=>e||'미상').join(' ')}`);
  console.log(`  결과: ${got.map(g=>g||'미상').join(' ')}`);
  console.log(`  판정: ${labels.map((l,i)=>l+marks[i]).join(' ')}\n`);
}

console.log(`=== ${pass}/${total} 일치 ${allOk ? '✅ 전부 통과' : '❌ 불일치 있음'} ===`);
process.exit(allOk ? 0 : 1);
