package org.dbm.krautundrueben.api.admin.dto.customer

import org.dbm.krautundrueben.api.admin.dto.PageData

data class PaginatedCustomers(
    val customers: List<CustomerDto>,
    val page: PageData
)