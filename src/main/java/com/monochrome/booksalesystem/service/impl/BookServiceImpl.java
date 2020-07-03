package com.monochrome.booksalesystem.service.impl;

import com.monochrome.booksalesystem.entity.Book;
import com.monochrome.booksalesystem.entity.Cart;
import com.monochrome.booksalesystem.entity.CartItem;
import com.monochrome.booksalesystem.entity.DTO.BookDTO;
import com.monochrome.booksalesystem.entity.User;
import com.monochrome.booksalesystem.entity.convert.BookDTOConvert;
import com.monochrome.booksalesystem.entity.es.EsBook;
import com.monochrome.booksalesystem.repository.BookRepository;
import com.monochrome.booksalesystem.repository.CartItemRepository;
import com.monochrome.booksalesystem.repository.CartRepository;
import com.monochrome.booksalesystem.repository.UserRepository;
import com.monochrome.booksalesystem.repository.es.EsBookRepository;
import com.monochrome.booksalesystem.service.BookService;
import com.monochrome.booksalesystem.utils.AliyunOssUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    private final AliyunOssUtil aliyunOssUtil;

    private final CartRepository cartRepository;

    private final UserRepository userRepository;

    private final CartItemRepository cartItemRepository;

    private final EsBookRepository esBookRepository;

    public BookServiceImpl(BookRepository bookRepository, AliyunOssUtil aliyunOssUtil, CartRepository cartRepository, UserRepository userRepository, CartItemRepository cartItemRepository, EsBookRepository esBookRepository) {
        this.bookRepository = bookRepository;
        this.aliyunOssUtil = aliyunOssUtil;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
        this.esBookRepository = esBookRepository;
    }

    @Override
    public List<Book> findBookByName(String name) {
        return bookRepository.findBooksByName(name);
    }

    @Override
    public BookDTO findBookById(long id) {
        return new BookDTOConvert().doBackward(bookRepository.findById(id).orElse(null));
    }

    @Override
    public void deleteBookById(long id) {
        cartItemRepository.deleteCartItemsByBookIdAndBought(id, false);
        bookRepository.deleteById(id);
    }

    @Override
    public long saveBook(BookDTO bookDTO) {
//        Book oldBook = bookRepository.getOne(bookDTO.getId());
        Book newBook = new BookDTOConvert().doForward(bookDTO);
        return bookRepository.save(newBook).getId();
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        InputStream inputStream = file.getInputStream();
        String fileName = file.getOriginalFilename();
        assert fileName != null;
        String extensionName = fileName.substring(fileName.lastIndexOf(".") + 1);
        String uploadFileName = UUID.randomUUID().toString() + "." + extensionName;
        return aliyunOssUtil.uploadImage(inputStream, uploadFileName);
    }

    @Override
    public String addOneBook(BookDTO bookDTO) {
        Book bookByNameAndAndAuthor = bookRepository.findBookByNameAndAuthor(bookDTO.getName(), bookDTO.getAuthor());
        if (bookByNameAndAndAuthor != null) {
            return "此书籍已存在，添加失败";
        }
        Book book = new BookDTOConvert().doForward(bookDTO);
        bookRepository.save(book);
        return "添加图书成功";
    }

    @Override
    public String updateOneBook(BookDTO bookDTO) {
        Book book = new BookDTOConvert().doForward(bookDTO);
        bookRepository.save(book);
        return "更新图书成功";
    }

    @Override
    public List<BookDTO> findBooksByCategoryId(long categoryId, int pageNumber, int pageSize, Integer sort) {

        String sortStr = "id";
        Sort.Direction direction = Sort.Direction.DESC;
        if (sort != null) {
            switch (sort) {
                case 2:
                    sortStr = "price";
                    direction = Sort.Direction.ASC;
                    break;
                case 3:
                    sortStr = "price";
            }
        }
        List<Book> books = null;
        if (categoryId == 0) {
            Page<Book> bookPage = bookRepository.findAll(PageRequest.of(pageNumber, pageSize, direction, sortStr));
            books = bookPage.getContent();
        } else {
            Page<Book> booksByCategoryId = bookRepository.findBooksByCategoryId(categoryId, PageRequest.of(pageNumber, pageSize, direction, sortStr));
            books = booksByCategoryId.getContent();
        }
        return new BookDTOConvert().doBackward(books);
    }

    @Override
    public long findBookCountByCategoryId(long categoryId) {
        if (categoryId == 0) {
            return bookRepository.count();
        }
        return bookRepository.findBooksByCategoryId(categoryId).size();
    }

    @Override
    public List<BookDTO> findBestBooksByCategoryId(long categoryId) {
        List<Book> books;
        Page<Book> bestBooks;
        if (categoryId == 0) {
            bestBooks = bookRepository.findAll(PageRequest.of(0, 10, Sort.Direction.DESC, "soldCount"));
        } else {
            bestBooks = bookRepository.findBooksByCategoryId(categoryId, PageRequest.of(0, 10, Sort.Direction.DESC, "soldCount"));
        }
        books = bestBooks.getContent();
        return new BookDTOConvert().doBackward(books);
    }

    @Override
    public List<BookDTO> findNewBooks() {
        Page<Book> bestBooks = bookRepository.findAll(PageRequest.of(0, 6, Sort.Direction.DESC, "id"));
        List<Book> books = bestBooks.getContent();
        return new BookDTOConvert().doBackward(books);
    }

    @Override
    public String addBookToCart(String username, long bookId) {
        User user = userRepository.findUserByUsername(username);
        Cart cart = cartRepository.findCartByUserId(user.getId());
        Book book = bookRepository.findById(bookId).orElse(null);
        assert book != null;
        if (cart == null) {
            cart = new Cart();
            cart
                    .setUserId(user.getId())
                    .setCount(1)
                    .setTotalPrice(book.getPrice());
            cartRepository.save(cart);
            CartItem cartItem = new CartItem();
            cartItem.setCartId(cart.getId())
                    .setBookId(bookId).setBookCount(1)
                    .setBookPrice(book.getPrice())
                    .setBookName(book.getName())
                    .setBookAuthor(book.getAuthor());
            cartItemRepository.save(cartItem);
        }else {
            List<CartItem> cartItems = cartItemRepository.findCartItemsByCartIdAndBought(cart.getId(), false);
            if (cartItems.size() == 0) {
                CartItem cartItem = new CartItem();
                cartItem.setBookId(bookId)
                        .setBookCount(1)
                        .setBookPrice(book.getPrice())
                        .setBookAuthor(book.getAuthor())
                        .setBookName(book.getName())
                        .setCartId(cart.getId());
                cartItemRepository.save(cartItem);
                cartItems = new ArrayList<>();
                cartItems.add(cartItem);
            } else {
                if (cartItems.stream().anyMatch(cartItem -> cartItem.getBookId() == bookId)) {
                    cartItems = cartItems.stream()
                            .filter(cartItem -> {
                                if (cartItem.getBookId() == bookId) {
                                    cartItem.setBookCount(cartItem.getBookCount() + 1);
                                    cartItemRepository.save(cartItem);
                                }
                                return true;
                            })
                            .collect(Collectors.toList());
                }else {
                    CartItem cartItem = new CartItem();
                    cartItem.setCartId(cart.getId())
                            .setBookId(bookId).setBookCount(1)
                            .setBookPrice(book.getPrice())
                            .setBookName(book.getName())
                            .setBookAuthor(book.getAuthor());
                    cartItemRepository.save(cartItem);
                    cartItems.add(cartItem);
                    cart.setCount(cart.getCount() + 1);
                }
            }
            cart.setCartItems(cartItems);
            cart.setTotalPrice(cart.getTotalPrice().add(book.getPrice()));
            cartRepository.save(cart);
        }
        return "添加到购物车成功！";
    }

    @Override
    public List<EsBook> searchBook(String name, int pageNumber, int pageSize) {
        List<EsBook> booksByName = esBookRepository.findEsBooksByName(name, PageRequest.of(0, 12, Sort.Direction.ASC, "id")).getContent();
        List<EsBook> booksByAuthor = esBookRepository.findEsBooksByAuthor(name, PageRequest.of(0, 12, Sort.Direction.ASC, "id")).getContent();
        if (booksByAuthor.size() > 0) {
            booksByName.addAll(booksByAuthor);
            while (booksByName.size() > 12) {
                booksByName.remove(12);
            }
        }
        return booksByName;
    }

}
