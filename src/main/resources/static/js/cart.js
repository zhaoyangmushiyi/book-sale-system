$(function () {
    findCart();
});

function findCart() {
    $.ajax({
        type: 'POST',
        url: `/cart/findCart`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let cartItemTBody = $("#tbody-cartItem").empty();
            if (data === null || data === "" || data.cartItems == null || data.cartItems.length === 0) {
                cartItemTBody.append("<p>购物车为空！</p>");
                return;
            }
            let cartItems = data.cartItems;
            let totalPrice = 0;
            cartItems.forEach(element => {
                let bookTotalPrice = element.bookPrice * element.bookCount;
                totalPrice += bookTotalPrice;
                let cartItem = "<tr>\n" +
                    "                                            <td class=\"product-name\"><input class='cartItem-checkbox' type=\"checkbox\" checked=\"checked\" value='" + element.id + "'/></td>\n" +
                    "                                            <td class=\"product-name\">" + element.bookName + "</td>\n" +
                    "                                            <td class=\"product-name\">" + element.bookAuthor + "</td>\n" +
                    "                                            <td class=\"product-price\"><span class=\"amount\">￥" + element.bookPrice + "</span></td>\n" +
                    "                                            <td class=\"product-quantity\"><input class='book-count' oninput='changeCartItemCount(" + element.id + ",this.value)' type=\"number\" value=\"" + element.bookCount + "\"></td>\n" +
                    "                                            <td class=\"product-subtotal\">￥" + bookTotalPrice + "</td>\n" +
                    "                                            <td class=\"product-remove\"><a href=\"#\" onclick=\"removeCartItem(" + element.id + ")\">X</a></td>\n" +
                    "                                        </tr>";
                cartItemTBody.append(cartItem);
            });
            $("#value-total-price").text("￥" + totalPrice);
        },
        error: function (xhr) {
            if (xhr.status === 200) {
                let cartItemTBody = $("#tbody-cartItem").empty();
                cartItemTBody.parent().parent().parent().parent().parent().parent().empty().append("<h1 style=\"text-align: center;\">购物车为空！</h1>");
            } else {
                alert("未知错误！");
            }
        }
    });
}

function removeCartItem(cateItemId) {
    $.ajax({
        type: 'POST',
        url: `/cart/removeCartItemById`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data:{
            id: cateItemId
        },
        success: function (data) {
            if (data === "success") {
                findCart();
            }else {
                alert(data);
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}

function changeCartItemCount(cateItemId, count) {
    if (count <= 0) {
        alert("数量不能小于1");
        return;
    }
    $.ajax({
        type: 'POST',
        url: `/cart/changeCartItemCountById`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data:{
            id: cateItemId,
            count: count
        },
        success: function (data) {
            if (data === "success") {
                findCart();
            }else {
                alert(data);
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}

function applyOrderInCart() {
    let cartItemIds = [];
    $(".cartItem-checkbox").each(function () {
        if ($(this).get(0).checked) {
            cartItemIds.push($(this).val());

        }
    })
    window.location.href = "checkout.html?cartItemIds=" + cartItemIds;
}