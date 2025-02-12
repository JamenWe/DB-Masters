package org.dbm.krautundrueben.domain.order

import org.dbm.krautundrueben.api.admin.dto.order.CustomerOrderDto
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository : JpaRepository<OrderEntity, Int>, JpaSpecificationExecutor<OrderEntity>{
    @Query("""
    SELECT DISTINCT o FROM OrderEntity o 
    LEFT JOIN FETCH o.customer 
    LEFT JOIN FETCH o.orderIngredients oi 
    LEFT JOIN FETCH oi.ingredient 
    LEFT JOIN FETCH o.orderRecipes or 
    LEFT JOIN FETCH or.recipe
""")
    fun findAllWithDetails(): List<OrderEntity>

    @Query(
        value = "SELECT * FROM get_customer_orders(:customerId)",
        nativeQuery = true
    )
    fun getCustomerOrders(@Param("customerId") customerId: Int): List<CustomerOrderDto>
}