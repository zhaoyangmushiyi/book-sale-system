$(function () {
    getCurrentUser();
});
function changePassword() {
    // jquery 表单提交
    $("#user-change-password").ajaxSubmit(function(message) {
        alert(message);
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}
function changeUserInfo() {
    // jquery 表单提交
    $("#user-info").ajaxSubmit(function(message) {
        alert(message);
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}
function getCurrentUser() {
    $.ajax({
        type: 'POST',
        url: `/user/getCurrentUser`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            $("#value-userId").val(data.id);
            $("#value-nickName").val(data.nickName);
            $("#value-realName").val(data.realName);
            $("#value-telephone").val(data.telephone);
            $("#value-address").val(data.address);
            $(".value-username").text(data.nickName);
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}
