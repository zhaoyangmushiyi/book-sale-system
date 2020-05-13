$(function () {
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '/user/findUserByUsername',
        async: false, // 需要同步请求数据
        data: {
            username: sessionStorage.getItem("username")
        },
        dataType: 'json',
        success: function (data) {
            if (data === null || data === "") {
                alert("获取信息失败！");
            } else {
                $("#feUsername").val(data.username);
                $("#feRelname").val(data.realName);
                $("#feIdentification").val(data.identification);
                $("#feSex").val(data.sex);
                $("#feTelephone").val(data.telephone);
                // $("#feAddress").val(data.address);
                $("#feUsername-hide").val(data.username);
            }
        },
        error: function (data) {
            alert("获取信息失败！");
        }
    });
});


function uploadImage() {
    // jquery 表单提交
    $("#user-info").ajaxSubmit(function(message) {
        if (message) {
            alert("更新个人信息成功！");
        } else {
            alert("更新个人信息失败！");
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}