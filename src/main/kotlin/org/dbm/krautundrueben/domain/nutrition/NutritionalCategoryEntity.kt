package org.dbm.krautundrueben.domain.nutrition

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.recipe.RecipeNutritionalCategoryEntity

@Entity
@Table(name = "nutritional_category")
class NutritionalCategoryEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nutritional_category_id", nullable = false, updatable = false)
    val id: Int,

    @Column(name = "name", nullable = false, length = 50)
    val name: String,

    @OneToMany(mappedBy = "nutritionalCategory", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val recipeNutritionalCategories: List<RecipeNutritionalCategoryEntity>

)