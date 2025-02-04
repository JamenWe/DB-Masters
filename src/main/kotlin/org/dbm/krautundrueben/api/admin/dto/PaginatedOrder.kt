package org.dbm.krautundrueben.api.admin.dto

data class PaginatedOrder(
    val orders: List<OrderDto>,
    val page: PageData
)