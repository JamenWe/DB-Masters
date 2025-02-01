package org.dbm.krautundrueben.system;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;
import org.springframework.web.server.ResponseStatusException;

/**
 * Exception that maps to HTTP 404
 */
public class NotFoundException extends ResponseStatusException {

    public NotFoundException() {
        this(null, null);
    }

    public NotFoundException(String reason) {
        this(reason, null);
    }

    public NotFoundException(Throwable cause) {
        this(null, cause);
    }

    public NotFoundException(@Nullable String reason, @Nullable Throwable cause) {
        super(HttpStatus.NOT_FOUND, reason, cause);
    }
}