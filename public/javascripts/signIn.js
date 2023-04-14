const toBeDeveloped = $('.toBeDeveloped');
const signInId = $('#signInId');
const signInPw = $('#signInPw');

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
signInBtn.addEventListener("click", function () {

  let errorMsg = '';

  if(!signInId.val()) {
    signInId.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '아이디를 입력하세요.<br>';
  } 

  if(!signInPw.val()) {
    signInPw.css('box-shadow', '0 0 3px rgba(255, 0, 0, .8), inset 0 0 1px rgb(255, 0, 0, .5)');
    errorMsg += '비밀번호를 입력하세요.<br>';
  } 
  if(errorMsg) {
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
          if((!signInId.val())){
            signInId.css('box-shadow', '');
          }
          if((!signInPw.val())){
            signInPw.css('box-shadow', '');
          }
        }, 1500);
      }
    })
  } else {
    const id = document.getElementById("signInId").value;
    const pw = document.getElementById("signInPw").value;
    axios.post('/signin', {
      id : id,
      pw : pw
    })
    .then(function (response) {
      // 처리 성공시 실행할 코드 작성
      if(response.status === 200) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `로그인 성공!`,
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
      } 
    })
    .catch(function (error) {
      if (error.response.status === 401)
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `로그인 실패!`,
          html: `<strong>아이디 또는 비밀번호를 확인해주세요.</strong>`,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 2000,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
    });
  }}  
);

// 개발 예정 알람
toBeDeveloped.each(function() {
  $(this).on('click', function(event) {
    event.preventDefault();
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: `추후 추가 예정입니다!`,
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