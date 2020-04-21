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
        <li class="nav-item dropdown ">
            <a class="nav-link dropdown-toggle" href="tampilan_pegawai.html" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Pegawai
            </a>
            <div class="dropdown-menu rounded" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="tampilan_pegawai.html"><p class="text-dark">Lihat Pegawai</p></a>
            <a class="dropdown-item" href="jadwal_pegawai.html"><p class="text-dark">Jadwal Pegawai</p></a>
        </div>
       </li>

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

const getUserFromRequest = async token => {
    try {
        const response = await axios({
            url: 'http://localhost:3001/users/profile',
            method: 'get',
            headers: {
                'Authorization': token
            }
        })
        return response.data.data
    } catch (err) {
        console.log(err.response)
        alert('asd')
    }
    
}

const cekMessage = () => {
    let raw = sessionStorage.getItem('message');
    let message = JSON.parse(raw);
    console.log(message)
    if (message) {
        if (message.condition === false) {
            $('#message').removeClass('alert alert-success')
            $('#message').removeClass('alert alert-danger')
            $('#message').addClass('alert alert-danger')
        }else if (message.condition === true) {
            $('#message').removeClass('alert alert-success')
            $('#message').removeClass('alert alert-danger')
            $('#message').addClass('alert alert-success')
        }
        $('#message p').text(message.message)
        $('#message').slideDown(function() {
            setTimeout(function() {
                $('#message').slideUp();
            }, 5000);
        });
        sessionStorage.removeItem('message');
    }
}

const flashMessage =  (message,condition) => {
    let flash  = {message,condition}
    sessionStorage.setItem('message', JSON.stringify(flash));
}
