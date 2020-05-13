package com.monochrome.booksalesystem.repository;

import com.monochrome.booksalesystem.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends PagingAndSortingRepository<Book, Long> {
    List<Book> findBooksByName(String name);

    List<Book> findBooksByAuthor(String author);

    Book findBookByNameAndAuthor(String name, String author);

    Page<Book> findBooksByCategoryId(long categoryId, Pageable pageable);

    List<Book> findBooksByCategoryId(long categoryId);

}
