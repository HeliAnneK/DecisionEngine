package ee.inbank.decisionengine.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record LoanRequest(
        @NotBlank String personalCode,
        @Min(2000)@Max(10000) int loanAmount,
        @Min(12) @Max(60) int loanPeriod
) {}