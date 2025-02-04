package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryEntity

data class NutritionalCategoryDto(
    val id: Int,
    val name: String,
) {
    companion object {
        fun from(nutritionalCategory: NutritionalCategoryEntity): NutritionalCategoryDto {
            return NutritionalCategoryDto(
                nutritionalCategory.id,
                nutritionalCategory.name,
            )
        }
    }
}