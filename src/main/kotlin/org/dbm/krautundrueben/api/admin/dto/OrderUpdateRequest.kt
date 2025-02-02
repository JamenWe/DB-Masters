package org.dbm.krautundrueben.api.admin.dto

import java.math.BigDecimal
import java.time.LocalDate

data class OrderUpdateRequest(
    val orderDate: LocalDate?,
    val invoiceAmount: BigDecimal?
)