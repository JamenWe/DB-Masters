package org.dbm.krautundrueben.api.admin.dto.recipe

import org.dbm.krautundrueben.domain.recipe.RecipeEntity
import org.dbm.krautundrueben.domain.recipe.RecipeIngredientDto
import java.math.BigDecimal

data class RecipeDto(
    val id: Int,
    val name: String,
    val netPrice: BigDecimal,
    val preparationTime: Int?,
    val instructions: String?,
    val ingredients: List<RecipeIngredientDto>,
    val nutritionalCategoryIds: List<Int>,
    val allergenRestrictionIds: List<Int>
) {
    companion object {
        fun from(recipe: RecipeEntity): RecipeDto {
            return RecipeDto(
                recipe.id,
                recipe.name,
                recipe.netPrice,
                recipe.preparationTime,
                recipe.instructions,
                recipe.recipeIngredients.map { RecipeIngredientDto.from(it) },
                recipe.recipeNutritionalCategories.map { it.nutritionalCategory.id },
                recipe.recipeAllergenRestrictions.map { it.allergenRestriction.id },
            )
        }
    }
}