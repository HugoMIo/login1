const changeatribute = document.getElementById('changeatribute');
const senha = document.getElementById('senha');

changeatribute.onclick = function () {
    senha.type = senha.type === 'password' ? 'text' : 'password';
    changeatribute.classList.toggle('bxs-lock-alt');
    changeatribute.classList.toggle('bxs-lock-open');
};