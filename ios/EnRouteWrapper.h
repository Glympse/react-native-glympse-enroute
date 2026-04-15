#import <Foundation/Foundation.h>
#import <GlympseEnrouteSpec/GlympseEnrouteSpec.h>
#import <EnRouteApi/EnRouteApi.h>

@interface EnRouteWrapper : NSObject <GETListener>
@property NativeGlympseEnrouteSpecBase *eventEmitter;
@property Glympse::EnRoute::GEnRouteManager manager;

+ (EnRouteWrapper*)instance;
- (void)init:(NativeGlympseEnrouteSpecBase*)eventEmitter;

@end
