package org.dbm.krautundrueben.api.admin.dto.order

import java.math.BigDecimal
import java.sql.Date

data class CustomerOrderDto (
    val orderId: Int,
    val orderDate: Date,
    val invoiceAmount: BigDecimal?,
    val recipes: String?,
    val ingredients: String?
)