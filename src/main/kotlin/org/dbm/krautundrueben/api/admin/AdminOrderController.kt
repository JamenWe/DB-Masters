package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.*
import org.dbm.krautundrueben.api.admin.dto.order.OrderCreateRequest
import org.dbm.krautundrueben.api.admin.dto.order.OrderDto
import org.dbm.krautundrueben.api.admin.dto.order.OrderUpdateRequest
import org.dbm.krautundrueben.api.admin.dto.order.PaginatedOrder
import org.dbm.krautundrueben.domain.order.OrderQueryParams
import org.dbm.krautundrueben.domain.order.OrderService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.BadRequestException
import system.NotFoundException
import java.math.BigDecimal
import java.time.LocalDate

@RestController
@RequestMapping(
    path = ["/internal/orders"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class OrderController(
    private val orderService: OrderService
) {
    @GetMapping("/{id}")
    @Transactional
    fun getOrder(@PathVariable id: Int): ResponseEntity<OrderDto> {
        val order = orderService.findById(id) ?: throw NotFoundException("Order with ID $id not found.")
        return ResponseEntity.ok(OrderDto.from(order))
    }

    @GetMapping
    @Transactional
    fun listOrders(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) customerId: Int?,
        @RequestParam(required = false) orderDate: LocalDate?,
        @RequestParam(required = false) invoiceAmount: BigDecimal?,
        @RequestParam(required = false) ingredientId: Int?,
        @RequestParam(required = false) recipeId: Int?,
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "50") limit: Int,
        @RequestParam(defaultValue = "DESC") sortDir: Sort.Direction,
        @RequestParam(required = false) sortField: String?
    ): PaginatedOrder {
        val params = OrderQueryParams(
            id,
            customerId,
            orderDate,
            invoiceAmount,
            ingredientId,
            recipeId,
            offset,
            limit,
            sortDir,
            sortField
        )

        logger().info("Received GET orders with params: {}", params)
        val orders = orderService.query(params).map { OrderDto.from(it) }
        val pageData = PageData(params.offset, params.limit, orders.totalElements)

        return PaginatedOrder(orders.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createOrder(@RequestBody createRequest: OrderCreateRequest): ResponseEntity<OrderDto> {
        logger().info("Received POST create order request: {}", createRequest)

        if (createRequest.orderIngredients.isEmpty() && createRequest.orderRecipes.isEmpty()) {
            throw BadRequestException("Order must contain at least one ingredient or recipe")
        }

        val order = orderService.createOrder(
            customerId = createRequest.customerId,
            orderDate = createRequest.orderDate,
            invoiceAmount = createRequest.invoiceAmount,
            orderIngredients = createRequest.orderIngredients,
            orderRecipes = createRequest.orderRecipes,
        )

        val orderDto = OrderDto.from(order)
        return ResponseEntity.status(HttpStatus.CREATED).body(orderDto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateOrder(
        @PathVariable id: Int,
        @RequestBody updateRequest: OrderUpdateRequest
    ): OrderDto {
        logger().info("Received PUT update order request for ID {}: {}", id, updateRequest)
        val updatedOrder = orderService.updateOrder(id, updateRequest)
        return OrderDto.from(updatedOrder)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteOrder(@PathVariable id: Int): ResponseEntity<Void> {
        orderService.delete(id)
        return ResponseEntity.noContent().build()
    }
}