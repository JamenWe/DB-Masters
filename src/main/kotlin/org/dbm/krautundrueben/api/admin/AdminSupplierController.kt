package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.*
import org.dbm.krautundrueben.api.admin.dto.supplier.PaginatedSupplier
import org.dbm.krautundrueben.api.admin.dto.supplier.SupplierCreateRequest
import org.dbm.krautundrueben.api.admin.dto.supplier.SupplierDto
import org.dbm.krautundrueben.api.admin.dto.supplier.SupplierUpdateRequest
import org.dbm.krautundrueben.domain.supplier.SupplierQueryParams
import org.dbm.krautundrueben.domain.supplier.SupplierService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.NotFoundException

@RestController
@RequestMapping(
    path = ["/internal/suppliers"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class SupplierController(
    private val supplierService: SupplierService
) {
    @GetMapping("/{id}")
    @Transactional
    fun getSupplier(@PathVariable id: Int): ResponseEntity<SupplierDto> {
        val supplier = supplierService.findById(id) ?: throw NotFoundException("Supplier with ID $id not found.")
        return ResponseEntity.ok(SupplierDto.from(supplier))
    }

    @GetMapping
    @Transactional
    fun listSuppliers(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) name: String?,
        @RequestParam(required = false) street: String?,
        @RequestParam(required = false) houseNumber: String?,
        @RequestParam(required = false) zipCode: String?,
        @RequestParam(required = false) city: String?,
        @RequestParam(required = false) phone: String?,
        @RequestParam(required = false) email: String?,
        @RequestParam(defaultValue = "0") offset: Int,
        @RequestParam(defaultValue = "50") limit: Int,
        @RequestParam(defaultValue = "DESC") sortDir: Sort.Direction,
        @RequestParam(required = false) sortField: String?
    ): PaginatedSupplier {
        val params = SupplierQueryParams(
            id,
            name,
            street,
            houseNumber,
            zipCode,
            city,
            phone,
            email,
            offset,
            limit,
            sortDir,
            sortField
        )

        logger().info("Received GET suppliers with params: {}", params)
        val suppliers = supplierService.query(params).map { SupplierDto.from(it) }
        val pageData = PageData(params.offset, params.limit, suppliers.totalElements)

        return PaginatedSupplier(suppliers.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createSupplier(@RequestBody createRequest: SupplierCreateRequest): ResponseEntity<SupplierDto> {
        logger().info("Received POST create supplier request: {}", createRequest)

        val supplier = supplierService.createSupplier(
            createRequest.name,
            createRequest.street,
            createRequest.houseNumber,
            createRequest.zipCode,
            createRequest.city,
            createRequest.phone,
            createRequest.email
        )

        val supplierDto = SupplierDto.from(supplier)
        return ResponseEntity.status(HttpStatus.CREATED).body(supplierDto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateSupplier(
        @PathVariable id: Int,
        @RequestBody updateRequest: SupplierUpdateRequest
    ): SupplierDto {
        logger().info("Received PUT update supplier request for ID {}: {}", id, updateRequest)
        val updatedSupplier = supplierService.updateSupplier(id, updateRequest)
        return SupplierDto.from(updatedSupplier)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteSupplier(@PathVariable id: Int): ResponseEntity<Void> {
        supplierService.delete(id)
        return ResponseEntity.noContent().build()
    }
}