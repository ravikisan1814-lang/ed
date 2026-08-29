import { createClient } from "@/lib/supabase/server";
import type { ExamGroupNode, ContentItemDetail } from "@/lib/types";

export class ContentService {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async getHierarchy(): Promise<ExamGroupNode[]> {
    const { data, error } = await this.supabase
      .from("exam_groups")
      .select(
        `id, slug, name, description, sort_order,
         subjects(
           id, slug, name, description, sort_order,
           chapters(
             id, slug, name, description, sort_order,
             sub_chapters(
               id, slug, name, description, sort_order,
               topics(
                 id, slug, name, description, sort_order,
                 content_items(id, title, access_level, owner_contact, public_teaser)
               )
             )
           )
         )`
      )
      .order("sort_order");

    if (error) throw error;
    return data as unknown as ExamGroupNode[];
  }

  async getContentItem(
    id: string,
    userId?: string
  ): Promise<ContentItemDetail | null> {
    const { data, error } = await this.supabase.rpc("get_content_item", {
      p_item_id: id,
      p_user_id: userId ?? null,
    });

    if (error) throw error;
    return data;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("access_level, status")
      .eq("id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
