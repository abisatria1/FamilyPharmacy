$(document).ready(async function () {
    cekLogin();
    const token = sessionStorage.getItem('token');
    $("form").submit(function (e) {
        e.preventDefault();
        const data = {
            namaUser: $("#inputPegawai").val(),
            umurUser: $("#inputUmur").val(),
            alamatUser: $("#inputAlamat").val(),
            notelpUser: $("#inputTelepon").val(),
            emailUser: $("#inputEmail").val(),
            username: $("#inputUsername").val(),
            password: $("#inputPassword").val(),
            statusUser: "0"
        }
        axios.post('http://localhost:3001/users', {
                data: data,
                headers: {
                    'Authorization': token
                }
            }).then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    })
    isiNavbar(getUserFromSession().statusUser);
    $(`a[href="home.html"]`).attr('id', '');
    $(`a[href="tampilan_pegawai.html"]`).attr('id', 'active');

})