package org.dbm.krautundrueben.system;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.web.server.ResponseStatusException;

/**
 * Exception that maps to HTTP 400
 */
public class BadRequestException extends ResponseStatusException {

    public BadRequestException() {
        this(null, null);
    }

    public BadRequestException(String reason) {
        this(reason, null);
    }

    public BadRequestException(Throwable cause) {
        this(null, cause);
    }

    public BadRequestException(@Nullable String reason, @Nullable Throwable cause) {
        super(HttpStatus.BAD_REQUEST, reason, cause);
    }
}