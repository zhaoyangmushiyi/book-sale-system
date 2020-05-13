package com.monochrome.booksalesystem.entity.convert;

import java.util.List;

public interface DTOConvert<S, T> {
    T doForward(S s);

    S doBackward(T t);

    List<S> doBackward(List<T> ts);
}