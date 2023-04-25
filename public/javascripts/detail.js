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
    
    if(content === '') {
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
                const postCommentCount = response.data.postCommentCount;
                const backBtnSpanComment = document.querySelector('#backBtnSpanComment');
                backBtnSpanComment.textContent = `댓글수 ${postCommentCount}`;
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
            });
    }
});




  
// 카드가 fa-regular 클래스를 가지고 있을땐 아이콘 hover시 fade 효과
$('#backBtnHeart, #backBtnBookmark, .commentLikeBtn').hover(function () {
    if ($(this).hasClass('fa-regular')) {
        $(this).addClass('fa-fade');
    }
}, function () {
    $(this).removeClass('fa-fade');
});

// backBtnComment 버튼 클릭시 스크롤 댓글창으로 이동
$('.backBtnComment').click(function () {
    var cardOffset = $('#commentCard').offset().top;
    var windowHeight = $(window).height() * 0.2; // 화면에서 80% 정도위치에 commentCard 위치
    var offset = cardOffset - windowHeight;

    $('html, body').animate({
        scrollTop: offset
    }, 500);
});