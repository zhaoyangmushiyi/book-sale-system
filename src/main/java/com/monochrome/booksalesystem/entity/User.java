package com.monochrome.booksalesystem.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity(name = "user")
@DynamicInsert
@DynamicUpdate
@Data
@NoArgsConstructor
@Accessors(chain = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private Short role;
    private String roleName;
    private String vip;
    private String nickName;
    private String telephone;
    private String sex = "男";
    private String identification;
    private String realName;
    private String address;
    private Date addDate;
    private Date updateDate;
    private BigDecimal consumption;

}

