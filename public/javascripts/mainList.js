
// card 클릭 시 flipped 클래스 추가
$(document).on('click', '.card', function() {
  $(this).toggleClass('flipped');
});

// 내부 요소 클릭했을때 이벤트 전파 막기
$(document).on('click', '.card h4, .card span, .card i', function(event) {
  event.stopPropagation();
});


// 이벤트 위임을 사용하여 hover 이벤트 추가
$(document).on({
  mouseenter: function() {
    $(this).css('cursor', 'pointer');
  },
  mouseleave: function() {
    $(this).css('cursor', 'auto');
  }
}, '.card:not(h4, span, i)');


// 다른 요소 클릭 시 flipped 클래스 제거
$(document).on('click', function (e) {
  if (!$(e.target).closest('.card').length) {
    $('.card').removeClass('flipped');
  }
});

// cardlist hover 시 scale 효과
$(document).on({
  mouseenter: function () {
    $(this).css('transform', 'scale(1.05)');
  },
  mouseleave: function () {
    $(this).css('transform', 'scale(1)');
  }
}, '.cardlist');


// 이벤트 위임을 사용하여 hover 이벤트 추가
$(document).on({
  mouseenter: function() {
    if ($(this).hasClass('fa-regular')) {
      $(this).addClass('fa-fade');
    }
  },
  mouseleave: function() {
    $(this).removeClass('fa-fade');
  }
}, '.backBtnHeart, .backBtnBookmark');


// 상세페이지 이동
$(document).on('click', '.backBtnComment', function() {
  const postId = $(this).data('id');
  window.location.href = `/detail/${postId}`;
});

// writer class를 가진 div의 첫번째 span을 클릭하면 span의 data-id로 이동하는 이벤트
$(document).on('click', '.writer span:first-child', function() {
  const nickname = $(this).data('id');
  window.location.href = `/@${nickname}`;
});

const backBtnBookmarkList = document.querySelectorAll('.backBtnBookmark');

// seeMore로 인한 신규 DOM요소 생기므로 이벤트 위임을 통해 이벤트 처리
const eventDelegation = document.querySelector('#main');

eventDelegation.addEventListener('click', function (event) {
  if (event.target.classList.contains('backBtnHeart')) {
    const postId = event.target.dataset.id;
    const backBtnHeart = event.target;

    if (backBtnHeart.classList.contains('fa-regular')) {
      axios
        .post('/likeUp', {
          id: postId,
        })
        .then(function (response) {
          backBtnHeart.classList.remove('fa-regular');
          backBtnHeart.classList.add('fa-solid');
          backBtnHeart.style.color = '#FE5F55';
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Liked the postcard!',
          });
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'error',
            title: `ERROR!`,
            html: `<strong>issue : https://github.com/DavidHuxley</strong>`,
          });
        });
    } else if (backBtnHeart.classList.contains('fa-solid')) {
      axios
        .post('/likeDown', {
          id: postId,
        })
        .then(function (response) {
          backBtnHeart.classList.remove('fa-solid');
          backBtnHeart.classList.add('fa-regular');
          backBtnHeart.style.color = '#ECECEC';
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Uniked the postcard!',
          });
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'error',
            title: `ERROR!`,
            html: `<strong>issue : https://github.com/DavidHuxley</strong>`,
          });
        });
    }
  }
});

// bookmark 이벤트 위임처리


eventDelegation.addEventListener('click', function (event) {
  if (event.target.classList.contains('backBtnBookmark')) {
    const postId = event.target.dataset.id;
    const backBtnBookmark = event.target;

    if (backBtnBookmark.classList.contains('fa-regular')) {
      axios.post('/bookmarkUp', {
        id: postId
      })
        .then(function (response) {
          backBtnBookmark.classList.remove('fa-regular');
          backBtnBookmark.classList.add('fa-solid');
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
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
            title: 'Postcard saved!'
          })
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
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
            html: `<strong>issue : https://github.com/DavidHuxley</strong>`
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
            position: 'bottom-end',
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
            title: 'Postcard unsaved!'
          })
        })
        .catch(function (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-end',
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
            html: `<strong>issue : https://github.com/DavidHuxley</strong>`
          })
        });
    }
  }
});

