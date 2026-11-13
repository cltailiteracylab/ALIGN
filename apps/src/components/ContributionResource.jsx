import { useRef, useState } from "react";
import "../css/ContributionResource.css";


/* Small inline icons so the page needs no icon package. */
const Svg = ({ size = 16, children }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
   {children}
 </svg>
);
const ArrowRight = (p) => <Svg {...p}><path d="M5 12h14M12 5l7 7-7 7" /></Svg>;
const Bell = (p) => <Svg {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Svg>;
const FileText = (p) => <Svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></Svg>;
const Link2 = (p) => <Svg {...p}><path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" /></Svg>;
const UploadCloud = (p) => <Svg {...p}><path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" /><path d="M12 12v9M16 16l-4-4-4 4" /></Svg>;
const X = (p) => <Svg {...p}><path d="M18 6 6 18M6 6l12 12" /></Svg>;


/* Shared with the AI Agent group: keep step names, ORIGIN values and draft field names identical in both contribution flows. */
const STEPS = ["Upload Material", "Resource Information", "Additional Metadata", "Preview", "Submit"];
const ORIGIN = { HUMAN: "human", AI_ASSISTED: "ai_assisted", AI_GENERATED: "ai_generated" };
const ORIGIN_LABEL = {
 [ORIGIN.HUMAN]: "Human-created",
 [ORIGIN.AI_ASSISTED]: "AI-assisted",
 [ORIGIN.AI_GENERATED]: "AI-generated",
};


const CATEGORIES = ["AI Fundamentals", "Responsible AI", "AI Ethics", "Bias & Fairness", "Generative AI", "AI Privacy & Security", "AI Applications", "AI Evaluation"];
const AUDIENCES = ["Undergraduate Students", "Graduate Students", "Faculty/Educators", "K–12 Students", "General Public"];
const RESOURCE_TYPES = ["Lecture Slides", "Lesson Plan", "Activity Pack", "Assignment", "Quiz/Assessment", "Video", "Reading Material", "Interactive Tutorial", "Workshop"];
const LICENSES = ["Creative Commons Attribution 4.0 (CC BY 4.0)", "Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)", "Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)", "Creative Commons CC0 1.0", "All rights reserved", "Other"];


const emptyDraft = {
 file: null,
 link: "",
 title: "",
 description: "",
 learningObjectives: "",
 category: "",
 difficulty: "beginner",
 audience: [],
 resourceType: "",
 tags: [],
 authorName: "",
 institution: "",
 creationDate: "",
 lastUpdated: "",
 license: "",
 completionTime: "",
 prerequisites: "",
 origin: ORIGIN.HUMAN,
 aiTool: "",
 aiUsageDescription: "",
 usedInClass: null,
 studentCount: "",
 teachingNotes: "",
 researchLink: "",
 researchFile: null,
};


export function OriginBadge({ origin }) {
 return <span className={`cr-badge cr-badge--${origin}`}>{ORIGIN_LABEL[origin]}</span>;
}


function Choice({ value, onChange, options }) {
 return (
   <div className="cr-choice">
     {options.map((o) => (
       <button key={String(o.value)} type="button" className={value === o.value ? "is-selected" : ""} onClick={() => onChange(o.value)}>
         {o.label}
       </button>
     ))}
   </div>
 );
}


function Stepper({ current }) {
 return (
   <ol className="cr-stepper">
     {STEPS.map((label, i) => (
       <li key={label} className={i <= current ? "is-active" : ""}>
         <div className="cr-stepper__row">
           <span className="cr-stepper__dot">{i + 1}</span>
           {i < STEPS.length - 1 && <span className="cr-stepper__line" />}
         </div>
         <span className="cr-stepper__label">{label}</span>
       </li>
     ))}
   </ol>
 );
}


/* ---------------------------- Step 1: upload ---------------------------- */
function UploadStep({ draft, set }) {
 const inputRef = useRef(null);
 const [linkInput, setLinkInput] = useState(draft.link);
 const [error, setError] = useState("");


 const takeFile = (f) => {
   if (!f) return;
   if (!/\.(pdf|docx|pptx|mp4)$/i.test(f.name)) {
     setError("Use a PDF, DOCX, PPTX or MP4 file.");
     return;
   }
   setError("");
   set({ file: { name: f.name, size: f.size }, link: "" });
   setLinkInput("");
 };


 const addLink = () => {
   if (!/^https?:\/\/\S+\.\S+/.test(linkInput)) {
     setError("Enter a full link that starts with https://");
     return;
   }
   setError("");
   set({ link: linkInput, file: null });
 };


 return (
   <>
     <h2>Upload your teaching material</h2>
     <p className="cr-muted">Start with a file or a link. You can add the teaching details in the next step.</p>
     <div className="cr-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); takeFile(e.dataTransfer.files[0]); }}>
       <span className="cr-dropzone__icon"><UploadCloud size={28} /></span>
       <h3>Drag and drop your material here</h3>
       <p className="cr-muted">or choose a file from your computer</p>
       <input ref={inputRef} type="file" accept=".pdf,.docx,.pptx,.mp4" hidden onChange={(e) => takeFile(e.target.files[0])} />
       <button type="button" className="cr-btn cr-btn--primary" onClick={() => inputRef.current.click()}>Browse Files <ArrowRight size={15} /></button>
       <small className="cr-muted">PDF, DOCX, PPTX or video (MP4) · One resource per submission</small>
     </div>
     {draft.file && (
       <div className="cr-file">
         <FileText size={22} />
         <div><strong>{draft.file.name}</strong><small className="cr-muted">{(draft.file.size / 1e6).toFixed(1)} MB · Upload complete</small></div>
         <span className="cr-ready">Ready</span>
         <button type="button" aria-label="Remove file" className="cr-icon-btn" onClick={() => set({ file: null })}><X size={18} /></button>
       </div>
     )}
     <div className="cr-divider"><span>OR ADD A LINK</span></div>
     <label className="cr-label" htmlFor="cr-url">Paste resource URL (optional alternative)</label>
     <div className="cr-link-row">
       <div className="cr-input-icon"><Link2 size={16} /><input id="cr-url" className="cr-input" placeholder="https://" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} /></div>
       <button type="button" className="cr-btn" onClick={addLink}>Add Link</button>
     </div>
     <small className="cr-muted">{draft.link ? `Link added: ${draft.link}` : "For online materials, use a link that other educators can access."}</small>
     {error && <p className="cr-error" role="alert">{error}</p>}
   </>
 );
}


