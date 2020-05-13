package com.monochrome.booksalesystem.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class BookDTO {

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
