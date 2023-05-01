const { DateTime } = luxon;

const backBtnHeart = document.getElementById('backBtnHeart');
const backBtnBookmark = document.getElementById('backBtnBookmark');

backBtnHeart.addEventListener('click', function () {
    const postId = this.dataset.id;// 해당 버튼의 데이터 속성에서 게시물 ID를 가져옴
    if (backBtnHeart.classList.contains('fa-regular')) {
        axios.post('/likeUp', {
            id: postId
        })
            .then(function (response) {
                backBtnHeart.classList.remove('fa-regular');
                backBtnHeart.classList.add('fa-solid');
                backBtnHeart.style.color = 'rgba(255, 0, 0, .5)';
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
                // 좋아요 수 업데이트
                const postLikeCount = response.data.likeCount;
                const backBtnSpanLike = document.querySelector('#backBtnSpanLike');
                backBtnSpanLike.textContent = `좋아요 ${postLikeCount}`;

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
                // 좋아요 수 업데이트
                const postLikeCount = response.data.likeCount;
                const backBtnSpanLike = document.querySelector('#backBtnSpanLike');
                backBtnSpanLike.textContent = `좋아요 ${postLikeCount}`;
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

// 댓글 텍스트 글자수 1000자 제한 및 90자 알람
const commentEditContentText = document.querySelector('#commentEditContentText');
let commentAlerted = false;
commentEditContentText.addEventListener('keyup', function () {
    const text = this.value;
    const len = text.length;
    this.value = text.slice(0, 1000);
    if (len > 1000 && !commentAlerted) {
        commentAlerted = true;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'warning',
            title: '최대 작성 가능한 글자수는 1000byte 입니다!'
        })
    }
});

// 댓글 작성 버튼 클릭시 댓글 작성

const commentSubmitBtn = document.querySelector('#commentSubmitBtn');
commentSubmitBtn.addEventListener('click', function () {
    const commentEditContentText = document.querySelector('#commentEditContentText');
    const content = commentEditContentText.value;
    const postId = this.dataset.id;

    if (content === '') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'warning',
            title: '아무런 내용이 없습니다!'
        })
    } else {
        axios.post('/comment', {
            id: postId,
            content: content
        })
            .then(function (response) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })

                Toast.fire({
                    icon: 'success',
                    title: '댓글 작성 완료!'
                })

                // 새로운 댓글, 댓글 작성자 정보가져옴 
                const newComment = response.data.newComment;
                const newCommenter = response.data.newCommenter;

                // 새로운 댓글의 DOM 요소 생성
                const newCommentElement = document.createElement('div');
                newCommentElement.innerHTML = `
                <div class="commentDiv">
                <div class="commentImg">
                  <img src=${newCommenter.profileImg}>
                </div>
                <div class="commentMain">
                  <div class="commentTop">
                    <div class="commentTopContent">
                      <div class="commentTopContentWrap">
                        <span class="commentWriter" data-id="${newCommenter.nickname}">${newCommenter.nickname}</span>
                        <div class="newcommentTimeWrap">
                          <span class="newCommentTime">just before</span>
                          <span class="newCommentTimeFormat"></span>
                        </div>
                      </div>
                    </div>
                    <div class="commentBtnBundle">
                    <i class="fa-regular fa-trash-can commentDeleteBtn"
                    data-id="${newComment._id}" style="color: rgba(255, 0, 0, .5);"></i>
                      <i class="fa-regular fa-heart commentLikeBtn" data-id="${newComment._id}" style="color: #ececec;"></i>
                      <span class="commentLikeSpan">like 0</span>
                    </div>
                  </div>
                  <div class="commentBottom">
                  <span class="commentContent">
                   ${newComment.content}
                  </span>
                </div>
                </div>
              </div>
                `;

                // 새로운 댓글에도 호버하면 시간 포맷해서 보여ㅓ줌
                const newCommentTimeFormat = newCommentElement.querySelector('.newCommentTimeFormat');
                newCommentTimeFormat.textContent = DateTime.fromISO(newComment.time).toFormat('yyyy-MM-dd HH:mm');             

                const newCommentTime = newCommentElement.querySelector('.newCommentTime');
                const newCommentTimeWrap = newCommentElement.querySelector('.newcommentTimeWrap');
                newCommentTimeWrap.addEventListener('mouseenter', function () {
                    newCommentTime.style.display = 'none';
                    newCommentTimeFormat.style.display = 'flex';
                })
                newCommentTimeWrap.addEventListener('mouseleave', function () {
                    newCommentTime.style.display = 'flex';
                    newCommentTimeFormat.style.display = 'none';
                })


                //새로운 댓글을 가장 앞에 추가함
                const commentsElement = document.querySelector('#commentCard');
                commentsElement.insertBefore(newCommentElement, commentsElement.firstChild);

                // 만약 댓글이 하나도 없었다면 commentEmptyDiv 요소 안보이게 정리
                if (document.querySelector('#commentEmptyDiv') !== null) {
                    const commentEmptyDiv = document.querySelector('#commentEmptyDiv');
                    commentEmptyDiv.style.display = 'none';
                }

                // 댓글 수 업데이트 
                const postCommentCount = response.data.postCommentCount;
                const backBtnSpanComment = document.querySelector('#backBtnSpanComment');
                backBtnSpanComment.textContent = `댓글수 ${postCommentCount}`;

                // 댓글 작성 폼 초기화
                commentEditContentText.value = '';
                commentEditContentText.focus();
                commentAlerted = false;



            })
            .catch(function (error) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
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
                console.log(error)
            });
    }
});