/* ------------------------ Step 2: resource info ------------------------ */
function InfoStep({ draft, set }) {
 const [tagInput, setTagInput] = useState("");
 const addTag = () => {
   const tag = tagInput.trim();
   if (tag && !draft.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) set({ tags: [...draft.tags, tag] });
   setTagInput("");
 };


 return (
   <>
     <h2>Tell educators about your resource</h2>
     <p className="cr-muted">Help colleagues understand what this material teaches and who it is for. Fields marked * are required.</p>
     <label className="cr-label" htmlFor="cr-title">Resource Title *</label>
     <input id="cr-title" className="cr-input" value={draft.title} onChange={(e) => set({ title: e.target.value })} />
     <label className="cr-label" htmlFor="cr-desc">Short Description *</label>
     <textarea id="cr-desc" rows={3} className="cr-input" value={draft.description} onChange={(e) => set({ description: e.target.value })} />
     <small className="cr-muted">A concise overview that will appear on the repository card.</small>
     <label className="cr-label" htmlFor="cr-objectives">Learning Objectives *</label>
     <textarea id="cr-objectives" rows={4} className="cr-input" value={draft.learningObjectives} onChange={(e) => set({ learningObjectives: e.target.value })} />
     <small className="cr-muted">Use clear, measurable outcomes; one objective per line.</small>
     <label className="cr-label" htmlFor="cr-category">Topic/Category *</label>
     <select id="cr-category" className="cr-input" value={draft.category} onChange={(e) => set({ category: e.target.value })}>
       <option value="">Select a topic</option>
       {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
     </select>
     <p className="cr-label">Difficulty Level *</p>
     <Choice value={draft.difficulty} onChange={(difficulty) => set({ difficulty })} options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]} />
     <label className="cr-label" htmlFor="cr-audience">Intended Audience *</label>
     <select id="cr-audience" className="cr-input" value={draft.audience[0] || ""} onChange={(e) => set({ audience: e.target.value ? [e.target.value] : [] })}>
       <option value="">Select intended audience</option>
       {AUDIENCES.map((audience) => <option key={audience} value={audience}>{audience}</option>)}
     </select>
     <label className="cr-label" htmlFor="cr-resource-type">Resource Type *</label>
     <select id="cr-resource-type" className="cr-input" value={draft.resourceType} onChange={(e) => set({ resourceType: e.target.value })}>
       <option value="">Select resource type</option>
       {RESOURCE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
     </select>
     <label className="cr-label" htmlFor="cr-tag">Keywords/Tags (optional)</label>
     <div className="cr-link-row">
       <input id="cr-tag" className="cr-input" placeholder="Add a keyword" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} />
       <button type="button" className="cr-btn" onClick={addTag}>Add Tag</button>
     </div>
     {draft.tags.length > 0 && <div className="cr-choice">{draft.tags.map((tag) => <button type="button" key={tag} title="Remove tag" onClick={() => set({ tags: draft.tags.filter((t) => t !== tag) })}>{tag} ×</button>)}</div>}
     <small className="cr-muted">Use specific terms to help other educators find your material.</small>
   </>
 );
}


