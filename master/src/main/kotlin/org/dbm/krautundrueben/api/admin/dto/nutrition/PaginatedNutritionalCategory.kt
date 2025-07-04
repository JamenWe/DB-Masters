package org.dbm.krautundrueben.api.admin.dto.nutrition

import org.dbm.krautundrueben.api.admin.dto.PageData

data class PaginatedNutritionalCategory(
    val nutritionalCategories: List<NutritionalCategoryDto>,
    val page: PageData
)