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

profileImgEditBtn.addEventListener('click', () => {
    profileImgBtnBox.style.display = 'block';
});

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

proConNicknameEditCheck.addEventListener('click', () => {
    const inputValue = proConNicknameEditInput.value;
    if (inputValue.toLowerCase() !== proConNicknameEditInput.defaultValue) {
        if (inputValue.toLowerCase().includes("admin") || inputValue.toLowerCase().includes("관리자") || inputValue.toLowerCase().includes("운영자")) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: `금칙어가 포함되어 있습니다.`,
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
                            title: `이미 사용중인 닉네임입니다.`,
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
                            title: `사용 가능한 닉네임입니다!`,
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
                title: `닉네임은 2~8자의 영문, 숫자, 한글만 사용 가능합니다.`,
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
            title: `원래 사용하던 닉네임입니다.`,
            html: `<strong>그대로 두셔도 무방합니다!</strong>`,
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
            title: '저장하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(160, 0, 0)',
            cancelButtonColor: '#2a2b38',
            confirmButtonText: '저장',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/proConEdit', {
                    nickname: proConNicknameEditInput.value,
                    emailView: proConEmailViewCheck[0].firstElementChild.classList.contains("fa-eye-slash") ? 0 : 1
                })
                    .then(function (response) {
                        if (response.data.result == true) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `저장되었습니다!`,
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
                                title: `저장에 실패했습니다.`,
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
        })
    } else {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `닉네임 사용 가능여부를 확인해주세요.`,
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
            errorMsg += 'JPG, JPEG, PNG, GIF, WEBP 파일만 업로드 가능합니다.<br>';
        } // 선택된 파일이 10mb를 초과하는지 확인
        if (profileImgInput.files[0].size > 10 * 1024 * 1024) {
            errorMsg += '10Mb 이하의 파일만 업로드 가능합니다.<br>';
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
                    html: `<strong>업로드 성공!</strong>`,
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
                    html: `<strong>업로드 실패!</strong>`,
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
                    title: `알수없는 오류가 발생했습니다!`,
                    html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`,
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
                title: `삭제 성공!`,
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
                title: `삭제 실패!`,
                html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`,
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
                title: `알수없는 오류가 발생했습니다!`,
                html: `<strong>이슈 : https://github.com/DavidHuxley</strong>`,
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
