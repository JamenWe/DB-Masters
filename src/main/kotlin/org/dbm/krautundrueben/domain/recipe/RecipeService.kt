package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.criteria.JoinType
import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.recipe.RecipeUpdateRequest
import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionEntity
import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionRepository
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.dbm.krautundrueben.domain.ingredient.IngredientQuantity
import org.dbm.krautundrueben.domain.ingredient.IngredientRepository
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryEntity
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryRepository
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.BadRequestException
import system.CriteriaUtil
import system.NotFoundException
import java.math.BigDecimal
import kotlin.jvm.optionals.getOrNull

@Service
class RecipeService(
    private val recipeRepository: RecipeRepository,
    private val ingredientRepository: IngredientRepository,
    private val nutritionalCategoryRepository: NutritionalCategoryRepository,
    private val allergenRestrictionRepository: AllergenRestrictionRepository,
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
        name: String,
        netPrice: BigDecimal,
        preparationTime: Int?,
        instructions: String?,
        ingredientQuantities: List<IngredientQuantity>,
        nutritionalCategoryIds: List<Int>,
        allergenRestrictionIds: List<Int>
    ): RecipeEntity {
        if (name.isBlank()) {
            throw BadRequestException("Recipe name cannot be empty")
        }

        // Create the base recipe
        var recipe = RecipeEntity(
            name = name,
            netPrice = netPrice,
            preparationTime = preparationTime,
            instructions = instructions,
            recipeIngredients = mutableListOf(),
            recipeNutritionalCategories = mutableListOf(),
            recipeAllergenRestrictions = mutableListOf(),
        ).let { recipeRepository.save(it) }

        // Handle ingredients and quantities
        val recipeIngredients = ingredientQuantities.map { ingredientQuantity ->
            val ingredient = ingredientRepository.findById(ingredientQuantity.ingredientId).getOrNull()
                ?: throw NotFoundException("Ingredient with ID ${ingredientQuantity.ingredientId} not found.")

            RecipeIngredientEntity(
                recipe = recipe,
                ingredient = ingredient,
                quantity = ingredientQuantity.quantity
            )
        }
        recipeIngredientRepository.saveAll(recipeIngredients)

        // Handle nutritional categories
        val recipeNutritionalCategories = nutritionalCategoryIds.map { categoryId ->
            val category = nutritionalCategoryRepository.findById(categoryId).getOrNull()
                ?: throw NotFoundException("Nutritional category with ID $categoryId not found.")

            RecipeNutritionalCategoryEntity(
                recipe = recipe,
                nutritionalCategory = category
            )
        }
        recipeNutritionalCategoryRepository.saveAll(recipeNutritionalCategories)

        // Handle allergen restrictions
        val recipeAllergenRestrictions = allergenRestrictionIds.map { restrictionId ->
            val restriction = allergenRestrictionRepository.findById(restrictionId).getOrNull()
                ?: throw NotFoundException("Allergen restriction with ID $restrictionId not found.")

            RecipeAllergenRestrictionEntity(
                recipe = recipe,
                allergenRestriction = restriction
            )
        }
        recipeAllergenRestrictionRepository.saveAll(recipeAllergenRestrictions)

        // Refresh the recipe to include all associations
        recipe = recipeRepository.findById(recipe.id).get()
        return recipe
    }

    @Transactional
    fun updateRecipe(id: Int, request: RecipeUpdateRequest): RecipeEntity {
        var recipe = recipeRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no recipe with ID $id exists.") }

        request.name?.let { recipe.name = it }
        request.netPrice?.let { recipe.netPrice = it }
        request.preparationTime?.let { recipe.preparationTime = it }
        request.instructions?.let { recipe.instructions = it }

        // Handle Ingredients
        if (request.ingredients != null) {
            // Remove existing RecipeIngredientEntities
            val existingIngredients = recipeIngredientRepository.findByRecipeId(id)
            recipeIngredientRepository.deleteAll(existingIngredients)

            // Add new RecipeIngredientEntities
            val newRecipeIngredients = request.ingredients.map { ingredientQuantity ->
                val ingredient = ingredientRepository.findById(ingredientQuantity.ingredientId).getOrNull()
                    ?: throw NotFoundException("Ingredient with ID ${ingredientQuantity.ingredientId} not found.")

                RecipeIngredientEntity(
                    recipe = recipe,
                    ingredient = ingredient,
                    quantity = ingredientQuantity.quantity
                )
            }
            recipeIngredientRepository.saveAll(newRecipeIngredients)
        }

        // Handle Nutritional Categories
        if (request.nutritionalCategoryIds != null) {
            // Remove existing RecipeNutritionalCategoryEntities
            val existingNutritionalCategories = recipeNutritionalCategoryRepository.findByRecipeId(id)
            recipeNutritionalCategoryRepository.deleteAll(existingNutritionalCategories)

            // Add new RecipeNutritionalCategoryEntities
            val newRecipeNutritionalCategories = request.nutritionalCategoryIds.map { categoryId ->
                val category = nutritionalCategoryRepository.findById(categoryId).getOrNull()
                    ?: throw NotFoundException("Nutritional category with ID $categoryId not found.")

                RecipeNutritionalCategoryEntity(
                    recipe = recipe,
                    nutritionalCategory = category
                )
            }
            recipeNutritionalCategoryRepository.saveAll(newRecipeNutritionalCategories)
        }

        // Handle Allergen Restrictions
        if (request.allergenRestrictionIds != null) {
            // Remove existing RecipeAllergenRestrictionEntities
            val existingAllergenRestrictions = recipeAllergenRestrictionRepository.findByRecipeId(id)
            recipeAllergenRestrictionRepository.deleteAll(existingAllergenRestrictions)

            // Add new RecipeAllergenRestrictionEntities
            val newRecipeAllergenRestrictions = request.allergenRestrictionIds.map { restrictionId ->
                val restriction = allergenRestrictionRepository.findById(restrictionId).getOrNull()
                    ?: throw NotFoundException("Allergen restriction with ID $restrictionId not found.")

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
        if (params.ingredientId != null) {
            specifications.add(hasIngredient(params.ingredientId))
        }
        if (params.nutritionalCategoryId != null) {
            specifications.add(hasNutritionalCategory(params.nutritionalCategoryId))
        }
        if (params.allergenRestrictionId != null) {
            specifications.add(hasAllergenRestriction(params.allergenRestrictionId))
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

    private fun hasIngredient(ingredientId: Int): Specification<RecipeEntity> {
        return Specification { root, query, builder ->
            val join = root.join<RecipeEntity, RecipeIngredientEntity>("recipeIngredients", JoinType.LEFT)
            builder.equal(join.get<IngredientEntity>("ingredient").get<Int>("id"), ingredientId)
        }
    }

    private fun hasNutritionalCategory(categoryId: Int): Specification<RecipeEntity> {
        return Specification { root, query, builder ->
            val join = root.join<RecipeEntity, RecipeNutritionalCategoryEntity>("recipeNutritionalCategories", JoinType.LEFT)
            builder.equal(join.get<NutritionalCategoryEntity>("nutritionalCategory").get<Int>("id"), categoryId)
        }
    }

    private fun hasAllergenRestriction(restrictionId: Int): Specification<RecipeEntity> {
        return Specification { root, query, builder ->
            val join = root.join<RecipeEntity, RecipeAllergenRestrictionEntity>("recipeAllergenRestrictions", JoinType.LEFT)
            builder.equal(join.get<AllergenRestrictionEntity>("allergenRestriction").get<Int>("id"), restrictionId)
        }
    }
}