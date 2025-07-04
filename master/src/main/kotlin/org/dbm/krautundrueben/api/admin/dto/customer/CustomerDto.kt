package org.dbm.krautundrueben.api.admin.dto.customer

import org.dbm.krautundrueben.domain.customer.CustomerEntity
import java.time.LocalDate

data class CustomerDto(
    val id: Int,
    val lastName: String,
    val firstName: String,
    val dateOfBirth: LocalDate?,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?,
) {
    companion object {
        fun from(customer: CustomerEntity): CustomerDto {
            return CustomerDto(
                customer.id,
                customer.lastName,
                customer.firstName,
                customer.dateOfBirth,
                customer.street,
                customer.houseNumber,
                customer.zipCode,
                customer.city,
                customer.phone,
                customer.email,
            )
        }
    }
}