package com.monochrome.booksalesystem.service.impl;

import com.monochrome.booksalesystem.entity.Cart;
import com.monochrome.booksalesystem.entity.CartItem;
import com.monochrome.booksalesystem.entity.User;
import com.monochrome.booksalesystem.repository.CartItemRepository;
import com.monochrome.booksalesystem.repository.CartRepository;
import com.monochrome.booksalesystem.repository.UserRepository;
import com.monochrome.booksalesystem.service.CartService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Cart findCartByUsername(String username) {
        User user = userRepository.findUserByUsername(username);
        assert user != null;
        Cart cart = cartRepository.findCartByUserId(user.getId());
        if (cart != null) {
            List<CartItem> cartItems = cartItemRepository.findCartItemsByCartIdAndBought(cart.getId(), false);
            cart.setCartItems(cartItems);
        }
        return cart;
    }

    @Override
    public String removeCartItemById(long id) {
        Optional<CartItem> cartItem = cartItemRepository.findById(id);
        if (!cartItem.isPresent()) {
            return "fail";
        }
        cartItemRepository.deleteById(id);
        return "success";
    }

    @Override
    public String changeCartItemCountById(long id, int count) {
        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        assert cartItem != null;
        Cart cart = cartRepository.findById(cartItem.getCartId()).orElse(null);
        assert cart != null;
        cart.setTotalPrice(cart.getTotalPrice().add(cartItem.getBookPrice().multiply(BigDecimal.valueOf(count - cartItem.getBookCount()))));
        cartRepository.save(cart);
        cartItem.setBookCount(count);
        cartItemRepository.save(cartItem);
        return "success";
    }

    @Override
    public List<CartItem> findCartItemsByCartItemIds(List<Long> cartItemIds, String username) {
        User user = userRepository.findUserByUsername(username);
        assert user != null;
        Cart cart = cartRepository.findCartByUserId(user.getId());
        assert cart != null;
        List<CartItem> cartItems = cartItemRepository.findCartItemsByBoughtAndIdIn(false, cartItemIds);
        return cartItems.stream().
                filter(cartItem -> cartItem.getCartId().equals(cart.getId()))
                .collect(Collectors.toList());
    }
}
