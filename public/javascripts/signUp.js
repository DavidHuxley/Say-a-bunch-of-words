const emailField = document.getElementById('signUpEmail');
const nameField = document.getElementById('signUpId');
const passField = document.getElementById('signUpPw');
const signUpForm = document.getElementById('signUpForm');
const signUpBtn = document.getElementById('signUpBtn');
const signUpErrMsg = document.getElementById('signUpErrMsg');

function validateForm() {
  const emailRegExp = /^\S+@\S+\.\S+$/;
  const nameRegExp = /^[a-zA-Z0-9]{6,10}$/;
  const passRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;

  if (nameField.value === "" || emailField.value === "" || passField.value === "") {
    alert("빈 항목 없이 입력해주세요.");
    return false; // 제출 방지
  }

  if (!emailRegExp.test(emailField.value)) {
    // alert('올바른 이메일 형식이 아닙니다.');
    emailField.style.boxShadow = '0 0 3px 2px rgba(255, 0, 0, .8), inset 0 0 1px 1PX rgb(255, 0, 0, .5)';
    setTimeout(() => {
      emailField.style.boxShadow = '';
    }, 1000);
    return false; // 이메일 유효성 검사
  }

  if (!nameRegExp.test(nameField.value)) {
    alert('아이디는 영문 대소문자와 숫자로 6자 이상 10자 이하여야 합니다.');
    return false; // 아이디 유효성 검사
  }

  if (!passRegExp.test(passField.value)) {
    alert('비밀번호는 영문, 숫자, 특수문자가 모두 포함되어야 하며, 8-12자여야 합니다. 대소문자는 구분하지 않고, 공백은 허용되지 않습니다.');
    return false; // 비밀번호 유효성 검사
  }

  else {
    return true; // 제출}
  }
}