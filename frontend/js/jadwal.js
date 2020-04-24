const isiJadwalPegawai = async () => {
    try {
        const token = sessionStorage.getItem('token')
        var no = 0
        arrPegawai = await searchUser(token)
        for (let index = 0; index < arrPegawai.length; index++) {
            const jadwal = await requestJadwalPegawai(arrPegawai[index].id, token)
            $.each(jadwal.data.data, function (i, itemJ) {
                let string =
                    `
                    <tr id="row${itemJ.id}">
                    <form action="">
                        <td class="text-center">${no+1}</td>    
                        <td class="text-left namaUser">${arrPegawai[index].namaUser}</td>
                        <td class="text-center hari">${itemJ.hari}</td>
                        <td class="text-center jamMasuk">${itemJ.jamMasuk}</td>
                        <td class="text-center jamKeluar">${itemJ.jamKeluar}</td>
                        <td class="text-center">
                            <a href="" data-id ="${itemJ.id}" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm">Edit</a>
                            <a href="#" data-id ="${itemJ.id}" class="deleteBtn btn badge-danger float-center btn-sm">Hapus</a>
                        </td>
                    </form>
                    </tr>
                    `
                no++
                $('tbody').append(string)
            })
        }


    } catch (err) {
        if (err.response === 401) {
            return window.location = 'notAllowed.html';
        }
    }
}

const searchUser = async (token) => {
    var result = []
    const resultPegawai = await requestDataPegawai(token)
    $.each(resultPegawai.data.data, function (i, item) {
        result.push(item)
    })
    return result
}

const namaPegawai = async (token) => {
    try {
        const resultPegawai = await requestDataPegawai(token)
        $.each(resultPegawai.data.data, function (i, item) {
            let string =
                `
                <option value="${item.id}">${item.namaUser}</option>
                `
            $('select').append(string)

        })

    } catch (err) {
        console.log(err)
    }
}

const editData = id => {
    const namaUser = $(`#row${id} > .namaUser`).text()
    const hari = $(`#row${id} > .hari`).text();
    const jamMasuk = $(`#row${id} > .jamMasuk`).text();
    const jamKeluar = $(`#row${id} > .jamKeluar`).text();
    let string =
        `
        <div class="form-group">
            <p>Nama Pegawai</p>
            <input type="text" class="form-control" placeholder="Nama Pegawai" value="${namaUser}" disabled>
        </div>
        <div class="form-group">
            <p>Hari</p>
            <input type="text" class="form-control" placeholder="Hari" id="editHari" value="${hari}" required >
        </div>
        <div class="form-group">
            <p>Jam Masuk</p>
            <input type="time" class="form-control" placeholder="Jam Masuk" id="editJamMasuk" value="${jamMasuk}" required>
        </div>
        <div class="form-group">
            <p>No Telpon Pegawai</p>
            <input type="time" class="form-control" placeholder="Jam Keluar" id="editJamKeluar" value="${jamKeluar}" required>
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
        title: 'Edit Jadwal',
        subtitle: 'Diharapkan mengisi data dengan sesuai dan bertanggung jawab',
        headerColor: '#434055',
        closeButton: true,
        width: 700,
        onClosed: function () {
            $('#modal form').empty();
        }
    });
}

const hapusJadwal = async (id) => {
    try {
        const response = await requestDeleteJadwal(sessionStorage.getItem('token'), id)
        flashMessage(response.data.message, true)
        window.location = 'jadwal_pegawai.html'
    } catch (err) {
        console.log(err)
        flashMessage(err.response.data.message, false)
    }
}

const insertJadwal = async () => {
    const data = {
        hari: $('#hari').val(),
        jamMasuk: $('#jamMasuk').val(),
        jamKeluar: $('#jamKeluar').val(),
    }
    try {
        const response = await requestInsertJadwal(sessionStorage.getItem('token'), data, $("#listUser").val())
        flashMessage(response.data.message, true)
        $('#tambahJadwaliCancel').click()
        window.location = 'jadwal_pegawai.html'
    } catch (err) {
        $('.errorMessage p').text(err.response.data.message);
        $('.errorMessage').slideDown(function () {
            setTimeout(function () {
                $('.errorMessage').slideUp();
            }, 5000);
        });
    }
}

const updateJadwal = async (id) => {
    const data = {
        hari: $('#editHari').val(),
        jamMasuk: $('#editJamMasuk').val(),
        jamKeluar: $('#editJamKeluar').val()
    }
    try {
        const response = await requestUpdateJadwal(sessionStorage.getItem('token'), id, data)
        flashMessage(response.data.message, true)
        $('#modal .btn-danger').click()
        if (id == getUserFromSession().id) {
            let user = await getUserFromRequest(sessionStorage.getItem('token'))
            sessionStorage.setItem('user', JSON.stringify(user))
        }
        window.location = 'jadwal_pegawai.html'
    } catch (err) {
        console.log(err.response)
        $('#modal .errorMessage h5').text(err.response.data.message);
        $('#modal .errorMessage').slideDown(function () {
            setTimeout(function () {
                $('.errorMessage').slideUp();
            }, 5000);
        });
    }
    
}


const requestInsertJadwal = (token, data, id) => {
    return axios({
        url: `http://localhost:3001/schedules/${id}`,
        method: 'post',
        headers: {
            'Authorization': token
        },
        data: data
    })
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

const requestUpdateJadwal = (token, id, data) => {
    console.log(id)
    return axios({
        url: `http://localhost:3001/schedules/${id}/4`,
        method: 'PATCH',
        headers: {
            'Authorization': token
        },
        data: data
    })
}

const requestDeleteJadwal = (token, id) => {
    return axios({
        url: `http://localhost:3001/schedules/${id}/3`,
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    })
}


$(document).ready(async function (e) {
    $('.errorMessage').hide()
    namaPegawai(sessionStorage.getItem('token'))
    cekLogin();
    cekUser(getUserFromSession().statusUser, '1')
    await isiJadwalPegawai()
    isiNavbar(getUserFromSession().statusUser)
    cekMessage()
    $(`a[href="home.html"]`).attr('id', '');
    $(`a[href="jadwal_pegawai.html"]`).attr('id', 'active');

    $('#table').DataTable({
        "lengthMenu": [
            [5, 10, 30, 50, -1],
            [5, 10, 30, 50, "All"]
        ]
    });

    $('.dataTables_length').addClass('bs-select');

    $('#tambahModal').iziModal({
        title: 'Tambah Jadwal Pegawai',
        subtitle: 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
        headerColor: '#434055',
        closeButton: true,
        width: 900,
        onClosed: function () {
            $('#tambahModal input').val('');
        }
    });

    $('#tambahModal form').submit(async function (e) {
        e.preventDefault()
        await insertJadwal()
    })

    $('.editBtn').click(async function (e) {
        e.preventDefault();
        console.log($(this).data('id'))
        await editData($(this).data('id'));
    })

    $('body').on('submit', '#modal form', async function (e) {
        e.preventDefault()
        await updateJadwal($('#modal .successBtn').data('id'))
    })

    $('body').on('click', '.deleteBtn', async function (e) {
        e.preventDefault()
        console.log($(this).data('id'))
        let validate = confirm('Apakah anda yakin menghapus data ini?')
        if (validate == true) {
            await hapusJadwal($(this).data('id'))
        }
    })

})