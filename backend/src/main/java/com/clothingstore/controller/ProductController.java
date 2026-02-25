package com.clothingstore.controller;

import com.clothingstore.entity.Product;
import com.clothingstore.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        if (category != null && !category.isBlank()) {
            return productRepository.findByCategoryIgnoreCase(category.trim());
        }
        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim());
        }
        return productRepository.findAll();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return productRepository.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .sorted()
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
