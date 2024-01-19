
// This is navbar toggle arrow <<
const closeToggleBtn = document.getElementById("closeToggleBtn");
const leftSideBar = document.getElementById("leftSideBar");
const mainContent = document.getElementById("mainContent");
const navbarHeading = document.getElementById("navbarHeading");
var hamburger = document.getElementById("hamburger");

// Function to close the sidebar
function closeSidebar() {
leftSideBar.classList.remove("left-sidebar-open");

}

closeToggleBtn.addEventListener("click", () => {
leftSideBar.classList.toggle("left-400");
mainContent.classList.toggle("left-0");
navbarHeading.classList.toggle("left-0");
closeToggleBtn.classList.toggle("left-sidebar-toggle-turn");
});

// Show userProfile drop-down
const defaultDropdown = document.getElementById("defaultDropdown");
defaultDropdown.addEventListener("click", (event) => {
const showDropDown = document.getElementById("showDropDown");
showDropDown.classList.toggle("show");
event.stopPropagation();

});

document.addEventListener('click', (event) => {
if(!showDropDown.contains(event.target) && !defaultDropdown.contains(event.target) && !hamburger.contains(event.target)){
showDropDown.classList.remove('show')
}

})

// Show side-bar when click on hamburger
hamburger.addEventListener("click", (event) => {
leftSideBar.classList.toggle("left-sidebar-open");
event.stopPropagation();
});

// Close sidebar when clicking anywhere outside of it
document.addEventListener("click", (event) => {
if (!leftSideBar.contains(event.target) && !hamburger.contains(event.target)) {
    leftSideBar.classList.remove("left-sidebar-open");
}
});




//fuction to hide left_side
function hideLeftSidebar() {
    document.querySelector('.left-sidebar').classList.add('d-none');
}

// for convert date string inti desire date formate

function formatDateToYYYYMMDD(inputDateString) {
    const dateObject = new Date(inputDateString);
  
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }



// pagination 
// function initializePagination() {
//     let entriesPerPage = 5;
//     let currentPage = 1;
//     let table = document.querySelector(".table-pagination");
//     let rows = table.querySelectorAll("tbody tr");
//     let totalEntries = rows.length;
//     let totalPages = Math.ceil(totalEntries / entriesPerPage);
  
//     showPage(currentPage);
  
//     document.getElementById("changeEntry").addEventListener("change", handleEntriesChange);
//     document.getElementById("pagination").addEventListener("click", handlePaginationClick);
//     document.getElementById("nextBtn").addEventListener("click", handleNextClick);
//     document.getElementById("prevBtn").addEventListener("click", handlePrevClick);
//     document.getElementById("searchBtn").addEventListener("click", handleSearchClick);
  
//     function showPage(page) {
//       currentPage = page;
//       let startIdx = (page - 1) * entriesPerPage;
//       let endIdx = startIdx + entriesPerPage;
  
//       rows.forEach(function (row, index) {
//         row.style.display =
//           index >= startIdx && index < endIdx ? "table-row" : "none";
//       });
  
//       updatePagination(currentPage);
//       updateNextPrevButtons(currentPage);
//     }
  
//     function handleEntriesChange() {
//       entriesPerPage = parseInt(this.value);
//       totalPages = Math.ceil(totalEntries / entriesPerPage);
//       showPage(1);
//     }
  
//     function handlePaginationClick(e) {
//       if (e.target.tagName === "A") {
//         e.preventDefault();
//         let clickedPage = parseInt(e.target.dataset.page);
  
//         if (clickedPage !== currentPage) {
//           showPage(clickedPage);
//         }
//       }
//     }
  
//     function handleNextClick() {
//       if (currentPage < totalPages) {
//         showPage(currentPage + 1);
//       }
//     }
  
//     function handlePrevClick() {
//       if (currentPage > 1) {
//         showPage(currentPage - 1);
//       }
//     }
  
//     function handleSearchClick() {
//       console.log("search button clickeddd");
//       let searchKeyword = document
//         .getElementById("searchKeyword")
//         .value.toLowerCase();
//       if (searchKeyword !== "") {
//         console.log("searchKeyword ==>>", searchKeyword);
//         filterRows(searchKeyword);
//       }
//     }
  
//     function updatePagination(currentPage) {
//       let pagination = document.getElementById("pagination");
//       pagination.innerHTML = "";
  
//       for (let i = 1; i <= totalPages; i++) {
//         let pageLink = document.createElement("a");
//         pageLink.href = "#";
//         pageLink.textContent = i;
//         pageLink.dataset.page = i;
//         if (i === currentPage) {
//           pageLink.classList.add("active");
//         }
//         pagination.appendChild(pageLink);
//       }
//     }
  
//     function updateNextPrevButtons(currentPage) {
//       document.getElementById("prevBtn").disabled = currentPage === 1;
//       document.getElementById("nextBtn").disabled = currentPage === totalPages;
//       document.getElementById("prevBtn").classList.remove("d-none"); // Show the buttons
//       document.getElementById("nextBtn").classList.remove("d-none"); // Show the buttons
//     }
  
//     function filterRows(searchKeyword) {
//       rows.forEach(function (row) {
//         let rowText = row.textContent.toLowerCase();
//         row.style.display =
//           rowText.indexOf(searchKeyword) !== -1 ? "table-row" : "none";
//       });
//     }
//   }
  
//   //  this is function call that enables pagination  logic

//   initializePagination();
  
  