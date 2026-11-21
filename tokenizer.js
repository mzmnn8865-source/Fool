/*
 * ماژول ۲: توکن‌ساز دستی (آموزشی). مدل اصلی از توکنایزر داخلی Transformers.js استفاده می‌کند.
 */
class Tokenizer {
  constructor(vocab = Vocab) { this.vocab = vocab; }

  // 🔁 برای جایگزینی با BPE فقط این متد را عوض کن: متن → آرایه‌ای از توکن‌های رشته‌ای
  split(text) {
    return text.toLowerCase().match(/[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu) || [];
  }

  encode(text) { return this.split(text).map(t => this.vocab.getTokenId(t)); }

  // 🔁 در BPE این‌جا باید ادغام زیرکلمات انجام شود
  decode(ids) {
    return ids.map(i => this.vocab.getToken(i)).join(" ")
      .replace(/\s+([.,!?؟،:;])/g, "$1");
  }
}
