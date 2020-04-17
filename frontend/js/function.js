const isiNavbar = statusUser => {
    let navbar = ""
    
    if (statusUser == "0") {
        navbar = 
        `
            <a class="nav-item nav-link" href="home.html" id ="active">Beranda</a>
            <a class="nav-item nav-link" href="order.html">Order</a>
            <a class="nav-item nav-link" href="Tampilan_obat.html">Obat</a>
            <a class="nav-item nav-link" href="#">Akun Saya</a>
            <a class="nav-item nav-link" href="login.html">Log Out</a>
        `   
    }else if (statusUser =="1") {
        navbar = 
        `
        <a class="nav-item nav-link" href="home.html" id ="active">Beranda</a>
        <a class="nav-item nav-link" href="#">Pegawai</a>
        <a class="nav-item nav-link" href="order.html">Order</a>
        <a class="nav-item nav-link" href="Tampilan_obat.html">Obat</a>
        <a class="nav-item nav-link" href="#">Akun Saya</a>
        <a class="nav-item nav-link" href="login.html">Log Out</a>
        `
    }
    $('.navbar-nav').append(navbar)
}

// fungsi yang mengembalikan ke halaman login jika belum melakukan login
const cekLogin = () => {
    const token = sessionStorage.getItem('token');
    if (!token) window.location = "login.html";
}

// fungsi yang mengembalikan halaman ke sebelumnya jika user tidak sesuai
const cekUser = (statusUser,statusValid) => {
    if (statusUser!=statusValid) {
        window.location = "notAllowed.html";
    }
}

const getUserFromSession = () => {
    const raw = sessionStorage.getItem('user');
    const user = JSON.parse(raw);
    return user;
}