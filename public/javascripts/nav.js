const main = document.getElementById('main');
const write = document.getElementById('write');
const desk = document.getElementById('desk');
const logout = document.getElementById('logout');

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
                    title: `로그아웃 성공!`,
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