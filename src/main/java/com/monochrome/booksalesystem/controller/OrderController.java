package com.monochrome.booksalesystem.controller;

import com.monochrome.booksalesystem.entity.DTO.OrderDTO;
import com.monochrome.booksalesystem.entity.Order;
import com.monochrome.booksalesystem.service.OrderService;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {

    final private OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @PostMapping("/findOrderCountByStatus")
    @ApiOperation(value = "findOrderCountByStatus")
    public long findOrderCountByStatus(@RequestParam("status") int status,
                                       Principal principal) {
        long result = 0;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = orderService.findOrderCountByStatus(status, username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    @PostMapping("/findOrdersByStatus")
    @ApiOperation(value = "findOrdersByStatus")
    public List<OrderDTO> findOrdersByStatus(@RequestParam("status") int status,
                                             Principal principal) {
        List<OrderDTO> result = null;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = orderService.findOrdersByStatus(status, username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    @PostMapping("/applyOrder")
    @ApiOperation(value = "applyOrder")
    public String applyOrder(@RequestBody Order order,
                             Principal principal) {
        String result = null;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = orderService.applyOrder(order, username);
        } catch (Exception e) {
            e.printStackTrace();
            result = e.getMessage();
        }
        return result;
    }

    @PostMapping("/applyOrderSingle")
    @ApiOperation(value = "applyOrderSingle")
    public String applyOrderSingle(@RequestBody Order order,
                                   @RequestParam("bookId") long bookId,
                                   Principal principal) {
        String result = "提交订单失败";
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = orderService.applyOrderSingle(order, bookId, username);
        } catch (Exception e) {
            e.printStackTrace();
            result = e.getMessage();
        }
        return result;
    }

    @PostMapping("/applyOrderByCartItemIds")
    @ApiOperation(value = "applyOrderByCartItemIds")
    public String applyOrderByCartItemIds(@RequestBody Order order,
                                          @RequestParam("cartItemIds") List<Long> cartItemIds,
                                          Principal principal) {
        String result = "提交订单失败";
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = orderService.applyOrderByCartItemIds(order, cartItemIds, username);
        } catch (Exception e) {
            e.printStackTrace();
            result = e.getMessage();
        }
        return result;
    }

    @PostMapping("/confirmReceipt")
    @ApiOperation(value = "confirmReceipt")
    public String confirmReceipt(@RequestParam("id") long id,
                                 Principal principal) {
        String result = null;
        try {
            result = orderService.confirmReceipt(id);
        } catch (Exception e) {
            e.printStackTrace();
            result = e.getMessage();
        }
        return result;
    }

    @PostMapping("/getOrder")
    @ApiOperation(value = "getOrder")
    public List<OrderDTO> getOrder(Principal principal) {
        List<OrderDTO> result = null;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = orderService.getOrder(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
