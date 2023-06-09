
const toBeDeveloped = $('.toBeDeveloped');
const signInId = $('#signInId');
const signInPw = $('#signInPw');

// 특정 url로 접속시 게스트 id,pw 부여함 (임시로 만든 기능)
$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const guestLogin = urlParams.get('guestLogin');

  if(guestLogin) {
  signInId.val('guest');
  signInPw.val('guest');
  }
});

// signInId, signInPw 포커스 바로 영문나오게 
signInId.on('focus', function () {
  signInId.attr('lang', 'en');
});
signInPw.on('focus', function () {
  signInPw.attr('lang', 'en');
});


// signIn keyup 이벤트 핸들러 함수
function signInKeyUp(event) {
  const target = event.target;
  
  if (target === signInId.get(0)) {
    if (signInId.val()) {
      target.style.boxShadow = '';
    }
  } else if (target === signInPw.get(0)) {
    if (signInPw.val()) {
      target.style.boxShadow = '';
    }
  }
}

signInId.on('keyup', signInKeyUp);
signInPw.on('keyup', signInKeyUp);


// 로그인 버튼 클릭 시 이벤트 핸들러 함수
const signInBtn = document.getElementById("signInBtn");

signInId.on('keyup', function (event) {
  if (event.key === 'Enter') {
    signInBtn.click();
  }
});
signInPw.on('keyup', function (event) {
  if (event.key === 'Enter') {
    signInBtn.click();
  }
});


signInBtn.addEventListener("click", function () {
  
  let errorMsg = '';
  
  if (!signInId.val()) {
    signInId.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'Please enter your ID.<br>';
  }
  
  if (!signInPw.val()) {
    signInPw.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += 'Please enter your PW.<br>';
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
          if ((!signInId.val())) {
            signInId.css('box-shadow', '');
          }
          if ((!signInPw.val())) {
            signInPw.css('box-shadow', '');
          }
        }, 1500);
      }
    })
  } else {
    const id = document.getElementById("signInId").value;
    const pw = document.getElementById("signInPw").value;
    axios.post('/signin', {
      id: id,
      pw: pw
    })
    .then(function (response) {
      // 처리 성공시 실행할 코드 작성
      if (response.data.result === 'success') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Sign in success!`,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
          didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            didClose: () => {
              location.href = '/';
            }
          })
        } else if (response.data.result === 'deletedAccount') {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: `This account has been recently deleted`,
            html: `<strong>You can't recover a withdrawn account.</strong>`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        } 
      }) 
      .catch(function (error) {
        if (error.response.status === 401)
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `Sign in failed`,
          html: `<strong>Invalid ID or password.</strong><br><strong>Passwords are case-sensitive.</strong>`,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      });
  }
}
);

// 개발 예정 알람
toBeDeveloped.each(function () {
  $(this).on('click', function (event) {
    event.preventDefault();
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: `It will be developed later!`,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 2000,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  });
});

const toggleSignInUp = $('.checkbox');
const toggleSiSpan = $('#toggleSiSpan');
const toggleSuSpan = $('#toggleSuSpan');

toggleSignInUp.on('click', function () {
  if ($(this).prop('checked')) {
    toggleSiSpan.css('color', '#ECECEC');
    toggleSuSpan.css('color', '#FE5F55');
  } else {
    toggleSiSpan.css('color', '#FE5F55');
    toggleSuSpan.css('color', '#ECECEC');
  }
});