package org.dbm.krautundrueben.domain.supplier

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.SupplierUpdateRequest
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import system.BadRequestException
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
        val supplier = supplierRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no supplier with ID $id exists.")

        if (supplier.ingredients.isNotEmpty()) {
            throw BadRequestException("Cannot delete supplier with ID $id as it has associated ingredients.")
        }

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
        email: String?
    ): SupplierEntity {
        if (name.isBlank()) {
            throw BadRequestException("Supplier name cannot be empty")
        }

        val supplier = SupplierEntity(
            name = name,
            street = street,
            houseNumber = houseNumber,
            zipCode = zipCode,
            city = city,
            phone = phone,
            email = email
        ).let { supplierRepository.save(it) }

        return supplier
    }


    @Transactional
    fun updateSupplier(id: Int, request: SupplierUpdateRequest): SupplierEntity {
        var supplier = supplierRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no supplier with ID $id exists.") }

        request.street?.let { supplier.street = it }
        request.houseNumber?.let { supplier.houseNumber = it }
        request.zipCode?.let { supplier.zipCode = it }
        request.city?.let { supplier.city = it }
        request.phone?.let { supplier.phone = it }
        request.email?.let { supplier.email = it }

        supplier = supplierRepository.save(supplier)
        return supplier
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
            val supplierName = builder.lower(root.get(SupplierEntity_.name))
            builder.like(supplierName, "%${name.lowercase()}%")
        }
    }

    private fun streetLike(street: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierStreet = builder.lower(root.get(SupplierEntity_.street))
            builder.like(supplierStreet, "%${street.lowercase()}%")
        }
    }

    private fun houseNumberLike(houseNumber: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierHouseNumber = builder.lower(root.get(SupplierEntity_.houseNumber))
            builder.like(supplierHouseNumber, "%${houseNumber.lowercase()}%")
        }
    }

    private fun zipCodeEquals(zipCode: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierZipCode = builder.lower(root.get(SupplierEntity_.zipCode))
            builder.like(supplierZipCode, "%${zipCode.lowercase()}%")
        }
    }

    private fun cityLike(city: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierCity = builder.lower(root.get(SupplierEntity_.city))
            builder.like(supplierCity, "%${city.lowercase()}%")
        }
    }

    private fun phoneLike(phone: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierPhone = builder.lower(root.get(SupplierEntity_.phone))
            builder.like(supplierPhone, "%${phone.lowercase()}%")
        }
    }

    private fun emailLike(email: String): Specification<SupplierEntity> {
        return Specification { root, _, builder ->
            val supplierEmail = builder.lower(root.get(SupplierEntity_.email))
            builder.like(supplierEmail, "%${email.lowercase()}%")
        }
    }
}