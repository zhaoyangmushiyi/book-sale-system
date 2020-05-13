package com.monochrome.booksalesystem.entity.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@Accessors(chain = true)
public class OrderDTO {

    private Long id;
    private String orderNumber;
    private BigDecimal total;
    private int status;
    private String receiver;
    private String receiveAddress;
    private String receiveTelephone;
    private String receivePostcode;
    private String logisticsNumber;
    private Date addDate;
    private String products;

}
