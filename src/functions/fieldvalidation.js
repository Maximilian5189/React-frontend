export const getFieldErrors = (field, userInput = null) => {
  if (userInput) {
    field.fieldValue = userInput;
  }
  const fieldErrors = {};
  
  if (field.minLength) {
    if (field.fieldValue.length < field.minLength.value) {
      fieldErrors.minLength = field.minLength.message
    } else {
      fieldErrors.minLength = ''
    }
  }

  if (field.maxLength) {
    if (field.fieldValue.length > field.maxLength.value) {
      fieldErrors.maxLength = field.maxLength.message
    } else {
      fieldErrors.maxLength = ''
    }
  }

  if (field.pattern) {
    const regex = RegExp(field.pattern.value);
    const regexResult = regex.test(field.fieldValue);
    if (regexResult === false) {
      fieldErrors.pattern = field.pattern.message
    } else {
      fieldErrors.pattern = ''
    }
  }

    return fieldErrors
}