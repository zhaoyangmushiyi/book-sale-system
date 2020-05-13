package com.monochrome.booksalesystem.repository;

import com.monochrome.booksalesystem.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends PagingAndSortingRepository<Order, Long> {

    long countOrderByStatus(int status);

    Page<Order> findOrdersByStatus(int status, Pageable pageable);

    List<Order> findOrdersByUserId(long userId);

    List<Order> findOrdersByUserIdAndStatus(long userId, int status);

}
