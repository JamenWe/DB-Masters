package org.dbm.krautundrueben.api.admin.dto;

data class PageData(
        val offset: Int,
        val limit: Int,
        val total: Long
)