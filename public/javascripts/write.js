const { DateTime } = luxon;
// 이미지 파일 업로드
// 1. 확장자 검사
// 2. 파일 사이즈 검사
// 3. 파일 업로드 비동기 처리
// 4. 업로드 성공 시, 이미지 미리보기
// > 응답에 따른 알림창 띄우기

const cardImg = document.getElementById("cardImg");
let filename = null;
cardImg.addEventListener("change", function () {
    // 파일을 선택했을 경우에만 아래 코드 실행
    if (cardImg.value) {

        let errorMsg = "";
        const frontImg = document.getElementById("frontImg");

        // 선택된 파일이 PNG, JPG, JPEG, GIF, WEBP 확장자를 가졌는지 확인
        const ext = cardImg.value.slice(cardImg.value.lastIndexOf(".") + 1).toLowerCase();
        if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif" && ext !== "webp") {
            frontImg.style.boxShadow = "0 0 5px rgba(255, 0, 0, .8), inset 0 0 3px rgb(255, 0, 0, .5)";
            errorMsg += 'Only JPG, JPEG, PNG, GIF, and WEBP files can be uploaded.<br>';
        } // 선택된 파일이 10mb를 초과하는지 확인
        if (cardImg.files[0].size > 10 * 1024 * 1024) {
            frontImg.style.boxShadow = "0 0 5px rgba(255, 0, 0, .8), inset 0 0 3px rgb(255, 0, 0, .5)";
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
                },
                didClose: () => {
                    setTimeout(() => {
                        frontImg.style.boxShadow = "";
                    }, 1500);
                }
            });
            cardImg.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("cardImg", cardImg.files[0]);

        axios.post("/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function (response) {
            if (response.status === 200) {
                const cardImgUpload = document.getElementById("cardImgUpload");
                const imgSpan = document.querySelectorAll(".imgSpan");
                const imageUrl = response.data.imageUrl;

                let backgruondUrl = `url(${imageUrl})`;
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
                    },
                    didClose: () => {
                        cardImgUpload.style.backgroundImage = backgruondUrl;
                        cardImgUpload.style.backgroundColor = `rgba(236, 236, 236, 0)`;
                        imgSpan.forEach((span) => {
                            span.style.display = "none";
                        });
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

// 리셋 버튼으로 입력값 초기화
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
    const cardImgUpload = document.getElementById("cardImgUpload");
    const frontTitle = document.getElementById('frontTitle');
    const backContentText = document.getElementById('backContentText');
    const imgSpan = document.querySelectorAll(".imgSpan");

    isAlerted = false;
    isAlerted2 = false;
    frontImg.style.boxShadow = "";
    cardImgUpload.style.backgroundImage = '';
    cardImgUpload.style.backgroundColor = `rgba(236, 236, 236, .1)`;
    frontTitle.value = '';
    backContentText.value = '';
    imgSpan.forEach((span) => {
        span.style.display = "block";
    }
    );
});

// 취소 버튼으로 메인 페이지로 이동
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", function () {
    window.location.href = "/";
});



// 카드 전면부 텍스트 글자수 250자 제한 및 90자 알람
const frontTitle = document.getElementById('frontTitle');
let isAlerted = false;
frontTitle.addEventListener('keyup', function () {
    const text = this.value;
    const len = text.length;
    this.value = text.slice(0, 250);
    if (len > 90 && !isAlerted) {
        isAlerted = true;
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
            icon: 'warning',
            title: 'If additional content is written, there is a higher likelihood of it being omitted in the list view!'
        })
    }
    if (len > 250) {
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
            icon: 'warning',
            title: 'Maximum character count is 250 bytes!'
        })
    }
});

// 카드 후면부 텍스트 400자 글자수 알람 및 2000자 제한
const backContentText = document.getElementById('backContentText');
let isAlerted2 = false;
backContentText.addEventListener('keyup', function () {
    const text = this.value;
    const len = text.length;
    this.value = text.slice(0, 2000);
    if (len > 400 && !isAlerted2) {
        isAlerted2 = true;
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
            icon: 'warning',
            title: 'If additional content is written, there is a higher likelihood of it being omitted in the list view!'
        })
    }
    if (len > 2000) {
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
            icon: 'warning',
            title: 'Maximum character count is 2000 bytes!'
        })
    }
});

// axios /newpost post 요청 보내기
const postBtn = document.getElementById("postBtn");
postBtn.addEventListener("click", function () {
    const frontTitle = document.getElementById("frontTitle").value;  // 250자 제한
    const backContentText = document.getElementById("backContentText").value;   // 2000자 제한
    const cardImgUpload = document.getElementById("cardImgUpload").style.backgroundImage;   // url(" , ") 포함
    // 샘플이미지 배열 생성 및 랜덤 인덱스 생성으로 랜덤 요소 선택하게 해줌
    const randomSample = [];
    for (let i = 0; i < 11; i++) {
        randomSample.push(`${i}.png`);
    }
    const randomIndex = Math.floor(Math.random() * randomSample.length);
    const randomImage = randomSample[randomIndex];
    // url(" , ") 제거 및 삼항연산자 이용해서 이미지가 없을 경우 샘플 이미지(랜덤)으로 설정
    const cardImgUrl = cardImgUpload ? cardImgUpload.slice(5, cardImgUpload.length - 2) : `/assets/sampleImg/${randomImage}`;

    const data = {
        frontTitle: frontTitle,
        backContentText: backContentText,
        cardImgUrl: cardImgUrl
    };
    if (!frontTitle) { // frontTitle이 없을 경우 알림창

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `The front part of the postcard cannot be blank.`,
            showCancelButton: false,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        })
    } else {
        // 작성 전 알림창
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `Are you sure you want to write that?`,
            text: `Once you write it, you can't change it.`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'rgb(160, 0, 0)',
            cancelButtonColor: '#2a2b38',
            confirmButtonText: 'Write',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.post("/newpost", data)
                    .then(function (response) {
                        if (response.status === 200) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                html: `<strong>Successfully created a postcard!</strong>`,
                                showConfirmButton: false,
                                timerProgressBar: true,
                                timer: 2000,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                },
                                didClose: () => {
                                    location.href = "/main";
                                }
                            });
                        }
                    }).catch(function (error) {
                        if (error.response.status === 400) {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                html: `<strong>Failed to create postcard!</strong>`,
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
                    });
            }
        });
    }
});

// 현재 시간 표시
const writeTime = document.getElementById('writeTime');
function updateTime() {
    const currentTime = DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss');
    writeTime.innerText = currentTime;
}
setInterval(updateTime, 1000);
