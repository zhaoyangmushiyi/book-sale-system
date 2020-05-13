package com.monochrome.booksalesystem.controller;

import com.monochrome.booksalesystem.entity.DTO.BookDTO;
import com.monochrome.booksalesystem.service.BookService;
import io.swagger.annotations.ApiOperation;
import org.apache.catalina.authenticator.FormAuthenticator;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/book")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/findBookById")
    @ApiOperation(value = "findBookById", notes = "findBookById")
    public BookDTO findUserByUsername(@RequestParam("id") long id) {
        BookDTO result = null;
        try {
            result = bookService.findBookById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/uploadImage")
    @ApiOperation(value = "uploadImage", notes = "uploadImage")
    public String uploadImage(@RequestParam(value = "file", required = false) MultipartFile file) {
        String result = null;
        if (file == null || file.isEmpty()) {
            return "上传图片失败，图片为空";
        }
        try {
            result = bookService.uploadImage(file);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findBookByCategoryId")
    @ApiOperation(value = "findBookByCategoryId", notes = "findBookByCategoryId")
    public List<BookDTO> findBookByCategoryId(@RequestParam("categoryId") long categoryId,
                                              @RequestParam("pageNumber") int pageNumber,
                                              @RequestParam("pageSize") int pageSize,
                                              @RequestParam(name = "sort", required = false) Integer sort) {
        List<BookDTO> result = null;
        try {
            result = bookService.findBooksByCategoryId(categoryId, pageNumber, pageSize, sort);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findBookCountByCategoryId")
    @ApiOperation(value = "findBookCountByCategoryId", notes = "findBookCountByCategoryId")
    public long findBookByCategoryId(@RequestParam("categoryId") long categoryId) {
        long result = 0;
        try {
            result = bookService.findBookCountByCategoryId(categoryId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/searchBook")
    @ApiOperation(value = "searchBook", notes = "searchBook")
    public List<BookDTO> searchBook(@RequestParam("name") String name,
                           @RequestParam("pageNumber") int pageNumber,
                           @RequestParam("pageSize") int pageSize) {
        List<BookDTO> result = null;
        try {
            result = bookService.searchBook(name, pageNumber, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findBestBooksByCategoryId")
    @ApiOperation(value = "findBestBooksByCategoryId", notes = "findBestBooksByCategoryId")
    public List<BookDTO> findBestBooksByCategoryId(@RequestParam("categoryId") long categoryId) {
        List<BookDTO> result = null;
        try {
            result = bookService.findBestBooksByCategoryId(categoryId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findNewBooks")
    @ApiOperation(value = "findNewBooks", notes = "findNewBooks")
    public List<BookDTO> findNewBooks() {
        List<BookDTO> result = null;
        try {
            result = bookService.findNewBooks();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/addBookToCart")
    @ApiOperation(value = "addBookToCart", notes = "findNewBooks")
    public String addBookToCart(@RequestParam("bookId") long bookId, Principal principal) {
        String result = "加入购物车失败！";
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            if (username == null) {
                return "未找到当前用户！";
            }
            result = bookService.addBookToCart(username, bookId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
