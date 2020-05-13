function importActiveJs() {
    const oHead = document.getElementsByTagName('HEAD').item(0);
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src="js/active.js";
    oHead.appendChild(oScript);
}

function getCart() {
    $.ajax({
        type: 'POST',
        url: `/cart/findCart`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let miniProduct = $(".miniproduct").empty();
            if (data === null || data === "" || data.cartItems == null || data.cartItems === "") {
                miniProduct.append("<p>购物车为空！</p>");
                return;
            }
            let cartItems = data.cartItems;
            let totalPrice = 0;
            cartItems.forEach(element => {
                let bookTotalPrice = element.bookPrice * element.bookCount;
                totalPrice += bookTotalPrice;
                let cartItem = "<div class=\"item01 d-flex\">\n" +
                    // "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"thumb\">\n" +
                    // // "\t\t\t\t\t\t\t\t\t\t\t\t\t<img src=\"" + element.image + "?x-oss-process=image/resize,w_75" + "\" alt=\"product images\">\n" +
                    // "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<h6>" + element.bookName + "</h6>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"prize\">$" + element.bookPrice + "</span>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"product_prize d-flex justify-content-between\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"qun\">数量: " + element.bookCount + "</span>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"d-flex justify-content-end\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a href=\"javascript:removeCartItem(" + element.id + ");\"><i class=\"zmdi zmdi-delete\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>";
                miniProduct.append(cartItem);
            });
            $("#value-item-count").text(cartItems.length + "  件");
            $(".product_qun").text(cartItems.length);
            $(".total_amount span").text("￥" + totalPrice);
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
                getCart();
            }else {
                alert(data);
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}
$(function () {
    findAllBookCategoriesInHeader();
    getCurrentUser();
    getCart();
});
function findAllBookCategoriesInHeader() {
    $.ajax({
        type: 'POST',
        url: `/category/findAllCategory`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let bookCategoriesDiv = $("#ul-book-categories").empty().append("<li class=\"title\">图书类别</li>");
            data.forEach(element => {
                bookCategoriesDiv.append("<li><a href=\"shop-grid.html?categoryId=" + element.id + "\">" + element.name + "</a></li>");
            });
        },
        error: function (xhr) {
        }
    });
}

function addBookToCart(bookId) {
    $.ajax({
        type: 'POST',
        url: `/book/addBookToCart`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'text',
        data:{
            bookId: bookId
        },
        success: function (data) {
            if (data === "添加到购物车成功！") {
                getCart();
            } else {
                alert(data);
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}

function addBookToOrder(bookId) {
    window.location = "/checkout.html?bookId=" + bookId;
    // $.ajax({
    //     type: 'POST',
    //     url: `/book/addBookToOrder`,
    //     contentType: 'application/x-www-form-urlencoded; charset=utf-8',
    //     dataType: 'text',
    //     data:{
    //         bookId: bookId
    //     },
    //     success: function (data) {
    //         if (data === "success") {
    //             window.location = "/checkout.html?bookId=" + bookId;
    //         }else {
    //             alert(data);
    //         }
    //     },
    //     error: function (xhr) {
    //         alert("未知错误！");
    //     }
    // });
}

function getCurrentUser() {
    $.ajax({
        type: 'POST',
        url: `/user/getCurrentUser`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let vip = data.vip;
            if (vip !== "普通会员") {
                $(".value-username").text(data.nickName + "  |  " + vip);
            } else {
                $(".value-username").text(data.nickName+"|");
            }
        },
        error: function (xhr) {
            alert("未知错误！");
        }
    });
}

