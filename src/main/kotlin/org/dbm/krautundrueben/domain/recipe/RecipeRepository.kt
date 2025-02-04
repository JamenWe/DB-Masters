package org.dbm.krautundrueben.domain.recipe

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface RecipeRepository : JpaRepository<RecipeEntity, Int>, JpaSpecificationExecutor<RecipeEntity>