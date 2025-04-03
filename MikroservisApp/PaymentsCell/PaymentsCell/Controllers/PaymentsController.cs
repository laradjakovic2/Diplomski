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

        [HttpPut("competiton-payment")]
        public IActionResult CreateCompetitionPayment([FromBody] CreateCompetitionPayment request)
        {
            _paymentService.SaveCompetitionPayment(request);
            return Created();
        }
    }
}
