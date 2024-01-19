function validateRequiredFormFields(actionBtn) {
    let validationState = true;
    let validateInputWrapper = actionBtn.closest('.validate-input');
    console.log('validateInputWrapper' , validateInputWrapper)
    let elemToBeValidated = selectElemToBeValidated(validateInputWrapper);

    for (let elem of elemToBeValidated) {
        let isValidElem = true;
        const elemVal = elem.value.trim();

        console.log('elemVal ==>>', elemVal);
        const formGroup = elem.closest('.form-group');
        const isRequired = elem.required;
        const errorElem = formGroup.querySelector('.error-msg');
        const validateArr = elem.dataset.validate ? elem.dataset.validate.split(',') : [];
        const errorMsg = elem.dataset.errMsg ? elem.dataset.errMsg : 'Please enter a valid value';
        const emptyErrorMsg = elem.dataset.errMsg ? elem.dataset.errMsg : 'Please enter  value val';


        if (!isRequired && elemVal === '') {
            continue;
        }

        for (let validate of validateArr) {
            if (validate === 'isExist') {
                const isValid = isExist(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            if (validate === 'isNumber') {
                const isValid = isNumber(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }
            

            if (validate === 'isAlphabet') {
                const isValid = isAlphabet(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            if (validate === 'isAlphabeticWords') {
                const isValid = isAlphabeticWords(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            if (validate === 'isAlphaNumeric') {
                const isValid = isAlphaNumeric(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            if (validate === 'isEmail') {
                const isValid = isEmail(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            //isLength:min:max
            if (validate.includes('isLength')) {
                const lengthArr = validate.split(':');
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
            if (validate.includes('isBetween')) {
                const betweenArr = validate.split(':');
                const min = betweenArr[1];
                const max = betweenArr[2];
                const isValid = between(elemVal, min, max);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            if (validate === 'isNotSpecialChar') {
                const isValid = isNotSpecialChar(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            if (validate === 'isNotNumber') {
                const isValid = isNotNumber(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

            //isFloatingNumber
            if (validate === 'isFloatingNumber') {
                const isValid = isFloatingNumber(elemVal);
                if (!isValid) {
                    isValidElem = false;
                    validationState = false;
                    break;
                }
            }

        };

        toggleErrorState(formGroup, errorMsg, errorElem, isValidElem);
    }

    return validationState;
}

function selectElemToBeValidated(validateInputWrapper) {
    const allElements = validateInputWrapper.querySelectorAll('input, select, textarea');
    const elemToBeValidated = [];

    allElements.forEach(function (element) {
        const dataValidate = element.getAttribute('data-validate');
        const isDisabled = element.disabled;
        if (dataValidate !== null && dataValidate !== '' && !isDisabled) {
            elemToBeValidated.push(element);
        }
    });

    return elemToBeValidated;
}

function toggleErrorState(formGroup, errorMsg, errorElem, isValidElem) {
    console.log('errorElem', errorElem, 'isValid', isValidElem);
    if (!errorElem && !isValidElem) {
        console.log('Adding error message');
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-msg');
        errorDiv.innerText = errorMsg;
        formGroup.appendChild(errorDiv);
        formGroup.classList.add('error');
    } else if (errorElem && isValidElem) {
        console.log('Removing error message');
        formGroup.removeChild(errorElem);
        formGroup.classList.remove('error');
    }
}



function isNumber(input) {
    if (!input || input === '' || input < 0) {
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

 function isNotNumber(input) {
    return !isNumber(input);
}

function isFloatingNumber(input) {
    if(parseFloat(input) != input) {
        return false;
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
    return input === undefined || input === null || input === '';
}

function isExist(input) {
    return !isEmpty(input);
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
    if (isEmpty(input) || isEmpty(minLength) || isEmpty(maxLength)) {
        return false;
    }

    const length = input.trim().length;

    if(minLength == 'min') {
        return length <= maxLength;
    }

    if(maxLength == 'max') {
        return length >= minLength;
    }

    return length >= minLength && length <= maxLength;
}

function isBetween(input, min, max) {
    if (isEmpty(input) || isEmpty(min) || isEmpty(max)) {
        return false;
    }

    input = parseFloat(input);

    if(!isNumber(input)) {
        return false;
    }

    if (min === 'min') {
        return input <= max;
    }

    if (max === 'max') {
        return input >= min;
    }

    return input >= min && input <= max;
}

// for removing error class and error massage
function removeErrorMsg() {
    const modalContent = document.querySelectorAll('.modal-content .form-group .error-msg');

    modalContent.forEach(function(elem) {
        elem.classList.remove('error-msg');
        elem.removeAttribute('data-err-msg');
        elem.innerText = '';
    });
}


