const isiDataPegawai = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const result = await requestDataPegawai(token);
        $(result.data.data).each(function (i, item) {
            let string =
                `
            <tr id="row${item.id}">
            <form action="">
                <td class="text-center">${i+1}</td>
                <td class="text-left namaUser">${item.namaUser}</td>
                <td class="text-center umurUser">${item.umurUser}</td>
                <td class="text-center notelpUser">${item.notelpUser}</td>
                <td class="text-center emailUser">${item.emailUser}</td>
                <td class="text-center username">${item.username}</td>
                <td class="text-center password">${item.password}</td>
                <td class="text-center alamatUser">${item.alamatUser}</td>
                <td class="text-center">
                    <a href="" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm" onclick="editData(${item.id})"?>Edit</a>
                    <a href="#" class="btn badge-danger float-center btn-sm" onclick="return confirm('Apakah anda yakin menghapus data ini?');" ?>Hapus</a>
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
    let string =
        `
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Nama User" value="${namaUser}" required>
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Umur User" value="${umurUser}" required >
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Alamat User" value="${alamatUser}" required>
        </div>
        <div class="form-group">
            <input type="number" class="form-control" placeholder="No Telp User" value="${notelpUser}" required>
        </div>
        <div class="button">
            <input type="submit" class="customBtn successBtn">
            <button class="customBtn btn-danger" data-izimodal-close="#modal">Cancel</button>
        </div>
    `;
    $('#modal form').append(string);
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


const requestDataPegawai = token => {
    return axios({
        url: 'http://localhost:3001/users/',
        method: 'get',
        headers: {
            'Authorization': token
        }
    })
}

$(document).ready(async function (e) {
    cekLogin();
    await isiDataPegawai();
    isiNavbar(getUserFromSession().statusUser);
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

})