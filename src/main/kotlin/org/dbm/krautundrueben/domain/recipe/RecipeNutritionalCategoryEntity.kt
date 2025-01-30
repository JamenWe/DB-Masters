package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.nutrition.NutritionalCategoryEntity

@Entity
@Table(name = "recipe_nutritional_category")
class RecipeNutritionalCategoryEntity (
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "recipe_id",
        nullable = false,
        foreignKey = ForeignKey(name = "recipe_nutritional_category_recipe_id_fkey")
    )
    val recipe: RecipeEntity,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "nutritional_category_id",
        nullable = false,
        foreignKey = ForeignKey(name = "recipe_nutritional_category_nutritional_category_id_fkey")
    )
    val nutritionalCategory: NutritionalCategoryEntity
)