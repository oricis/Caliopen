import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './lingui-react';

configure({ adapter: new Adapter() });
