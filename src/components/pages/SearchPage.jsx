// import { useState, useEffect } from 'react';
// import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
// import { Document, Page } from 'react-pdf';
// import { app } from "../../firebase";
// import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

// const SearchPage = () => {
//   const [keyword, setKeyword] = useState('');
//   const [pdfUrls, setPdfUrls] = useState([]);

//   useEffect(() => {
//     fetchPdfUrls(app);
//   }, []);

//   const fetchPdfUrls = async () => {
//     // Retrieve PDF files from Firebase Storage
//     const storage = getStorage(app);
//     const storageRef = ref(storage);
//     const allFiles = await listAll(storageRef);

//     // Retrieve download URLs of all PDF files
//     const urls = await Promise.all(
//       allFiles.items.map(async (file) => {
//         const downloadURL = await getDownloadURL(ref(storage, file.fullPath));
//         return downloadURL;
//       })
//     );

//     console.log("urls");

//     setPdfUrls(urls);
//   };

//   const handleSearch = () => {
//     // Perform search based on the keyword
//     // You can implement your search logic here
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         placeholder="Enter keyword"
//       />
//       <button onClick={handleSearch}>Search</button>

//       {pdfUrls.length > 0 && (
//         <div>
//           {pdfUrls.map((url, index) => (
//             <div key={index}>
//               <Document file={url}>
//                 <Page pageNumber={1} />
//               </Document>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchPage;
