let orderType = 1;
let page = 0;
let size = 10;
let total = 0;
let pageNumber = 0;
$(function () {
    findUserCount();
    findConsumptionStatisticsSortedByStatus(orderType, page);
});

function findConsumptionStatisticsSortedByStatus(orderType, page) {
    $.ajax({
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        url: '/admin/user/findConsumptionStatisticsSortedByStatus',
        async: false, // 需要同步请求数据
        dataType: 'json',
        data: {
            orderType: orderType,
            page: page,
            size: size
        },
        success: function (data) {
            const orders = data;
            let index = page * size;
            let user = "";
            orders.forEach(element => {
                user += "<tr class=\"" + element.id + "\">" + "<th scope=\"col\" class=\"border-0\">" + (++index) + "</th>";
                user += "<th scope=\"col\" class=\"border-0\">" + element.username + "</th>";
                user += "<th scope=\"col\" class=\"border-0\">￥" + element.consumption + "元</th>";
                user += "<th scope=\"col\" class=\"border-0\">" + dateFormat("YYYY-mm-dd HH:MM", new Date(element.addDate)) + "</th>";
                user += "<th scope=\"col\" class=\"border-0\">" + element.vip + "</th>";
                user += "</tr>";
            });
            $('#table-user tbody').empty().append(user);
        },
        error: function (data) {
            alert("未知错误！");
        }
    });
}
function findUserCount() {
    $.ajax({
        type: 'POST',
        url: `/admin/user/findUserCount`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
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
                    findConsumptionStatisticsSortedByStatus(orderType, page - 1);
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

function setStatus(s) {
    orderType = s;
    page = 0;
    findUserCount();
    findConsumptionStatisticsSortedByStatus(orderType, page);
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