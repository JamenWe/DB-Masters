package org.dbm.krautundrueben.api.admin.dto.order

import org.dbm.krautundrueben.domain.order.OrderRecipeEntity

data class OrderRecipeDto(
    val recipeId: Int,
    val quantity: Int
) {
    companion object {
        fun from(orderRecipe: OrderRecipeEntity): OrderRecipeDto {
            return OrderRecipeDto(
                recipeId = orderRecipe.recipe.id,
                quantity = orderRecipe.quantity
            )
        }
    }
}