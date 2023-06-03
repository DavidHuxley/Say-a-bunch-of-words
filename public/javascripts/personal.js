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


const profileImg = document.getElementById('profileImg');

const profileImgEditBtn = document.getElementById('profileImgEditBtn');
const profileImgBtnBox = document.getElementById('profileImgBtnBox');

if(profileImgEditBtn){
    profileImgEditBtn.addEventListener('click', () => {
        profileImgBtnBox.style.display = 'block';
    });
}

// profileImgBtnBox block 상태일때 다른 곳 클릭시 none으로 변경
document.addEventListener('click', (e) => {
    if (e.target !== profileImgEditBtn) {
        profileImgBtnBox.style.display = 'none';
    }
});


if (!sPMenuSpan) {
    menuIndicator.style.left = '0px';
    menuIndicator.style.width = '1098px';
    wPMenuSpan.style.cursor = 'default';
}

// wPMenuSpan 클릭에 따른 리스트 변경 이벤트
wPMenuSpan.addEventListener('click', () => {
    wPMenuSpan.style.color = '#ececec';
    wPostArrayDiv.style.display = 'grid';
    writtenPostsCount.style.display = 'inline';
    if (sPMenuSpan) {
        sPMenuSpan.style.color = 'rgba(236, 236, 236, .3)';
        sPostArrayDiv.style.display = 'none';
        bookmarkPostsCount.style.display = 'none';
        bookmarkArrayInfo.style.opacity = '0';
        menuIndicator.style.left = '533px';
        menuIndicator.style.width = '563px';
    }
});

if (sPMenuSpan) {
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
    })
};

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
            title: `Are you sure you want to delete it?`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'rgb(160, 0, 0)',
            cancelButtonColor: '#2a2b38',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/postDelete', {
                    id: postId
                })
                    .then(function (response) {
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
                            title: 'Deleted!'
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
                    title: 'Postcard Unsaved!'
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
    });
});

const proConNicknameEditInput = document.getElementById("proConNicknameEditInput");
const proConNicknameEditTag = document.getElementById("proConNicknameEditTag");

const proConEditBtn = document.getElementById("proConEditBtn");
const proConSaveBtn = document.getElementById("proConSaveBtn");
const proConCancelBtn = document.getElementById("proConCancelBtn");
const proConEmailViewCheck = document.querySelectorAll(".proConEmailViewCheck");
const proConNicknameEditSpan = document.getElementById("proConNicknameEditSpan");
const proConNicknameEditCheck = document.getElementById("proConNicknameEditCheck");
const DeletIdBtn = document.getElementById("DeletIdBtn");
const proConEditInfo = document.getElementById("proConEditInfo");

const proConNicknameTag = document.getElementById("proConNicknameTag");
const proConNicknameSpan = document.getElementById("proConNicknameSpan");

proConEditBtn.addEventListener('click', () => {
    proConEditBtn.style.display = "none";
    proConSaveBtn.style.display = "flex";
    proConCancelBtn.style.display = "flex";
    proConNicknameEditTag.style.display = "flex";
    proConEmailViewCheck.forEach((proConEmailViewCheck) => {
        proConEmailViewCheck.style.display = "inline";
    });
    proConNicknameEditSpan.style.display = "inline";
    proConNicknameEditCheck.style.display = "flex";
    DeletIdBtn.style.display = "flex";
    proConEditInfo.style.display = "flex";

    proConNicknameTag.style.display = "none";
    proConNicknameSpan.style.display = "none";
    proConNicknameDupliCheckIcon.style.color = "rgba(236, 236, 236, .4)"
    proConNicknameAvailCheckIcon.style.color = "rgba(236, 236, 236, .8)"
});

const nicknameRegex = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,8}$/;
const proConNicknameAvailCheckIcon = document.getElementById("proConNicknameAvailCheckIcon");
const proConNicknameDupliCheckIcon = document.getElementById("proConNicknameDupliCheckIcon");

let proConNicknameAvailCheckbox = true;
let proConNicknameDupliCheckbox = true;

proConNicknameEditInput.addEventListener('keyup', () => {
    const inputValue = proConNicknameEditInput.value;
    // 닉네임 중복 체크
    proConNicknameDupliCheckIcon.style.color = "rgba(236, 236, 236, .4)"
    proConNicknameDupliCheckbox = false;
    if (nicknameRegex.test(inputValue) && inputValue.toLowerCase() !== proConNicknameEditInput.defaultValue.toLowerCase()) {
        proConNicknameAvailCheckIcon.style.color = "rgba(0, 255, 0, .8)"
        proConNicknameAvailCheckbox = true;
    } else if (nicknameRegex.test(inputValue) && inputValue.toLowerCase() === proConNicknameEditInput.defaultValue.toLowerCase()) {
        proConNicknameAvailCheckIcon.style.color = "rgba(236, 236, 236, .8)"
        proConNicknameAvailCheckbox = true;
    } else {
        proConNicknameAvailCheckIcon.style.color = "rgba(236, 236, 236, .4)"
        proConNicknameAvailCheckbox = false;
    }
});

