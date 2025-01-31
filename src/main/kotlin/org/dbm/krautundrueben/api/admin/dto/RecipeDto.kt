package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.order.OrderRecipeEntity
import org.dbm.krautundrueben.domain.recipe.RecipeAllergenRestrictionEntity
import org.dbm.krautundrueben.domain.recipe.RecipeEntity
import org.dbm.krautundrueben.domain.recipe.RecipeIngredientEntity
import org.dbm.krautundrueben.domain.recipe.RecipeNutritionalCategoryEntity
import java.math.BigDecimal

data class RecipeDto(
    val id: Int,
    val name: String,
    val netPrice: BigDecimal,
    val preparationTime: Int?,
    val instructions: String?,
    val recipeIngredients: List<RecipeIngredientEntity>,
    val recipeNutritionalCategories: List<RecipeNutritionalCategoryEntity>,
    val recipeAllergenRestrictions: List<RecipeAllergenRestrictionEntity>,
    val orderRecipes: List<OrderRecipeEntity>,
) {
    companion object {
        fun from(recipe: RecipeEntity): RecipeDto {
            return RecipeDto(
                recipe.id,
                recipe.name,
                recipe.netPrice,
                recipe.preparationTime,
                recipe.instructions,
                recipe.recipeIngredients,
                recipe.recipeNutritionalCategories,
                recipe.recipeAllergenRestrictions,
                recipe.orderRecipes,
            )
        }
    }
}