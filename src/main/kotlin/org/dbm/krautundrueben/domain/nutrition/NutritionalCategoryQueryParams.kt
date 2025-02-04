package org.dbm.krautundrueben.domain.nutrition

import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort

data class NutritionalCategoryQueryParams(
    val id: Int?,
    val name: String?,
    val recipeId: Int?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams