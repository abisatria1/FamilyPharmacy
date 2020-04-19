const isiDataPegawai = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const result = await requestDataPegawai(token);
        $(result.data.data).each(function (i, item) {
            let status = ""
            if (item.statusUser == "0") {
                status = 'Pegawai'
            }else {
                status = 'Pemilik'
            }
            let string =
            `
            <tr id="row${item.id}">
            <form action="">
                <td class="text-center">${i+1}</td>
                <td class="text-left namaUser">${item.namaUser}</td>
                <td class="text-center umurUser">${item.umurUser}</td>
                <td class="text-center notelpUser">${item.notelpUser}</td>
                <td class="text-center alamatUser">${item.alamatUser}</td>
                <td class="text-center emailUser">${item.emailUser}</td>
                <td class="text-center username">${item.username}</td>
                <td class="text-center statusUser">${status}</td>
                <td class="text-center">
                    <a href="#" data-id ="${item.id}" class="resetBtn btn badge-primary float-center btn-sm">Reset</a>
                    <a href="" data-id ="${item.id}" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm">Edit</a>
                    <a href="#" data-id ="${item.id}" class="deleteBtn btn badge-danger float-center btn-sm">Hapus</a>
                </td>
            </form>
            </tr>
            `
            $('tbody').append(string)
        })
    } catch (err) {
        if (err.response === 401) {
            return window.location = 'notAllowed.html';
        }
    }
}


const editData = id => {
    const namaUser = $(`#row${id} > .namaUser`).text();
    const umurUser = $(`#row${id} > .umurUser`).text();
    const alamatUser = $(`#row${id} > .alamatUser`).text();
    const notelpUser = $(`#row${id} > .notelpUser`).text();
    const emailUser = $(`#row${id} > .emailUser`).text();
    const username = $(`#row${id} > .username`).text();
    const statusUser = $(`#row${id} > .statusUser`).text();
    if (statusUser === 'Pegawai') {
        status = `
        <select class="custom-select form-control " id="editStatus" required autocomplete="off">
            <option value="0" selected>pegawai</option>
            <option value="1">pemilik</option>
        </select>
        `
    }else {
        status = `
        <select class="custom-select form-control" id="editStatus" required autocomplete="off">
            <option value="0">pegawai </option>
            <option value="1" selected>pemilik </option>
        </select>
        `
    }
    let string =
        `
        <div class="form-group">
            <p>Nama Pegawai</p>
            <input type="text" class="form-control" placeholder="Nama Pegawai" id="editNama" value="${namaUser}" required>
        </div>
        <div class="form-group">
            <p>Umur Pegawai</p>
            <input type="number" class="form-control" placeholder="Umur Pegawai" id="editUmur" value="${umurUser}" required >
        </div>
        <div class="form-group">
            <p>No Telpon Pegawai</p>
            <input type="text" class="form-control" placeholder="No Telp Pegawai" id="editNotelp" value="${notelpUser}" required>
        </div>
        <div class="form-group">
            <p>Alamat User</p>
            <input type="text" class="form-control" placeholder="No Telp Pegawai" id="editAlamat" value="${alamatUser}" required>
        </div>
        <div class="form-group">
            <p>Email Pegawai</p>
            <input type="email" class="form-control" placeholder="Email Pegawai" id="editEmail" value="${emailUser}" required>
        </div>
        <div class="form-group">
            <p>Username</p>
            <input type="text" class="form-control" placeholder="username" id="editUsername" value="${username}" required>
        </div>
        <div class="form-group">
            <p>Status User</p>
            ${status}
        </div>
        <div class="errorMessage alert alert-danger">
            <h5></h5>
        </div>
        <div class="button">
            <input type="submit" data-id="${id}" class="customBtn successBtn">
            <button class="customBtn btn-danger" data-izimodal-close="#modal">Cancel</button>
        </div>
    `;
    $('#modal form').append(string);
    $('#modal .errorMessage').hide()
    // izimodal
    $('#modal').iziModal({
        title: 'Edit Pegawai',
        subtitle: 'Diharapkan mengisi data dengan sesuai dan bertanggung jawab',
        headerColor: '#434055',
        closeButton: true,
        width: 700,
        onClosed: function () {
            $('#modal form').empty();
        }
    });
}

const insertPegawai = async () => {
    const data = {
        namaUser : $('#namaUser').val(),
        notelpUser : $('#notelpUser').val(),
        umurUser : $('#umurUser').val(),
        emailUser : $('#emailUser').val(),
        statusUser : $('#statusUser').val(),
        username : $('#username').val(),
        password : $('#password').val(),
        alamatUser : $('#alamatUser').val(),
    }
    try {
        const response = await requestInsertPegawai(sessionStorage.getItem('token'),data)
        flashMessage(response.data.message,true)
        $('#tambahPegawaiCancel').click()
        window.location = 'tampilan_pegawai.html'
    } catch (err) {
        $('.errorMessage p').text(err.response.data.message);
        $('.errorMessage').slideDown(function() {
            setTimeout(function() {
                $('.errorMessage').slideUp();
            }, 5000);
        });
    }
}

const hapusPegawai = async (id) => {
    try {
        const response = await requestDeletePegawai(sessionStorage.getItem('token'),id)
        flashMessage(response.data.message,true)
        window.location = 'tampilan_pegawai.html'
    } catch (err) {
        console.log(err)
        flashMessage(err.response.data.message,false)
    }
}

const resetPassword = async (id) => {
    try {
        const response = await requestResetPassword(sessionStorage.getItem('token'),id)
        flashMessage(response.data.message,true)
        window.location = 'tampilan_pegawai.html'
    } catch (err) {
        console.log(err)
        flashMessage(err.response.data.message,false)
    }
}

const updatePegawai = async (id) => {
    const data = {
        namaUser : $('#editNama').val(),
        umurUser : $('#editUmur').val(),
        notelpUser : $('#editNotelp').val(),
        alamatUser : $('#editAlamat').val(),
        emailUser : $('#editEmail').val(),
        username : $('#editUsername').val(),
        statusUser : $('#editStatus').val(),
    }
    try {
        const response = await requestUpdatePegawai(sessionStorage.getItem('token'),id,data)
        flashMessage(response.data.message,true)
        $('#modal .btn-danger').click()
        window.location = 'tampilan_pegawai.html'
    } catch (err) {
        console.log(err.response)
        $('#modal .errorMessage h5').text(err.response.data.message);
        $('#modal .errorMessage').slideDown(function() {
            setTimeout(function() {
                $('.errorMessage').slideUp();
            }, 5000);
        });
    }
}


const requestDataPegawai = token => {
    return axios({
        url: 'http://localhost:3001/users/',
        method: 'get',
        headers: {
            'Authorization': token
        }
    })
}

const requestInsertPegawai = (token,data) => {
    return axios({
        url : 'http://localhost:3001/users/',
        method : 'post',
        headers : {
            'Authorization': token
        },
        data : data
    })
}

const requestDeletePegawai = (token,id) => {
    return axios({
        url : 'http://localhost:3001/users/delete/' + id,
        method : 'DELETE',
        headers : {
            'Authorization': token
        }
    })
}

const requestResetPassword = (token,id) => {
    return axios({
        url : 'http://localhost:3001/users/reset/' + id,
        method : 'PATCH',
        headers : {
            'Authorization': token
        }
    })
}

const requestUpdatePegawai = (token,id,data) => {
    return axios({
        url : 'http://localhost:3001/users/update/' + id,
        method : 'PATCH',
        headers : {
            'Authorization': token
        },
        data : data
    })
}

$(document).ready(async function (e) {
    $('.errorMessage').hide()
    cekLogin();
    cekUser(getUserFromSession().statusUser,'1')
    await isiDataPegawai();
    isiNavbar(getUserFromSession().statusUser);
    cekMessage()
    $(`a[href="home.html"]`).attr('id', '');
    $(`a[href="tampilan_pegawai.html"]`).attr('id', 'active');
    $('#table').DataTable({
        "scrollX": true,
        "lengthMenu": [
            [5, 10, 30, 50, -1],
            [5, 10, 30, 50, "All"]
        ]
    });
    
    $('.dataTables_length').addClass('bs-select');

    $('#tambahModal').iziModal({
        title : 'Tambah Data Pegawai',
        subtitle : 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
        headerColor : '#434055',
        closeButton : true,
        width : 900,
        onClosed : function() {
            $('#tambahModal input').val('');
        }
    });

    $('#tambahModal form').submit(async function(e) {
        e.preventDefault()
        await insertPegawai()
    })

    $('body').on('click' , '.resetBtn', async function(e) {
        e.preventDefault()
        let validasi = confirm('Apakah anda yakin ingin mereset password user ke 123456')
        if (validasi == true) {
            await resetPassword($(this).data('id'))
        }
    })

    $('body').on('click' , '.deleteBtn', async function(e) {
        e.preventDefault()
        let validate = confirm('Apakah anda yakin menghapus data ini?')
        if (validate == true) {
            await hapusPegawai($(this).data('id'))
        }
    })

    $('body').on('click' , '.editBtn', async function(e) {
        e.preventDefault()
        editData($(this).data('id'))
    })
    
    $('body').on('submit' , '#modal form' , async function(e) {
        e.preventDefault()
        await updatePegawai($('#modal .successBtn').data('id'))
    })
})