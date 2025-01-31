package org.dbm.krautundrueben.api.admin.dto

import org.dbm.krautundrueben.domain.ingredient.IngredientEntity

data class SupplierDto(
    val id: Int,
    val name: String,
    val street: String,
    val houseNumber: String,
    val zipCode: String,
    val city: String,
    val phone: String,
    val email: String,
    val ingredients: IngredientEntity,
) {
    companion object {
        fun from(supplier: SupplierDto): SupplierDto {
            return SupplierDto(
                supplier.id,
                supplier.name,
                supplier.street,
                supplier.houseNumber,
                supplier.zipCode,
                supplier.city,
                supplier.phone,
                supplier.email,
                supplier.ingredients,
            )
        }
    }
}