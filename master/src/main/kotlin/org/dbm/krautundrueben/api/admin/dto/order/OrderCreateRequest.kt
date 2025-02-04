package org.dbm.krautundrueben.api.admin.dto.order

import java.math.BigDecimal
import java.time.LocalDate

data class OrderCreateRequest(
    val customerId: Int,
    val orderDate: LocalDate,
    val invoiceAmount: BigDecimal?,
    val orderIngredients: List<OrderIngredientRequest> = emptyList(),
    val orderRecipes: List<OrderRecipeRequest> = emptyList()
)