package org.dbm.krautundrueben.api.admin.dto.supplier

import org.dbm.krautundrueben.api.admin.dto.PageData
import org.dbm.krautundrueben.api.admin.dto.recipe.RecipeDto

data class PaginatedRecipe(
    val recipes: List<RecipeDto>,
    val page: PageData
)