package com.monochrome.booksalesystem.entity.convert;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.monochrome.booksalesystem.entity.DTO.UserDTO;
import com.monochrome.booksalesystem.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserDTOConvert implements DTOConvert<UserDTO, User> {

    @Override
    public User doForward(UserDTO userDTO) {
        User user = new User();
        BeanUtil.copyProperties(userDTO, user, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return user;
    }

    @Override
    public UserDTO doBackward(User user) {
        UserDTO userDTO = new UserDTO();
        BeanUtil.copyProperties(user, userDTO, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return userDTO;
    }

    @Override
    public List<UserDTO> doBackward(List<User> users) {
        return users.stream()
                .map(user -> new UserDTOConvert().doBackward(user))
                .collect(Collectors.toList());
    }
}
