let status = 0;
let page = 0;
let size = 10;
let total = 0;
let pageNumber = 0;
$(function () {
    findOrderCountByStatus(status);
    findOrdersByStatus(status, page);
});

function findOrdersByStatus(status, page) {
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        url: '/admin/order/findOrdersByStatus',
        async: false, // 需要同步请求数据
        dataType: 'json',
        data: {
            status: status,
            page: page,
            size: size
        },
        success: function (data) {
            const orders = data;
            let index = page * size;
            let order = "";
            orders.forEach(element => {
                order += "<tr class=\"" + element.id + "\">" + "<th scope=\"col\" class=\"border-0\">" + (++index) + "</th>";
                let statusName;
                let operation = "";
                switch (element.status) {
                    case 1:
                        statusName = "已支付";
                        operation = "<th scope=\"col\" class=\"border-0\" style=\"padding:0.65rem 0.25rem;\"><button onclick='ship(" + element.id + ")' class =\"btn btn-outline-accent btn-car-edit\">发货</button><button onclick='editOrder(" + element.id + ")' class =\"btn btn-outline-accent\">编辑</button></th>" + "</tr>";
                        break;
                    case 2:
                        statusName = "已发货";
                        operation = "<th scope=\"col\" class=\"border-0\" style=\"padding:0.65rem 0.25rem;\"><button onclick='editOrder(" + element.id + ")' class =\"btn btn-outline-accent\">编辑</button></th>" + "</tr>";
                        break;
                    case 3:
                        statusName = "已收货";
                        operation = "</tr>";
                        break;
                }
                order += "<th scope=\"col\" class=\"border-0\">" + element.orderNumber + "</th>";
                order += "<th scope=\"col\" class=\"border-0\">" + dateFormat("YYYY-mm-dd HH:MM", new Date(element.addDate)) + "</th>";
                order += "<th scope=\"col\" class=\"border-0\">" + element.receiver + "</th>";
                order += "<th scope=\"col\" class=\"border-0\">" + element.receiveAddress + "</th>";
                order += "<th scope=\"col\" class=\"border-0\">" + element.receiveTelephone + "</th>";
                order += "<th scope=\"col\" class=\"border-0\">￥" + element.total + "</th>";
                order += "<th scope=\"col\" class=\"border-0\">" + statusName + "</th>";
                order += operation;
            });
            $('#table-order tbody').empty().append(order);
        },
        error: function (data) {
            alert("未知错误！");
        }
    });
}
function findOrderCountByStatus(typeId) {
    $.ajax({
        type: 'POST',
        url: `/admin/order/findOrderCountByStatus`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            status: status
        },
        success: function (data) {
            total = data;
            $("#pagination").pagination({ //totalData代表数据总数，比如查询数据库得到200条数据，同常定义为全局变量,
                //由后台查询得到的个数决定。
                /*当前页码*/
                currentPage: pageNumber + 1,
                /*总共有多少页*/
                totalPage: Math.ceil(total / size),
                callback: function (page) {  //回调函数中的data表示，当前点击的页面，但是有一点需要注意，data的值永远比当前点击数小1
                    //比如，当前点击的2，则data返回的值为1，点击1时，返回值为0，
                    //需要我们后台对其中的逻辑关系进行处理
                    findOrdersByStatus(typeId, page - 1);
                },
                num_edge_entries: 1,  //两侧显示的首尾分页的条目数
                num_display_entries: 4,  //连续分页主体部分显示的分页条目数
                items_per_page: size //每页显示数据的数量
            });
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function ship(id) {
    let logisticsNumber = prompt("请输入订单号", "");
    if (logisticsNumber === null || logisticsNumber === "") {
        return;
    }
    $.ajax({
        type: 'POST',
        url: `/admin/order/ship`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data: {
            id: id,
            logisticsNumber: logisticsNumber
        },
        success: function (data) {
            if (data === "success") {
                findOrdersByStatus(status, page, size);
            }else {
                alert(data);
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}

function returnCar(id) {
    $.ajax({
        type: 'POST',
        url: `/order/returnCar`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data: {
            id: id
        },
        success: function (data) {
            if (data === "success") {
            }else {
                alert(data);
            }
            findOrdersByStatus(status, page, size);
        },
        error: function (xhr) {
        }
    });
}

function setStatus(s) {
    status = s;
    page = 0;
    findOrderCountByStatus(status);
    findOrdersByStatus(status, page);
}
function updateOrder() {

    let orderNumber = $("#feOrderNumber").val();
    if (orderNumber === "") {
        alert("订单号不能为空");
        return;
    }
    let feReceiver = $("#feReceiver").val();
    if (feReceiver === "") {
        alert("收货人不能为空");
        return;
    }
    let feReceiveAddress = $("#feReceiveAddress").val();
    if (feReceiveAddress === "") {
        alert("收货地址不能为空");
        return;
    }
    let feReceiveTelephone= $("#feReceiveTelephone").val();
    if (feReceiveTelephone === "") {
        alert("电话号码不能为空");
        return;
    }
    // jquery 表单提交
    $("#form-order-update").ajaxSubmit(function(message) {
        if (message === "success") {
            forwardOrderList();
            findOrdersByStatus(status, page);
        } else {
            alert(message);
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}
function editOrder(id) {
    $(".order-edit").css("display", "block");
    $(".order-list").css("display", "none");
    $.ajax({
        type: 'POST',
        url: `/admin/order/findOrderById`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            id: id
        },
        success: function (data) {
            $("#feId").val(data.id);
            $("#feOrderNumber").val(data.orderNumber);
            $("#feReceiver").val(data.receiver);
            $("#feReceiveAddress").val(data.receiveAddress);
            $("#feReceiveTelephone").val(data.receiveTelephone);
            $("#feLogisticsNumber").val(data.logisticsNumber);
        },
        error: function (xhr) {
            alert("未知错误");
        }
    });
}

function forwardOrderList() {
    $(".order-edit").css("display", "none");
    $(".order-list").css("display", "block");
}

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),     // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}