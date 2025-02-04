package org.dbm.krautundrueben.api.admin.dto.allergy

import org.dbm.krautundrueben.api.admin.dto.PageData

data class PaginatedAllergenRestriction(
    val allergenRestrictions: List<AllergenRestrictionDto>,
    val page: PageData
)