/* ----------------------- Step 3: additional metadata ------------------- */
function MetadataStep({ draft, set }) {
 const researchRef = useRef(null);
 const isAI = draft.origin !== ORIGIN.HUMAN;
 const attribution = draft.authorName && draft.title && draft.license
   ? `“${draft.title}” by ${draft.authorName}${draft.institution ? `, ${draft.institution}` : ""}. Licensed under ${draft.license}.${draft.creationDate ? ` Created ${draft.creationDate}` : ""}${draft.lastUpdated ? `; updated ${draft.lastUpdated}` : ""}.`
   : "Complete the author, institution, date, and license fields to preview your attribution.";


 return (
   <>
     <h2>Add context and attribution</h2>
     <p className="cr-muted">Give educators the information they need to plan, adapt, and credit your material. Fields marked * are required.</p>
     <h3>Author and attribution</h3>
     <label className="cr-label" htmlFor="cr-author">Author Name *</label>
     <input id="cr-author" className="cr-input" value={draft.authorName} onChange={(e) => set({ authorName: e.target.value })} />
     <label className="cr-label" htmlFor="cr-institution">Department/Institution *</label>
     <input id="cr-institution" className="cr-input" value={draft.institution} onChange={(e) => set({ institution: e.target.value })} />
     <label className="cr-label" htmlFor="cr-created">Creation Date *</label>
     <input id="cr-created" type="date" className="cr-input" value={draft.creationDate} max={draft.lastUpdated || undefined} onChange={(e) => set({ creationDate: e.target.value })} />
     <label className="cr-label" htmlFor="cr-updated">Last Updated *</label>
     <input id="cr-updated" type="date" className="cr-input" value={draft.lastUpdated} min={draft.creationDate || undefined} onChange={(e) => set({ lastUpdated: e.target.value })} />
     <label className="cr-label" htmlFor="cr-license">Copyright/License Information *</label>
     <select id="cr-license" className="cr-input" value={draft.license} onChange={(e) => set({ license: e.target.value })}>
       <option value="">Select a license</option>
       {LICENSES.map((license) => <option key={license} value={license}>{license}</option>)}
     </select>
     <div className="cr-preview"><strong>How your attribution will appear</strong><p>{attribution}</p></div>


     <h3>Teaching and classroom usage</h3>
     <label className="cr-label" htmlFor="cr-completion">Estimated Completion Time *</label>
     <select id="cr-completion" className="cr-input" value={draft.completionTime} onChange={(e) => set({ completionTime: e.target.value })}>
       <option value="">Select duration</option>
       {["15 minutes", "30 minutes", "45 minutes", "1 hour", "1.5 hours", "2 hours", "Other"].map((time) => <option key={time} value={time}>{time}</option>)}
     </select>
     <label className="cr-label" htmlFor="cr-prerequisites">Prerequisites (optional)</label>
     <input id="cr-prerequisites" className="cr-input" placeholder="e.g., No prior AI experience required" value={draft.prerequisites} onChange={(e) => set({ prerequisites: e.target.value })} />
     <p className="cr-label">Has this resource been taught or used in a classroom? *</p>
     <Choice value={draft.usedInClass} onChange={(usedInClass) => set({ usedInClass, studentCount: usedInClass ? draft.studentCount : "" })} options={[{ value: true, label: "Yes" }, { value: false, label: "Not yet" }]} />
     {draft.usedInClass && <><label className="cr-label" htmlFor="cr-students">How many students have used it? *</label><input id="cr-students" type="number" min="1" className="cr-input cr-input--short" value={draft.studentCount} onChange={(e) => set({ studentCount: e.target.value })} /></>}
     <label className="cr-label" htmlFor="cr-notes">Teaching Notes (optional)</label>
     <textarea id="cr-notes" rows={3} className="cr-input" placeholder="How was it used? Any tips for other educators?" value={draft.teachingNotes} onChange={(e) => set({ teachingNotes: e.target.value })} />


     <h3>AI transparency and supporting research</h3>
     <p className="cr-label">Who created this resource? *</p>
     <Choice value={draft.origin} onChange={(origin) => set({ origin, aiTool: origin === ORIGIN.HUMAN ? "" : draft.aiTool, aiUsageDescription: origin === ORIGIN.HUMAN ? "" : draft.aiUsageDescription })} options={[{ value: ORIGIN.HUMAN, label: "I created it" }, { value: ORIGIN.AI_ASSISTED, label: "AI-assisted" }, { value: ORIGIN.AI_GENERATED, label: "AI-generated" }]} />
     {isAI && <>
       <label className="cr-label" htmlFor="cr-ai">Which AI tool was used? *</label>
       <input id="cr-ai" className="cr-input" placeholder="e.g., ChatGPT, Claude, Gemini" value={draft.aiTool} onChange={(e) => set({ aiTool: e.target.value })} />
       <label className="cr-label" htmlFor="cr-ai-usage">How was AI used? (optional)</label>
       <textarea id="cr-ai-usage" rows={3} className="cr-input" placeholder="Explain how AI helped create or adapt the material." value={draft.aiUsageDescription} onChange={(e) => set({ aiUsageDescription: e.target.value })} />
     </>}
     <p className="cr-label">Related research (optional)</p>
     <div className="cr-link-row">
       <input className="cr-input" aria-label="Related research link" placeholder="Link to a paper or DOI" value={draft.researchLink} onChange={(e) => set({ researchLink: e.target.value })} />
       <input ref={researchRef} type="file" accept=".pdf" hidden onChange={(e) => e.target.files[0] && set({ researchFile: e.target.files[0].name })} />
       <button type="button" className="cr-btn" onClick={() => researchRef.current.click()}>Upload PDF</button>
     </div>
     {draft.researchFile && <small className="cr-muted">{draft.researchFile} <button type="button" className="cr-link" onClick={() => set({ researchFile: null })}>Remove</button></small>}
   </>
 );
}


