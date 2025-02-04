package org.dbm.krautundrueben.domain.order

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface OrderIngredientRepository : JpaRepository<OrderIngredientEntity, Int>,
    JpaSpecificationExecutor<OrderIngredientEntity>{
    fun findByOrderId(orderId: Int): List<OrderIngredientEntity>
}