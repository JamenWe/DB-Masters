package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.supplier.SupplierEntity

data class SupplierDto(
    val id: Int,
    val name: String,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?,
    val ingredientIds: List<Int>
) {
    companion object {
        fun from(supplier: SupplierEntity): SupplierDto {
            return SupplierDto(
                supplier.id,
                supplier.name,
                supplier.street,
                supplier.houseNumber,
                supplier.zipCode,
                supplier.city,
                supplier.phone,
                supplier.email,
                ingredientIds = supplier.ingredients.map { it.id }
            )
        }
    }
}