package org.dbm.krautundrueben.api.admin.dto

data class OrderRecipeRequest(
    val recipeId: Int,
    val quantity: Int
)