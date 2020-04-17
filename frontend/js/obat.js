const isiDataObat = async () => {
    try {
        const token = sessionStorage.getItem('token');
        const result = await requestDataObat(token);
        $(result.data.data).each(function(i,item){
            let string = 
            `
            <tr>
            <form action="">
                <td class="text-center">${i+1}</td>
                <td class="text-left">${item.namaObat}</td>
                <td class="text-center">${item.produsenObat}</td>
                <td class="text-center">${item.jenisObat}</td>
                <td class="text-center">${item.hargaObat}</td>
                <td class="text-center">${item.stokObat}</td>
                <td class="text-center">
                    <a href="#" class="btn badge-success float-center btn-sm" ?>Detail</a>
                    <a href="#" class="btn badge-warning float-center btn-sm" ?>Edit</a>
                    <a href="#" class="btn badge-danger float-center btn-sm" onclick="return confirm('Apakah anda yakin menghapus data ini?');" ?>hapus</a>
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


$(document).ready(async function() {
    cekLogin();
    await isiDataObat();
    isiNavbar(getUserFromSession().statusUser);
    $(`a[href="home.html"]`).attr('id','');
    $(`a[href="Tampilan_obat.html"]`).attr('id','active');
    $('#table').DataTable({
        "lengthMenu" : [[5,10,30,50, -1], [5,10,30,50,"All"]]
    });
})