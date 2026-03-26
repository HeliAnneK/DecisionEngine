package ee.inbank.decisionengine.dto;

public record LoanResponse(
    boolean approved,
    Integer approvedAmount,
    Integer approvedPeriod
)
{}