/* ---------------------------- Steps 4 and 5 ---------------------------- */
const prettyDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not provided";
const shortLicense = (license) => (license.match(/\((CC[^)]+)\)/)?.[1] || license || "Not provided");
const fileExtension = (draft) => draft.file?.name?.split(".").pop()?.toUpperCase() || (draft.link ? "LINK" : "FILE");
const descriptionLines = (value) => value.split("\n").map((line) => line.trim()).filter(Boolean);


function ResourceDetails({ draft }) {
 return (
   <div className="cr-new-details">
     <div className="cr-new-pills"><span>{draft.category}</span><span>{draft.difficulty}</span><OriginBadge origin={draft.origin} /></div>
     <h2>{draft.title}</h2>
     <p className="cr-muted">{draft.description}</p>
     <p className="cr-new-byline">By {draft.authorName} · {draft.institution}</p>
     <p className="cr-new-muted-small">☆ No ratings yet · 0 written reviews · 0 uses</p>
     <div className="cr-new-details-grid">
       <div>
         <h3>Resource preview</h3>
         <div className="cr-new-document">
           <div className="cr-new-document-top"><span>{draft.file?.name || "LINKED RESOURCE"}</span><span>Preview</span></div>
           <div className="cr-new-document-sheet">
             <span className="cr-new-pill">{draft.completionTime} · {draft.resourceType}</span>
             <h3>{draft.title}</h3>
             <p>{draft.description}</p>
             <strong>Learning objectives</strong>
             <ol>{descriptionLines(draft.learningObjectives).map((objective, i) => <li key={i}>{objective}</li>)}</ol>
             {draft.teachingNotes && <div className="cr-new-notes"><strong>Teaching notes</strong><p>{draft.teachingNotes}</p></div>}
             {draft.link && <p><a href={draft.link} target="_blank" rel="noopener noreferrer">Open resource link</a></p>}
           </div>
         </div>
         <h4>Learning objectives</h4>
         <div className="cr-new-objectives">{descriptionLines(draft.learningObjectives).map((objective, i) => <div key={i}>{objective}</div>)}</div>
         {draft.tags.length > 0 && <p className="cr-new-muted-small">Keywords: {draft.tags.join(" · ")}</p>}
         {draft.researchLink && <p className="cr-new-muted-small">Related research: <a href={draft.researchLink} target="_blank" rel="noopener noreferrer">View paper</a></p>}
         {draft.researchFile && <p className="cr-new-muted-small">Related research file: {draft.researchFile}</p>}
       </div>
       <aside className="cr-new-ready">
         <h3>Ready to teach</h3>
         {draft.link ? <a className="cr-btn cr-btn--primary" href={draft.link} target="_blank" rel="noopener noreferrer">Open Resource →</a> : <button type="button" className="cr-btn cr-btn--primary" disabled title="File downloading is not connected to storage">Download Resource →</button>}
         <button type="button" className="cr-btn" disabled title="Bookmarks will be available when connected to the repository">Save to Bookmarks</button>
         <dl>
           <dt>Intended audience</dt><dd>{draft.audience.join("; ")}</dd>
           <dt>Topic / difficulty</dt><dd>{draft.category} · {draft.difficulty}</dd>
           <dt>Resource type / format</dt><dd>{draft.resourceType} · {fileExtension(draft)}</dd>
           <dt>Last updated</dt><dd>{prettyDate(draft.lastUpdated)}</dd>
           <dt>Estimated completion</dt><dd>{draft.completionTime}</dd>
           <dt>Prerequisites</dt><dd>{draft.prerequisites || "None specified"}</dd>
           <dt>Copyright / license</dt><dd>{shortLicense(draft.license)}</dd>
           <dt>Classroom usage</dt><dd>{draft.usedInClass ? `${draft.studentCount} students` : "Not yet used in class"}</dd>
           {draft.aiTool && <><dt>AI tool used</dt><dd>{draft.aiTool}</dd></>}
         </dl>
       </aside>
     </div>
   </div>
 );
}


