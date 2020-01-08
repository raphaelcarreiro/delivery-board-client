import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({ name: 'Delivery Client' })
  .use(reactotronRedux())
  .connect();

module.exports = reactotron;
