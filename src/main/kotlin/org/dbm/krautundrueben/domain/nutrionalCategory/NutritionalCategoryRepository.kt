package org.dbm.krautundrueben.domain.nutrionalCategory

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface NutritionalCategoryRepository : JpaRepository<NutritionalCategoryEntity, Int>, JpaSpecificationExecutor<NutritionalCategoryEntity>