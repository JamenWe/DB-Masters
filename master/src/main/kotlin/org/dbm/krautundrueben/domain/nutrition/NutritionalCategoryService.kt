package org.dbm.krautundrueben.domain.nutrition

import jakarta.persistence.criteria.JoinType
import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.nutrition.NutritionalCategoryUpdateRequest
import org.dbm.krautundrueben.domain.recipe.RecipeNutritionalCategoryEntity
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.CriteriaUtil
import system.NotFoundException
import kotlin.jvm.optionals.getOrNull

@Service
class NutritionalCategoryService(
    private val nutritionalCategoryRepository: NutritionalCategoryRepository
) {

    fun findById(id: Int): NutritionalCategoryEntity? {
        return nutritionalCategoryRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val nutritionalCategory = nutritionalCategoryRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no nutritional category with ID $id exists.")
        nutritionalCategoryRepository.delete(nutritionalCategory)
    }

    @Transactional
    fun createNutritionalCategory(
        name: String,
    ): NutritionalCategoryEntity {
        val nutritionalCategory = NutritionalCategoryEntity(
            name = name
        ).let { nutritionalCategoryRepository.save(it) }

        return nutritionalCategory
    }

    @Transactional
    fun updateNutritionalCategory(id: Int, request: NutritionalCategoryUpdateRequest): NutritionalCategoryEntity {
        var nutritionalCategory = nutritionalCategoryRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no nutritional category with ID $id exists.") }

        request.name?.let { nutritionalCategory.name = it }

        nutritionalCategory = nutritionalCategoryRepository.save(nutritionalCategory)
        return nutritionalCategory
    }

    fun query(params: NutritionalCategoryQueryParams): Page<NutritionalCategoryEntity> {
        val pageRequest = params.toPageRequest(NutritionalCategoryEntity_.ID)
        val specification = applyFiltering(params)
        return nutritionalCategoryRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: NutritionalCategoryQueryParams): Specification<NutritionalCategoryEntity> {
        val specifications = mutableListOf<Specification<NutritionalCategoryEntity>>()

        if (params.id != null) {
            specifications.add(idEquals(params.id))
        }
        if (!params.name.isNullOrBlank()) {
            specifications.add(nameLike(params.name))
        }
        if (params.recipeId != null) {
            specifications.add(recipeIdEquals(params.recipeId))
        }

        return Specification.allOf(specifications).and(CriteriaUtil.distinct())
    }

    private fun idEquals(id: Int): Specification<NutritionalCategoryEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get<Int>("id"), id)
        }
    }

    private fun nameLike(name: String): Specification<NutritionalCategoryEntity> {
        return Specification { root, _, builder ->
            val categoryName = builder.lower(root.get(NutritionalCategoryEntity_.name))
            builder.like(categoryName, "%${name.lowercase()}%")
        }
    }

    private fun recipeIdEquals(recipeId: Int): Specification<NutritionalCategoryEntity> {
        return Specification { root, _, builder ->
            val join = root.join<NutritionalCategoryEntity, RecipeNutritionalCategoryEntity>("recipeNutritionalCategories", JoinType.LEFT)
            builder.equal(join.get<Int>("recipe").get<Int>("id"), recipeId)
        }
    }
}