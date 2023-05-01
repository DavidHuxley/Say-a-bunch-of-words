// const { default: axios } = require("axios");
// const { default: Swal } = require("sweetalert2");

const wPMenuSpan = document.getElementById('wPMenuSpan');
const wPostArrayDiv = document.getElementById('wPostArrayDiv');
const writtenPostsCount = document.getElementById('writtenPostsCount');

const sPMenuSpan = document.getElementById('sPMenuSpan');
const sPostArrayDiv = document.getElementById('sPostArrayDiv');
const bookmarkPostsCount = document.getElementById('bookmarkPostsCount');

const bookmarkArrayInfo = document.getElementById('bookmarkArrayInfo');
const menuIndicator = document.getElementById('menuIndicator');

// wPMenuSpan 클릭에 따른 리스트 변경 이벤트
wPMenuSpan.addEventListener('click', () => {
    wPMenuSpan.style.color = '#ececec';
    sPMenuSpan.style.color = 'rgba(236, 236, 236, .3)';
    wPostArrayDiv.style.display = 'grid';
    sPostArrayDiv.style.display = 'none';
    writtenPostsCount.style.display = 'inline';
    bookmarkPostsCount.style.display = 'none';
    bookmarkArrayInfo.style.opacity = '0';
    menuIndicator.style.left = '533px';
    menuIndicator.style.width = '563px';
});


// sPMenuSpan 클릭에 따른 리스트 변경 이벤트
sPMenuSpan.addEventListener('click', () => {
    sPMenuSpan.style.color = '#ececec';
    wPMenuSpan.style.color = 'rgba(236, 236, 236, .3)';
    sPostArrayDiv.style.display = 'grid';
    wPostArrayDiv.style.display = 'none';
    writtenPostsCount.style.display = 'none';
    bookmarkPostsCount.style.display = 'inline';
    bookmarkArrayInfo.style.opacity = '1';
    menuIndicator.style.left = '0px';
    menuIndicator.style.width = '533px';
});

// .fa-trash-can, .fa-bookmark hover 시 fa-fade 클래스 넣기
const buttons = document.querySelectorAll('.fa-trash-can, .fa-bookmark');
const buttonArray = Array.from(buttons);

buttonArray.forEach((button) => {
    button.addEventListener('mouseover', () => {
        button.classList.add('fa-fade');
    });
    button.addEventListener('mouseout', () => {
        button.classList.remove('fa-fade');
    });
});

// .wPostAtitle, .sPostAtitle 클릭시 해당 요소가 가지고 있는 data-id로 게시글로 이동
const wPostAtitles = document.querySelectorAll('.wPostAtitle');
const wPostAtitleArray = Array.from(wPostAtitles);

wPostAtitleArray.forEach((wPostAtitle) => {
    wPostAtitle.addEventListener('click', () => {
        const postId = wPostAtitle.dataset.id;
        location.href = `/detail/${postId}`;
    });
});

const sPostAtitles = document.querySelectorAll('.sPostAtitle');
const sPostAtitleArray = Array.from(sPostAtitles);

sPostAtitleArray.forEach((sPostAtitle) => {
    sPostAtitle.addEventListener('click', () => {
        const postId = sPostAtitle.dataset.id;
        location.href = `/detail/${postId}`;
    });
});

const wPostAdBtns = document.querySelectorAll('.wPostAdBtn');
const wPostAdBtnArray = Array.from(wPostAdBtns);

wPostAdBtnArray.forEach((wPostAdBtn) => {
    wPostAdBtn.addEventListener('click', async () => {
        const postId = wPostAdBtn.children[0].dataset.id;
        const postDeleteBtn = wPostAdBtn.children[0];
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
                        // 삭제 성공시 해당 버튼의 부모요소인 .wPostArray div 삭제
                        postDeleteBtn.parentElement.parentElement.parentElement.remove();
                        const postCount = response.data.postCount;
                        writtenPostsCount.innerHTML = `${postCount}`;

                        if (postCount == 0) {
                            const div = document.createElement("div");
                            div.classList.add("wPostArray");
                          
                            const innerDiv = document.createElement("div");
                            innerDiv.classList.add("wPostNo");
                          
                            const span = document.createElement("span");
                            span.textContent = "You have burned all the postcards you had written. Nothing is left..";
                          
                            innerDiv.appendChild(span);
                            div.appendChild(innerDiv);
                          
                            const parent = document.getElementById("wPostArrayDiv");
                            parent.appendChild(div);
                          }
                        // 삭제 하려는 게시글이 저장된 게시글일 경우 저장된 게시글에서도 해당 data-id를 가진 요소 삭제
                        const sPostAtitles = document.querySelectorAll('.sPostAtitle');
                        const sPostAtitleArray = Array.from(sPostAtitles);
                        const bookmarkPostCount = response.data.bookmarkPostsCount;
                        bookmarkPostsCount.innerHTML = `${bookmarkPostCount}`;

                        sPostAtitleArray.forEach((sPostAtitle) => {
                            if (sPostAtitle.dataset.id == postId) {
                                sPostAtitle.parentElement.parentElement.remove();
                                // bookmarkPostsCount 가 0이면 저장된 게시글이 없다는 문구 출력
                                if (bookmarkPostCount == 0) {
                                    const div = document.createElement("div");
                                    div.classList.add("sPostArray");
                                  
                                    const innerDiv = document.createElement("div");
                                    innerDiv.classList.add("sPostNo");
                                  
                                    const span = document.createElement("span");
                                    span.textContent = "The postcards you had saved have just turned into ashes, burned by you. How unfortunate..";
                                  
                                    innerDiv.appendChild(span);
                                    div.appendChild(innerDiv);
                                  
                                    const parent = document.getElementById("sPostArrayDiv");
                                    parent.appendChild(div);
                                  }
                            }
                        });

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
    });
});

// bookmarkBtn 클릭시 해당 요소가 fa-solid 가지고 있으면 해당 요소의 data-id의 게시물 /bookmarkdown으로 저장해제, fa-regular 가지고 있으면 data-id의 게시물 저장
const bookmarkBtns = document.querySelectorAll('.bookmarkBtn');
const bookmarkBtnArray = Array.from(bookmarkBtns);

bookmarkBtnArray.forEach((bookmarkBtn) => {
    bookmarkBtn.addEventListener('click', async () => {
        const postId = bookmarkBtn.dataset.id;
        axios.post('/bookmarkDown', {
            id: postId
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
                title: '북마크 취소!'
            })
            // 북마크 취소 성공시 해당 버튼의 부모 요소인 .sPostArray div 삭제
            bookmarkBtn.parentElement.parentElement.parentElement.remove();
            const bookmarkPostCount = response.data.bookmarkPostsCount;
            bookmarkPostsCount.innerHTML = `${bookmarkPostCount}`;

            if (bookmarkPostCount == 0) {
                const div = document.createElement("div");
                div.classList.add("sPostArray");

                const innerDiv = document.createElement("div");
                innerDiv.classList.add("sPostNo");

                const span = document.createElement("span");
                span.textContent = "The postcards you had saved have just turned into ashes, burned by you. How unfortunate..";

                innerDiv.appendChild(span);
                div.appendChild(innerDiv);

                const parent = document.getElementById("sPostArrayDiv");
                parent.appendChild(div);
            }
        })
        .catch(function (error) {
            console.log(error);
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
    });
});
                