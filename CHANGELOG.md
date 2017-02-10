sh --registry=https://registry.npmjs.org
Changes by Version
==================

3.3.0 (Unreleased)
------------------

- Make Configuration accept MetricsFactory, not Metrics


3.2.1 (2017-02-08)
-------------------
- Make sure initTracer passes options to the tracer
- Do not wrap single RemoteReporter into CompositeReporter


3.2.0 (2017-02-04)
-------------------
- Remove the following dependencies
   -    `"deep-equal": "^1.0.1",`
   -    `"long": "^3.2.0",`
   -    `"js-yaml": "^3.6.1",`
   -    `"jsonschema": "^1.1.0",`
- Move `TestUtil.thriftSpansEqual` and `Util.combinations` functions under `tests/lib`
- Remove most methods from TestUtils because the same checks can be done via public API
- Remove `hasLogs` method that was not particularly useful in practice because it compared the timestamp
- Accept external timestamps in milliseconds since epoch (#94)
- Expose TChannelBridge.inject method (#93)


3.1.0 (2017-02-02)
-------------------
- Added support for end to end crossdock integration tests.
- Fixed bug where "peer.ipv4" tag was not being saved.
- Fixed bug where tracer tags were being reported twice.
- Updated sampler config to allow extra customization.

3.0.0 (2017-01-20)
-------------------
- Added re-sampling after setOperationName is called.  This supports
  adaptive sampling in the cases where a span is given an operation name
  after it has been created.

1.3.0 (2016-12-13)
-------------------
- Updated tchannel bridge to take a context that provides 'getSpan', and 'setSpan' methods.
- Added support for adaptive sampling.

1.2.0 (2016-11-15)
-------------------

- Tchannel bridge for handlers, and encoded channel requests.
- Crossdock tchannel testing.
- Added tests for reporters, samplers, and utils.
- TestUtils doesn't use lodash anymore.
- Opentracing now exposed through jaeger-client
- Fixed bugs involving headers that don't contain any tracer state.

1.1.0 (2016-11-07)
-------------------

- Exposed opentracing module from jaeger.
- Removed 'jaeger' object wrapper from config object.
