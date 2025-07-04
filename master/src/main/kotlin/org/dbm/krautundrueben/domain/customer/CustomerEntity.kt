package org.dbm.krautundrueben.domain.customer

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "customer")
class CustomerEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id", nullable = false, updatable = false)
    val id: Int = 0,

    @Column(name = "last_name", nullable = false, length = 50)
    val lastName: String,

    @Column(name = "first_name", nullable = false, length = 50)
    val firstName: String,

    @Column(name = "date_of_birth")
    var dateOfBirth: LocalDate?,

    @Column(name = "street", length = 50)
    var street: String?,

    @Column(name = "house_number", length = 6)
    var houseNumber: String?,

    @Column(name = "zip_code", length = 5)
    var zipCode: String?,

    @Column(name = "city", length = 50)
    var city: String?,

    @Column(name = "phone", length = 25)
    var phone: String?,

    @Column(name = "email", length = 50)
    var email: String?

)