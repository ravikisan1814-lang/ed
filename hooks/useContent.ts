"use client";

import { useState, useEffect } from "react";
import { ContentService } from "@/lib/content/service";
import type { ContentItemDetail } from "@/lib/types";

export function useContent(itemId?: string, userId?: string) {
  const [content, setContent] = useState<ContentItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    const service = new ContentService();
    service
      .getContentItem(itemId, userId)
      .then(setContent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [itemId, userId]);

  return { content, loading, error };
}
