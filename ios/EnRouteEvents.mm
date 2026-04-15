#import "EnRouteEvents.h"
#import <objc/runtime.h>
#import <EnRouteApi/EnRouteApi.h>

@implementation EnRouteEvents
RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeEnRouteEventsSpecJSI>(params);
}

- (NSDictionary*) getConstants {
  return [self constantsToExport];
}

- (NSDictionary *)constantsToExport
{
    unsigned int count = 0;
    Class EnRouteEvents_class = NSClassFromString(@"GlyEnRouteEvents");
    Class EnRouteEvents_metaclass = object_getClass(EnRouteEvents_class);
    Method *classMethods = class_copyMethodList(EnRouteEvents_metaclass, &count);
    NSMutableDictionary *constants = [NSMutableDictionary dictionaryWithCapacity:count];
    for (int i = 0; i < count; i++) {
        SEL key = method_getName(classMethods[i]);
        
        NSMethodSignature *sig = [EnRouteEvents_class methodSignatureForSelector:key];
        if (!sig) continue;

        NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:sig];
        [invocation setSelector:key];
        [invocation setTarget:EnRouteEvents_class];
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
