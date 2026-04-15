#import "TaskManager.h"
#import "EnRouteWrapper.h"
#import "ObjectEncoder.h"

@implementation TaskManager

RCT_EXPORT_MODULE()

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeTaskManagerSpecJSI>(params);
}

- (dispatch_queue_t)methodQueue
{
    // This is rather important. Glympse expects all API methods to be called on the same thread
    return dispatch_get_main_queue();
}

- (void)refresh {
  [EnRouteWrapper instance].manager->getTaskManager()->refresh();
}

- (void)getTasks:(RCTPromiseResolveBlock)resolve
          reject:(RCTPromiseRejectBlock)reject {
  NSMutableArray *result = [NSMutableArray array];
  Glympse::GArray<Glympse::EnRoute::GTask>::ptr tasks = [EnRouteWrapper instance].manager->getTaskManager()->getTasks();
  for (int i = 0; i < tasks->length(); i++) {
    Glympse::EnRoute::GTask task = tasks->at(i);
    [result addObject:[ObjectEncoder encodeTask:task encodeLocationArrays:false]];
  }
  resolve(result);
}

- (void)findTaskById:(double)taskId
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  resolve([ObjectEncoder encodeTask:task encodeLocationArrays:false]);
}

- (void)startTask:(double)taskId
          resolve:(RCTPromiseResolveBlock)resolve
           reject:(RCTPromiseRejectBlock)reject {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    bool result = [EnRouteWrapper instance].manager->getTaskManager()->startTask(task);
    resolve([NSNumber numberWithBool:result]);
  } else {
    resolve(nil);
  }
}

- (void)setTaskPhase:(double)taskId
               phase:(NSString *)phase
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    bool result = [EnRouteWrapper instance].manager->getTaskManager()->setTaskPhase(task, Glympse::CoreFactory::createString([phase UTF8String]));
    resolve([NSNumber numberWithBool:result]);
  } else {
    resolve(nil);
  }
}

- (void)completeTask:(double)taskId
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    Glympse::EnRoute::GOperation operation = task->getOperation();
    if ( NULL != operation ) {
      bool result = [EnRouteWrapper instance].manager->getTaskManager()->completeOperation(operation);
      resolve([NSNumber numberWithBool:result]);
    }
  } else {
    resolve(nil);
  }
}

- (void)setTravelMode:(double)taskId
                 mode:(NSString *)mode {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    [EnRouteWrapper instance].manager->getTaskManager()->setTravelModeForTask(task, Glympse::CoreFactory::createString([mode UTF8String]));
  }
}

- (void)getTravelMode:(double)taskId
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    Glympse::GString travelMode = [EnRouteWrapper instance].manager->getTaskManager()->getTravelModeForTask(task);
    NSString* mode = [NSString stringWithUTF8String:travelMode->getBytes()];
    resolve(mode);
  } else {
    resolve(nil);
  }
}

- (void)addOrUpdateMetadata:(double)taskId
                        key:(NSString *)key
                      value:(NSString *)value {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    Glympse::GPrimitive valuePrim = Glympse::CoreFactory::createPrimitive(Glympse::CoreFactory::createString([value UTF8String]));
    [EnRouteWrapper instance].manager->getTaskManager()->addOrUpdateMetadataItem(task,
                                                                                 Glympse::CoreFactory::createString([key UTF8String]),
                                                                                 valuePrim);
  }
}

- (void)getTicketWithFullLocationArray:(double)taskId
                             resolve:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject {
  Glympse::EnRoute::GTask task = [EnRouteWrapper instance].manager->getTaskManager()->findTaskById(taskId);
  if ( NULL != task ) {
    Glympse::EnRoute::GOperation operation = task->getOperation();
    if ( NULL != operation ) {
      Glympse::GTicket ticket = operation->getTicket();
      resolve([ObjectEncoder encodeTicket:ticket encodeLocationArrays:true]);
    }
  }
  else {
    resolve(nil);
  }
}

@end
