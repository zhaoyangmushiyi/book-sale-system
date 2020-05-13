$(function () {
    findNewBooks();
    // importActiveJs();
    // getAllCategories();
    // // findBookByCategoryId(categoryId, pageNumber, pageSize);
    // $("#btn-page-next").click(function () {
    //     pageNumber++;
    //     setBookPage(total, pageNumber, book_page_total);
    // });
    // $("#btn-page-prev").click(function () {
    //     pageNumber--;
    //     setBookPage(total, pageNumber, book_page_total);
    // });
});

function findNewBooks() {
    $.ajax({
        type: 'POST',
        url: `/book/findNewBooks`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            // for (let i = 0; i < 6; i++) {
            //     const book = data[i];
            //     $("#value-new-book-" + (i + 1) + "").text(book.name);
            //     $("#value-new-book-price-" + (i + 1) + "").text("￥"+book.price);
            //     $("#value-new-book-count-" + (i + 1) + "").text("库存：" + book.count);
            //     $("#img-new-book-" + (i + 1) + "").attr("src", book.image);
            //     $("#value-new-book-id-" + (i + 1) + "").text(book.id);
            // }
            let newBookDiv = $("#div-new-book").empty();
            data.forEach(element => {
                let bookStr = "<div class=\"product product__style--3\">\n" +
                    "\t\t\t\t\t\t<input id=\"value-new-book-id-1\" type=\"hidden\" name=\"bookId\" value=\"" + element.id + "\">\n" +
                    "\t\t\t\t\t\t<div class=\"col-lg-3 col-md-4 col-sm-6 col-12\">\n" +
                    "\t\t\t\t\t\t\t<div class=\"product__thumb\">\n" +
                    "\t\t\t\t\t\t\t\t<img id=\"img-new-book-1\" src=\"" + element.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product image\" width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t<div class=\"hot__box\">\n" +
                    "\t\t\t\t\t\t\t\t\t<span class=\"hot-label\">新</span>\n" +
                    "\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t<div class=\"product__content content--center\">\n" +
                    "\t\t\t\t\t\t\t\t<h4 id=\"value-new-book-1\">" + element.name + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t<ul class=\"prize d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t<li id=\"value-new-book-price-1\">￥" + element.price + "</li>\n" +
                    "\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t<div class=\"action\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"actions_inner\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"add_to_links\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"cart\" onclick=\"addBookToOrder(" + element.id + ")\" href=\"#\"><i class=\"bi bi-shopping-bag4\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"wishlist\" onclick=\"addBookToCart(" + element.id + ")\" href=\"#\"><i class=\"bi bi-shopping-cart-full\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t<div class=\"product__hover--content\">\n" +
                    "\t\t\t\t\t\t\t\t\t<ul class=\"rating d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<li id=\"value-new-book-count-1\">库存：" + element.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t</div>";
                newBookDiv.append(bookStr);

            });
            findAllBookCategories();
        },
        error: function (xhr) {
        }
    });
}

