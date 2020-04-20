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



$(document).ready(function() {
  hitungTotal()

  $('.quantity').change(function() {
    hitungTotal()
  })
  // delete item pilih
  $('body').on('click', '.deleteBtn' , function() {
    $(this).parents('.itemPilih').remove()
    hitungTotal()
  })
})