package org.dbm.krautundrueben.api.admin.dto

data class PaginatedCustomers(
    val customers: List<CustomerDto>,
    val page: PageData
)