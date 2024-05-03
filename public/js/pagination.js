let searchInput = document.getElementById("searchKeyword");
let currentPage = 1;
// const tableDataList = document.getElementById('journal-paper-list').getElementsByTagName('tr');

let entriesPerPage = 5;
console.log('currentPage ===>>>>>', currentPage)
let table = document.querySelector(".research-pagination");
let rows = table.querySelectorAll("tbody tr");
let rowCountPagination = document.getElementById('row-count');
let totalRowCountNumber = document.getElementById('total-row-count');
let totaEntry = parseInt(rowCountPagination.innerText, 10);
let totalEntries = totaEntry;
let totalPages = Math.ceil(totalEntries / entriesPerPage);


// Attach event listeners
document.getElementById("changeEntry").addEventListener("change", handleEntriesChange);
document.getElementById("pagination").addEventListener("click", handlePaginationClick);
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

  function handleSearchInput() {
    let searchKeyword = this.value.trim().toLowerCase();
    filterRows(searchKeyword);
  }

  function handleSearchClick() {
    let searchKeyword = document.getElementById("searchKeyword").value.trim().toLowerCase();
    filterRows(searchKeyword);
  }

// for filtering the rows
  // function filterRows(searchKeyword) {
  //   console.log('searchKeyword ====>>>>>>>', searchKeyword);
  //   let matchedRowCount = 0;
  //   let noRecordsMessage = document.getElementById('no-records-message');
  //   let dataList = document.querySelector('.data-list');
  
  //   let rows = dataList.querySelectorAll("tbody tr");
  //   console.log('rows ===>>>>>>', rows)
  
  //   rows.forEach(function (row) {
  //     console.log('row ===>>>>>>', rows);
  //     let hasMatch = false;
  //     let cellContents = row.querySelectorAll("td");
  //   console.log('cellContents ===>>>>>>>', cellContents);
  //     cellContents.forEach(function (cell) {
  //       let cellText = cell.textContent.toLowerCase();
  //       console.log('cellText ===>>>>>>', cellText);
  
  //       if (cellText.includes(searchKeyword)) {
  //         let newText = cellText.replace(new RegExp(searchKeyword, "gi"), match => `${match}`);
  //         console.log('newText ====>>>>>>', newText);
  //         cell.textContent  = newText;
  //         hasMatch = true;
  //       } else {
  //         cell.textContent  = cellText; 
  //       }
  //     });
  
  //     if (hasMatch) {
  //       row.style.display = "table-row";
  //       matchedRowCount++;
  //     } else {
  //       row.style.display = "none"; 
  //     }
  //   });
  
  //   // Show/hide no records message based on matched row count
  //   if (matchedRowCount === 0) {
  //     noRecordsMessage.style.display = "block";
  //     dataList.style.display = "none";
  //   } else {
  //     noRecordsMessage.style.display = "none";
  //     dataList.style.display = "block";
  //   }
  
  //   // total row count and pagination based on matched rows
  //   totalRowCountNumber.innerText = matchedRowCount;
  //   totalEntries = matchedRowCount;
  //   totalPages = Math.ceil(totalEntries / entriesPerPage);
  //   showPage(1);
  // }

//update the pagination
  function updatePagination(currentPage) {
    let pagination = document.getElementById("pagination");
    pagination.textContent  = "";

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

  function updateNextPrevButtons(currentPage) {
    let prevBtn = document.getElementById("prevBtn");
    let nextBtn = document.getElementById("nextBtn");


    if (totalPages <= 1) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    } else {
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      // prevBtn.classList.remove("d-none");
      // nextBtn.classList.remove("d-none");
    }
    

    console.log('curent page ',currentPage)
      prevBtn.classList.remove("d-none");
      nextBtn.classList.remove("d-none");
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
      
  

  }



//event listner for search bar
searchInput.addEventListener('keyup', function() {
  const searchTerm = searchInput.value.toLowerCase();

  const tableRows = document.querySelectorAll('.data-list tr');
  console.log('tableRows ===>>>>>', tableRows)

tableRows.forEach(row => {
    const tableData = row.textContent.toLowerCase();
  console.log("row:::::::::::::::::",row)
    if (tableData.includes(searchTerm)) {
        console.log('searchTerm ====>>>>', searchTerm)
        row.style.display = 'table-row';

    } 
    else{
      row.style.display = 'none';
    }
    if (searchTerm === '') {
      showPage(1);
    }
});
});

showPage(currentPage);


// initializePagination();

let originalContentMap = new Map();

function filterRows(searchKeyword) {
    rows.forEach(function (row) {
        let hasMatch = false;
        let cellContents = row.querySelectorAll("td");

        cellContents.forEach(function (cell) {
            let cellText = cell.textContent.toLowerCase();
            originalContentMap.set(cell, cellText); // Store original content

            if (cellText.includes(searchKeyword)) {
                let newText = cellText.replace(new RegExp(searchKeyword, "gi"), match => `${match}`);
                cell.textContent = newText;
                hasMatch = true;
            } else {
                cell.textContent = cellText;
            }
        });

        if (hasMatch) {
            row.style.display = "table-row";
            matchedRowCount++;
        } else {
            row.style.display = "none";
        }
    });
}

// Function to revert back to original cell content
function revertToOriginalContent() {
    originalContentMap.forEach(function (originalText, cell) {
        cell.textContent = originalText;
    });
}
