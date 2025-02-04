package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "recipe")
class RecipeEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id", nullable = false, updatable = false)
    val id: Int = 0,

    @Column(name = "recipe_name", nullable = false, length = 50)
    var name: String,

    @Column(name = "net_price", nullable = false, precision = 10, scale = 2)
    var netPrice: BigDecimal,

    @Column(name = "preparation_time")
    var preparationTime: Int?,

    @Column(name = "instructions", columnDefinition = "TEXT")
    var instructions: String?,

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var recipeIngredients: MutableList<RecipeIngredientEntity> = mutableListOf(),

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var recipeNutritionalCategories: MutableList<RecipeNutritionalCategoryEntity> = mutableListOf(),

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var recipeAllergenRestrictions: MutableList<RecipeAllergenRestrictionEntity> = mutableListOf(),

)