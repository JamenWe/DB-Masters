package org.dbm.krautundrueben.domain.recipe

import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort
import java.math.BigDecimal

data class RecipeQueryParams(
    val id: Int?,
    val name: String?,
    val netPrice: BigDecimal?,
    val preparationTime: Int?,
    val instructions: String?,
    val ingredients: RecipeIngredientEntity?,
    val nutritionalCategories: RecipeNutritionalCategoryEntity?,
    val allergenRestrictions: RecipeAllergenRestrictionEntity?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams