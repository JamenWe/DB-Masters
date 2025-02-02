package org.dbm.krautundrueben.api.admin.dto

import java.time.LocalDate

data class CreateCustomerRequest(
    val lastName: String,
    val firstName: String,
    val dateOfBirth: LocalDate?,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?
)