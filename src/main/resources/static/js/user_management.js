$(function () {
    $("#AddOrUpdateAccount").click(function () {
        let operation = $("#AddOrUpdateAccount").html();
        let user = {};
        if ($("#feUsername").val() === null || $("#feUsername").val() === "") {
            alert("请输入用户名");
            return;
        }
        user.username = $("#feUsername").val();
        user.realName = $("#feRelname").val();
        user.identification = $("#feIdentification").val();
        user.telephone = $("#feTelephone").val();
        user.nickName = $("#feInputNickName").val();
        user.roleName = $("#feRole").val();
        user.sex = $("#feSex").val();
        if (operation === "添加用户") {
            user.password = "p" + user.identification.substring(12, 18);
            addAccount(user);
        } else if (operation === "更新用户") {
            updateUser(user);
        }
    });
    $(".navbar-search").bind('keydown', function () {
        const event = window.event || arguments.callee.caller.arguments[0];
        if (event.keyCode === 13) {
            searchUser($(".navbar-search").val());
        }
    });
});

function addAccount(user) {
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '/user/register',
        async: false, // 需要同步请求数据
        data: JSON.stringify(user),
        dataType: 'json',
        success: function (data) {
            if (data) {
                alert("添加用户成功！");
            } else {
                alert("添加用户失败，用户名已被使用！");
            }
        },
        error: function (data) {
            alert("未知错误！");
        }
    });

}

function searchUser(username) {

    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '/user/findUserByUsernameOrIdentification',
        async: false, // 需要同步请求数据
        data: {
            username: "" + username
        },
        dataType: 'json',
        success: function (data) {
            if (data != null) {
                $("#feUsername").val(data.username);
                $("#feRelname").val(data.realName);
                $("#feIdentification").val(data.identification);
                $("#feTelephone").val(data.telephone);
                $("#feInputNickName").val(data.nickName);
                $("#feRole").val(data.roleName);
                $("#feSex").val(data.sex);
                $("#AddOrUpdateAccount").html("更新用户");
                $("#feUsername").attr("disabled", "disabled");
            } else {
                alert("未找到此用户！");
            }
        },
        error: function (data) {
            alert("未找到此用户！");
        }
    });

}

function updateUser(user) {
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '/user/updateOneUser',
        async: false, // 需要同步请求数据
        data: {
            username: user.username,
            realName: user.realName,
            sex: user.sex,
            identification: user.identification,
            telephone: user.telephone,
            nickName: user.nickName,
            roleName: user.roleName
        },
        dataType: 'json',
        success: function (data) {
            if (data) {
                $("#feUsername").removeAttr("disabled", "disabled");
                alert("更新用户成功！");
            } else {
                alert("更新用户失败！");
            }
        },
        error: function (data) {
            alert("更新用户失败！");
        }
    });

}
