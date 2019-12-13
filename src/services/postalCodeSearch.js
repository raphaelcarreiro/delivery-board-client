import axios from 'axios';

const baseUrl = 'http://viacep.com.br/ws/';

function getUrl(cep) {
  return `${baseUrl}${cep}/json/`;
}

function postalCodeSearch(cep) {
  return axios.get(getUrl(cep));
}

export { postalCodeSearch };
