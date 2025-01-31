package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryEntity
import org.dbm.krautundrueben.domain.recipe.RecipeNutritionalCategoryEntity

data class NutritionalCategoryDto(
    val id: Int,
    val name: String,
    val recipeNutritionalCategories: List<RecipeNutritionalCategoryEntity>,
) {
    companion object {
        fun from(nutritionalCategory: NutritionalCategoryEntity): NutritionalCategoryDto {
            return NutritionalCategoryDto(
                nutritionalCategory.id,
                nutritionalCategory.name,
                nutritionalCategory.recipeNutritionalCategories,
            )
        }
    }
}