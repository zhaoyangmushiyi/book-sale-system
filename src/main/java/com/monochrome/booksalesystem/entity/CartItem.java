package com.monochrome.booksalesystem.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity(name = "cart_item")
@DynamicInsert
@DynamicUpdate
@Data
@NoArgsConstructor
@Accessors(chain = true)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cartId;

    private Long orderId;

    private Long bookId;

    private String bookName;
    
    private String bookAuthor;

    private int bookCount;

    private BigDecimal bookPrice;

    private boolean bought;
}
