const isiJadwalPegawai = async () => {
    try {
        //         
        //         <td class="text-center hari">${item.hari}</td>
        //         <td class="text-center jamMasuk">${item.jamMasuk}</td>
        //         <td class="text-center jamKeluar">${item.jamKeluar}</td>
        const token = sessionStorage.getItem('token')
        const resultPegawai = await requestDataPegawai(token)
        $(resultPegawai.data.data).each(async (index,item)=>{
            const jadwal = await requestJadwalPegawai(item.id, token)
            $(jadwal.data.data).each(function (i, itemJadwal) {
                let string =
                    `
                    <tr id="row${item.id}">
                        <td class="text-center">${index+1}</td>
                        <td class="text-left namaUser">${item.namaUser}</td>
                        <td class="text-center hari">${itemJadwal.hari}</td>
                        <td class="text-center jamMasuk">${itemJadwal.jamMasuk}</td>
                        <td class="text-center jamKeluar">${itemJadwal.jamKeluar}</td>
                        <td class="text-center">
                            <a href="" data-id ="${itemJadwal.id}" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm">Edit</a>
                            <a href="#" data-id ="${itemJadwal.id}" class="deleteBtn btn badge-danger float-center btn-sm">Hapus</a>
                        </td>
                    </tr>
                    `
                $('tbody').append(string)
            })
        })
        

    } catch (err) {
        if (err.response === 401) {
            return window.location = 'notAllowed.html';
        }
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

const requestJadwalPegawai = (id, token) => {
    return axios({
        url: `http://localhost:3001/schedules/${id}`,
        method: 'get',
        headers: {
            'Authorization': token
        },
        data: {
            userId: id
        }
    })
}

$(document).ready(async function (e) {
    cekLogin();
    isiNavbar(getUserFromSession().statusUser)
    await isiJadwalPegawai()
    cekUser(getUserFromSession().statusUser, '1')
    cekMessage()
    $(`a[href="home.html"]`).attr('id', '');
    $(`a[href="tampilan_pegawai.html"]`).attr('id', 'active');
    $('#table').DataTable({
        "lengthMenu": [
            [5, 10, 30, 50, -1],
            [5, 10, 30, 50, "All"]
        ]
    });

    // $('#tambahModal').iziModal({
    //     title : 'Tambah Jadwal Pegawai',
    //     subtitle : 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
    //     headerColor : '#434055',
    //     closeButton : true,
    //     width : 900,
    //     onClosed : function() {
    //         $('#tambahModal input').val('');
    //     }
    // });

    // $('#tambahModal form').submit(async function(e) {
    //     e.preventDefault()
    //     await insertPegawai()
    // })

    // $('body').on('click' , '.deleteBtn', async function(e) {
    //     e.preventDefault()
    //     let validate = confirm('Apakah anda yakin menghapus data ini?')
    //     if (validate == true) {
    //         await hapusPegawai($(this).data('id'))
    //     }
    // })

    // $('body').on('click' , '.editBtn', async function(e) {
    //     e.preventDefault()
    //     editData($(this).data('id'))
    // })

    // $('body').on('submit' , '#modal form' , async function(e) {
    //     e.preventDefault()
    //     await updatePegawai($('#modal .successBtn').data('id'))
    // })
})