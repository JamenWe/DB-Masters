package org.dbm.krautundrueben.domain.recipe

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface RecipeAllergenRestrictionRepository :
    JpaRepository<RecipeAllergenRestrictionEntity, RecipeAllergenRestrictionId>,
    JpaSpecificationExecutor<RecipeAllergenRestrictionEntity>{
        fun findByRecipeId(recipeId: Int): List<RecipeAllergenRestrictionEntity>
    }