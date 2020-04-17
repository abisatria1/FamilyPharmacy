const login = async response => {
    const token  = response.data.token;
    // set session
    requestUser(token)
        .then(function(response) {
            const user = response.data.data
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));
            if (user.statusUser == "0") {
                window.location = "home_pegawai.html"
            }else if (user.statusUser == "1"){
                window.location = "home_pemilik.html"
            }
        })
        .catch(function(err) {
            failed(err.response.data)
        })
}

const failed = response => {
    $('#error').text(response.message).slideDown('slow');
    setTimeout(() => {
        $('.error').slideUp("slow");
    }, 5000);
}

const requestLogin = data => {
    axios.post('http://localhost:3001/users/login', data)
        .then(function (response) {
            login(response.data);
        })
        .catch(function (error) {
            failed(error.response.data);
        });
}

const requestUser = token => {
    return axios({
        url : 'http://localhost:3001/users/profile',
        method : 'get',
        headers : {'Authorization' : token}
    })
}

$(document).ready(function() {
    $('#error').hide();
    $('form').submit(function(e) {
        e.preventDefault();
        const password = $('#password').val();
        const param = $('#param').val();
        const data = {
            param : param,
            password : password
        };
        requestLogin(data);
    })
})