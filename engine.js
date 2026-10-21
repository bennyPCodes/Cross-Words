'use strict';
// Cross-Words — puzzle engine. Pure functions, no DOM.

// Crossword-style clues for common verse words. Words without a clue get a
// fill-in-the-blank clue drawn from the verse itself.
const CLUES = Object.fromEntries(`
ABIDE|Remain; dwell
ABOUND|Overflow with plenty
ACCEPTABLE|Pleasing; well received
AFFLICTION|Trouble or distress
AFRAID|Frightened
ALMIGHTY|The all-powerful one
ANCHOR|It holds a ship steady
ANGELS|Heavenly messengers
ANGER|Wrath
ANSWER|Reply
ARISE|Get up; stand
ARMS|Limbs that embrace
BEAUTY|Loveliness
BEAUTIFUL|Lovely to behold
BELIEVE|Accept as true
BENEFITS|Advantages; good gifts
BLESS|Speak well of; consecrate
BLESSED|Happy; highly favored
BLESSING|Divine favor
BOLDLY|With confidence
BONES|Skeleton parts
BRANCHES|Limbs of a vine or tree
BREAD|Daily loaf
BREATH|What the lungs draw
BRETHREN|Fellow believers, in old English
BRIDE|Woman on her wedding day
BROKEN|Shattered
BUCKLER|Small round shield
BURDEN|Heavy load
CALLING|Vocation
CANDLE|Wax light
CARE|Concern; worry
CARRY|Bear along
CHARITY|Self-giving love, in the KJV
CHEER|Good spirits
CHILD|Little one
CHILDREN|Sons and daughters
CHOSEN|Selected
CHRIST|The Anointed One
CLEAN|Pure; washed
CLEANSE|Wash thoroughly
CLOUD|Sky vapor
CLOUDS|Sky vapors
COMFORT|Consolation
COMFORTED|Consoled
COMFORTS|Consolations
COMMANDED|Ordered
COMMIT|Entrust
COMPASSION|Tender pity
CONFESS|Acknowledge openly
CONFIDENCE|Assurance
CONQUERORS|Victors
CONSUMED|Used up; devoured
CONTENT|Satisfied
CONTENTMENT|Satisfaction with one’s lot
COUNSEL|Advice
COUNSELLOR|Adviser (old spelling)
COUNTENANCE|Face; expression
COURAGE|Bravery
COURSE|Route; path of a race
COVENANT|Binding agreement
CREATE|Bring into being
CREATED|Brought into being
CREATURE|Created being
CRIMSON|Deep red
CROWN|Victor’s headpiece
DANCING|Moving to music
DARKNESS|Absence of light
DAUGHTERS|Female children
DEATH|The last enemy
DELIGHT|Great pleasure
DELIVER|Rescue
DELIVERED|Rescued
DELIVERER|Rescuer
DESERT|Arid land
DESIRES|Longings
DILIGENCE|Careful effort
DIRECT|Guide; aim
DISMAYED|Disheartened
DOMINION|Rule; sovereignty
DOOR|Entryway
DWELL|Live; reside
EAGLES|High-flying raptors
EARTH|Our planet
EAST|Where the sun rises
ENDURETH|Lasts (archaic)
ENEMY|Foe
ETERNAL|Without end
EVERLASTING|Never ending
EVERMORE|Always; forever
EVIL|Wickedness
EXALT|Lift high in praise
EXALTED|Lifted high
EXAMPLE|Model to follow
EYES|Organs of sight
FACE|Visage
FAINT|Grow weak; swoon
FAITH|Trust; belief
FAITHFUL|Loyal; true
FAITHFULNESS|Steadfast loyalty
FATHER|Parent; patriarch
FAVOUR|Goodwill (old spelling)
FEAR|Dread
FEARFULLY|With awe
FEET|Walking members
FIGHT|Battle
FIRE|Flames
FLAME|Blaze
FLESH|Body; skin and muscle
FLOCK|Sheep together
FLOWER|Bloom
FORGIVE|Pardon
FORGIVEN|Pardoned
FORGIVING|Pardoning
FORSAKE|Abandon
FORSAKEN|Abandoned
FORTRESS|Stronghold
FOUNTAIN|Spring of water
FREE|At liberty
FRIENDS|Companions
FRUIT|Harvest yield
GARDEN|Cultivated plot
GENERATIONS|Ages of descendants
GENTLENESS|Mildness
GIFT|Present
GLAD|Happy
GLADNESS|Joyfulness
GLORY|Splendor; honor
GODHEAD|Divine nature
GODLINESS|Piety
GOLD|Precious yellow metal
GOODNESS|Kindness; virtue
GOSPEL|Good news
GRACE|Unmerited favor
GRACIOUS|Kind; merciful
GRASS|Lawn growth
GREAT|Large; mighty
GREEN|Color of pastures
GUIDE|Lead the way
HAND|Palm and fingers
HANDS|Palms and fingers
HEAL|Make well
HEALED|Made well
HEALTH|Well-being
HEART|Seat of the affections
HEARTS|Seats of the affections
HEAVEN|God’s dwelling
HEAVENS|The skies
HELP|Aid
HELPER|Assistant
HIGH|Lofty
HILLS|Rises in the land
HOLY|Sacred; set apart
HONEST|Truthful
HONEYCOMB|Bees’ wax cells
HONOUR|Esteem (old spelling)
HOPE|Confident expectation
HOUSE|Home
HUMBLE|Lowly in spirit
HUMBLY|Without pride
HUNGER|Need for food
INSTRUCT|Teach
JESUS|The name above every name
JEWELS|Precious gems
KEEP|Guard; preserve
KIND|Gentle and caring
KINDNESS|Compassion
KINGDOM|Realm of a king
KNOCK|Rap at the door
LABOUR|Work (old spelling)
LAMP|Oil-burning light
LIFE|Existence
LIGHT|Opposite of darkness
LORD|Master; the divine name in small capitals
LOVE|Deep affection
LOVED|Cherished
LOVELY|Beautiful
MAJESTY|Royal grandeur
MARK|Target; goal
MARVELLOUS|Wonderful (old spelling)
MEDITATE|Ponder deeply
MEDITATION|Deep reflection
MEDICINE|Remedy
MEEKNESS|Gentle humility
MERCIES|Acts of compassion
MERCY|Compassion; clemency
MERRY|Cheerful
MIGHT|Strength; power
MIGHTY|Powerful
MIND|Intellect
MINDS|Intellects
MOMENT|Brief instant
MORNING|Daybreak
MOUNTAINS|Peaks
MOURN|Grieve
MOURNING|Grieving
MOUTH|Organ of speech
NAME|What one is called
NEED|Lack; want
NIGH|Near (archaic)
NIGHT|Hours of darkness
OVERCOME|Prevail over
PAIN|Hurt
PASTURES|Grazing fields
PATH|Track; way
PATHS|Tracks; ways
PATIENCE|Endurance
PATIENTLY|Without complaint
PEACE|Tranquility; shalom
PERFECT|Complete; flawless
PERISH|Die; be destroyed
PLEASANT|Agreeable
PLEASURE|Delight; enjoyment
POWER|Might
PRAISE|Extol
PRAISES|Songs of honor
PRAY|Talk with God
PRAYER|Petition to God
PRESENCE|Being near
PRESERVE|Keep safe
PRINCE|Royal son
PRIZE|Reward
PROMISE|Pledge
PURE|Unmixed; clean
PURPOSE|Intention
RACE|Contest of speed
REAP|Harvest
REDEEMED|Bought back
REDEEMER|One who buys back
REFUGE|Shelter
REJOICE|Celebrate
RENEW|Make new again
REPENT|Turn from sin
REST|Repose
RESURRECTION|Rising from the dead
RICHES|Wealth
RIGHTEOUS|Upright
RIVERS|Flowing waters
ROCK|Stone; firm foundation
RUBIES|Red gemstones
SAFE|Secure
SAFETY|Security
SALVATION|Deliverance
SAVE|Rescue
SAVED|Rescued
SAVIOUR|Rescuer (old spelling)
SCARLET|Bright red
SEASON|Time of year
SECRET|Hidden
SEEK|Search for
SHADOW|Shade
SHEEP|Woolly flock members
SHEPHERD|Keeper of sheep
SHIELD|Defensive armor
SHINE|Give off light
SIGHT|Vision
SINS|Transgressions
SING|Make music with the voice
SINGING|Vocal music
SLEEP|Slumber
SLUMBER|Doze
SNOW|Winter flakes
SONG|Melody
SORROW|Grief
SOUL|Inner self
SOULS|Inner selves
SOUND|Healthy; whole
SPIRIT|Breath; inner being
SPRING|Wellspring
STAFF|Walking stick
STAND|Remain upright
STEDFAST|Firm (old spelling)
STEPS|Footfalls
STILL|Calm; motionless
STRENGTH|Might
STRENGTHEN|Make stronger
STRONG|Mighty
SUFFERINGS|Hardships
SUFFICIENT|Enough
SUPPLY|Provide
SURELY|Without doubt
SWEET|Sugary; pleasant
TASTE|Sample with the tongue
TEACH|Instruct
TEARS|Weeping drops
THANKS|Gratitude
THANKSGIVING|Grateful praise
THANKFUL|Grateful
THIRST|Need for drink
THOUGHTS|Ideas
THRONE|Royal seat
TIME|Hour or season
TOWER|Tall structure
TRIBULATION|Great trouble
TROUBLE|Distress
TROUBLED|Distressed
TRUST|Rely on
TRUTH|What is so
UNITY|Oneness
UPHOLD|Support
VALLEY|Low land between hills
VICTORY|Triumph
VINE|Grape plant
VIRTUE|Moral excellence
VIRTUOUS|Morally excellent
VOICE|Sound of speech
WAIT|Stay expectantly
WALK|Go on foot
WALLS|City defenses
WATER|H2O
WATERS|Seas and streams
WAYS|Routes; habits
WEAKNESS|Frailty
WEARY|Tired
WEEPING|Crying
WEST|Where the sun sets
WHITE|Color of snow
WILDERNESS|Wild, barren land
WINGS|Means of flight
WISDOM|Sound judgment
WITNESSES|Those who testify
WONDERFUL|Marvelous
WOOL|Sheep’s fleece
WORD|Spoken message
WORDS|Spoken messages
WORK|Labor
WORKS|Deeds
WORLD|The earth and its people
WOUNDED|Injured
WOUNDS|Injuries
YOKE|Harness for oxen
YOUTH|Early years
`.trim().split('\n').map(l => l.split('|')));

