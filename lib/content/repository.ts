import { createClient } from "@/lib/supabase/server";
import type { ContentItem, ContentVariant } from "@/lib/types";

export class ContentRepository {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async findById(id: string): Promise<ContentItem | null> {
    const { data, error } = await this.supabase
      .from("content_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByTopic(topicId: string): Promise<ContentItem[]> {
    const { data, error } = await this.supabase
      .from("content_items")
      .select("*")
      .eq("topic_id", topicId)
      .order("sort_order");

    if (error) throw error;
    return data;
  }

  async create(data: Partial<ContentItem>): Promise<ContentItem> {
    const { data: created, error } = await this.supabase
      .from("content_items")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  async update(
    id: string,
    data: Partial<ContentItem>
  ): Promise<ContentItem> {
    const { data: updated, error } = await this.supabase
      .from("content_items")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("content_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
