#import "GlympseEnroute.h"
#import "EnRouteWrapper.h"
#import "ObjectEncoder.h"
#import <objc/runtime.h>

@implementation GlympseEnroute

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
  (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeGlympseEnrouteSpecJSI>(params);
}

- (dispatch_queue_t)methodQueue
{
  // This is rather important. Glympse expects all API methods to be called on the same thread
  return dispatch_get_main_queue();
}

- (void)initModule {
    [[EnRouteWrapper instance] init:self];
}

- (void)start {
  [EnRouteWrapper instance].manager->start();
}

- (void)stop {
  [EnRouteWrapper instance].manager->stop();
}

- (void)isStarted:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  resolve(@([EnRouteWrapper instance].manager->isStarted()));
}

- (void)setActive:(BOOL)active {
  [EnRouteWrapper instance].manager->setActive(active);
}

- (void)isLoginNeeded:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  resolve(@([EnRouteWrapper instance].manager->isLoginNeeded()));
}

- (void)setAuthenticationMode:(double)mode {
  [EnRouteWrapper instance].manager->setAuthenticationMode(mode);
}

- (void)loginWithCredentials:(NSString *)username
                    password:(NSString *)password
                     resolve:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject {
  
  bool result = [EnRouteWrapper instance].manager->loginWithCredentials(
    Glympse::CoreFactory::createString([username UTF8String]),
    Glympse::CoreFactory::createString([password UTF8String])
  );
  resolve([NSNumber numberWithBool:result]);
}

- (void)loginWithToken:(NSString *)token
            expires_in:(double)expires_in
               resolve:(RCTPromiseResolveBlock)resolve
                reject:(RCTPromiseRejectBlock)reject {
  bool result = [EnRouteWrapper instance].manager->loginWithToken(
    Glympse::CoreFactory::createString([token UTF8String]),
     expires_in
  );
  resolve([NSNumber numberWithBool:result]);
}

- (void)logout:(double)reason {
  [EnRouteWrapper instance].manager->logout(reason);
}

- (void)overrideLoggingLevel:(double)level {
  [EnRouteWrapper instance].manager->overrideLoggingLevels(level, level);
}

- (void)refresh {
  [EnRouteWrapper instance].manager->refresh();
}

- (void)registerDeviceToken:(NSString *)token {
  [EnRouteWrapper instance].manager->registerDeviceToken(Glympse::CoreFactory::createString("apple_background"), Glympse::CoreFactory::createString([token UTF8String]));
}

- (void)handleRemoteNotification:(NSString *)payload {
  [EnRouteWrapper instance].manager->handleRemoteNotification(Glympse::CoreFactory::createString([payload UTF8String]));
}

- (void)getOrganization:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
  resolve([ObjectEncoder encodeOrganization:([EnRouteWrapper instance].manager->getOrganization())]);
}
- (void)getSelfAgent:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  resolve([ObjectEncoder encodeAgent:([EnRouteWrapper instance].manager->getSelfAgent())]);
}

- (NSDictionary*) getConstants {
  return [self constantsToExport];
}

- (NSDictionary *)constantsToExport
{
  unsigned int count = 0;
  Class EnRouteConstants_class = NSClassFromString(@"GlyEnRouteConstants");
  Class EnRouteConstants_metaclass = object_getClass(EnRouteConstants_class);
  Method *classMethods = class_copyMethodList(EnRouteConstants_metaclass, &count);
  NSMutableDictionary *constants = [NSMutableDictionary dictionaryWithCapacity:count];
  for (int i = 0; i < count; i++) {
      SEL key = method_getName(classMethods[i]);
      
      NSMethodSignature *sig = [EnRouteConstants_class methodSignatureForSelector:key];
      if (!sig) continue;

      NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:sig];
      [invocation setSelector:key];
      [invocation setTarget:EnRouteConstants_class];
      [invocation invoke];
      
      const char *returnType = [sig methodReturnType];

      if (strcmp(returnType, @encode(int)) == 0) {
          int returnValue;
          [invocation getReturnValue:&returnValue];
          [constants setObject:@(returnValue) forKey:NSStringFromSelector(key)];
      }
      else if (strcmp(returnType, @encode(long long)) == 0) {
          long long returnValue;
          [invocation getReturnValue:&returnValue];
          [constants setObject:@(returnValue) forKey:NSStringFromSelector(key)];
      }
      else if (returnType[0] == '@') {
          void *tempReturnValue;
          [invocation getReturnValue:&tempReturnValue];
          id returnValue = (__bridge id)tempReturnValue;
          
          if (returnValue) {
              [constants setObject:returnValue forKey:NSStringFromSelector(key)];
          }
      }
  }
  free(classMethods);
  return constants;
}


@end
