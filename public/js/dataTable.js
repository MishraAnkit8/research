function addDataTable(tablename) {
  $(tablename).DataTable({
    pageLength: 5,
    lengthMenu: [
      [5, 10, 25, 50, -1],
      [5, 10, 25, 50, "All"],
    ],
  });
}
