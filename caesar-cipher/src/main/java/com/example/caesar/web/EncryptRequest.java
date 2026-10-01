package com.example.caesar.web;

import jakarta.validation.constraints.NotNull;

public record EncryptRequest(@NotNull String text, int shift) {
}
