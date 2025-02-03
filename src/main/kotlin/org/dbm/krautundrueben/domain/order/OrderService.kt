package org.dbm.krautundrueben.domain.order

import jakarta.persistence.criteria.JoinType
import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.OrderUpdateRequest
import org.dbm.krautundrueben.domain.customer.CustomerEntity
import org.dbm.krautundrueben.domain.customer.CustomerRepository
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.domain.recipe.RecipeEntity
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.CriteriaUtil
import system.NotFoundException
import java.math.BigDecimal
import java.time.LocalDate
import kotlin.jvm.optionals.getOrNull

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val customerRepository: CustomerRepository
) {

    fun findById(id: Int): OrderEntity? {
        return orderRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val order = orderRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no order with ID $id exists.")
        orderRepository.delete(order)
    }

    @Transactional
    fun createOrder(
        customerId: Int,
        orderDate: LocalDate,
        invoiceAmount: BigDecimal?
    ): OrderEntity {
        val customer = customerRepository.findById(customerId).getOrNull()
            ?: throw NotFoundException("Customer with ID $customerId not found.")

        val order = OrderEntity(
            customer = customer,
            orderDate = orderDate,
            invoiceAmount = invoiceAmount,
            orderIngredients = emptyList(),
            orderRecipes = emptyList()
        ).let { orderRepository.save(it) }

        return order
    }

    @Transactional
    fun updateOrder(id: Int, request: OrderUpdateRequest): OrderEntity {
        var order = orderRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no order with ID $id exists.") }

        request.orderDate?.let { order.orderDate = it }
        request.invoiceAmount?.let { order.invoiceAmount = it }

        order = orderRepository.save(order)
        return order
    }

    fun query(params: OrderQueryParams): Page<OrderEntity> {
        val pageRequest = params.toPageRequest(OrderEntity_.ID)
        val specification = applyFiltering(params)
        return orderRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: OrderQueryParams): Specification<OrderEntity> {
        val specifications = mutableListOf<Specification<OrderEntity>>()

        if (params.id != null) {
            specifications.add(idEquals(params.id))
        }
        if (params.customer != null) {
            specifications.add(customerEquals(params.customer))
        }
        if (params.orderDate != null) {
            specifications.add(orderDateEquals(params.orderDate))
        }
        if (params.invoiceAmount != null) {
            specifications.add(invoiceAmountEquals(params.invoiceAmount))
        }
        if (params.orderIngredients != null) {
            specifications.add(orderIngredientsEquals(params.orderIngredients))
        }
        if (params.orderRecipes != null) {
            specifications.add(orderRecipesEquals(params.orderRecipes))
        }

        return Specification.allOf(specifications).and(CriteriaUtil.distinct())
    }

    private fun idEquals(id: Int): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(OrderEntity_.id), id)
        }
    }

    private fun customerEquals(customer: CustomerEntity): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(OrderEntity_.customer), customer)
        }
    }

    private fun orderDateEquals(orderDate: LocalDate): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(OrderEntity_.orderDate), orderDate)
        }
    }

    private fun invoiceAmountEquals(invoiceAmount: BigDecimal): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(OrderEntity_.invoiceAmount), invoiceAmount)
        }
    }

    private fun orderIngredientsEquals(orderIngredient: OrderIngredientEntity): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            val join = root.join<OrderEntity, OrderIngredientEntity>("orderIngredients", JoinType.LEFT)
            val orderPredicate = builder.equal(join.get<OrderEntity>("order"), orderIngredient.order)
            val ingredientPredicate = builder.equal(join.get<IngredientEntity>("ingredient"), orderIngredient.ingredient)
            builder.and(orderPredicate, ingredientPredicate)
        }
    }

    private fun orderRecipesEquals(orderRecipe: OrderRecipeEntity): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            val join = root.join<OrderEntity, OrderRecipeEntity>("orderRecipes", JoinType.LEFT)
            val recipePredicate = builder.equal(join.get<RecipeEntity>("recipe"), orderRecipe.recipe)
            val orderPredicate = builder.equal(join.get<OrderEntity>("order"), orderRecipe.order)
            builder.and(recipePredicate, orderPredicate)
        }
    }
}