
// signUpkeyUp 함수를 위한 변수
const emailField = $('#signUpEmail');
const nameField = $('#signUpId');
const passField = $('#signUpPw');

// 정규표현식
const emailRegExp = /^\S+@\S+\.\S+$/;
const nameRegExp = /^[a-zA-Z0-9]{6,10}$/;
const passRegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;

// signUp keyup 이벤트 핸들러 함수
function signUpKeyUp(event) {
  const target = event.target;

  if (target === emailField.get(0)) {
    if (emailRegExp.test(target.value)) {
      target.style.boxShadow = '0 0 5px rgba(0, 255, 0, .8), inset 0 0 5px rgb(0, 255, 0, .5)';
    } else {
      target.style.boxShadow = '';
    }
  } else if (target === nameField.get(0)) {
    if (nameRegExp.test(target.value)) {
      target.style.boxShadow = '0 0 5px rgba(0, 255, 0, .8), inset 0 0 5px rgb(0, 255, 0, .5)';
    } else {
      target.style.boxShadow = '';
    }
  } else if (target === passField.get(0)) {
    if (passRegExp.test(target.value)) {
      target.style.boxShadow = '0 0 5px rgba(0, 255, 0, .8), inset 0 0 5px rgb(0, 255, 0, .5)';
    } else {
      target.style.boxShadow = '';
    }
  }
}

// signUp keyup 이벤트 핸들러 등록
nameField.on('keyup', signUpKeyUp);
emailField.on('keyup', signUpKeyUp);
passField.on('keyup', signUpKeyUp);


// 회원가입 버튼
const signUpBtn = document.getElementById("signUpBtn");

// 회원가입 버튼 클릭 시 이벤트 핸들러 함수
signUpBtn.addEventListener("click", function () {

  // 회원가입 폼 유효성 검사
  let errorMsg = '';

  if (!emailField.val()) {
    emailField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '이메일을 입력하세요.<br>';
  } else if (!emailRegExp.test(emailField.val())) {
    emailField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '올바른 이메일 형식이 아닙니다.<br>';
  }

  if (!nameField.val()) {
    nameField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '아이디를 입력하세요.<br>';
  } else if (!nameRegExp.test(nameField.val())) {
    nameField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '아이디는 영문, 숫자로만 구성되어야 하며, 6-10자여야 합니다.<br>';
  }

  if (!passField.val()) {
    passField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '비밀번호를 입력하세요.<br>';
  } else if (!passRegExp.test(passField.val())) {
    passField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '비밀번호는 영문, 숫자, 특수문자가 모두 포함되어야 하며, 8-12자여야 합니다. 대소문자를 구분하며 공백은 허용되지 않습니다.<br>';
  }

  if (errorMsg) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      html: `<strong>${errorMsg}</strong>`,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
      didClose: () => {
        setTimeout(() => {
          if (!emailRegExp.test(emailField.val())) {
            emailField.css('box-shadow', '');
          }
          if (!nameRegExp.test(nameField.val())) {
            nameField.css('box-shadow', '');
          }
          if (!passRegExp.test(passField.val())) {
            passField.css('box-shadow', '');
          }
        }, 1500);
      }
    });
  } else {
    // 회원가입 폼 유효성 검사 통과 시
    const emailField = document.getElementById("signUpEmail");
    const idField = document.getElementById("signUpId");
    const passField = document.getElementById("signUpPw");
    const email = document.getElementById("signUpEmail").value;
    const id = document.getElementById("signUpId").value;
    const pw = document.getElementById("signUpPw").value;
    const checkbox = document.getElementById("reg-log");
    // 회원가입 요청에 따른 응답 처리
    axios.post("/signup", {
      email: email,
      id: id,
      pw: pw
    }) // 회원가입 성공 시
      .then(function (response) {
        if (response.status === 200) {
          emailField.value = '';
          emailField.style.boxShadow = '';
          idField.value = '';
          idField.style.boxShadow = '';
          passField.value = '';
          passField.style.boxShadow = '';
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `회원가입 성공!`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000,
            didClose: () => {
              checkbox.checked = false;
            }
          });
        }
      }) // 회원가입 실패 시
      .catch(function (error) {
        if (error.response.status === 409) {
          const errorMessage = error.response.data.error;
          if (errorMessage === "Duplicate Email") {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: `이미 가입된 이메일 입니다!`,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
                emailField.style.boxShadow = "0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)";
              },
              didClose: () => {
                setTimeout(() => {
                  emailField.style.boxShadow = "";
                }, 1500);
              }
            });
          } else if (errorMessage === "Duplicate ID") {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: `이미 사용중인 아이디 입니다!`,
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 2000,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
                idField.style.boxShadow = "0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)";
              },
              didClose: () => {
                setTimeout(() => {
                  idField.style.boxShadow = "";
                }, 1500);
              }
            });
          }
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `알수없는 오류가 발생했습니다!`,
            html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });
        }
      });
  }
});

