package org.dbm.krautundrueben.api.admin.dto

data class SupplierUpdateRequest(
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?,
    val ingredientIds: List<Int>?
)