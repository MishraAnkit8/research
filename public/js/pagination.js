function initializePagination() {
  let entriesPerPage = 5;
  let currentPage = 1;
  let table = document.querySelector(".research-pagination");
  let rows = table.querySelectorAll("tbody tr");
  let rowCount = document.getElementById('row-count');
  let totalRowCount = document.getElementById('total-row-count');
  let indexValue = parseInt(rowCount.innerText, 10);
  let totalEntries = indexValue;
  let totalPages = Math.ceil(totalEntries / entriesPerPage);

  showPage(currentPage);

  // Attach event listeners
  document.getElementById("changeEntry").addEventListener("change", handleEntriesChange);
  document.getElementById("nextBtn").addEventListener("click", handleNextClick);
  document.getElementById("prevBtn").addEventListener("click", handlePrevClick);
  document.getElementById("searchBtn").addEventListener("click", handleSearchClick);
  document.getElementById("searchKeyword").addEventListener("input", handleSearchInput);

  function showPage(page) {
    currentPage = page;
    let startIdx = (page - 1) * entriesPerPage;
    let endIdx = startIdx + entriesPerPage;

    rows.forEach(function (row, index) {
      if (index >= startIdx && index < endIdx) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });

    updatePagination(currentPage);
    updateNextPrevButtons(currentPage);
  }

  function handleEntriesChange() {
    entriesPerPage = parseInt(this.value);
    totalPages = Math.ceil(totalEntries / entriesPerPage);
    showPage(1);
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

  function handleSearchInput() {
    let searchKeyword = this.value.trim().toLowerCase();
    filterRows(searchKeyword);
  }

  function handleSearchClick() {
    let searchKeyword = document.getElementById("searchKeyword").value.trim().toLowerCase();
    filterRows(searchKeyword);
  }

  function filterRows(searchKeyword) {
    console.log('searchKeyword ====>>>>>>>', searchKeyword);
    let matchedRowCount = 0;
    let noRecordsMessage = document.getElementById('no-records-message');
    let journalList = document.getElementById('journal-paper-list');
  
    let rows = journalList.querySelectorAll("tbody tr");
    console.log('rows ===>>>>>>', rows)
  
    rows.forEach(function (row) {
      console.log('row ===>>>>>>', rows);
      let hasMatch = false;
      let cellContents = row.querySelectorAll("td");
    console.log('cellContents ===>>>>>>>', cellContents);
      cellContents.forEach(function (cell) {
        let cellText = cell.textContent.toLowerCase();
        console.log('cellText ===>>>>>>', cellText);
  
        if (cellText.includes(searchKeyword)) {
          let newText = cellText.replace(new RegExp(searchKeyword, "gi"), match => `<mark style="color: red;">${match}</mark>`);
          console.log('newText ====>>>>>>', newText);
          cell.innerHTML = newText;
          hasMatch = true;
        } else {
          cell.innerHTML = cellText; 
        }
      });
  
      if (hasMatch) {
        row.style.display = "table-row";
        matchedRowCount++;
      } else {
        row.style.display = "none"; 
      }
    });
  
    // Show/hide no records message based on matched row count
    if (matchedRowCount === 0) {
      noRecordsMessage.style.display = "block";
      journalList.style.display = "none";
    } else {
      noRecordsMessage.style.display = "none";
      journalList.style.display = "block";
    }
  
    // total row count and pagination based on matched rows
    totalRowCount.innerText = matchedRowCount;
    totalEntries = matchedRowCount;
    totalPages = Math.ceil(totalEntries / entriesPerPage);
    showPage(1);
  }
  
  
  
  

  function updatePagination(currentPage) {
    let pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      let pageLink = document.createElement("a");
      pageLink.href = "#";
      // console.log('i =====>>>>>', i)
      pageLink.textContent = i;
      pageLink.dataset.page = i;
      if (i === currentPage) {
        pageLink.classList.add("active");
      }
      pagination.appendChild(pageLink);
    }
  }

  function updateNextPrevButtons(currentPage) {
    let prevBtn = document.getElementById("prevBtn");
    let nextBtn = document.getElementById("nextBtn");

    if (totalPages <= 1) {
      prevBtn.classList.add("d-none");
      nextBtn.classList.add("d-none");
    } else {
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      prevBtn.classList.remove("d-none");
      nextBtn.classList.remove("d-none");
    }
    
  }
}



initializePagination();
