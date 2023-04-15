
const logout = document.getElementById('logout');
logout.addEventListener('click', () => {
    console.log('logout');
    axios.get('/logout')
    .then (res => {
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
                    location.href= '/';
                }
            })
        }
    })
    .catch (err => {
        console.log(err);
    })
})
