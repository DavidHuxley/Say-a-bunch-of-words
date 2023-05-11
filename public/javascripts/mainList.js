// 카드 클릭 시 scale클래스를 가지고 있다면 flipped 클래스 추가
$(document).ready(function () {
  $('.card').click(function () {
    $(this).toggleClass('flipped');
  });
  
  // 내부 요소 클릭 시 이벤트 전파 막기
  $('.card h4, .card span, .card i').click(function (event) {
    event.stopPropagation();
  });
});

$('.card').children().not('h4, span, i').hover(function () {
  $(this).css('cursor', 'pointer');
}, function () {
  $(this).css('cursor', 'auto');
});


// 다른 요소 클릭 시 flipped 클래스 제거
$(document).on('click', function (e) {
  if (!$(e.target).closest('.card').length) {
    $('.card').removeClass('flipped');
  }
});

// cardlist hover 시 scale 효과
$('.cardlist').hover(function () {
  $(this).css('transform', 'scale(1.05)');
}, function () {
  $(this).css('transform', 'scale(1)');
});

// 카드가 fa-regular 클래스를 가지고 있을땐 아이콘 hover시 fade 효과
$('.backBtnHeart, .backBtnBookmark').hover(function () {
  if ($(this).hasClass('fa-regular')) {
    $(this).addClass('fa-fade');
  }
}, function () {
  $(this).removeClass('fa-fade');
});

// 상세페이지 이동
$('.backBtnComment').on('click', function() {
  const postId = $(this).data('id');
  window.location.href = `/detail/${postId}`;
});

// writer class를 가진 div의 첫번째 span을 클릭하면 span의 data-id로 이동하는 이벤트
$('.writer').find('span').on('click', function() {
  const nickname = $(this).data('id');
  window.location.href = `/@${nickname}`;
});


const backBtnHeartList = document.querySelectorAll('.backBtnHeart');
const backBtnBookmarkList = document.querySelectorAll('.backBtnBookmark');

backBtnHeartList.forEach((backBtnHeart) => {
  backBtnHeart.addEventListener('click', function () {
    const postId = this.dataset.id; // 해당 버튼의 데이터 속성에서 게시물 ID를 가져옴
    if (backBtnHeart.classList.contains('fa-regular')) {
      axios.post('/likeUp', {
        id: postId
      })
      .then(function (response) {
          backBtnHeart.classList.remove('fa-regular');
          backBtnHeart.classList.add('fa-solid');
          backBtnHeart.style.color = '#FE5F55';
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: '좋아요 완료!'
          })
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'error',
            title: `ERROR!`,
            html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`
          })
        });
    } else if (backBtnHeart.classList.contains('fa-solid')) {
      axios.post('/likeDown', {
        id: postId
      })
        .then(function (response) {
          backBtnHeart.classList.remove('fa-solid');
          backBtnHeart.classList.add('fa-regular');
          backBtnHeart.style.color = '#ECECEC';
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: '좋아요 취소!'
          })
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'error',
            title: `ERROR!`,
            html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`
          })
        });
    }
  });
});
backBtnBookmarkList.forEach((backBtnBookmark) => {
  backBtnBookmark.addEventListener('click', function () {
    const postId = this.dataset.id; // 해당 버튼의 데이터 속성에서 게시물 ID를 가져옴
    if (backBtnBookmark.classList.contains('fa-regular')) {
      axios.post('/bookmarkUp', {
        id: postId
      })
        .then(function (response) {
          backBtnBookmark.classList.remove('fa-regular');
          backBtnBookmark.classList.add('fa-solid');
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: '북마크 완료!'
          })
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'error',
            title: `ERROR!`,
            html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`
          })
        });
    } else if (backBtnBookmark.classList.contains('fa-solid')) {
      axios.post('/bookmarkDown', {
        id: postId
      })
        .then(function (response) {
          backBtnBookmark.classList.remove('fa-solid');
          backBtnBookmark.classList.add('fa-regular');
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: '북마크 취소!'
          })
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'error',
            title: `ERROR!`,
            html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`
          })
        });
    }
  });
});