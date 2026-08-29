"use client";

import { useState } from "react";
import Link from "next/link";
import ErrorBoundary from "./ErrorBoundary";
import type { ContentItemDetail } from "@/lib/types";

interface TopicContentViewProps {
  content: ContentItemDetail | null;
  userAccessLevel: number;
  topicTitle?: string;
  figureType?: string;
}

export default function TopicContentView({ content, userAccessLevel, topicTitle, figureType }: TopicContentViewProps) {
  const [activeVariant, setActiveVariant] = useState(0);

  if (!content) {
    return (
      <div role="status" aria-live="polite" className="under-development">
        <span className="ud-icon" aria-hidden="true">⏳</span>
        Loading content...
      </div>
    );
  }

  const isLocked = content.is_locked && content.access_level > userAccessLevel;

  return (
    <ErrorBoundary
      fallback={
        <div role="alert" aria-live="assertive" className="error-boundary">
          <h2>Failed to load content</h2>
          <p>Please try refreshing the page or contact support.</p>
          <button onClick={() => window.location.reload()}>Refresh page</button>
        </div>
      }
    >
      <article className="content-item" aria-label={`Content: ${content.title}`}>
        <div className="content-item-header">
          <h1 className="content-item-title">{content.title}</h1>
          <span className={`badge ${isLocked ? "badge-locked" : "badge-open"}`}>
            {isLocked ? `Locked (${content.access_level})` : "Open"}
          </span>
        </div>

        {content.public_teaser && (
          <div className="public-concept" aria-label="Public preview">
            <p>{content.public_teaser}</p>
          </div>
        )}

        {isLocked ? (
          <div className="locked-payload" role="region" aria-label="Locked content preview">
            <h3>🔒 This content is locked</h3>
            <p>
              {content.owner_contact ? (
                <>
                  Contact the owner at{" "}
                  <a href={`mailto:${content.owner_contact}`} className="ai-chat-link">
                    {content.owner_contact}
                  </a>{" "}
                  to request access.
                </>
              ) : (
                "Contact the platform administrator to request access."
              )}
            </p>
          </div>
        ) : (
          <>
            {content.locked_payload && (
              <div
                className="locked-payload"
                role="region"
                aria-label="Full content"
                dangerouslySetInnerHTML={{ __html: content.locked_payload }}
              />
            )}

            {content.variants && content.variants.length > 0 && (
              <div className="variant-panel" role="region" aria-label="Content variants">
                <div className="content-tabs">
                  <div className="content-tabs-header">
                    <h2 className="content-tabs-title">Learning Modes</h2>
                    <div className="content-tabs-list" role="tablist" aria-label="Select content variant">
                      {content.variants.map((variant, idx) => (
                        <button
                          key={idx}
                          role="tab"
                          aria-selected={activeVariant === idx}
                          aria-controls={`panel-${idx}`}
                          id={`tab-${idx}`}
                          className={`content-tab-btn ${activeVariant === idx ? "content-tab-btn-active" : ""}`}
                          onClick={() => setActiveVariant(idx)}
                        >
                          {variant.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {content.variants.map((variant, idx) => (
                    <div
                      key={idx}
                      role="tabpanel"
                      id={`panel-${idx}`}
                      aria-labelledby={`tab-${idx}`}
                      className={`content-tab-panel ${activeVariant === idx ? "" : "hidden"}`}
                      hidden={activeVariant !== idx}
                    >
                      <div className="tab-content">
                        <h3>{variant.label}</h3>
                        <pre
                          className="journal-textarea"
                          style={{ whiteSpace: "pre-wrap" }}
                          aria-label={variant.label}
                          dangerouslySetInnerHTML={{ __html: variant.content }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {content.owner_contact && !isLocked && (
          <p className="locked-overlay-mail">
            Content by:{" "}
            <a href={`mailto:${content.owner_contact}`} aria-label={`Contact ${content.owner_contact}`}>
              {content.owner_contact}
            </a>
          </p>
        )}
      </article>
    </ErrorBoundary>
  );
}
