package com.monochrome.booksalesystem.repository;

import com.monochrome.booksalesystem.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findCartByUserId(long userId);

    void deleteCartByUserId(long userId);
}
