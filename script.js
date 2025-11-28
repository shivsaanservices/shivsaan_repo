document.addEventListener('DOMContentLoaded', function(){
  // Contact form submission
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', async function(e){
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : '';
      var message = document.getElementById('message').value.trim();
      var resultEl = document.getElementById('formResult');
      resultEl.textContent = 'Sending...';
      try{
        var resp = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({name:name,email:email,subject:subject,message:message})
        });
        var data = await resp.json();
        if(resp.ok){
          resultEl.textContent = 'Message sent — thank you!';
          contactForm.reset();
        } else {
          resultEl.textContent = data.error || 'Failed to send message';
        }
      } catch(err){
        console.error(err);
        resultEl.textContent = 'Network error. Try again later.';
      }
    });
  }

  // Currency toggle logic
  var inrBtn = document.getElementById('inrBtn');
  var usdBtn = document.getElementById('usdBtn');
  function updatePrices(mode){
    document.querySelectorAll('.price').forEach(function(el){
      var inr = el.getAttribute('data-inr');
      var usd = el.getAttribute('data-usd');
      if(mode === 'INR'){
        el.textContent = '₹ ' + inr.toString();
      } else {
        el.textContent = '$ ' + usd.toString();
      }
    });
  }
  if(inrBtn && usdBtn){
    inrBtn.addEventListener('click', function(){ inrBtn.classList.add('active'); usdBtn.classList.remove('active'); updatePrices('INR'); });
    usdBtn.addEventListener('click', function(){ usdBtn.classList.add('active'); inrBtn.classList.remove('active'); updatePrices('USD'); });
    // default to INR
    updatePrices('INR');
  }
});
