package org.dbm.krautundrueben.domain.customer

import jakarta.transaction.Transactional
import org.dbm.krautundrueben.api.admin.dto.CustomerUpdateRequest
import org.dbm.krautundrueben.system.CriteriaUtil
import org.dbm.krautundrueben.system.NotFoundException
import org.springframework.data.domain.Page
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.jvm.optionals.getOrNull

@Service
class CustomerService(
    private val customerRepository: CustomerRepository
) {

    fun findById(id: Int): CustomerEntity? {
        return customerRepository.findById(id).getOrNull()
    }

    @Transactional
    fun delete(id: Int) {
        val customer = customerRepository.findById(id).getOrNull()
            ?: throw NotFoundException("Cannot delete, no customer with ID $id exists.")
        customerRepository.delete(customer)
    }

    @Transactional
    fun createCustomer(
        lastName: String,
        firstName: String,
        dateOfBirth: LocalDate,
        street: String,
        houseNumber: String,
        zipCode: String,
        city: String,
        phone: String,
        email: String,
    ): CustomerEntity {
        val customer = CustomerEntity(
            lastName = lastName,
            firstName = firstName,
            dateOfBirth = dateOfBirth,
            street = street,
            houseNumber = houseNumber,
            zipCode = zipCode,
            city = city,
            phone = phone,
            email = email
        ).let { customerRepository.save(it) }

        return customer
    }

    @Transactional
    fun updateCustomer(id: Int, request: CustomerUpdateRequest): CustomerEntity {
        var customer = customerRepository.findById(id)
            .orElseThrow { NotFoundException("Cannot update, no customer with ID $id exists.") }

        customer.dateOfBirth = request.dateOfBirth
        customer.street = request.street
        customer.houseNumber = request.houseNumber
        customer.zipCode = request.zipCode
        customer.city = request.city
        customer.phone = request.phone
        customer.email = request.email

        customer = customerRepository.save(customer)
        return customer
    }

    fun query(params: CustomerQueryParams): Page<CustomerEntity> {
        val pageRequest = params.toPageRequest(CustomerEntity_.ID)
        val specification = applyFiltering(params)
        return customerRepository.findAll(specification, pageRequest)
    }

    private fun applyFiltering(params: CustomerQueryParams): Specification<CustomerEntity> {
        val specifications = mutableListOf<Specification<CustomerEntity>>()

        if (params.id != null) {
            specifications.add(idEquals(params.id))
        }
        if (!params.lastName.isNullOrBlank()) {
            specifications.add(lastNameLike(params.lastName))
        }
        if (!params.firstName.isNullOrBlank()) {
            specifications.add(firstNameLike(params.firstName))
        }
        if (params.dateOfBirth != null) {
            specifications.add(dateOfBirthEquals(params.dateOfBirth))
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

    private fun idEquals(id: Int): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            builder.equal(root.get<Int>("id"), id)
        }
    }

    private fun lastNameLike(lastName: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerLastName = builder.lower(root.get(CustomerEntity_.LAST_NAME))
            builder.like(customerLastName, "%${lastName.lowercase()}%")
        }
    }

    private fun firstNameLike(firstname: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerFirstName = builder.lower(root.get(CustomerEntity_.FIRST_NAME))
            builder.like(customerFirstName, "%${firstname.lowercase()}%")
        }
    }

    private fun dateOfBirthEquals(dateOfBirth: LocalDate): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val dob = root.get<LocalDate>(CustomerEntity_.DATE_OF_BIRTH)
            builder.equal(dob, dateOfBirth)
        }
    }

    private fun streetLike(street: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerStreet = builder.lower(root.get(CustomerEntity_.STREET))
            builder.like(customerStreet, "%${street.lowercase()}%")
        }
    }

    private fun houseNumberLike(houseNumber: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerHouseNumber = builder.lower(root.get(CustomerEntity_.HOUSE_NUMBER))
            builder.like(customerHouseNumber, "%${houseNumber.lowercase()}%")
        }
    }

    private fun zipCodeEquals(zipCode: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerZipCode = builder.lower(root.get(CustomerEntity_.ZIP_CODE))
            builder.like(customerZipCode, zipCode)
        }
    }

    private fun cityLike(city: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerCity = builder.lower(root.get(CustomerEntity_.CITY))
            builder.like(customerCity, "%${city.lowercase()}%")
        }
    }

    private fun phoneLike(phone: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerPhone = builder.lower(root.get(CustomerEntity_.PHONE))
            builder.like(customerPhone, "%${phone.lowercase()}%")
        }
    }

    private fun emailLike(email: String): Specification<CustomerEntity> {
        return Specification { root, _, builder ->
            val customerEmail = builder.lower(root.get(CustomerEntity_.EMAIL))
            builder.like(customerEmail, "%${email.lowercase()}%")
        }
    }
}