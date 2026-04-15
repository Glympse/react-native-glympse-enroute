#import "ObjectEncoder.h"

@implementation ObjectEncoder

+(NSDictionary*)encodeAny:(const Glympse::GCommonObj&)obj
{
  if (obj == NULL) {
    return NULL;
  } else if ( Glympse::Helpers::instanceOf<Glympse::EnRoute::GTask>(obj) ) {
    return [ObjectEncoder encodeTask:(Glympse::EnRoute::GTask)obj encodeLocationArrays: false];
  } else if ( Glympse::Helpers::instanceOf<Glympse::EnRoute::GOperation>(obj) ) {
    return [ObjectEncoder encodeOperation:(Glympse::EnRoute::GOperation)obj encodeLocationArrays: false];
  } else if ( Glympse::Helpers::instanceOf<Glympse::GTicket>(obj) ) {
    return [ObjectEncoder encodeTicket:(Glympse::GTicket)obj encodeLocationArrays: false];
  } else if ( Glympse::Helpers::instanceOf<Glympse::GPlace>(obj) ) {
    return [ObjectEncoder encodePlace:(Glympse::GPlace)obj];
  } else if ( Glympse::Helpers::instanceOf<Glympse::GTrack>(obj) ) {
    return [ObjectEncoder encodeTrack:(Glympse::GTrack)obj encodeLocationArrays: false];
  } else if ( Glympse::Helpers::instanceOf<Glympse::GLatLng>(obj) ) {
    return [ObjectEncoder encodeLatLng:(Glympse::GLatLng)obj];
  } else if ( Glympse::Helpers::instanceOf<Glympse::EnRoute::GOrganization>(obj) ) {
    return [ObjectEncoder encodeOrganization:(Glympse::EnRoute::GOrganization)obj];
  } else if ( Glympse::Helpers::instanceOf<Glympse::EnRoute::GOrgConfig>(obj) ) {
    return [ObjectEncoder encodeOrgConfig:(Glympse::EnRoute::GOrgConfig)obj];
  } else if ( Glympse::Helpers::instanceOf<Glympse::EnRoute::GAgent>(obj) ) {
    return [ObjectEncoder encodeAgent:(Glympse::EnRoute::GAgent)obj];
  } else if ( Glympse::Helpers::instanceOf<Glympse::String>(obj) ) {
    return @{@"value": [NSString stringWithGString:(Glympse::GString)obj]};
  } else if ( Glympse::Helpers::instanceOf<Glympse::Long>(obj) ) {
    return @{@"value": [NSNumber numberWithLong:((Glympse::GLong)obj)->longValue()]};
  }
  
  return NULL;
}

+(NSDictionary*)encodeTask:(Glympse::EnRoute::GTask)task encodeLocationArrays:(BOOL)encodeLocationArrays
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == task ) {
    return result;
  }
  [result setObject:[NSNumber numberWithInt:task->getState()] forKey:@"state"];
  [result setObject:[NSNumber numberWithLong:task->getId()] forKey:@"id"];
  [result setObject:[NSString stringWithGString:task->getDescription()] forKey:@"description"];
  [result setObject:[NSNumber numberWithLong:task->getAgentId()] forKey:@"agentId"];
  [result setObject:[NSNumber numberWithLong:task->getDueTime()] forKey:@"dueTime"];
  [result setObject:[NSNumber numberWithLong:task->getArrivedTime()] forKey:@"arrivedTime"];
  [result setObject:[NSNumber numberWithLong:task->getCompletedTime()] forKey:@"completedTime"];
  [result setObject:[NSString stringWithGString:task->getPhase()] forKey:@"phase"];
  [result setObject:[NSString stringWithGString:task->getForeignId()] forKey:@"foreignId"];
  [result setObject:[NSString stringWithGString:task->getChatRoomId()] forKey:@"chatRoomId"];
  [result setObject:[ObjectEncoder encodeOperation:task->getOperation() encodeLocationArrays:encodeLocationArrays] forKey:@"operation"];
  [result setObject:[ObjectEncoder encodeMetadata:task->getMetadata()] forKey:@"metadata"];
  return result;
}

+(NSDictionary*)encodeOperation:(Glympse::EnRoute::GOperation)operation encodeLocationArrays:(BOOL)encodeLocationArrays
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == operation ) {
    return result;
  }
  [result setObject:[NSNumber numberWithInt:operation->getState()] forKey:@"state"];
  [result setObject:[NSNumber numberWithLong:operation->getId()] forKey:@"id"];
  [result setObject:[NSNumber numberWithLong:operation->getStartTime()] forKey:@"startTime"];
  [result setObject:[NSString stringWithGString:operation->getTicketId()] forKey:@"ticketId"];
  [result setObject:[ObjectEncoder encodeTicket:operation->getTicket() encodeLocationArrays:encodeLocationArrays] forKey:@"ticket"];
  return result;
}

