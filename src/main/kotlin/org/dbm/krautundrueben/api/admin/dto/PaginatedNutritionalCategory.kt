package org.dbm.krautundrueben.api.admin.dto

data class PaginatedNutritionalCategory(
    val nutritionalCategories: List<NutritionalCategoryDto>,
    val page: PageData
)