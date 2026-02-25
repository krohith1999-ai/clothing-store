package com.clothingstore.service;

import com.clothingstore.entity.Order;
import com.clothingstore.entity.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("MMM d, yyyy 'at' h:mm a").withZone(ZoneId.systemDefault());

    private final Optional<JavaMailSender> mailSender;
    private final String fromAddress;
    private final String storeName;

    public EmailService(
            @org.springframework.beans.factory.annotation.Autowired(required = false) JavaMailSender mailSender,
            @Value("${app.mail.from:}") String fromAddress,
            @Value("${app.mail.store-name:Thread & Form}") String storeName) {
        this.mailSender = Optional.ofNullable(mailSender);
        this.fromAddress = fromAddress;
        this.storeName = storeName;
    }

    /**
     * Sends an order receipt to the customer's email. No-op if mail is not configured or sending fails.
     */
    public void sendReceipt(Order order) {
        if (mailSender.isEmpty()) {
            log.debug("Mail not configured; skipping receipt email for order {}", order.getId());
            return;
        }
        if (fromAddress == null || fromAddress.isBlank()) {
            log.warn("app.mail.from not set; skipping receipt email");
            return;
        }
        try {
            String html = buildReceiptHtml(order);
            MimeMessage message = mailSender.get().createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(order.getEmail());
            helper.setSubject(storeName + " — Order #" + order.getId() + " receipt");
            helper.setText(htmlToPlainText(html), html);
            mailSender.get().send(message);
            log.info("Receipt email sent for order {} to {}", order.getId(), order.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send receipt email for order {}: {}", order.getId(), e.getMessage());
        }
    }

    private String buildReceiptHtml(Order order) {
        StringBuilder rows = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            BigDecimal lineTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            String size = item.getSize() != null && !item.getSize().isBlank() ? " (" + item.getSize() + ")" : "";
            rows.append("<tr><td>").append(escape(item.getProductName())).append(size)
                    .append("</td><td style=\"text-align:center\">").append(item.getQuantity())
                    .append("</td><td style=\"text-align:right\">").append(formatMoney(item.getPrice()))
                    .append("</td><td style=\"text-align:right\">").append(formatMoney(lineTotal))
                    .append("</td></tr>");
        }
        String dateStr = order.getCreatedAt() != null ? DATE_FORMAT.format(order.getCreatedAt()) : "";

        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"><title>Order Receipt</title></head>
            <body style="font-family: system-ui, sans-serif; line-height: 1.5; color: #333; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem;">%s</h1>
            <p style="color: #666; margin-bottom: 24px;">Thank you for your order.</p>
            <p><strong>Order #%d</strong> · %s</p>
            <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
            <thead><tr style="border-bottom: 2px solid #ddd;"><th style="text-align:left; padding: 8px 0;">Item</th><th style="text-align:center; padding: 8px 0;">Qty</th><th style="text-align:right; padding: 8px 0;">Price</th><th style="text-align:right; padding: 8px 0;">Subtotal</th></tr></thead>
            <tbody>%s</tbody>
            </table>
            <p style="text-align: right; font-size: 1.125rem; font-weight: 600;">Total: %s</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            <p style="font-size: 0.9rem; color: #666;"><strong>Shipping address</strong><br>%s<br>%s, %s %s</p>
            <p style="font-size: 0.85rem; color: #999; margin-top: 32px;">If you have questions, reply to this email or contact us.</p>
            </body>
            </html>
            """.formatted(
                storeName,
                order.getId(),
                dateStr,
                rows.toString(),
                formatMoney(order.getTotal()),
                escape(order.getCustomerName()),
                escape(order.getAddress() + (order.getAddressLine2() != null && !order.getAddressLine2().isBlank() ? ", " + order.getAddressLine2() : "")),
                escape(order.getCity()),
                order.getState(),
                order.getPostalCode()
            );
    }

    private static String formatMoney(BigDecimal amount) {
        return "$" + amount.setScale(2, java.math.RoundingMode.HALF_UP).toString();
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    private static String htmlToPlainText(String html) {
        return html.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
    }
}
