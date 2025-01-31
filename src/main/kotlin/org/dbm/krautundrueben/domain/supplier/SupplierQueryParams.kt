package org.dbm.krautundrueben.domain.supplier

import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort

data class SupplierQueryParams(
    val id: Int?,
    val name: String?,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?,
    val ingredients: IngredientEntity?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams