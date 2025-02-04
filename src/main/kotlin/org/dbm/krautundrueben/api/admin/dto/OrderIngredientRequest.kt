package org.dbm.krautundrueben.api.admin.dto

data class OrderIngredientRequest(
    val ingredientId: Int,
    val quantity: Int
)