package org.dbm.krautundrueben.domain.ingredient

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.supplier.SupplierEntity
import java.math.BigDecimal

@Entity
@Table(name = "ingredient")
class IngredientEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ingredient_id", nullable = false, updatable = false)
    val id: Int = 0,

    @Column(name = "ingredient_name", nullable = false, length = 50)
    val name: String,

    @Column(name = "unit", length = 25)
    var unit: String?,

    @Column(name = "net_price", precision = 10, scale = 2)
    var netPrice: BigDecimal?,

    @Column(name = "stock")
    var stock: Int?,

    @Column(name = "calories")
    var calories: Int?,

    @Column(name = "carbohydrates", precision = 10, scale = 2)
    var carbohydrates: BigDecimal?,

    @Column(name = "protein", precision = 10, scale = 2)
    var protein: BigDecimal?,

    @ManyToOne
    @JoinColumn(name = "supplier_id", foreignKey = ForeignKey(name = "ingredient_supplier_id_fkey"))
    var supplier: SupplierEntity
)