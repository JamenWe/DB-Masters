package org.dbm.krautundrueben.domain.recipe

import java.io.Serializable
import java.util.*

data class RecipeIngredientId(
    val recipe: Int = 0,
    val ingredient: Int = 0
) : Serializable {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is RecipeIngredientId) return false
        return recipe == other.recipe && ingredient == other.ingredient
    }

    override fun hashCode(): Int {
        return Objects.hash(recipe, ingredient)
    }
}