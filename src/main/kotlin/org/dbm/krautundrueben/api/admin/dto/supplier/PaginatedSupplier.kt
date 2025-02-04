package org.dbm.krautundrueben.api.admin.dto.supplier

import org.dbm.krautundrueben.api.admin.dto.PageData

data class PaginatedSupplier(
    val suppliers: List<SupplierDto>,
    val page: PageData
)