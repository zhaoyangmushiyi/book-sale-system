$(function () {
    const user = window.location.search.substring(1) || '';
    if (user != null && user !== "") {
        const username = user.split('&')[0].split('=')[1];
        sessionStorage.setItem("username", username);
        const role = user.split('&')[1].split('=')[1];
        sessionStorage.setItem("role", role);
        const relname = user.split('&')[2].split('=')[1];
        sessionStorage.setItem("relname", relname);
        if (role === "0") {
            // $('#admin-button').css("display", "block");
            $('#index-div').append("<a href=\"../../admin/user-management.html\" class=\"btn btn-outline-primary btn-pill align-self-center mr-2\"\">进入管理员系统</a>")
        }else {
            window.location = "/index-2.html";
        }
    } else {
        const role = sessionStorage.getItem("role");
        if (role != null) {
            if (role === "0") {
                // $('#admin-button').css("display", "block");
                $('#index-div').append("<a href=\"../../admin/user-management.html\" class=\"btn btn-outline-primary btn-pill align-self-center mr-2\"\">进入管理员系统</a>")
            }else {
                window.location = "/index-2.html";
            }
        }
    }
});