+(NSDictionary*)encodeTicket:(Glympse::GTicket)ticket encodeLocationArrays:(BOOL)encodeLocationArrays
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == ticket ) {
    return result;
  }
  [result setObject:[NSString stringWithGString:ticket->getId()] forKey:@"id"];
  if ( NULL != ticket->getVisibility() ) {
    [result setObject:[NSString stringWithGString:ticket->getVisibility()->getString()] forKey:@"visibility"];
  }
  [result setObject:[NSNumber numberWithBool:ticket->isCompleted()] forKey:@"isCompleted"];
  [result setObject:[ObjectEncoder encodePlace:ticket->getDestination()] forKey:@"destination"];
  [result setObject:[ObjectEncoder encodeTrack:ticket->getTrack() encodeLocationArrays:encodeLocationArrays] forKey:@"track"];
  [result setObject:[ObjectEncoder encodeTrack:ticket->getRoute() encodeLocationArrays:encodeLocationArrays] forKey:@"route"];
  [result setObject:[NSNumber numberWithLong:ticket->getEta()] forKey:@"eta"];
  if ( NULL != ticket->getTravelMode() ) {
    [result setObject:[NSNumber numberWithInt:ticket->getTravelMode()->getMode()] forKey:@"travelMode"];
  }
  return result;
}

+(NSDictionary*)encodePlace:(Glympse::GPlace)place
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == place ) {
    return result;
  }
  [result setObject:[NSString stringWithGString:place->getName()] forKey:@"name"];
  [result setObject:[NSNumber numberWithDouble:place->getLatitude()] forKey:@"latitude"];
  [result setObject:[NSNumber numberWithDouble:place->getLongitude()] forKey:@"longitude"];
  return result;
}

+(NSDictionary*)encodeTrack:(Glympse::GTrack)track encodeLocationArrays:(BOOL)encodeLocationArrays
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == track ) {
    return result;
  }
  [result setObject:[NSNumber numberWithInt:track->length()] forKey:@"length"];
  if (encodeLocationArrays) {
    [result setObject:[ObjectEncoder encodeLocationList:track->getLocations()] forKey:@"locations"];
  } else {
    Glympse::GList<Glympse::GLocation>::ptr locations = track->getLocations();
    if (locations != NULL && locations->length() > 0) {
      Glympse::GLocation lastLocation = locations->getLast();
      [result setObject:@[[ObjectEncoder encodeLatLng:(Glympse::GLatLng)lastLocation]] forKey:@"locations"];
    } else {
      [result setObject:@[] forKey:@"locations"];
    }
  }
  [result setObject:[NSNumber numberWithLong:track->getDistance()] forKey:@"distance"];
  return result;
}

+(NSDictionary*)encodeLatLng:(Glympse::GLatLng)latLng
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == latLng ) {
    return result;
  }
  [result setObject:[NSNumber numberWithDouble:latLng->getLatitude()] forKey:@"latitude"];
  [result setObject:[NSNumber numberWithDouble:latLng->getLongitude()] forKey:@"longitude"];
  return result;
}

+(NSDictionary*)encodeOrganization:(Glympse::EnRoute::GOrganization)organization
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == organization ) {
    return result;
  }
  [result setObject:[NSNumber numberWithLong:organization->getId()] forKey:@"id"];
  [result setObject:[NSNumber numberWithLong:organization->getReferrerOrgId()] forKey:@"referrerOrgId"];
  [result setObject:[NSString stringWithGString:organization->getName()] forKey:@"name"];
  [result setObject:[NSString stringWithGString:organization->getAdminEmail()] forKey:@"adminEmail"];
  [result setObject:[ObjectEncoder encodeOrgConfig:organization->getConfig()] forKey:@"config"];
  return result;
}

