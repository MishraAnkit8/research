function validateRequiredFormFields(actionBtn) {
  let validationState = true;
  let validateInputWrapper = actionBtn.closest(".validate-input");
  console.log("validateInputWrapper", validateInputWrapper);
  let elemToBeValidated = selectElemToBeValidated(validateInputWrapper);

  for (let elem of elemToBeValidated) {
    let isValidElem = true;
    const elemVal = elem.value.trim();

    console.log("elemVal ==>>", elemVal);
    const formGroup = elem.closest(".form-group");
    const isRequired = elem.required;
    const errorElem = formGroup.querySelector(".error-msg");
    const validateArr = elem.dataset.validate
      ? elem.dataset.validate.split(",")
      : [];
    let errorMsg = elem.dataset.errMsg
      ? elem.dataset.errMsg
      : "Please enter a valid value";
    const emptyErrorMsg = elem.dataset.errMsg
      ? elem.dataset.errMsg
      : "Please enter  value val";

    if (!isRequired && elemVal === "") {
      continue;
    }

    for (let validate of validateArr) {
      if (validate === "isExist") {
        const isValid = isExist(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isNumber") {
        const isValid = isNumber(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isDecimalNumber") {
        const isValid = isDecimalNumber(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      
      if (validate === "isValidMobileNumber") {
        const isValid = isValidMobileNumber(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isSpecialSymbol") {
        const isValid = isSpecialSymbol(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isAllNumeric") {
        const isValid = isAllNumeric(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isValidYear") {
        const isValid = isValidYear(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isValidMonth") {
        const isValid = isValidMonth(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isAlphabet") {
        const isValid = isAlphabet(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isAlphabeticWords") {
        const isValid = isAlphabeticWords(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isAlphaNumeric") {
        const isValid = isAlphaNumeric(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isNumericSpecialChar") {
        const isValid = NumericSpecialChar(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isEmail") {
        const isValid = isEmail(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      //isLength:min:max
      if (validate.includes("isLength")) {
        const lengthArr = validate.split(":");
        const min = lengthArr[1];
        const max = lengthArr[2];
        const isValid = isLength(elemVal, min, max);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      //between:min:max
      if (validate.includes("isBetween")) {
        const betweenArr = validate.split(":");
        const min = betweenArr[1];
        const max = betweenArr[2];
        const isValid = isBetween(elemVal, min, max);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate.includes("isFile")) {
        const arr = ["pdf", "xlsx", "xlsm", "xls","docx"]
        let ext = elemVal.substring(elemVal.lastIndexOf('.') + 1);
        let isValid = arr.includes(ext?.toLowerCase())

        if(!isValid) {
          isValidElem = false;
          validationState = false;
          errorMsg = `Invalid File Type only ${arr.join(", ")} are allowed`;
          break;
        }
      }

      if (validate === "isNotSpecialChar") {
        const isValid = isNotSpecialChar(elemVal);
        console.log("isValid ===>>>>>", isValid);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isNotNumber") {
        const isValid = isNotNumber(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isAlphaNumericSpecial") {
        const isValid = isAlphaNumericSpecial(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isAlphaNumericWithSpace") {
        const isValid = isAlphaNumericWithSpace(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      if (validate === "isValidHttpUrl") {
        const isValid = isValidHttpUrl(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }
      if (validate === "isSpace") {
        const isValid = isSpace(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }

      //isFloatingNumber
      if (validate === "isFloatingNumber") {
        const isValid = isFloatingNumber(elemVal);
        if (!isValid) {
          isValidElem = false;
          validationState = false;
          break;
        }
      }
    }

   
  

    toggleErrorState(formGroup, errorMsg, errorElem, isValidElem);
  }

  return validationState;
}

function selectElemToBeValidated(validateInputWrapper) {
  const allElements = validateInputWrapper.querySelectorAll(
    "input, select, textarea"
  );
  const elemToBeValidated = [];

  allElements.forEach(function (element) {
    const dataValidate = element.getAttribute("data-validate");
    const isDisabled = element.disabled;
    if (dataValidate !== null && dataValidate !== "" && !isDisabled) {
      elemToBeValidated.push(element);
    }
  });

  return elemToBeValidated;
}

function toggleErrorState(formGroup, errorMsg, errorElem, isValidElem) {
  console.log("formGroup =====>>>>>", formGroup);
  console.log("errorElem", errorElem, "isValid", isValidElem);

  if (!errorElem && !isValidElem) {
    console.log("Adding error message");
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-msg");
    errorDiv.innerText = errorMsg;
    formGroup.appendChild(errorDiv);
    formGroup.classList.add("error");
    // labelElement.classList.add('error-empty-msg');
    // inputElement.classList.add('error-border');

    // divElementEditor.classList.add('error-empty-msg');
  } else if (errorElem && isValidElem) {
    console.log("Removing error message");
    formGroup.removeChild(errorElem);
    // inputElement.classList.remove('error-border');
    // labelElement.classList.remove('error-empty-msg');
    // divElementEditor.classList.remove('error-empty-msg');
    formGroup.classList.remove("error");
  }
}

// function isNumber(input) {
//     // (!input || input === '' || input < 1)
//     if (!input || input === '') {
//         return false;
//     }

//     for (let i = 0; i < input.length; i++) {
//         const charCode = input.charCodeAt(i);
//         console.log('charCode ===>>>', charCode)
//         if (charCode < 48 || charCode > 57) {
//             return false;
//         }
//     }
//     return true;
// }

function isAllNumeric(input) {
  if (!input || input === "") {
    return false;
  }
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charAt(i);

    // Ensure it's a digit (between char code 48 to 57)
    if (charCode > 0 || charCode < 9) {
      count++;
    }
  }

  if (input.length === count) {
    console.log("Validated Wrongly");
    return false;
  } else {
    console.log("Validated ", count);
    return true;
  }
}

function isNumber(input) {
  if (!input || input === "") {
    return false;
  }

  // check if input contains only digits (0-9)
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);

    // Ensure it's a digit (between char code 48 to 57)
    if (charCode < 48 || charCode > 57) {
      return false;
    }
  }

  // check for negative sign or asterisk
  if (input.includes("-") || input.includes("*")) {
    return false;
  }

  // If the input starts with a plus sign, consider it invalid for a plain number
  if (input.startsWith("+")) {
    return false;
  }

  return true;
}

function isDecimalNumber(input) {
  if (!input || input === "") {
    return false;
  }

  if (input.includes("-") || input.includes("*")) {
    return false;
  }

  if (input.startsWith("+")) {
    return false;
  }

  let decimalPointCount = 0;
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);

    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }

    // Count the decimal points
    if (charCode === 46) {
      decimalPointCount++;
    }

    if (decimalPointCount > 1) {
      return false;
    }
  }

  return true;
}


function isSpecialSymbol(input) {
  if (!input || input === "") {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    
    if ((charCode >= 32 && charCode <= 47) ||
        (charCode >= 58 && charCode <= 64) || 
        (charCode >= 91 && charCode <= 96) ||
        (charCode >= 123 && charCode <= 126)) { 
      continue; 
    } else {
      return false;
    }
  }

  return true; 
}

function isAlphaNumericSpecial(input) {
  if (!input || input === "") {
    return false;
  }

  const firstChar = input.charCodeAt(0);
  if (
    // (firstChar >= 48 && firstChar <= 57) ||
      (firstChar >= 32 && firstChar <= 47) ||
      (firstChar >= 58 && firstChar <= 64) ||
      (firstChar >= 91 && firstChar <= 96) || 
      (firstChar >= 123 && firstChar <= 126)) {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if ((charCode >= 48 && charCode <= 57) ||
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 32 && charCode <= 47) ||
        (charCode >= 58 && charCode <= 64) ||
        (charCode >= 91 && charCode <= 96) ||
        (charCode >= 123 && charCode <= 126)) { 
      continue;
    } else {
      return false;
    }
  }

  return true;
}

function isNotNumber(input) {
  return !isNumber(input);
}

function isAlphaNumericWithSpace(input) {
  if (!input || input === "") {
    return false;
  }


  const firstChar = input.charCodeAt(0);
  if (!((firstChar >= 65 && firstChar <= 90) || // A-Z
        (firstChar >= 97 && firstChar <= 122))) { // a-z
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if ((charCode >= 48 && charCode <= 57) || 
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122) || 
        charCode === 32) { // space
      continue;
    } else {
      return false;
    }
  }

  return true;
}



function isSpace(input) {
  return input === ' ';
}

function isValidYear(year) {
  const numericYear = parseInt(year, 10);

  if (isNaN(numericYear)) {
    // Not a valid numeric year
    return false;
  }

  return numericYear >= 1900 && numericYear <= 3000;
}

function isValidMonth(month) {
  const numericMonth = parseInt(month, 10);

  if (isNaN(numericMonth)) {
    // Not a valid numeric month
    return false;
  }

  return numericMonth >= 0 && numericMonth <= 11;
}

function isFloatingNumber(input) {
  if (parseFloat(input) != input) {
    return false;
  }
  return true;
}

function isAlphabet(input) {
  if (!input || input.trim() === "") {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if (
      !(
        charCode === 32 ||
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122)
      )
    ) {
      return false;
    }
  }
  return true;
}

function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const atIndex = email.indexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) {
    return false;
  }

  if (email.indexOf('@', atIndex + 1) !== -1) {
    return false;
  }

  const lastDotIndex = email.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex <= atIndex + 1 || lastDotIndex === email.length - 1) {
    return false;
  }

  if (email.length - lastDotIndex - 1 < 2) {
    return false;
  }

  return true;
}


function isValidMobileNumber(mobileNumber) {
  if (typeof mobileNumber !== 'string') {
    return false;
  }

  if (mobileNumber.length !== 10) {
    return false;
  }

  const firstChar = mobileNumber.charAt(0);
  if (firstChar < '6' || firstChar > '9') {
    return false;
  }
  for (let i = 0; i < mobileNumber.length; i++) {
    const charCode = mobileNumber.charCodeAt(i);
    if (charCode < 48 || charCode > 57) {
      return false;
    }
  }

  return true;
}


function isValidHttpUrl(string) {
  try {
    const newUrl = new URL(string);

    if (newUrl.protocol === "http:" || newUrl.protocol === "https:") {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function isAlphabeticWords(input) {
  if (!input || input.trim() === "") {
    return false;
  }

  const words = input.split(" ");

  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const charCode = word.charCodeAt(i);
      if (
        (charCode < 65 || charCode > 90) &&
        (charCode < 97 || charCode > 122)
      ) {
        return false;
      }
    }
  }

  return true;
}

function isAlphaNumeric(input) {
  if (!input || input === "") {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if (
      (charCode < 48 || charCode > 57) && // Numeric characters
      (charCode < 65 || charCode > 90) && // Uppercase letters
      (charCode < 97 || charCode > 122) // Lowercase letters
    ) {
      return false;
    }
  }
  return true;
}

function isEmail(input) {
  if (!input || input === "") {
    return false;
  }

  // Check for a valid format
  if (input.indexOf("@") === -1) {
    return false;
  }

  const parts = input.split("@");
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
    return false;
  }

  // Check the domain part
  const domainParts = parts[1].split(".");
  if (domainParts.length < 2) {
    return false;
  }
  for (const part of domainParts) {
    if (part.length === 0) {
      return false;
    }
  }

  return true;
}

function isEmpty(input) {
  return input === undefined || input === null || input === "";
}

function isExist(input) {
  return !isEmpty(input);
}

function isNotSpecialChar(input) {
  if (!input || input === "") {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if (
      (charCode >= 48 && charCode <= 57) || // Numeric characters
      (charCode >= 65 && charCode <= 90) || // Uppercase letters
      (charCode >= 97 && charCode <= 122) || // Lowercase letters
      charCode === 32 // Space
    ) {
      return true;
    }
  }
  return false;
}

function isLength(input, minLength, maxLength) {
  if (isEmpty(input) || isEmpty(minLength) || isEmpty(maxLength)) {
    return false;
  }

  const length = input.trim().length;

  if (minLength == "min") {
    return length <= maxLength;
  }

  if (maxLength == "max") {
    return length >= minLength;
  }

  return length >= minLength && length <= maxLength;
}

function isBetween(input, min, max) {
  if (isEmpty(input) || isEmpty(min) || isEmpty(max)) {
    return false;
  }

  input = parseFloat(input);

  if (!isNumber(input)) {
    return false;
  }

  if (min === "min") {
    return input <= max;
  }

  if (max === "max") {
    return input >= min;
  }

  return input >= min && input <= max;
}

// for removing error class and error massage
function removeErrorMsg() {
  const modalContent = document.querySelectorAll(
    ".modal-content .form-group .error-msg"
  );

  modalContent.forEach(function (elem) {
    elem.classList.remove("error-msg");
    elem.removeAttribute("data-err-msg");
    elem.innerText = "";
  });
}

function NumericSpecialChar(input) {
  if (!input || input === "") {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    if (
      (charCode < 48 || charCode > 57) && // Numeric characters
      charCode === 37
    ) {
      return true;
    }
  }
  return false;
}
