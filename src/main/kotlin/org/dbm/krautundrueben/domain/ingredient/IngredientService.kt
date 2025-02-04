package org.dbm.krautundrueben.domain.ingredient

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.IngredientUpdateRequest
import org.dbm.krautundrueben.domain.supplier.SupplierRepository
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.BadRequestException
import system.CriteriaUtil
import system.NotFoundException
import java.math.BigDecimal
import kotlin.jvm.optionals.getOrNull

@Service
class IngredientService(
    private val ingredientRepository: IngredientRepository,
    private val supplierRepository: SupplierRepository
) {

    fun findById(id: Int): IngredientEntity? {
        return ingredientRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val ingredient = ingredientRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no ingredient with ID $id exists.")
        ingredientRepository.delete(ingredient)
    }

    @Transactional
    fun createIngredient(
        name: String,
        unit: String?,
        netPrice: BigDecimal?,
        stock: Int?,
        calories: Int?,
        carbohydrates: BigDecimal?,
        protein: BigDecimal?,
        supplierId: Int
    ): IngredientEntity {
        if (name.isBlank()) {
            throw BadRequestException("Ingredient name cannot be empty")
        }

        val supplier = supplierRepository.findById(supplierId).getOrNull()
            ?: throw NotFoundException("Supplier with ID $supplierId not found.")

        val ingredient = IngredientEntity(
            name = name,
            unit = unit,
            netPrice = netPrice,
            stock = stock,
            calories = calories,
            carbohydrates = carbohydrates,
            protein = protein,
            supplier = supplier
        ).let { ingredientRepository.save(it) }

        return ingredient
    }

    @Transactional
    fun updateIngredient(id: Int, request: IngredientUpdateRequest): IngredientEntity {
        var ingredient = ingredientRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no ingredient with ID $id exists.") }

        request.unit?.let { ingredient.unit = it }
        request.netPrice?.let { ingredient.netPrice = it }
        request.stock?.let { ingredient.stock = it }
        request.calories?.let { ingredient.calories = it }
        request.carbohydrates?.let { ingredient.carbohydrates = it }
        request.protein?.let { ingredient.protein = it }

        if (request.supplierId != null) {
            val supplier = supplierRepository.findById(request.supplierId).getOrNull()
                ?: throw NotFoundException("Supplier with ID ${request.supplierId} not found.")
            ingredient.supplier = supplier
        }

        ingredient = ingredientRepository.save(ingredient)
        return ingredient
    }

    fun query(params: IngredientQueryParams): Page<IngredientEntity> {
        val pageRequest = params.toPageRequest(IngredientEntity_.ID)
        val specification = applyFiltering(params)
        return ingredientRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: IngredientQueryParams): Specification<IngredientEntity> {
        val specifications = mutableListOf<Specification<IngredientEntity>>()

        if (params.id != null) {
            specifications.add(idEquals(params.id))
        }
        if (!params.name.isNullOrBlank()) {
            specifications.add(nameLike(params.name))
        }
        if (!params.unit.isNullOrBlank()) {
            specifications.add(unitLike(params.unit))
        }
        if (params.netPrice != null) {
            specifications.add(netPriceEquals(params.netPrice))
        }
        if (params.stock != null) {
            specifications.add(stockEquals(params.stock))
        }
        if (params.calories != null) {
            specifications.add(caloriesEquals(params.calories))
        }
        if (params.carbohydrates != null) {
            specifications.add(carbohydratesEquals(params.carbohydrates))
        }
        if (params.protein != null) {
            specifications.add(proteinEquals(params.protein))
        }
        if (params.supplierId != null) {
            specifications.add(supplierIdEquals(params.supplierId))
        }

        return Specification.allOf(specifications).and(CriteriaUtil.distinct())
    }

    private fun idEquals(id: Int): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get<Int>("id"), id)
        }
    }

    private fun nameLike(name: String): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            val ingredientName = builder.lower(root.get(IngredientEntity_.name))
            builder.like(ingredientName, "%${name.lowercase()}%")
        }
    }

    private fun unitLike(unit: String): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            val ingredientUnit = builder.lower(root.get(IngredientEntity_.unit))
            builder.like(ingredientUnit, "%${unit.lowercase()}%")
        }
    }

    private fun netPriceEquals(netPrice: BigDecimal): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(IngredientEntity_.netPrice), netPrice)
        }
    }

    private fun stockEquals(stock: Int): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(IngredientEntity_.stock), stock)
        }
    }

    private fun caloriesEquals(calories: Int): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(IngredientEntity_.calories), calories)
        }
    }

    private fun carbohydratesEquals(carbohydrates: BigDecimal): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(IngredientEntity_.carbohydrates), carbohydrates)
        }
    }

    private fun proteinEquals(protein: BigDecimal): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(IngredientEntity_.protein), protein)
        }
    }

    private fun supplierIdEquals(supplierId: Int): Specification<IngredientEntity> {
        return Specification { root, _, builder ->
            val supplier = root.get(IngredientEntity_.supplier)
            builder.equal(supplier.get<Int>("id"), supplierId)
        }
    }
}