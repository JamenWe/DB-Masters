package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.domain.supplier.SupplierEntity
import java.math.BigDecimal

data class IngredientDto(
    val id: Int,
    val name: String,
    val unit: String?,
    val netPrice: BigDecimal?,
    val stock: Int?,
    val calories: Int?,
    val carbohydrates: BigDecimal?,
    val protein: BigDecimal?,
    val supplier: SupplierEntity?,
) {
    companion object {
        fun from(ingredient: IngredientEntity): IngredientDto {
            return IngredientDto(
                ingredient.id,
                ingredient.name,
                ingredient.unit,
                ingredient.netPrice,
                ingredient.stock,
                ingredient.calories,
                ingredient.carbohydrates,
                ingredient.protein,
                ingredient.supplier,
            )
        }
    }
}