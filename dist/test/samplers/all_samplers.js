'use strict';

var _chai = require('chai');

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _constants = require('../../src/constants.js');

var constants = _interopRequireWildcard(_constants);

var _const_sampler = require('../../src/samplers/const_sampler.js');

var _const_sampler2 = _interopRequireDefault(_const_sampler);

var _probabilistic_sampler = require('../../src/samplers/probabilistic_sampler.js');

var _probabilistic_sampler2 = _interopRequireDefault(_probabilistic_sampler);

var _ratelimiting_sampler = require('../../src/samplers/ratelimiting_sampler.js');

var _ratelimiting_sampler2 = _interopRequireDefault(_ratelimiting_sampler);

var _guaranteed_throughput_sampler = require('../../src/samplers/guaranteed_throughput_sampler.js');

var _guaranteed_throughput_sampler2 = _interopRequireDefault(_guaranteed_throughput_sampler);

var _per_operation_sampler = require('../../src/samplers/per_operation_sampler.js');

var _per_operation_sampler2 = _interopRequireDefault(_per_operation_sampler);

var _remote_sampler = require('../../src/samplers/remote_sampler.js');

var _remote_sampler2 = _interopRequireDefault(_remote_sampler);

var _combinations = require('../lib/combinations.js');

var _combinations2 = _interopRequireDefault(_combinations);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

describe('All samplers', function () {
    describe('should support close()', function () {
        var samplers = (0, _combinations2.default)({
            useCallback: [true, false],
            sampler: [new _const_sampler2.default(true), new _const_sampler2.default(false), new _probabilistic_sampler2.default(0.5), new _ratelimiting_sampler2.default(2), new _guaranteed_throughput_sampler2.default(2, 0.5), new _per_operation_sampler2.default({
                defaultLowerBoundTracesPerSecond: 2,
                defaultSamplingProbability: 0.01,
                perOperationStrategies: []
            }, 200), new _remote_sampler2.default('some-service-name')]
        });

        samplers.forEach(function (o) {
            it(o.description, function () {
                if (o.useCallback) {
                    var closeCallback = _sinon2.default.spy();
                    o.sampler.close(closeCallback);
                    (0, _chai.assert)(closeCallback.calledOnce);
                } else {
                    o.sampler.close();
                }
            });
        });
    });

    describe('should return correct tags', function () {
        var samplers = [{ sampler: new _const_sampler2.default(true), 'type': constants.SAMPLER_TYPE_CONST, param: true, decision: true }, { sampler: new _const_sampler2.default(false), 'type': constants.SAMPLER_TYPE_CONST, param: false, decision: false }, { sampler: new _probabilistic_sampler2.default(1.0), 'type': constants.SAMPLER_TYPE_PROBABILISTIC, param: 1.0, decision: true }, { sampler: new _ratelimiting_sampler2.default(2), 'type': constants.SAMPLER_TYPE_RATE_LIMITING, param: 2, decision: true }, {
            sampler: new _remote_sampler2.default('some-caller-name', { sampler: new _probabilistic_sampler2.default(1.0) }),
            'type': constants.SAMPLER_TYPE_PROBABILISTIC,
            param: 1.0,
            decision: true
        }];

        samplers.forEach(function (samplerSetup) {
            var sampler = samplerSetup['sampler'];
            it(sampler.toString(), function () {
                var expectedTags = {};
                var expectedDecision = !!samplerSetup['decision'];
                var description = sampler.toString() + ', param=' + samplerSetup['param'];

                if (expectedDecision) {
                    expectedTags[constants.SAMPLER_TYPE_TAG_KEY] = samplerSetup['type'];
                    expectedTags[constants.SAMPLER_PARAM_TAG_KEY] = samplerSetup['param'];
                }
                var actualTags = {};
                var decision = sampler.isSampled('operation', actualTags);
                _chai.assert.equal(decision, expectedDecision, description);
                _chai.assert.deepEqual(actualTags, expectedTags, description);
            });
        });
    });
});

describe('ConstSampler', function () {
    var sampler = void 0;
    before(function () {
        sampler = new _const_sampler2.default(true);
    });

    it('decision reflects given parameter', function () {
        _chai.assert.isOk(sampler.decision);
    });

    it('does NOT equal another type of sampler', function () {
        var otherSampler = new _probabilistic_sampler2.default(0.5);
        var equals = sampler.equal(otherSampler);
        _chai.assert.isNotOk(equals);
    });

    it('does equal the same type of sampler', function () {
        var otherSampler = new _const_sampler2.default(true);
        var equals = sampler.equal(otherSampler);
        _chai.assert.isOk(equals);
    });
});

describe('ProbabilisticSampler', function () {
    it('throws error on out of range sampling rate', function () {
        (0, _chai.expect)(function () {
            new _probabilistic_sampler2.default(2.0);
        }).to.throw('The sampling rate must be less than 0.0 and greater than 1.0. Received 2');
    });

    it('calls is Sampled, and returns false', function () {
        var sampler = new _probabilistic_sampler2.default(0.0);
        var tags = {};
        _chai.assert.isNotOk(sampler.isSampled('operation', tags));
        _chai.assert.deepEqual(tags, {});
    });
});
//# sourceMappingURL=all_samplers.js.map