package org.dbm.krautundrueben.domain.recipe

import java.io.Serializable
import java.util.*

data class RecipeNutritionalCategoryId(
    val recipe: Int = 0,
    val nutritionalCategory: Int = 0
) : Serializable {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is RecipeNutritionalCategoryId) return false
        return recipe == other.recipe && nutritionalCategory == other.nutritionalCategory
    }

    override fun hashCode(): Int {
        return Objects.hash(recipe, nutritionalCategory)
    }
}