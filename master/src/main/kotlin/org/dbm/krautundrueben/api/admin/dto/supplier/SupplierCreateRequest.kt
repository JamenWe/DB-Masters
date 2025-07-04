package org.dbm.krautundrueben.api.admin.dto.supplier

data class SupplierCreateRequest(
    val name: String,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?
)