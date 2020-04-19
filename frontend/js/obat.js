const isiDataObat = async () => {
    let token = sessionStorage.getItem('token');
    await requestDataObat(token)
        .then(result => {
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
                        <a href="#" class="btn badge-success float-center btn-sm">Detail</a>
                        <a href="" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm" onclick="editData(${item.id})">Edit</a>
                        <a href="" data-id = "${item.id}" class="deleteBtn btn badge-danger float-center btn-sm">Hapus</a>
                    </td>
                </form>
                </tr>
                `;
                $('tbody').append(string);
            })
        })
        .catch(err => {
            if (err.response.status === 401) {
                return window.location = 'notAllowed.html';
            }
        })
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
        subtitle : 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
        headerColor : '#434055',
        closeButton : true,
        width : 700,
        onClosed : function() {
            $('#modal form').empty();
        }
    });
}

const hapusData = async(id) => {
    axios({
        url : 'http://localhost:3001/drugs/'+id,
        method : 'DELETE',
        headers : {
            'Authorization' : sessionStorage.getItem('token')
        },
    })
    .then(response => {
        flashMessage(response.data.message,true)
        window.location = 'Tampilan_obat.html'
    })
    .catch(err => {
        flashMessage(err.response.message,false)
    })
}

const submitDataObat = async () => {
    let file = $('input[name="fotoObat"]')[0].files[0]
    let data = new FormData()
    data.append('namaObat',$('input[name="namaObat"]').val())
    data.append('jenisObat',$('input[name="jenisObat"]').val())
    data.append('produsenObat',$('input[name="produsenObat"]').val())
    data.append('hargaObat',$('input[name="hargaObat"]').val())
    data.append('stokObat',$('input[name="stokObat"]').val())
    data.append('fotoObat',file)
    data.append('descObat',$('textarea[name="descObat"]').val())
    axios({
        url : 'http://localhost:3001/drugs/',
        method : 'POST',
        headers : {
            'Authorization' : sessionStorage.getItem('token'),
            'Accept' : 'multipart/form-data'
        },
        data : data
    })
    .then(async response => {
        flashMessage(response.data.message,true)
        window.location = 'Tampilan_obat.html'
    })
    .catch(err => {
        flashMessage(err.response.data.message,false)
        window.location = 'Tampilan_obat.html'
    })
}


$(document).ready(async function() {
    cekLogin();
    await isiDataObat();
    cekMessage();
    isiNavbar(getUserFromSession().statusUser);
    $(`a[href="home.html"]`).attr('id','');
    $(`a[href="Tampilan_obat.html"]`).attr('id','active');
    let izimodal = $('#tambahModal').iziModal({
        title : 'Tambah Data Obat',
        subtitle : 'Diharapkan mengisi data dengan benar dan bertanggung jawab',
        headerColor : '#434055',
        closeButton : true,
        width : 900,
        onClosed : function() {
            $('#tambahModal input').val('');
        }
    });
    $('.deleteBtn').click(async function(e) {
        e.preventDefault();
        let result = confirm('Apakah ingin mengapus data ini ? ');
        if (result===true){
            await hapusData($(this).data('id'));
        }
    })
    $('#table').DataTable({
        "lengthMenu" : [[5,10,30,50, -1], [5,10,30,50,"All"]]
    });
    
    $('#fotoObat').change(function() {
        let fileName = $(this)[0].files[0].name;
        $('.custom-file label').text(fileName)
    })
    $('#tambahModal form').submit(async function(e) {
        e.preventDefault();
        await submitDataObat();
        $('#tambahModal .cancelBtn').click();
    })
    
})