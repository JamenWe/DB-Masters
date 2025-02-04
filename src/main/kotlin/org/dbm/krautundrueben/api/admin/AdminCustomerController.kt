package org.dbm.krautundrueben.api.admin

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.*
import org.dbm.krautundrueben.domain.customer.CustomerQueryParams
import org.dbm.krautundrueben.domain.customer.CustomerService
import org.dbm.krautundrueben.system.logger
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import system.NotFoundException
import java.time.LocalDate

@RestController
@RequestMapping(
    path = ["/internal/customers"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class CustomerController(
    private val customerService: CustomerService
) {
    @GetMapping("/{id}")
    @Transactional
    fun getCustomer(@PathVariable id: Int): ResponseEntity<CustomerDto> {
        val customer = customerService.findById(id) ?: throw NotFoundException("Customer with ID $id not found.")
        return ResponseEntity.ok(CustomerDto.from(customer))
    }

    @GetMapping
    @Transactional
    fun listCustomers(
        @RequestParam(required = false) id: Int?,
        @RequestParam(required = false) lastName: String?,
        @RequestParam(required = false) firstName: String?,
        @RequestParam(required = false) dateOfBirth: LocalDate?,
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
    ): PaginatedCustomers {
        val params = CustomerQueryParams(
            id,
            lastName,
            firstName,
            dateOfBirth,
            street,
            houseNumber,
            zipCode,
            city,
            phone,
            email,
            offset,
            limit,
            sortDir,
            sortField,
        )

        logger().info("Received GET customers with params: {}", params)
        val customers = customerService.query(params).map { CustomerDto.from(it) }
        val pageData = PageData(params.offset, params.limit, customers.totalElements)

        return PaginatedCustomers(customers.toList(), pageData)
    }

    @PostMapping
    @Transactional
    fun createCustomer(@RequestBody createCustomerRequest: CustomerCreateRequest): ResponseEntity<CustomerDto> {
        logger().info("Received POST create customer request: {}", createCustomerRequest)

        val customer = customerService.createCustomer(
            createCustomerRequest.lastName,
            createCustomerRequest.firstName,
            createCustomerRequest.dateOfBirth,
            createCustomerRequest.street,
            createCustomerRequest.houseNumber,
            createCustomerRequest.zipCode,
            createCustomerRequest.city,
            createCustomerRequest.phone,
            createCustomerRequest.email
        )

        val customerDto = CustomerDto.from(customer)
        return ResponseEntity.status(HttpStatus.CREATED).body(customerDto)
    }

    @PutMapping("/{id}")
    @Transactional
    fun updateCustomer(
        @PathVariable id: Int,
        @RequestBody updateCustomerRequest: CustomerUpdateRequest
    ): CustomerDto {
        logger().info("Received PUT update customer request for ID {}: {}", id, updateCustomerRequest)
        val updatedCustomer = customerService.updateCustomer(id, updateCustomerRequest)
        return CustomerDto.from(updatedCustomer)
    }

    @DeleteMapping("/{id}")
    @Transactional
    fun deleteCustomer(@PathVariable id: Int): ResponseEntity<Void> {
        customerService.delete(id)
        return ResponseEntity.noContent().build()
    }
}