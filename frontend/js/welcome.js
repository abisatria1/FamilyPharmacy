const isiUser = () => {
    const raw = sessionStorage.getItem('user');
    const user = JSON.parse(raw);
    let text = ``;
    if (user.statusUser == "0" ){
        // ini pegawai
        text = "Pegawai yang hebat, mulailah hari dengan penuh semangat dan jangan lupa untuk istirahat dan jaga kesehatan dengan baik. SEMANGAT";
    }else if (user.statusUser == "1") {
        // ini pemilik
        text = "Pemilik perusahaan yang tercinta. Hari ini sangat istimewa karena penjualan sedang baik";
    }
    $('.nama span').text(user.namaUser);
    $('.paragraf p').text(text);
    isiNavbar(user.statusUser);
}

$(document).ready(function() {
    cekLogin()
    isiUser()
})