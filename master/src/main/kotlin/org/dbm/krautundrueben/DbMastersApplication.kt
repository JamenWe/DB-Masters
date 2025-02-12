package org.dbm.krautundrueben

import org.dbm.krautundrueben.system.logger
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
class DataSourceConnectivityTester {

    @Bean
    fun testDataSource(dataSource: DataSource) = CommandLineRunner {
        try {
            dataSource.connection.use { connection ->
                if (connection.isValid(2)) {
                    logger().info("Successfully established a connection to the database ${dataSource.connection.catalog}.")
                } else {
                    logger().warn("Failed to validate the database connection.")
                }
            }
        } catch (ex: Exception) {
            logger().warn("Could not connect to the database. Error: ${ex.message}")
        }
    }
}