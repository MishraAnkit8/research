
function validateRequiredFormFields(actionBtn) {
  let isValid = true;
  let requiredWrapper = actionBtn.closest('.validate-input');
  console.log('requiredWrapper ==>>', requiredWrapper);
  let formGroupElems = requiredWrapper.querySelectorAll('input[required], select[required], textarea[required]');

  console.log('formGroupElems ==>>', formGroupElems);

  formGroupElems.forEach(function (elem) {
      const elemVal = elem.value;
      console.log('elemVal ==>>', elemVal);

      const formGroup = elem.closest('.form-group');
      const hasError = formGroup.querySelector('.error-msg');
      const hasErrorClass = formGroup.classList.contains('error');

      // Check if data-validate attribute is present
      const validateAttr = elem.getAttribute('data-validate');
      const validateArr = validateAttr ? validateAttr.split(',') : [];

      console.log('validateArr >>> ', validateArr);

      validateArr.forEach(validate => {
        if (validate === 'email') {
            if (!validateEmail(elemVal)) {
                isValid = false;

                if (!hasError && !hasErrorClass) {
                    formGroup.append(`<span class="error-msg">Please enter a valid email address</span>`);
                    formGroup.addClass('error');
                }
            } else if (validateEmail(elemVal) && (hasError || hasErrorClass)) {
                formGroup.find('.error-msg').remove();
                formGroup.removeClass('error');
            }
        } else if (validate === 'phone') {
            if (!validatePhone(elemVal)) {
                isValid = false;

                if (!hasError && !hasErrorClass) {
                    formGroup.append(`<span class="error-msg">Please enter a valid phone number</span>`);
                    formGroup.addClass('error');
                }
            } else if (validatePhone(elemVal) && (hasError || hasErrorClass)) {
                formGroup.find('.error-msg').remove();
                formGroup.removeClass('error');
            }
        } else if (validate === 'password') {
            if (!validatePassword(elemVal)) {
                isValid = false;

                if (!hasError && !hasErrorClass) {
                    formGroup.append(`<span class="error-msg">Please enter a valid password</span>`);
                    formGroup.addClass('error');
                }
            } else if (validatePassword(elemVal) && (hasError || hasErrorClass)) {
                formGroup.find('.error-msg').remove();
                formGroup.removeClass('error');
            }
        } else if (validate === 'confirm-password') {
            const passwordElem = $elem.closest('.validate-input').find('input[data-validate="password"]');
            const passwordElemVal = passwordElem.val();

            if (!validateConfirmPassword(elemVal, passwordElemVal)) {
                isValid = false;

                if (!hasError && !hasErrorClass) {
                    formGroup.append(`<span class="error-msg">Confirm password does not match</span>`);
                    formGroup.addClass('error');
                }
            } else if (validateConfirmPassword(elemVal, passwordElemVal) && (hasError || hasErrorClass)) {
                formGroup.find('.error-msg').remove();
                formGroup.removeClass('error');
            }
        } else if (validate === 'number') {
            if (!validateNumber(elemVal)) {
                isValid = false;

                if (!hasError && !hasErrorClass) {
                    formGroup.append(`<span class="error-msg">Please enter a valid number</span>`);
                    formGroup.addClass('error');
                }
            }
        }
    });

      if (isEmpty(elemVal)) {
          isValid = false;

          if (!hasError && !hasErrorClass) {
              formGroup.insertAdjacentHTML('beforeend', `<span class="error-msg">This field is required</span>`);
              formGroup.classList.add('error');
          }
      } else if (!isEmpty(elemVal) && (hasError || hasErrorClass)) {
          formGroup.querySelector('.error-msg').remove();
          formGroup.classList.remove('error');
      }
  });

  return isValid;
}

function isNumber(input) {
  if (!input || input === '') {
      return false;
  }

  for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      if (charCode < 48 || charCode > 57) {
          return false;
      }
  }
  return true;
}

function isAlphabet(input) {
  if (!input || input.trim() === '') {
      return false;
  }

  for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      if (
          !(charCode === 32 || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))
      ) {
          return false;
      }
  }
  return true;
}

function isAlphabeticWords(input) {
  if (!input || input.trim() === '') {
      return false;
  }

  const words = input.split(' ');

  for (const word of words) {
      for (let i = 0; i < word.length; i++) {
          const charCode = word.charCodeAt(i);
          if ((charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
              return false;
          }
      }
  }

  return true;
}

function isAlphaNumeric(input) {
  if (!input || input === '') {
      return false;
  }

  for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      if (
          (charCode < 48 || charCode > 57) && // Numeric characters
          (charCode < 65 || charCode > 90) && // Uppercase letters
          (charCode < 97 || charCode > 122)   // Lowercase letters
      ) {
          return false;
      }
  }
  return true;
}
function isString(input) {
  if(!input || input === ''){
    return false
  }
  console.log('input ==>>', input);
  console.log('input length ==>>', input.length);
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (isNaN(parseInt(char, 10))) {
        return true; // Non-numeric character found
    }
}
  return false;
}
function isEmail(input) {
  if (!input || input === '') {
      return false;
  }

  // Check for a valid format
  if (input.indexOf('@') === -1) {
      return false;
  }

  const parts = input.split('@');
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
      return false;
  }

  // Check the domain part
  const domainParts = parts[1].split('.');
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
  console.log('isEmpty there is no data ==>>',isEmpty)
  return input === undefined || input === null || input === '';
}

function isNotExist(input) {
  return input === undefined || input === null || input === '';
}

function isNotSpecialChar(input) {
  if (!input || input === '') {
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
  const length = input.trim().length;
  return length >= minLength && length <= maxLength;
}
