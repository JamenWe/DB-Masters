package org.dbm.krautundrueben.domain.supplier

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.SupplierUpdateRequest
import org.dbm.krautundrueben.domain.ingredient.IngredientEntity
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.CriteriaUtil
import system.NotFoundException
import kotlin.jvm.optionals.getOrNull

@Service
class SupplierService(
    private val supplierRepository: SupplierRepository
) {

    fun findById(id: Int): SupplierEntity? {
        return supplierRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val supplier = supplierRepository.findById(id).orElse(null)
            ?: throw NotFoundException("Cannot delete, no supplier with ID $id exists.")
        supplierRepository.delete(supplier)
    }

    @Transactional
    fun createSupplier(
        name: String,
        street: String?,
        houseNumber: String?,
        zipCode: String?,
        city: String?,
        phone: String?,
        email: String?,
        ingredients: List<IngredientEntity>,
    ): SupplierEntity {
        val supplier = SupplierEntity(
            name = name,
            street = street,
            houseNumber = houseNumber,
            zipCode = zipCode,
            city = city,
            phone = phone,
            email = email,
            ingredients = ingredients
        ).let { supplierRepository.save(it) }

        return supplierRepository.save(supplier)
    }

    @Transactional
    fun updateSupplier(id: Int, request: SupplierUpdateRequest): SupplierEntity {
        val supplier = supplierRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no supplier with ID $id exists.") }

        request.street?.let { supplier.street = it }
        request.houseNumber?.let { supplier.houseNumber = it }
        request.zipCode?.let { supplier.zipCode = it }
        request.city?.let { supplier.city = it }
        request.phone?.let { supplier.phone = it }
        request.email?.let { supplier.email = it }

        return supplierRepository.save(supplier)
    }

    fun query(params: SupplierQueryParams): Page<SupplierEntity> {
        val pageRequest = params.toPageRequest(SupplierEntity_.ID)
        val specification = applyFiltering(params)
        return supplierRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: SupplierQueryParams): Specification<SupplierEntity> {
        val specifications = mutableListOf<Specification<SupplierEntity>>()

        if (params.id != null) {
            specifications.add(idEquals(params.id))
        }
        if (!params.name.isNullOrBlank()) {
            specifications.add(supplierNameLike(params.name))
        }
        if (!params.street.isNullOrBlank()) {
            specifications.add(streetLike(params.street))
        }
        if (!params.houseNumber.isNullOrBlank()) {
            specifications.add(houseNumberLike(params.houseNumber))
        }
        if (!params.zipCode.isNullOrBlank()) {
            specifications.add(zipCodeEquals(params.zipCode))
        }
        if (!params.city.isNullOrBlank()) {
            specifications.add(cityLike(params.city))
        }
        if (!params.phone.isNullOrBlank()) {
            specifications.add(phoneLike(params.phone))
        }
        if (!params.email.isNullOrBlank()) {
            specifications.add(emailLike(params.email))
        }

        return Specification.allOf(specifications).and(CriteriaUtil.distinct())
    }

    private fun idEquals(id: Int): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get<Int>("id"), id)
        }
    }

    private fun supplierNameLike(name: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierName = builder.lower(root.get<String>("supplierName"))
            builder.like(supplierName, "%${name.lowercase()}%")
        }
    }

    private fun streetLike(street: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val streetField = builder.lower(root.get<String>("street"))
            builder.like(streetField, "%${street.lowercase()}%")
        }
    }

    private fun houseNumberLike(houseNumber: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val houseNumberField = builder.lower(root.get<String>("houseNumber"))
            builder.like(houseNumberField, "%${houseNumber.lowercase()}%")
        }
    }

    private fun zipCodeEquals(zipCode: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            builder.equal(builder.lower(root.get<String>("zipCode")), zipCode.lowercase())
        }
    }

    private fun cityLike(city: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val cityField = builder.lower(root.get<String>("city"))
            builder.like(cityField, "%${city.lowercase()}%")
        }
    }

    private fun phoneLike(phone: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val phoneField = builder.lower(root.get<String>("phone"))
            builder.like(phoneField, "%${phone.lowercase()}%")
        }
    }

    private fun emailLike(email: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val emailField = builder.lower(root.get<String>("email"))
            builder.like(emailField, "%${email.lowercase()}%")
        }
    }
}