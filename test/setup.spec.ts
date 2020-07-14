import 'reflect-metadata';
import { restore } from 'sinon';
import sinonChai = require('sinon-chai');
import { use } from 'chai';
import { callsLike } from 'sinon-chai-calls-assertion';
use(sinonChai);
use(callsLike);

beforeEach(() => {
  restore();
});
