// Shared scene for before/ and after/: an editorial bar chart (dark dot-matrix ground, top key light, Geist,
// one lit hero bar with a streak light on its top edge). Built once, synchronously, so both versions draw the
// identical frame; only the motion differs. Exposes window.SCENE with the geometry the timelines need.
(function () {
  const W = 1080, H = 1350;
  const INK = '#F5F5F7', INK2 = '#A1A1A6', INK3 = '#6E6E73';
  const F = 'font-family="Geist, sans-serif" font-weight="500"';
  const rows = [['Mon', 12], ['Tue', 18], ['Wed', 9], ['Thu', 24], ['Fri', 41]];
  const bw = 150, gap = 40, x0 = (W - (rows.length * bw + (rows.length - 1) * gap)) / 2;
  const base = 1090, maxH = 700, max = 44, hero = rows.length - 1;

  let s = `<svg id="stage" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>
    <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1F22"/><stop offset=".55" stop-color="#141517"/><stop offset="1" stop-color="#0C0C0D"/></linearGradient>
    <radialGradient id="key" cx=".5" cy="-.08" r=".85"><stop offset="0" stop-color="#3A3B40" stop-opacity=".75"/><stop offset=".5" stop-color="#2A2B2F" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <radialGradient id="fadeG" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <mask id="fade"><rect width="${W}" height="${H}" fill="url(#fadeG)"/></mask>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.7" fill="#34353B"/></pattern>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0"/></filter>
    <linearGradient id="heroV" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3F4DFF"/><stop offset=".45" stop-color="#2F7BFF"/><stop offset=".85" stop-color="#5FB8FF"/><stop offset="1" stop-color="#E8F3FF"/></linearGradient>
    <linearGradient id="graphV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4A4E"/><stop offset="1" stop-color="#28282B"/></linearGradient>
    <linearGradient id="streakG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2F6BFF" stop-opacity="0"/><stop offset=".35" stop-color="#2F6BFF" stop-opacity=".55"/><stop offset=".5" stop-color="#CFE3FF"/><stop offset=".65" stop-color="#2F6BFF" stop-opacity=".55"/><stop offset="1" stop-color="#2F6BFF" stop-opacity="0"/></linearGradient>
    <radialGradient id="core"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".18" stop-color="#DCEBFF"/><stop offset=".45" stop-color="#3D7BFF" stop-opacity=".6"/><stop offset="1" stop-color="#2F55FF" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="haze" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#gnd)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#fade)"/>
  <rect width="${W}" height="${H}" fill="url(#key)"/>
  <g id="cam" style="transform-origin:540px 700px"><g id="rig">
  <text id="eyebrow" x="88" y="168" ${F} font-size="30" fill="${INK2}" letter-spacing="-0.3">Weekly report</text>
  <text id="title" x="88" y="262" ${F} font-size="92" fill="${INK}" letter-spacing="-3.2">Tasks shipped</text>`;

  const bars = [];
  rows.forEach(([name, v], i) => {
    const x = x0 + i * (bw + gap), h = (v / max) * maxH, y = base - h, isHero = i === hero;
    s += `<g class="bar" data-i="${i}">`;
    if (isHero) s += `<ellipse class="haze" cx="${x + bw / 2}" cy="${base + 4}" rx="${bw * 0.8}" ry="24" fill="#2F6BFF" opacity=".55" filter="url(#haze)"/>`;
    s += `<rect class="fill" x="${x}" y="${y}" width="${bw}" height="${h}" rx="16" fill="url(#${isHero ? 'heroV' : 'graphV'})"/>`;
    if (isHero) s += `<rect class="fill glow" x="${x}" y="${y}" width="${bw}" height="${h}" rx="16" fill="url(#heroV)" opacity=".6" filter="url(#soft)"/>`;
    s += `<text class="val" x="${x + bw / 2}" y="${y - 26}" text-anchor="middle" ${F} font-size="${isHero ? 76 : 46}" fill="${isHero ? INK : INK2}" letter-spacing="${isHero ? -3 : -1.6}">${v}</text>`;
    s += `<text class="lbl" x="${x + bw / 2}" y="${base + 56}" text-anchor="middle" ${F} font-size="32" fill="${isHero ? INK : INK2}" letter-spacing="-0.6">${name}</text></g>`;
    bars.push({ i, v, h, x, y, cx: x + bw / 2, hero: isHero });
  });

  const hb = bars[hero], L = 760;
  s += `<g id="streak" style="mix-blend-mode:screen"><g id="streakIn">
    <ellipse cx="${hb.cx}" cy="${hb.y + 3}" rx="${L / 2}" ry="24" fill="url(#streakG)" opacity=".35" filter="url(#haze)"/>
    <rect class="line" x="${hb.cx - L / 2}" y="${hb.y + 0.5}" width="${L}" height="5" rx="2.5" fill="url(#streakG)"/>
    <circle class="core" cx="${hb.cx}" cy="${hb.y + 3}" r="90" fill="url(#core)" opacity=".55"/>
    <circle cx="${hb.cx}" cy="${hb.y + 3}" r="24" fill="url(#core)"/>
    <circle cx="${hb.cx}" cy="${hb.y + 3}" r="6" fill="#fff"/></g></g>`;
  s += `<text id="foot" x="88" y="1240" ${F} font-size="24" fill="${INK3}" letter-spacing="-0.2">Tasks closed per day, illustrative</text>`;
  s += `</g></g><rect width="${W}" height="${H}" filter="url(#grain)" opacity=".04"/></svg>`;

  document.getElementById('scene').innerHTML = s;
  window.SCENE = { base, bars, hero: hb, streakLen: L };
})();
