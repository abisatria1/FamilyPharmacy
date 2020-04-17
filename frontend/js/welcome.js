
const cekLogin = () => {
    const token = sessionStorage.getItem('token');
    if (!token) window.location = "login.html";
}

const isiUser = () => {
    const raw = sessionStorage.getItem('user');
    const user = JSON.parse(raw);
    let text = ``;
    let navbar = ``;
    if (user.statusUser == "0" ){
        // ini pegawai
        text = "Pegawai yang hebat, mulailah hari dengan penuh semangat dan jangan lupa untuk istirahat dan jaga kesehatan dengan baik. SEMANGAT";
        navbar = 
        `
            <a class="nav-item nav-link" href="#" id ="active">Beranda</a>
            <a class="nav-item nav-link" href="#">Order</a>
            <a class="nav-item nav-link" href="#">Obat</a>
            <a class="nav-item nav-link" href="#">Akun Saya</a>
            <a class="nav-item nav-link" href="login.html">Log Out</a>
        `
    }else if (user.statusUser == "1") {
        // ini pemilik
        text = "Pemilik perusahaan yang tercinta. Hari ini sangat istimewa karena penjualan sedang baik";
        navbar = 
        `
            <a class="nav-item nav-link" href="#" id ="active">Beranda</a>
            <a class="nav-item nav-link" href="#">Pegawai</a>
            <a class="nav-item nav-link" href="#">Order</a>
            <a class="nav-item nav-link" href="#">Obat</a>
            <a class="nav-item nav-link" href="#">Akun Saya</a>
            <a class="nav-item nav-link" href="login.html">Log Out</a>
        `
    }
    $('.nama span').text(user.namaUser);
    $('.paragraf p').text(text);
    $('.navbar-nav').append(navbar)
}

$(document).ready(function() {
    cekLogin()
    isiUser()
})