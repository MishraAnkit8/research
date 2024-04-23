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
    let matchedRowCount = 0;
    let noRecordsMessage = document.getElementById('no-records-message');
  
    rows.forEach(function (row) {
      let rowText = row.textContent.toLowerCase();
      let cellContents = row.querySelectorAll("td");
  
      if (searchKeyword === "") {
        // If searchKeyword is empty, reset cell contents and show all rows
        row.style.display = "table-row";
        cellContents.forEach(function (cell) {
          cell.innerHTML = cell.textContent;
        });
        matchedRowCount++;
      } else {
        let hasMatch = false;
        cellContents.forEach(function (cell) {
          let cellText = cell.textContent.toLowerCase();
  
          if (cellText.includes(searchKeyword)) {
            // Highlight the matched text
            let newText = cellText.replace(new RegExp(searchKeyword, "gi"), match => `<mark>${match}</mark>`);
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
      }
    });
    console.log('matchedRowCount ===>>>>>>>', matchedRowCount);
    const jornalList = document.getElementById('journal-paper-list');
    console.log('jornalList ===>>>>>>', jornalList);
    if (matchedRowCount === 0) {
      // Display "No records found" message
      noRecordsMessage.style.display = "block";
      jornalList.style.display = "none";
      
    } else {
      // Hide "No records found" message
      noRecordsMessage.style.display = "none";
      jornalList.style.display = "block";
    }
  
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
