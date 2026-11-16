
"use strict";

// Bon Quran - Main application
const CONFIG = window.BON_QURAN_CONFIG || {};

const state = {
  supabase: null,
  language: "ar",
  surahs: [],
  currentSurah: null
};

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

const messages = {
  ar: {
    search: "ابحث عن سورة...",
    loading: "جارٍ تحميل السور...",
    unavailable: "لم يتم تحميل بيانات القرآن بعد.",
    empty: "لم يتم العثور على سورة.",
    back: "العودة إلى السور",
    error: "تعذر الاتصال بقاعدة البيانات."
  },
  am: {
    search: "ሱራ ፈልግ...",
    loading: "ሱራዎች በመጫን ላይ...",
    unavailable: "የቁርአን ዳታ ገና አልተጫነም።",
    empty: "ሱራ አልተገኘም።",
    back: "ወደ ሱራዎች ተመለስ",
    error: "ከዳታቤዙ ጋር መገናኘት አልተቻለም።"
  },
  en: {
    search: "Search Surah...",
    loading: "Loading Surahs...",
    unavailable: "Quran data has not been loaded yet.",
    empty: "No Surah found.",
    back: "Back to Surahs",
    error: "Could not connect to the database."
  },
  om: {
    search: "Suuraa barbaadi...",
    loading: "Suuraawwan fe'aa jira...",
    unavailable: "Daataan Qur'aanaa amma iyyuu hin fe'amne.",
    empty: "Suuraan hin argamne.",
    back: "Gara Suuraawwanitti deebi'i",
    error: "Kuusdeetaa waliin wal qunnamuun hin danda'amne."
  }
};

function message(key) {
  return messages[state.language][key];
}

function setLoading(text) {
  $("surahList").innerHTML =
    `<div class="loading">${escapeHTML(text)}</div>`;
}

async function loadSupabaseLibrary() {
  if (!CONFIG.url || !CONFIG.anonKey) {
    setLoading(message("unavailable"));
    return;
  }

  try {
    if (!window.supabase) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    state.supabase = window.supabase.createClient(
      CONFIG.url,
      CONFIG.anonKey
    );

    await loadSurahs();
  } catch (error) {
    console.error("Bon Quran connection error:", error);
    setLoading(message("error"));
  }
}

async function loadSurahs() {
  setLoading(message("loading"));

  const { data, error } = await state.supabase
    .from("surahs")
    .select("id, arabic_name, transliteration, revelation_type, ayah_count")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    setLoading(message("error"));
    return;
  }

  state.surahs = data || [];
  renderSurahs();
}

function renderSurahs() {
  const query = $("searchInput").value.trim().toLowerCase();

  const filtered = state.surahs.filter((surah) => {
    const searchable = [
      surah.arabic_name,
      surah.transliteration,
      surah.id
    ].join(" ").toLowerCase();

    return searchable.includes(query);
  });

  if (!filtered.length) {
    setLoading(message("empty"));
    return;
  }

  $("surahList").innerHTML = filtered.map((surah) => `
    <article class="surah-card"
      data-surah-id="${Number(surah.id)}"
      role="button"
      tabindex="0">
      <span class="surah-number">${Number(surah.id)}</span>
      <div class="surah-info">
        <strong>${escapeHTML(surah.transliteration || "")}</strong>
        <small>${Number(surah.ayah_count) || 0} Ayahs</small>
      </div>
      <span class="surah-arabic" lang="ar" dir="rtl">
        ${escapeHTML(surah.arabic_name || "")}
      </span>
    </article>
  `).join("");

  document.querySelectorAll(".surah-card").forEach((card) => {
    card.addEventListener("click", () => {
      openSurah(Number(card.dataset.surahId));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSurah(Number(card.dataset.surahId));
      }
    });
  });
}

async function openSurah(surahId) {
  if (!state.supabase) return;

  const surah = state.surahs.find(
    (item) => Number(item.id) === surahId
  );

  if (!surah) return;

  state.currentSurah = surah;
  $("surahList").parentElement.hidden = true;
  $("searchInput").parentElement.hidden = true;
  $("reader").hidden = false;
  $("surahTitle").textContent =
    `${surah.transliteration || ""} — ${surah.arabic_name || ""}`;

  $("ayahList").innerHTML =
    `<p class="loading">${escapeHTML(message("loading"))}</p>`;

  const { data: ayahs, error } = await state.supabase
    .from("ayahs")
    .select("id, surah_id, ayah_number, arabic_text, verification_status")
    .eq("surah_id", surahId)
    .eq("verification_status", "verified")
    .order("ayah_number", { ascending: true });

  if (error) {
    console.error(error);
    $("ayahList").textContent = message("error");
    return;
  }

  if (!ayahs || ayahs.length === 0) {
    $("ayahList").textContent =
      "Verified Ayahs are not available yet.";
    return;
  }

  let translations = [];

  if (state.language !== "ar") {
    const ayahIds = ayahs.map((ayah) => ayah.id);

    const { data, error: translationError } = await state.supabase
      .from("translations")
      .select("ayah_id, language_code, translated_text")
      .in("ayah_id", ayahIds)
      .eq("language_code", state.language)
      .eq("verification_status", "verified");

    if (translationError) {
      console.error(translationError);
    } else {
      translations = data || [];
    }
  }

  const translationMap = new Map(
    translations.map((item) => [
      item.ayah_id,
      item.translated_text
    ])
  );

  $("ayahList").innerHTML = ayahs.map((ayah) => {
    const translation = translationMap.get(ayah.id);

    return `
      <article class="ayah">
        <p class="ayah-arabic" lang="ar" dir="rtl">
          ${escapeHTML(ayah.arabic_text)}
          <span>۞ ${Number(ayah.ayah_number)}</span>
        </p>
        ${state.language !== "ar" ? `
          <p class="ayah-translation">
            ${translation
              ? escapeHTML(translation)
              : "Translation not available yet."}
          </p>
        ` : ""}
      </article>
    `;
  }).join("");
}

function changeLanguage(language) {
  if (!messages[language]) return;

  state.language = language;

  document.querySelectorAll(".language").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.lang === language
    );
  });

  $("searchInput").placeholder = message("search");
  $("backButton").textContent = "← " + message("back");

  if (state.currentSurah) {
    openSurah(Number(state.currentSurah.id));
  } else {
    renderSurahs();
  }
}

function setupEvents() {
  $("searchInput").addEventListener("input", renderSurahs);

  document.querySelectorAll(".language").forEach((button) => {
    button.addEventListener("click", () => {
      changeLanguage(button.dataset.lang);
    });
  });

  $("themeButton").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  $("backButton").addEventListener("click", () => {
    state.currentSurah = null;
    $("reader").hidden = true;
    $("surahList").parentElement.hidden = false;
    $("searchInput").parentElement.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupEvents();
  changeLanguage("ar");
  loadSupabaseLibrary();
});
