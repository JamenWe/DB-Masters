package org.dbm.krautundrueben.domain.ingredient

import org.dbm.krautundrueben.domain.supplier.SupplierEntity
import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort
import java.math.BigDecimal

data class IngredientQueryParams(
    val id: Int?,
    val name: String?,
    val unit: String?,
    val netPrice: BigDecimal?,
    val stock: Int?,
    val calories: Int?,
    val carbohydrates: BigDecimal?,
    val protein: BigDecimal?,
    val supplier: SupplierEntity?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams