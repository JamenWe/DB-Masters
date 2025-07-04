package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.PageData
import org.dbm.krautundrueben.api.admin.dto.nutrition.NutritionalCategoryCreateRequest
import org.dbm.krautundrueben.api.admin.dto.nutrition.NutritionalCategoryDto
import org.dbm.krautundrueben.api.admin.dto.nutrition.NutritionalCategoryUpdateRequest
import org.dbm.krautundrueben.api.admin.dto.nutrition.PaginatedNutritionalCategory
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryQueryParams
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.NotFoundException

@RestController
@RequestMapping(
    path = ["/internal/nutrition"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class NutritionalCategoryController(
    private val nutritionalCategoryService: NutritionalCategoryService
) {

    @GetMapping("/{id}")
    @Transactional
    fun getNutritionalCategory(@PathVariable id: Int): ResponseEntity<NutritionalCategoryDto> {
        val nutritionalCategory = nutritionalCategoryService.findById(id)
            ?: throw NotFoundException("Nutritional Category with ID $id not found.")
        return ResponseEntity.ok(NutritionalCategoryDto.from(nutritionalCategory))
    }

    @GetMapping
    @Transactional
    fun listNutritionalCategories(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) recipeId: Int?,
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "50") limit: Int,
        @RequestParam(defaultValue = "DESC") sortDir: String,
        @RequestParam(required = false) sortField: String?
    ): PaginatedNutritionalCategory {
        val params = NutritionalCategoryQueryParams(
            id,
            name,
            recipeId,
            offset,
            limit,
            Sort.Direction.valueOf(sortDir.uppercase()),
            sortField
        )

        logger().info("Received GET nutritional categories with params: {}", params)
        val nutritionalCategoriesPage = nutritionalCategoryService.query(params)
        val nutritionalCategoriesDto = nutritionalCategoriesPage.map { NutritionalCategoryDto.from(it) }
        val pageData = PageData(params.offset, params.limit, nutritionalCategoriesPage.totalElements)

        return PaginatedNutritionalCategory(nutritionalCategoriesDto.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createNutritionalCategory(
        @RequestBody createRequest: NutritionalCategoryCreateRequest
    ): ResponseEntity<NutritionalCategoryDto> {
        logger().info("Received POST create nutritional category request: {}", createRequest)

        val createdNutritionalCategory = nutritionalCategoryService.createNutritionalCategory(
            createRequest.name
        )

        val dto = NutritionalCategoryDto.from(createdNutritionalCategory)
        return ResponseEntity.status(HttpStatus.CREATED).body(dto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateNutritionalCategory(
        @PathVariable id: Int,
        @RequestBody updateRequest: NutritionalCategoryUpdateRequest
    ): NutritionalCategoryDto {
        logger().info("Received PUT update nutritional category request for ID {}: {}", id, updateRequest)
        val updatedNutritionalCategory = nutritionalCategoryService.updateNutritionalCategory(id, updateRequest)
        return NutritionalCategoryDto.from(updatedNutritionalCategory)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteNutritionalCategory(@PathVariable id: Int): ResponseEntity<Void> {
        nutritionalCategoryService.delete(id)
        return ResponseEntity.noContent().build()
    }
}