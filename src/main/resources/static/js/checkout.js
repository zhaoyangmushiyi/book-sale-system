let discount = 1;
let orderType = 0;
let bookId;
let cartItemIds;

$(function () {
    const search = window.location.search.substring(1) || '';

    if (search != null && search !== "") {
        let searchType = search.split("=")[0];
        let searchId = search.split("=")[1];
        if (searchType === "bookId") {
            orderType = 1;
            bookId = searchId;
            $.ajax({
                type: 'POST',
                url: `/user/getCurrentUser`,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    $("#value-receiver").val(data.realName);
                    $("#value-receive-address").val(data.address);
                    $("#value-receive-telephone").val(data.telephone);
                    if (data.vip === "普通会员") {
                    } else {
                        $("#if-is-vip").attr("style", "display:block");
                        if (data.vip === "银卡会员") {
                            $("#if-is-vip span").text("银卡会员97折")
                            discount = 0.97;
                        }else if (data.vip === "金卡会员") {
                            $("#if-is-vip span").text("金卡会员打95折")
                            discount = 0.95;
                        }else if (data.vip === "钻石会员") {
                            $("#if-is-vip span").text("钻石会员打9折")
                            discount = 0.9;
                        }
                    }
                    findBookByBookId(bookId);
                },
                error: function (xhr) {
                    alert("未知错误！");
                    window.location.href = "shop-grid.html";
                }
            });
        }else if (searchType === "cartItemIds") {
            orderType = 2;
            cartItemIds = searchId;
            $.ajax({
                type: 'POST',
                url: `/user/getCurrentUser`,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                success: function (data) {
                    $("#value-receiver").val(data.realName);
                    $("#value-receive-address").val(data.address);
                    $("#value-receive-telephone").val(data.telephone);
                    if (data.vip === "普通会员") {
                    } else {
                        $("#if-is-vip").attr("style", "display:block");
                        if (data.vip === "银卡会员") {
                            $("#if-is-vip span").text("银卡会员97折")
                            discount = 0.97;
                        }else if (data.vip === "金卡会员") {
                            $("#if-is-vip span").text("金卡会员打95折")
                            discount = 0.95;
                        }else if (data.vip === "钻石会员") {
                            $("#if-is-vip span").text("钻石会员打9折")
                            discount = 0.9;
                        }
                    }
                    findCartItemsByCartItemIds(cartItemIds);
                },
                error: function (xhr) {
                    alert("未知错误！");
                    window.location.href = "shop-grid.html";
                }
            });
        }


    } else {
        getCurrentUserInOrder();
    }
});


function findBookByBookId(bookId) {
    $.ajax({
        type: 'POST',
        url: `/book/findBookById`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            id: bookId
        },
        success: function (data) {
            let cartItemBody = $(".order_product").empty();
            let cartItem = "<li>" + data.name + " × 1" + "<span>￥" + data.price + "</span></li>";
            cartItemBody.append(cartItem);
            let discountPrice = discount * data.price;
            $("#value-order-total span").text("￥" + discountPrice.toFixed(2));
        },
        error: function (xhr) {
            alert("未知错误！");
            window.location.href = "shop-grid.html";
        }
    });

}


function findCart() {
    $.ajax({
        type: 'POST',
        url: `/cart/findCart`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let cartItemBody = $(".order_product").empty();
            if (data === null || data === "" || data.cartItems == null || data.cartItems === "") {
                alert("购物车为空！请先选购书籍");
                window.location.href = "shop-grid.html";
                return;
            }
            let cartItems = data.cartItems;
            let totalPrice = 0;
            cartItems.forEach(element => {
                let bookTotalPrice = element.bookPrice * element.bookCount;
                totalPrice += bookTotalPrice;
                let cartItem = "<li>" + element.bookName + " × " + element.bookCount + "<span>￥" + bookTotalPrice + "</span></li>";
                cartItemBody.append(cartItem);
            });
            let discountPrice = discount * totalPrice;
            $("#value-order-total span").text("￥" + discountPrice.toFixed(2));
        },
        error: function (xhr) {
            if (xhr.status === 200) {
                alert("购物车为空！请先选购书籍");
                window.location.href = "shop-grid.html";
            } else {
                alert("未知错误！");
                window.location.href = "shop-grid.html";
            }
        }
    });
}

