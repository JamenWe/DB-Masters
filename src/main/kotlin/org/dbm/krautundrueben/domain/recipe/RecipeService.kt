package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.criteria.JoinType
import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.RecipeUpdateRequest
import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionEntity
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryEntity
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.CriteriaUtil
import system.NotFoundException
import java.math.BigDecimal
import kotlin.jvm.optionals.getOrNull

@Service
class RecipeService(
    private val recipeRepository: RecipeRepository,
    private val recipeIngredientRepository: RecipeIngredientRepository,
    private val recipeNutritionalCategoryRepository: RecipeNutritionalCategoryRepository,
    private val recipeAllergenRestrictionRepository: RecipeAllergenRestrictionRepository
) {

    fun findById(id: Int): RecipeEntity? {
        return recipeRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val recipe = recipeRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no recipe with ID $id exists.")
        recipeRepository.delete(recipe)
    }

    @Transactional
    fun createRecipe(
        recipeName: String,
        netPrice: BigDecimal,
        preparationTime: Int?,
        instructions: String?,
        ingredients: List<IngredientEntity>?,
        nutritionalCategories: List<NutritionalCategoryEntity>?,
        allergenRestrictions: List<AllergenRestrictionEntity>?
    ): RecipeEntity {
        val recipe = RecipeEntity(
            name = recipeName,
            netPrice = netPrice,
            preparationTime = preparationTime,
            instructions = instructions,
            recipeIngredients = emptyList(),
            recipeNutritionalCategories = emptyList(),
            recipeAllergenRestrictions = emptyList(),
            orderRecipes = emptyList()
        ).let { recipeRepository.save(it) }

        // Handle Ingredients
        if (!ingredients.isNullOrEmpty()) {
            val recipeIngredients = ingredients.map { ingredient ->
                RecipeIngredientEntity(
                    recipe = recipe,
                    ingredient = ingredient,
                    quantity = 1
                )
            }
            recipeIngredientRepository.saveAll(recipeIngredients)
        }

        // Handle Nutritional Categories
        if (!nutritionalCategories.isNullOrEmpty()) {
            val recipeNutritionalCategories = nutritionalCategories.map { category ->
                RecipeNutritionalCategoryEntity(
                    recipe = recipe,
                    nutritionalCategory = category
                )
            }
            recipeNutritionalCategoryRepository.saveAll(recipeNutritionalCategories)
        }

        // Handle Allergen Restrictions
        if (!allergenRestrictions.isNullOrEmpty()) {
            val recipeAllergenRestrictions = allergenRestrictions.map { restriction ->
                RecipeAllergenRestrictionEntity(
                    recipe = recipe,
                    allergenRestriction = restriction
                )
            }
            recipeAllergenRestrictionRepository.saveAll(recipeAllergenRestrictions)
        }

        return recipe
    }

    @Transactional
    fun updateRecipe(id: Int, request: RecipeUpdateRequest): RecipeEntity {
        var recipe = recipeRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no recipe with ID $id exists.") }

        request.recipeName?.let { recipe.name = it }
        request.netPrice?.let { recipe.netPrice = it }
        request.preparationTime?.let { recipe.preparationTime = it }
        request.instructions?.let { recipe.instructions = it }

        // Handle Ingredients
        if (request.ingredients != null) {
            // Remove existing RecipeIngredientEntities
            val existingIngredients = recipeIngredientRepository.findByRecipeId(id)
            recipeIngredientRepository.deleteAll(existingIngredients)

            // Add new RecipeIngredientEntities
            val newRecipeIngredients = request.ingredients.map { ingredient ->
                RecipeIngredientEntity(
                    recipe = recipe,
                    ingredient = ingredient,
                    quantity = 1
                )
            }
            recipeIngredientRepository.saveAll(newRecipeIngredients)
        }

        // Handle Nutritional Categories
        if (request.nutritionalCategories != null) {
            // Remove existing RecipeNutritionalCategoryEntities
            val existingNutritionalCategories = recipeNutritionalCategoryRepository.findByRecipeId(id)
            recipeNutritionalCategoryRepository.deleteAll(existingNutritionalCategories)

            // Add new RecipeNutritionalCategoryEntities
            val newRecipeNutritionalCategories = request.nutritionalCategories.map { category ->
                RecipeNutritionalCategoryEntity(
                    recipe = recipe,
                    nutritionalCategory = category
                )
            }
            recipeNutritionalCategoryRepository.saveAll(newRecipeNutritionalCategories)
        }

        // Handle Allergen Restrictions
        if (request.allergenRestrictions != null) {
            // Remove existing RecipeAllergenRestrictionEntities
            val existingAllergenRestrictions = recipeAllergenRestrictionRepository.findByRecipeId(id)
            recipeAllergenRestrictionRepository.deleteAll(existingAllergenRestrictions)

            // Add new RecipeAllergenRestrictionEntities
            val newRecipeAllergenRestrictions = request.allergenRestrictions.map { restriction ->
                RecipeAllergenRestrictionEntity(
                    recipe = recipe,
                    allergenRestriction = restriction
                )
            }
            recipeAllergenRestrictionRepository.saveAll(newRecipeAllergenRestrictions)
        }

        recipe = recipeRepository.save(recipe)
        return recipe
    }

    fun query(params: RecipeQueryParams): Page<RecipeEntity> {
        val pageRequest = params.toPageRequest(RecipeEntity_.ID)
        val specification = applyFiltering(params)
        return recipeRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: RecipeQueryParams): Specification<RecipeEntity> {
        val specifications = mutableListOf<Specification<RecipeEntity>>()

        if (params.id != null) {
            specifications.add(idEquals(params.id))
        }
        if (!params.name.isNullOrBlank()) {
            specifications.add(nameLike(params.name))
        }
        if (params.netPrice != null) {
            specifications.add(netPriceEquals(params.netPrice))
        }
        if (params.preparationTime != null) {
            specifications.add(preparationTimeEquals(params.preparationTime))
        }
        if (!params.instructions.isNullOrBlank()) {
            specifications.add(instructionsLike(params.instructions))
        }
        if (params.ingredients != null) {
            specifications.add(ingredientsEquals(params.ingredients))
        }
        if (params.nutritionalCategories != null) {
            specifications.add(nutritionalCategoriesEquals(params.nutritionalCategories))
        }
        if (params.allergenRestrictions != null) {
            specifications.add(allergenRestrictionsEquals(params.allergenRestrictions))
        }

        return Specification.allOf(specifications).and(CriteriaUtil.distinct())
    }

    private fun idEquals(id: Int): Specification<RecipeEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get<Int>("id"), id)
        }
    }

    private fun nameLike(name: String): Specification<RecipeEntity> {
        return Specification { root, _, builder ->
            val recipeName = builder.lower(root.get(RecipeEntity_.name))
            builder.like(recipeName, "%${name.lowercase()}%")
        }
    }

    private fun netPriceEquals(netPrice: BigDecimal): Specification<RecipeEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(RecipeEntity_.netPrice), netPrice)
        }
    }

    private fun preparationTimeEquals(preparationTime: Int): Specification<RecipeEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get(RecipeEntity_.preparationTime), preparationTime)
        }
    }

    private fun instructionsLike(instructions: String): Specification<RecipeEntity> {
        return Specification { root, _, builder ->
            val recipeInstructions = builder.lower(root.get(RecipeEntity_.instructions))
            builder.like(recipeInstructions, "%${instructions.lowercase()}%")
        }
    }

    private fun ingredientsEquals(orderIngredient: RecipeIngredientEntity): Specification<RecipeEntity> {
        return Specification { root, query, builder ->
            val join = root.join<RecipeEntity, RecipeIngredientEntity>("recipeIngredients", JoinType.LEFT)
            val ingredientPredicate = builder.equal(join.get<IngredientEntity>("ingredient"), orderIngredient.ingredient)
            builder.equal(join.get<RecipeEntity>("recipe"), orderIngredient.recipe)
            builder.and(ingredientPredicate, builder.equal(join.get<RecipeEntity>("recipe"), orderIngredient.recipe))
        }
    }

    private fun nutritionalCategoriesEquals(recipeNutritionalCategory: RecipeNutritionalCategoryEntity): Specification<RecipeEntity> {
        return Specification { root, query, builder ->
            val join = root.join<RecipeEntity, RecipeNutritionalCategoryEntity>("recipeNutritionalCategories", JoinType.LEFT)
            val categoryPredicate = builder.equal(join.get<NutritionalCategoryEntity>("nutritionalCategory"), recipeNutritionalCategory.nutritionalCategory)
            builder.equal(join.get<RecipeEntity>("recipe"), recipeNutritionalCategory.recipe)
            builder.and(categoryPredicate, builder.equal(join.get<RecipeEntity>("recipe"), recipeNutritionalCategory.recipe))
        }
    }

    private fun allergenRestrictionsEquals(recipeAllergenRestriction: RecipeAllergenRestrictionEntity): Specification<RecipeEntity> {
        return Specification { root, query, builder ->
            val join = root.join<RecipeEntity, RecipeAllergenRestrictionEntity>("recipeAllergenRestrictions", JoinType.LEFT)
            val restrictionPredicate = builder.equal(join.get<AllergenRestrictionEntity>("allergenRestriction"), recipeAllergenRestriction.allergenRestriction)
            builder.equal(join.get<RecipeEntity>("recipe"), recipeAllergenRestriction.recipe)
            builder.and(restrictionPredicate, builder.equal(join.get<RecipeEntity>("recipe"), recipeAllergenRestriction.recipe))
        }
    }
}