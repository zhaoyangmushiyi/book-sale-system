package com.monochrome.booksalesystem.entity.convert;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.monochrome.booksalesystem.entity.DTO.UserInputDTO;
import com.monochrome.booksalesystem.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserInputDTOConvert implements DTOConvert<UserInputDTO, User> {

    @Override
    public User doForward(UserInputDTO userDTO) {
        User user = new User();
        BeanUtil.copyProperties(userDTO, user, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return user;
    }

    @Override
    public UserInputDTO doBackward(User user) {
        UserInputDTO userDTO = new UserInputDTO();
        BeanUtil.copyProperties(user, userDTO, CopyOptions.create().setIgnoreNullValue(true).setIgnoreError(true));
        return userDTO;
    }

    @Override
    public List<UserInputDTO> doBackward(List<User> users) {
        return users.stream()
                .map(this::doBackward)
                .collect(Collectors.toList());    }
}
