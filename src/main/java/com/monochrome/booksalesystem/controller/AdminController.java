package com.monochrome.booksalesystem.controller;

import com.monochrome.booksalesystem.entity.Category;
import com.monochrome.booksalesystem.entity.DTO.BookDTO;
import com.monochrome.booksalesystem.entity.DTO.OrderDTO;
import com.monochrome.booksalesystem.entity.DTO.UserDTO;
import com.monochrome.booksalesystem.entity.Order;
import com.monochrome.booksalesystem.service.BookService;
import com.monochrome.booksalesystem.service.CategoryService;
import com.monochrome.booksalesystem.service.OrderService;
import com.monochrome.booksalesystem.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final CategoryService categoryService;

    private final BookService bookService;

    private final OrderService orderService;

    private final UserService userService;

    public AdminController(CategoryService categoryService, BookService bookService, OrderService orderService, UserService userService) {
        this.categoryService = categoryService;
        this.bookService = bookService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/category/deleteOneCategoryById")
    @ApiOperation(value = "删除一个分类", notes = "删除一个分类")
    public boolean deleteOneCategoryById(@RequestParam("id") long id) {
        boolean result = true;
        try {
            categoryService.deleteCategory(id);
        } catch (Exception e) {
            result = false;
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/category/addOneCategory")
    @ApiOperation(value = "添加一个分类", notes = "添加一个分类")
    public String addOneCategory(Category category) {
        String result;
        try {
            result = categoryService.addCategory(category);
        } catch (Exception e) {
            result = "添加图书分类失败！";
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/category/updateOneCategory")
    @ApiOperation(value = "修改一个分类", notes = "修改一个分类")
    public String updateOneCategory(@RequestBody Category category) {
        String result;
        try {
            result = categoryService.updateCategory(category);
        } catch (Exception e) {
            result = "添加图书分类失败！";
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/book/addOneBook")
    @ApiOperation(value = "添加一本图书", notes = "添加一本图书")
    public String addOneBook(@RequestBody BookDTO bookDTO) {
        String result = "添加图书失败";
        try {
            result = bookService.addOneBook(bookDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/book/updateOneBook")
    @ApiOperation(value = "更新一本图书", notes = "更新一本图书")
    public String updateOneBook(@RequestBody BookDTO bookDTO) {
        String result = "更新图书失败";
        try {
            result = bookService.updateOneBook(bookDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/book/deleteOneBookById")
    @ApiOperation(value = "删除一本图书", notes = "删除一本图书")
    public boolean deleteOneBookById(@RequestParam("id") long id) {
        boolean result = true;
        try {
            bookService.deleteBookById(id);
        } catch (Exception e) {
            result = false;
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/order/findOrderCountByStatus")
    @ApiOperation(value = "findOrderCountByStatus")
    public long findOrderCountByStatus(@RequestParam("status") int status) {
        long result = 0;
        try {
            result = orderService.findOrderCountByStatus(status);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    @PostMapping("/order/findOrdersByStatus")
    @ApiOperation(value = "findOrdersByStatus")
    public List<OrderDTO> findOrdersByStatus(@RequestParam("status") int status,
                                             @RequestParam("page") int page,
                                             @RequestParam("size") int size) {
        List<OrderDTO> result = null;
        try {
            result = orderService.findOrdersByStatus(status, page, size);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/order/ship")
    @ApiOperation(value = "发货", notes = "发货")
    public String updateOneBook(@RequestParam("id") long id,
                                @RequestParam("logisticsNumber") String logisticsNumber) {
        String result = "发货失败";
        try {
            result = orderService.ship(id, logisticsNumber);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/order/findOrderById")
    @ApiOperation(value = "findOrderById")
    public Order findOrderById(@RequestParam("id") long id,
                               Principal principal) {
        Order result = null;
        try {
            result = orderService.findOrderById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/order/updateOrder")
    @ApiOperation(value = "updateOrder")
    public String updateOrder(OrderDTO orderDTO) {
        String result = "更新订单失败";
        try {
            result = orderService.updateOrder(orderDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/user/findUserCount")
    @ApiOperation(value = "findUserCount")
    public long findUserCount() {
        long result = 0;
        try {
            result = userService.findUserCount();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/user/findConsumptionStatisticsSortedByStatus")
    @ApiOperation(value = "findConsumptionStatisticsSortedByStatus")
    public List<UserDTO> findConsumptionStatisticsSortedByStatus(@RequestParam("orderType") int orderType,
                                                                 @RequestParam("page") int page,
                                                                 @RequestParam("size") int size) {
        List<UserDTO> result = null;
        try {
            result = userService.findConsumptionStatisticsSortedByStatus(page, size, orderType);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
