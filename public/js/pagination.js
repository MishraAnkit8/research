// pagination 
function initializePagination() {
    let entriesPerPage = 5;
    let currentPage = 1;
    let table = document.querySelector(".research-pagination");
    let rows = table.querySelectorAll("tbody tr");
    let totalEntries = rows.length;
    let totalPages = Math.ceil(totalEntries / entriesPerPage);
  
    showPage(currentPage);
  
    document.getElementById("changeEntry").addEventListener("change", handleEntriesChange);
    document.getElementById("pagination").addEventListener("click", handlePaginationClick);
    document.getElementById("nextBtn").addEventListener("click", handleNextClick);
    document.getElementById("prevBtn").addEventListener("click", handlePrevClick);
    document.getElementById("searchBtn").addEventListener("click", handleSearchClick);
    // eventlisner  for enter button press to search 
    document.getElementById("searchKeyword").addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
          handleSearchClick();
      }
  });
  
    function showPage(page) {
      currentPage = page;
      let startIdx = (page - 1) * entriesPerPage;
      let endIdx = startIdx + entriesPerPage;
  
      rows.forEach(function (row, index) {
        row.style.display =
          index >= startIdx && index < endIdx ? "table-row" : "none";
      });
  
      updatePagination(currentPage);
      updateNextPrevButtons(currentPage);
    }
  
    function handleEntriesChange() {
      entriesPerPage = parseInt(this.value);
      totalPages = Math.ceil(totalEntries / entriesPerPage);
      showPage(1);
    }
  
    function handlePaginationClick(e) {
      if (e.target.tagName === "A") {
        e.preventDefault();
        let clickedPage = parseInt(e.target.dataset.page);
  
        if (clickedPage !== currentPage) {
          showPage(clickedPage);
        }
      }
    }
  
    function handleNextClick() {
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
      }
    }
  
    function handlePrevClick() {
      if (currentPage > 1) {
        showPage(currentPage - 1);
      }
    }
  
    function handleSearchClick() {
      console.log("search button clickeddd");
      let searchKeyword = document
        .getElementById("searchKeyword")
        .value.toLowerCase();
      if (searchKeyword !== "") {
        console.log("searchKeyword ==>>", searchKeyword);
        filterRows(searchKeyword);
      }
    }
  
    function updatePagination(currentPage) {
      let pagination = document.getElementById("pagination");
      pagination.innerHTML = "";
  
      for (let i = 1; i <= totalPages; i++) {
        let pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.textContent = i;
        pageLink.dataset.page = i;
        if (i === currentPage) {
          pageLink.classList.add("active");
        }
        pagination.appendChild(pageLink);
      }
    }
  
    // function updateNextPrevButtons(currentPage) {
    //   document.getElementById("prevBtn").disabled = currentPage === 1;
    //   document.getElementById("nextBtn").disabled = currentPage === totalPages;
    //   document.getElementById("prevBtn").classList.remove("d-none"); // Show the buttons
    //   document.getElementById("nextBtn").classList.remove("d-none"); // Show the buttons
    // }
    // displaying next and prev button
    function updateNextPrevButtons(currentPage) {
      let prevBtn = document.getElementById("prevBtn");
      let nextBtn = document.getElementById("nextBtn");
      
      if (totalPages <= 1) { // If there is only one page or no pages, hide both buttons
        prevBtn.classList.add("d-none");
        nextBtn.classList.add("d-none");
      } else {
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        prevBtn.classList.remove("d-none"); // Show the buttons
        nextBtn.classList.remove("d-none"); // Show the buttons
      }
    }
    
  
    function filterRows(searchKeyword) {
      rows.forEach(function (row) {
        let rowText = row.textContent.toLowerCase();
        row.style.display =
          rowText.indexOf(searchKeyword) !== -1 ? "table-row" : "none";
      });
    }
  }
  
  //  this is function call that enables pagination  logic
  
  initializePagination();
  
  