package org.dbm.krautundrueben.api.admin.dto

import java.time.LocalDate

data class CustomerUpdateRequest(
    val dateOfBirth: LocalDate?,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?
)