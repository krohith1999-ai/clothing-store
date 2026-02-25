package com.clothingstore.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.clothingstore.entity.Product;
import com.clothingstore.repository.ProductRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataLoader(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        List<Product> products = List.of(
                new Product("Classic White Tee", "Soft cotton crew neck t-shirt. Essential wardrobe staple.", new BigDecimal("24.99"), "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "T-Shirts", "M", "White", 50),
                new Product("Slim Fit Chinos", "Comfortable chinos with a modern slim fit. Perfect for casual wear.", new BigDecimal("59.99"), "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", "Pants", "32", "Navy", 30),
                new Product("Oversized Hoodie", "Cozy oversized hoodie with kangaroo pocket. 80% cotton, 20% polyester.", new BigDecimal("49.99"), "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", "Hoodies", "L", "Heather Grey", 25),
                new Product("Denim Jacket", "Vintage-style denim jacket with brass buttons. 100% cotton denim.", new BigDecimal("89.99"), "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", "Jackets", "M", "Blue", 20),
                new Product("Wool Blend Coat", "Elegant wool blend overcoat. Lined and perfect for cooler weather.", new BigDecimal("179.99"), "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400", "Coats", "L", "Camel", 15),
                new Product("Striped Polo", "Classic piqué polo with subtle stripe. Breathable and smart.", new BigDecimal("44.99"), "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400", "T-Shirts", "M", "Navy/White", 40),
                new Product("Jogger Pants", "Relaxed joggers with elastic cuffs. Ideal for lounging or errands.", new BigDecimal("39.99"), "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400", "Pants", "M", "Black", 35),
                new Product("Zip-Up Fleece", "Lightweight fleece with full zip. Great for layering.", new BigDecimal("54.99"), "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", "Hoodies", "M", "Forest Green", 28),
                new Product("Leather Moto Jacket", "Faux leather moto jacket with silver hardware.", new BigDecimal("129.99"), "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", "Jackets", "S", "Black", 12),
                new Product("Cashmere Scarf", "Soft cashmere blend scarf. One size.", new BigDecimal("69.99"), "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400", "Accessories", null, "Burgundy", 45),
                new Product("Canvas Sneakers", "Minimal low-top canvas sneakers. Comfortable everyday wear.", new BigDecimal("64.99"), "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400", "Shoes", "42", "White", 22),
                new Product("High-Waist Trousers", "Tailored high-waist trousers. Office or smart casual.", new BigDecimal("74.99"), "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", "Pants", "30", "Charcoal", 18)
        );

        productRepository.saveAll(products);
    }
}
