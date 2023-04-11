const toBeDevelopedLinks = document.querySelectorAll('.toBeDeveloped');

toBeDevelopedLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    alert('추후 추가 예정입니다!');
  });
});