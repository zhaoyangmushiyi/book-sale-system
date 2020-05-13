$(function () {
    getOrder();
});
function confirmReceipt(id) {
    $.ajax({
        type: 'POST',
        url: `/order/confirmReceipt`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data:{
            id: id
        },
        success: function (data) {
            if (data === "success") {
                getOrder();
            } else {
                alert(data);
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}
function getOrder() {
    $.ajax({
        type: 'POST',
        url: `/order/getOrder`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let orderBody = $("#tbody-order").empty();
            if (data === null || data === "") {
                alert("订单为空！请先选购书籍");
                window.location.href = "shop-grid.html";
                return;
            }
            data.forEach(element => {
                let order = "<tr>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<td class=\"product-name\"><span class=\"nobr\">" + element.orderNumber + "</span></td>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<td class=\"product-name\"><span class=\"nobr\">" + element.products + "</span></td>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<td class=\"product-name\"><span class=\"nobr\">" + element.receiver + "</span></td>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<td class=\"product-name\"><span class=\"nobr\">" + element.receiveAddress + "</span></td>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<td class=\"product-price\"><span class=\"nobr\">" + element.total + "</span></td>\n";
                let statusName;
                let operation = "";
                switch (element.status) {
                    case 1:
                        statusName = "已支付";
                        operation = "</tr>";
                        break;
                    case 2:
                        statusName = "已发货";
                        operation = "\t\t\t\t\t\t\t\t\t\t<td class=\"product-add-to-cart\"><a href=\"javascript:confirmReceipt(" + element.id + ")\">确认收货</a></td>\n" +
                            "\t\t\t\t\t\t\t\t\t</tr>";
                        break;
                    case 3:
                        statusName = "已收货";
                        operation = "</tr>"
                        break;
                }
                order += "\t\t\t\t\t\t\t\t\t\t<td class=\"product-stock-stauts\"><span class=\"wishlist-in-stock\">" + statusName + "</span></td>\n";
                if (element.logisticsNumber === null) {
                    order += "\t\t\t\t\t\t\t\t\t\t<td class=\"product-name\"><span class=\"wishlist-in-stock\">\\</span></td>\n";
                } else {
                    order += "\t\t\t\t\t\t\t\t\t\t<td class=\"product-name\"><span class=\"wishlist-in-stock\">" + element.logisticsNumber + "</span></td>\n";
                }
                order += operation;
                orderBody.append(order);
            });
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}
