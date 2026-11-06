import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowDownToLine, ArrowLeft, ArrowRight, Check, ChevronDown, Clipboard, Code2, FileText, Inbox, Mail, Monitor, Smartphone } from "lucide-react";
import { renderEmailHtml, renderEmailText } from "./email";
import { previews, type EmailPreview, type PreviewCategory } from "./previews";

const categories: PreviewCategory[] = ["Account", "Billing", "Notifications", "Customer"];

export default function App() {
  const [selectedId, setSelectedId] = useState(previews[0].id);
  const [mode, setMode] = useState<"html" | "text">("html");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(() => window.matchMedia("(max-width: 760px)").matches);
  const [previewWidth, setPreviewWidth] = useState(390);
  const [frameHeight, setFrameHeight] = useState(1);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameObserverRef = useRef<ResizeObserver | null>(null);
  const selected = previews.find((preview) => preview.id === selectedId) ?? previews[0];
  const html = useMemo(() => renderEmailHtml(selected.content), [selected]);
  const text = useMemo(() => renderEmailText(selected.content), [selected]);
  const index = previews.findIndex((preview) => preview.id === selected.id);
  const drawerHidden = isNarrow && !mobileMenuOpen;

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => {
      setIsNarrow(media.matches);
      if (!media.matches) setMobileMenuOpen(false);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const update = () => setPreviewWidth(Math.floor(node.getBoundingClientRect().width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [viewport]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => () => frameObserverRef.current?.disconnect(), []);

  const choose = (preview: EmailPreview) => {
    setSelectedId(preview.id);
    setMobileMenuOpen(false);
    if (isNarrow) menuTriggerRef.current?.focus();
  };

  const navigate = (direction: -1 | 1) => {
    const nextIndex = (index + direction + previews.length) % previews.length;
    choose(previews[nextIndex]);
  };

  const copyBody = async () => {
    try {
      await navigator.clipboard.writeText(mode === "html" ? html : text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const measureEmail = () => {
    frameObserverRef.current?.disconnect();
    const frameDocument = frameRef.current?.contentDocument;
    if (!frameDocument) return;
    const emailTable = frameDocument.body.querySelector("table");
    if (!emailTable) return;
    const updateHeight = () => {
      setFrameHeight(Math.max(1, Math.ceil(emailTable.getBoundingClientRect().height)));
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(emailTable);
    frameObserverRef.current = observer;
  };

  return (
    <div className="workbench">
      <aside id="template-navigation" className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`} aria-hidden={drawerHidden} inert={drawerHidden}>
        <div className="brand">
          <img className="brand-logo" src="/assets/fazzres-logo.png" alt="FazzRes" />
          <span className="brand-tag">LAB</span>
        </div>

        <div className="sidebar-intro">
          <div className="eyebrow"><Activity size={12} /> MESSAGE QA</div>
          <h1>Email<br /><span>preview.</span></h1>
          <p>Every template, one inbox.</p>
        </div>

        <nav className="template-nav" aria-label="Email templates">
          {categories.map((category) => {
            const items = previews.filter((preview) => preview.category === category);
            return <section className="nav-section" key={category}>
              <div className="nav-heading"><span>{category}</span><span className="nav-count">{String(items.length).padStart(2, "0")}</span></div>
              {items.map((preview) => <button
                type="button"
                key={preview.id}
                className={`template-link ${selected.id === preview.id ? "active" : ""}`}
                onClick={() => choose(preview)}
                aria-current={selected.id === preview.id ? "page" : undefined}
              >
                <span className="template-dot" />
                <span className="template-link-copy"><span>{preview.name}</span><small>{preview.language === "English" ? "EN" : "ID"}</small></span>
              </button>)}
            </section>;
          })}
        </nav>

        <div className="sidebar-footer"><span className="status-light" />{previews.length} previews <span>·</span> local only</div>
      </aside>

      {mobileMenuOpen && <button className="menu-scrim" aria-label="Close template menu" onClick={() => { setMobileMenuOpen(false); menuTriggerRef.current?.focus(); }} />}

      <main className="main-panel">
        <header className="topbar">
          <button ref={menuTriggerRef} className="mobile-menu-button icon-button" aria-label="Choose email template" aria-expanded={mobileMenuOpen} aria-controls="template-navigation" onClick={() => setMobileMenuOpen((open) => !open)}><Inbox size={18} /><ChevronDown size={14} /></button>
          <div className="breadcrumb"><span>Preview lab</span><span className="breadcrumb-slash">/</span><strong>{selected.name}</strong></div>
          <div className="topbar-right"><span className="local-badge"><span />LOCAL PREVIEW</span><div className="topbar-separator" /><span className="topbar-index">{String(index + 1).padStart(2, "0")} <span>/</span> {String(previews.length).padStart(2, "0")}</span></div>
        </header>

        <section className="content-area">
          <div className="page-heading">
            <div>
              <div className="eyebrow light-eyebrow">{selected.category.toUpperCase()} <span>·</span> {selected.language.toUpperCase()}</div>
              <h2>{selected.name}</h2>
              <p>Review the rendered email and its plain-text fallback.</p>
            </div>
            <div className="heading-arrows">
              <button type="button" className="icon-button" title="Previous email" aria-label="Previous email" onClick={() => navigate(-1)}><ArrowLeft size={17} /></button>
              <button type="button" className="icon-button" title="Next email" aria-label="Next email" onClick={() => navigate(1)}><ArrowRight size={17} /></button>
            </div>
          </div>

          <div className="subject-strip"><span>SUBJECT</span><strong>{selected.subject}</strong><span className="subject-state"><Check size={13} /> READY TO REVIEW</span></div>

          <div className="toolbar">
            <div className="mode-switch" role="tablist" aria-label="Email format">
              <button type="button" role="tab" aria-selected={mode === "html"} className={mode === "html" ? "selected" : ""} onClick={() => setMode("html")}><Code2 size={15} />Rendered HTML</button>
              <button type="button" role="tab" aria-selected={mode === "text"} className={mode === "text" ? "selected" : ""} onClick={() => setMode("text")}><FileText size={15} />Plain text</button>
            </div>
            <div className="toolbar-right">
              <div className="viewport-switch" aria-label="Preview width">
                <button type="button" title="Desktop width" aria-label="Desktop width" className={viewport === "desktop" ? "selected" : ""} onClick={() => setViewport("desktop")}><Monitor size={15} /></button>
                <button type="button" title="Mobile width" aria-label="Mobile width" className={viewport === "mobile" ? "selected" : ""} onClick={() => setViewport("mobile")}><Smartphone size={15} /></button>
              </div>
              <button type="button" className="copy-button" aria-label={copied ? "Copied email preview" : mode === "html" ? "Copy rendered HTML" : "Copy plain-text email"} title={copied ? "Copied" : "Copy preview"} onClick={copyBody}>{copied ? <Check size={14} /> : <Clipboard size={14} />}<span>{copied ? "Copied" : "Copy"}</span></button>
            </div>
          </div>

          <section className="mail-window" aria-label="Email preview">
            <div className="window-bar">
              <div className="window-controls"><span /><span /><span /></div>
              <div className="window-address"><ArrowDownToLine size={12} /> inbox.fazzres.local / message-preview</div>
              <span className="window-readonly">READ ONLY</span>
            </div>
            <div className="mail-meta">
              <div className="mail-meta-icon"><Mail size={17} /></div>
              <div className="mail-meta-content">
                <div className="mail-subject-line"><strong>{selected.subject}</strong><span className="preview-label">PREVIEW</span></div>
                <div className="mail-address-line"><span>From</span><b>{selected.from}</b></div>
                <div className="mail-address-line"><span>To</span><b>{selected.to}</b></div>
              </div>
              <span className="mail-date">Today, 9:41 AM</span>
            </div>
            <div ref={stageRef} className={`email-stage ${viewport === "mobile" ? "stage-mobile" : ""}`}>
              <div className="email-stage-label"><span>{mode === "html" ? "HTML RENDER" : "TEXT BODY"}</span><span>{viewport === "mobile" ? `${Math.min(390, previewWidth)} PX VIEWPORT` : mode === "html" ? "600 PX MAX CARD" : "680 PX MAX TEXT"}</span></div>
              {mode === "html" ? <iframe ref={frameRef} className="email-frame" style={{ width: viewport === "mobile" ? Math.min(390, previewWidth) : "100%", height: frameHeight }} onLoad={measureEmail} title={`${selected.name} rendered email`} srcDoc={html} sandbox="allow-same-origin" /> : <pre className="plain-text-frame">{text}</pre>}
            </div>
            <div className="window-foot"><span>Rendered locally from sample data</span><span>{selected.language} <i>·</i> {selected.category}</span></div>
          </section>

          <footer className="content-footer"><span>Template content is sample data. No email is sent.</span><span>FAZZRES <b>·</b> EMAIL PREVIEW LAB</span></footer>
        </section>
      </main>
    </div>
  );
}
