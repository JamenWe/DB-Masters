package org.dbm.krautundrueben.api.admin.dto

import java.math.BigDecimal

data class IngredientUpdateRequest(
    val unit: String?,
    val netPrice: BigDecimal?,
    val stock: Int?,
    val calories: Int?,
    val carbohydrates: BigDecimal?,
    val protein: BigDecimal?,
    val supplierId: Int?
)