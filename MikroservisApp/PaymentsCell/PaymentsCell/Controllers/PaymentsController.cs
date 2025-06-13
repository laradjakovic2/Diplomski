using Microsoft.AspNetCore.Mvc;
using PaymentsCell.Interfaces;
using PaymentsCell.Models;

namespace PaymentsCell.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaymentsController : ControllerBase
    {
        private IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public IActionResult GetCompetitionPayment([FromQuery] string userEmail, [FromQuery] int competitionId)
        {
            var payment = _paymentService.GetCompetitionPayment(userEmail, competitionId);
            return Ok(payment);
        }

        [HttpPut]
        public IActionResult CreateCompetitionPayment([FromBody] CreateCompetitionPayment request)
        {
            _paymentService.SaveCompetitionPayment(request);
            return Created();
        }
    }
}
