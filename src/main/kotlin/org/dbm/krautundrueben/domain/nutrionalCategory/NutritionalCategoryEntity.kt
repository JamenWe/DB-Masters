package org.dbm.krautundrueben.domain.nutrionalCategory

import jakarta.persistence.*

@Entity
@Table(name = "nutritional_category")
class NutritionalCategoryEntity (

    @Id
    @Column(name = "nutritional_category_id", nullable = false, updatable = false)
    val id: Int,

    @Column(name = "name", length = 50, nullable = false)
    val name: String,

)