function PreviewStep({ draft, goToStep }) {
 return (
   <div className="cr-new-preview">
     <div className="cr-new-section-heading"><h2>Repository card preview</h2><button type="button" className="cr-btn" onClick={() => goToStep(1)}>Edit Resource Information</button></div>
     <div className="cr-new-card-grid">
       <div className="cr-new-resource-card">
         <div className="cr-new-card-top"><span className="cr-new-pill">{draft.category}</span><span aria-hidden="true">♧</span></div>
         <h3>{draft.title}</h3><p className="cr-muted">{draft.description}</p>
         <p>By {draft.authorName}</p>
         <p className="cr-new-muted-small"><span className="cr-new-pill">{draft.difficulty}</span> {draft.resourceType} · {fileExtension(draft)}</p>
         <div className="cr-new-stats"><span>No ratings yet</span><span>0 uses</span></div>
         <div className="cr-new-card-bottom"><span>Updated {prettyDate(draft.lastUpdated)}</span><button className="cr-btn" type="button" onClick={() => document.getElementById("cr-details-preview")?.scrollIntoView({ behavior: "smooth", block: "start" })}>View Details</button></div>
       </div>
       <div className="cr-new-preview-notice"><span>PREVIEW ONLY</span><h3>See your resource as educators will see it</h3><p>Check the title, description, and metadata before continuing. Your draft is not visible in the repository.</p><p>New resources start with no ratings or written reviews. Usage counts begin when the resource is published.</p></div>
     </div>
     <div id="cr-details-preview" className="cr-new-section-heading"><h2>Resource details page preview</h2><button type="button" className="cr-btn" onClick={() => goToStep(2)}>Edit Metadata</button></div>
     <ResourceDetails draft={draft} />
   </div>
 );
}


