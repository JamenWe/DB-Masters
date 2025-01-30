package org.dbm.krautundrueben.domain.order

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.recipe.RecipeEntity

@Entity
@Table(name = "order_recipe")
class OrderRecipeEntity (

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false, foreignKey = ForeignKey(name = "order_recipe_recipe_id_fkey"))
    val recipe: RecipeEntity,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, foreignKey = ForeignKey(name = "order_recipe_order_id_fkey"))
    val order: OrderEntity,

    @Column(name = "quantity")
    val quantity: Int

)