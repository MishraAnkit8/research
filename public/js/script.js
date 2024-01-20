
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


  