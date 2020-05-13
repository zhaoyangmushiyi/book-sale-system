let categoryId = 0;
let pageNumber = 0;
let pageSize = 12;
let total = 0;
let orderType = 1;

$(function () {
    const category = window.location.search.substring(1) || '';
    if (category != null && category !== "") {
        categoryId = category.split('&')[0].split('=')[1];
    }
    findBookCountByCategoryId(categoryId);
    findAllBookCategories();
});

function findAllBookCategories() {
    $.ajax({
        type: 'POST',
        url: `/category/findAllCategory`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let bookCategoriesDiv = $("#ul-category").empty();
            bookCategoriesDiv.append("<li><a href='#' onclick='forwardFindBookByCategoryId(0)'>全部</a></li>");
            data.forEach(element => {
                bookCategoriesDiv.append("<li><a href='#' onclick='forwardFindBookByCategoryId(" + element.id + ")'>" + element.name + "</a></li>");
            });
            findBookByCategoryId(categoryId, pageNumber, pageSize);
        },
        error: function (xhr) {
        }
    });
}

function findBookByCategoryId(categoryId, pageNumber, pageSize) {
    $.ajax({
        type: 'POST',
        url: `/book/findBookByCategoryId`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            categoryId: categoryId,
            pageNumber: pageNumber,
            pageSize: pageSize,
            sort: orderType
        },
        success: function (data) {
            let booksGridDiv = $("#div-books-grid").empty();
            let booksListDiv = $("#div-books-list").empty();
            const books = data;
            let index = pageNumber * pageSize;
            books.forEach(element => {
                let booksGrid = "<div class=\"col-lg-4 col-md-4 col-sm-6 col-12\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"product product__style--3\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"product__thumb\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<img src=\"" + element.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product image\" width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<ul class=\"prize position__right__bottom d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<li>￥" + element.price + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"product__content content--center\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<h4>" + element.name + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<h4>作者：" + element.author + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"action\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"actions_inner\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"add_to_links\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"cart\" onclick='addBookToOrder(" + element.id + ")' href=\"#\"><i class=\"bi bi-shopping-bag4\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"wishlist\" onclick=\"addBookToCart(" + element.id + ")\" href=\"#\"><i class=\"bi bi-shopping-cart-full\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"product__hover--content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"rating d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li>库存：" + element.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>";
                let booksList = "<div class=\"list__view mt--40\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"thumb\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<img src=\"" + element.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product images\"  width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<h2>" + element.name + "</h2>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<h4>作者：" + element.author + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"prize__box\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li class=\"prize\">￥" + element.price + "</li>\n<li class=\"\">&nbsp;&nbsp;&nbsp;&nbsp;库存" + element.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"cart__action d-flex mt--100\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li class=\"cart\"><a onclick=\"addBookToCart(" + element.id + ")\" href=\"#\">添加到购物车</a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li class=\"cart\"><a onclick=\"buy(" + element.id + ")\" href=\"#\">直接购买</a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>";
                booksGridDiv.append(booksGrid);
                booksListDiv.append(booksList);
            });
            // importActiveJs();
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function findBookCountByCategoryId(categoryId) {
    $.ajax({
        type: 'POST',
        url: `/book/findBookCountByCategoryId`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            categoryId: categoryId
        },
        success: function (data) {
            total = data;
            // $("#value-count").html(total);
            // book_page_total = Math.ceil(total / pageSize);
            // pageNumber = 0;
            // let book_page_select = $("#select-book-page").empty();
            // for (let i = 1; i <= book_page_total; i++) {
            //     book_page_select.append("<option value='" + (i - 1) + "'>" + i + "</option>");
            // }
            findBookByCategoryId(categoryId, pageNumber, pageSize);
            $("#pagination").pagination({ //totalData代表数据总数，比如查询数据库得到200条数据，同常定义为全局变量,
                //由后台查询得到的个数决定。
                /*当前页码*/
                currentPage: pageNumber + 1,
                /*总共有多少页*/
                totalPage: Math.ceil(total/pageSize),
                callback:function(page){  //回调函数中的data表示，当前点击的页面，但是有一点需要注意，data的值永远比当前点击数小1
                    //比如，当前点击的2，则data返回的值为1，点击1时，返回值为0，
                    //需要我们后台对其中的逻辑关系进行处理
                    findBookByCategoryId(categoryId, page - 1, pageSize);  //回调函数的处理事件，点击“页码”时，触发事件的处理方法，包括前端处理方法或者后端处理方法
                },
                num_edge_entries: 1,  //两侧显示的首尾分页的条目数
                num_display_entries: 4,  //连续分页主体部分显示的分页条目数
                items_per_page:12 //每页显示数据的数量
            });
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function searchBook() {
    let name = $(".field__search input").val();
    if (name === "") {
        return;
    }
    $.ajax({
        type: 'POST',
        url: `/book/searchBook`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            name: name,
            pageNumber: pageNumber,
            pageSize: pageSize,
            sort: orderType
        },
        success: function (data) {
            if (data === null || data.length === 0) {
                alert("未找到书籍");
                return;
            }
            $(".close__wrap").click();
            $("#pagination").empty();
            let booksGridDiv = $("#div-books-grid").empty();
            let booksListDiv = $("#div-books-list").empty();
            data.forEach(element => {
                let booksGrid = "<div class=\"col-lg-4 col-md-4 col-sm-6 col-12\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"product product__style--3\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"product__thumb\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<img src=\"" + element.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product image\" width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<ul class=\"prize position__right__bottom d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<li>￥" + element.price + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"product__content content--center\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<h4>" + element.name + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<h4>作者：" + element.author + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"action\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"actions_inner\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"add_to_links\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"cart\" onclick='addBookToOrder(" + element.id + ")' href=\"#\"><i class=\"bi bi-shopping-bag4\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"wishlist\" onclick=\"addBookToCart(" + element.id + ")\" href=\"#\"><i class=\"bi bi-shopping-cart-full\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"product__hover--content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"rating d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li>库存：" + element.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>";
                let booksList = "<div class=\"list__view mt--40\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"thumb\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<img src=\"" + element.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product images\"  width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<h2>" + element.name + "</h2>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<h4>作者：" + element.author + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"prize__box\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li class=\"prize\">￥" + element.price + "</li>\n<li class=\"\">&nbsp;&nbsp;&nbsp;&nbsp;库存" + element.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"cart__action d-flex mt--100\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li class=\"cart\"><a onclick=\"addBookToCart(" + element.id + ")\" href=\"#\">添加到购物车</a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li class=\"cart\"><a onclick=\"buy(" + element.id + ")\" href=\"#\">直接购买</a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>";
                booksGridDiv.append(booksGrid);
                booksListDiv.append(booksList);
            });
        },
        error: function (xhr) {
            alert("未知错误");
        }
    });

}

function forwardFindBookByCategoryId(categoryId) {

    pageNumber = 0;
    findBookCountByCategoryId(categoryId);
}

function setOrderType(order) {
    orderType = order;
    findBookCountByCategoryId(categoryId);
}