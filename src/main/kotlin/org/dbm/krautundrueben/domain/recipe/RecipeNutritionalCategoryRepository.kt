package org.dbm.krautundrueben.domain.recipe

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface RecipeNutritionalCategoryRepository :
    JpaRepository<RecipeNutritionalCategoryEntity, RecipeNutritionalCategoryId>,
    JpaSpecificationExecutor<RecipeNutritionalCategoryEntity>{
    fun findByRecipeId(recipeId: Int): List<RecipeNutritionalCategoryEntity>
}