package com.bidbridge.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BidBridge API")
                        .description("REST API for BidBridge - Freight quotation SaaS")
                        .version("v1")
                        .license(new License().name("MIT").url("https://opensource.org/licenses/MIT"))
                        .contact(new Contact()
                                .name("BidBridge Team")
                                .email("support@bidbridge.com")
                                .url("https://bidbridge.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080/api").description("Local Development Server"),
                        new Server().url("https://api.bidbridge.com").description("Production Server")
                ));
    }
} 