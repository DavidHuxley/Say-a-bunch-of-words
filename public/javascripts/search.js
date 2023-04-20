function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');
        if(!container.hasClass('active')){
            container.addClass('active');
            evt.preventDefault();
        }
        else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
            container.removeClass('active');
            // clear input
            container.find('.search-input').val('');
        } 
}


const searchBtn = document.querySelector('.search-icon');
const searchInput = document.querySelector('.search-input');

searchBtn.addEventListener('click', async function () {
    search();
});

searchInput.addEventListener('keyup', async function (event) {
    if (event.key === 'Enter') {
        search();
    }
});

async function search() {
    const container = $(searchBtn).closest('.search-wrapper');
    const searchValue = searchInput.value;
    if (container.hasClass('active') && searchValue !== '') {
        try {
            await axios.get('/search', {
                params: { value: searchValue }
            });
            location.href = `/Search?value=${searchValue}`;
        } catch (error) {
            console.log(error);
        }
    }
}