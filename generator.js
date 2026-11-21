/*
 * ماژول ۳: انجین تولید با Transformers.js و distilgpt2.
 * Transformers.js فقط ESM است؛ پس با import() پویا از یک اسکریپت کلاسیک لود می‌شود (سازگار با file://).
 */
const Generator = (() => {
  const CDN = "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
  const MODEL = "Xenova/distilgpt2";
  let pipe = null, loading = null;

  /** مدل را بارگذاری می‌کند. onStatus(state, message) با state ∈ loading|progress|ready|error */
  function loadModel(onStatus = () => {}) {
    if (pipe) return Promise.resolve(pipe);
    if (loading) return loading;
    loading = (async () => {
      try {
        onStatus("loading", "در حال دانلود مدل… (یک‌بار، حدود ۳۰ تا ۴۰ مگابایت؛ بعدش در کش مرورگر می‌ماند)");
        const { pipeline, env } = await import(CDN);
        env.allowLocalModels = false;           // مدل از Hugging Face و کش مرورگر
        pipe = await pipeline("text-generation", MODEL, {
          progress_callback: (p) => {
            if (p.status === "progress" && typeof p.progress === "number")
              onStatus("progress", `در حال دانلود مدل… ${Math.round(p.progress)}٪`);
          },
        });
        onStatus("ready", "آماده");
        return pipe;
      } catch (e) {
        console.error(e);
        loading = null;
        onStatus("error", "خطا در بارگذاری مدل. اینترنت را بررسی کن و صفحه را دوباره باز کن.");
        throw e;
      }
    })();
    return loading;
  }

  /**
   * تولید پاسخ. callback(متنِ تا اینجا) در هر توکن جدید صدا زده می‌شود (استریم).
   * در خطا، پیام فارسی برمی‌گرداند.
   */
  async function generateResponse(prompt, maxTokens = 60, callback = null) {
    try {
      if (!pipe) throw new Error("model-not-ready");
      const out = await pipe(prompt, {
        max_new_tokens: maxTokens,
        do_sample: true, top_k: 50, temperature: 0.8, repetition_penalty: 1.2,
        callback_function: callback ? (beams) => {
          const text = pipe.tokenizer.decode(beams[0].output_token_ids, { skip_special_tokens: true });
          callback(text.slice(prompt.length));
        } : undefined,
      });
      return out[0].generated_text.slice(prompt.length).trim() || "(پاسخی تولید نشد)";
    } catch (e) {
      console.error(e);
      return e.message === "model-not-ready"
        ? "مدل هنوز آماده نیست. کمی صبر کن."
        : "خطایی هنگام تولید پاسخ رخ داد. دوباره تلاش کن.";
    }
  }

  return { loadModel, generateResponse };
})();
