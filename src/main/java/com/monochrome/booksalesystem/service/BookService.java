package com.monochrome.booksalesystem.service;

import com.monochrome.booksalesystem.entity.Book;
import com.monochrome.booksalesystem.entity.DTO.BookDTO;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BookService {

    List<Book> findBookByName(String name);

    BookDTO findBookById(long id);

    @Transactional
    void deleteBookById(long id);

    long saveBook(BookDTO bookDTO);

    String uploadImage(MultipartFile file) throws IOException;

    String addOneBook(BookDTO bookDTO);

    String updateOneBook(BookDTO bookDTO);

    List<BookDTO> findBooksByCategoryId(long categoryId, int pageNumber, int pageSize, Integer sort);

    long findBookCountByCategoryId(long categoryId);

    List<BookDTO> findBestBooksByCategoryId(long categoryId);

    List<BookDTO> findNewBooks();

    @Transactional
    String addBookToCart(String username, long bookId);

    List<BookDTO> searchBook(String name, int pageNumber, int pageSize);
}
