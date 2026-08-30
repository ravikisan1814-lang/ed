"use client";

import { useEffect, useState } from "react";
import type { ExamGroupNode, SubjectNode, ChapterNode, SubChapterNode } from "@/lib/types";

type Tab = "ingest" | "recent";

interface ClassifyResult {
  subject: { id: string; name: string; slug: string } | null;
  chapter: { id: string; name: string; slug: string } | null;
  topic: { id: string; name: string; slug: string } | null;
  score: number;
  method: string;
  message?: string;
}

interface IngestResult {
  action: "created" | "variant-appended" | "skipped-duplicate";
  contentItemId: string | null;
  topic: { id: string | null; name: string; slug: string } | null;
  variantIndex: number | null;
  warnings: string[];
}

export default function ContentIngest() {
  const [tree, setTree] = useState<ExamGroupNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(true);
  const [tab, setTab] = useState<Tab>("ingest");
  const [recentResults, setRecentResults] = useState<IngestResult[]>([]);

  // Selector state
  const [groupSlug, setGroupSlug] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [chapterSlug, setChapterSlug] = useState("");
  const [topicSlug, setTopicSlug] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const [publicTeaser, setPublicTeaser] = useState("");
  const [accessLevel, setAccessLevel] = useState(4);
  const [variantLabel, setVariantLabel] = useState("");
  const [variantInterface, setVariantInterface] = useState("notes");

  // UI state
  const [classifying, setClassifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classifyResult, setClassifyResult] = useState<ClassifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load hierarchy
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/hierarchy");
        const json = await res.json();
        if (!cancelled) setTree(json.data ?? []);
      } catch {
        if (!cancelled) setTree([]);
      } finally {
        if (!cancelled) setLoadingTree(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  // Derive selected nodes from tree
  const selectedGroup = tree.find((g) => g.slug === groupSlug);
  const selectedSubject = selectedGroup?.subjects?.find((s) => s.slug === subjectSlug);
  const selectedChapter = selectedSubject?.chapters?.find((c) => c.slug === chapterSlug);
  const selectedSubChapter = selectedChapter?.sub_chapters?.find((sc) => sc.slug === topicSlug.split("-topic")[0] && false) ?? null;
  const selectedTopic = selectedChapter?.sub_chapters?.flatMap((sc) => sc.topics ?? []).find((t) => t.slug === topicSlug);

  // Flatten all topics for the topic selector
  const allTopics = (selectedChapter?.sub_chapters ?? []).flatMap((sc) =>
    (sc.topics ?? []).map((t) => ({ ...t, subChapterName: sc.name }))
  );

  // Auto-fill title when topic changes
  useEffect(() => {
    if (selectedTopic && !title) {
      setTitle(`${selectedTopic.name} — Notes`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic?.name, topicSlug]);

  const handleGroupChange = (slug: string) => {
    setGroupSlug(slug);
    setSubjectSlug("");
    setChapterSlug("");
    setTopicSlug("");
    setClassifyResult(null);
  };

  const handleSubjectChange = (slug: string) => {
    setSubjectSlug(slug);
    setChapterSlug("");
    setTopicSlug("");
    setClassifyResult(null);
  };

  const handleChapterChange = (slug: string) => {
    setChapterSlug(slug);
    setTopicSlug("");
    setClassifyResult(null);
  };

  const handleTopicChange = (slug: string) => {
    setTopicSlug(slug);
    setClassifyResult(null);
  };

  // Classify: preview where content will go
  const handleClassify = async () => {
    if (!text.trim()) {
      setError("Please enter note content first.");
      return;
    }
    setClassifying(true);
    setError(null);
    setClassifyResult(null);
    try {
      const res = await fetch("/api/admin/ingest/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, hint }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Classification failed");
        return;
      }
      setClassifyResult(json as ClassifyResult);
      // Auto-select if confident
      if (json.topic && json.score >= 0.5) {
        // Find and set the matching selectors
        const subj = tree.flatMap((g) => g.subjects ?? []).find((s) => s.slug === json.subject?.slug);
        if (subj) {
          setSubjectSlug(json.subject!.slug);
          const ch = subj.chapters?.find((c) => c.slug === json.chapter?.slug);
          if (ch) {
            setChapterSlug(json.chapter!.slug);
            const sc = ch.sub_chapters?.find((s) => (s.topics ?? []).some((t) => t.slug === json.topic!.slug));
            if (sc) {
              setTopicSlug((sc.topics ?? []).find((t) => t.slug === json.topic!.slug)?.slug ?? "");
            }
          }
        }
      }
    } catch {
      setError("Network error during classification");
    } finally {
      setClassifying(false);
    }
  };

  // Submit: full ingest
  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Note content is required.");
      return;
    }
    if (!selectedTopic) {
      setError("Please select a topic from the hierarchy.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          hint: hint || selectedTopic.name,
          title: title || `${selectedTopic.name} — Notes`,
          accessLevel,
          ownerContact: "ravikisan1814@gmail.com",
          publicTeaser: publicTeaser || `Notes on ${selectedTopic.name}.`,
          variantLabel: variantLabel || undefined,
          variantInterface: variantInterface || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Ingestion failed");
        return;
      }
      const result = json as IngestResult;
      setSuccess(
        result.action === "created"
          ? "Note created successfully"
          : result.action === "variant-appended"
          ? `Appended as variant #${result.variantIndex ?? 0}`
          : "Skipped — duplicate content detected"
      );
      setRecentResults((prev) => [result, ...prev].slice(0, 20));
      setText("");
      setHint("");
      setPublicTeaser("");
      setVariantLabel("");
    } catch {
      setError("Network error during submission");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ingest-page">
      <div className="ingest-header">
        <h1>Content Ingestion</h1>
        <p>Paste your notes and they will be auto-classified and placed under the correct topic in the syllabus.</p>
      </div>

      {error && (
        <div className="ingest-alert ingest-alert-error" role="alert">
          <span className="ingest-alert-icon">⚠</span>
          {error}
        </div>
      )}
      {success && (
        <div className="ingest-alert ingest-alert-success" role="alert">
          <span className="ingest-alert-icon">✓</span>
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="ingest-tabs">
        <button
          type="button"
          className={`ingest-tab${tab === "ingest" ? " ingest-tab-active" : ""}`}
          onClick={() => setTab("ingest")}
        >
          Ingest Note
        </button>
        <button
          type="button"
          className={`ingest-tab${tab === "recent" ? " ingest-tab-active" : ""}`}
          onClick={() => setTab("recent")}
        >
          Recent ({recentResults.length})
        </button>
      </div>

      {tab === "ingest" && (
        <div className="ingest-layout">
          {/* Left: Hierarchy + Form */}
          <div className="ingest-main">
            {/* Hierarchy selector */}
            <section className="ingest-section">
              <h2>1. Select Topic</h2>
              {loadingTree ? (
                <p className="ingest-loading">Loading syllabus…</p>
              ) : (
                <div className="ingest-selectors">
                  <div className="ingest-select-group">
                    <label>Exam Group</label>
                    <select value={groupSlug} onChange={(e) => handleGroupChange(e.target.value)} aria-label="Select exam group">
                      <option value="">— Select —</option>
                      {tree.map((g) => (
                        <option key={g.id} value={g.slug}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ingest-select-group">
                    <label>Subject</label>
                    <select value={subjectSlug} onChange={(e) => handleSubjectChange(e.target.value)} disabled={!groupSlug} aria-label="Select subject">
                      <option value="">— Select —</option>
                      {(selectedGroup?.subjects ?? []).map((s) => (
                        <option key={s.id} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ingest-select-group">
                    <label>Chapter</label>
                    <select value={chapterSlug} onChange={(e) => handleChapterChange(e.target.value)} disabled={!subjectSlug} aria-label="Select chapter">
                      <option value="">— Select —</option>
                      {(selectedSubject?.chapters ?? []).map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ingest-select-group">
                    <label>Topic</label>
                    <select value={topicSlug} onChange={(e) => handleTopicChange(e.target.value)} disabled={!chapterSlug} aria-label="Select topic">
                      <option value="">— Select —</option>
                      {allTopics.map((t) => (
                        <option key={t.id} value={t.slug}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </section>

            {/* Placement info */}
            {selectedTopic && (
              <div className="ingest-placement">
                <span className="ingest-placement-label">Placing under:</span>
                <span className="ingest-placement-path">
                  {selectedGroup?.name} / {selectedSubject?.name} / {selectedChapter?.name} /{" "}
                  <strong>{selectedTopic.name}</strong>
                </span>
              </div>
            )}

            {/* Form */}
            <section className="ingest-section">
              <h2>2. Note Content</h2>
              <div className="ingest-fields">
                <div className="ingest-field">
                  <label htmlFor="ingest-title">Title</label>
                  <input
                    id="ingest-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={selectedTopic ? `${selectedTopic.name} — Notes` : "Note title"}
                  />
                </div>
                <div className="ingest-field">
                  <label htmlFor="ingest-hint">Hint (optional)</label>
                  <input
                    id="ingest-hint"
                    type="text"
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    placeholder="e.g. &apos;Class 11 Physics - Vectors&apos;"
                  />
                </div>
                <div className="ingest-field">
                  <label htmlFor="ingest-teaser">Public Teaser (optional)</label>
                  <input
                    id="ingest-teaser"
                    type="text"
                    value={publicTeaser}
                    onChange={(e) => setPublicTeaser(e.target.value)}
                    placeholder="Short preview for visitors"
                  />
                </div>
                <div className="ingest-field">
                  <label htmlFor="ingest-access">Access Level</label>
                  <select id="ingest-access" value={accessLevel} onChange={(e) => setAccessLevel(Number(e.target.value))}>
                    <option value={1}>Level 1 — Owner only</option>
                    <option value={2}>Level 2 — Member</option>
                    <option value={3}>Level 3 — Co-member</option>
                    <option value={4}>Level 4 — Public (free)</option>
                  </select>
                </div>
                <div className="ingest-field">
                  <label htmlFor="ingest-var-label">Variant Label (optional)</label>
                  <input
                    id="ingest-var-label"
                    type="text"
                    value={variantLabel}
                    onChange={(e) => setVariantLabel(e.target.value)}
                    placeholder="e.g. &apos;Type 2&apos;, &apos;Q&A&apos;"
                  />
                </div>
                <div className="ingest-field">
                  <label htmlFor="ingest-var-interface">Variant Interface</label>
                  <select id="ingest-var-interface" value={variantInterface} onChange={(e) => setVariantInterface(e.target.value)}>
                    <option value="notes">Notes</option>
                    <option value="qa">Q&amp;A</option>
                    <option value="cards">Flashcards</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>
                <div className="ingest-field ingest-field-full">
                  <label htmlFor="ingest-text">Note Content <span className="ingest-required">*</span></label>
                  <textarea
                    id="ingest-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your notes here (Markdown supported)...&#10;&#10;You can paste from PDF exports, Word docs, or type directly."
                    rows={12}
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="ingest-actions">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={classifying || !text.trim()}
                onClick={handleClassify}
              >
                {classifying ? "Classifying…" : "Preview Placement"}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={submitting || !text.trim() || !selectedTopic}
                onClick={handleSubmit}
              >
                {submitting ? "Ingesting…" : "Ingest Note"}
              </button>
            </div>

            {/* Classification preview */}
            {classifyResult && (
              <div className={`ingest-classify-preview${classifyResult.message ? " ingest-classify-preview-warn" : ""}`}>
                <h3>Classification Result</h3>
                {classifyResult.message ? (
                  <p>{classifyResult.message}</p>
                ) : classifyResult.topic ? (
                  <>
                    <p>
                      This note matches: <strong>
                        {classifyResult.subject?.name} / {classifyResult.chapter?.name} / {classifyResult.topic.name}
                      </strong>
                    </p>
                    <p className="ingest-score">
                      Confidence: {(classifyResult.score * 100).toFixed(0)}% · Method: {classifyResult.method}
                    </p>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="ingest-sidebar">
            <div className="ingest-sidebar-card">
              <h3>Quick Stats</h3>
              <div className="ingest-stats">
                <div className="ingest-stat">
                  <span className="ingest-stat-num">{tree.reduce((s, g) => s + (g.subjects?.length ?? 0), 0)}</span>
                  <span className="ingest-stat-label">Subjects</span>
                </div>
                <div className="ingest-stat">
                  <span className="ingest-stat-num">
                    {tree.reduce((s, g) => s + (g.subjects?.reduce((ss, subj) => ss + (subj.chapters?.length ?? 0), 0) ?? 0), 0)}
                  </span>
                  <span className="ingest-stat-label">Chapters</span>
                </div>
                <div className="ingest-stat">
                  <span className="ingest-stat-num">{recentResults.length}</span>
                  <span className="ingest-stat-label">Notes ingested</span>
                </div>
              </div>
            </div>

            <div className="ingest-sidebar-card">
              <h3>How it works</h3>
              <ol className="ingest-how-to">
                <li><strong>Select a topic</strong> from the hierarchy, or paste content and click &quot;Preview Placement&quot; to auto-classify.</li>
                <li><strong>Paste your notes</strong> in the textarea. Supports plain text and Markdown.</li>
                <li><strong>Set access level</strong> — Level 4 (public) for free content, lower levels for premium.</li>
                <li><strong>Click &quot;Ingest Note&quot;</strong> — your content is filed under the chosen topic.</li>
                <li><strong>Repeat</strong> — additional notes on the same topic become Type 2, Type 3, etc.</li>
              </ol>
            </div>

            <div className="ingest-sidebar-card">
              <h3>Tips</h3>
              <ul className="ingest-tips">
                <li>Use the <strong>Hint</strong> field to help classification if the topic isn&apos;t obvious.</li>
                <li>For <strong>variant notes</strong> (Q&amp;A, flashcards), set a Variant Label.</li>
                <li>Duplicates are detected automatically — identical content is skipped.</li>
                <li>Use <strong>Level 4</strong> for notes you want all visitors to read.</li>
              </ul>
            </div>
          </aside>
        </div>
      )}

      {tab === "recent" && (
        <div className="ingest-recent">
          {recentResults.length === 0 ? (
            <div className="under-development">
              <span className="ud-icon">🔮</span>
              <span>No notes ingested yet. Go to the Ingest tab to add your first note.</span>
            </div>
          ) : (
            <div className="ingest-recent-list">
              {recentResults.map((r, i) => (
                <div key={i} className={`ingest-recent-item ingest-recent-${r.action}`}>
                  <span className={`ingest-recent-badge ingest-recent-badge-${r.action}`}>
                    {r.action === "created" ? "NEW" : r.action === "variant-appended" ? "VARIANT" : "DUPLICATE"}
                  </span>
                  <span className="ingest-recent-topic">{r.topic?.name ?? "—"}</span>
                  {r.warnings.length > 0 && (
                    <span className="ingest-recent-warnings">{r.warnings.join(", ")}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
