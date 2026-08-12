package com.shalini.shalinimart.dao;

import com.shalini.shalinimart.model.Order;
import com.shalini.shalinimart.model.OrderItem;

import java.util.List;
import java.util.Optional;

public interface OrderDAO {

    void save(Order order);

    void saveItem(OrderItem item);

    Optional<Order> findById(long id);

    List<Order> findByBuyerId(long buyerId);
}