package com.monochrome.booksalesystem.service.impl;

import com.monochrome.booksalesystem.entity.*;
import com.monochrome.booksalesystem.entity.DTO.OrderDTO;
import com.monochrome.booksalesystem.entity.convert.OrderDTOConvert;
import com.monochrome.booksalesystem.exception.InventoryShortageException;
import com.monochrome.booksalesystem.repository.*;
import com.monochrome.booksalesystem.service.OrderService;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final CartItemRepository cartItemRepository;

    private final CartRepository cartRepository;

    private final BookRepository bookRepository;

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, CartItemRepository cartItemRepository, CartRepository cartRepository, BookRepository bookRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public long findOrderCountByStatus(int status, String username) {
        return 0;
    }

    @Override
    public List<OrderDTO> findOrdersByStatus(int status, String username) {
        return null;
    }

    @Override
    public String applyOrder(@NotNull Order order, String username) throws InventoryShortageException {
        User user = userRepository.findUserByUsername(username);
        assert user != null;
        String orderNumber = UUID.randomUUID().toString().replace("-", "").substring(0, 15);
        order.setOrderNumber(orderNumber)
                .setStatus(1)
                .setUserId(user.getId());
        Cart cart = cartRepository.findCartByUserId(user.getId());
        assert cart != null;
        orderRepository.save(order);
        BigDecimal total = user.getConsumption().add(order.getTotal());
        user.setConsumption(total);
        if (!user.getVip().equals("钻石会员")) {
            if (total.add(order.getTotal()).compareTo(BigDecimal.valueOf(388)) > 0) {
                user.setVip("钻石会员");
            } else if (!user.getVip().equals("金卡会员") && total.add(order.getTotal()).compareTo(BigDecimal.valueOf(288)) > 0) {
                user.setVip("金卡会员");
            } else if (!user.getVip().equals("银卡会员") && total.add(order.getTotal()).compareTo(BigDecimal.valueOf(188)) > 0) {
                user.setVip("银卡会员");
            }
        }
        userRepository.save(user);
        cartItemRepository.updateCartItemOrderIdByCartId(cart.getId(), order.getId());
        List<CartItem> cartItems = cartItemRepository.findCartItemsByCartIdAndBought(cart.getId(), false);
        for (CartItem cartItem : cartItems) {
            Book book = bookRepository.findById(cartItem.getBookId()).orElse(null);
            assert book != null;
            int count = book.getCount();
            if (count < cartItem.getBookCount()) {
                String msg = book.getName() + "库存不足，库存只有" + count + "本。下单失败";
                throw new InventoryShortageException(msg);
            }
            book.setCount(book.getCount() - cartItem.getBookCount());
            book.setSoldCount(book.getSoldCount() + cartItem.getBookCount());
            bookRepository.save(book);
        }
        cartRepository.deleteCartByUserId(user.getId());
        return "success";
    }

    @Override
    public List<OrderDTO> findOrdersByStatus(int status, int page, int size) {
        List<Order> orders;
        if (status == 0) {
            orders = orderRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id")).getContent();
        } else {
            orders = orderRepository.findOrdersByStatus(status, PageRequest.of(page, size, Sort.Direction.DESC, "id")).getContent();
        }
        return new OrderDTOConvert().doBackward(orders);
    }

    @Override
    public long findOrderCountByStatus(int status) {
        return status == 0 ? orderRepository.count() : orderRepository.countOrderByStatus(status);
    }

    @Override
    public List<OrderDTO> getOrder(String username) {
        User user = userRepository.findUserByUsername(username);
        assert user != null;
        List<Order> orders = orderRepository.findOrdersByUserId(user.getId());
        List<OrderDTO> orderDTOS = new OrderDTOConvert().doBackward(orders);
        for (OrderDTO orderDTO : orderDTOS) {
            List<CartItem> cartItems = cartItemRepository.findCartItemsByOrderId(orderDTO.getId());
            String products = cartItems.stream()
                    .map(cartItem -> cartItem.getBookName() + "x" + cartItem.getBookCount())
                    .reduce((s, s2) -> s += "<br/>" + s2).orElse("");
            orderDTO.setProducts(products);
        }
        Collections.reverse(orderDTOS);
        return orderDTOS;
    }

    @Override
    public String ship(long id, String logisticsNumber) {
        Order order = orderRepository.findById(id).orElse(null);
        assert order != null;
        order.setLogisticsNumber(logisticsNumber)
                .setStatus(2);
        orderRepository.save(order);
        return "success";
    }

    @Override
    public String confirmReceipt(long id) {
        Order order = orderRepository.findById(id).orElse(null);
        assert order != null;
        order.setStatus(3);
        orderRepository.save(order);
        return "success";
    }

    @Override
    public String applyOrderSingle(Order order, long bookId, String username) throws InventoryShortageException {
        User user = userRepository.findUserByUsername(username);
        assert user != null;
        String orderNumber = UUID.randomUUID().toString().replace("-", "").substring(0, 15);
        order.setOrderNumber(orderNumber)
                .setStatus(1)
                .setUserId(user.getId());
        orderRepository.save(order);
        BigDecimal total = user.getConsumption().add(order.getTotal());
        user.setConsumption(total);
        if (!user.getVip().equals("钻石会员")) {
            if (total.add(order.getTotal()).compareTo(BigDecimal.valueOf(388)) > 0) {
                user.setVip("钻石会员");
            } else if (!user.getVip().equals("金卡会员") && total.add(order.getTotal()).compareTo(BigDecimal.valueOf(288)) > 0) {
                user.setVip("金卡会员");
            } else if (!user.getVip().equals("银卡会员") && total.add(order.getTotal()).compareTo(BigDecimal.valueOf(188)) > 0) {
                user.setVip("银卡会员");
            }
        }
        userRepository.save(user);
        Book book = bookRepository.findById(bookId).orElse(null);
        assert book != null;
        if (book.getCount() < 1) {
            String msg = book.getName() + "库存不足，库存只有" + book.getCount() + "本。下单失败";
            throw new InventoryShortageException(msg);
        }
        CartItem cartItem = new CartItem();
        cartItem.setBookId(bookId)
                .setBookName(book.getName())
                .setBookAuthor(book.getAuthor())
                .setBookCount(1)
                .setBookPrice(book.getPrice())
                .setOrderId(order.getId())
                .setBought(true);
        cartItemRepository.save(cartItem);
        book.setCount(book.getCount() - cartItem.getBookCount());
        book.setSoldCount(book.getSoldCount() + cartItem.getBookCount());
        bookRepository.save(book);
        return "success";
    }

    @Override
    public Order findOrderById(long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public String updateOrder(OrderDTO orderDTO) {
        Order order = orderRepository.findById(orderDTO.getId()).orElse(null);
        assert order != null;
        order.setReceiver(orderDTO.getReceiver())
                .setReceiveAddress(orderDTO.getReceiveAddress())
                .setReceiveTelephone(orderDTO.getReceiveTelephone())
                .setOrderNumber(orderDTO.getOrderNumber());
        if (orderDTO.getLogisticsNumber() != null && !orderDTO.getLogisticsNumber().equals("")) {
            order.setLogisticsNumber(orderDTO.getLogisticsNumber());
        }
        orderRepository.save(order);
        return "success";
    }

    @Override
    public String applyOrderByCartItemIds(Order order, List<Long> cartItemIds, String username) throws InventoryShortageException {
        User user = userRepository.findUserByUsername(username);
        assert user != null;
        String orderNumber = UUID.randomUUID().toString().replace("-", "").substring(0, 15);
        order.setOrderNumber(orderNumber)
                .setStatus(1)
                .setUserId(user.getId());
        orderRepository.save(order);
        BigDecimal total = user.getConsumption().add(order.getTotal());
        user.setConsumption(total);
        if (!user.getVip().equals("钻石会员")) {
            if (total.add(order.getTotal()).compareTo(BigDecimal.valueOf(388)) > 0) {
                user.setVip("钻石会员");
            } else if (!user.getVip().equals("金卡会员") && total.add(order.getTotal()).compareTo(BigDecimal.valueOf(288)) > 0) {
                user.setVip("金卡会员");
            } else if (!user.getVip().equals("银卡会员") && total.add(order.getTotal()).compareTo(BigDecimal.valueOf(188)) > 0) {
                user.setVip("银卡会员");
            }
        }
        userRepository.save(user);
        Cart cart = cartRepository.findCartByUserId(user.getId());
        assert cart != null;
        cartItemRepository.updateCartItemOrderIdByCartItemIds(cartItemIds, order.getId());
        List<CartItem> cartItemsByIdIn = cartItemRepository.findCartItemsByBoughtAndIdIn(true, cartItemIds);
        List<CartItem> cartItems = cartItemsByIdIn.stream().
                filter(cartItem -> cartItem.getCartId().equals(cart.getId()))
                .collect(Collectors.toList());
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            Book book = bookRepository.findById(cartItem.getBookId()).orElse(null);
            assert book != null;
            totalPrice  = totalPrice.add(book.getPrice().multiply(BigDecimal.valueOf(cartItem.getBookCount())));
            int count = book.getCount();
            if (count < cartItem.getBookCount()) {
                String msg = book.getName() + "库存不足，库存只有" + count + "本。下单失败";
                throw new InventoryShortageException(msg);
            }
            book.setCount(book.getCount() - cartItem.getBookCount());
            book.setSoldCount(book.getSoldCount() + cartItem.getBookCount());
            bookRepository.save(book);
        }
        cart.setTotalPrice(cart.getTotalPrice().subtract(totalPrice))
                .setCount(cart.getCount() - cartItems.size());
        cartRepository.save(cart);
        return "success";
    }

}
