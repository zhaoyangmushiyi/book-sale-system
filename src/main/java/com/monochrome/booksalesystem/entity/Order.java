package com.monochrome.booksalesystem.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.Date;

@Entity(name = "_order")
@DynamicInsert
@DynamicUpdate
@Data
@NoArgsConstructor
@Accessors(chain = true)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNumber;
    private BigDecimal total;
    private int status;
    private long userId;
    private String receiver;
    private String receiveAddress;
    private String receiveTelephone;
    private String receivePostcode;
    private String logisticsNumber;
    private Date addDate;
}
