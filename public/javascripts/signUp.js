
const emailField = document.getElementById('signUpEmail');
const nameField = document.getElementById('signUpId');
const passField = document.getElementById('signUpPw');
const signUpForm = document.getElementById('signUpForm');
const signUpBtn = document.getElementById('signUpBtn');
const signUpErrMsg = document.getElementById('signUpErrMsg');

const emailRegExp = /^\S+@\S+\.\S+$/;
const nameRegExp = /^[a-zA-Z0-9]{6,10}$/;
const passRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;

// keyup 이벤트 핸들러 함수
function handleKeyUp(event) {
  const target = event.target;
  
  if (target === emailField) {
    if (emailRegExp.test(target.value)) {
      target.style.boxShadow = '0 0 5px rgba(0, 255, 0, .8), inset 0 0 5px rgb(0, 255, 0, .5)';
    } else {
      target.style.boxShadow = '';
    }
  } else if (target === nameField) {
    if (nameRegExp.test(target.value)) {
      target.style.boxShadow = '0 0 5px rgba(0, 255, 0, .8), inset 0 0 5px rgb(0, 255, 0, .5)';
    } else {
      target.style.boxShadow = '';
    }
  } else if (target === passField) {
    if (passRegExp.test(target.value)) {
      target.style.boxShadow = '0 0 5px rgba(0, 255, 0, .8), inset 0 0 5px rgb(0, 255, 0, .5)';
    } else {
      target.style.boxShadow = '';
    }
  }
}

nameField.addEventListener('keyup', handleKeyUp);
emailField.addEventListener('keyup', handleKeyUp);
passField.addEventListener('keyup', handleKeyUp);

// 회원가입 버튼 클릭 시 이벤트 핸들러 함수
function validateForm() {
  let errorMsg = '';

  if (!emailField.value) {
    emailField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1px rgb(255, 0, 0, .5)';
    errorMsg += '- 이메일을 입력하세요.\n';
  } else if (!emailRegExp.test(emailField.value)) {
    emailField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1px rgb(255, 0, 0, .5)';
    errorMsg += '- 올바른 이메일 형식이 아닙니다.\n';
  }

  if (!nameField.value) {
    nameField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1px rgb(255, 0, 0, .5)';
    errorMsg += '- 아이디를 입력하세요.\n';
  } else if (!nameRegExp.test(nameField.value)) {
    nameField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1px rgb(255, 0, 0, .5)';
    errorMsg += '- 아이디는 영문, 숫자로만 구성되어야 하며, 6-10자여야 합니다.\n';
  }

  if (!passField.value) {
    passField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1px rgb(255, 0, 0, .5)';
    errorMsg += '- 비밀번호를 입력하세요.\n';
  } else if (!passRegExp.test(passField.value)) {
    passField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1px rgb(255, 0, 0, .5)';
    errorMsg += '- 비밀번호는 영문, 숫자, 특수문자가 모두 포함되어야 하며, 8-12자여야 합니다. 대소문자는 구분하지 않고, 공백은 허용되지 않습니다.\n';
  }

  if (errorMsg) {
    alert(`다음 항목을 확인해주세요.\n${errorMsg}`);
    setTimeout(() => {
      emailField.style.boxShadow = '';
      nameField.style.boxShadow = '';
      passField.style.boxShadow = '';
    }, 1500);
    return false;
  }

  return true;
}