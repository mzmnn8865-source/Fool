/*
 * ⚠️ این فایل اسکلت است. داده‌های واقعی بانک کلمات بعداً از `vocab.json` بارگذاری می‌شوند.
 * ماژول ۱: نگاشت دوطرفه‌ی توکن ⇄ شناسه عددی.
 */
const Vocab = (() => {
  const UNK = "<UNK>", PAD = "<PAD>";
  const tokenToId = new Map();   // توکن → شناسه
  const idToToken = new Map();   // شناسه → توکن

  function add(token) {
    if (tokenToId.has(token)) return tokenToId.get(token);
    const id = tokenToId.size;
    tokenToId.set(token, id);
    idToToken.set(id, token);
    return id;
  }

  // توکن‌های ویژه همیشه اول هستند
  add(PAD); add(UNK);
  // کلمات نمونه (جایگزین می‌شوند با vocab.json)
  ["hello","world","the","a","is","are","you","i","what","how","why","lion","jungle","zebra","car","cat","dog",
   "in","on","of","and",".",",","?","!","شیر","جنگل","ماشین","چی"].forEach(add);

  /** بارگذاری بانک واقعی: آرایه‌ای از توکن‌ها یا آبجکت {token:id}. */
  async function loadFromJson(url = "vocab.json") {
    const res = await fetch(url);               // روی file:// کار نمی‌کند؛ از سرور یا GitHub Pages استفاده کن
    const data = await res.json();
    tokenToId.clear(); idToToken.clear();
    if (Array.isArray(data)) { add(PAD); add(UNK); data.forEach(add); }
    else for (const [t, id] of Object.entries(data)) { tokenToId.set(t, id); idToToken.set(id, t); }
  }

  const getTokenId = (token) => tokenToId.has(token) ? tokenToId.get(token) : tokenToId.get(UNK);
  const getToken = (id) => idToToken.has(id) ? idToToken.get(id) : UNK;
  const getVocabSize = () => tokenToId.size;

  return { UNK, PAD, getTokenId, getToken, getVocabSize, loadFromJson };
})();
