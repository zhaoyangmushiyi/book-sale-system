package com.monochrome.booksalesystem.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.monochrome.booksalesystem.entity.DTO.UserDTO;
import com.monochrome.booksalesystem.entity.DTO.UserInputDTO;
import com.monochrome.booksalesystem.entity.User;
import com.monochrome.booksalesystem.entity.convert.UserDTOConvert;
import com.monochrome.booksalesystem.repository.UserRepository;
import com.monochrome.booksalesystem.service.UserService;
import lombok.extern.java.Log;
import org.springframework.beans.BeansException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@Log
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final StringRedisTemplate redisTemplate;

    public UserServiceImpl(UserRepository userRepository, StringRedisTemplate redisTemplate) {
        this.userRepository = userRepository;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User userByName = userRepository.findUserByUsername(username);
        //创建一个新的UserDetails对象，最后验证登陆的需要
        UserDetails userDetails = null;
        if (userByName != null) {
            System.out.println(userByName.getPassword());
            //创建一个集合来存放权限
            Collection<GrantedAuthority> authorities = getAuthorities(userByName);
            //实例化UserDetails对象
            userDetails = new org.springframework.security.core.userdetails.User(username, userByName.getPassword(), true, true, true, true, authorities);
        }
        return userDetails;
    }

    private Collection<GrantedAuthority> getAuthorities(User user) {
        List<GrantedAuthority> authList = new ArrayList<>();
        //注意：这里每个权限前面都要加ROLE_。否在最后验证不会通过
        authList.add(new SimpleGrantedAuthority("ROLE_" + user.getRoleName()));
        return authList;
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public boolean register(UserInputDTO userDTO) {
        boolean result = false;
        try {
            if (userRepository.findUserByUsername(userDTO.getUsername()) != null) {
                return false;
            }
            User user = new UserDTOConvert().doForward(userDTO);
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            if (user.getRoleName() == null || user.getRoleName().equals("")) {
                user.setRole(Short.parseShort("1")).setRoleName("user");
            } else if (user.getRoleName().equals("user")) {
                user.setRole(Short.parseShort("1")).setRoleName("user");
            } else if (user.getRoleName().equals("admin")) {
                user.setRole(Short.parseShort("0")).setRoleName("admin");
            }
            userRepository.save(user);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public boolean updateOneUser(UserDTO userDTO) {
        boolean result = false;
        try {
            User user = userRepository.findUserByUsername(userDTO.getUsername());
            BeanUtil.copyProperties(userDTO, user, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
            userRepository.save(user);
            result = true;
        } catch (BeansException e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String forgetPassword(String username, String password, String identification) {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            return "此用户不存在！";
        }
        if (!user.getIdentification().equals(identification)) {
            return "身份证号码错误！";
        }
        user.setPassword(new BCryptPasswordEncoder().encode(password));
        userRepository.save(user);
        return "重置密码成功！";
    }

    @Override
    public UserDTO findUserDTOByUsername(String username) {
        User userByUsername = this.findUserByUsername(username);
        UserDTOConvert userDTOConvert = new UserDTOConvert();
        return userDTOConvert.doBackward(userByUsername);
    }

    @Override
    public UserDTO findUserByUsernameOrIdentification(String username) {
        User user = this.findUserByUsername(username);
        if (user == null) {
            user = userRepository.findUserByIdentification(username);
        }
        if (user != null) {
            return new UserDTOConvert().doBackward(user);
        }
        return null;
    }

    @Override
    public String changePassword(String username, String oldPassword, String newPassword) {
        User userByUsername = this.findUserByUsername(username);
        assert userByUsername != null;
        if (!new BCryptPasswordEncoder().matches(oldPassword, userByUsername.getPassword())) {
            return "输入的原密码不正确";
        }
        userByUsername.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(userByUsername);
        return "修改密码成功";
    }

    @Override
    public String changeUserInfo(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getId()).orElse(null);
        assert user != null;
        user.setNickName(userDTO.getNickName())
                .setRealName(userDTO.getRealName())
                .setTelephone(userDTO.getTelephone())
                .setAddress(userDTO.getAddress());
        userRepository.save(user);
        return "修改用户信息成功";
    }

    @Override
    public long findUserCount() {
        return userRepository.count();
    }

    @Override
    public List<UserDTO> findConsumptionStatisticsSortedByStatus(int page, int size, int orderType) {
        String sortStr = "id";

        if (orderType == 2) {
            sortStr = "consumption";
        }
        List<User> users = userRepository.findAll(PageRequest.of(page, size, Sort.Direction.DESC, sortStr)).getContent();
        return new UserDTOConvert().doBackward(users);
    }

    @Override
    public String getVerificationCode(String phone) {
        String verifyCodeCountKey = "verifyCode" + phone + ":count";
        String verifyCodeKey = "verifyCode" + phone + ":code";
        String count = redisTemplate.opsForValue().get(verifyCodeCountKey);
        if (count == null) {
            redisTemplate.opsForValue().set(verifyCodeCountKey, "1", 1, TimeUnit.DAYS);
        } else if (Integer.parseInt(count) <= 2) {
            redisTemplate.opsForValue().increment(verifyCodeCountKey);
        } else {
            return "今天输入次数已超过3次！";
        }
        String verificationCode = getRandomVerificationCode();
        log.info(verifyCodeKey + "------" + verificationCode);
        redisTemplate.opsForValue().set(verifyCodeKey, verificationCode, 30, TimeUnit.MINUTES);
        return "验证码已发送到手机，请尽快输入，验证码将于30分钟后失效！";
    }

    @Override
    public String verifyPhoneAndVerificationCode(String phone, String verificationCode) {

        String verifyCodeKey = "verifyCode" + phone + ":code";
        String verifyCodeKeyByRedis = redisTemplate.opsForValue().get(verifyCodeKey);
        if (verificationCode.equals(verifyCodeKeyByRedis)) {
            return "验证成功";
        }
        return "验证码已发送到手机，请尽快输入，验证码将于30分钟后失效！";
    }

    private String getRandomVerificationCode() {
        StringBuilder verificationCode = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            verificationCode.append(new Random().nextInt(10));
        }
        return verificationCode.toString();
    }

}
