import { useMemo, useState } from "react";
import "../css/MyContributions.css";


// Sample content matching the Figma design. Replace this array with API data later.
const SAMPLE_CONTRIBUTIONS = [
 {
   id: 1,
   title: "Evaluating AI Outputs: A Classroom Toolkit",
   type: "Activity pack",
   format: "PDF",
   date: "Not submitted",
   detailDate: "Updated 30 Oct 2026",
   status: "Draft",
   description: "A practical workshop that helps students evaluate AI-generated claims.",
 },
 {
   id: 2,
   title: "AI-Assisted Assessment: A Rubric Guide",
   type: "Teaching guide",
   format: "PDF",
   date: "28 Oct 2026",
   detailDate: "Submitted for review",
   status: "Pending Review",
 },
 {
   id: 3,
   title: "Teaching with AI: Privacy Checklist",
   type: "Checklist",
   format: "DOCX",
   date: "24 Oct 2026",
   detailDate: "Feedback received 27 Oct",
   status: "Needs Revision",
   feedback:
     "Please add a classroom example showing how to remove student identifiers before using an AI tool, and clarify which checklist items apply to third-party services.",
   reviewer: "Resource reviewer",
   feedbackDate: "27 Oct 2026",
 },
 {
   id: 4,
   title: "AI Ethics in Education",
   type: "Discussion guide",
   format: "PDF",
   date: "18 Oct 2026",
   detailDate: "Approved 21 Oct 2026",
   status: "Approved",
 },
 {
   id: 5,
   title: "Responsible AI Syllabus Statements",
   type: "Template pack",
   format: "DOCX",
   date: "10 Oct 2026",
   detailDate: "Approved 13 Oct 2026",
   status: "Approved",
 },
 {
   id: 6,
   title: "AI in the Classroom: Discussion Starters",
   type: "Activity pack",
   format: "PDF",
   date: "02 Oct 2026",
   detailDate: "Approved 06 Oct 2026",
   status: "Approved",
 },
];


const FILTERS = ["All", "Draft", "Pending Review", "Approved", "Needs Revision"];
const NAV_ITEMS = [
 "Dashboard",
 "Materials Repository",
 "Saved Resources",
 "Contribute a Resource",
 "My Contributions",
];


