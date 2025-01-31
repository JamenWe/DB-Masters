package org.dbm.krautundrueben.domain.customer

import org.dbm.krautundrueben.system.PaginationParams
import org.springframework.data.domain.Sort
import java.time.LocalDate

data class CustomerQueryParams(
    val id: Int?,
    val lastName: String?,
    val firstName: String?,
    val dateOfBirth: LocalDate?,
    val street: String?,
    val houseNumber: String?,
    val zipCode: String?,
    val city: String?,
    val phone: String?,
    val email: String?,

    override val offset: Int,
    override val limit: Int,
    override val sortDirection: Sort.Direction,
    override val sortField: String?,
) : PaginationParams