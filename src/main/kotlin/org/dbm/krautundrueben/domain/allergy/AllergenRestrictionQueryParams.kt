package org.dbm.krautundrueben.domain.allergy

import org.dbm.krautundrueben.domain.recipe.RecipeAllergenRestrictionEntity
import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort

data class AllergenRestrictionQueryParams(
    val id: Int?,
    val name: String?,
    val recipeAllergenRestrictions: RecipeAllergenRestrictionEntity?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams