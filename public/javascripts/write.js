// 이미지 파일 업로드
// 1. 확장자 검사
// 2. 파일 사이즈 검사
// 3. 파일 업로드 비동기 처리
// 4. 업로드 성공 시, 이미지 미리보기
// > 응답에 따른 알림창 띄우기

const cardImg = document.getElementById("cardImg");
let filename = null;
cardImg.addEventListener("change", function () {
    let errorMsg = "";
    const frontImg = document.getElementById("frontImg");
    // 선택된 파일이 PNG, JPG, JPEG, GIF, WEBP 확장자를 가졌는지 확인
    const ext = cardImg.value.slice(cardImg.value.lastIndexOf(".") + 1).toLowerCase();
    if (ext !== "jpg" && ext !== "jpeg" && ext !== "png" && ext !== "gif" && ext !== "webp") {
        frontImg.style.boxShadow = "0 0 5px rgba(255, 0, 0, .8), inset 0 0 3px rgb(255, 0, 0, .5)";
        errorMsg += 'JPG, JPEG, PNG, GIF, WEBP 파일만 업로드 가능합니다.<br>';
    } // 선택된 파일이 10mb를 초과하는지 확인
    if (cardImg.files[0].size > 10 * 1024 * 1024) {
        frontImg.style.boxShadow = "0 0 5px rgba(255, 0, 0, .8), inset 0 0 3px rgb(255, 0, 0, .5)";
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
            const imageUrl = response.data.imageUrl;

            let backgruondUrl = `url(${imageUrl})`;
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
                },
                didClose: () => {
                    cardImgUpload.style.backgroundImage = backgruondUrl;
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
});

// 리셋 버튼으로 입력값 초기화
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", function () {
    const cardImgUpload = document.getElementById("cardImgUpload");
    const frontTitle = document.getElementById('frontTitle');
    const backContentText = document.getElementById('backContentText');
    cardImgUpload.style.backgroundImage = '';
    frontTitle.value = '';
    backContentText.value = '';
});

// 취소 버튼으로 메인 페이지로 이동
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", function () {
    window.location.href = "/";
});



// 카드 전면부 텍스트 글자수 120자 제한 및 90자 알람
const frontTitle = document.getElementById('frontTitle');
frontTitle.addEventListener('keyup', function () {
    const text = this.value;
    const len = text.length;
    if (len > 90) {
        this.value = text.slice(0, 120);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'warning',
            title: '이 이상은 리스트에서 봤을 때 생략될 가능성이 높습니다!'
        })
    }
});

// 카드 후면부 텍스트 400자 글자수 알람 및 1000자 제한
const backContentText = document.getElementById('backContentText');
let isAlerted = false;
backContentText.addEventListener('keyup', function () {
    const text = this.value;
    const len = text.length;
    if (len > 400 && !isAlerted) {
        this.value = text.slice(0, 1000);
        isAlerted = true;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'warning',
            title: '이 이상은 리스트에서 봤을 때 생략될 가능성이 높습니다!'
        })
    } else if (len <= 400) {
        isAlerted = false;
    }
});

// axios /newpost post 요청 보내기
const postBtn = document.getElementById("postBtn");
postBtn.addEventListener("click", function () {
    const frontTitle = document.getElementById("frontTitle").value;  // 120자 제한
    const backContentText = document.getElementById("backContentText").value;   // 1000자 제한
    const cardImgUpload = document.getElementById("cardImgUpload").style.backgroundImage;   // url(" , ") 포함
    // 샘플이미지 배열 생성 및 랜덤 인덱스 생성으로 랜덤 요소 선택하게 해줌
    const randomSample = [];
    for (let i = 0; i < 12; i++) {
        randomSample.push(`${i}.png`);
    }
    const randomIndex = Math.floor(Math.random() * randomSample.length); 
    const randomImage = randomSample[randomIndex]; 
    // url(" , ") 제거 및 삼항연산자 이용해서 이미지가 없을 경우 샘플 이미지(랜덤)으로 설정
    const cardImgUrl = cardImgUpload ? cardImgUpload.slice(5, cardImgUpload.length - 2) : `/public/image/sample/${randomImage}`;

    const data = {
        frontTitle: frontTitle,
        backContentText: backContentText,
        cardImgUrl: cardImgUrl
    };

    axios.post("/newpost", data)
        .then(function (response) {
            if (response.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    html: `<strong>게시글 작성 성공!</strong>`,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 2000,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    },
                    didClose: () => {
                        window.location.href = "/";
                    }
                });
            }
        }).catch(function (error) {
            if (error.response.status === 400) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    html: `<strong>게시글 작성 실패!</strong>`,
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
        });
});