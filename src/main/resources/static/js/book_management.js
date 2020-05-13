let categoryId = 0;
let pageNumber = 0;
let pageSize = 20;
let total = 0;
let book_page_total = 1;
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
            $("#value-count").html(total);
            book_page_total = Math.ceil(total / pageSize);
            let book_page_select = $("#select-book-page").empty();
            for (let i = 1; i <= book_page_total; i++) {
                book_page_select.append("<option value='" + (i - 1) + "'>" + i + "</option>");
            }
            setBookPage(total, pageNumber, book_page_total);
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

$(function () {
    findBookCountByCategoryId(categoryId);
    getAllCategories();
    // findBookByCategoryId(categoryId, pageNumber, pageSize);
    $("#btn-page-next").click(function () {
        pageNumber++;
        setBookPage(total, pageNumber, book_page_total);
    });
    $("#btn-page-prev").click(function () {
        pageNumber--;
        setBookPage(total, pageNumber, book_page_total);
    });
});

function setCategory(id) {
    categoryId = id;
    pageNumber = 0;
    pageSize = 20;
    findBookByCategoryId(id, pageNumber, pageSize);
    findBookCountByCategoryId(categoryId);
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
            pageSize: pageSize
        },
        success: function (data) {
            const books = data;
            let index = pageNumber * pageSize;
            let bookStr = "";
            books.forEach(element => {
                bookStr += "<tr class=\"" + element.id + "\">" + "<th scope=\"col\" class=\"border-0\">" + (++index) + "</th>";
                bookStr += "<th scope=\"col\" class=\"border-0\" value=\"" + element.image + "\">" + element.name + "</th>";
                bookStr += "<th scope=\"col\" class=\"border-0\">" + element.author + "</th>";
                bookStr += "<th scope=\"col\" class=\"border-0\">" + element.price + "</th>";
                bookStr += "<th scope=\"col\" class=\"border-0\">" + element.count + "</th>";
                bookStr += "<th scope=\"col\" class=\"border-0\" value=\"" + element.categoryId + "\">" + element.categoryName + "</th>";
                bookStr += "<th scope=\"col\" class=\"border-0\" style=\"padding:0.65rem 0.25rem;\"><button class =\"btn btn-outline-accent btn-book-edit\" id=\"editBtn" + index + "\" >编辑</button><button class =\"btn btn-outline-accent btn-book-delete\" id=\"deleteBtn" + index + "\" >删除</button></th>" + "</tr>";
            });
            $('#table-book tbody').empty().append(bookStr);
            editAndSaveBook();
            deleteBook();
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function getAllCategories() {
    $.ajax({
        type: 'POST',
        url: `/category/findAllCategory`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            const bookCategories = data;
            let index = 0;
            let categorySelect = $("#select-category");
            let categoryListSelect = $("#select-category-list");
            categorySelect.empty();
            categoryListSelect.empty();
            categoryListSelect.append("<option value='0'>所有</option>");
            bookCategories.forEach(element => {
                categorySelect.append("<option value='" + element.id + "'>" + element.name + "</option>");
                categoryListSelect.append("<option value='" + element.id + "'>" + element.name + "</option>");
            });
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function forwardAddOneBook() {
    $("#div-book-list").css("display", "none");
    $("#div-add-book").css("display", "block");
}

function forwardUpdateOneBook(book) {
    $("#div-book-list").css("display", "none");
    $("#div-add-book").css("display", "block");
    $("#feBookId").val(book.id);
    $("#feName").val(book.name);
    $("#feAuthor").val(book.author);
    $("#fePrice").val(book.price);
    $("#feCount").val(book.count);
    $("#select-category").val(book.categoryId);
    // $("#select-category option[text='"+book.categoryName+"']").attr("selected", true);
    $("#img-book-head").attr("src", book.image);
    $("#btn-addOrUpdateOneBook").text("更新图书");

}

function forwardBookList() {
    $("#div-book-list").css("display", "block");
    $("#div-add-book").css("display", "none");
    findBookByCategoryId(categoryId, pageNumber, pageSize);
}

function editAndSaveBook() {
    $("button.btn-book-edit").each(function (index, element) {
        let table = $(this).parent().parent();
        $(this).click(function () {
            let book = {};
            book.id = table.attr("class");
            $(this).parent().parent().find("th").each(function (index, element) {
                if (index === 1) {
                    book.name = element.innerText;
                    book.image = element.attributes.value.textContent;
                }else if (index === 2) {
                    book.author = element.innerText;
                }else if (index === 3) {
                    book.price = element.innerText;
                }else if (index === 4) {
                    book.count = element.innerText;
                }else if (index === 5) {
                    book.categoryName = element.innerText;
                    book.categoryId = element.attributes.value.textContent;
                }
            });
            // flag = !flag;
            // if (flag) {
            //     $(this).text("保存");
            //     $(this).parent().parent().find("th").each(function (index, element) {
            //         if (index > 0) {
            //             $(this).attr("contenteditable", "true");
            //         }
            //         $(this).parent().css("border", "1px solid #007bff");
            //     })
            // } else {
            //     $(this).text("编辑");
            //     let book = {};
            //     $(this).parent().parent().find("th").each(function (index, element) {
            //         $(this).attr("contenteditable", "false");
            //         $(this).parent().css("border", "none");
            //         alert(element);
            //     });
            //     forwardUpdateOneBook(book);
            // }
            forwardUpdateOneBook(book);
        })
    });
}

function deleteBook() {
    $("button.btn-book-delete").each(function (index, element) {
        let table = $(this).parent().parent();
        $(this).click(function () {
            $.ajax({
                type: 'POST',
                url: `/admin/book/deleteOneBookById`,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                data: {
                    id: table.attr("class")
                },
                success: function (data) {
                    if (data) {
                        alert("删除此图书成功");
                        findBookCountByCategoryId(categoryId);
                        findBookByCategoryId(categoryId, pageNumber, pageSize);
                    } else {
                        alert("删除此图书失败");
                    }
                },
                error: function (xhr) {
                    // jumpPage(xhr.status);
                }
            });
        })
    });
}

function uploadImage() {
    // jquery 表单提交
    $("#form-upload-image").ajaxSubmit(function(data) {
        if (data !== null && data !== "") {
            $("#img-book-head").attr("src", data);
        } else {
            alert("上传书面图片失败！");
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}

function addOrUpdateOneBook() {
    let operation = $("#btn-addOrUpdateOneBook").text();
    let book = {};
    book.name = $("#feName").val();
    book.author = $("#feAuthor").val();
    book.price = $("#fePrice").val();
    book.count = $("#feCount").val();
    book.categoryId = $("#select-category").val();
    book.categoryName = $("#select-category").find("option:selected").text();
    let bookImage = $("#img-book-head").attr("src");
    if (bookImage === "" || bookImage === "上传图片失败，图片为空") {
        alert("请上传图书图片");
        return;
    }
    book.image = bookImage;
    if (operation === "添加图书") {
        addOneBook(book);
    } else if (operation === "更新图书") {
        book.id = $("#feBookId").val();
        updateOneBook(book);
    }
}

function addOneBook(book) {
    $.ajax({
        type: 'POST',
        url: `/admin/book/addOneBook`,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text',
        data: JSON.stringify(book),
        success: function (data) {
            alert(data);
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function updateOneBook(book) {
    $.ajax({
        type: 'POST',
        url: `/admin/book/updateOneBook`,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text',
        data: JSON.stringify(book),
        success: function (data) {
            alert(data);
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function setBookPage(total, pageNumber, book_page_total) {
    $("#value-page-number").html(pageNumber + 1);
    $("#value-page-total").html(book_page_total);
    $("#btn-page-prev").removeAttr("disabled");
    $("#btn-page-next").removeAttr("disabled");
    if (pageNumber === 0) {
        $("#btn-page-prev").attr("disabled", "disabled");
    }
    if (pageNumber === book_page_total - 1) {
        $("#btn-page-next").attr("disabled", "disabled");
    }
    $("#select-vacation-page").val(pageNumber);
    findBookByCategoryId(categoryId, pageNumber, pageSize);
}

function setPage(value) {
    pageNumber = parseInt(value);
    setBookPage(total, pageNumber, book_page_total);
}