const STOP = new Set(`A AN THE AND OR NOR BUT FOR SO YET OF TO IN ON AT BY AS IS AM ARE WAS WERE BE BEEN BEING ART IT ITS I ME MY MINE WE US OUR YE YOU YOUR THOU THEE THY THINE HE HIM HIS SHE HER THEY THEM THEIR THAT THIS THESE THOSE WHICH WHO WHOM WHOSE WHAT WHEN WHERE WHY HOW THERE THEN THAN UNTO UPON INTO FROM WITH WITHIN WITHOUT SHALL SHALT WILL WILT HATH HAST HAVE HAS HAD DOTH DOST DO DID NOT NO ALL ANY EVERY EVEN ALSO NEITHER EITHER YEA LET MAY CAN CANST SAITH SAID SAYING NOW ONE OWN SUCH SOME VERY MUCH MORE MOST THINGS THING UNTIL THEREFORE WHEREFORE WHEREIN THEREOF THEREIN WHOSOEVER WHATSOEVER WHITHERSOEVER SOEVER ABOUT OVER UNDER AGAIN ALWAY SELAH AMEN LO OH O BOTH SAME USWARD WITHAL WHENCE WHITHER WHEREBY THOUGH NAY OUT OFF UP DOWN`.split(/\s+/));

const MAX_DIM = 11;

