package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.PageData
import org.dbm.krautundrueben.api.admin.dto.ingredient.IngredientCreateRequest
import org.dbm.krautundrueben.api.admin.dto.ingredient.IngredientDto
import org.dbm.krautundrueben.api.admin.dto.ingredient.IngredientUpdateRequest
import org.dbm.krautundrueben.api.admin.dto.ingredient.PaginatedIngredient
import org.dbm.krautundrueben.domain.ingredient.IngredientQueryParams
import org.dbm.krautundrueben.domain.ingredient.IngredientService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.NotFoundException
import java.math.BigDecimal

@RestController
@RequestMapping(
    path = ["/internal/ingredients"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class IngredientController(
    private val ingredientService: IngredientService
) {
    @GetMapping("/{id}")
    @Transactional
    fun getIngredient(@PathVariable id: Int): ResponseEntity<IngredientDto> {
        val ingredient = ingredientService.findById(id) ?: throw NotFoundException("Ingredient with ID $id not found.")
        return ResponseEntity.ok(IngredientDto.from(ingredient))
    }

    @GetMapping
    @Transactional
    fun listIngredients(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) unit: String?,
        @RequestParam(required = false) netPrice: BigDecimal?,
        @RequestParam(required = false) stock: Int?,
        @RequestParam(required = false) calories: Int?,
        @RequestParam(required = false) carbohydrates: BigDecimal?,
        @RequestParam(required = false) protein: BigDecimal?,
        @RequestParam(required = false) supplierName: String?,
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "50") limit: Int,
        @RequestParam(defaultValue = "DESC") sortDir: String,
        @RequestParam(required = false) sortField: String?
    ): PaginatedIngredient {
        val params = IngredientQueryParams(
            id,
            name,
            unit,
            netPrice,
            stock,
            calories,
            carbohydrates,
            protein,
            supplierName,
            offset,
            limit,
            Sort.Direction.valueOf(sortDir.uppercase()),
            sortField
        )

        logger().info("Received GET ingredients with params: {}", params)
        val ingredients = ingredientService.query(params).map { IngredientDto.from(it) }
        val pageData = PageData(params.offset, params.limit, ingredients.totalElements)

        return PaginatedIngredient(ingredients.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createIngredient(@RequestBody createRequest: IngredientCreateRequest): ResponseEntity<IngredientDto> {
        logger().info("Received POST create ingredient request: {}", createRequest)

        val ingredient = ingredientService.createIngredient(
            createRequest.name,
            createRequest.unit,
            createRequest.netPrice,
            createRequest.stock,
            createRequest.calories,
            createRequest.carbohydrates,
            createRequest.protein,
            createRequest.supplierId
        )

        val ingredientDto = IngredientDto.from(ingredient)
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredientDto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateIngredient(
        @PathVariable id: Int,
        @RequestBody updateRequest: IngredientUpdateRequest
    ): IngredientDto {
        logger().info("Received PUT update ingredient request for ID {}: {}", id, updateRequest)
        val updatedIngredient = ingredientService.updateIngredient(id, updateRequest)
        return IngredientDto.from(updatedIngredient)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteIngredient(@PathVariable id: Int): ResponseEntity<Void> {
        ingredientService.delete(id)
        return ResponseEntity.noContent().build()
    }
}