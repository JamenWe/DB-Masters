package org.dbm.krautundrueben.domain.order

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity

@Entity
@Table(name = "order_ingredient")
@IdClass(OrderIngredientId::class)
class OrderIngredientEntity (

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, foreignKey = ForeignKey(name = "order_ingredient_order_id_fkey"))
    val order: OrderEntity,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false, foreignKey = ForeignKey(name = "order_ingredient_ingredient_id_fkey"))
    val ingredient: IngredientEntity,

    @Column(name = "quantity", nullable = false)
    val quantity: Int

)