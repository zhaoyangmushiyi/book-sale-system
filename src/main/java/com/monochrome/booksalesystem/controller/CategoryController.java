package com.monochrome.booksalesystem.controller;

import com.monochrome.booksalesystem.entity.Category;
import com.monochrome.booksalesystem.service.CategoryService;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/findAllCategory")
    @ApiOperation(value = "findAllCategory", notes = "findAllCategory")
    public List<Category> findAllCategory() {
        List<Category> result = null;
        try {
            result = categoryService.findAllCategory();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/updateOneCategory")
    @ApiOperation(value = "更新一个分类", notes = "更新一个分类")
    public boolean updateOneUser(Category category) {
        boolean result = false;
        try {
            result = (categoryService.updateCategory(category) != null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findCategoryById")
    @ApiOperation(value = "通过ID查询分类", notes = "通过ID查询分类")
    public Category findCategoryById(@RequestParam("id") long id) {
        Category result = null;
        try {
            result = categoryService.findCategoryById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
