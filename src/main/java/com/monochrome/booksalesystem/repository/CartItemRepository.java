package com.monochrome.booksalesystem.repository;

import com.monochrome.booksalesystem.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findCartItemsByBookId(long bookId);

    List<CartItem> findCartItemsByCartIdAndBought(long cartID, boolean bought);

    List<CartItem> findCartItemsByBoughtAndIdIn(boolean bought, List<Long> cartItemIds);

    List<CartItem> findCartItemsByOrderId(long orderId);

    void deleteCartItemsByCartId(long cartId);

    void deleteCartItemsByBookIdAndBought(long bookId, boolean bought);

    @Modifying
    @Query("update cart_item ct set ct.orderId = ?2, ct.bought = 1 where ct.cartId = ?1")
    void updateCartItemOrderIdByCartId(long cartId, long orderId);

    @Modifying
    @Query("update cart_item ct set ct.orderId = ?2, ct.bought = 1 where ct.id in ?1")
    void updateCartItemOrderIdByCartItemIds(List<Long> cartItemIds, long orderId);

}
