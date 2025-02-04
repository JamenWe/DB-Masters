package org.dbm.krautundrueben.api.admin.dto

data class PaginatedSupplier(
    val suppliers: List<SupplierDto>,
    val page: PageData
)