function SubmitStep({ draft, onSubmit, onSaveDraft, onPreview, onBack, submitted, onReset, saved }) {
 return submitted ? (
   <div className="cr-done"><h2>Resource submitted for review</h2><p className="cr-muted">“{draft.title}” has been marked pending review in this demo. Track it under My Contributions once the backend is connected.</p><button type="button" className="cr-btn" onClick={onReset}>Contribute another</button></div>
 ) : (
   <div className="cr-new-submit">
     <div className="cr-new-submit-grid">
       <section className="cr-new-submit-main">
         <h2>Your resource is ready for review</h2><span className="cr-new-status">{saved ? "Draft · Saved in this session" : "Draft · Not yet submitted"}</span>
         <h2>{draft.title}</h2><p className="cr-muted">{draft.description}</p>
         <div className="cr-new-file"><FileText size={25} /><div><strong>{draft.file?.name || draft.link}</strong><small>{fileExtension(draft)}{draft.file?.size ? ` · ${(draft.file.size / 1e6).toFixed(1)} MB` : " · Linked resource"}</small></div><span>✓</span></div>
         <dl>
           <dt>Author / institution</dt><dd>{draft.authorName} · {draft.institution}</dd>
           <dt>Classification</dt><dd>{draft.category} · {draft.difficulty} · {draft.resourceType}</dd>
           <dt>Audience / duration</dt><dd>{draft.audience.join("; ")} · {draft.completionTime}</dd>
           <dt>Dates / license</dt><dd>Created {prettyDate(draft.creationDate)} · Updated {prettyDate(draft.lastUpdated)} · {shortLicense(draft.license)}</dd>
         </dl>
       </section>
       <aside className="cr-new-submit-side">
         <div className="cr-new-next"><h2>What happens next?</h2><div><strong>➤ Sent for review</strong><p>Submit this draft to the platform’s resource review queue.</p></div><div><strong>◷ Pending Review</strong><p>Your resource will be marked Pending Review in My Contributions.</p></div><div><strong>▣ Track the outcome</strong><p>Check My Contributions for review status and feedback before publication.</p></div></div>
         <div className="cr-new-checks"><h3>Final checks</h3><p>✓ Material uploaded</p><p>✓ Required details complete</p><p>✓ Author and license included</p><p>✓ Preview available</p></div>
       </aside>
     </div>
     <div className="cr-new-submit-footer"><p>Submitting sends this draft for review; it does not publish it immediately. Save as Draft if you want to keep editing before submitting.</p><div className="cr-new-footer-actions"><button type="button" className="cr-btn" onClick={onBack}>← Back</button><div><button type="button" className="cr-btn" onClick={onSaveDraft}>Save as Draft</button><button type="button" className="cr-btn" onClick={onPreview}>Preview Submission</button><button type="button" className="cr-btn cr-btn--primary" onClick={onSubmit}>Submit for Review <ArrowRight size={15} /></button></div></div></div>
   </div>
 );
}


