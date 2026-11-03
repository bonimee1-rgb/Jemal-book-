// Optional Supabase catalog connector.
// Include the Supabase v2 CDN before this file, then include this file.
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="supabase-config.js"></script>
// <script src="supabase-client.js"></script>
(function () {
  const cfg = window.JEMAL_SUPABASE_CONFIG || {};
  const ready = !!(window.supabase && cfg.url && cfg.anonKey &&
    !cfg.url.includes("YOUR_") && !cfg.anonKey.includes("YOUR_"));
  window.JemalCloud = {
    ready,
    client: ready ? window.supabase.createClient(cfg.url, cfg.anonKey) : null,
    async listBooks({ category, search } = {}) {
      if (!this.ready) throw new Error("Supabase config is not set.");
      let query = this.client.from("books").select(
        "id,title,author,category,language,description,pdf_path,source_name,source_url,license_note,content_verified"
      ).order("title");
      if (category && category !== "ሁሉም") query = query.eq("category", category);
      if (search) query = query.or(
        `title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`
      );
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    async getPdfSignedUrl(path, expiresIn = 300) {
      if (!this.ready) throw new Error("Supabase config is not set.");
      const { data, error } = await this.client.storage
        .from("jemal-books").createSignedUrl(path, expiresIn);
      if (error) throw error;
      return data.signedUrl;
    }
  };
})();
