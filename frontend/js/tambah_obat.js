$(document).ready(async function (e) {
    cekLogin();
    isiNavbar(getUserFromSession().statusUser);
    $(`a[href="home.html"]`).attr('id', '');
    $(`a[href="Tampilan_obat.html"]`).attr('id', 'active');

})