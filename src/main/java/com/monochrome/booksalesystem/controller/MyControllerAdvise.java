package com.monochrome.booksalesystem.controller;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MyControllerAdvise {

    @ExceptionHandler(value = AssertionError.class)
    public String myErrorHandler(AssertionError ex) {
        return ex.getMessage();
    }

}