function findBestBooksByCategoryId(categoryId) {
    $.ajax({
        type: 'POST',
        url: `/book/findBestBooksByCategoryId`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        data: {
            categoryId: categoryId
        },
        success: function (data) {
            // for (let i = 0; i < 6; i++) {
            //     const book = data[i];
            //     $("#value-new-book-" + (i + 1) + "").text(book.name);
            //     $("#value-new-book-price-" + (i + 1) + "").text("￥"+book.price);
            //     $("#value-new-book-count-" + (i + 1) + "").text("库存：" + book.count);
            //     $("#img-new-book-" + (i + 1) + "").attr("src", book.image);
            //     $("#value-new-book-id-" + (i + 1) + "").text(book.id);
            // }
            let bestBookDiv;
            if (categoryId === 0) {
                bestBookDiv = $("#nav-all").empty();
            }else {
                bestBookDiv = $("#nav-" + categoryId + "").empty();
            }
            let bookStr = "<div class=\"product__indicator--4 arrows_style owl-carousel owl-theme\">";
            for (let i = 0; i < data.length / 2; i++) {
                let book1 = data[i * 2];
                let book2 = data[i * 2 + 1];
                bookStr += "\n" +
                    "\t\t\t\t\t\t<div class=\"single__product\">\n" +
                    "\t\t\t\t\t\t\t<!-- Start Single Product -->\n" +
                    "\t\t\t\t\t\t\t<div class=\"col-lg-3 col-md-4 col-sm-6 col-12\">\n" +
                    "\t\t\t\t\t\t\t\t<div class=\"product product__style--3\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"product__thumb\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<img src=\"" + book1.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product image\" width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"hot__box\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"hot-label\">热销</span>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"product__content content--center content--center\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<h4>" + book1.name + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"prize d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li>￥" + book1.price + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"action\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"actions_inner\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"add_to_links\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"cart\" onclick=\"addBookToOrder(" + book1.id + ")\" href=\"#\"><i class=\"bi bi-shopping-bag4\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"wishlist\" onclick=\"addBookToCart(" + book1.id + ")\" href=\"#\"><i class=\"bi bi-shopping-cart-full\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"product__hover--content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<ul class=\"rating d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<li>库存：" + book1.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t<!-- Start Single Product -->\n" +
                    "\t\t\t\t\t\t\t<!-- Start Single Product -->\n" +
                    "\t\t\t\t\t\t\t<div class=\"col-lg-3 col-md-4 col-sm-6 col-12\">\n" +
                    "\t\t\t\t\t\t\t\t<div class=\"product product__style--3\">\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"product__thumb\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<img src=\"" + book2.image + "?x-oss-process=image/resize,w_210" + "\" alt=\"product image\"  width='210' height='270'>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"hot__box\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<span class=\"hot-label\">热销</span>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"product__content content--center content--center\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t<h4>" + book2.name + "</h4>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<ul class=\"prize d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<li>￥" + book2.price + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"action\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<div class=\"actions_inner\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"add_to_links\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"cart\" onclick=\"addBookToCart(" + book2.id + ")\" href=\"#\"><i class=\"bi bi-shopping-bag4\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a class=\"wishlist\" onclick=\"addBookToOrder(" + book2.id + ")\" href=\"#\"><i class=\"bi bi-shopping-cart-full\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t\t<li><a data-toggle=\"modal\" title=\"Quick View\" class=\"quickview modal-view detail-link\" href=\"#productmodal\"><i class=\"bi bi-search\"></i></a></li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t\t<div class=\"product__hover--content\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t<ul class=\"rating d-flex\">\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t\t<li>库存：" + book2.count + "</li>\n" +
                    "\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t\t<!-- Start Single Product -->\n" +
                    "\t\t\t\t\t\t</div>";
                // bestBookDiv.append(bookStr);
            }
            bookStr += "</div>";
            bestBookDiv.append(bookStr);
            importActiveJs();
        },
        error: function (xhr) {
        }
    });
}

function findAllBookCategories() {
    $.ajax({
        type: 'POST',
        url: `/category/findAllCategory`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            let bookCategoriesDiv = $("#div-book-categories");
            let bestBooksDiv = $("#div-best-books");
            data.forEach(element => {
                bookCategoriesDiv.append("<a class=\"nav-item nav-link\" data-toggle=\"tab\" href=\"#nav-" + element.id + "\" role=\"tab\" onclick=\"findBestBooksByCategoryId(" + element.id + ")\">" + element.name + "</a>");
                bestBooksDiv.append("<div class=\"row single__tab tab-pane fade\" id=\"nav-" + element.id + "\" role=\"tabpanel\">\n" +
                    "\t\t\t\t</div>");
            });
            findBestBooksByCategoryId(0);
        },
        error: function (xhr) {
        }
    });
}

function importActiveJs() {
    const oHead = document.getElementsByTagName('HEAD').item(0);
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src="js/active.js";
    oHead.appendChild(oScript);
}

