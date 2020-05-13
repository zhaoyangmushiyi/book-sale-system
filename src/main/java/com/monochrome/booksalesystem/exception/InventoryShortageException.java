package com.monochrome.booksalesystem.exception;

public class InventoryShortageException extends Exception {
    public InventoryShortageException() {}

    public InventoryShortageException(String msg) {
        super(msg);
    }
}
