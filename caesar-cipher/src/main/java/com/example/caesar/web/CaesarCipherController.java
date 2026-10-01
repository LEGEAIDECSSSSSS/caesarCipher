package com.example.caesar.web;

import com.example.caesar.CaesarCipherEncryption;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CaesarCipherController {

    // POST /api/encrypt   body: {"text": "Hello", "shift": 3}
    @PostMapping("/encrypt")
    public EncryptResponse encrypt(@Valid @RequestBody EncryptRequest request) {
        String result = CaesarCipherEncryption.encryption(request.text(), request.shift());
        return new EncryptResponse(result);
    }
}
