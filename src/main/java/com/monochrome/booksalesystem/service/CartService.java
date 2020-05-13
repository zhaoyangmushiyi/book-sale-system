package com.monochrome.booksalesystem.service;

import com.monochrome.booksalesystem.entity.Cart;
import com.monochrome.booksalesystem.entity.CartItem;

import java.util.List;

public interface CartService {

    Cart findCartByUsername(String username);

    String removeCartItemById(long id);

    String changeCartItemCountById(long id, int count);

    List<CartItem> findCartItemsByCartItemIds(List<Long> cartItemIds, String username);
}
