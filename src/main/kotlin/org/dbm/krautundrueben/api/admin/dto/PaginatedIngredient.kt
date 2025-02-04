package org.dbm.krautundrueben.api.admin.dto

data class PaginatedIngredient(
    val ingredients: List<IngredientDto>,
    val page: PageData
)