package com.bidbridge.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BidBridgeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BidBridgeBackendApplication.class, args);
	}

}
