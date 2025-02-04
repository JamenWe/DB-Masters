package org.dbm.krautundrueben.domain.recipe

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface RecipeIngredientRepository : JpaRepository<RecipeIngredientEntity, RecipeIngredientId>,
    JpaSpecificationExecutor<RecipeIngredientEntity>{
    fun findByRecipeId(recipeId: Int): List<RecipeIngredientEntity>
}