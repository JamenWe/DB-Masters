package org.dbm.krautundrueben.domain.supplier

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface SupplierRepository : JpaRepository<SupplierEntity, Int>, JpaSpecificationExecutor<SupplierEntity>