package org.dbm.krautundrueben.api.admin.dto

data class PaginatedRecipe(
    val recipes: List<RecipeDto>,
    val page: PageData
)