function seedFrom(str) { let h = 2166136261; for (const c of String(str)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function makeRng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle(arr, r) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function tokenize(text) {
  return text.split(/\s+/).filter(Boolean).map(raw => ({ raw, core: raw.replace(/[’']s\b/gi, '').replace(/[^A-Za-z]/g, '').toUpperCase() }));
}
function candidates(text) {
  const seen = new Set(), out = [];
  for (const t of tokenize(text)) { const w = t.core; if (w.length < 3 || w.length > MAX_DIM || STOP.has(w) || seen.has(w)) continue; seen.add(w); out.push(w); }
  return out;
}

// Difficulty curve. Past the last verse, verses return in "endless rounds" with bigger grids.
function levelParams(level) {
  const L = VERSES.length, idx = (level - 1) % L, round = Math.floor((level - 1) / L);
  let target = level <= 10 ? 4 : level <= 40 ? 5 : level <= 100 ? 6 : level <= 180 ? 7 : 8;
  target = Math.min(10, target + round);
  const starter = round > 0 ? 'none' : level <= 12 ? 'all' : level <= 40 ? 'half' : 'none';
  return { verseIdx: idx, seedKey: 'lv-' + level, target, starter, round };
}
function dailyParams(dateKey) {
  return { verseIdx: seedFrom('daily-' + dateKey) % VERSES.length, seedKey: 'daily-' + dateKey, target: 7, starter: 'none', round: 0 };
}

function attempt(words, target, r) {
  const cells = new Map(), placed = []; let b = { x0: 0, x1: 0, y0: 0, y1: 0 };
  const get = (x, y) => cells.get(x + ',' + y);
  function put(w, x, y, dir) {
    const dx = dir === 'a' ? 1 : 0, dy = 1 - dx;
    for (let k = 0; k < w.length; k++) { const key = (x + dx * k) + ',' + (y + dy * k); let c = cells.get(key); if (!c) { c = { ch: w[k], dirs: new Set() }; cells.set(key, c); } c.dirs.add(dir); }
    placed.push({ ans: w, x, y, dir });
    b = { x0: Math.min(b.x0, x), y0: Math.min(b.y0, y), x1: Math.max(b.x1, x + dx * (w.length - 1)), y1: Math.max(b.y1, y + dy * (w.length - 1)) };
  }
  function fit(w, x, y, dir) {
    const dx = dir === 'a' ? 1 : 0, dy = 1 - dx;
    if (get(x - dx, y - dy) || get(x + dx * w.length, y + dy * w.length)) return -1;
    let cross = 0;
    for (let k = 0; k < w.length; k++) {
      const X = x + dx * k, Y = y + dy * k, c = get(X, Y);
      if (c) { if (c.ch !== w[k] || c.dirs.has(dir)) return -1; cross++; }
      else if (get(X + dy, Y + dx) || get(X - dy, Y - dx)) return -1;
    }
    if (!cross) return -1;
    const x0 = Math.min(b.x0, x), y0 = Math.min(b.y0, y), x1 = Math.max(b.x1, x + dx * (w.length - 1)), y1 = Math.max(b.y1, y + dy * (w.length - 1));
    const W = x1 - x0 + 1, H = y1 - y0 + 1;
    if (W > MAX_DIM || H > MAX_DIM) return -1;
    return cross * 100 - W * H - Math.abs(W - H) * 3 + r() * 6;
  }
  put(words[0], 0, 0, r() < 0.6 ? 'a' : 'd');
  let pending = words.slice(1), progress = true;
  while (placed.length < target && pending.length && progress) {
    progress = false;
    for (const w of [...pending]) {
      if (placed.length >= target) break;
      let best = null, bestS = -1;
      for (const p of placed) {
        const pdx = p.dir === 'a' ? 1 : 0, pdy = 1 - pdx, dir = p.dir === 'a' ? 'd' : 'a';
        for (let i = 0; i < p.ans.length; i++) for (let j = 0; j < w.length; j++) {
          if (p.ans[i] !== w[j]) continue;
          const X = p.x + pdx * i, Y = p.y + pdy * i;
          const sx = dir === 'a' ? X - j : X, sy = dir === 'a' ? Y : Y - j;
          const s = fit(w, sx, sy, dir);
          if (s > bestS) { bestS = s; best = [sx, sy, dir]; }
        }
      }
      if (best) { put(w, ...best); pending.splice(pending.indexOf(w), 1); progress = true; }
    }
  }
  return { placed, b, area: (b.x1 - b.x0 + 1) * (b.y1 - b.y0 + 1) };
}

function generate(chosen, extra, target, r) {
  let best = null;
  const want = Math.min(target, chosen.length + extra.length);
  for (let a = 0; a < 16; a++) {
    let c;
    if (a === 0) c = [...chosen].sort((x, y) => y.length - x.length);
    else { const s = shuffle(chosen, r); const i = s.reduce((m, w, j) => w.length > s[m].length ? j : m, 0); c = [s[i], ...s.filter((_, j) => j !== i)]; }
    const res = attempt([...c, ...shuffle(extra, r)], target, r);
    if (!best || res.placed.length > best.placed.length || (res.placed.length === best.placed.length && res.area < best.area)) best = res;
    if (best.placed.length >= want && a >= 5) break;
  }
  return best;
}

function cloze(tokens, ans, answers) {
  const i = tokens.findIndex(t => t.core === ans);
  const mask = t => (answers.has(t.core) ? t.raw.replace(/[A-Za-z][A-Za-z’']*/, '____') : t.raw);
  const before = tokens.slice(Math.max(0, i - 2), i).map(mask).join(' ');
  const after = tokens.slice(i + 1, i + 3).map(mask).join(' ');
  const blank = tokens[i].raw.replace(/[A-Za-z][A-Za-z’']*/, '______');
  return `“${i > 2 ? '…' : ''}${[before, blank, after].filter(Boolean).join(' ')}${i + 3 < tokens.length ? '…' : ''}”`;
}

function buildPuzzle({ verseIdx, seedKey, target, starter }) {
  const [ref, text] = VERSES[verseIdx];
  const r = makeRng(seedFrom(seedKey));
  const tokens = tokenize(text);
  const cands = candidates(text);
  const hasDef = w => !!CLUES[w];
  const ranked = [
    ...shuffle(cands.filter(w => w.length >= 4 && hasDef(w)), r),
    ...shuffle(cands.filter(w => w.length >= 4 && !hasDef(w)), r),
    ...shuffle(cands.filter(w => w.length === 3), r),
  ];
  if (ranked.length < 4) { // short verse: borrow longer common words so the grid has some substance
    const seen = new Set(ranked);
    for (const t of tokens) if (t.core.length >= 4 && t.core.length <= MAX_DIM && !seen.has(t.core)) { seen.add(t.core); ranked.push(t.core); }
  }
  const g = generate(ranked.slice(0, target), ranked.slice(target), target, r);
  const { x0, y0, x1, y1 } = g.b, w = x1 - x0 + 1, h = y1 - y0 + 1;
  const grid = Array.from({ length: h }, () => Array(w).fill(null));
  const cellWords = Array.from({ length: h }, () => Array(w).fill(null));
  const nums = Array.from({ length: h }, () => Array(w).fill(0));
  const words = g.placed.map(p => ({ ans: p.ans, dir: p.dir, x: p.x - x0, y: p.y - y0 }));
  const starts = [...new Set(words.map(q => q.y * 100 + q.x))].sort((a, b) => a - b);
  words.forEach(q => { q.num = starts.indexOf(q.y * 100 + q.x) + 1; });
  words.sort((a, b) => (a.dir === b.dir ? 0 : a.dir === 'a' ? -1 : 1) || a.num - b.num);
  const answers = new Set(words.map(q => q.ans));
  words.forEach((q, i) => {
    const dx = q.dir === 'a' ? 1 : 0, dy = 1 - dx; q.cells = [];
    for (let k = 0; k < q.ans.length; k++) { const X = q.x + dx * k, Y = q.y + dy * k; grid[Y][X] = q.ans[k]; cellWords[Y][X] = cellWords[Y][X] || {}; cellWords[Y][X][q.dir] = i; q.cells.push([X, Y]); }
    nums[q.y][q.x] = q.num;
    q.def = CLUES[q.ans] || null;
    q.ctx = cloze(tokens, q.ans, answers);
  });
  const given = [];
  if (starter !== 'none') words.forEach((q, i) => { if (starter === 'all' || i % 2 === 0) given.push(q.cells[0]); });
  const options = shuffle([ref, ...shuffle(VERSES.map(v => v[0]).filter(x => x !== ref), r).slice(0, 3)], r);
  const par = 35 * words.length + 25;
  return { verseIdx, ref, text, tokens, w, h, grid, cellWords, nums, words, given, options, par };
}

if (typeof module !== 'undefined') module.exports = { buildPuzzle, levelParams, dailyParams, candidates, CLUES };
