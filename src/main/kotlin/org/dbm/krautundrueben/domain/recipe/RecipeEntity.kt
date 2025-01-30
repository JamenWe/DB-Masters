package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.order.OrderRecipeEntity
import java.math.BigDecimal

@Entity
@Table(name = "recipe")
class RecipeEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recipe_id", nullable = false, updatable = false)
    val id: Int,

    @Column(name = "recipe_name", nullable = false, length = 50)
    val name: String,

    @Column(name = "net_price", nullable = false, precision = 10, scale = 2)
    val netPrice: BigDecimal,

    @Column(name = "preparation_time")
    val preparationTime: Int?,

    @Column(name = "instructions", columnDefinition = "TEXT")
    val instructions: String?,

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val recipeIngredients: List<RecipeIngredientEntity>,

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val recipeNutritionalCategories: List<RecipeNutritionalCategoryEntity>,

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val recipeAllergenRestrictions: List<RecipeAllergenRestrictionEntity>,

    @OneToMany(mappedBy = "recipe", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val orderRecipes: List<OrderRecipeEntity>

)