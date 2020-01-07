import axios from 'axios';

const baseUrl = 'https://viacep.com.br/ws/';

function getUrl(cep) {
  return `${baseUrl}${cep}/json/`;
}

function postalCodeSearch(cep) {
  return axios.get(getUrl(cep));
}

export { postalCodeSearch };
