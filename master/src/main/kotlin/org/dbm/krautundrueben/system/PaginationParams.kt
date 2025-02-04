package org.dbm.krautundrueben.system

import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort

/**
 * Shared interface for pagination parameters
 */
interface PaginationParams {

	val offset: Int
	val limit: Int
	val sortDirection: Sort.Direction
	val sortField: String?

	fun toPageRequest(defaultSortField: String): PageRequest {
		val pageSize = limit
		val pageNumber = offset / pageSize
		return PageRequest.of(pageNumber, pageSize)
			.withSort(sortDirection, sortField ?: defaultSortField)
	}
}