// 이벤트 위임을 통한 댓글 작성자 이름 클릭시 해당 유저의 프로필 페이지로 이동
const commentCard = document.querySelector('#commentCard');
commentCard.addEventListener('click', function (event) {
    if (event.target.matches('.commentWriter')) {
        const commenterId = event.target.dataset.id;
        location.href = `/@${commenterId}`;
    }
});

// 이벤트 위임을 통한 게시글,댓글 삭제 및 좋아요
const eventDelegation = document.querySelector('#main');
eventDelegation.addEventListener('click', function (event) {
    if (event.target.matches('.commentLikeBtn')) {
        const commentId = event.target.dataset.id;
        const commentLikeBtn = event.target;
        if (commentLikeBtn.classList.contains('fa-regular')) {
            axios.post('/commentLikeUp', {
                id: commentId
            })
                .then(function (response) {
                    commentLikeBtn.classList.remove('fa-regular');
                    commentLikeBtn.classList.add('fa-solid');
                    commentLikeBtn.style.color = 'rgba(255, 0, 0, .5)';
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
                    // 좋아요 수 업데이트 
                    const commentLikeCount = response.data.likeCount;
                    const commentLikeCountSpan = commentLikeBtn.nextElementSibling;
                    commentLikeCountSpan.textContent = `좋아요 ${commentLikeCount}`;


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
        } else if (commentLikeBtn.classList.contains('fa-solid')) {
            axios.post('/commentLikeDown', {
                id: commentId
            })
                .then(function (response) {
                    commentLikeBtn.classList.remove('fa-solid');
                    commentLikeBtn.classList.add('fa-regular');
                    commentLikeBtn.style.color = '#ececec';
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
                    // 좋아요 수 업데이트
                    const commentLikeCount = response.data.likeCount;
                    const commentLikeCountSpan = commentLikeBtn.nextElementSibling;
                    commentLikeCountSpan.textContent = `좋아요 ${commentLikeCount}`;
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
    }
    // 이벤트 위임을 사용하여 삭제 아이콘을 눌렀을때 commentDeleteBtn 클래스를 가지고 있으면 삭제
    if (event.target.matches('.fa-trash-can') && event.target.classList.contains('commentDeleteBtn')) {
        const commentId = event.target.dataset.id;
        const commentDeleteBtn = event.target;
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `정말로 삭제하시겠습니까?`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'rgb(160, 0, 0)',
            cancelButtonColor: '#2a2b38',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/commentDelete', {
                    id: commentId
                })
                    .then(function (response) {
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
                            title: '삭제 완료!'
                        })
                        const postCommentCount = response.data.postCommentCount;
                        const backBtnSpanComment = document.querySelector('#backBtnSpanComment');
                        backBtnSpanComment.textContent = `댓글수 ${postCommentCount}`;
                        commentDeleteBtn.parentElement.parentElement.parentElement.parentElement.remove();
                        const commentCard = document.getElementById('commentCard');
                        if (postCommentCount === 0) {
                            const commentEmptyDiv = document.createElement('div');
                            commentEmptyDiv.setAttribute('id', 'commentEmptyDiv');

                            const commentEmptySpan = document.createElement('span');
                            commentEmptySpan.textContent = 'you deleted the last remaining comment, how heartless...';

                            commentEmptyDiv.appendChild(commentEmptySpan);

                            // 부모 요소에 추가
                            commentCard.appendChild(commentEmptyDiv);
                        }

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
                    })
            }
        })
    }
    // 이벤트 위임을 사용하여 fa-trash-can, postDeleteBtn 을 가지고 있으면 게시글 삭제
    if (event.target.matches('.fa-trash-can') && event.target.classList.contains('postDeleteBtn')) {
        const postId = event.target.dataset.id;
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `정말로 삭제하시겠습니까?`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'rgb(160, 0, 0)',
            cancelButtonColor: '#2a2b38',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/postDelete', {
                    id: postId
                })
                    .then(function (response) {
                        if (response.status === 200) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `삭제 완료!`,
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
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: `ERROR!`,
                            html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                    })
            }
        })
    };
});


const postWriter = document.getElementById('writer');
// powtWriter 클릭 시 프로필 페이지로 이동
postWriter.addEventListener('click', function () {
    const writerId = postWriter.dataset.id;
    location.href = `/@${writerId}`;
});



// 버튼 효과, 이벤트위임
$('#main').on('mouseenter', '#backBtnHeart, #backBtnBookmark, .commentLikeBtn, .fa-trash-can', function () {
    if ($(this).hasClass('fa-regular')) {
        $(this).addClass('fa-fade');
    }
}).on('mouseleave', '#backBtnHeart, #backBtnBookmark, .commentLikeBtn, .fa-trash-can', function () {
    $(this).removeClass('fa-fade');
});

// backBtnComment 버튼 클릭시 스크롤 댓글창으로 이동
$('.backBtnComment').click(function () {
    var scrollTo = $(document).height() - $(window).height();

    $('html, body').animate({
        scrollTop: scrollTo
    }, 1000, 'easeInOutQuart');
});

// 클릭시 상단으로 이동
$('#commentSubmitBtn').click(function () {
    if (commentEditContentText.value !== '') {
        var windowHeight = $(window).height();
        var cardOffset = $('#commentSubmitBtn').offset().top;
        var cardHeight = $('#commentSubmitBtn').outerHeight();
        var scrollTo = cardOffset + cardHeight - windowHeight;

        $('html, body').animate({
            scrollTop: scrollTo
        }, 1000, 'easeInOutQuart');
    }
});
