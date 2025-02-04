package org.dbm.krautundrueben.domain.order

import jakarta.persistence.criteria.JoinType
import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.OrderIngredientRequest
import org.dbm.krautundrueben.api.admin.dto.OrderRecipeRequest
import org.dbm.krautundrueben.api.admin.dto.OrderUpdateRequest
import org.dbm.krautundrueben.domain.customer.CustomerRepository
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.domain.ingredient.IngredientRepository
import org.dbm.krautundrueben.domain.recipe.RecipeEntity
import org.dbm.krautundrueben.domain.recipe.RecipeRepository
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
    private val customerRepository: CustomerRepository,
    private val ingredientRepository: IngredientRepository,
    private val recipeRepository: RecipeRepository,
    private val orderIngredientRepository: OrderIngredientRepository,
    private val orderRecipeRepository: OrderRecipeRepository
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
        invoiceAmount: BigDecimal?,
        orderIngredients: List<OrderIngredientRequest>,
        orderRecipes: List<OrderRecipeRequest>
    ): OrderEntity {
        // Find customer
        val customer = customerRepository.findById(customerId).getOrNull()
            ?: throw NotFoundException("Customer with ID $customerId not found.")

        // Create the base order
        var order = OrderEntity(
            customer = customer,
            orderDate = orderDate,
            invoiceAmount = invoiceAmount,
            orderIngredients = emptyList(),
            orderRecipes = emptyList()
        ).let { orderRepository.save(it) }

        // Handle ingredients if any
        if (orderIngredients.isNotEmpty()) {
            val newOrderIngredients = orderIngredients.map { ingredientRequest ->
                val ingredient = ingredientRepository.findById(ingredientRequest.ingredientId).getOrNull()
                    ?: throw NotFoundException("Ingredient with ID ${ingredientRequest.ingredientId} not found.")

                OrderIngredientEntity(
                    order = order,
                    ingredient = ingredient,
                    quantity = ingredientRequest.quantity
                )
            }
            orderIngredientRepository.saveAll(newOrderIngredients)
        }

        // Handle recipes if any
        if (orderRecipes.isNotEmpty()) {
            val newOrderRecipes = orderRecipes.map { recipeRequest ->
                val recipe = recipeRepository.findById(recipeRequest.recipeId).getOrNull()
                    ?: throw NotFoundException("Recipe with ID ${recipeRequest.recipeId} not found.")

                OrderRecipeEntity(
                    order = order,
                    recipe = recipe,
                    quantity = recipeRequest.quantity
                )
            }
            orderRecipeRepository.saveAll(newOrderRecipes)
        }

        // Refresh the order to include all associations
        order = orderRepository.findById(order.id).get()
        return order
    }

    @Transactional
    fun updateOrder(id: Int, request: OrderUpdateRequest): OrderEntity {
        var order = orderRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no order with ID $id exists.") }

        // Update basic fields if provided
        request.orderDate?.let { order.orderDate = it }
        request.invoiceAmount?.let { order.invoiceAmount = it }

        // Update ingredients if provided
        if (request.orderIngredients != null) {
            // Remove existing ingredients
            val existingIngredients = orderIngredientRepository.findByOrderId(order.id)
            orderIngredientRepository.deleteAll(existingIngredients)

            // Add new ingredients if any
            if (request.orderIngredients.isNotEmpty()) {
                val newOrderIngredients = request.orderIngredients.map { ingredientRequest ->
                    val ingredient = ingredientRepository.findById(ingredientRequest.ingredientId).getOrNull()
                        ?: throw NotFoundException("Ingredient with ID ${ingredientRequest.ingredientId} not found.")

                    OrderIngredientEntity(
                        order = order,
                        ingredient = ingredient,
                        quantity = ingredientRequest.quantity
                    )
                }
                orderIngredientRepository.saveAll(newOrderIngredients)
            }
        }

        // Update recipes if provided
        if (request.orderRecipes != null) {
            // Remove existing recipes
            val existingRecipes = orderRecipeRepository.findByOrderId(order.id)
            orderRecipeRepository.deleteAll(existingRecipes)

            // Add new recipes if any
            if (request.orderRecipes.isNotEmpty()) {
                val newOrderRecipes = request.orderRecipes.map { recipeRequest ->
                    val recipe = recipeRepository.findById(recipeRequest.recipeId).getOrNull()
                        ?: throw NotFoundException("Recipe with ID ${recipeRequest.recipeId} not found.")

                    OrderRecipeEntity(
                        order = order,
                        recipe = recipe,
                        quantity = recipeRequest.quantity
                    )
                }
                orderRecipeRepository.saveAll(newOrderRecipes)
            }
        }

        // Save and refresh the order
        order = orderRepository.save(order)
        return orderRepository.findById(order.id).get()
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
        if (params.customerId != null) {
            specifications.add(customerIdEquals(params.customerId))
        }
        if (params.orderDate != null) {
            specifications.add(orderDateEquals(params.orderDate))
        }
        if (params.invoiceAmount != null) {
            specifications.add(invoiceAmountEquals(params.invoiceAmount))
        }
        if (params.ingredientId != null) {
            specifications.add(hasIngredient(params.ingredientId))
        }
        if (params.recipeId != null) {
            specifications.add(hasRecipe(params.recipeId))
        }

        return Specification.allOf(specifications).and(CriteriaUtil.distinct())
    }

    private fun idEquals(id: Int): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(OrderEntity_.id), id)
        }
    }

    private fun customerIdEquals(customerId: Int): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(OrderEntity_.customer).get<Int>("id"), customerId)
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

    private fun hasIngredient(ingredientId: Int): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            val join = root.join<OrderEntity, OrderIngredientEntity>("orderIngredients", JoinType.LEFT)
            builder.equal(join.get<IngredientEntity>("ingredient").get<Int>("id"), ingredientId)
        }
    }

    private fun hasRecipe(recipeId: Int): Specification<OrderEntity> {
        return Specification { root, _, builder ->
            val join = root.join<OrderEntity, OrderRecipeEntity>("orderRecipes", JoinType.LEFT)
            builder.equal(join.get<RecipeEntity>("recipe").get<Int>("id"), recipeId)
        }
    }
}