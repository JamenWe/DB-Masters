package org.dbm.krautundrueben.domain.allergy

import jakarta.persistence.criteria.JoinType
import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.AllergenRestrictionUpdateRequest
import org.dbm.krautundrueben.domain.recipe.RecipeAllergenRestrictionEntity
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.CriteriaUtil
import system.NotFoundException
import kotlin.jvm.optionals.getOrNull

@Service
class AllergenRestrictionService(
    private val allergenRestrictionRepository: AllergenRestrictionRepository
) {

    fun findById(id: Int): AllergenRestrictionEntity? {
        return allergenRestrictionRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val allergenRestriction = allergenRestrictionRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no allergen restriction with ID $id exists.")
        allergenRestrictionRepository.delete(allergenRestriction)
    }

    @Transactional
    fun createAllergenRestriction(
        name: String,
    ): AllergenRestrictionEntity {
        val allergenRestriction = AllergenRestrictionEntity(
            name = name
        ).let { allergenRestrictionRepository.save(it) }

        return allergenRestriction
    }

    @Transactional
    fun updateAllergenRestriction(id: Int, request: AllergenRestrictionUpdateRequest): AllergenRestrictionEntity {
        var allergenRestriction = allergenRestrictionRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no allergen restriction with ID $id exists.") }

        request.name?.let { allergenRestriction.name = it }

        allergenRestriction = allergenRestrictionRepository.save(allergenRestriction)
        return allergenRestriction
    }

    fun query(params: AllergenRestrictionQueryParams): Page<AllergenRestrictionEntity> {
        val pageRequest = params.toPageRequest(AllergenRestrictionEntity_.ID)
        val specification = applyFiltering(params)
        return allergenRestrictionRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: AllergenRestrictionQueryParams): Specification<AllergenRestrictionEntity> {
        val specifications = mutableListOf<Specification<AllergenRestrictionEntity>>()

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

    private fun idEquals(id: Int): Specification<AllergenRestrictionEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get<Int>("id"), id)
        }
    }

    private fun nameLike(name: String): Specification<AllergenRestrictionEntity> {
        return Specification { root, _, builder ->
            val restrictionName = builder.lower(root.get(AllergenRestrictionEntity_.name))
            builder.like(restrictionName, "%${name.lowercase()}%")
        }
    }

    private fun recipeIdEquals(recipeId: Int): Specification<AllergenRestrictionEntity> {
        return Specification { root, _, builder ->
            val join = root.join<AllergenRestrictionEntity, RecipeAllergenRestrictionEntity>(
                "recipeAllergenRestrictions",
                JoinType.LEFT
            )
            builder.equal(join.get<Int>("recipe").get<Int>("id"), recipeId)
        }
    }
}