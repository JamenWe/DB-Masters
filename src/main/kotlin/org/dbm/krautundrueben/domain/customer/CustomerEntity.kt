package org.dbm.krautundrueben.domain.customer

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "customer")
class CustomerEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id", nullable = false, updatable = false)
    val id: Int,

    @Column(name = "last_name", nullable = false, length = 50)
    val lastName: String,

    @Column(name = "first_name", nullable = false, length = 50)
    val firstName: String,

    @Column(name = "date_of_birth")
    val dateOfBirth: LocalDate?,

    @Column(name = "street", length = 50)
    val street: String?,

    @Column(name = "house_number", length = 6)
    val houseNumber: String?,

    @Column(name = "zip_code", length = 5)
    val zipCode: String?,

    @Column(name = "city", length = 50)
    val city: String?,

    @Column(name = "phone", length = 25)
    val phone: String?,

    @Column(name = "email", length = 50)
    val email: String?

)