const PREVIEW_STYLES = `
.cr-new-preview,.cr-new-submit{font-size:14px;color:#232e42}.cr-new-preview h2,.cr-new-submit h2{margin:0 0 14px}.cr-new-section-heading{display:flex;justify-content:space-between;align-items:center;gap:16px;margin:24px 0 16px}.cr-new-section-heading:first-child{margin-top:0}.cr-new-section-heading h2{font-size:18px;margin:0}.cr-new-preview .cr-btn,.cr-new-submit .cr-btn{font-size:13px}.cr-new-card-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}.cr-new-resource-card,.cr-new-details,.cr-new-submit-main,.cr-new-next{border:1px solid #dce3ee;border-radius:16px;background:white;padding:22px}.cr-new-resource-card{max-width:460px}.cr-new-card-top,.cr-new-stats,.cr-new-card-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px}.cr-new-resource-card h3{font-size:17px;margin:16px 0 8px}.cr-new-resource-card p{margin:8px 0;line-height:1.5}.cr-new-pill,.cr-new-pills>span{display:inline-block;background:#e7efff;color:#3365cd;border-radius:18px;padding:5px 12px;font-size:11px}.cr-new-muted-small,.cr-new-stats,.cr-new-card-bottom{color:#6f7f9a;font-size:12px}.cr-new-stats{padding:15px 0}.cr-new-card-bottom{border-top:1px solid #e2e7ef;padding-top:13px}.cr-new-preview-notice{padding:24px;background:#e5edfc;border-radius:15px;line-height:1.6}.cr-new-preview-notice>span{color:#3164d1;font-size:10px;font-weight:700}.cr-new-preview-notice h3{margin:14px 0}.cr-new-preview-notice p{color:#657690}.cr-new-details{padding:24px}.cr-new-pills{display:flex;flex-wrap:wrap;gap:6px}.cr-new-pills>span:nth-child(2){background:#f0f3f9;color:#526078;text-transform:capitalize}.cr-new-details>h2{font-size:26px;margin:12px 0 6px}.cr-new-byline{font-size:13px}.cr-new-details-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(215px,.75fr);gap:20px;margin-top:22px}.cr-new-details-grid h3{font-size:16px}.cr-new-document,.cr-new-ready{background:#f5f7fb;border:1px solid #e0e7f1;border-radius:12px;padding:18px}.cr-new-document-top{display:flex;justify-content:space-between;gap:8px;font-size:10px;color:#7a89a1;margin-bottom:14px;overflow-wrap:anywhere}.cr-new-document-sheet{background:white;border:1px solid #e1e8f0;padding:22px;line-height:1.65}.cr-new-document-sheet h3{font-size:21px;margin:12px 0}.cr-new-document-sheet ol{padding-left:20px}.cr-new-notes{background:#e6efff;padding:12px;border-radius:8px;margin-top:12px}.cr-new-ready{align-self:start}.cr-new-ready>.cr-btn{display:block;width:fit-content;margin:12px 0;text-align:center;text-decoration:none}.cr-new-ready dl,.cr-new-submit-main dl{margin-bottom:0}.cr-new-ready dt,.cr-new-submit-main dt{color:#7585a0;font-size:12px;margin-top:16px}.cr-new-ready dd,.cr-new-submit-main dd{margin:5px 0;font-weight:600;overflow-wrap:anywhere}.cr-new-objectives{line-height:1.6}.cr-new-details h4{margin-bottom:8px}.cr-new-submit-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(240px,.8fr);gap:20px}.cr-new-submit-main h2:first-child{font-size:20px}.cr-new-status{display:inline-block;background:#f2f5f9;border-radius:18px;padding:7px 16px;font-size:12px;color:#71819c}.cr-new-submit-main h2:nth-of-type(2){font-size:25px;margin-top:24px}.cr-new-submit-main>p{line-height:1.6}.cr-new-file{display:flex;align-items:center;gap:15px;padding:18px;background:#f3f6fb;border-radius:12px;margin:20px 0;overflow-wrap:anywhere}.cr-new-file>div{flex:1;min-width:0}.cr-new-file small{display:block;color:#74839a;margin-top:5px}.cr-new-file>span{color:#13854a;font-size:20px}.cr-new-submit-main dt{margin-top:24px}.cr-new-submit-side{display:flex;flex-direction:column;gap:18px}.cr-new-next h2{font-size:19px}.cr-new-next div{margin-top:18px}.cr-new-next p{color:#71819b;line-height:1.5;margin:6px 0}.cr-new-checks{background:#e6edfb;border-radius:14px;padding:22px}.cr-new-checks h3{margin:0 0 14px}.cr-new-checks p{margin:10px 0}.cr-new-submit-footer{border:1px solid #dce3ee;border-radius:16px;background:white;padding:22px;margin-top:22px}.cr-new-submit-footer>p{color:#6f7e96;margin:0 0 20px;line-height:1.5}.cr-new-footer-actions,.cr-new-footer-actions>div{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.cr-new-ready button:disabled{opacity:.65;cursor:not-allowed}@media(max-width:850px){.cr-new-card-grid,.cr-new-details-grid,.cr-new-submit-grid{grid-template-columns:1fr}.cr-new-resource-card{max-width:none}.cr-new-section-heading{align-items:flex-start}.cr-new-submit-footer{padding:15px}}
`;


/* ------------------------------ Auth modal ----------------------------- */
function AuthModal({ onAuth, onClose }) {
 const [mode, setMode] = useState("login");
 const [form, setForm] = useState({ name: "", email: "", password: "" });
 const [error, setError] = useState("");
 const submit = (e) => {
   e.preventDefault();
   // TEMP fake login: no validation, any input (or none) works
   onAuth({ name: form.name || form.email.split("@")[0] || "Maya Chen" });
 };
 const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });
 return (
   <div className="cr-modal-backdrop" role="dialog" aria-modal="true">
     <form className="cr-modal" onSubmit={submit}>
       <button type="button" aria-label="Close" className="cr-icon-btn cr-modal__close" onClick={onClose}><X size={18} /></button>
       <h2>{mode === "login" ? "Log in to contribute" : "Create an account to contribute"}</h2>
       {mode === "signup" && <><label className="cr-label" htmlFor="cr-name">Full name</label><input id="cr-name" className="cr-input" value={form.name} onChange={update("name")} /></>}
       <label className="cr-label" htmlFor="cr-email">Email</label>
       <input id="cr-email" type="email" className="cr-input" value={form.email} onChange={update("email")} />
       <label className="cr-label" htmlFor="cr-pass">Password</label>
       <input id="cr-pass" type="password" className="cr-input" value={form.password} onChange={update("password")} />
       {error && <p className="cr-error" role="alert">{error}</p>}
       <button className="cr-btn cr-btn--primary cr-btn--block">{mode === "login" ? "Log in" : "Sign up"}</button>
       <button type="button" className="cr-link" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>{mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}</button>
     </form>
   </div>
 );
}