// 금칙어 설정
const unavailableWords = ["admin", "관리자", "운영자", "어드민", "관리", "운영", "administor", "administrator", "administor", "administator", "adminstr"];

proConNicknameEditCheck.addEventListener('click', () => {
    const inputValue = proConNicknameEditInput.value;
    if (inputValue.toLowerCase() !== proConNicknameEditInput.defaultValue) {
        if (unavailableWords.some(words => inputValue.toLowerCase().includes(words))) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: `Your nickname contains a disallowed word. Please check again`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
                didClose: () => {
                    proConNicknameEditInput.focus();
                }
            })
            proConNicknameDupliCheckIcon.style.color = "rgba(236, 236, 236, .4)";
            proConNicknameDupliCheckbox = false;
        } else if (nicknameRegex.test(inputValue)) {
            axios.post('/proConNicknameEditCheck', {
                nickname: inputValue
            })
                .then(function (response) {
                    if (response.data.result == true) {
                        proConNicknameDupliCheckIcon.style.color = "rgba(236, 236, 236, .4)";
                        proConNicknameDupliCheckbox = false;
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: `The nickname is already in use.`,
                            showConfirmButton: false,
                            timerProgressBar: true,
                            timer: 2000,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            },
                            didClose: () => {
                                proConNicknameEditInput.focus();
                            }
                        })
                    } else if (response.data.result == false) {
                        proConNicknameDupliCheckIcon.style.color = "rgba(0, 255, 0, .8)";
                        proConNicknameDupliCheckbox = true;
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `The nickname is available!`,
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
                    console.log(error);
                });
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: `Nicknames can only be 2-8 characters long and can only contain letters, numbers, and Korean characters.`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                },
                didClose: () => {
                    proConNicknameEditInput.focus();
                }
            })
            proConNicknameDupliCheckIcon.style.color = "rgba(236, 236, 236, .4)";
            proConNicknameDupliCheckbox = false;
        }
    } else if (inputValue.toLowerCase() == proConNicknameEditInput.defaultValue.toLowerCase()) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: `This is your original nickname.`,
            html: `<strong>It's okay to leave it as it is.</strong>`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            didClose: () => {
                proConNicknameEditInput.focus();
            }
        })
        proConNicknameDupliCheckIcon.style.color = "rgba(0, 255, 0, .8)";
        proConNicknameDupliCheckbox = true;
    }
});


// proConEmailViewCheck를 클릭했을때 첫번째 자식요소가 fa-eye-slash 클래스를 가지고 있으면 해당 클래스 지우고 fa-eye 추가
// proConEmailViewCheck를 클릭했을때 첫번째 자식요소가 fa-eye 클래스를 가지고 있으면 해당 클래스 지우고 fa-eye-slash 추가
proConEmailViewCheck.forEach((proConEmailViewCheck) => {
    proConEmailViewCheck.addEventListener('click', () => {
        const proConEmailViewCheckIcon = proConEmailViewCheck.firstElementChild;
        const proConEmailViewCheckText = proConEmailViewCheck.lastElementChild;
        if (proConEmailViewCheckIcon.classList.contains("fa-eye-slash")) {
            proConEmailViewCheckIcon.classList.remove("fa-eye-slash");
            proConEmailViewCheckIcon.classList.add("fa-eye");
            proConEmailViewCheckText.innerText = "Public";
        } else if (proConEmailViewCheckIcon.classList.contains("fa-eye")) {
            proConEmailViewCheckIcon.classList.remove("fa-eye");
            proConEmailViewCheckIcon.classList.add("fa-eye-slash");
            proConEmailViewCheckText.innerText = "Private";
        }
    });
});

