

import { useState } from "react";
import ContributionResource from "./components/ContributionResource.jsx";
import MyContributions from "./components/MyContributions.jsx";


function App() {
 const [currentPage, setCurrentPage] = useState("Contribute a Resource");


 const navigate = (page) => {
   setCurrentPage(page);
 };


 return (
   <>
     {currentPage === "Contribute a Resource" && (
       <ContributionResource onNavigate={navigate} />
     )}


     {currentPage === "My Contributions" && (
       <MyContributions onNavigate={navigate} />
     )}
   </>
 );
}


export default App;



