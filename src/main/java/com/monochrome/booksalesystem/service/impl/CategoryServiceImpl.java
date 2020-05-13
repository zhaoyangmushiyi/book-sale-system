package com.monochrome.booksalesystem.service.impl;

import com.monochrome.booksalesystem.entity.Category;
import com.monochrome.booksalesystem.repository.CategoryRepository;
import com.monochrome.booksalesystem.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    final private CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public String updateCategory(Category category) {
        if (categoryRepository.findCategoriesByName(category.getName()).size() > 0) {
            return "此分类名称已存在";
        }
        categoryRepository.save(category);
        return "修改分类名称成功";
    }

    @Override
    public String addCategory(Category category) {
        List<Category> categoriesByName = categoryRepository.findCategoriesByName(category.getName());
        if (categoriesByName.size() > 0) {
            return "此图书分类已存在！";
        }
        categoryRepository.save(category);
        return "添加图书分类成功！";
    }

    @Override
    public void deleteCategory(long id) {
        categoryRepository.deleteById(id);
    }

    @Override
    public Category findCategoryById(long id) {
        return categoryRepository.getOne(id);
    }

}
