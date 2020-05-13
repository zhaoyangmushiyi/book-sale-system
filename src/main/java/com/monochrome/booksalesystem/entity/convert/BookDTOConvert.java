package com.monochrome.booksalesystem.entity.convert;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.monochrome.booksalesystem.entity.Book;
import com.monochrome.booksalesystem.entity.DTO.BookDTO;

import java.util.List;
import java.util.stream.Collectors;

public class BookDTOConvert implements DTOConvert<BookDTO, Book> {

    @Override
    public Book doForward(BookDTO bookDTO) {
        Book book = new Book();
        BeanUtil.copyProperties(bookDTO, book, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return book;
    }

    @Override
    public BookDTO doBackward(Book book) {
        BookDTO bookDTO = new BookDTO();
        BeanUtil.copyProperties(book, bookDTO, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return bookDTO;
    }

    @Override
    public List<BookDTO> doBackward(List<Book> books) {
        return books.stream()
                .map(this::doBackward)
                .collect(Collectors.toList());
    }

}
