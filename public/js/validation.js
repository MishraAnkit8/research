function checkmail() {
    var as = document.getElementById("input1").value;
  
    let count = 0;
    let c2 = 0;
    for (i = 0; i < as.length; i++) {
      var findex = as.indexOf(as[0]);
      let x = as.charAt(i);
      if ("@" == x) {
        count++;
      }
      if ("." == x) {
        c2++;
      }
    }
    console.log(count);
    if ((count != 0) & (c2 != 0)) {
      if ((count <= 1) & (c2 <= 1)) {
        console.log("Both @ and . are one ");
        let ind = as.indexOf("@");
        let dot = as.indexOf(".");
        if (ind < dot) {
          console.log("Indexes are ", ind, dot);
  
          if (ind + 1 != dot) {
            console.log("String is  present between @ and .");
          } else {
            console.log("String is not present between @ and .");
          }
  
          if (ind != 0) {
            console.log("String is  present at start");
          } else {
            console.log("String is not present at start");
          }
  
          if (as.length - 1 == dot) {
            console.log("String is not present after dot");
          } else {
            console.log("String is present dot");
          }
        } else {
          console.log(". is present before @");
        }
      } else {
        console.log("@ invlaid or . invalid");
      }
    } else {
      console.log("one of the dot or @ is absent");
    }
  }
  
  function checkphone() {
    let a = document.getElementById("phone").value;
    if (a.length == 10) {
      for (i = 0; i < a.length; i++) {
        let b = a.charAt(i);
        if (b >= 0 && b <= 9) {
          console.log("valid");
        } else {
          console.log("invalid");
        }
      }
    } else {
      console.log("invalid");
    }
  }
  
  function checkpan() {
    var a = document.getElementById("pan").value;
  
    if (a.length == 10) {
      let uppers = a.substring(0, 5);
      console.log("Check alphabets ", isuppercase(uppers));
  
      let lastcheck = a.substring(a.length - 1, a.length);
      console.log("Check last alphabets ", isuppercase(lastcheck));
  
      let digit = a.substring(5, a.length - 1);
      console.log("Digits", checkdigits(digit));
    } else {
      console.log("invalid");
    }
  }
  function isuppercase(uppers) {
    let bool = false;
    let up = uppers.split("");
    let check = 0;
    let count = 0;
    for (i = 65; i <= 90; i++) {
      let text = String.fromCharCode(i);
      for (j = 0; j < uppers.length; j++) {
        if (text == up[j]) {
          count++;
        }
      }
    }
    if (count == uppers.length) {
      bool = true;
    }
  
    return bool;
  }
  function isuppercases(uppers) {
    let bool = "false";
  
    for (i = 0; i < uppers.length; i++) {
      let x = uppers.charAt(i);
      let m = uppers.charCodeAt(x);
      if (m >= 65 && m <= 90) {
        bool = "true";
      }
    }
    return bool;
  }
  function checkdigits(digit) {
    let bool = false;
    let count = 0;
    for (i = 0; i < digit.length; i++) {
      let chars = digit.charAt(i);
      if (chars >= 0 && chars <= 9) {
        count++;
      }
    }
    if (digit.length == count) {
      bool = true;
    }
    return bool;
  }
  
  function checkadhar() {
    let a = document.getElementById("adhar").value;
    if (a.length == 12) {
      console.log(checkdigits(a));
    } else {
      console.log("invalid");
    }
  }
  
  function specialchar(vals) {
    let bool = "true";
    let count = 0;
    for (i = 0; i < vals.length; i++) {
      let v = vals.charCodeAt(i);
      console.log(v);
      if (
        (v >= 33 && v <= 47) ||
        (v >= 58 && v <= 64) ||
        (v >= 91 && v <= 96) ||
        (v >= 123 && v <= 126)
      ) {
        count++;
      }
    }
    if (count > 0) {
      bool = "false";
    }
  
    return bool;
  }
  function fnamecheck() {
    var a = document.getElementById("fname").value;
    let bool = specialchar(a);
    if (bool == "false") {
      document.getElementById("fnamerror2").innerText = "'Invalid FirstName'";
    } else {
      document.getElementById("fnamerror2").innerText = " ";
    }
    console.log(bool);
  }
  function lnamecheck() {
    var a = document.getElementById("input2").value;
    let bool = specialchar(a);
    if (bool == "false") {
      document.getElementById("fnamerror3").innerText = "'Invalid LastName'";
    } else {
      document.getElementById("fnamerror3").innerText = " ";
    }
    console.log(specialchar(a));
  }
  

  