+(NSDictionary*)encodeOrgConfig:(Glympse::EnRoute::GOrgConfig)orgConfig
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == orgConfig ) {
    return result;
  }
  [result setObject:[NSString stringWithGString:orgConfig->getBrandingId()] forKey:@"brandingId"];
  [result setObject:[ObjectEncoder encodeStringArray:orgConfig->getCompletionPhases()] forKey:@"completionPhases"];
  [result setObject:[ObjectEncoder encodeStringArray:orgConfig->getPickerDisabledTaskPhases()] forKey:@"pickerDisabledTaskPhases"];
  [result setObject:[NSNumber numberWithBool:orgConfig->isSessionModeEnabled()] forKey:@"isSessionMode"];
  [result setObject:[NSNumber numberWithBool:orgConfig->isPickupEnabled()] forKey:@"isPickupMode"];
  [result setObject:[NSString stringWithGString:orgConfig->getInitialPhase()] forKey:@"initialPhase"];
  [result setObject:[NSString stringWithGString:orgConfig->getArrivalPhase()] forKey:@"arrivalPhase"];
  [result setObject:[NSString stringWithGString:orgConfig->getFinalPhase()] forKey:@"finalPhase"];
  [result setObject:[NSString stringWithGString:orgConfig->getInitialTrackingPhase()] forKey:@"initialTrackingPhase"];
  [result setObject:[NSNumber numberWithBool:orgConfig->areShiftsEnabled()] forKey:@"areShiftsEnabled"];
  [result setObject:[NSString stringWithGString:orgConfig->getDefaultTravelMode()] forKey:@"defaultTravelMode"];
  [result setObject:[NSNumber numberWithBool:orgConfig->isSignatureUploadEnabled()] forKey:@"isSignatureUploadEnabled"];
  [result setObject:[NSNumber numberWithBool:orgConfig->isPhotoUploadEnabled()] forKey:@"isPhotoUploadEnabled"];
  return result;
}

+(NSDictionary*)encodeAgent:(Glympse::EnRoute::GAgent)agent
{
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if ( NULL == agent ) {
    return result;
  }
  [result setObject:[NSNumber numberWithLong:agent->getId()] forKey:@"id"];
  [result setObject:[ObjectEncoder encodeStringArray:agent->getRoles()] forKey:@"roles"];
  [result setObject:[NSString stringWithGString:agent->getName()] forKey:@"name"];
  [result setObject:[NSString stringWithGString:agent->getDisplayName()] forKey:@"displayName"];
  [result setObject:[NSString stringWithGString:agent->getEmail()] forKey:@"email"];
  [result setObject:[NSString stringWithGString:agent->getGlympseAvatarUrl()] forKey:@"avatarUrl"];
  return result;
}

+(NSArray*)encodeMetadata:(Glympse::GArray<Glympse::GPrimitive>::ptr)metadata
{
  NSMutableArray *result = [NSMutableArray array];
  if ( NULL == metadata ) {
    return result;
  }
  
  Glympse::GString nameKey = Glympse::CoreFactory::createString("n");
  Glympse::GString valueKey = Glympse::CoreFactory::createString("v");
  for (int i = 0; i < metadata->length(); i++) {
    Glympse::GPrimitive item = metadata->at(i);
    Glympse::GPrimitive name = item->get(nameKey);
    Glympse::GPrimitive value = item->get(valueKey);
    
    NSMutableDictionary *map = [NSMutableDictionary dictionary];
    [map setObject:[NSString stringWithGString:name->getString()] forKey:@"name"];
    if ( value->type() == Glympse::CC::PRIMITIVE_TYPE_DOUBLE ) {
      [map setObject:[NSNumber numberWithDouble:value->getDouble()] forKey:@"value"];
    } else if ( value->type() == Glympse::CC::PRIMITIVE_TYPE_LONG ) {
      [map setObject:[NSNumber numberWithLong:value->getLong()] forKey:@"value"];
    } else if ( value->type() == Glympse::CC::PRIMITIVE_TYPE_BOOLEAN ) {
      [map setObject:[NSNumber numberWithBool:value->getBool()] forKey:@"value"];
    } else if ( value->type() == Glympse::CC::PRIMITIVE_TYPE_STRING ) {
      [map setObject:[NSString stringWithGString:value->getString()] forKey:@"value"];
    } else {
      continue;
    }

    [result addObject:map];
  }
  return result;
}

+(NSArray*)encodeLocationList:(Glympse::GList<Glympse::GLocation>::ptr)locations
{
  NSMutableArray *result = [NSMutableArray array];
  if ( NULL == locations ) {
    return result;
  }
  
  for ( Glympse::GLocation location : locations ) {
    [result addObject:[ObjectEncoder encodeLatLng:(Glympse::GLatLng)location]];
  }
  
  return result;
}

+(NSArray*)encodeStringArray:(Glympse::GArray<Glympse::GString>::ptr)strings
{
  NSMutableArray *result = [NSMutableArray array];
  if ( NULL == strings ) {
    return result;
  }

  for (int i = 0; i < strings->length(); i++) {
    Glympse::GString str = strings->at(i);
    [result addObject:[NSString stringWithGString:str]];
  }
  
  return result;
}

@end

@implementation NSString (glympse)

+ (NSString *)stringWithGString:(const Glympse::GString &)gString
{
    if(gString == NULL) {
        return @"";
    }
    
    const char * str = gString->toCharArray();
    if(str) {
        return [NSString stringWithUTF8String:str];
    } else {
        return @"";
    }
}

@end
