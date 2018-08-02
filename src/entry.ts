import {StreamdataAuthStrategy} from './auth/streamdata-auth-strategy';
import {DefaultStreamDataProxyURL, DefaultStreamDataProxyVervion, LegacyStreamDataProxy} from './configuration/proxy.config';
import {StreamdataLegacyError} from './errors/streamdata-legacy-error';
import {StreamdataProxyError} from './errors/streamdata-proxy-error';
import {StreamdataLegacySubscriber} from './proxy/streamdata-legacy-subscriber';
import {StreamdataProxySubscriber} from './proxy/streamdata-proxy-subscriber';
import {StreamdataTopicSubscriber} from './proxy/streamdata-topic-subscriber';
import {StreamdataUrlSubscriber} from './proxy/streamdata-url-subscriber';
import {EventType} from './sse/streamdata-events';
import {StreamDataIo} from './streamdataio';
import {JsonHelper} from './utils/json-helper';
import {Listeners} from './utils/listeners';
import {Logger, LogLevel} from './utils/logger';

export {
  StreamDataIo,
  StreamdataProxySubscriber,
  StreamdataLegacySubscriber,
  StreamdataTopicSubscriber,
  StreamdataUrlSubscriber,
  EventType,
  StreamdataLegacyError,
  StreamdataProxyError,
  StreamdataAuthStrategy,
  DefaultStreamDataProxyURL,
  DefaultStreamDataProxyVervion,
  LegacyStreamDataProxy,
  JsonHelper,
  Listeners,
  Logger,
  LogLevel
};

export const createEventSource = StreamDataIo.createEventSource;
export const subscribeToUrl = StreamDataIo.subscribeToUrl;
export const subscribeToTopic = StreamDataIo.subscribeToTopic;

