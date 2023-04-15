
// 삭제처리
$('.delete').click(function (e) {
  var todoNum = e.target.dataset.id;
  var deleteBtn = $(this);

  $.ajax({
    method: 'DELETE',
    url: '/delete',
    data: { _id: todoNum }
  })
    .done((data, textStatus, xhr) => {
      deleteBtn.parent('li').fadeOut(300);
    })
    .fail((xhr, textStatus, errorThrown) => {
      switch (xhr.status) {
        case 400:
          alert('Client Error');
          break;
        case 404:
          alert('404 Not Found');
          break;
        case 500:
          alert('Server Error');
          break;
        default:
          alert('Something went wrong');
      }
    });
});

// 검색창 엔터키 입력 시 검색
$('#searchBar').keyup((search) => {
  if (search.keyCode === 13) {
    var inputValue = $('#searchBar').val()
    window.location.replace(`/search?value=${inputValue}`);
  };
});

    
// 카드 클릭 시 flipped 클래스 추가
$(document).ready(function () {
  $('.card').click(function () {
    $(this).toggleClass('flipped');
  });

  // 내부 요소 클릭 시 이벤트 전파 막기
  $('.card h4, .card span, .card i').click(function (event) {
    event.stopPropagation();
  });
});


// 다른 요소 클릭 시 flipped 클래스 제거
$(document).on('click', function (e) {
  if (!$(e.target).closest('.card').length) {
    $('.card').removeClass('flipped');
  }
});

// 카드 hover 시 그림자 효과
$('.card').hover(function () {
  $(this).css('box-shadow', '0 0 25px #ffeba7');
}, function () {
  $(this).css('box-shadow', 'none');
});

// 카드 아이콘 hover시 fade 효과
$('#backBtnHeart, #backBtnBookmark').hover(function () {
  $(this).addClass('fa-fade');
}, function () {
  $(this).removeClass('fa-fade');
});

// 카드 아이콘 클릭 토글
$('#backBtnHeart').click(function () {
  $(this).toggleClass('fa-regular fa-solid');
});
$('#backBtnBookmark').click(function () {
  $(this).toggleClass('fa-regular fa-solid');
});

