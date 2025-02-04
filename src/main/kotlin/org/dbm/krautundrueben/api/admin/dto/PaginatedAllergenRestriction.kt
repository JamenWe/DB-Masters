package org.dbm.krautundrueben.api.admin.dto

data class PaginatedAllergenRestriction(
    val allergenRestrictions: List<AllergenRestrictionDto>,
    val page: PageData
)