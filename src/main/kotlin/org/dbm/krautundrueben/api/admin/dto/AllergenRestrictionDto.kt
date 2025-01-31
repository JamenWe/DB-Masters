package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionEntity
import org.dbm.krautundrueben.domain.recipe.RecipeAllergenRestrictionEntity

data class AllergenRestrictionDto(
    val id: Int,
    val name: String,
    val recipeAllergenRestriction: List<RecipeAllergenRestrictionEntity>,
) {
    companion object {
        fun from(allergenRestriction: AllergenRestrictionEntity): AllergenRestrictionDto {
            return AllergenRestrictionDto(
                allergenRestriction.id,
                allergenRestriction.name,
                allergenRestriction.recipeAllergenRestrictions,
            )
        }
    }
}