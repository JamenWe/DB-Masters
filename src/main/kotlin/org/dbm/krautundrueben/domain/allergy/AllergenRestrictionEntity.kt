package org.dbm.krautundrueben.domain.allergy

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.recipe.RecipeAllergenRestrictionEntity

@Entity
@Table(name = "allergen_restriction")
class AllergenRestrictionEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allergen_restriction_id", nullable = false, updatable = false)
    val id: Int = 0,

    @Column(name = "name", nullable = false, length = 50)
    var name: String,

    @OneToMany(mappedBy = "allergenRestriction", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val recipeAllergenRestrictions: List<RecipeAllergenRestrictionEntity>

)