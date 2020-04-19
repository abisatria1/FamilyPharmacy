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
                        <a href="#" data-id = "${item.id}" data-izimodal-open="#detailModal" class="detailBtn btn badge-success float-center btn-sm">Detail</a>
                        <a href="" data-id = "${item.id}" data-izimodal-open="#modal" class="editBtn btn badge-warning float-center btn-sm">Edit</a>
                        <a href="" data-id = "${item.id}" class="deleteBtn btn badge-danger float-center btn-sm">Hapus</a>
                    </td>
                    <input type="hidden" value="${item.descObat}" class="descObat">
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
    const descObat = $(`#row${id} > .descObat`).val();
    let string = 
    `
        <div class="form-group">
            <p>Nama Obat</p>
            <input type="text" class="form-control" id="namaObat" placeholder="Nama Obat" value="${namaObat}" required>
        </div>
        <div class="form-group">
            <p>Produsen Obat</p>
            <input type="text" class="form-control" id="produsenObat" placeholder="Produsen Obat" value="${produsenObat}" required >
        </div>
        <div class="form-group">
            <p>Jenis Obat</p>
            <input type="text" class="form-control" id="jenisObat" placeholder="Jenis Obat" value="${jenisObat}" required>
        </div>
        <div class="form-group">
            <p>Harga Obat</p>
            <input type="number" class="form-control" id="hargaObat" placeholder="Harga Obat" value="${hargaObat}" required>
        </div>
        <div class="form-group">
            <p>Stok Obat</p>
            <input type="number" class="form-control" id="stokObat" placeholder="Stok Obat" value="${stokObat}" required>
        </div>
        <div class="form-group">
            <p>Deskripsi Obat</p>
            <textarea class="form-control" rows="3" id="descObat" placeholder="Masukkan deskripsi..." required >${descObat}</textarea>
        </div>
        <div class="button">
            <button type="submit" id="submitBtn" data-id = "${id}" class="customBtn successBtn">Submit</button>
            <button class="customBtn btn-danger cancelBtn" data-izimodal-close="#modal">Cancel</button>
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

const isiDetailModal = async (id) => {
    getDetailData(id)
    .then(response => {
        let item = response.data.data
        let string = 
        `
        <div class="row">
            <div class="col">
            <div class="image">
                <img src="${item.fotoObat}" width="600" height="300" alt="">
            </div>
            </div>
        </div>
        <div class="tulisanObat">
            <div class="row">
                <div class="col">
                    <h2>${item.namaObat}</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label for="">Produsen Obat  </label>
                </div>
                <div class="col">
                    <p>${item.produsenObat}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label for="">Jenis Obat  </label>
                </div>
                <div class="col">
                    <p>${item.jenisObat}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label for="">Harga Obat  </label>
                </div>
                <div class="col">
                    <p>${item.hargaObat}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-3">
                    <label for="">Stok Obat  </label>
                </div>
                <div class="col">
                    <p>${item.stokObat}</p>
                </div>
            </div>
            <div class="row">
                <div class="col" style="text-align : center;">
                    <p>${item.descObat}</p>
                </div>
            </div>
        </div>
        `
        $('#detailModal #detailContent').append(string)
        $('#detailModal').iziModal({
            title : 'Detail Obat',
            headerColor : '#434055',
            closeButton : true,
            width : 600,
            onClosed : function() {
                $('#detailModal #detailContent').empty();
            }
        });
    })
    .catch(err => {
        flashMessage(err.response.data.message,false)
        window.location = 'Tampilan_obat.html'
    })
}

const getDetailData = (id) => {
    return axios({
        url : 'http://localhost:3001/drugs/'+id,
        method : 'GET',
        headers : {
            'Authorization' : sessionStorage.getItem('token')
        },
    })
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
        flashMessage(err.response.data.message,false)
        window.location = 'Tampilan_obat.html'
    })
}

const updateData = async(id) => {
    let data = {
        namaObat : $('#modal #namaObat').val(),
        produsenObat : $('#modal #produsenObat').val(),
        jenisObat : $('#modal #jenisObat').val(),
        hargaObat : $('#modal #hargaObat').val(),
        stokObat : $('#modal #stokObat').val(),
        descObat : $('#modal #descObat').val(),
    }
    axios({
        url : 'http://localhost:3001/drugs/'+id,
        method : 'PATCH',
        headers : {
            'Authorization' : sessionStorage.getItem('token')
        },
        data : data
    })
    .then (response => {
        flashMessage(response.data.message,true)
        window.location = 'Tampilan_obat.html'
    })
    .catch (err => {
        flashMessage(err.response.data.message,false)
        window.location = 'Tampilan_obat.html'
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
    $('.editBtn').click(async function(e) {
        e.preventDefault();
        await editData($(this).data('id'));
    })
    $('.detailBtn').click(async function(e) {
        await isiDetailModal($(this).data('id'));
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
    $('body').on('submit', '#editForm', async function(e) {
        e.preventDefault();
        await updateData($('#submitBtn').data('id'));
        $('#modal .cancelBtn').click();
    })
    
    
})