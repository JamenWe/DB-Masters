package org.dbm.krautundrueben.domain.ingredient

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface IngredientRepository : JpaRepository<IngredientEntity, Int>, JpaSpecificationExecutor<IngredientEntity>