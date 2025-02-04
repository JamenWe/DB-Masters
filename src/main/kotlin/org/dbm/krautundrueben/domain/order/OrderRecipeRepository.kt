package org.dbm.krautundrueben.domain.order

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface OrderRecipeRepository : JpaRepository<OrderRecipeEntity, Int>,
    JpaSpecificationExecutor<OrderRecipeEntity>{
    fun findByOrderId(orderId: Int): List<OrderRecipeEntity>
}