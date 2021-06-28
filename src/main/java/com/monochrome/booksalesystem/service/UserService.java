package com.monochrome.booksalesystem.service;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.monochrome.booksalesystem.entity.DTO.UserDTO;
import com.monochrome.booksalesystem.entity.DTO.UserInputDTO;
import com.monochrome.booksalesystem.entity.User;
import org.springframework.beans.BeansException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserService extends UserDetailsService {

    User findUserByUsername(String username);

    boolean register(UserInputDTO userDTO);

    boolean updateOneUser(UserDTO userDTO);

    String forgetPassword(String username, String password, String identification);

    UserDTO findUserDTOByUsername(String username);

    UserDTO findUserByUsernameOrIdentification(String username);

    String changePassword(String username, String oldPassword, String newPassword);

    String changeUserInfo(UserDTO userDTO);

    long findUserCount();

    List<UserDTO> findConsumptionStatisticsSortedByStatus(int page, int size, int orderType);

    String getVerificationCode(String phone);

    String verifyPhoneAndVerificationCode(String phone, String verificationCode);
}
