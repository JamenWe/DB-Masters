package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity

@Entity
@Table(name = "recipe_ingredient")
@IdClass(RecipeIngredientId::class)
class RecipeIngredientEntity (

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "recipe_id",
        nullable = false,
        foreignKey = ForeignKey(name = "recipe_ingredient_recipe_id_fkey")
    )
    val recipe: RecipeEntity,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "ingredient_id",
        nullable = false,
        foreignKey = ForeignKey(name = "recipe_ingredient_ingredient_id_fkey")
    )
    val ingredient: IngredientEntity,

    @Column(name = "quantity", nullable = false)
    val quantity: Int

)