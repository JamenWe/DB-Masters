package org.dbm.krautundrueben.api.admin.dto.order

data class OrderIngredientRequest(
    val ingredientId: Int,
    val quantity: Int
)