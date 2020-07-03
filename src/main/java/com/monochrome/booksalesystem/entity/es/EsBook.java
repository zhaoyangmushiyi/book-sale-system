package com.monochrome.booksalesystem.entity.es;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Id;
import java.math.BigDecimal;

@Data
@Document(indexName = "index-book", refreshInterval = "0s")
public class EsBook {

    @Id
    private Long id;
    private String name;
    private BigDecimal price;
    private String author;
    private String image;
    private int count;
    private int soldCount;
    private long categoryId;
    private String categoryName;


}
