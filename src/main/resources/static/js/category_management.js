$(document).ready(function () {
    findAllCategory();
});

function findAllCategory() {
    $.ajax({
        type: 'POST',
        url: `/category/findAllCategory`,
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            const bookCategories = data;
            let index = 0;
            let categoryStr = "";
            bookCategories.forEach(element => {
                categoryStr += "<tr class=\"" + element.id + "\">" + "<th scope=\"col\" class=\"border-0\">" + (++index) + "</th>";
                categoryStr += "<th scope=\"col\" class=\"border-0\">" + element.name + "</th>";
                categoryStr += "<th scope=\"col\" class=\"border-0\" style=\"padding:0.65rem 0.25rem;\"><button class =\"btn btn-outline-accent category-edit\" id=\"editBtn" + index + "\" >编辑</button><button class =\"btn btn-outline-accent category-delete\" id=\"deleteBtn" + index + "\" >删除</button></th>" + "</tr>";
            });
            $('#book_category tbody').empty().append(categoryStr);
            editAndSave();
            deleteCategory();
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}

function addOneCategory() {
    // jquery 表单提交
    $("#form-add-category").ajaxSubmit(function (message) {
        alert(message);
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}


function forwardAddCategory() {
    $("#div-manage-category").css("display", "none");
    $("#div-add-category").css("display", "block");
}

function forwardManageCategory() {
    $("#div-manage-category").css("display", "block");
    $("#div-add-category").css("display", "none");
    findAllCategory();
}

function editAndSave() {
    $("button.category-edit").each(function (index, element) {
        let flag = false;
        let table = $(this).parent().parent();
        $(this).click(function () {
            flag = !flag;
            if (flag) {
                $(this).text("保存");
                $(this).parent().parent().find("th").each(function (index, element) {
                    if (index > 0) {
                        $(this).attr("contenteditable", "true");
                    }
                    $(this).parent().css("border", "1px solid #007bff");
                })
            } else {
                $(this).text("编辑");
                let categoryName;
                $(this).parent().parent().find("th").each(function (index, element) {
                    if (index === 1) {
                        categoryName = $(this).text();
                    }
                    $(this).attr("contenteditable", "false");
                    $(this).parent().css("border", "none");
                });
                updateCategory(table.attr("class"), categoryName);
            }
        })
    });
}

function deleteCategory() {
    $("button.category-delete").each(function (index, element) {
        let table = $(this).parent().parent();
        $(this).click(function () {
            $.ajax({
                type: 'POST',
                url: `/admin/category/deleteOneCategoryById`,
                contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                dataType: 'json',
                data: {
                    id: table.attr("class")
                },
                success: function (data) {
                    if (data) {
                        alert("删除此分类成功");
                        findAllCategory();
                    } else {
                        alert("删除此分类失败");
                    }
                },
                error: function (xhr) {
                    // jumpPage(xhr.status);
                }
            });
        })
    });
}

function updateCategory(id, categoryName) {
    console.log(id + "," + categoryName);
    let category = {};
    category.id = id;
    category.name = categoryName;
    $.ajax({
        type: 'POST',
        url: `/admin/category/updateOneCategory`,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'text',
        data: JSON.stringify(category),
        success: function (data) {
            alert(data);
        },
        error: function (xhr) {
            // jumpPage(xhr.status);
        }
    });
}
