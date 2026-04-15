#import "EnRouteWrapper.h"
#import "ObjectEncoder.h"
#import <React/RCTLog.h>

@implementation EnRouteWrapper

static EnRouteWrapper *_instance = nil;
+ (EnRouteWrapper*)instance {
    @synchronized([EnRouteWrapper class]) {
        if (!_instance)
          _instance = [[self alloc] init];
        return _instance;
    }
    return nil;
}

- (void)init:(NativeGlympseEnrouteSpecBase*)eventEmitter {
  self.eventEmitter = eventEmitter;
  self.manager = Glympse::EnRoute::EnRouteFactory::createEnRouteManager();
  [GETHelpers subscribe:self onManager:self.manager];
  [GETHelpers subscribe:self onManager:self.manager->getTaskManager()];
}

- (void)eventsOccurred:(const Glympse::GSource&)source
              listener:(Glympse::int32)listener
                events:(Glympse::int32)events
                param1:(const Glympse::GCommonObj&)param1
                param2:(const Glympse::GCommonObj&)param2 {
  NSDictionary *param1Map = [ObjectEncoder encodeAny:param1];
  NSDictionary *param2Map = [ObjectEncoder encodeAny:param2];

  if (NULL != param1Map && NULL != param2Map) {
    [self.eventEmitter emitOnEnRouteEvent:@{@"listener": [NSNumber numberWithInt:listener],
                                                @"events": [NSNumber numberWithInt:events],
                                                @"obj1": param1Map,
                                                @"obj2": param2Map}];
  } else if (NULL != param1Map) {
    [self.eventEmitter emitOnEnRouteEvent:@{@"listener": [NSNumber numberWithInt:listener],
                                                @"events": [NSNumber numberWithInt:events],
                                                @"obj1": param1Map}];
  } else {
    [self.eventEmitter emitOnEnRouteEvent:@{@"listener": [NSNumber numberWithInt:listener],
                                                @"events": [NSNumber numberWithInt:events]}];
  }
}

@end
