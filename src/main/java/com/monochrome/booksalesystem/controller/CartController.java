package com.monochrome.booksalesystem.controller;

import com.monochrome.booksalesystem.entity.Cart;
import com.monochrome.booksalesystem.entity.CartItem;
import com.monochrome.booksalesystem.service.CartService;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/findCart")
    @ApiOperation(value = "findCart", notes = "findCart")
    public Cart findCart(Principal principal) {
        Cart result = null;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = cartService.findCartByUsername(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/removeCartItemById")
    @ApiOperation(value = "removeCartItemById", notes = "removeCartItemById")
    public String removeCartItemById(@RequestParam("id") long id) {
        String result;
        try {
            result = cartService.removeCartItemById(id);
        } catch (Exception e) {
            result = "未知错误！";
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/changeCartItemCountById")
    @ApiOperation(value = "changeCartItemCountById", notes = "changeCartItemCountById")
    public String removeCartItemById(@RequestParam("id") long id,
                                     @RequestParam("count") int count) {
        String result;
        try {
            result = cartService.changeCartItemCountById(id, count);
        } catch (Exception e) {
            result = "未知错误！";
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findCartItemsByCartItemIds")
    @ApiOperation(value = "findCartItemsByCartItemIds", notes = "findCartItemsByCartItemIds")
    public List<CartItem> findCartItemsByCartItemIds(@RequestParam("cartItemIds") List<Long> cartItemIds, Principal principal) {

        List<CartItem> result = null;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = cartService.findCartItemsByCartItemIds(cartItemIds, username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
