package org.dbm.krautundrueben.domain.order

import java.io.Serializable
import java.util.*

data class OrderIngredientId(
    val order: Int = 0,
    val ingredient: Int = 0
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is OrderIngredientId) return false
        return order == other.order && ingredient == other.ingredient
    }

    override fun hashCode(): Int {
        return Objects.hash(order, ingredient)
    }
}