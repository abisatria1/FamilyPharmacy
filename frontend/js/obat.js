const isiDataObat = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const result = await requestDataObat(token);
        $(result.data.data).each(function(i,item){
            let string = 
            `
            <tr id="row${item.id}">
            <form action="">
                <td class="text-center">${i+1}</td>
                <td class="text-left namaObat">${item.namaObat}</td>
                <td class="text-center produsenObat">${item.produsenObat}</td>
                <td class="text-center jenisObat">${item.jenisObat}</td>
                <td class="text-center hargaObat">${item.hargaObat}</td>
                <td class="text-center stokObat">${item.stokObat}</td>
                <td class="text-center">
                    <a href="#" class="btn badge-success float-center btn-sm" ?>Detail</a>
                    <a href="" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm" onclick="editData(${item.id})"?>Edit</a>
                    <a href="#" class="btn badge-danger float-center btn-sm" onclick="return confirm('Apakah anda yakin menghapus data ini?');" ?>Hapus</a>
                </td>
            </form>
            </tr>
            `;
            $('tbody').append(string);
        })
    } catch (err) {
        if (err.response.status === 401) {
            return window.location = 'notAllowed.html';
        }
    }
}

const requestDataObat = token => {
    return axios({
        url : 'http://localhost:3001/drugs/',
        method : 'get',
        headers : {'Authorization' : token}
    })
}

const editData = id => {
    const namaObat = $(`#row${id} > .namaObat`).text();
    const produsenObat = $(`#row${id} > .produsenObat`).text();
    const jenisObat = $(`#row${id} > .jenisObat`).text();
    const hargaObat = $(`#row${id} > .hargaObat`).text();
    const stokObat = $(`#row${id} > .stokObat`).text();
    let string = 
    `
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Nama Obat" value="${namaObat}" required>
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Produsen Obat" value="${produsenObat}" required >
        </div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Jenis Obat" value="${jenisObat}" required>
        </div>
        <div class="form-group">
            <input type="number" class="form-control" placeholder="Harga Obat" value="${hargaObat}" required>
        </div>
        <div class="form-group">
            <input type="number" class="form-control" placeholder="Stok Obat" value="${stokObat}" required>
        </div>
        <div class="button">
            <input type="submit" class="customBtn successBtn">
            <button class="customBtn btn-danger" data-izimodal-close="#modal">Cancel</button>
        </div>
    `;
    $('#modal form').append(string);
    // izimodal
    $('#modal').iziModal({
        title : 'Edit Obat',
        subtitle : 'Diharapkan mengisi data dengan sesuai dan bertanggung jawab',
        headerColor : '#434055',
        closeButton : true,
        width : 700,
        onClosed : function() {
            $('#modal form').empty();
        }
    });
}


$(document).ready(async function(e) {
    cekLogin();
    await isiDataObat();
    isiNavbar(getUserFromSession().statusUser);
    $(`a[href="home.html"]`).attr('id','');
    $(`a[href="Tampilan_obat.html"]`).attr('id','active');
    $('#table').DataTable({
        "lengthMenu" : [[5,10,30,50, -1], [5,10,30,50,"All"]]
    });
    
})