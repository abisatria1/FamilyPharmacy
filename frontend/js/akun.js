$(document).ready(function () {
    $('#passwordModal').iziModal({
        title: 'Ubah Password',
        subtitle: 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
        headerColor: '#434055',
        closeButton: true,
        width: 600
    })
    cekLogin()
    fillData()
    $('#message').hide()
    $('#modalMessage').hide()
    isiNavbar(getUserFromSession().statusUser)
    $(`a[href="home.html"]`).attr('id', '');
    $(`a[href="akun.html"]`).attr('id', 'active');

    $('body').on('submit', '#updateProfileForm', function (e) {
        e.preventDefault()
        updateProfile()
    })

    $('body').on('submit', '#updateAccountForm', function (e) {
        e.preventDefault()
        updateAccount()
    })

    $('#passwordModal form').submit(async function (e) {
        e.preventDefault()
        await updatePassword()

    })
})


const fillData = async () => {
    $('.card-header .col-sm').empty()
    const user = getUserFromSession()
    const jadwalUser = await requestJadwalPegawai(user.id, sessionStorage.getItem('token'))
    // append title
    let status = user.statusUser == 1 ? 'Pemilik' : 'Pegawai'
    $('.card-header .col-sm').append(
        `
        <div class="desc">
            <h2>${user.namaUser}</h2>
            <p><span>${user.emailUser}</span> - ${status}</p>
        </div>
        `
    )
    // fill form
    $('#userId').val(user.id)
    $('#namaUser').val(user.namaUser)
    $('#umurUser').val(user.umurUser)
    $('#alamatUser').val(user.alamatUser)
    $('#notelpUser').val(user.notelpUser)
    $('#emailUser').val(user.emailUser)
    $('#username').val(user.username)
    $.each(jadwalUser.data.data, function (i, item) {
        let string =
            `
            <tr id="row${item.id}">
            <form action=""> 
                <td class="text-center hari">${item.hari}</td>
                <td class="text-center jamMasuk">${item.jamMasuk}</td>
                <td class="text-center jamKeluar">${item.jamKeluar}</td>
            </form>
            </tr>
            `
        $('tbody').append(string)
    })

}

const updateProfile = async () => {
    const data = {
        namaUser: $('#namaUser').val(),
        umurUser: $('#umurUser').val(),
        alamatUser: $('#alamatUser').val(),
        notelpUser: $('#notelpUser').val(),
    }
    try {
        const response = await requestUpdateProfile(data, sessionStorage.getItem('token'))
        message('#message', response.data.message, true)
        sessionStorage.setItem('user', JSON.stringify(response.data.data))
        fillData()
    } catch (err) {
        console.log(err)
        message('#message', err.response.data.message, false)
    }
}

const updateAccount = async () => {
    const data = {
        username: $('#username').val(),
        emailUser: $('#emailUser').val()
    }
    try {
        const response = await requestUpdateAccount(data, sessionStorage.getItem('token'))
        message('#message', response.data.message, true)
        sessionStorage.setItem('user', JSON.stringify(response.data.data))
        fillData()
    } catch (err) {
        console.log(err)
        message('#message', err.response.data.message, false)
    }
}

const updatePassword = async () => {
    const data = {
        password: $('#password').val(),
        newPassword: $('#newPassword').val(),
        rePassword: $('#rePassword').val(),
    }
    try {
        const response = await requestUpdatePassword(data, sessionStorage.getItem('token'))
        $('.btn-danger').click()
        $('#passwordModal form input').val('')
        message('#message', response.data.message, true)
    } catch (err) {
        console.log(err);
        message('#modalMessage', err.response.data.message, false)
    }
}

const message = (element, message, status) => {
    $(element).removeClass('alert alert-success')
    $(element).removeClass('alert alert-danger')
    if (status === false) {
        $(element).addClass('alert alert-danger')
    } else if (status === true) {
        $(element).addClass('alert alert-success')
    }
    $(element).find('p').text(message)
    $(element).slideDown(function () {
        setTimeout(function () {
            $(element).slideUp();
        }, 5000);
    });
}

const requestUpdateProfile = (data, token) => {
    return axios({
        url: baseUrl + '/users/profile',
        method: 'PATCH',
        headers: {
            'Authorization': token
        },
        data: data
    })
}

const requestUpdateAccount = (data, token) => {
    return axios({
        url: baseUrl + '/users/account',
        method: 'PATCH',
        headers: {
            'Authorization': token
        },
        data: data
    })
}

const requestUpdatePassword = (data, token) => {
    return axios({
        url: baseUrl + '/users/password',
        method: 'PATCH',
        headers: {
            'Authorization': token
        },
        data: data
    })
}

const requestJadwalPegawai = (id, token) => {
    return axios({
        url: 'http://localhost:3001/schedules/' + id,
        method: 'get',
        headers: {
            'Authorization': token
        },
        data: {
            userId: id
        }
    })
}