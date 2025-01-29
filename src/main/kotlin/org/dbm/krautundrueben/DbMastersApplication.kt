package org.dbm.krautundrueben

import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import javax.sql.DataSource

@SpringBootApplication
class DbMastersApplication : CommandLineRunner {

    override fun run(vararg args: String?) {

    }
}

fun main(args: Array<String>) {
    runApplication<DbMastersApplication>(*args)
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