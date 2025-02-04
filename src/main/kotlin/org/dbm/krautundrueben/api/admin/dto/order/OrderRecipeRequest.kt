package org.dbm.krautundrueben.api.admin.dto.order

data class OrderRecipeRequest(
    val recipeId: Int,
    val quantity: Int
)