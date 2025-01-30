package org.dbm.krautundrueben

import org.dbm.krautundrueben.domain.customer.CustomerRepository
import org.dbm.krautundrueben.domain.ingredient.IngredientRepository
import org.dbm.krautundrueben.domain.supplier.SupplierRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import javax.sql.DataSource

@SpringBootApplication
class DbMastersApplication

fun main(args: Array<String>) {
    runApplication<DbMastersApplication>(*args)
}

@Component
class DataPrinterRunner(
    private val customerRepository: CustomerRepository,
    private val supplierRepository: SupplierRepository,
    private val ingredientRepository: IngredientRepository
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        println("Fetching all customers from the database:")
        val customers = customerRepository.findAll()
        customers.forEach { customer ->
            println("${customer.id}: ${customer.firstName} ${customer.lastName}")
        }

        println("Fetching all suppliers from the database:")
        val suppliers = supplierRepository.findAll()
        suppliers.forEach { supplier ->
            println("${supplier.id}: ${supplier.name}")
        }

        println("Fetching all ingredients from the database:")
        val ingredients = ingredientRepository.findAll()
        ingredients.forEach { ingredient ->
            println("${ingredient.id}: ${ingredient.name}")
        }
    }
}

@Component
class DataSourceConnectivityTester {

    @Bean
    fun testDataSource(dataSource: DataSource) = CommandLineRunner {
        try {
            dataSource.connection.use { connection ->
                if (connection.isValid(2)) { // 2 seconds timeout
                    println("Successfully established a connection to the database.")
                    println(dataSource.connection.catalog)
                } else {
                    println("Failed to validate the database connection.")
                }
            }
        } catch (ex: Exception) {
            println("Could not connect to the database. Error: ${ex.message}")
        }
    }
}