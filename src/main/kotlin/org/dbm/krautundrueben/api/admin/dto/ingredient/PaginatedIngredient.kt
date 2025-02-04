package org.dbm.krautundrueben.api.admin.dto.ingredient

import org.dbm.krautundrueben.api.admin.dto.PageData

data class PaginatedIngredient(
    val ingredients: List<IngredientDto>,
    val page: PageData
)