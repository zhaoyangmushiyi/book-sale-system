package com.monochrome.booksalesystem.service;

import com.monochrome.booksalesystem.entity.DTO.BookDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

@SpringBootTest
class BookServiceTest {

    @Autowired
    private BookService bookService;


    @Test
    void findBookByName() {
    }

    @Test
    void findBookById() {
    }

    @Test
    void deleteBookById() {
    }

    @Test
    void saveBook() {
    }

    @Test
    void uploadImage() {
    }

    @Test
    void addOneBook() {
//        for (int i = 20; i < 100; i++) {
//            BookDTO book = new BookDTO();
//            book
//                    .setName("测试" + i)
//                    .setAuthor("测试" + i)
//                    .setPrice(BigDecimal.TEN)
//                    .setCount(9)
//                    .setCategoryId(1)
//                    .setCategoryName("百科");
//            bookService.addOneBook(book);
//        }
//        for (int i = 20; i < 100; i++) {
//            BookDTO book = new BookDTO();
//            book
//                    .setName("测试" + i)
//                    .setAuthor("测试" + i)
//                    .setPrice(BigDecimal.TEN)
//                    .setCount(9)
//                    .setCategoryId(1)
//                    .setCategoryName("百科");
//            bookService.addOneBook(book);
//        }
    }

    @Test
    void updateOneBook() {
    }

    @Test
    void findBooksByCategoryId() {
    }

    @Test
    void findBookCountByCategoryId() {
    }
}