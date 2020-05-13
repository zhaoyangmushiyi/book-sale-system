package com.monochrome.booksalesystem.entity.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@Accessors(chain = true)
public class UserDTO {
    private Long id;
    private String username;
    private String realName;
    private String nickName;
    private String sex;
    private String identification;
    private String telephone;
    private String roleName;
    private String address;
    private String vip;
    private BigDecimal consumption;
    private Date addDate;

}
