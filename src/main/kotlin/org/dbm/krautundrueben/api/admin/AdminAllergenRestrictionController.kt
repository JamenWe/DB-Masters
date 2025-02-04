package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.*
import org.dbm.krautundrueben.api.admin.dto.allergy.AllergenRestrictionCreateRequest
import org.dbm.krautundrueben.api.admin.dto.allergy.AllergenRestrictionDto
import org.dbm.krautundrueben.api.admin.dto.allergy.AllergenRestrictionUpdateRequest
import org.dbm.krautundrueben.api.admin.dto.allergy.PaginatedAllergenRestriction
import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionQueryParams
import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.NotFoundException

@RestController
@RequestMapping(
    path = ["/internal/allergen-restrictions"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class AllergenRestrictionController(
    private val allergenRestrictionService: AllergenRestrictionService
) {

    @GetMapping("/{id}")
    @Transactional
    fun getAllergenRestriction(@PathVariable id: Int): ResponseEntity<AllergenRestrictionDto> {
        val allergenRestriction = allergenRestrictionService.findById(id)
            ?: throw NotFoundException("Allergen Restriction with ID $id not found.")
        return ResponseEntity.ok(AllergenRestrictionDto.from(allergenRestriction))
    }

    @GetMapping
    @Transactional
    fun listAllergenRestrictions(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) recipeId: Int?,
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "50") limit: Int,
        @RequestParam(defaultValue = "DESC") sortDir: Sort.Direction,
        @RequestParam(required = false) sortField: String?
    ): PaginatedAllergenRestriction {
        val params = AllergenRestrictionQueryParams(
            id,
            name,
            recipeId,
            offset,
            limit,
            sortDir,
            sortField
        )

        logger().info("Received GET allergen restrictions with params: {}", params)
        val allergenRestrictionsPage = allergenRestrictionService.query(params)
        val allergenRestrictionsDto = allergenRestrictionsPage.map { AllergenRestrictionDto.from(it) }
        val pageData = PageData(params.offset, params.limit, allergenRestrictionsPage.totalElements)

        return PaginatedAllergenRestriction(allergenRestrictionsDto.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createAllergenRestriction(
        @RequestBody createRequest: AllergenRestrictionCreateRequest
    ): ResponseEntity<AllergenRestrictionDto> {
        logger().info("Received POST create allergen restriction request: {}", createRequest)

        val createdAllergenRestriction = allergenRestrictionService.createAllergenRestriction(
            name = createRequest.name
        )

        val dto = AllergenRestrictionDto.from(createdAllergenRestriction)
        return ResponseEntity.status(HttpStatus.CREATED).body(dto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateAllergenRestriction(
        @PathVariable id: Int,
        @RequestBody updateRequest: AllergenRestrictionUpdateRequest
    ): AllergenRestrictionDto {
        logger().info("Received PUT update allergen restriction request for ID {}: {}", id, updateRequest)
        val updatedAllergenRestriction = allergenRestrictionService.updateAllergenRestriction(id, updateRequest)
        return AllergenRestrictionDto.from(updatedAllergenRestriction)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteAllergenRestriction(@PathVariable id: Int): ResponseEntity<Void> {
        allergenRestrictionService.delete(id)
        return ResponseEntity.noContent().build()
    }
}