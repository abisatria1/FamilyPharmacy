const hitungTotal = () => {
  const itemPilih = document.querySelectorAll('.itemPilih')
  let total = 0
  if (itemPilih.length !== 0) {
    const arrPilih = [...itemPilih]
    const arrTotal = arrPilih.map((item) => {
      let harga = $(item).find('.hargaObat').text()
      harga = parseInt(harga)
      let quantity = $(item).find('.quantity').val()
      return harga*quantity
    })
    total = arrTotal.reduce((prev,current) => prev+current)
  }
  $('#totalAmount').text(total)
}

const cariObat = async (str) => {
  let searchResult = $('.searchResult')
  searchResult.empty()
  if (str.length == 0) {
    searchResult.empty()
    return
  }
  let result = await requestSearchObat(str)  
  result = result.data.data
  console.log(result)
  if (result.length !== 0 ) {
    result.map(item => {
      searchResult.append(
        `
        <div class="searchItem row" data-id = "${item.id}">
          <div class="col-sm-2">
            <img src="${item.fotoObat}">
          </div>
          <div class="col-sm-8">
            <h5>${item.namaObat}</h5>
            <h5><b>Rp.${item.hargaObat}</b></p>
            <h5>Stok <b>${item.stokObat}</b></h5>
          </div>  
        </div>
        `
      )
    })
  }else {
    searchResult.empty()
  }
}

const pilihItem = async id => {
  $('#searchObat').val('')
  $('.searchResult').empty()
  const response = await getDetailData(id)
  let item = response.data.data
  if ( cekPilihItem(item.id) ) {
    $('.pilihObat').append(
      `
      <div class="itemPilih row" data-id="${item.id}">
        <div class="col-sm-2">
          <img src="${item.fotoObat}">
        </div>
        <div class="col-sm-6">
          <h5>Nama Obat</h5>
          <h5> <b>Rp.</b> <b class="hargaObat">${item.hargaObat}</b></p>
          <h5>Stok <b>${item.stokObat}</b></h5>
        </div>  
        <div class="col-sm-2">
          <input type="number" min="1" max ="${item.stokObat}" class="form-control quantity" value="1">
        </div>  
        <div class="col-sm-2" style="display: flex;justify-content: flex-end;">
          <button class="deleteBtn">+</button>
        </div>  
      </div>
      `
    )
    hitungTotal()
  }else {
    message('Obat sudah masuk di dalam item list' , false)
  }
}

const message = (message,status) => {
  $('#message').removeClass('alert alert-success')
  $('#message').removeClass('alert alert-danger')
  if (status === false) {
    $('#message').addClass('alert alert-danger')
  }else if (status === true) {
    $('#message').addClass('alert alert-success')
  }
  $('#message p').text(message)
  $('#message').slideDown(function() {
    setTimeout(function() {
        $('#message').slideUp();
    }, 5000);
});
}

const cekPilihItem = id => {
  const itemPilih = $('.itemPilih')
  const arrItem = [...itemPilih]
  let allow = true
  arrItem.map(elem => {
    if ($(elem).data('id') == id) {
      allow = false
    }
  })
  return allow
}

const insertOrder = async () => {
  const itemPilih = $('.itemPilih')
  const arrItemPilih = [...itemPilih]
  if (arrItemPilih.length === 0) return message('List item kosong',false)
  let transaksi = []
  arrItemPilih.map(elem => {
    let id = $(elem).data('id')
    let quantity = $(elem).find('.quantity').val()
    let item = {id,quantity}
    transaksi.push(item)
  })
  const data = {transaksi : transaksi}
  try {
    const response = await requestInsertOrder(data)
    resetAll()
    message(response.data.message,true)
  } catch (err) {
    console.log(err)
    message(err.response.data.message,false)
  }
}

const resetAll = () => {
  $('.pilihObat').empty()
  $('#searchObat').val('')
  hitungTotal()
}

const requestSearchObat = str => {
  console.log(str)
  return axios({
    url : 'http://localhost:3001/drugs/search',
    method : 'POST',
    headers : {
        'Authorization' : sessionStorage.getItem('token'),
        'Content-Type' : 'application/json'
    },
    data : {param : str}
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

const requestInsertOrder = (data) => {
  return axios({
    url : 'http://localhost:3001/orders/',
    method : 'POST',
    headers : {
        'Authorization' : sessionStorage.getItem('token')
    },
    data : data
  })
}





$(document).ready(function() {
  cekLogin()
  isiNavbar(getUserFromSession().statusUser)
  $(`a[href="home.html"]`).attr('id','');
  $(`a[href="order.html"]`).attr('id','active');
  $('#message').hide()
  hitungTotal()

  $('body').on('change' , '.quantity' , function() {
    hitungTotal()
  })
  // delete item pilih
  $('body').on('click', '.deleteBtn' , function() {
    $(this).parents('.itemPilih').remove()
    hitungTotal()
  })

  $('body').on('click', '.searchItem' , async function(e) {
    e.preventDefault()
    await pilihItem($(this).data('id'))
  })

  $('body').on('click', '.successBtn' , async function(e) {
    e.preventDefault()
    await insertOrder()
  })
})