(async () => {
  const { status, result } = await Fetch(`//panel.${DOMAIN}/api/services`)
  const div = document.getElementById('services-container')
  div.innerHTML = null;
  const template = []
  result?.data?.forEach(service => {
    template.push(`<div class="col-xl-4 col-sm-6">
      <div class="services-box p-4 bg-white mt-4">
        <div class="services-img float-start me-4">
          <img src="img/icons/${service.correlative}.icon.svg" alt="Logo de ${service.service}">
        </div>
        <h5>${service.service}</h5>
        <div class="overflow-hidden">
          <p class="text-muted">${service.description}</p>
          <a href="//${service.correlative}.${DOMAIN}" class="text-custom">Ver mas...</a>
        </div>
      </div>
    </div>`)
  });
  div.innerHTML = template.join('')
})()