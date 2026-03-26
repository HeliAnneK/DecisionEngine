package ee.inbank.decisionengine.service;

import ee.inbank.decisionengine.dto.LoanRequest;
import ee.inbank.decisionengine.dto.LoanResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class LoanDecisionService {
    private static final int MIN_AMOUNT = 2000;
    private static final int MAX_AMOUNT = 10000;
    private static final int MAX_PERIOD = 60;

    private static final Set<String> DEBT_CODES = Set.of("49002010965");

    private static final Map<String, Integer> CREDIT_MODIFIERS = Map.of(
            "49002010976", 100,
            "49002010987", 300,
            "49002010998", 1000
    );

    public LoanResponse decide(LoanRequest request) {

        if (DEBT_CODES.contains(request.personalCode())) {
            return new LoanResponse(false, null, null);
        }

        Integer modifier = CREDIT_MODIFIERS.get(request.personalCode());
        if (modifier == null) {
            return new LoanResponse(false, null, null);
        }

        return findBestOffer(modifier, request.loanPeriod());
    }

    private LoanResponse findBestOffer(int modifier, int requestedPeriod) {
        // Maximum approvable = modifier * period (capped at MAX_AMOUNT)
        // Try the requested period first, then extend if needed
        for (int period = requestedPeriod; period <= MAX_PERIOD; period++) {
            int maxApprovable = Math.min(MAX_AMOUNT, modifier * period);

            if (maxApprovable < MIN_AMOUNT) continue;

            double creditScore = (double) modifier / maxApprovable * period;
            if (creditScore >= 1.0) {
                return new LoanResponse(true, maxApprovable, period);
            }

        }
        return new LoanResponse(false, null, null);
    }

}