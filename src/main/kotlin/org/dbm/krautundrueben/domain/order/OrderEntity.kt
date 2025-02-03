package org.dbm.krautundrueben.domain.order

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.customer.CustomerEntity
import java.math.BigDecimal
import java.time.LocalDate

@Entity
@Table(name = "order")
class OrderEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id", nullable = false, updatable = false)
    val id: Int = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, foreignKey = ForeignKey(name = "order_customer_id_fkey"))
    val customer: CustomerEntity,

    @Column(name = "order_date", nullable = false)
    var orderDate: LocalDate,

    @Column(name = "invoice_amount", precision = 10, scale = 2)
    var invoiceAmount: BigDecimal?,

    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val orderIngredients: List<OrderIngredientEntity>,

    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val orderRecipes: List<OrderRecipeEntity>

)