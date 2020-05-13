package com.monochrome.booksalesystem.service;

import com.monochrome.booksalesystem.entity.DTO.OrderDTO;
import com.monochrome.booksalesystem.entity.Order;
import com.monochrome.booksalesystem.exception.InventoryShortageException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OrderService {
    long findOrderCountByStatus(int status, String username);

    List<OrderDTO> findOrdersByStatus(int status, String username);

    @Transactional
    String applyOrder(Order order, String username) throws InventoryShortageException;

    List<OrderDTO> findOrdersByStatus(int status, int page, int size);

    long findOrderCountByStatus(int status);

    List<OrderDTO> getOrder(String username);

    String ship(long id, String logisticsNumber);

    String confirmReceipt(long id);

    @Transactional
    String applyOrderSingle(Order order, long bookId, String username) throws InventoryShortageException;

    Order findOrderById(long id);

    String updateOrder(OrderDTO orderDTO);

    @Transactional
    String applyOrderByCartItemIds(Order order, List<Long> cartItemIds, String username) throws InventoryShortageException;

}
