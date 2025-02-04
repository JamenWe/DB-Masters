package system;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collection;

public class CriteriaUtil {

    private CriteriaUtil() {}

    /**
     * Typed {@link CriteriaBuilder#equal(Expression, Object)} predicate that improves on the untyped API of JPA.
     *
     * Great candidate for Kotlin extension functions.
     */
    public static <T> Predicate typedEqual(CriteriaBuilder builder, Expression<T> x, T y) {
        return builder.equal(x, y);
    }

    /**
     * Typed {@link Expression#in(Collection)} predicate that improves on the untyped API of JPA.
     *
     * Great candidate for Kotlin extension functions.
     */
    public static <T> Predicate typedIn(Expression<T> x, Collection<T> y) {
        return x.in(y);
    }

    public static <T> Specification<T> distinct() {
        return (root, query, cb) -> {
            query.distinct(true);
            return null;
        };
    }
}