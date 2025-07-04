package org.dbm.krautundrueben.domain.recipe

data class RecipeIngredientDto(
    val ingredientId: Int,
    val quantity: Int
) {
    companion object {
        fun from(recipeIngredient: RecipeIngredientEntity): RecipeIngredientDto {
            return RecipeIngredientDto(
                recipeIngredient.ingredient.id,
                recipeIngredient.quantity
            )
        }
    }
}