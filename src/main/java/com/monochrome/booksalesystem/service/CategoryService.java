package com.monochrome.booksalesystem.service;

import com.monochrome.booksalesystem.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> findAllCategory();

    String updateCategory(Category category);

    String addCategory(Category category);

    void deleteCategory(long id);

    Category findCategoryById(long id);

}
