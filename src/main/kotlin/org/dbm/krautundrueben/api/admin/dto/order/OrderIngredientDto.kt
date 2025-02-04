package org.dbm.krautundrueben.api.admin.dto.order

import org.dbm.krautundrueben.domain.order.OrderIngredientEntity

data class OrderIngredientDto(
    val ingredientId: Int,
    val quantity: Int
) {
    companion object {
        fun from(orderIngredient: OrderIngredientEntity): OrderIngredientDto {
            return OrderIngredientDto(
                ingredientId = orderIngredient.ingredient.id,
                quantity = orderIngredient.quantity
            )
        }
    }
}