import { createClient } from "@/lib/supabase/server";
import type { ContentItem, ContentVariant } from "@/lib/types";

export class ContentRepository {
  private async getClient() {
    return await createClient();
  }

  async findById(id: string): Promise<ContentItem | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async findByTopic(topicId: string): Promise<ContentItem[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("topic_id", topicId)
      .order("sort_order");

    if (error) throw error;
    return data;
  }

  async create(data: Partial<ContentItem>): Promise<ContentItem> {
    const supabase = await this.getClient();
    const { data: created, error } = await supabase
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
    const supabase = await this.getClient();
    const { data: updated, error } = await supabase
      .from("content_items")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id: string): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("content_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
