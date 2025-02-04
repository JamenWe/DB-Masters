package org.dbm.krautundrueben.api.admin.dto.order

import org.dbm.krautundrueben.domain.order.OrderEntity
import java.math.BigDecimal
import java.time.LocalDate

data class OrderDto(
    val id: Int,
    val customerId: Int,
    val orderDate: LocalDate,
    val invoiceAmount: BigDecimal?,
    val orderIngredients: List<OrderIngredientDto>,
    val orderRecipes: List<OrderRecipeDto>
) {
    companion object {
        fun from(order: OrderEntity): OrderDto {
            return OrderDto(
                id = order.id,
                customerId = order.customer.id,
                orderDate = order.orderDate,
                invoiceAmount = order.invoiceAmount,
                orderIngredients = order.orderIngredients.map { OrderIngredientDto.from(it) },
                orderRecipes = order.orderRecipes.map { OrderRecipeDto.from(it) }
            )
        }
    }
}