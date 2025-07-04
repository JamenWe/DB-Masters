package org.dbm.krautundrueben.domain.allergy

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AllergenRestrictionRepository : JpaRepository<AllergenRestrictionEntity, Int>,
    JpaSpecificationExecutor<AllergenRestrictionEntity> {
        fun findByName(name: String): Optional<AllergenRestrictionEntity>
    }