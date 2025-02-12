package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.PageData
import org.dbm.krautundrueben.api.admin.dto.recipe.RecipeCreateRequest
import org.dbm.krautundrueben.api.admin.dto.recipe.RecipeDto
import org.dbm.krautundrueben.api.admin.dto.recipe.RecipeUpdateRequest
import org.dbm.krautundrueben.api.admin.dto.supplier.PaginatedRecipe
import org.dbm.krautundrueben.domain.recipe.RecipeQueryParams
import org.dbm.krautundrueben.domain.recipe.RecipeService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.NotFoundException
import java.math.BigDecimal as BigDecimal1

@RestController
@RequestMapping(
    path = ["/internal/recipes"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class RecipeController(
    private val recipeService: RecipeService
) {
    @GetMapping("/{id}")
    @Transactional
    fun getRecipe(@PathVariable id: Int): ResponseEntity<RecipeDto> {
        val recipe = recipeService.findById(id) ?: throw NotFoundException("Recipe with ID $id not found.")
        return ResponseEntity.ok(RecipeDto.from(recipe))
    }

    @GetMapping
    @Transactional
    fun listRecipes(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) netPrice: BigDecimal1?,
        @RequestParam(required = false) preparationTime: Int?,
        @RequestParam(required = false) instructions: String?,
        @RequestParam(required = false) ingredientId: Int?,
        @RequestParam(required = false) nutritionalCategoryName: String?,
        @RequestParam(required = false) allergenRestrictionName: String?,
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "50") limit: Int,
        @RequestParam(defaultValue = "DESC") sortDir: String,
        @RequestParam(required = false) sortField: String?
    ): PaginatedRecipe {
        val params = RecipeQueryParams(
            id,
            name,
            netPrice,
            preparationTime,
            instructions,
            ingredientId,
            nutritionalCategoryName,
            allergenRestrictionName,
            offset,
            limit,
            Sort.Direction.valueOf(sortDir.uppercase()),
            sortField
        )

        logger().info("Received GET recipes with params: {}", params)
        val recipes = recipeService.query(params).map { RecipeDto.from(it) }
        val pageData = PageData(params.offset, params.limit, recipes.totalElements)

        return PaginatedRecipe(recipes.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createRecipe(@RequestBody createRequest: RecipeCreateRequest): ResponseEntity<RecipeDto> {
        logger().info("Received POST create recipe request: {}", createRequest)

        val recipe = recipeService.createRecipe(
            createRequest.name,
            createRequest.netPrice,
            createRequest.preparationTime,
            createRequest.instructions,
            createRequest.ingredients,
            createRequest.nutritionalCategoryIds,
            createRequest.allergenRestrictionIds
        )

        val recipeDto = RecipeDto.from(recipe)
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeDto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateRecipe(
        @PathVariable id: Int,
        @RequestBody updateRequest: RecipeUpdateRequest
    ): RecipeDto {
        logger().info("Received PUT update recipe request for ID {}: {}", id, updateRequest)
        val updatedRecipe = recipeService.updateRecipe(id, updateRequest)
        return RecipeDto.from(updatedRecipe)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteRecipe(@PathVariable id: Int): ResponseEntity<Void> {
        recipeService.delete(id)
        return ResponseEntity.noContent().build()
    }
}