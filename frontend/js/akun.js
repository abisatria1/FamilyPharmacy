$(document).ready(function() {
    $('#passwordModal').iziModal({
        title : 'Ubah Password',
        subtitle : 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
        headerColor : '#434055',
        closeButton : true,
        width : 600
    })
    cekLogin()
    fillData()
    fillSchedule()
    $('#message').hide()
    $('#modalMessage').hide()
    isiNavbar(getUserFromSession().statusUser)
    $(`a[href="home.html"]`).attr('id','');
    $(`a[href="akun.html"]`).attr('id','active');

    $('body').on('submit', '#updateProfileForm' , function(e) {
        e.preventDefault()
        updateProfile()
    })

    $('body').on('submit', '#updateAccountForm' , function(e) {
        e.preventDefault()
        updateAccount()
    })
    
    $('#passwordModal form').submit(async function(e) {
        e.preventDefault()
        await updatePassword()
        
    })
})


const fillData = () => {
    $('.card-header .col-sm').empty()
    const user = getUserFromSession()
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
}

const updateProfile = async () => {
    const data = {
        namaUser : $('#namaUser').val(),
        umurUser : $('#umurUser').val(),
        alamatUser : $('#alamatUser').val(),
        notelpUser : $('#notelpUser').val(),
    }
    try {
        const response = await requestUpdateProfile(data,sessionStorage.getItem('token'))
        message('#message',response.data.message,true)
        sessionStorage.setItem('user',JSON.stringify(response.data.data))
        fillData()
    } catch (err) {
        console.log(err)
        message('#message',err.response.data.message,false)
    }
}

const updateAccount = async () => {
    const data = {
        username : $('#username').val(),
        emailUser : $('#emailUser').val()
    }
    try {
        const response = await requestUpdateAccount(data,sessionStorage.getItem('token'))
        message('#message',response.data.message,true)
        sessionStorage.setItem('user',JSON.stringify(response.data.data))
        fillData()
    } catch (err) {
        console.log(err)
        message('#message',err.response.data.message,false)
    }
}

const updatePassword = async () => {
    const data = {
        password : $('#password').val(),
        newPassword : $('#newPassword').val(),
        rePassword : $('#rePassword').val(),
    }
    try {
        const response = await requestUpdatePassword(data,sessionStorage.getItem('token'))
        $('.btn-danger').click()
        $('#passwordModal form input').val('')
        message('#message',response.data.message,true)
    } catch (err) {
        console.log(err);
        message('#modalMessage',err.response.data.message,false)
    }
}

const message = (element,message,status) => {
    $(element).removeClass('alert alert-success')
    $(element).removeClass('alert alert-danger')
    if (status === false) {
        $(element).addClass('alert alert-danger')
    }else if (status === true) {
        $(element).addClass('alert alert-success')
    }
    $(element).find('p').text(message)
    $(element).slideDown(function() {
        setTimeout(function() {
            $(element).slideUp();
        }, 5000);
    });
}

const sortHari = (jadwal) => {
    let arr = jadwal.map(item => {
        switch (item.hari) {
            case 'Senin':
                obj = {
                    data : item,
                    key : 0
                }
                break
            case 'Selasa':
                obj = {
                    data : item,
                    key : 1
                }
                break
            case 'Rabu':
                obj = {
                    data : item,
                    key : 2
                }
                break
            case 'Kamis':
                obj = {
                    data : item,
                    key : 3
                }
                break
            case 'Jumat':
                obj = {
                    data : item,
                    key : 4
                }
                break
            case 'Sabtu':
                obj = {
                    data : item,
                    key : 5
                }
                break
            case 'Minggu':
                obj = {
                    data : item,
                    key : 6
                }
                break
            default:
                break
        }
        return obj
    })
    arr.sort((x,y) => {
        if (x.key < y.key) {
            return -1;
        }
        if (x.key > y.key) {
            return 1;
        }
        return 0;
    })
    return arr
}

const fillSchedule = async () => {
    const schedule = await requestGetSchedule(sessionStorage.getItem('token'))
    let item = schedule.data.data
    item = sortHari(item)
    if (item.length !== 0) {
        item.map(({data}) => {
            $('.schedules').append(
                `
                <div class="card" style="width: 18rem;">
                <div class="card-body">
                <h5 class="card-title">${data.hari}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Jam Masuk : ${data.jamMasuk} - ${data.jamKeluar}</h6>
                </div>
                </div>
                `
            )
        })
        
    }else {
        $('.schedules').append(
            `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                <h5 class="card-title">Tidak ada jadwal</h5>
                </div>
            </div>
            `
        )
    }
}

const requestUpdateProfile = (data,token) => {
    return axios({
        url : baseUrl + '/users/profile',
        method : 'PATCH',
        headers : {'Authorization' : token},
        data : data
    })
}

const requestUpdateAccount = (data,token) => {
    return axios({
        url : baseUrl + '/users/account',
        method : 'PATCH',
        headers : {'Authorization' : token},
        data : data
    })
}

const requestUpdatePassword = (data,token) => {
    return axios({
        url : baseUrl + '/users/password',
        method : 'PATCH',
        headers : {'Authorization' : token},
        data : data
    })
}

const requestGetSchedule = (token) => {
    return axios({
        url : baseUrl + '/schedules/getSchedule',
        method : 'GET',
        headers : {'Authorization' : token}
    })
}

