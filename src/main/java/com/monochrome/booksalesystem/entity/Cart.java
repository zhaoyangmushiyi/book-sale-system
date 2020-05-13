package com.monochrome.booksalesystem.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity(name = "cart")
@DynamicInsert
@DynamicUpdate
@Data
@NoArgsConstructor
@Accessors(chain = true)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long userId;

    private int count;

    private BigDecimal totalPrice;

    @Transient
    List<CartItem> cartItems;
}
