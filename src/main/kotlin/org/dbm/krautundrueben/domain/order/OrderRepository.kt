package org.dbm.krautundrueben.domain.order

import org.dbm.krautundrueben.domain.customer.CustomerEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository : JpaRepository<OrderEntity, Int>, JpaSpecificationExecutor<OrderEntity>{
    fun findByCustomer(customer: CustomerEntity): List<OrderEntity>
}