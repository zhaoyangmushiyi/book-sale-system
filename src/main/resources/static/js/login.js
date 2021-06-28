
(function () {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        (function () {
            // Make sure we trim BOM and NBSP
            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
                return this.replace(rtrim, '');
            };
        })();
    }

    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
        // in case the input is already filled..
        if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input--filled');
        }

        // events:
        inputEl.addEventListener('focus', onInputFocus);
        inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
            classie.remove(ev.target.parentNode, 'input--filled');
        }
    }
})();

$(function () {
    $('#login #login-password').focus(function () {
        $('.login-owl').addClass('password');
    }).blur(function () {
        $('.login-owl').removeClass('password');
    });
    $('#login #register-password').focus(function () {
        $('.register-owl').addClass('password');
    }).blur(function () {
        $('.register-owl').removeClass('password');
    });
    $('#login #register-repassword').focus(function () {
        $('.register-owl').addClass('password');
    }).blur(function () {
        $('.register-owl').removeClass('password');
    });
    $('#login #forget-password').focus(function () {
        $('.forget-owl').addClass('password');
    }).blur(function () {
        $('.forget-owl').removeClass('password');
    });
});

function goto_register() {
    $("#register-username").val("");
    $("#register-password").val("");
    $("#register-repassword").val("");
    $("#register-code").val("");
    $("#tab-2").prop("checked", true);
}

function goto_login() {
    $("#login-username").val("");
    $("#login-password").val("");
    $("#tab-1").prop("checked", true);
}

function goto_forget() {
    $("#forget-username").val("");
    $("#forget-password").val("");
    $("#forget-code").val("");
    $("#tab-3").prop("checked", true);
}

function phone_login() {
    $("#phone").val("");
    $("#verification-code").val("");
    $("#tab-6").prop("checked", true);
}

function goto_unlock() {
    $("#unlock-username").val("");
    // $("#forget-password").val("");
    $("#unlock-code").val("");
    $("#tab-4").prop("checked", true);
}

function getVerificationCode() {
    let phone = $("#phone").val();
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '../user/getVerificationCode',
        async: false, // 需要同步请求数据
        data: {
            phone: phone
        },
        dataType: 'text',
        success: function (data) {
            if (data !== "验证码已发送到手机，请尽快输入，验证码将于30分钟后失效！") {
                alert(data);
            } else {
                return false;
            }
            alert(data);
        },
        error: function (data) {
            alert("未知错误，请联系管理员！");
        }
    });
}


$(document).ready(function () {
    // $("#loading").html("<img src='/html/images/loading.gif' style='text-align:center;margin:0 auto;'></img><p style='color:#999;font-size:14px'>正在登陆，请稍后……</p>");
    // const query = window.location.search.substring(1) || '';
    // const email = query.split('email=')[1];
    // var token = query.split('code=')[1].split("?email")[0];
    // if (email != null && token != "") {
    //     sessionStorage.setItem("token", token);
    //     setEmail(email);
    // }
    const query = window.location.search.substring(1) || '';
    if (query != null && query.split('=')[0] === "error") {
        const errorCode = query.split('=')[1];
        switch (errorCode) {
            case "0":
                alert("密码错误，请重试！");
                break;
            case "1":
                alert("此用户不存在，请注册或联系管理员！");
                break;
            default:
                alert("未知错误！");
                break;
        }
    }
});

