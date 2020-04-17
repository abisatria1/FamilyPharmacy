function isiUser () {
    const raw = sessionStorage.getItem('user')
    const user = JSON.parse(raw)
    $('.nama span').text(user.namaUser)
}

$(document).ready(function() {
    isiUser()
})