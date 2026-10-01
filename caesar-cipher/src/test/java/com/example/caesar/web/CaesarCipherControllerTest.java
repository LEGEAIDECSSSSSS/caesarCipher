package com.example.caesar.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CaesarCipherController.class)
class CaesarCipherControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void encryptsText() throws Exception {
        mockMvc.perform(post("/api/encrypt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"Hello\",\"shift\":3}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value("Khoor"));
    }

    @Test
    void rejectsMissingText() throws Exception {
        mockMvc.perform(post("/api/encrypt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"shift\":3}"))
                .andExpect(status().isBadRequest());
    }
}
