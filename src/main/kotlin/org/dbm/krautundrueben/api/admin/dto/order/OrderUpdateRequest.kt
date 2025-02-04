package org.dbm.krautundrueben.api.admin.dto.order

import java.math.BigDecimal
import java.time.LocalDate

data class OrderUpdateRequest(
    val orderDate: LocalDate?,
    val invoiceAmount: BigDecimal?,
    val orderIngredients: List<OrderIngredientRequest>?,
    val orderRecipes: List<OrderRecipeRequest>?
)