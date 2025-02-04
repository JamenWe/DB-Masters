package org.dbm.krautundrueben.domain.recipe

import java.io.Serializable
import java.util.*

data class RecipeAllergenRestrictionId(
    val recipe: Int = 0,
    val allergenRestriction: Int = 0
) : Serializable {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is RecipeAllergenRestrictionId) return false
        return recipe == other.recipe && allergenRestriction == other.allergenRestriction
    }

    override fun hashCode(): Int {
        return Objects.hash(recipe, allergenRestriction)
    }
}