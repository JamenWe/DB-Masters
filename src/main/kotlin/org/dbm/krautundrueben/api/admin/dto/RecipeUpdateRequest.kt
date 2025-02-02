package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionEntity
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryEntity
import java.math.BigDecimal

data class RecipeUpdateRequest(
    val recipeName: String?,
    val netPrice: BigDecimal?,
    val preparationTime: Int?,
    val instructions: String?,
    val ingredients: List<IngredientEntity>?,
    val allergenRestrictions: List<AllergenRestrictionEntity>?,
    val nutritionalCategories: List<NutritionalCategoryEntity>?,
)