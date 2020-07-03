package com.monochrome.booksalesystem.repository.es;

import com.monochrome.booksalesystem.entity.es.EsBook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface EsBookRepository extends ElasticsearchRepository<EsBook, Long> {
    Page<EsBook> findEsBooksByName(String name, Pageable pageable);

    Page<EsBook> findEsBooksByAuthor(String author, Pageable pageable);

    List<EsBook> findEsBookByCategoryId(long categoryId);
}
