package com.monochrome.booksalesystem.controller;

import com.monochrome.booksalesystem.entity.DTO.UserDTO;
import com.monochrome.booksalesystem.entity.DTO.UserInputDTO;
import com.monochrome.booksalesystem.service.UserService;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/register")
    @ApiOperation(value = "register", notes = "register")
    public boolean register(@RequestBody UserInputDTO user) {
        boolean result = false;
        try {
            result = userService.register(user);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/forgetPassword")
    @ApiOperation(value = "forgetPassword", notes = "forgetPassword")
    public String forgetPassword(@RequestParam("username") String username,
                                 @RequestParam("password") String password,
                                 @RequestParam("identification") String identification) {
        String result = "failed";
        try {
            result = userService.forgetPassword(username, password, identification);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    @PostMapping("/findUserByUsername")
    @ApiOperation(value = "findUserByUsername", notes = "findUserByUsername")
    public UserDTO findUserByUsername(@RequestParam("username") String username) {
        UserDTO result = null;
        try {
            result = userService.findUserDTOByUsername(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/findUserByUsernameOrIdentification")
    @ApiOperation(value = "findUserByUsernameOrIdentification", notes = "findUserByUsernameOrIdentification")
    public UserDTO findUserByUsernameOrIdentification(@RequestParam("username") String username) {
        UserDTO result = null;
        try {
            result = userService.findUserByUsernameOrIdentification(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/updateOneUser")
    @ApiOperation(value = "更新一个用户", notes = "更新一个用户")
    public boolean updateOneUser(UserInputDTO userInputDTO) {
        boolean result = false;
        try {
            result = userService.updateOneUser(userInputDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/getCurrentUser")
    @ApiOperation(value = "getCurrentUser", notes = "getCurrentUser")
    public UserDTO getCurrentUser(Principal principal) {
        UserDTO result = null;
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = userService.findUserByUsernameOrIdentification(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/changePassword")
    @ApiOperation(value = "changePassword", notes = "changePassword")
    public String changePassword(@RequestParam("oldPassword") String oldPassword,
                                 @RequestParam("newPassword") String newPassword,
                                 @RequestParam("newPasswordR") String newPasswordR,
                                 Principal principal) {
        String result = "修改密码失败";
        if (!newPassword.equals(newPasswordR)) {
            return "两次输入密码不一致";
        }
        String username = null;
        if (principal instanceof UsernamePasswordAuthenticationToken) {
            User user = (User) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
            username = user.getUsername();
        }
        try {
            assert username != null;
            result = userService.changePassword(username, oldPassword, newPassword);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    @PostMapping("/changeUserInfo")
    @ApiOperation(value = "changeUserInfo", notes = "changeUserInfo")
    public String changeUserInfo(UserDTO userDTO) {
        String result = "修改用户信息失败";
        assert userDTO.getId() != null : ("用户id为空");
        assert userDTO.getNickName() != null && !"".equals(userDTO.getNickName()) : ("用户昵称为空");
        assert userDTO.getRealName() != null && !"".equals(userDTO.getRealName()) : ("用户真是姓名为空");
        assert userDTO.getTelephone() != null && !"".equals(userDTO.getTelephone()) : ("用户电话号码为空");
        assert userDTO.getAddress() != null && !"".equals(userDTO.getAddress()) : ("用户地址为空");
        try {
            result = userService.changeUserInfo(userDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/getVerificationCode")
    @ApiOperation(value = "getVerificationCode", notes = "getVerificationCode")
    public String getVerificationCode(@RequestParam("phone") String phone) {
        String result = null;
        try {
            result = userService.getVerificationCode(phone);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @PostMapping("/verifyPhoneAndVerificationCode")
    @ApiOperation(value = "verifyPhoneAndVerificationCode", notes = "verifyPhoneAndVerificationCode")
    public String verifyPhoneAndVerificationCode(@RequestParam("phone") String phone, @RequestParam("verificationCode") String verificationCode) {
        String result = null;
        try {
            result = userService.verifyPhoneAndVerificationCode(phone, verificationCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}
