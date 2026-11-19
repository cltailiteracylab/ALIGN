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





/* Shared with the AI Agent group: keep ORIGIN values and draft field names identical in both contribution flows. */

const STEPS = ["Upload Material", "Resource Information", "Additional Metadata", "Preview", "Submit"];

const ORIGIN = { HUMAN: "human", AI_ASSISTED: "ai_assisted", AI_GENERATED: "ai_generated" };

const ORIGIN_LABEL = {

 [ORIGIN.HUMAN]: "Human-created",

 [ORIGIN.AI_ASSISTED]: "AI-assisted",

 [ORIGIN.AI_GENERATED]: "AI-generated",

};





const CATEGORIES = ["AI Fundamentals", "Responsible AI", "AI Ethics", "Bias & Fairness", "Generative AI", "AI Privacy & Security", "AI Applications", "AI Evaluation"];

const LEARNING_SUPPORTED_OPTIONS = [
  "Conceptual Understanding",
  "Critical Thinking",
  "Problem Solving",
  "Practical Skills",
  "Ethical Reasoning",
  "Collaboration",
  "AI Literacy",
];

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

 learningSupported: [],

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

     <p className="cr-muted">Start with a file or a link, then describe your teaching resource below.</p>

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
 const [showOtherLearning, setShowOtherLearning] = useState(false);
 const [customLearning, setCustomLearning] = useState("");

 const toggleLearning = (option) => {
   set({
     learningSupported: draft.learningSupported.includes(option)
       ? draft.learningSupported.filter((item) => item !== option)
       : [...draft.learningSupported, option],
   });
 };

 const addCustomLearning = () => {
   const value = customLearning.trim();
   if (value && !draft.learningSupported.some((item) => item.toLowerCase() === value.toLowerCase())) {
     set({ learningSupported: [...draft.learningSupported, value] });
   }
   setCustomLearning("");
 };

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

     <p className="cr-label" id="cr-learning-supported-label">Learning Supported (optional)</p>

     <div className="cr-learning-options" role="group" aria-labelledby="cr-learning-supported-label">
       {LEARNING_SUPPORTED_OPTIONS.map((option) => (
         <label key={option} className="cr-learning-option">
           <input
             type="checkbox"
             checked={draft.learningSupported.includes(option)}
             onChange={() => toggleLearning(option)}
           />
           <span>{option}</span>
         </label>
       ))}
       <label className="cr-learning-option">
         <input
           type="checkbox"
           checked={showOtherLearning}
           onChange={(e) => setShowOtherLearning(e.target.checked)}
         />
         <span>Other</span>
       </label>
     </div>

     {showOtherLearning && (
       <div className="cr-learning-other">
         <label className="cr-label" htmlFor="cr-learning-other">Specify other learning supported</label>
         <div className="cr-link-row">
           <input
             id="cr-learning-other"
             className="cr-input"
             placeholder="Enter another learning outcome"
             value={customLearning}
             onChange={(e) => setCustomLearning(e.target.value)}
             onKeyDown={(e) => {
               if (e.key === "Enter") {
                 e.preventDefault();
                 addCustomLearning();
               }
             }}
           />
           <button type="button" className="cr-btn" onClick={addCustomLearning}>Add</button>
         </div>
       </div>
     )}

     {draft.learningSupported.length > 0 && (
       <div className="cr-learning-selected" aria-label="Selected learning supported">
         {draft.learningSupported.map((item) => (
           <button
             type="button"
             className="cr-learning-tag"
             key={item}
             title={`Remove ${item}`}
             onClick={() => toggleLearning(item)}
           >
             {item} ×
           </button>
         ))}
       </div>
     )}

     <small className="cr-muted">Select as many as apply. Use Other to add any unlisted options. These will appear as tags on your resource.</small>

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

     <div className="cr-new-pills"><span>{draft.category}</span>{draft.learningSupported.map((item) => <span key={item}>{item}</span>)}<OriginBadge origin={draft.origin} /></div>

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

           <dt>Topic / category</dt><dd>{draft.category}</dd>

           {draft.learningSupported.length > 0 && <><dt>Learning Supported</dt><dd>{draft.learningSupported.join(", ")}</dd></>}

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

         <p className="cr-new-muted-small">{draft.learningSupported.map((item) => <span key={item} className="cr-new-pill">{item}</span>)} {draft.resourceType} · {fileExtension(draft)}</p>

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

           <dt>Classification</dt><dd>{draft.category} · {draft.resourceType}</dd>

           {draft.learningSupported.length > 0 && <><dt>Learning Supported</dt><dd>{draft.learningSupported.join(", ")}</dd></>}

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
 const [authToContribute, setAuthToContribute] = useState(false);

 const [started, setStarted] = useState(false);
 const [showCombinedForm, setShowCombinedForm] = useState(false);

 const [step, setStep] = useState(0);

 const [draft, setDraft] = useState(emptyDraft);

 const [submitted, setSubmitted] = useState(false);

 const [saved, setSaved] = useState(false);
 const [formError, setFormError] = useState("");

 const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

 const startContribution = () => {
   // The landing page's Contribute button requires sign-in first.
   if (user) {
     setShowCombinedForm(true);
   } else {
     setAuthToContribute(true);
     setShowAuth(true);
   }
 };

 const continueContribution = () => {
   if (!draft.file && !draft.link) {
     setFormError("Upload a teaching material file or add a resource URL first.");
     return;
   }
   if (!(draft.title.trim() && draft.description.trim() && draft.learningObjectives.trim() && draft.category && draft.audience.length && draft.resourceType)) {
     setFormError("Complete the required resource information before contributing.");
     return;
   }
   setFormError("");
   setStarted(true);
   setShowCombinedForm(false);
   setStep(2);
 };

 const canContinue = [
   Boolean(draft.file || draft.link),
   Boolean(draft.title.trim() && draft.description.trim() && draft.learningObjectives.trim() && draft.category && draft.audience.length && draft.resourceType),
   Boolean(draft.authorName.trim() && draft.institution.trim() && draft.creationDate && draft.lastUpdated && draft.creationDate <= draft.lastUpdated && draft.license && draft.completionTime && draft.usedInClass !== null && (!draft.usedInClass || Number(draft.studentCount) > 0) && (draft.origin === ORIGIN.HUMAN || draft.aiTool.trim())),
   true,
 ][step];

 const reset = () => {
   setDraft({ ...emptyDraft, audience: [], tags: [], learningSupported: [] });
   setStep(0);
   setStarted(false);
   setShowCombinedForm(false);
   setSubmitted(false);
   setSaved(false);
   setFormError("");
 };

 return (

   <div className="cr-app">

 

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

         {user ? <div className="cr-user"><span className="cr-avatar">{user.name.slice(0, 2).toUpperCase()}</span><div><strong>{user.name}</strong><small>Faculty</small></div></div> : <button type="button" className="cr-link cr-link--light" onClick={() => { setAuthToContribute(false); setShowAuth(true); }}>Log in or sign up</button>}

         <div className="cr-settings"><span className="cr-square" /> Settings</div>

       </div>

     </aside>

     <main className="cr-main">

       <header className="cr-topbar"><span>Faculty workspace <em className="cr-tag">AI LITERACY</em></span><span className="cr-topbar__right"><Bell size={18} /> Westbridge University</span></header>

       <h1>Contribute a Resource</h1>

       <p className="cr-muted">Share your knowledge and help other educators teach AI literacy.</p>

       {!started && !showCombinedForm ? (
         <section className="cr-card cr-start">
           <h2>Have a resource other educators could use?</h2>
           <button type="button" className="cr-btn cr-btn--primary" onClick={startContribution}>
             Contribute <ArrowRight size={15} />
           </button>
         </section>
       ) : !started ? (
        <>
          <section className="cr-card cr-combined-form" aria-label="Contribute a teaching resource">
            <div className="cr-combined-section">
              <UploadStep draft={draft} set={set} />
            </div>
            <div className="cr-combined-section cr-combined-section--info">
              <InfoStep draft={draft} set={set} />
            </div>
            {formError && <p className="cr-error" role="alert">{formError}</p>}
            <div className="cr-combined-actions">
              <button type="button" className="cr-btn" onClick={() => { setShowCombinedForm(false); setFormError(""); }}>Back</button>
              <button type="button" className="cr-btn cr-btn--primary" onClick={continueContribution}>
                Contribute <ArrowRight size={15} />
              </button>
              <small className="cr-muted">Continue to additional metadata and preview.</small>
            </div>
          </section>
        </>
      ) : (
        <>
          <Stepper current={step} />
          <section className={step >= 3 ? "cr-final-stage" : "cr-card"}>
            {step === 2 && <MetadataStep draft={draft} set={set} />}
            {step === 3 && <PreviewStep draft={draft} goToStep={(nextStep) => { if (nextStep === 1) { setStarted(false); setShowCombinedForm(true); } else setStep(nextStep); }} />}
            {step === 4 && <SubmitStep draft={draft} submitted={submitted} saved={saved} onReset={reset} onSubmit={() => setSubmitted(true)} onSaveDraft={() => setSaved(true)} onPreview={() => setStep(3)} onBack={() => setStep(3)} />}
          </section>
          {step === 3 && (
            <footer className="cr-footer">
              <button type="button" className="cr-btn" onClick={() => setStep(2)}>Back</button>
              <button type="button" className="cr-btn cr-btn--primary" onClick={() => setStep(4)}>Continue to Submit <ArrowRight size={15} /></button>
            </footer>
          )}
          {step === 2 && (
            <footer className="cr-footer">
              <button type="button" className="cr-btn" onClick={() => { setStarted(false); setShowCombinedForm(true); }}>Back to Resource Information</button>
              <button type="button" className="cr-btn cr-btn--primary" disabled={!canContinue} onClick={() => setStep(3)}>
                Continue <ArrowRight size={15} />
              </button>
            </footer>
          )}
        </>
      )}

     </main>

     {showAuth && <AuthModal onClose={() => { setShowAuth(false); setAuthToContribute(false); }} onAuth={(u) => { setUser(u); setShowAuth(false); if (authToContribute) setShowCombinedForm(true); setAuthToContribute(false); }} />}

   </div>

 );

}






