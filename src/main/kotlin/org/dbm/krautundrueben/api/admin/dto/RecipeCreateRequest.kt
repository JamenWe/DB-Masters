package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.ingredient.IngredientQuantity
import java.math.BigDecimal

data class RecipeCreateRequest(
    val name: String,
    val netPrice: BigDecimal,
    val preparationTime: Int?,
    val instructions: String?,
    val ingredients: List<IngredientQuantity>,
    val nutritionalCategoryIds: List<Int>,
    val allergenRestrictionIds: List<Int>
)