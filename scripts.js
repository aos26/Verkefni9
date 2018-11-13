// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */

const program = (() => {
  let domains;

  function loading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.setAttribute('class', 'loading');

    const loadingImg = document.createElement('img');
    loadingImg.src = 'loading.gif';

    const loadingText = document.createTextNode('Leita að léni...');

    loadingDiv.appendChild(loadingImg);
    loadingDiv.appendChild(loadingText);
    domains.appendChild(loadingDiv);
  }

  function displayError(error) {
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(document.createTextNode(error));
  }

  function newEl(dl, item, value) {
    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode(item));
    dl.appendChild(domainElement);

    const domainValueElement = document.createElement('dd');
    domainValueElement.appendChild(document.createTextNode(value));
    dl.appendChild(domainValueElement);
  }

  function displayDomain(domainsDisp) {
    if (domainsDisp.length === 0) {
      displayError('Lén ekki til');
      return;
    }
    const [{
      domain,
      registered,
      lastChange,
      expires,
      registrantname,
      email,
      address,
      country,
    }] = domainsDisp;
    const dl = document.createElement('dl');

    newEl(dl, 'Lén', domain);
    const registeredISO = new Date(registered).toISOString().split('T')[0];
    newEl(dl, 'Skráð', registeredISO);
    const lastChangeISO = new Date(lastChange).toISOString().split('T')[0];
    newEl(dl, 'Seinast breytt', lastChangeISO);
    const expiresISO = new Date(expires).toISOString().split('T')[0];
    newEl(dl, 'Rennur út', expiresISO);


    if (registrantname !== '') {
      newEl(dl, 'Skráningaraðili', registrantname);
    }
    if (email !== '') {
      newEl(dl, 'Netfang', email);
    }
    if (address !== '') {
      newEl(dl, 'Heimilisfang', address);
    }
    if (country !== '') {
      newEl(dl, 'Land', country);
    }
    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dl);
  }

  function fetchData(URL) {
    fetch(`${API_URL}${URL}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Villa kom upp.');
      })
      .then((data) => {
        displayDomain(data.results);
        domains.removeChild(domains.lastChild);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn.');
        console.error(error);
        domains.removeChild(domains.lastChild);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    loading();
    if (input.value.trim() === '') {
      displayError('Lén verður að vera strengur!');
      domains.removeChild(domains.lastChild);
    } else {
      fetchData(input.value);
    }
  }


  function init(_domains) {
    domains = _domains;
    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
