package org.dbm.krautundrueben.domain.nutrition

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface NutritionalCategoryRepository : JpaRepository<NutritionalCategoryEntity, Int>,
    JpaSpecificationExecutor<NutritionalCategoryEntity> {
    fun findByName(name: String): Optional<NutritionalCategoryEntity>
}