package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.customer.CustomerEntity
import org.dbm.krautundrueben.domain.order.OrderEntity
import org.dbm.krautundrueben.domain.order.OrderIngredientEntity
import org.dbm.krautundrueben.domain.order.OrderRecipeEntity
import java.math.BigDecimal
import java.time.LocalDate

data class OrderDto(
    val id: Int,
    val customer: CustomerEntity,
    val orderDate: LocalDate,
    val invoiceAmount: BigDecimal?,
    val orderIngredients: List<OrderIngredientEntity>,
    val orderRecipes: List<OrderRecipeEntity>,
) {
    companion object {
        fun from(order: OrderEntity): OrderDto {
            return OrderDto(
                order.id,
                order.customer,
                order.orderDate,
                order.invoiceAmount,
                order.orderIngredients,
                order.orderRecipes,
            )
        }
    }
}