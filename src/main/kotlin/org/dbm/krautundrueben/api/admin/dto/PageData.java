package org.dbm.krautundrueben.api.admin.dto;

public record PageData(
    int offset,
    int limit,
    long total
) {}