function getCurrentUserInOrder() {
    $.ajax({
        type: 'POST',
        url: `/user/getCurrentUser`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {

            $("#value-receiver").val(data.realName);
            $("#value-receive-address").val(data.address);
            $("#value-receive-telephone").val(data.telephone);
            if (data.vip === "普通会员") {
            } else {
                $("#if-is-vip").attr("style", "display:block");
                if (data.vip === "银卡会员") {
                    $("#if-is-vip span").text("银卡会员打97折")
                    discount = 0.97;
                }else if (data.vip === "金卡会员") {
                    $("#if-is-vip span").text("金卡会员打95折")
                    discount = 0.95;
                }else if (data.vip === "钻石会员") {
                    $("#if-is-vip span").text("钻石会员打9折")
                    discount = 0.9;
                }
            }
            findCart();
        },
        error: function (xhr) {
            alert("未知错误！");
            window.location.href = "shop-grid.html";
        }
    });
}


function findCartItemsByCartItemIds(cartItemIds) {
    $.ajax({
        type: 'POST',
        url: `/cart/findCartItemsByCartItemIds`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            cartItemIds: cartItemIds
        },
        success: function (data) {
            if (data === null || data.length === 0) {
                alert("订单里没有图书，请选择图书后提交订单！");
                window.location.href = "cart.html";
            }
            let cartItemBody = $(".order_product").empty();
            let cartItems = data;
            let totalPrice = 0;
            cartItems.forEach(element => {
                let bookTotalPrice = element.bookPrice * element.bookCount;
                totalPrice += bookTotalPrice;
                let cartItem = "<li>" + element.bookName + " × " + element.bookCount + "<span>￥" + bookTotalPrice + "</span></li>";
                cartItemBody.append(cartItem);
            });
            let discountPrice = discount * totalPrice;
            $("#value-order-total span").text("￥" + discountPrice.toFixed(2));
        },
        error: function (xhr) {
            alert("未知错误！");
            window.location.href = "shop-grid.html";
        }
    });
}


function applyOrder() {
    let order = {};
    if ($("#value-receiver").val() === null || $("#value-receiver").val() === "") {
        alert("请输入收货人姓名");
        return;
    }
    if ($("#value-receive-address").val() === null || $("#value-receive-address").val() === "") {
        alert("请输入收货人地址");
        return;
    }
    if ($("#value-receive-telephone").val() === null || $("#value-receive-telephone").val() === "") {
        alert("请输入收货人电话号码");
        return;
    }
    order.receiver = $("#value-receiver").val();
    order.receiveAddress = $("#value-receive-address").val();
    order.receiveTelephone = $("#value-receive-telephone").val();
    order.receivePostcode = $("#value-receive-postcode").val();;
    order.total = $("#value-order-total span").text().substr(1);

    if (orderType === 0) {
        $.ajax({
            type: 'POST',
            url: `/order/applyOrder`,
            contentType: 'application/json;charset=UTF-8', // 发送信息至服务器时内容编码类型
            dataType: 'text',
            data: JSON.stringify(order),
            success: function (data) {
                if (data === "success") {
                    window.location.href = "my-order.html";
                } else {
                    alert(data);
                }
            },
            error: function (xhr) {
                alert("未知错误！");
            }
        });
    } else if (orderType === 1) {
        $.ajax({
            type: 'POST',
            url: `/order/applyOrderSingle?bookId=` + bookId,
            contentType: 'application/json;charset=UTF-8', // 发送信息至服务器时内容编码类型
            dataType: 'text',
            data: JSON.stringify(order),
            success: function (data) {
                if (data === "success") {
                    window.location.href = "my-order.html";
                } else {
                    alert(data);
                }
            },
            error: function (xhr) {
                alert("未知错误！");
            }
        });
    }else if (orderType === 2) {
        $.ajax({
            type: 'POST',
            url: `/order/applyOrderByCartItemIds?cartItemIds=` + cartItemIds,
            contentType: 'application/json;charset=UTF-8', // 发送信息至服务器时内容编码类型
            dataType: 'text',
            data: JSON.stringify(order),
            success: function (data) {
                if (data === "success") {
                    window.location.href = "my-order.html";
                } else {
                    alert(data);
                }
            },
            error: function (xhr) {
                alert("未知错误！");
            }
        });
    }

}