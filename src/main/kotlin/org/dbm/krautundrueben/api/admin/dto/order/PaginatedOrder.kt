package org.dbm.krautundrueben.api.admin.dto.order

import org.dbm.krautundrueben.api.admin.dto.PageData

data class PaginatedOrder(
    val orders: List<OrderDto>,
    val page: PageData
)