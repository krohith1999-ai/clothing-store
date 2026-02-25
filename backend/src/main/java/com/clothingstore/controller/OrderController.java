package com.clothingstore.controller;

import com.clothingstore.dto.CreateOrderRequest;
import com.clothingstore.entity.Order;
import com.clothingstore.entity.OrderItem;
import com.clothingstore.entity.Product;
import com.clothingstore.repository.OrderRepository;
import com.clothingstore.repository.ProductRepository;
import com.clothingstore.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setAddress(request.getAddress());
        order.setAddressLine2(request.getAddressLine2());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null && !request.getCountry().isBlank()) {
            order.setCountry(request.getCountry());
        }

        BigDecimal total = BigDecimal.ZERO;
        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemReq.getProductId());
            if (productOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Product not found: " + itemReq.getProductId()));
            }
            Product product = productOpt.get();
            BigDecimal price = product.getPrice();
            int qty = itemReq.getQuantity();
            String size = itemReq.getSize() != null ? itemReq.getSize() : product.getSize();

            OrderItem orderItem = new OrderItem(
                    product.getId(),
                    product.getName(),
                    size,
                    qty,
                    price
            );
            order.addItem(orderItem);
            total = total.add(price.multiply(BigDecimal.valueOf(qty)));
        }
        order.setTotal(total);
        order = orderRepository.save(order);

        emailService.sendReceipt(order);

        Map<String, Object> response = new HashMap<>();
        response.put("id", order.getId());
        response.put("total", order.getTotal());
        response.put("status", order.getStatus());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
