package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionEntity

data class AllergenRestrictionDto(
    val id: Int,
    val name: String,
) {
    companion object {
        fun from(allergenRestriction: AllergenRestrictionEntity): AllergenRestrictionDto {
            return AllergenRestrictionDto(
                allergenRestriction.id,
                allergenRestriction.name,
            )
        }
    }
}