/* --------------------------------- Page -------------------------------- */
const NAV = ["Dashboard", "Materials Repository", "Saved Resources", "Contribute a Resource", "My Contributions"];
export default function ContributionResource({ onNavigate }) {
 const [user, setUser] = useState(null);
 const [showAuth, setShowAuth] = useState(false);
 const [started, setStarted] = useState(false);
 const [step, setStep] = useState(0);
 const [draft, setDraft] = useState(emptyDraft);
 const [submitted, setSubmitted] = useState(false);
 const [saved, setSaved] = useState(false);
 const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
 const startContribution = () => (user ? setStarted(true) : setShowAuth(true));
 const canContinue = [
   Boolean(draft.file || draft.link),
   Boolean(draft.title.trim() && draft.description.trim() && draft.learningObjectives.trim() && draft.category && draft.difficulty && draft.audience.length && draft.resourceType),
   Boolean(draft.authorName.trim() && draft.institution.trim() && draft.creationDate && draft.lastUpdated && draft.creationDate <= draft.lastUpdated && draft.license && draft.completionTime && draft.usedInClass !== null && (!draft.usedInClass || Number(draft.studentCount) > 0) && (draft.origin === ORIGIN.HUMAN || draft.aiTool.trim())),
   true,
 ][step];
 const reset = () => { setDraft({ ...emptyDraft, audience: [], tags: [] }); setStep(0); setSubmitted(false); setSaved(false); };
 return (
   <div className="cr-app">
     <style>{PREVIEW_STYLES}</style>
     <aside className="cr-sidebar">
       <div className="cr-logo"><span className="cr-square" /> Platform Name</div>      
       <nav>
         {NAV.map((item) => {
           const active = item === "Contribute a Resource";


           return (
             <button
               key={item}
               type="button"
               className={active ? "is-active" : ""}
               onClick={() => {
                 if (active) {
                   startContribution();
                 } else if (item === "My Contributions") {
                   onNavigate?.("My Contributions");
                 }
               }}
             >
               <span className="cr-square" />
               {item}
             </button>
           );
         })}
       </nav>
       <div className="cr-sidebar__footer">
         {user ? <div className="cr-user"><span className="cr-avatar">{user.name.slice(0, 2).toUpperCase()}</span><div><strong>{user.name}</strong><small>Faculty</small></div></div> : <button type="button" className="cr-link cr-link--light" onClick={() => setShowAuth(true)}>Log in or sign up</button>}
         <div className="cr-settings"><span className="cr-square" /> Settings</div>
       </div>
     </aside>
     <main className="cr-main">
       <header className="cr-topbar"><span>Faculty workspace <em className="cr-tag">AI LITERACY</em></span><span className="cr-topbar__right"><Bell size={18} /> Westbridge University</span></header>
       <h1>Contribute a Resource</h1>
       <p className="cr-muted">Share your knowledge and help other educators teach AI literacy.</p>
       {!started ? <section className="cr-card cr-start"><h2>Have a resource other educators could use?</h2><button type="button" className="cr-btn cr-btn--primary" onClick={startContribution}>Contribute <ArrowRight size={15} /></button></section> : <>
         <Stepper current={step} />
         <section className={step >= 3 ? "cr-final-stage" : "cr-card"}>
           {step === 0 && <UploadStep draft={draft} set={set} />}
           {step === 1 && <InfoStep draft={draft} set={set} />}
           {step === 2 && <MetadataStep draft={draft} set={set} />}
           {step === 3 && <PreviewStep draft={draft} goToStep={setStep} />}
           {step === 4 && <SubmitStep draft={draft} submitted={submitted} saved={saved} onReset={reset} onSubmit={() => setSubmitted(true)} onSaveDraft={() => setSaved(true)} onPreview={() => setStep(3)} onBack={() => setStep(3)} />}
         </section>
         {step === 3 && <footer className="cr-footer"><button type="button" className="cr-btn" onClick={() => setStep(2)}>Back</button><button type="button" className="cr-btn cr-btn--primary" onClick={() => setStep(4)}>Continue to Submit <ArrowRight size={15} /></button></footer>}
         {step < 3 && <footer className="cr-footer"><button type="button" className="cr-btn" onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))}>{step === 0 ? "Cancel" : "Back"}</button><button type="button" className="cr-btn cr-btn--primary" disabled={!canContinue} onClick={() => setStep(step + 1)}>{step === 3 ? "Submit" : "Continue"} <ArrowRight size={15} /></button></footer>}
       </>}
     </main>
     {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => { setUser(u); setShowAuth(false); setStarted(true); }} />}
   </div>
 );
}



