import Dao from './Dao';
import Settings from '../../Settings';

const dao = new Dao(Settings.url + '/');

export default dao;