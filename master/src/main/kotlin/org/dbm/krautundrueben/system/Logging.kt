package org.dbm.krautundrueben.system

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.reflect.full.companionObject


inline fun <reified T : Any> T.logger(): Logger {
	return getLogger(getClassForLogging(T::class.java))
}

/**
 * See https://www.baeldung.com/kotlin/logging#5-combining-with-logger-properties
 */
inline fun <reified T : Any> getClassForLogging(javaClass: Class<T>): Class<*> {
	return javaClass.enclosingClass
		?.takeIf { it.kotlin.companionObject?.java == javaClass }
		?: javaClass
}

fun getLogger(forClass: Class<*>): Logger {
	return LoggerFactory.getLogger(forClass)
}