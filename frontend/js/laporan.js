const isiLaporan = async (awal,akhir,table) => {
  const response  = await requestData(awal,akhir)
  const result = response.data.data
  table.clear()
  table.rows.add(result)
  table.draw()
}

const fetchObat = (arrObat) => {
  let result = ''
  let string = ''
  arrObat.map(item => {
    string = `<li>${item.namaObat} , Rp ${item.hargaObat} , ${item.include.quantity} obat</li>`
    result = result + string
  })
  return result
}

const requestData = (awal,akhir) => {
  // format = MMMM-dd-yy
  return axios({
    url : 'http://localhost:3001/orders/search',
    method : 'post',
    headers : {
        'Authorization' : sessionStorage.getItem('token')
    },
    data : {
      tanggalAwal : awal,
      tanggalAkhir : akhir
    }
  })
}




$(document).ready(function() {
  cekLogin()
  cekUser(getUserFromSession().statusUser,1)
  isiNavbar(getUserFromSession().statusUser)
  $(`a[href="home.html"]`).attr('id','')
  $(`a[href="tampilan_laporan.html"]`).attr('id','active')
  var table = $('#table').DataTable({
    columns : [
      {'defaultContent'  : ""},
      {"data" : 'createdAt'},
      {"data" : 'id'},
      {"data" : 'drugs[,].namaObat'},
      {"data" : 'totalHarga'},
      {"data" : 'totalQuantity'},
      {"data" : 'user.namaUser'},
      // {"defaultContent" : `<button class="btn btn-danger deleteBtn">Delete</button>` }
    ],
    "columnDefs":  [
      {
        "targets" : 1,
        "render" : function(data,type,full,meta) {
          let myDate = new Date(data)
          var month = ["Jan", "Febr", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
          ];
          var getMonth = month[myDate.getMonth()];
          return myDate.getDate() + " " + getMonth + " " + myDate.getFullYear();
        }
      },
      {
        "searchable": false,
        "orderable": false,
        "targets": 0
      },
      
    ],
    "order": [[ 1, 'asc' ]],
    'footerCallback' : function(row,data,start,end,display) {
      var api = this.api(), data;

      // Remove the formatting to get integer data for summation
      var intVal = function ( i ) {
          return typeof i === 'string' ?
              i.replace(/[\$,]/g, '')*1 :
              typeof i === 'number' ?
                  i : 0
      };

      // Total over all pages
      total = api
          .column( 4 )
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 )
        
      pageTotal = api
      .column( 4, { page: 'current'} )
      .data()
      .reduce( function (a, b) {
          return intVal(a) + intVal(b);
      }, 0 );
      
      // Update footer
      $( api.column( 4 ).footer() ).html(
        'Rp '+pageTotal +' ( Rp '+ total +' total)'
      )
    },
    "lengthMenu" : [[5,10,30,50, -1], [5,10,30,50,"All"]]
  })

  // tambah nomer
  table.on( 'order.dt search.dt', function () {
    table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
        cell.innerHTML = i+1;
    } );
  } ).draw();


  let date = new Date(Date.now())
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let tanggal = date.getDate()  
  isiLaporan(`${year}-${month}-${tanggal}`,`${year}-${month}-${tanggal}`,table)
  $datepicker = $('#date').daterangepicker({
    "autoApply": true,
    ranges: {
      'Hari Ini': [moment(), moment()],
      'Kemarin': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      '7 Hari Terakhir': [moment().subtract(6, 'days'), moment()],
      '30 Hari Terakhir': [moment().subtract(29, 'days'), moment()],
      'Bulan ini': [moment().startOf('month'), moment().endOf('month')],
      'Bulan terakhir': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1,
              'month')
          .endOf('month')
      ]
    },
    "locale": {
      "format": "YYYY-MM-DD",
      "separator": " s.d ",
      "applyLabel": "Pilih",
      "cancelLabel": "Batal",
      "fromLabel": "From",
      "toLabel": "To",
      "customRangeLabel": "Custom",
      "weekLabel": "W",
      "daysOfWeek": [
          "Su",
          "Mo",
          "Tu",
          "We",
          "Th",
          "Fr",
          "Sa"
      ],
      "monthNames": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
      ],
      "firstDay": 1
    },
    "startDate": `${year}-${month}-${tanggal}`,
    "endDate": `${year}-${month}-${tanggal}`,
    "opens": "center"
  }, function(start, end, label) {
    isiLaporan(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'),table)
  })


  $('#table tbody').on( 'click', 'button', function () {
    var data = table.row( $(this).parents('tr') ).data();
    alert(data.id)
} );
})