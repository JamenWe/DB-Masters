package org.dbm.krautundrueben.domain.recipe

import jakarta.persistence.*
import org.dbm.krautundrueben.domain.allergy.AllergenRestrictionEntity

@Entity
@Table(name = "recipe_allergen_restriction")
@IdClass(RecipeAllergenRestrictionId::class)
class RecipeAllergenRestrictionEntity (

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false, foreignKey = ForeignKey(name = "recipe_allergen_restriction_recipe_id_fkey"))
    val recipe: RecipeEntity,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "allergen_restriction_id",
        nullable = false,
        foreignKey = ForeignKey(name = "recipe_allergen_restriction_allergen_restriction_id_fkey")
    )
    val allergenRestriction: AllergenRestrictionEntity

)