// 클라이언트에서 seeMore 버튼 클릭 시 실행되는 함수
function handleSeeMore(btnId) {

  seeMoreClickCount++;
  const count = seeMoreClickCount;

  if (btnId === 'seeMore') {
  axios.post('/seeMore', {
    count: count
  })
  .then(function (response) {
    // 받아온 데이터를 이용하여 DOM 요소 생성
    const newPosts = createDOMElements(response.data);

    // 생성된 DOM 요소를 기존의 게시글 목록에 추가
    const listDiv = document.querySelector('.listDiv');
    listDiv.appendChild(newPosts);

    // 받아온 데이터가 12개 미만이면 seeMore 버튼을 숨김
    if (response.data.POST.length < 12) {
      seeMoreBtn.style.display = 'none';
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'info',
        title: 'No more postcards!'
      })
    }
    
  })
  .catch(function (error) {
    console.log(error);
  });
  } else if (btnId === 'searchSeeMore') {

    const searchValue = document.querySelector('#searchSeeMore').dataset.id;

    axios.post('/searchSeeMore', {
      count: count,
      searchValue: searchValue
    })
    .then(function (response) {
      // 받아온 데이터를 이용하여 DOM 요소 생성
      const newPosts = createDOMElements(response.data);
  
      // 생성된 DOM 요소를 기존의 게시글 목록에 추가
      const listDiv = document.querySelector('.listDiv');
      listDiv.appendChild(newPosts);
  
      // 받아온 데이터가 12개 미만이면 seeMore 버튼을 숨김
      if (response.data.POST.length < 12) {
        searchSeeMoreBtn.style.display = 'none';
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'info',
          title: 'No more postcards!'
        })
      }
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

// 받아온 데이터를 이용하여 DOM 요소를 생성하는 함수
function createDOMElements(data) {
  // DOM 요소를 저장할 컨테이너
  const fragment = document.createDocumentFragment();

  const sortedPOST = data.POST;
  const USER = data.USER;
  const cUSER = data.cUSER;

  // 데이터를 반복하여 DOM 요소 생성
  sortedPOST.forEach(sortedPOST => {
    const postScore = sortedPOST.comment + sortedPOST.like * 2;
    const transparency = Math.min(1, Math.max(0, postScore / 100)).toFixed(2);
    const boxShadowColor = `rgba(255, 255, 204, ${transparency})`;

    const currentTime=luxon.DateTime.local().toISO();
    const postTime=luxon.DateTime.fromISO(sortedPOST.time);
    const duration=luxon.DateTime.fromISO(currentTime).diff(luxon.DateTime.fromISO(postTime));
    let timeAgo='';
    if (duration.as('seconds') < 60) { timeAgo='just before'; } 
    else if (duration.as('minutes') < 60) { 
      const minutes = Math.floor(duration.as('minutes'));
      timeAgo = minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`; 
    } 
    else if (duration.as('hours') < 24) {
      const hours = Math.floor(duration.as('hours'));
      timeAgo = hours === 1 ? `${hours} hour ago` : `${hours} hours ago`; 
    } 
    else if (duration.as('days') < 7) { 
      const days = Math.floor(duration.as('days'));
      timeAgo = days === 1 ? `${days} day ago` : `${days} days ago`; 
    } 
    else if (duration.as('weeks') < 4) {
      const weeks = Math.floor(duration.as('weeks'));
      timeAgo = weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`; 
    } 
    else if (duration.as('months') < 12) {
      const months = Math.floor(duration.as('months'));
      timeAgo = months === 1 ? `${months} month ago` : `${months} months ago`; 
    } 
    else {
      timeAgo = 'long time ago'; 
    }

    const user = USER.find(u=> u.nickname === sortedPOST.writer);

    const likePosts = cUSER.likePosts.includes(sortedPOST._id);
    const bookmarkPosts = cUSER.bookmarkPosts.includes(sortedPOST._id);

    const cardlist = document.createElement('div');
    cardlist.classList.add('cardlist');
    cardlist.innerHTML = `
    <div class="card" style="box-shadow: 0px 0px 1vw 1vw ${boxShadowColor}">
      <div class="front">
        <div class="frontImg">
          <img class="frontImg" src=${sortedPOST.img}></img>
        </div>
        <div class="frontText">
          <div class="writingTime">
            <span class="writeTime">
              ${timeAgo}
            </span>
            <span class="writeTimeHover">
              ${luxon.DateTime.fromISO(sortedPOST.time).toFormat('yyyy-MM-dd HH:mm')}
            </span>
          </div>
          <div class="frontContent">
           <h4>
            ${sortedPOST.title}
            </h4>
          </div>
          <div class="writer">
          <span data-id="${sortedPOST.writer}"> 
            ${sortedPOST.writer}
          </span>
           <img src="${user.profileImg}"></img>
          </div>
        </div>
      </div>
      <div class="back">
        <div class="backContent">
         <span>
          ${sortedPOST.content}
          </span>
        </div>
        <div class="backBtnBundle">
          <i class="fa-regular fa-comment-dots backBtnComment" data-id="${sortedPOST._id}" style="color: #ececec;"></i>
          <i class="${likePosts ? `fa-solid` : `fa-regular`} fa-heart backBtnHeart" data-id="${sortedPOST._id}" style="color: ${likePosts ? `rgba(255, 0, 0, .5)` : '#ececec'};"></i>
          <i class="${bookmarkPosts ? `fa-solid` : `fa-regular`} fa-bookmark backBtnBookmark" data-id="${sortedPOST._id}" style="color: #ececec;"></i>
        </div>
      </div>
    </div>
 `;

    // DOM 요소를 fragment에 추가
    fragment.appendChild(cardlist);
  });

  // fragment를 반환
  return fragment;
}

// seeMore 버튼에 클릭 이벤트 리스너 추가
const seeMoreBtn = document.getElementById('seeMore');
const searchSeeMoreBtn = document.getElementById('searchSeeMore');
let seeMoreClickCount = 0;

if (seeMoreBtn) {
  seeMoreBtn.addEventListener('click', () => handleSeeMore('seeMore'));
}

if (searchSeeMoreBtn) {
  searchSeeMoreBtn.addEventListener('click', () => handleSeeMore('searchSeeMore'));
}