function Icon({ name, size = 19, ...props }) {
 const paths = {
   bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21h4"/></>,
   files: <><rect x="8" y="3" width="11" height="14" rx="1.5"/><path d="M5 7H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1"/><path d="M11 7h5M11 10h5"/></>,
   check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
   clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
   draft: <><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h4M8 12h7M8 16h4"/><path d="m13 19 5-5 2 2-5 5-3 1z"/></>,
   feedback: <><path d="M4 4h16v12H9l-5 4V4z"/><path d="M12 7v4M12 13h.01"/></>,
   arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
   back: <><path d="M19 12H5m6 6-6-6 6-6"/></>,
   close: <><path d="M18 6 6 18M6 6l12 12"/></>,
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}


function StatusBadge({ status }) {
 const className = status.toLowerCase().replace(/\s+/g, "-");
 return <span className={`mc-status mc-status--${className}`}>{status}</span>;
}


/**
* Optional integration callbacks:
* onNavigate(pageName) -- switch to another page in your existing app
* onEdit(resource) -- open a draft or revision in your contribution form
* onView(resource) -- open a submitted/published resource in your app
*/
export default function MyContributions({
 contributions = SAMPLE_CONTRIBUTIONS,
 userName = "Dr. Maya Chen",
 institution = "Westbridge University",
 onNavigate,
 onEdit,
 onView,
}) {
 const [filter, setFilter] = useState("All");
 const [selectedResource, setSelectedResource] = useState(null);
 const [message, setMessage] = useState("");


 const counts = useMemo(() => ({
   All: contributions.length,
   Draft: contributions.filter((r) => r.status === "Draft").length,
   "Pending Review": contributions.filter((r) => r.status === "Pending Review").length,
   Approved: contributions.filter((r) => r.status === "Approved").length,
   "Needs Revision": contributions.filter((r) => r.status === "Needs Revision").length,
 }), [contributions]);


 const visibleContributions = filter === "All"
   ? contributions
   : contributions.filter((resource) => resource.status === filter);


 const revision = contributions.find((resource) => resource.status === "Needs Revision" && resource.feedback);


 const navigate = (page) => {
   setMessage("");
   if (onNavigate) onNavigate(page);
   else if (page !== "My Contributions") setMessage(`Connect the “${page}” page using the onNavigate prop.`);
 };


 const viewResource = (resource) => {
   if (onView) onView(resource);
   else setSelectedResource(resource);
 };


 const editResource = (resource) => {
   if (onEdit) onEdit(resource);
   else setSelectedResource(resource);
 };


 const modalAction = selectedResource?.status === "Draft"
   ? "Edit Draft"
   : selectedResource?.status === "Needs Revision"
     ? "Revise & Resubmit"
     : selectedResource?.status === "Approved" ? "View Resource" : "View Submission";


 return (
   <div className="mc-app">
     <aside className="mc-sidebar">
       <div className="mc-logo"><span className="mc-icon-square mc-logo-square"/>Platform Name</div>
       <nav className="mc-nav" aria-label="Main navigation">
         {NAV_ITEMS.map((page) => (
           <button
             type="button"
             key={page}
             className={`mc-nav-item ${page === "My Contributions" ? "mc-nav-item--active" : ""}`}
             aria-current={page === "My Contributions" ? "page" : undefined}
             onClick={() => navigate(page)}
           >
             <span className="mc-icon-square" />{page}
           </button>
         ))}
       </nav>
       <div className="mc-sidebar-bottom">
         <div className="mc-profile">
           <span className="mc-avatar">{userName.replace(/^Dr\.\s*/, "").split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase()}</span>
           <div><strong>{userName}</strong><small>Faculty</small></div>
         </div>
         <button type="button" className="mc-nav-item mc-settings" onClick={() => navigate("Settings")}><span className="mc-icon-square"/>Settings</button>
       </div>
     </aside>


     <main className="mc-main">
       <header className="mc-topbar">
         <div>Faculty workspace <span className="mc-ai-tag">AI LITERACY</span></div>
         <div className="mc-institution"><Icon name="bell" size={19}/>{institution}</div>
       </header>


       <div className="mc-title-row">
         <div><h1>My Contributions</h1><p>Track and manage the resources you have shared.</p></div>
         <button type="button" className="mc-btn mc-btn--primary" onClick={() => navigate("Contribute a Resource")}>Contribute a Resource + <Icon name="arrow" size={16}/></button>
       </div>
       {message && <div className="mc-notice" role="status">{message} <button type="button" onClick={() => setMessage("")} aria-label="Dismiss message"><Icon name="close" size={15}/></button></div>}


       <section className="mc-stats" aria-label="Contribution statistics">
         {[
           { label: "Total Submissions", number: counts.All, note: "Includes your saved drafts", icon: "files" },
           { label: "Approved", number: counts.Approved, note: "Published in the repository", icon: "check" },
           { label: "Pending Review", number: counts["Pending Review"], note: "Awaiting reviewer feedback", icon: "clock" },
           { label: "Drafts", number: counts.Draft, note: "Ready to continue editing", icon: "draft" },
         ].map(({ label, number, note, icon }) => (
           <article className="mc-stat-card" key={label}>
             <div className="mc-stat-heading"><span>{label}</span><Icon name={icon} size={20}/></div>
             <strong className="mc-stat-number">{number}</strong>
             <p>{note}</p>
           </article>
         ))}
       </section>


       <section className="mc-list-card" aria-label="Submitted resources">
         <div className="mc-filters" aria-label="Filter contributions">
           {FILTERS.map((name) => (
             <button
               key={name}
               type="button"
               className={`mc-filter ${filter === name ? "mc-filter--active" : ""}`}
               onClick={() => setFilter(name)}
               aria-pressed={filter === name}
             >
               {name === "Draft" ? "Drafts" : name} ({counts[name]})
             </button>
           ))}
         </div>
         <div className="mc-table-scroll">
           <table className="mc-table">
             <thead><tr><th>Resource</th><th>Submission Date</th><th>Status</th><th>Actions</th></tr></thead>
             <tbody>
               {visibleContributions.map((resource) => (
                 <tr key={resource.id}>
                   <td><strong>{resource.title}</strong><small>{resource.type} · {resource.format}</small></td>
                   <td>{resource.date}<small>{resource.detailDate}</small></td>
                   <td><StatusBadge status={resource.status}/></td>
                   <td className="mc-actions">
                     {resource.status === "Draft" && <button type="button" onClick={() => editResource(resource)}>Edit Draft</button>}
                     {resource.status === "Pending Review" && <button type="button" onClick={() => viewResource(resource)}>View Submission</button>}
                     {resource.status === "Needs Revision" && <><button type="button" onClick={() => setSelectedResource(resource)}>View Reviewer Feedback</button><button type="button" onClick={() => editResource(resource)}>Revise &amp; Resubmit</button></>}
                     {resource.status === "Approved" && <button type="button" onClick={() => viewResource(resource)}>View Resource</button>}
                   </td>
                 </tr>
               ))}
               {visibleContributions.length === 0 && <tr><td colSpan={4} className="mc-empty">No contributions in this category.</td></tr>}
             </tbody>
           </table>
         </div>
         <div className="mc-table-footer"><span>Showing {visibleContributions.length} of {contributions.length} contributions · {counts["Needs Revision"]} needs revision</span><span>Latest activity first</span></div>
       </section>


       {revision && (
         <section className="mc-feedback">
           <Icon name="feedback" size={22}/>
           <div className="mc-feedback-content">
             <strong>Reviewer feedback · {revision.title}</strong>
             <p>“{revision.feedback}”</p>
             <small>{revision.reviewer} · {revision.feedbackDate}</small>
           </div>
           <button type="button" className="mc-btn mc-btn--white" onClick={() => editResource(revision)}>Revise &amp; Resubmit</button>
         </section>
       )}
     </main>


     {selectedResource && (
       <div className="mc-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedResource(null); }}>
         <section className="mc-modal" role="dialog" aria-modal="true" aria-labelledby="mc-dialog-title">
           <button type="button" className="mc-modal-close" aria-label="Close" onClick={() => setSelectedResource(null)}><Icon name="close"/></button>
           <h2 id="mc-dialog-title">{modalAction}</h2>
           <h3>{selectedResource.title}</h3>
           <StatusBadge status={selectedResource.status}/>
           <p>{selectedResource.type} · {selectedResource.format}</p>
           {selectedResource.feedback && <div className="mc-modal-feedback"><strong>Reviewer feedback</strong><p>{selectedResource.feedback}</p></div>}
           <p className="mc-modal-note">This page currently uses sample resources. Connect the <code>onEdit</code> and <code>onView</code> props to your application to open the actual resource editor or details.</p>
           <button type="button" className="mc-btn mc-btn--primary" onClick={() => setSelectedResource(null)}>Close</button>
         </section>
       </div>
     )}
   </div>
 );
}



