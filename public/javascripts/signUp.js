
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
    errorMsg += 'Please enter your email.<br>';
  } else if (!emailRegExp.test(emailField.val())) {
    emailField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'Invalid email format.<br>';
  }

  if (!nameField.val()) {
    nameField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'Please enter your ID.<br>';
  } else if (!nameRegExp.test(nameField.val())) {
    nameField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'The ID must consist of only alphanumeric characters and must be 6-10 characters.<br>';
  }

  if (!passField.val()) {
    passField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'Please enter your PW.<br>';
  } else if (!passRegExp.test(passField.val())) {
    passField.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'PW must contain all alphanumeric characters, numbers, and special characters, and must be 8-12 characters. Case sensitive, no spaces allowed.<br>';
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
            title: `Sign up success!`,
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
              title: `This email has already been registered!`,
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
              title: `This ID has already been registered`,
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
            title: `An unknown error has occurred!`,
            html: `<strong>issue : https://github.com/DavidHuxley</strong>`,
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