proConSaveBtn.addEventListener('click', () => {
    if (proConNicknameAvailCheckbox == true && proConNicknameDupliCheckbox == true) {
        Swal.fire({
            title: 'Do you want to save it?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(160, 0, 0)',
            cancelButtonColor: '#2a2b38',
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/proConEdit', {
                    nickname: proConNicknameEditInput.value,
                    emailView: proConEmailViewCheck[0].firstElementChild.classList.contains("fa-eye-slash") ? false : true,
                })
                    .then(function (response) {
                        if (response.data.result == true) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `Saved!`,
                                showConfirmButton: false,
                                timerProgressBar: true,
                                timer: 2000,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }
                            })
                            location.href = `/@${response.data.nickname}`;

                        } else {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: `Failed to save.`,
                                showConfirmButton: false,
                                timerProgressBar: true,
                                timer: 2000,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                },
                                didClose: () => {
                                    location.reload();
                                }
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
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
        })
    } else {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `Please check the availability of nicknames.`,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 2000,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            didClose: () => {
                proConNicknameEditInput.focus();
            }
        })
    }
});

proConCancelBtn.addEventListener('click', () => {
    proConEditBtn.style.display = "flex";
    proConSaveBtn.style.display = "none";
    proConCancelBtn.style.display = "none";
    proConNicknameEditTag.style.display = "none";
    proConNicknameEditInput.value = proConNicknameEditInput.defaultValue;

    proConEmailViewCheck.forEach((proConEmailViewCheck) => {
        proConEmailViewCheck.style.display = "none";
    });
    proConNicknameEditSpan.style.display = "none";
    proConNicknameEditCheck.style.display = "none";
    DeletIdBtn.style.display = "none";
    proConEditInfo.style.display = "none";

    proConNicknameTag.style.display = "flex";
    proConNicknameSpan.style.display = "flex";
});


const profileImgUploadBtn = document.getElementById("profileImgUploadBtn");
// profileImgUploadBtn 클릭시 profileImgInput 클릭
profileImgUploadBtn.addEventListener('click', () => {
    profileImgInput.click();
});

const profileImgInput = document.getElementById("profileImgInput");
profileImgInput.addEventListener("change", function () {
    // 파일을 선택했을 경우에만 아래 코드 실행
    if (profileImgInput.value) {

        let errorMsg = "";
        // 선택된 파일이 PNG, JPG, JPEG, GIF, WEBP 확장자를 가졌는지 확인
        const ext = profileImgInput.value.slice(profileImgInput.value.lastIndexOf(".") + 1).toLowerCase();
        if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif" && ext !== "webp") {
            errorMsg += 'Only JPG, JPEG, PNG, GIF, and WEBP files can be uploaded.<br>';
        } // 선택된 파일이 10mb를 초과하는지 확인
        if (profileImgInput.files[0].size > 10 * 1024 * 1024) {
            errorMsg += 'Only files up to 10Mb can be uploaded.<br>';
        } if (errorMsg) {
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
                }
            });
            profileImgInput.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("profileImgInput", profileImgInput.files[0]);

        axios.post("/profileImgUpload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function (response) {
            if (response.status === 200) {
                const imageUrl = response.data.imageUrl;
                profileImg.src = imageUrl;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<strong>Upload successful!</strong>`,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 2000,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
            }
        }).catch(function (error) {
            if (error.response.status === 400) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<strong>Upload failed!</strong>`,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 2000,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });
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
        })
    }
});

// profileImg 삭제(기본이미지로 돌림)
const profileImgDeleteeBtn = document.getElementById("profileImgDeleteeBtn");
profileImgDeleteeBtn.addEventListener('click', () => {
    axios.post("/profileImgDelete", {
        profileImgDelete: true
    }).then(function (response) {
        if (response.status === 200) {
            const defaultProfileImg = '/assets/profile/defaultProfile.png';
            profileImg.src = defaultProfileImg;
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Delete IMG!`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
        }
    }).catch(function (error) {
        if (error.response.status === 400) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `Failed to delete IMG!`,
                html: `<strong>issue : https://github.com/DavidHuxley</strong>`,
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 2000,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
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
    })
});


// DeletIdBtn 클릭시 Swal.fire알람 후 axios.post '/deleteAccount' 요청 보내기

DeletIdBtn.addEventListener('click', () => {
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: `Are you sure you want to delete the account?`,
        html: `<strong>Deleted accounts cannot be recovered!</strong>`,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: 'rgb(160, 0, 0)',
        cancelButtonColor: '#2a2b38',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post('/deleteAccount', {
            }).then(function (response) {
                // result가 true일때
                if (response.data.result === true) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `Deleted your account`,
                        html: `<strong>Thank you for using it</strong>`,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        timer: 1500,
                    });
                    setTimeout(() => {
                        axios.get('/logout')
                            .then(res => {
                                if (res.status === 200) {
                                        location.href = '/';
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }, 2000);
                }
            }).catch(function (error) {
                if (error.response.status === 500) {
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
            })
        }
    })
});