const main = document.getElementById('mainNav');
const write = document.getElementById('writeNav');
const desk = document.getElementById('deskNav');
const logout = document.getElementById('logoutNav');

main.addEventListener('click', () => {
    axios.get('/main')
        .then(res => {
            if (res.status === 200) {
                location.href = '/main';
            }
        })
        .catch(err => {
            console.log(err);
        })
});

write.addEventListener('click', () => {
    location.href = '/write';
});

logout.addEventListener('click', () => {
    axios.get('/logout')
        .then(res => {
            if (res.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: `logout success!`,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    timer: 2500,
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
        .catch(err => {
            console.log(err);
        })
})

// desk를 누르면 로그인 유저의 nickname으로 이동하는 
desk.addEventListener('click', () => {
    axios.get('/personal')
        .then(res => {
            if (res.status === 200) {
                location.href = `/@${res.data.nickname}`;
            }
        })
        .catch(err => {
            console.log(err);
        })
})
