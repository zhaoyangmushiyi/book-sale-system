package com.monochrome.booksalesystem.entity.convert;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.monochrome.booksalesystem.entity.DTO.OrderDTO;
import com.monochrome.booksalesystem.entity.DTO.OrderDTO;
import com.monochrome.booksalesystem.entity.Order;
import com.monochrome.booksalesystem.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class OrderDTOConvert implements DTOConvert<OrderDTO, Order> {
    
    @Override
    public Order doForward(OrderDTO orderDTO) {
        Order order = new Order();
        BeanUtil.copyProperties(orderDTO, order, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return order;
    }

    @Override
    public OrderDTO doBackward(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        BeanUtil.copyProperties(order, orderDTO, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return orderDTO;
    }

    @Override
    public List<OrderDTO> doBackward(List<Order> orders) {
        return orders.stream()
                .map(order -> new OrderDTOConvert().doBackward(order))
                .collect(Collectors.toList());
    }

}
