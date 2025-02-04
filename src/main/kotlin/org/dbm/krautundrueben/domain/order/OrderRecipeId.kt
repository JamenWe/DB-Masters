package org.dbm.krautundrueben.domain.order

import java.io.Serializable
import java.util.*

data class OrderRecipeId(
    val order: Int = 0,
    val recipe: Int = 0
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OrderRecipeId) return false
        return order == other.order && recipe == other.recipe
    }

    override fun hashCode(): Int {
        return Objects.hash(order, recipe)
    }
}