function login() {//登录
    var username = $("#login-username").val(),
        password = $("#login-password").val(),
        validatecode = null,
        flag = false;
    //判断用户名密码是否为空
    if (username === "") {
        $.pt({
            target: $("#login-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名不能为空"
        });
        flag = true;
    }
    if (password === "") {
        $.pt({
            target: $("#login-password"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "密码不能为空"
        });
        flag = true;
    }
    //用户名只能是15位以下的字母或数字
    var regExp = new RegExp("^[a-zA-Z0-9_]{1,15}$");
    if (!regExp.test(username)) {
        $.pt({
            target: $("#login-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名必须为15位以下的字母或数字"
        });
        flag = true;
    }

    if (flag) {
        return false;
    } else {//登录
        //调用后台登录验证的方法
        $.ajax({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
            url: '/user/login',
            async: false, // 需要同步请求数据
            data: {
                username: username,
                password: password
            },
            dataType: 'json',
            // success: function (data) {
            //     if (data.status) {
            //         window.location.href = "../user-management.html";
            //     } else {
            //         alert(data.errorMsg);
            //     }
            // },
            // error: function (data) {
            //     alert("账户名或密码错误");
            // },
            complete:
                function (XMLHttpRequest, textStatus) {
                    // 通过XMLHttpRequest取得响应头，sessionstatus
                    var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
                    if (sessionstatus === "TIMEOUT") {
                        var win = window;
                        while (win !== win.top) {
                            win = win.top;
                        }
                        win.location.href = XMLHttpRequest.getResponseHeader("CONTEXTPATH");
                    }
                    var temp = XMLHttpRequest.getResponseHeader("CONTEXTPATH");
                    win.location.href = XMLHttpRequest.getResponseHeader("CONTEXTPATH");

                }
        });
        return false;
    }
}

//注册
function register() {
    let username = $("#register-username").val(),
        password = $("#register-password").val(),
        rePassword = $("#register-repassword").val(),
        identification = $("#register-id").val(),
        telephone = $("#register-tel").val(),
        nickName = $("#register-nickName").val(),
        relname = $("#register-relname").val();
    let sex = $("#register-sex").val();
    let user = {};
    user.username = username;
    user.identification = identification;
    user.telephone = telephone;
    user.nickName = nickName;
    user.realName = relname;
    user.password = password;
    user.sex = sex;
    //判断用户名密码是否为空
    //用户名只能是15位以下的字母或数字
    const usernameRegExp = new RegExp("^[a-zA-Z0-9_]{6,15}$");
    if (username === "") {
        $.pt({
            target: $("#register-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名不能为空"
        });
        return;
    } else if (!usernameRegExp.test(username)) {
        $.pt({
            target: $("#register-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名必须为6~15位的字母或数字"
        });
        return;
    }
    //密码只能由6~15位的字母加数字组成
    const passwordRegExp = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,15}$");
    if (password === "") {
        $.pt({
            target: $("#register-password"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "密码不能为空"
        });
        return;
    } else if (!passwordRegExp.test(password)) {
        $.pt({
            target: $("#register-password"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "密码只能由6~15位的字母加数字组成"
        });
        return;
    } else {
        if (password !== rePassword) {
            $.pt({
                target: $("#register-repassword"),
                position: 'r',
                align: 't',
                width: 'auto',
                height: 'auto',
                content: "两次输入的密码不一致"
            });
            return;
        }
    }
    //检查身份证号码是否正确
    if (!checkIDCard(identification)) {
        $.pt({
            target: $("#register-id"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "身份证号码不正确"
        });
        return;
    }
    //判断电话号码是否为空
    if (telephone === "") {
        $.pt({
            target: $("#register-tel"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "电话号码不能为空"
        });
        return;
    }
    //判断昵称是否为空
    if (nickName === "") {
        $.pt({
            target: $("#register-nickName"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "昵称不能为空"
        });
        return;
    }
    //判断真实姓名是否为空
    if (relname === "") {
        $.pt({
            target: $("#register-relname"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "真实姓名不能为空"
        });
        return;
    }
    $.ajax({
        type: 'POST',
        contentType: 'application/json;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '../user/register',
        async: false, // 需要同步请求数据
        data: JSON.stringify(user),
        dataType: 'json',
        success: function (data) {
            // if (data.status) {
            // 	window.location.href = "../login.html";
            // } else {
            // 	alert(data.);
            // }
            if (!data) {
                alert("该用户名已存在！");
            } else {
                spop({
                    template: '<h4 class="spop-title">注册成功</h4>即将于3秒后返回登录',
                    position: 'top-center',
                    style: 'success',
                    autoclose: 3000,
                    onOpen: function () {
                        var second = 2;
                        var showPop = setInterval(function () {
                            if (second === 0) {
                                clearInterval(showPop);
                            }
                            $('.spop-body').html('<h4 class="spop-title">注册成功</h4>即将于' + second + '秒后返回登录');
                            second--;
                        }, 1000);
                    },
                    onClose: function () {
                        goto_login();
                    }
                });
                return false;
            }
        },
        error: function (data) {
            alert("xxx");
        }
    });

}

//重置密码
function forget() {
    const username = $("#forget-username").val(),
        password = $("#forget-password").val(),
        identification = $("#forget-identification").val();
    //判断用户名密码是否为空
    //用户名只能是15位以下的字母或数字
    const usernameRegExp = new RegExp("^[a-zA-Z0-9_]{6,15}$");
    if (username === "") {
        $.pt({
            target: $("#register-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名不能为空"
        });
        return;
    } else if (!usernameRegExp.test(username)) {
        $.pt({
            target: $("#register-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名必须为6~15位的字母或数字"
        });
        return;
    }
    if (password === "") {
        $.pt({
            target: $("#forget-password"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "密码不能为空"
        });
        return;
    }
    //检查身份证号码是否正确
    if (!checkIDCard(identification)) {
        $.pt({
            target: $("#register-id"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "身份证号码不正确"
        });
        return;
    }
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '../user/forgetPassword',
        async: false, // 需要同步请求数据
        data: {
            username: username,
            password: password,
            identification: identification
        },
        dataType: 'text',
        success: function (data) {
            if (data !== "重置密码成功！") {
                alert(data);
            } else {
                spop({
                    template: '<h4 class="spop-title">重置密码成功，</h4>即将于3秒后返回登录！',
                    position: 'top-center',
                    style: 'success',
                    autoclose: 3000,
                    onOpen: function () {
                        var second = 2;
                        var showPop = setInterval(function () {
                            if (second === 0) {
                                clearInterval(showPop);
                            }
                            $('.spop-body').html('<h4 class="spop-title">重置密码成功，</h4>即将于' + second + '秒后返回登录！');
                            second--;
                        }, 1000);
                    },
                    onClose: function () {
                        goto_login();
                    }
                });
                return false;
            }
        },
        error: function (data) {
            alert("未知错误，请联系管理员！");
        }
    });





    //
    // if(flag){
    // 	return false;
    // }else{//重置密码
    // 	spop({
    // 		template: '<h4 class="spop-title">重置密码成功</h4>即将于3秒后返回登录',
    // 		position: 'top-center',
    // 		style: 'success',
    // 		autoclose: 3000,
    // 		onOpen : function(){
    // 			var second = 2;
    // 			var showPop = setInterval(function(){
    // 				if(second == 0){
    // 					clearInterval(showPop);
    // 				}
    // 				$('.spop-body').html('<h4 class="spop-title">重置密码成功</h4>即将于'+second+'秒后返回登录');
    // 				second--;
    // 			},1000);
    // 		},
    // 		onClose : function(){
    // 			goto_login();
    // 		}
    // 	});
    // 	return false;
    // }
}

//申请解锁
function unlock() {
    const username = $("#unlock-username").val(),
        identification = $("#unlock-identification").val();
    //判断用户名密码是否为空
    //用户名只能是15位以下的字母或数字
    const usernameRegExp = new RegExp("^[a-zA-Z0-9_]{6,15}$");
    if (username === "") {
        $.pt({
            target: $("#register-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名不能为空"
        });
        return;
    } else if (!usernameRegExp.test(username)) {
        $.pt({
            target: $("#register-username"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "用户名必须为6~15位的字母或数字"
        });
        return;
    }
    //检查身份证号码是否正确
    if (!checkIDCard(identification)) {
        $.pt({
            target: $("#register-id"),
            position: 'r',
            align: 't',
            width: 'auto',
            height: 'auto',
            content: "身份证号码不正确"
        });
        return;
    }
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', // 发送信息至服务器时内容编码类型
        url: '../user/applyUnlock',
        async: false, // 需要同步请求数据
        data: {
            username: username,
            identification: identification
        },
        dataType: 'text',
        success: function (data) {
            if (data !== "申请解锁账号成功，请等待管理员审批！") {
                alert(data);
            } else {
                spop({
                    template: '<h4 class="spop-title">提交申请解锁账号请求成功，请等待管理员审核，审核成功后即可登录，</h4>即将于3秒后返回登录！',
                    position: 'top-center',
                    style: 'success',
                    autoclose: 3000,
                    onOpen: function () {
                        var second = 2;
                        var showPop = setInterval(function () {
                            if (second === 0) {
                                clearInterval(showPop);
                            }
                            $('.spop-body').html('<h4 class="spop-title">提交申请解锁账号请求成功，请等待管理员审核，审核成功后即可登录，</h4>即将于' + second + '秒后返回登录！');
                            second--;
                        }, 1000);
                    },
                    onClose: function () {
                        goto_login();
                    }
                });
                return false;
            }
        },
        error: function (data) {
            alert("未知错误，请联系管理员！");
        }
    });



}

// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
function checkIDCard(idcode) {
    // 加权因子
    var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = idcode + "";
    var last = idcode[17];//最后一个

    var seventeen = code.substring(0, 17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for (var i = 0; i < len; i++) {
        num = num + arr[i] * weight_factor[i];
    }

    // 获取余数
    var resisue = num % 11;
    var last_no = check_code[resisue];

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    var format = idcard_patter.test(idcode);

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format;
}
