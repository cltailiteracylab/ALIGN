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

   detailDate: "Posted 28 Oct 2026",

   status: "Posted",

   likes: 5,

 },

 {

   id: 3,

   title: "Teaching with AI: Privacy Checklist",

   type: "Checklist",

   format: "DOCX",

   date: "24 Oct 2026",

   detailDate: "Posted 24 Oct 2026",

   status: "Posted",

   likes: 3,

 },

 {

   id: 4,

   title: "AI Ethics in Education",

   type: "Discussion guide",

   format: "PDF",

   date: "18 Oct 2026",

   detailDate: "Verified 21 Oct 2026",

   status: "Verified",

   likes: 24,

 },

 {

   id: 5,

   title: "Responsible AI Syllabus Statements",

   type: "Template pack",

   format: "DOCX",

   date: "10 Oct 2026",

   detailDate: "Verified 13 Oct 2026",

   status: "Verified",

   likes: 12,

 },

 {

   id: 6,

   title: "AI in the Classroom: Discussion Starters",

   type: "Activity pack",

   format: "PDF",

   date: "02 Oct 2026",

   detailDate: "Verified 06 Oct 2026",

   status: "Verified",

   likes: 8,

 },

];

const FILTERS = ["All", "Draft", "Posted", "Verified"];

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

   draft: <><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h4M8 12h7M8 16h4"/><path d="m13 19 5-5 2 2-5 5-3 1z"/></>,

 
   arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,

   close: <><path d="M18 6 6 18M6 6l12 12"/></>,

  verified: <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></>,

  thumbsUp: <><path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3z"/><path d="M7 10l5-8a3 3 0 0 1 2 4l-1 4h6a3 3 0 0 1 3 3l-1 6a3 3 0 0 1-3 2H7"/></>,

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

* onEdit(resource) -- open a draft in your contribution form

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

   Posted: contributions.filter((r) => r.status === "Posted").length,

   Verified: contributions.filter((r) => r.status === "Verified").length,

 
 }), [contributions]);

 const visibleContributions = filter === "All"

   ? contributions

   : contributions.filter((resource) => resource.status === filter);

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
  : "View Resource";

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

           { label: "All Contributions", number: counts.All, note: "Includes your saved drafts", icon: "files" },

           { label: "Verified", number: counts.Verified, note: "Verified contributions", icon: "check" },

           { label: "Posted", number: counts.Posted, note: "Published contributions", icon: "files" },

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

                   <td>
                    {resource.status !== "Verified" && (
                      <StatusBadge status={resource.status}/>
                    )}
                    {["Posted", "Verified"].includes(resource.status) && (
                      <div className="mc-resource-indicators">
                        {resource.status === "Verified" && (
                          <span className="mc-verified-indicator" title="Verified contribution">
                            <Icon name="verified" size={16}/> Verified
                          </span>
                        )}
                        <span className="mc-likes-indicator" title={`${resource.likes ?? 0} likes`}>
                          <Icon name="thumbsUp" size={15}/> {resource.likes ?? 0} likes
                        </span>
                      </div>
                    )}
                  </td>

                   <td className="mc-actions">

                     {resource.status === "Draft" && <button type="button" onClick={() => editResource(resource)}>Edit Draft</button>}

                     {resource.status === "Posted" && <button type="button" onClick={() => viewResource(resource)}>View Resource</button>}

                     {resource.status === "Verified" && <button type="button" onClick={() => viewResource(resource)}>View Resource</button>}

                   </td>

                 </tr>

               ))}

               {visibleContributions.length === 0 && <tr><td colSpan={4} className="mc-empty">No contributions in this category.</td></tr>}

             </tbody>

           </table>

         </div>

         <div className="mc-table-footer"><span>Showing {visibleContributions.length} of {contributions.length} contributions</span><span>Latest activity first</span></div>

       </section>

     </main>

     {selectedResource && (

       <div className="mc-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedResource(null); }}>

         <section className="mc-modal" role="dialog" aria-modal="true" aria-labelledby="mc-dialog-title">

           <button type="button" className="mc-modal-close" aria-label="Close" onClick={() => setSelectedResource(null)}><Icon name="close"/></button>

           <h2 id="mc-dialog-title">{modalAction}</h2>

           <h3>{selectedResource.title}</h3>

           <StatusBadge status={selectedResource.status}/>

           <p>{selectedResource.type} · {selectedResource.format}</p>

           <p className="mc-modal-note">This page currently uses sample resources. Connect the <code>onEdit</code> and <code>onView</code> props to your application to open the actual resource editor or details.</p>

           <button type="button" className="mc-btn mc-btn--primary" onClick={() => setSelectedResource(null)}>Close</button>

         </section>

       </div>

     )}

   </div>

 );

}

