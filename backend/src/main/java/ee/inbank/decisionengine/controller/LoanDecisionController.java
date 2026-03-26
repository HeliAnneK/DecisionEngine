package ee.inbank.decisionengine.controller;

import ee.inbank.decisionengine.dto.LoanRequest;
import ee.inbank.decisionengine.dto.LoanResponse;
import ee.inbank.decisionengine.service.LoanDecisionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/loan")
@CrossOrigin(origins = "http://localhost:5173")

public class LoanDecisionController {
    private final LoanDecisionService service;

    public LoanDecisionController(LoanDecisionService service) {
        this.service = service;
    }

    @PostMapping("/decision")
    public ResponseEntity<LoanResponse> decide(@Valid @RequestBody LoanRequest request) {
        return ResponseEntity.ok(service.decide(request));
    }

}
