package org.dbm.krautundrueben.domain.supplier

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity

@Entity
@Table(name = "supplier")
class SupplierEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id", nullable = false, updatable = false)
    val id: Int = 0,

    @Column(name = "supplier_name", nullable = false, length = 50)
    val name: String,

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
    var email: String?,

    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    val ingredients: List<IngredientEntity> = emptyList()

)