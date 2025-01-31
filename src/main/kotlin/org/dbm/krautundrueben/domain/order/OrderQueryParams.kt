package org.dbm.krautundrueben.domain.order

import org.dbm.krautundrueben.domain.customer.CustomerEntity
import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort
import java.math.BigDecimal
import java.time.LocalDate

data class OrderQueryParams(
    val id: Int?,
    val customer: CustomerEntity?,
    val orderDate: LocalDate?,
    val invoiceAmount: BigDecimal?,
    val orderIngredients: OrderIngredientEntity?,
    val orderRecipes: OrderRecipeEntity?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams