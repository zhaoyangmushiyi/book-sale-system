package com.monochrome.booksalesystem.entity.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Accessors(chain = true)
public class cartDTO {

    private String name;

    private long userId;

    private String bookIds;

    private String bookICounts;

    private int count;

    private BigDecimal totalPrice;


}
